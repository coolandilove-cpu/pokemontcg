"use client";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";
import type { IPokemon } from "@/app/api/pokemons/route";
import { getPackOpenings } from "@/services/packOpeningService";

type Collection = Database["public"]["Tables"]["collections"]["Row"];
type CollectionInsert = Database["public"]["Tables"]["collections"]["Insert"];
type CollectionUpdate = Database["public"]["Tables"]["collections"]["Update"];

export interface AddCardToCollectionParams {
  walletAddress: string;
  card: IPokemon;
  packId?: string;
  obtainedFrom?: string;
}

export interface GetCollectionParams {
  walletAddress: string;
  packId?: string;
}

export interface SyncCollectionParams {
  walletAddress: string;
  cardIds: string[];
}

/**
 * Add a card to collection in Supabase
 */
export async function addCardToCollection({
  walletAddress,
  card,
  packId,
  obtainedFrom = "pack_opening",
}: AddCardToCollectionParams): Promise<Collection | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot add card to collection.");
    return null;
  }

  try {
    // Use RPC function to upsert collection card (bypasses RLS)
    const { data, error } = await supabase.rpc("upsert_collection_card", {
      p_wallet_address: walletAddress,
      p_card_id: card.id,
      p_card_name: card.name,
      p_pack_id: packId || null,
      p_obtained_from: obtainedFrom,
    } as any);

    if (error) {
      console.error("Error upserting collection card:", error);
      throw error;
    }

    // RPC returns array, get first item
    const result = data as Collection[] | null;
    if (result && Array.isArray(result) && result.length > 0) {
      return result[0] as Collection;
    }
    return null;
  } catch (error) {
    console.error("Error adding card to collection in Supabase:", error);
    return null;
  }
}

/**
 * Get collection for a wallet
 */
export async function getCollection({
  walletAddress,
  packId,
}: GetCollectionParams): Promise<Collection[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot get collection.");
    return [];
  }

  try {
    // Use RPC function to get collection (bypasses RLS)
    const { data, error } = await supabase.rpc("get_collection", {
      p_wallet_address: walletAddress,
      p_pack_id: packId || null,
    } as any);

    if (error) {
      console.error("Error getting collection:", error);
      throw error;
    }

    return (data || []) as Collection[];
  } catch (error) {
    console.error("Error getting collection from Supabase:", error);
    return [];
  }
}

/**
 * Sync collection from pack_openings table
 * This ensures cards opened from packs are added to collections table
 */
export async function syncCollectionFromPackOpenings(
  walletAddress: string
): Promise<number> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot sync collection.");
    return 0;
  }

  try {
    console.log(`🔄 Starting sync for wallet: ${walletAddress}`);
    
    // Get all pack openings for this wallet
    const packOpenings = await getPackOpenings({ walletAddress, limit: 1000 });
    console.log(`📦 Found ${packOpenings.length} pack openings`);
    
    if (packOpenings.length === 0) {
      console.log("ℹ️ No pack openings to sync");
      return 0; // No pack openings to sync
    }

    // Get current collection
    const currentCollection = await getCollection({ walletAddress });
    const currentCardIds = new Set(currentCollection.map((item) => item.card_id));
    console.log(`📚 Current collection has ${currentCardIds.size} cards`);

    // Find cards in pack_openings that are not in collections
    const cardsToSync = packOpenings.filter(
      (opening) => !currentCardIds.has(opening.card_id)
    );
    console.log(`🔄 Found ${cardsToSync.length} cards to sync`);

    if (cardsToSync.length === 0) {
      console.log("✅ All cards already synced");
      return 0; // All cards already synced
    }

    // Group by card_id to handle duplicates (use latest pack opening data)
    const uniqueCards = new Map<string, typeof packOpenings[0]>();
    for (const opening of cardsToSync) {
      // Keep the most recent opening for each card
      if (!uniqueCards.has(opening.card_id) || 
          new Date(opening.opened_at) > new Date(uniqueCards.get(opening.card_id)!.opened_at)) {
        uniqueCards.set(opening.card_id, opening);
      }
    }

    // Sync each card to collections
    let syncedCount = 0;
    for (const opening of uniqueCards.values()) {
      try {
        // Use RPC function to upsert collection card
        const { data, error } = await supabase.rpc("upsert_collection_card", {
          p_wallet_address: walletAddress,
          p_card_id: opening.card_id,
          p_card_name: opening.card_name,
          p_pack_id: opening.pack_id || null,
          p_obtained_from: "pack_opening",
        } as any);

        if (error) {
          console.error(`Error syncing card ${opening.card_id} to collection:`, error);
          continue;
        }

        syncedCount++;
      } catch (error) {
        console.error(`Error syncing card ${opening.card_id} to collection:`, error);
      }
    }

    if (syncedCount > 0) {
      console.log(`✅ Successfully synced ${syncedCount} cards from pack_openings to collections`);
    } else {
      console.warn(`⚠️ No cards were synced (${cardsToSync.length} cards attempted)`);
    }

    return syncedCount;
  } catch (error) {
    console.error("Error syncing collection from pack_openings:", error);
    return 0;
  }
}

/**
 * Get collection as Set of card IDs (for compatibility with existing code)
 * Also syncs data from pack_openings if needed
 */
export async function getCollectionCardIds(
  walletAddress: string
): Promise<Set<string>> {
  // First, sync any missing cards from pack_openings
  const syncedCount = await syncCollectionFromPackOpenings(walletAddress);
  
  // Then get collection (after sync)
  const collection = await getCollection({ walletAddress });
  const cardIds = new Set(collection.map((item) => item.card_id));
  
  console.log(`📊 Collection loaded: ${cardIds.size} cards total (synced ${syncedCount} new cards)`);
  
  return cardIds;
}

/**
 * Sync collection from array of card IDs (e.g., from localStorage)
 * This will merge Supabase collection with provided card IDs
 */
export async function syncCollection({
  walletAddress,
  cardIds,
}: SyncCollectionParams): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot sync collection.");
    return;
  }

  try {
    // Get current collection from Supabase
    const currentCollection = await getCollection({ walletAddress });
    const currentCardIds = new Set(currentCollection.map((item) => item.card_id));

    // Get cards that need to be added (in cardIds but not in currentCollection)
    const cardsToAdd = cardIds.filter((id) => !currentCardIds.has(id));

    // Note: We can't add cards without full card data, so this function
    // is mainly for syncing structure. Full sync should be done with addCardToCollection
    // which includes full card data.

    console.log(`Collection sync: ${cardsToAdd.length} new cards to add (requires card data)`);
  } catch (error) {
    console.error("Error syncing collection:", error);
  }
}

/**
 * Remove a card from collection
 */
export async function removeCardFromCollection(
  walletAddress: string,
  cardId: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot remove card from collection.");
    return false;
  }

  try {
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("wallet_address", walletAddress)
      .eq("card_id", cardId);

    if (error) {
      console.error("Error removing card from collection:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error removing card from collection in Supabase:", error);
    return false;
  }
}

