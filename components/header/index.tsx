"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Wallet, X, Copy, Check } from "lucide-react";
import { useWalletLocalStorage } from "@/hooks/useWalletLocalStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const Header = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const { connected, publicKey, wallet, connect, wallets, select, disconnect } = useWallet();
  const { connection } = useConnection();
  const { handleDisconnect: handleDisconnectWithSync } = useWalletLocalStorage();

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
        if (!connection || !publicKey) return;
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
      if (isMounted && publicKey && connection) {
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

  const handleDisconnect = async () => {
    await handleDisconnectWithSync();
  };

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Ẩn Header khi đang ở trang dashboard hoặc các trang con của dashboard
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleConnectClick = () => {
    // Always show dialog to let user choose wallet
    setIsDialogOpen(true);
  };

  if (!mounted) {
    return null;
  }
  
  return (
    <>
      <header className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 py-2">
        <Link href="/" className="flex-shrink-0">
          <img
            src="/pokedex.png"
            alt="Poke Album"
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </Link>

        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-shrink-0">
          <Link href="/dashboard" className="h-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-gray-50 text-black font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black flex items-center justify-center px-3 py-1.5"
            >
              <img src="/sidebar/dashboard.jpg?v=2" alt="Dashboard" className="w-6 h-6 mr-2 object-contain flex-shrink-0" />
              <span className="whitespace-nowrap">Dashboard</span>
            </Button>
          </Link>
          <Link href="/trade" className="h-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-gray-50 text-black font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black flex items-center justify-center px-3 py-1.5"
            >
              <img src="/sidebar/trades.jpg?v=2" alt="Trade" className="w-6 h-6 mr-2 object-contain flex-shrink-0" />
              <span className="whitespace-nowrap">Trade</span>
            </Button>
          </Link>
          <Link href="/pack-opener" className="h-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-gray-50 text-black font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black flex items-center justify-center px-3 py-1.5"
            >
              <img src="/sidebar/iconopenpack.png?v=3" alt="Pack Opener" className="w-6 h-6 mr-2 object-contain flex-shrink-0" />
              <span className="whitespace-nowrap">Pack Opener</span>
            </Button>
          </Link>
          {!connected || !publicKey ? (
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
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-gray-50 text-black font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-black flex items-center justify-center px-3 py-1.5"
                >
                  <Wallet className="w-6 h-6 mr-2 text-green-600" />
                  <span className="whitespace-nowrap">
                    {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                  </span>
                  <span className="text-xs ml-1.5">
                    {balance > 0 ? balance.toFixed(4) : "0.0000"} SOL
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
                    {balance > 0 ? balance.toFixed(4) : "0.0000"} SOL
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
          )}
        </div>
      </header>

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
                    setIsConnecting(true);
                    // Select wallet first
                    select(walletItem.adapter.name);
                    // Wait a bit longer to ensure wallet is selected
                    await new Promise(resolve => setTimeout(resolve, 200));
                    // Connect to the selected wallet
                    await connect();
                    setIsDialogOpen(false);
                  } catch (error: any) {
                    // Handle WalletNotSelectedError gracefully - don't show error to user
                    if (error?.name === "WalletNotSelectedError") {
                      // User may have cancelled, just keep dialog open
                      console.log("Wallet selection cancelled or failed");
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
};

export default Header;
