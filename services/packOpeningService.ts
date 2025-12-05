"use client";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";
import type { IPokemon } from "@/app/api/pokemons/route";

type PackOpening = Database["public"]["Tables"]["pack_openings"]["Row"];
type PackOpeningInsert = Database["public"]["Tables"]["pack_openings"]["Insert"];

export interface SavePackOpeningParams {
  walletAddress: string;
  transactionId?: string | null;
  packId: string;
  packName: string;
  card: IPokemon;
  metadata?: Record<string, any>;
}

export interface GetPackOpeningsParams {
  walletAddress: string;
  packId?: string;
  limit?: number;
}

/**
 * Save pack opening to Supabase
 */
export async function savePackOpening({
  walletAddress,
  transactionId,
  packId,
  packName,
  card,
  metadata,
}: SavePackOpeningParams): Promise<PackOpening | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot save pack opening.");
    return null;
  }

  try {
    // Use RPC function to insert pack opening (bypasses RLS)
    const { data, error } = await supabase.rpc("insert_pack_opening", {
      p_wallet_address: walletAddress,
      p_pack_id: packId,
      p_pack_name: packName,
      p_card_id: card.id,
      p_card_name: card.name,
      p_card_rarity: card.rarity || null,
      p_card_image: card.image || null,
      p_metadata: metadata || null,
      p_transaction_id: transactionId || null,
    } as any);

    if (error) {
      console.error("Error inserting pack opening:", error);
      throw error;
    }

    // RPC returns array, get first item
    const result = data as PackOpening[] | null;
    if (result && Array.isArray(result) && result.length > 0) {
      return result[0] as PackOpening;
    }
    return null;
  } catch (error) {
    console.error("Error saving pack opening to Supabase:", error);
    return null;
  }
}

/**
 * Get pack openings for a wallet
 */
export async function getPackOpenings({
  walletAddress,
  packId,
  limit = 100,
}: GetPackOpeningsParams): Promise<PackOpening[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot get pack openings.");
    return [];
  }

  try {
    // Use RPC function to get pack openings (bypasses RLS)
    const { data, error } = await supabase.rpc("get_pack_openings", {
      p_wallet_address: walletAddress,
      p_pack_id: packId || null,
      p_limit: limit,
    } as any);

    if (error) {
      console.error("Error getting pack openings:", error);
      throw error;
    }

    return (data || []) as PackOpening[];
  } catch (error) {
    console.error("Error getting pack openings from Supabase:", error);
    return [];
  }
}

/**
 * Get pack opening history grouped by pack
 */
export async function getPackOpeningHistory(
  walletAddress: string
): Promise<Record<string, PackOpening[]>> {
  const openings = await getPackOpenings({ walletAddress, limit: 1000 });

  // Group by pack_id
  const grouped: Record<string, PackOpening[]> = {};
  for (const opening of openings) {
    if (!grouped[opening.pack_id]) {
      grouped[opening.pack_id] = [];
    }
    grouped[opening.pack_id].push(opening);
  }

  return grouped;
}

