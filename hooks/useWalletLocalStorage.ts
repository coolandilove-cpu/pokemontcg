"use client";

import { useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";

const WALLET_STORAGE_KEY = "solana_wallet_connection";
const WALLET_NAME_STORAGE_KEY = "solana_wallet_name";

interface WalletConnectionState {
  connected: boolean;
  publicKey: string | null;
  walletName: string | null;
}

/**
 * Hook để đồng bộ trạng thái kết nối wallet với localStorage
 * và tự động kết nối lại khi component mount nếu đã kết nối trước đó
 */
export function useWalletLocalStorage() {
  const { connected, publicKey, wallet, connect, select, disconnect } = useWallet();

  // Lưu trạng thái vào localStorage khi kết nối thành công
  useEffect(() => {
    if (connected && publicKey && wallet) {
      try {
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({
          connected: true,
          publicKey: publicKey.toString(),
          walletName: wallet.adapter.name,
        }));
        localStorage.setItem(WALLET_NAME_STORAGE_KEY, wallet.adapter.name);
        // Trigger event để các component khác trong cùng tab biết
        window.dispatchEvent(new Event("walletStorageChanged"));
      } catch (error) {
        console.error("Error saving wallet state to localStorage:", error);
      }
    } else if (!connected) {
      // Xóa trạng thái khi ngắt kết nối
      try {
        localStorage.removeItem(WALLET_STORAGE_KEY);
        localStorage.removeItem(WALLET_NAME_STORAGE_KEY);
        // Trigger event để các component khác biết
        window.dispatchEvent(new Event("walletStorageChanged"));
      } catch (error) {
        console.error("Error removing wallet state from localStorage:", error);
      }
    }
  }, [connected, publicKey, wallet]);

  // Đọc trạng thái từ localStorage và tự động kết nối lại
  useEffect(() => {
    let isMounted = true;
    const autoConnectFromStorage = async () => {
      // Chỉ tự động kết nối nếu chưa kết nối
      if (connected) {
        return;
      }

      try {
        const storedState = localStorage.getItem(WALLET_STORAGE_KEY);
        const storedWalletName = localStorage.getItem(WALLET_NAME_STORAGE_KEY);

        if (storedState && storedWalletName && isMounted) {
          const state: WalletConnectionState = JSON.parse(storedState);
          
          if (state.connected && state.walletName && isMounted) {
            // Chọn wallet đã lưu
            select(state.walletName as WalletName);
            
            // Đợi một chút để wallet được chọn
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Kiểm tra lại mounted state trước khi connect
            if (!isMounted) return;
            
            // Thử kết nối lại
            try {
              await connect();
            } catch (error: any) {
              // Nếu không thể kết nối (ví dụ: wallet không còn sẵn sàng), xóa trạng thái
              if (error?.name !== "WalletNotSelectedError" && isMounted) {
                console.log("Could not auto-connect wallet, clearing storage");
                localStorage.removeItem(WALLET_STORAGE_KEY);
                localStorage.removeItem(WALLET_NAME_STORAGE_KEY);
              }
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error reading wallet state from localStorage:", error);
          // Xóa dữ liệu không hợp lệ
          try {
            localStorage.removeItem(WALLET_STORAGE_KEY);
            localStorage.removeItem(WALLET_NAME_STORAGE_KEY);
          } catch (e) {
            // Ignore
          }
        }
      }
    };

    // Chỉ chạy một lần khi component mount và chưa kết nối
    if (!connected) {
      autoConnectFromStorage();
    }

    return () => {
      isMounted = false;
    };
  }, []); // Chỉ chạy khi mount, không phụ thuộc vào connected để tránh loop

  // Lắng nghe storage events để đồng bộ giữa các tab/window
  useEffect(() => {
    let isMounted = true;
    
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === WALLET_STORAGE_KEY || e.key === WALLET_NAME_STORAGE_KEY) && isMounted) {
        // Khi storage thay đổi từ tab khác, trigger event để xử lý
        window.dispatchEvent(new Event("walletStorageChanged"));
      }
    };

    const handleWalletStorageChanged = async () => {
      if (!isMounted) return;
      
      // Khi có thay đổi từ tab khác hoặc cùng tab, kiểm tra và đồng bộ
      const storedState = localStorage.getItem(WALLET_STORAGE_KEY);
      const storedWalletName = localStorage.getItem(WALLET_NAME_STORAGE_KEY);
      
      if (storedState && storedWalletName && !connected && isMounted) {
        try {
          const state: WalletConnectionState = JSON.parse(storedState);
          if (state.connected && state.walletName && isMounted) {
            // Chọn và kết nối wallet đã lưu
            select(state.walletName as WalletName);
            await new Promise(resolve => setTimeout(resolve, 200));
            if (isMounted) {
              await connect();
            }
          }
        } catch (error) {
          // Ignore errors khi đồng bộ
        }
      } else if (!storedState && connected && isMounted) {
        // Nếu không còn trạng thái trong storage nhưng vẫn connected, disconnect
        try {
          await disconnect();
        } catch (error) {
          // Ignore errors
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("walletStorageChanged", handleWalletStorageChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("walletStorageChanged", handleWalletStorageChanged);
    };
  }, [connected, select, connect, disconnect]);

  // Hàm để xóa trạng thái khi disconnect
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      localStorage.removeItem(WALLET_STORAGE_KEY);
      localStorage.removeItem(WALLET_NAME_STORAGE_KEY);
      // Trigger event để các tab khác biết
      window.dispatchEvent(new Event("walletStorageChanged"));
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [disconnect]);

  return {
    handleDisconnect,
  };
}

