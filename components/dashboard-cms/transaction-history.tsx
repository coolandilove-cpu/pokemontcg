"use client"

import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { ArrowUpRight, ArrowDownRight, ExternalLink, Wallet, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { PublicKey } from "@solana/web3.js"

interface Transaction {
  signature: string
  type: "sent" | "received"
  amount: number
  timestamp: number
  status: "success" | "failed"
  from?: string
  to?: string
  description?: string
}

export default function TransactionHistory({ filter }: { filter?: "all" | "received" | "sent" }) {
  const { connected, publicKey, connect, wallets, select, wallet } = useWallet()
  const { connection } = useConnection()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  // Auto-close dialog when connected
  useEffect(() => {
    if (connected && isDialogOpen) {
      setIsDialogOpen(false)
    }
  }, [connected, isDialogOpen])

  // Find Phantom wallet
  const phantomWallet = wallets.find((w) => w.adapter.name === "Phantom")

  const handleConnectClick = async () => {
    if (phantomWallet && phantomWallet.adapter.readyState === "Installed") {
      // Auto-connect to Phantom - triggers connection popup immediately
      try {
        setIsConnecting(true)
        // Select wallet first, then connect
        select(phantomWallet.adapter.name)
        // Small delay to ensure wallet is selected before connecting
        await new Promise(resolve => setTimeout(resolve, 100))
        // Check if wallet is selected before connecting
        if (wallet?.adapter.name === phantomWallet.adapter.name || !wallet) {
          await connect()
        } else {
          // If selection failed, show dialog
          setIsDialogOpen(true)
        }
      } catch (error: any) {
        // Handle WalletNotSelectedError gracefully
        if (error?.name === "WalletNotSelectedError") {
          setIsDialogOpen(true)
        } else {
          console.error("Error connecting wallet:", error)
          setIsDialogOpen(true)
        }
      } finally {
        setIsConnecting(false)
      }
    } else {
      setIsDialogOpen(true)
    }
  }

  useEffect(() => {
    if (!connected || !publicKey || !connection) {
      setTransactions([])
      return
    }

    const fetchTransactions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get transaction signatures for the wallet (reduced limit to avoid rate limits)
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 20 })

        // Fetch transaction details
        const txDetails = await Promise.all(
          signatures.map(async (sigInfo) => {
            try {
              const tx = await connection.getTransaction(sigInfo.signature, {
                maxSupportedTransactionVersion: 0,
              })

              if (!tx) return null

              // Determine transaction type and amount
              let type: "sent" | "received" = "sent"
              let amount = 0
              let from = publicKey.toString()
              let to = ""
              let description = "Transaction"

              // Check if transaction has transfers
              const messageAccountKeys = tx.transaction.message.getAccountKeys()
              if (tx.meta && messageAccountKeys) {
                const preBalances = tx.meta.preBalances
                const postBalances = tx.meta.postBalances
                // Get all account keys as array
                const accountKeys = messageAccountKeys.keySegments().flat()

                // Find the wallet's account index
                const walletIndex = accountKeys.findIndex(
                  (key) => key.toString() === publicKey.toString()
                )

                if (walletIndex >= 0) {
                  const balanceChange = postBalances[walletIndex] - preBalances[walletIndex]
                  
                  if (balanceChange > 0) {
                    type = "received"
                    amount = balanceChange / LAMPORTS_PER_SOL
                    // Find sender (account with negative balance change)
                    for (let i = 0; i < accountKeys.length; i++) {
                      if (i !== walletIndex && postBalances[i] < preBalances[i]) {
                        from = accountKeys[i].toString()
                        break
                      }
                    }
                    to = publicKey.toString()
                  } else if (balanceChange < 0) {
                    type = "sent"
                    amount = Math.abs(balanceChange) / LAMPORTS_PER_SOL
                    // Find recipient (account with positive balance change)
                    for (let i = 0; i < accountKeys.length; i++) {
                      if (i !== walletIndex && postBalances[i] > preBalances[i]) {
                        to = accountKeys[i].toString()
                        break
                      }
                    }
                    from = publicKey.toString()
                  }
                }

                // Check memo for description
                let description = type === "sent" ? "Sent SOL" : "Received SOL"
                if (tx.meta.logMessages) {
                  const memoLog = tx.meta.logMessages.find((log) => log.includes("Program log:"))
                  if (memoLog) {
                    const memoMatch = memoLog.match(/Program log: (.+)/)
                    if (memoMatch && memoMatch[1]) {
                      description = memoMatch[1]
                    }
                  }
                }
              }

              return {
                signature: sigInfo.signature,
                type,
                amount,
                timestamp: sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now(),
                status: tx.meta?.err ? "failed" : "success",
                from,
                to,
                description,
              } as Transaction
            } catch (err) {
              return null
            }
          })
        )

        // Filter out null values and apply filter
        let filteredTxs = txDetails.filter((tx): tx is Transaction => tx !== null)
        
        if (filter && filter !== "all") {
          filteredTxs = filteredTxs.filter((tx) => tx.type === filter)
        }

        // Sort by timestamp (newest first)
        filteredTxs.sort((a, b) => b.timestamp - a.timestamp)

        setTransactions(filteredTxs)
      } catch (err: any) {
        // Handle specific error types
        const errorMessage = err?.message || ""
        if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
          setError("RPC endpoint rate limit reached. Please use a custom RPC endpoint for better access.")
        } else if (errorMessage.includes("429") || errorMessage.includes("Too Many Requests")) {
          setError("Too many requests. Please wait a moment and try again.")
        } else {
          setError(err?.message || "Failed to fetch transactions")
        }
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()

    // Refresh every 30 seconds
    const interval = setInterval(fetchTransactions, 30000)

    return () => clearInterval(interval)
  }, [connected, publicKey, connection, filter])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    return "Just now"
  }

  const getExplorerUrl = (signature: string) => {
    return `https://solscan.io/tx/${signature}`
  }

  if (!connected || !publicKey) {
    return (
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200 dark:border-[#1F1F23] w-full min-w-0">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Wallet className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Wallet not connected</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Connect your wallet to view transaction history
          </p>
          <Button
            onClick={handleConnectClick}
            disabled={isConnecting}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 text-black font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black flex items-center justify-center px-3 py-1.5"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                <span className="whitespace-nowrap">Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-6 h-6 mr-2" />
                <span className="whitespace-nowrap">Connect Wallet</span>
              </>
            )}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Connect a wallet on Solana to continue</DialogTitle>
                <DialogDescription>
                  Select a wallet to connect to your account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                {wallets.map((walletItem) => (
                  <Button
                    key={walletItem.adapter.name}
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={async () => {
                      try {
                        setIsConnecting(true)
                        // Select wallet first, then connect - triggers popup immediately
                        select(walletItem.adapter.name)
                        await new Promise(resolve => setTimeout(resolve, 100))
                        // Check if wallet is selected before connecting
                        if (wallet?.adapter.name === walletItem.adapter.name || !wallet) {
                          await connect()
                          setIsDialogOpen(false)
                        } else {
                          // If selection failed, keep dialog open
                          console.error("Failed to select wallet")
                        }
                      } catch (error: any) {
                        // Handle WalletNotSelectedError gracefully
                        if (error?.name === "WalletNotSelectedError") {
                          console.error("Wallet not selected, please try again")
                        } else {
                          console.error("Error connecting wallet:", error)
                        }
                      } finally {
                        setIsConnecting(false)
                      }
                    }}
                    disabled={isConnecting || walletItem.adapter.readyState !== "Installed"}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        {walletItem.adapter.icon && (
                          <img
                            src={walletItem.adapter.icon}
                            alt={walletItem.adapter.name}
                            className="w-6 h-6"
                          />
                        )}
                        <span className="font-medium">{walletItem.adapter.name}</span>
                      </div>
                      {walletItem.adapter.readyState === "Installed" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Detected</span>
                      )}
                      {walletItem.adapter.readyState === "NotDetected" && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">Not installed</span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200 dark:border-[#1F1F23] w-full min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {filter === "received" ? "Received Transactions" : filter === "sent" ? "Sent Transactions" : "All Transactions"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your Solana transaction history
          </p>
        </div>
      </div>

      {isLoading && transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <XCircle className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-sm text-red-500 dark:text-red-400 mb-2">{error}</p>
          {error.includes("RPC endpoint") && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg max-w-md">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                <strong>Tip:</strong> Add a custom RPC endpoint in your <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">.env.local</code> file:
              </p>
              <code className="text-xs text-yellow-900 dark:text-yellow-100 block bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
                NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-endpoint.com
              </code>
            </div>
          )}
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Wallet className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Your transaction history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.signature}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-[#1F1F23] hover:bg-gray-50 dark:hover:bg-[#1F1F23] transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {tx.type === "received" ? (
                    <ArrowDownRight className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {tx.description || (tx.type === "sent" ? "Sent SOL" : "Received SOL")}
                    </p>
                    {tx.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(tx.timestamp)}</span>
                    <span className="font-mono text-[10px]">
                      {tx.type === "sent" ? `To: ${tx.to?.slice(0, 4) || ""}...${tx.to?.slice(-4) || ""}` : `From: ${tx.from?.slice(0, 4) || ""}...${tx.from?.slice(-4) || ""}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-sm font-semibold ${tx.type === "received" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {tx.type === "received" ? "+" : "-"}
                  {tx.amount.toFixed(4)} SOL
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(getExplorerUrl(tx.signature), "_blank")}
                  title="View on Solscan"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

