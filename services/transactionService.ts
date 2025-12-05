"use client";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
type TransactionUpdate = Database["public"]["Tables"]["transactions"]["Update"];

export interface SaveTransactionParams {
  walletAddress: string;
  transactionSignature: string;
  packId: string;
  packName: string;
  amountSol: number;
  amountLamports: number;
  merchantAddress: string;
  network?: string;
  status?: "pending" | "confirmed" | "failed";
  metadata?: Record<string, any>;
}

export interface UpdateTransactionStatusParams {
  transactionSignature: string;
  status: "pending" | "confirmed" | "failed";
  confirmedAt?: string;
}

export interface GetTransactionsParams {
  walletAddress: string;
  limit?: number;
  status?: "pending" | "confirmed" | "failed";
}

/**
 * Save transaction to Supabase
 */
export async function saveTransaction({
  walletAddress,
  transactionSignature,
  packId,
  packName,
  amountSol,
  amountLamports,
  merchantAddress,
  network = "mainnet-beta",
  status = "pending",
  metadata,
}: SaveTransactionParams): Promise<Transaction | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot save transaction.");
    return null;
  }

  try {
    // Use RPC function to insert transaction (bypasses RLS)
    const { data, error } = await supabase.rpc("insert_transaction", {
      p_wallet_address: walletAddress,
      p_transaction_signature: transactionSignature,
      p_pack_id: packId,
      p_pack_name: packName,
      p_amount_sol: amountSol,
      p_amount_lamports: amountLamports,
      p_merchant_address: merchantAddress,
      p_network: network,
      p_status: status,
      p_metadata: metadata || null,
    });

    if (error) {
      console.error("Error inserting transaction:", error);
      throw error;
    }

    // RPC returns array, get first item
    return data && data.length > 0 ? (data[0] as Transaction) : null;
  } catch (error) {
    console.error("Error saving transaction to Supabase:", error);
    return null;
  }
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus({
  transactionSignature,
  status,
  confirmedAt,
}: UpdateTransactionStatusParams): Promise<Transaction | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot update transaction.");
    return null;
  }

  try {
    const updateData: TransactionUpdate = {
      status: status,
      confirmed_at: confirmedAt || (status === "confirmed" ? new Date().toISOString() : null),
    };

    const { data, error } = await supabase
      .from("transactions")
      .update(updateData)
      .eq("transaction_signature", transactionSignature)
      .select()
      .single();

    if (error) {
      // If transaction not found (PGRST116), return null instead of throwing
      if (error.code === "PGRST116") {
        console.warn("Transaction not found for update:", transactionSignature);
        return null;
      }
      console.error("Error updating transaction:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating transaction in Supabase:", error);
    return null;
  }
}

/**
 * Get transactions for a wallet
 */
export async function getTransactions({
  walletAddress,
  limit = 50,
  status,
}: GetTransactionsParams): Promise<Transaction[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot get transactions.");
    return [];
  }

  try {
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("wallet_address", walletAddress)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error getting transactions:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error getting transactions from Supabase:", error);
    return [];
  }
}

/**
 * Get a single transaction by signature
 */
export async function getTransactionBySignature(
  transactionSignature: string
): Promise<Transaction | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Cannot get transaction.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("transaction_signature", transactionSignature)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error getting transaction:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting transaction from Supabase:", error);
    return null;
  }
}

