"use client"

import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Wallet, X, Copy, Check } from "lucide-react"
import { useWalletLocalStorage } from "@/hooks/useWalletLocalStorage"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export default function WalletInfo() {
  const { connected, publicKey, disconnect, wallet, connect, wallets, select } = useWallet()
  const { connection } = useConnection()
  const { handleDisconnect: handleDisconnectWithSync } = useWalletLocalStorage()
  const [balance, setBalance] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (!connected || !publicKey || !connection) {
      setBalance(0)
      return
    }

    let isMounted = true
    let subscriptionId: number | null = null
    let balanceInterval: NodeJS.Timeout | null = null

    // Get balance with error handling
    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey, "confirmed")
        if (isMounted) {
          setBalance(lamports / LAMPORTS_PER_SOL)
        }
      } catch (error) {
        // Silently handle errors - don't log to console to avoid noise
        if (isMounted) {
          setBalance(0)
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

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = async () => {
    await handleDisconnectWithSync()
  }

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
      // Auto-connect to Phantom if available - trigger connection immediately
      try {
        setIsConnecting(true)
        // Select wallet first, then connect - this triggers popup immediately
        select(phantomWallet.adapter.name)
        // Small delay to ensure wallet is selected before connecting
        await new Promise(resolve => setTimeout(resolve, 100))
        // Check if wallet is still available before connecting
        if (wallet?.adapter.name === phantomWallet.adapter.name) {
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
          setIsDialogOpen(true) // Show dialog if connection fails
        }
      } finally {
        setIsConnecting(false)
      }
    } else {
      // Show dialog to select wallet
      setIsDialogOpen(true)
    }
  }

  if (!connected || !publicKey) {
    return (
      <>
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
                      // Select wallet first, then connect - this triggers popup immediately
                      select(walletItem.adapter.name)
                      // Small delay to ensure wallet is selected before connecting
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
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-9 px-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            {balance.toFixed(4)} SOL
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Connected Wallet</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
              {publicKey.toString()}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 w-6 p-0"
              title="Copy address"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Balance</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {balance.toFixed(4)} SOL
          </p>
        </div>
        {wallet && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Wallet</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{wallet.adapter.name}</p>
            </div>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
        >
          <X className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

