import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Providers } from "@/contexts/Providers";
import WalletButtonWrapper from "@/components/WalletButtonWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/ErrorBoundary";

const nunito = Nunito({
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "PokémonTCGDEX",
  description:
    "Your platform to collect, organize and share your Pokémon TCG Pocket collection with friends and other trainers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.className} suppressHydrationWarning>
      <link rel="icon" href="/pokedex.png" sizes="any" />

      <body className="w-screen h-screen m-0 p-0 flex justify-center bg-gray-50" suppressHydrationWarning>
        <div id="root">
          <ErrorBoundary>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              <Providers>
                {children}
                <WalletButtonWrapper />
              </Providers>

              <Sidebar />
              <Analytics />
              <SpeedInsights />
            </ThemeProvider>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
