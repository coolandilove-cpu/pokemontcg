"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { MERCHANT_WALLET_ADDRESS } from "@/config/wallet";
import { saveTransaction, updateTransactionStatus } from "@/services/transactionService";
import { isSupabaseConfigured } from "@/lib/supabase";

interface PurchasePackParams {
  packId: string;
  packName: string; // Pack name for transaction record
  price: number; // Price in SOL
  recipientAddress?: string; // Optional: override merchant wallet address
}

export function usePurchasePack() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchasePack = useCallback(
    async ({ packId, packName, price, recipientAddress }: PurchasePackParams) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      setIsPurchasing(true);
      setError(null);

      const walletAddress = publicKey.toString();
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";

      // Validate connection
      if (!connection) {
        throw new Error("Solana connection not available. Please refresh the page.");
      }

      try {
        // Allow price = 0 for free packs (testing)
        const isFreePack = price === 0;
        
        // Validate price (allow 0 for free packs)
        if (price < 0) {
          throw new Error("Invalid price: price cannot be negative");
        }

        // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
        const lamports = isFreePack ? 0 : Math.floor(price * 1_000_000_000);

        // Handle free packs (price = 0) - skip transaction
        if (isFreePack) {
          // For free packs, return success without sending transaction
          return {
            success: true,
            rejected: false,
            signature: "free-pack-no-transaction",
            packId,
            confirmation: null,
            transactionId: undefined,
          };
        }

        // Get recipient address (use provided address or fallback to merchant wallet)
        let recipientAddressToUse = recipientAddress || MERCHANT_WALLET_ADDRESS;
        
        // Validate recipient address - don't allow placeholder for mainnet
        if (recipientAddressToUse === "11111111111111111111111111111111") {
          const errorMsg = network === "mainnet-beta" 
            ? "Merchant wallet address not configured for mainnet. Please set NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS in your .env.local file."
            : "Merchant wallet address not configured. Please set NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS in your .env.local file.";
          console.error("Merchant wallet validation failed:", {
            network,
            merchantAddress: recipientAddressToUse,
            envVar: process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS,
          });
          throw new Error(errorMsg);
        }
        
        // Prevent self-transfer (user sending to themselves) - warn but allow for devnet testing
        if (recipientAddressToUse === publicKey.toString()) {
          console.warn(
            "⚠️ Warning: You are sending SOL to your own wallet. " +
            "This is only recommended for devnet testing. " +
            "For production, please configure a different merchant wallet address."
          );
          // Still allow it for devnet testing, but warn the user
        }
        
        // Validate recipient address
        let recipientPubkey: PublicKey;
        try {
          recipientPubkey = new PublicKey(recipientAddressToUse);
        } catch {
          throw new Error("Invalid recipient wallet address. Please check your merchant wallet configuration.");
        }

        // Create a new transaction
        const transaction = new Transaction();

        // Add memo instruction to record pack purchase
        // Note: Memo program address on Solana
        // For devnet, memo instruction is optional but helps with tracking
        try {
          const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
          const memoInstruction = new TransactionInstruction({
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
            programId: MEMO_PROGRAM_ID,
            data: Buffer.from(`Purchase Pack: ${packId}`, "utf-8"),
          });
          transaction.add(memoInstruction);
        } catch (error) {
          console.warn("Failed to add memo instruction, continuing without it:", error);
          // Continue without memo if it fails
        }

        // Add transfer instruction to send SOL to merchant wallet
        const transferInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamports,
        });

        transaction.add(transferInstruction);

        // Get recent blockhash and set fee payer
        let blockhash: string;
        let lastValidBlockHeight: number;
        try {
          const blockhashResult = await connection.getLatestBlockhash("confirmed");
          blockhash = blockhashResult.blockhash;
          lastValidBlockHeight = blockhashResult.lastValidBlockHeight;
        } catch (error: any) {
          console.error("Failed to get latest blockhash:", error);
          throw new Error(`Failed to get latest blockhash: ${error?.message || "Network error"}`);
        }
        
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;
        
        // Set version for v0 transactions (if needed)
        // transaction.version = 0;

        // Send transaction
        // For devnet testing, skip preflight to avoid simulation errors
        // In production, you may want to keep skipPreflight: false for security
        let signature: string;
        try {
          signature = await sendTransaction(transaction, connection, {
            skipPreflight: true, // Skip preflight to avoid simulation errors in devnet
            maxRetries: 3,
          });
        } catch (txError: any) {
          // Handle transaction sending errors
          const errorMessage = txError?.message || txError?.toString() || "Unknown transaction error";
          console.error("Transaction send error:", {
            error: txError,
            message: errorMessage,
            network,
            recipientAddress: recipientAddressToUse,
            amount: price,
          });
          
          // Provide user-friendly error messages
          if (errorMessage.includes("User rejected") || errorMessage.includes("User cancelled")) {
            throw new Error("Transaction cancelled by user");
          } else if (errorMessage.includes("insufficient funds") || errorMessage.includes("Insufficient")) {
            throw new Error("Insufficient SOL balance. Please ensure you have enough SOL to cover the transaction fee.");
          } else if (errorMessage.includes("network") || errorMessage.includes("Network")) {
            throw new Error("Network error. Please check your connection and try again.");
          } else if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
            throw new Error("Transaction timeout. Please try again.");
          } else {
            throw new Error(`Transaction failed: ${errorMessage}`);
          }
        }

        // Wait for confirmation with timeout
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        }, "confirmed");

        if (confirmation.value.err) {
          // Save failed transaction to Supabase
          if (isSupabaseConfigured) {
            try {
              await saveTransaction({
                walletAddress,
                transactionSignature: signature,
                packId,
                packName,
                amountSol: price,
                amountLamports: lamports,
                merchantAddress: recipientAddressToUse,
                network,
                status: "failed",
                metadata: { error: confirmation.value.err },
              });
            } catch (error) {
              console.error("Error saving failed transaction to Supabase:", error);
            }
          }
          throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }

        // Save successful transaction to Supabase
        let transactionId: string | undefined;
        if (isSupabaseConfigured) {
          try {
            const transactionRecord = await saveTransaction({
              walletAddress,
              transactionSignature: signature,
              packId,
              packName,
              amountSol: price,
              amountLamports: lamports,
              merchantAddress: recipientAddressToUse,
              network,
              status: "confirmed",
              metadata: {
                blockhash,
                confirmation: confirmation.value,
              },
            });

            // Update transaction with confirmed_at timestamp if needed
            if (transactionRecord) {
              transactionId = transactionRecord.id;
              // Update confirmed_at timestamp (transaction was saved with status "confirmed" but confirmed_at may be null)
              try {
                await updateTransactionStatus({
                  transactionSignature: signature,
                  status: "confirmed",
                  confirmedAt: new Date().toISOString(),
                });
              } catch (updateError) {
                // If update fails, log but don't throw - transaction was already saved successfully
                console.warn("Failed to update transaction confirmed_at timestamp:", updateError);
              }
            }
          } catch (error) {
            console.error("Error saving transaction to Supabase:", error);
            // Don't throw - transaction was successful, just logging failed
          }
        }

        return {
          success: true,
          rejected: false,
          signature,
          packId,
          confirmation,
          transactionId, // Return transaction ID for pack opening
        };
      } catch (err: any) {
        // Log detailed error information
        console.error("Purchase error:", {
          error: err,
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
          packId,
          price,
          walletAddress,
        });
        
        // Check if user rejected the transaction
        const isUserRejected = 
          err?.name === "WalletSendTransactionError" ||
          err?.name === "UserRejected" ||
          err?.message?.includes("User rejected") ||
          err?.message?.includes("rejected") ||
          err?.message?.includes("User cancelled") ||
          err?.message?.includes("User canceled");
        
        if (isUserRejected) {
          // User rejected - don't throw error, return special result
          setError(null);
          return {
            success: false,
            rejected: true,
            signature: null,
            packId,
            confirmation: null,
          };
        }
        
        // Other errors - throw normally with detailed message
        const errorMessage = err?.message || err?.toString() || "Failed to purchase pack";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsPurchasing(false);
      }
    },
    [publicKey, sendTransaction, connection]
  );

  return {
    purchasePack,
    isPurchasing,
    error,
  };
}

