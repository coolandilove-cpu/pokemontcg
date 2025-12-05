"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Wallet } from "lucide-react"
import { useWalletLocalStorage } from "@/hooks/useWalletLocalStorage"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CustomWalletButton() {
  const { connected, publicKey, wallet, connect, disconnect, wallets, select } = useWallet()
  const { handleDisconnect: handleDisconnectWithSync } = useWalletLocalStorage()
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  // Auto-close dialog when connected
  useEffect(() => {
    if (connected && isOpen) {
      setIsOpen(false)
    }
  }, [connected, isOpen])

  const handleConnect = async (walletAdapter: any) => {
    try {
      setIsConnecting(true)
      // Ensure wallet is selected before connecting
      if (walletAdapter && walletAdapter.name) {
        select(walletAdapter.name)
        // Small delay to ensure wallet is selected
        await new Promise(resolve => setTimeout(resolve, 100))
        // Check if wallet is selected before connecting
        if (wallet?.adapter.name === walletAdapter.name || !wallet) {
          await connect()
        } else {
          // If selection failed, show dialog
          setIsOpen(true)
        }
      } else {
        // No wallet adapter provided, show dialog
        setIsOpen(true)
      }
    } catch (error: any) {
      // Handle WalletNotSelectedError gracefully
      if (error?.name === "WalletNotSelectedError") {
        setIsOpen(true)
      } else {
        console.error("Error connecting wallet:", error)
        // Show dialog if connection fails
        setIsOpen(true)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    await handleDisconnectWithSync()
  }

  // If connected, show wallet info
  if (connected && publicKey) {
    return null // WalletInfo component will handle this
  }

  // Find Phantom wallet
  const phantomWallet = wallets.find((w) => w.adapter.name === "Phantom")

  return (
    <>
      <Button
        onClick={() => {
          if (phantomWallet) {
            // Auto-connect to Phantom if available
            handleConnect(phantomWallet.adapter)
          } else {
            // Show dialog if Phantom not found
            setIsOpen(true)
          }
        }}
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                className="w-full justify-start h-auto py-3 px-4"
                onClick={async () => {
                  try {
                    setIsConnecting(true)
                    // Select wallet first, then connect
                    select(walletItem.adapter.name)
                    // Small delay to ensure wallet is selected
                    await new Promise(resolve => setTimeout(resolve, 100))
                    // Check if wallet is selected before connecting
                    if (wallet?.adapter.name === walletItem.adapter.name || !wallet) {
                      await connect()
                      setIsOpen(false)
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
                    <span className="text-xs text-gray-500">Detected</span>
                  )}
                  {walletItem.adapter.readyState === "NotDetected" && (
                    <span className="text-xs text-gray-400">Not installed</span>
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

