"use client";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Wallet = Database["public"]["Tables"]["wallets"]["Row"];
type WalletInsert = Database["public"]["Tables"]["wallets"]["Insert"];
type WalletUpdate = Database["public"]["Tables"]["wallets"]["Update"];

export interface SaveWalletParams {
  walletAddress: string;
  walletName?: string;
  network?: string;
}

export interface GetWalletParams {
  walletAddress: string;
}

/**
 * Save or update wallet information in Supabase
 */
export async function saveWallet({
  walletAddress,
  walletName,
  network = "mainnet-beta",
}: SaveWalletParams): Promise<Wallet | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot save wallet.");
    return null;
  }

  try {
    // Use RPC function to upsert wallet (bypasses RLS)
    const { data, error } = await supabase.rpc("upsert_wallet", {
      p_wallet_address: walletAddress,
      p_wallet_name: walletName || null,
      p_network: network,
    } as any);

    if (error) {
      console.error("Error upserting wallet:", error);
      throw error;
    }

    // RPC returns array, get first item
    const result = data as Wallet[] | null;
    if (result && Array.isArray(result) && result.length > 0) {
      return result[0] as Wallet;
    }
    return null;
  } catch (error) {
    console.error("Error saving wallet to Supabase:", error);
    return null;
  }
}

/**
 * Get wallet information from Supabase
 */
export async function getWallet({
  walletAddress,
}: GetWalletParams): Promise<Wallet | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot get wallet.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No wallet found, return null
        return null;
      }
      console.error("Error getting wallet:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting wallet from Supabase:", error);
    return null;
  }
}

/**
 * Get wallet ID from wallet address (used for foreign keys)
 */
export async function getWalletId(walletAddress: string): Promise<string | null> {
  const wallet = await getWallet({ walletAddress });
  return wallet?.id || null;
}

