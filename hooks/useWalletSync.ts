"use client";

import { useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { saveWallet } from "@/services/walletService";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Hook to automatically sync wallet connection to Supabase
 * Call this hook in a component that has access to wallet context
 */
export function useWalletSync() {
  const { connected, publicKey, wallet } = useWallet();
  const hasSyncedRef = useRef(false);
  const lastWalletAddressRef = useRef<string | null>(null);

  useEffect(() => {
    // Only sync if Supabase is configured
    if (!isSupabaseConfigured) {
      return;
    }

    // Only sync when wallet is connected and we have a public key
    if (!connected || !publicKey) {
      // Reset sync flag when disconnected
      if (hasSyncedRef.current) {
        hasSyncedRef.current = false;
        lastWalletAddressRef.current = null;
      }
      return;
    }

    const walletAddress = publicKey.toString();

    // Only sync if this is a new wallet or first time connecting
    if (hasSyncedRef.current && lastWalletAddressRef.current === walletAddress) {
      return; // Already synced this wallet
    }

    // Save wallet to Supabase
    const syncWallet = async () => {
      try {
        const walletName = wallet?.adapter.name || "Unknown";
        const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";

        await saveWallet({
          walletAddress,
          walletName,
          network,
        });

        hasSyncedRef.current = true;
        lastWalletAddressRef.current = walletAddress;

        console.log("Wallet synced to Supabase:", walletAddress);
      } catch (error) {
        console.error("Error syncing wallet to Supabase:", error);
      }
    };

    syncWallet();
  }, [connected, publicKey, wallet]);
}

