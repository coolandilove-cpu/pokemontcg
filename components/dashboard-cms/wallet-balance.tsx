"use client"

import { useState, useEffect } from "react"
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export default function WalletBalance() {
  const { connected, publicKey, connect, wallets, select, wallet } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
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
      // Auto-connect to Phantom if available - triggers connection popup immediately
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
      setBalance(0)
      setIsLoading(false)
      return
    }

    let isMounted = true
    let subscriptionId: number | null = null
    let balanceInterval: NodeJS.Timeout | null = null

    setIsLoading(true)

    // Get balance with error handling
    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey, "confirmed")
        if (isMounted) {
          setBalance(lamports / LAMPORTS_PER_SOL)
          setIsLoading(false)
        }
      } catch (error) {
        // Silently handle errors
        if (isMounted) {
          setBalance(0)
          setIsLoading(false)
        }
      }
    }

    fetchBalance()

    // Poll balance instead of using WebSocket subscription to avoid WebSocket errors
    // Refresh balance every 10 seconds
    balanceInterval = setInterval(() => {
      if (isMounted && publicKey) {
        connection
          .getBalance(publicKey, "confirmed")
          .then((lamports) => {
            if (isMounted) {
              setBalance(lamports / LAMPORTS_PER_SOL)
            }
          })
          .catch(() => {
            // Silently handle errors
          })
      }
    }, 10000) // Poll every 10 seconds

    // Optionally subscribe to balance changes (disabled to avoid WebSocket errors)
    // Uncomment below if you want real-time updates (may cause WebSocket errors)
    /*
    try {
      subscriptionId = connection.onAccountChange(
        publicKey,
        (accountInfo) => {
          if (isMounted) {
            setBalance(accountInfo.lamports / LAMPORTS_PER_SOL)
          }
        },
        "confirmed"
      )
    } catch (error) {
      subscriptionId = null
    }
    */

    return () => {
      isMounted = false
      if (balanceInterval) {
        clearInterval(balanceInterval)
      }
      if (subscriptionId !== null && connection) {
        try {
          connection.removeAccountChangeListener(subscriptionId)
        } catch (error) {
          // Silently handle cleanup errors
        }
      }
    }
  }, [connected, publicKey, connection])

  const recentTransactions: Array<{ id: string; type: string; amount: number; timestamp: number; description?: string }> = [
    // This would be populated from actual transaction history
  ]

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23] w-full min-w-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Wallet Balance</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your Solana wallet balance
          </p>
        </div>
        <Wallet className="h-6 w-6 text-gray-400" />
      </div>

      {!connected ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Wallet className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Wallet not connected</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Connect your wallet to view balance and transactions
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
                <DialogTitle>Connect Wallet</DialogTitle>
                <DialogDescription>
                  Select a wallet
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
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              {isLoading ? (
                <span className="text-3xl sm:text-4xl font-bold text-gray-400 dark:text-gray-500">
                  Loading...
                </span>
              ) : (
                <>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    {balance.toFixed(4)}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400">SOL</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400">Received</span>
              </div>
              <p className="text-lg font-semibold text-green-700 dark:text-green-300">0.0000</p>
              <p className="text-xs text-green-600 dark:text-green-400">This month</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-xs text-red-600 dark:text-red-400">Sent</span>
              </div>
              <p className="text-lg font-semibold text-red-700 dark:text-red-300">0.0000</p>
              <p className="text-xs text-red-600 dark:text-red-400">This month</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Transactions</h4>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent transactions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
                  >
                    <div className="flex items-center gap-2">
                      {tx.type === "received" ? (
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.timestamp}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}
                    >
                      {tx.type === "received" ? "+" : "-"}
                      {tx.amount} SOL
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

