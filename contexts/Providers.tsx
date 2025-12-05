"use client";

import { AuthProvider } from "./Auth";
import { SolanaWalletProvider } from "./WalletProvider";
import { CollectionProvider } from "./CollectionContext";
import { NotificationProvider } from "./NotificationContext";
import { WalletSync } from "@/components/WalletSync";

interface IProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: IProvidersProps) => {
  return (
    <SolanaWalletProvider>
      <WalletSync />
      <CollectionProvider>
        <NotificationProvider>
          <AuthProvider>{children}</AuthProvider>
        </NotificationProvider>
      </CollectionProvider>
    </SolanaWalletProvider>
  );
};

export { Providers };
