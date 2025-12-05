"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { IPokemon } from "@/app/api/pokemons/route";
import { getCollectionCardIds, addCardToCollection } from "@/services/collectionService";
import { isSupabaseConfigured } from "@/lib/supabase";

interface CollectionContextType {
  collectedCards: Set<string>; // Set of card IDs
  addCard: (card: IPokemon, packId?: string, obtainedFrom?: string) => Promise<void>;
  hasCard: (cardId: string) => boolean;
  getCollectedCards: () => IPokemon[];
  clearCollection: () => void;
  totalCollected: number;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected } = useWallet();
  const [collectedCards, setCollectedCards] = useState<Set<string>>(new Set());

  // Load collection from Supabase when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      const loadCollection = async () => {
        try {
          const walletAddress = publicKey.toString();
          
          // Load from Supabase if configured
          if (isSupabaseConfigured) {
            try {
              console.log(`🔄 Loading collection for wallet: ${walletAddress}`);
              const supabaseIds = await getCollectionCardIds(walletAddress);
              console.log(`✅ Collection loaded: ${supabaseIds.size} cards`);
              setCollectedCards(new Set(supabaseIds));
            } catch (error) {
              console.error("Error loading collection from Supabase:", error);
              setCollectedCards(new Set());
            }
          } else {
            // If Supabase not configured, start with empty collection
            setCollectedCards(new Set());
          }
        } catch (error) {
          console.error("Error loading collection:", error);
          setCollectedCards(new Set());
        }
      };
      
      loadCollection();
    } else {
      // Clear collection when wallet disconnects
      setCollectedCards(new Set());
    }
  }, [connected, publicKey]);

  const addCard = useCallback(async (card: IPokemon, packId?: string, obtainedFrom: string = "pack_opening") => {
    if (!connected || !publicKey) {
      console.warn("Cannot add card: wallet not connected");
      return;
    }

    const walletAddress = publicKey.toString();
    
    // Update state immediately (optimistic update)
    setCollectedCards((prev) => {
      const newSet = new Set(prev);
      newSet.add(card.id);
      return newSet;
    });
    
    // Save to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await addCardToCollection({
          walletAddress,
          card,
          packId,
          obtainedFrom,
        });
      } catch (error) {
        console.error("Error saving card to Supabase:", error);
        // Revert optimistic update on error
        setCollectedCards((prev) => {
          const newSet = new Set(prev);
          newSet.delete(card.id);
          return newSet;
        });
      }
    }
  }, [connected, publicKey]);

  const hasCard = useCallback((cardId: string) => {
    return collectedCards.has(cardId);
  }, [collectedCards]);

  const getCollectedCards = useCallback(() => {
    // This would need to fetch full card data from the API
    // For now, we'll return an empty array and handle it in components
    return [];
  }, []);

  const clearCollection = useCallback(() => {
    if (connected && publicKey) {
      // Clear collection state
      // Note: This doesn't delete from Supabase - you may want to add a delete function
      setCollectedCards(new Set());
    }
  }, [connected, publicKey]);

  const value: CollectionContextType = {
    collectedCards,
    addCard,
    hasCard,
    getCollectedCards,
    clearCollection,
    totalCollected: collectedCards.size,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}


