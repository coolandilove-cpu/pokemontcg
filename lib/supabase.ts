"use client";

import { createClient } from "@supabase/supabase-js";

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://your-project-id.supabase.co" &&
  supabaseAnonKey !== "your-anon-key-here"
);

// Create Supabase client
// Only create if configured, otherwise create a mock client
let supabaseClient: ReturnType<typeof createClient> | null = null;

if (isSupabaseConfigured && supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // We're using wallet-based auth, not Supabase auth
        autoRefreshToken: false,
      },
    });
  } catch (error) {
    console.warn("Supabase initialization failed:", error);
    console.warn("Continuing without Supabase features");
  }
} else {
  console.warn("Supabase not configured. Some features may not be available.");
  console.warn("To enable Supabase, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
}

// Export Supabase client
export const supabase = supabaseClient;

// Helper function to set wallet address for RLS policies
// This will be used before queries to ensure RLS works correctly
export async function setWalletAddressForRLS(walletAddress: string) {
  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  try {
    // Use Supabase RPC function or set session variable
    // For now, we'll use a workaround by setting it in the query context
    // Note: This is a simplified approach. In production, you might want to use
    // Supabase's built-in auth or create a custom RPC function
    
    // Alternative: We can pass wallet_address directly in queries and use it in WHERE clauses
    // The RLS policies will check wallet_address column directly
    return walletAddress;
  } catch (error) {
    console.error("Error setting wallet address for RLS:", error);
    return null;
  }
}

// Database types (will be generated from Supabase schema)
export type Database = {
  public: {
    Tables: {
      wallets: {
        Row: {
          id: string;
          wallet_address: string;
          wallet_name: string | null;
          network: string;
          first_connected_at: string;
          last_connected_at: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          wallet_name?: string | null;
          network?: string;
          first_connected_at?: string;
          last_connected_at?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          wallet_name?: string | null;
          network?: string;
          first_connected_at?: string;
          last_connected_at?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          wallet_id: string | null;
          wallet_address: string;
          transaction_signature: string;
          pack_id: string;
          pack_name: string;
          amount_sol: number;
          amount_lamports: number;
          merchant_address: string;
          status: "pending" | "confirmed" | "failed";
          network: string;
          created_at: string;
          confirmed_at: string | null;
          metadata: Record<string, any> | null;
        };
        Insert: {
          id?: string;
          wallet_id?: string | null;
          wallet_address: string;
          transaction_signature: string;
          pack_id: string;
          pack_name: string;
          amount_sol: number;
          amount_lamports: number;
          merchant_address: string;
          status?: "pending" | "confirmed" | "failed";
          network?: string;
          created_at?: string;
          confirmed_at?: string | null;
          metadata?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          wallet_id?: string | null;
          wallet_address?: string;
          transaction_signature?: string;
          pack_id?: string;
          pack_name?: string;
          amount_sol?: number;
          amount_lamports?: number;
          merchant_address?: string;
          status?: "pending" | "confirmed" | "failed";
          network?: string;
          created_at?: string;
          confirmed_at?: string | null;
          metadata?: Record<string, any> | null;
        };
      };
      pack_openings: {
        Row: {
          id: string;
          wallet_id: string | null;
          wallet_address: string;
          transaction_id: string | null;
          pack_id: string;
          pack_name: string;
          card_id: string;
          card_name: string;
          card_rarity: string | null;
          card_image: string | null;
          opened_at: string;
          metadata: Record<string, any> | null;
        };
        Insert: {
          id?: string;
          wallet_id?: string | null;
          wallet_address: string;
          transaction_id?: string | null;
          pack_id: string;
          pack_name: string;
          card_id: string;
          card_name: string;
          card_rarity?: string | null;
          card_image?: string | null;
          opened_at?: string;
          metadata?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          wallet_id?: string | null;
          wallet_address?: string;
          transaction_id?: string | null;
          pack_id?: string;
          pack_name?: string;
          card_id?: string;
          card_name?: string;
          card_rarity?: string | null;
          card_image?: string | null;
          opened_at?: string;
          metadata?: Record<string, any> | null;
        };
      };
      collections: {
        Row: {
          id: string;
          wallet_id: string | null;
          wallet_address: string;
          card_id: string;
          card_name: string;
          pack_id: string | null;
          obtained_from: string | null;
          obtained_at: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          wallet_id?: string | null;
          wallet_address: string;
          card_id: string;
          card_name: string;
          pack_id?: string | null;
          obtained_from?: string | null;
          obtained_at?: string;
          quantity?: number;
        };
        Update: {
          id?: string;
          wallet_id?: string | null;
          wallet_address?: string;
          card_id?: string;
          card_name?: string;
          pack_id?: string | null;
          obtained_from?: string | null;
          obtained_at?: string;
          quantity?: number;
        };
      };
    };
  };
};

