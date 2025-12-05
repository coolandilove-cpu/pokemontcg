"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with wallet adapter
const WalletButton = dynamic(() => import("@/components/WalletButton"), {
  ssr: false,
});

export default function WalletButtonWrapper() {
  return <WalletButton />;
}











