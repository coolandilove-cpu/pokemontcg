/**
 * Wallet Configuration
 * 
 * IMPORTANT: Replace with your actual merchant wallet address before deploying to production
 */

// Default devnet merchant address for testing (you can replace this with your own devnet wallet)
// This is a publicly known devnet address - safe to use for testing
const DEFAULT_DEVNET_MERCHANT = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";

// Merchant wallet address - Replace this with your actual wallet address
export const MERCHANT_WALLET_ADDRESS = process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS || 
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet" 
    ? DEFAULT_DEVNET_MERCHANT 
    : "11111111111111111111111111111111"); // Placeholder for mainnet - MUST BE REPLACED

// Network configuration
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";



