"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

interface IWalletProviderProps {
  children: React.ReactNode;
}

export function SolanaWalletProvider({ children }: IWalletProviderProps) {
  // Use mainnet-beta for production, or devnet for testing
  // Set NEXT_PUBLIC_SOLANA_NETWORK=devnet in .env.local to use devnet
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet" 
    ? WalletAdapterNetwork.Devnet 
    : WalletAdapterNetwork.Mainnet);
  
  // Use a more reliable RPC endpoint
  // You can replace this with your own RPC endpoint (Helius, QuickNode, etc.)
  const endpoint = useMemo(() => {
    // Try to use environment variable first, fallback to public RPC
    const customRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (customRpc) {
      return customRpc;
    }
    
    // Use public RPC endpoints based on network
    // For devnet testing, use public devnet RPC
    // For mainnet, use public mainnet RPC
    return clusterApiUrl(network);
  }, [network]);

  // Phantom is automatically detected as a Standard Wallet
  // No need to explicitly add PhantomWalletAdapter
  const wallets = useMemo(
    () => [],
    []
  );

  // Error handler to prevent unhandled errors from breaking the app
  const onError = (error: Error) => {
    // Only log non-critical errors
    if (error.name !== "WalletNotSelectedError") {
      console.error("Wallet error:", error);
    }
    // For WalletNotSelectedError, we'll handle it in the components
  };

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: "confirmed" }}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

