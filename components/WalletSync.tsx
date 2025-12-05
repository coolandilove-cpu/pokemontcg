"use client";

import { useWalletSync } from "@/hooks/useWalletSync";
import { useWalletLocalStorage } from "@/hooks/useWalletLocalStorage";

/**
 * Component to automatically sync wallet to Supabase when connected
 * and sync wallet connection state with localStorage for cross-page synchronization
 * This component should be placed inside SolanaWalletProvider
 */
export function WalletSync() {
  useWalletSync(); // Sync với Supabase
  useWalletLocalStorage(); // Đồng bộ với localStorage để đồng bộ giữa các trang
  return null; // This component doesn't render anything
}

