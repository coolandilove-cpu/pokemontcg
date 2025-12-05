"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Wallet, X, Copy, Check } from "lucide-react";
import { useWalletLocalStorage } from "@/hooks/useWalletLocalStorage";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNotifications } from "@/contexts/NotificationContext";

export default function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const pathname = usePathname();
  const { connected, publicKey, disconnect, wallet, connect, wallets, select } = useWallet();
  const { connection } = useConnection();
  const { addNotification } = useNotifications();
  const { handleDisconnect: handleDisconnectWithSync } = useWalletLocalStorage();

  // Track previous connection state to detect changes
  const prevConnectedRef = useRef(connected);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch balance when connected
  useEffect(() => {
    if (!connected || !publicKey || !connection) {
      setBalance(0);
      return;
    }

    let isMounted = true;
    let balanceInterval: NodeJS.Timeout | null = null;

    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey, "confirmed");
        if (isMounted) {
          setBalance(lamports / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        if (isMounted) {
          setBalance(0);
        }
      }
    };

    fetchBalance();

    // Poll balance every 10 seconds
    balanceInterval = setInterval(() => {
      if (isMounted && publicKey) {
        connection
          .getBalance(publicKey, "confirmed")
          .then((lamports) => {
            if (isMounted) {
              setBalance(lamports / LAMPORTS_PER_SOL);
            }
          })
          .catch(() => {
            // Silently handle errors
          });
      }
    }, 10000);

    return () => {
      isMounted = false;
      if (balanceInterval) {
        clearInterval(balanceInterval);
      }
    };
  }, [connected, publicKey, connection]);

  // Auto-close dialog when connected
  useEffect(() => {
    if (connected && isDialogOpen) {
      setIsDialogOpen(false);
    }
    
    // Only notify on actual connection change (not on every render)
    if (connected && !prevConnectedRef.current && publicKey) {
      addNotification({
        type: "system",
        title: "Wallet Connected",
        message: `Successfully connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
      });
    }
    
    prevConnectedRef.current = connected;
  }, [connected, isDialogOpen, publicKey, addNotification]);

  // Hide wallet button when on dashboard pages (wallet info is shown in top nav)
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/cards") || pathname?.startsWith("/trades") || pathname?.startsWith("/balance") || pathname?.startsWith("/transactions")) {
    return null;
  }

  const handleDisconnect = async () => {
    try {
      await handleDisconnectWithSync();
      addNotification({
        type: "system",
        title: "Wallet Disconnected",
        message: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Find Phantom wallet
  const phantomWallet = wallets.find((w) => w.adapter.name === "Phantom");

  const handleConnectClick = async () => {
    if (phantomWallet && phantomWallet.adapter.readyState === "Installed") {
      try {
        setIsConnecting(true);
        select(phantomWallet.adapter.name);
        await new Promise(resolve => setTimeout(resolve, 100));
        if (wallet?.adapter.name === phantomWallet.adapter.name || !wallet) {
          await connect();
        } else {
          setIsDialogOpen(true);
        }
      } catch (error: any) {
        if (error?.name === "WalletNotSelectedError") {
          setIsDialogOpen(true);
        } else {
          console.error("Error connecting wallet:", error);
          setIsDialogOpen(true);
        }
      } finally {
        setIsConnecting(false);
      }
    } else {
      setIsDialogOpen(true);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!connected || !publicKey) {
    return (
      <>
        {/* Button is now in header, only render dialog here */}
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
                      setIsConnecting(true);
                      select(walletItem.adapter.name);
                      await new Promise(resolve => setTimeout(resolve, 100));
                      if (wallet?.adapter.name === walletItem.adapter.name || !wallet) {
                        await connect();
                        setIsDialogOpen(false);
                      } else {
                        console.error("Failed to select wallet");
                      }
                    } catch (error: any) {
                      if (error?.name === "WalletNotSelectedError") {
                        console.error("Wallet not selected, please try again");
                      } else {
                        console.error("Error connecting wallet:", error);
                      }
                    } finally {
                      setIsConnecting(false);
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
    );
  }

  // When connected, hide the fixed button (wallet info is shown in header)
  // But component still runs in background for balance fetching and notifications
  return null;
}

