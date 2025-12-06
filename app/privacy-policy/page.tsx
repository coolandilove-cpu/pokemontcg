"use client";

import Header from "@/components/header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="max-w-4xl mx-auto mt-8">
          <Link href="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-6">Last updated: December 2025</p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                <p>
                  Welcome to PokemonTCGDex ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2.1 Wallet Information</h3>
                <p>
                  When you connect your Solana wallet (such as Phantom), we collect your public wallet address. This is necessary for:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Processing transactions for pack purchases</li>
                  <li>Storing your card collection</li>
                  <li>Tracking your transaction history</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">2.2 Collection Data</h3>
                <p>
                  We store information about the Pokémon cards you collect, including:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Card IDs and metadata</li>
                  <li>Pack opening history</li>
                  <li>Collection statistics</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">2.3 Transaction Data</h3>
                <p>
                  We record transaction information on the Solana blockchain, including:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Transaction signatures</li>
                  <li>Pack purchases</li>
                  <li>SOL transfers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide and maintain our services</li>
                  <li>Process pack purchases and transactions</li>
                  <li>Store and manage your card collection</li>
                  <li>Display your collection statistics and progress</li>
                  <li>Improve our website and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Storage</h2>
                <p>
                  Your collection data is stored in Supabase, a secure cloud database. Your wallet address is used as the primary identifier for your account. We do not store your private keys or seed phrases.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Blockchain Transparency</h2>
                <p>
                  All transactions on the Solana blockchain are public and transparent. Your transaction history, including pack purchases, can be viewed by anyone on blockchain explorers like Solscan.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Third-Party Services</h2>
                <p>We use the following third-party services:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Supabase:</strong> For storing your collection data</li>
                  <li><strong>Solana Blockchain:</strong> For processing transactions</li>
                  <li><strong>Helius/QuickNode:</strong> For RPC endpoints (if configured)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access your collection data</li>
                  <li>Request deletion of your data</li>
                  <li>Disconnect your wallet at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Security</h2>
                <p>
                  We implement appropriate security measures to protect your data. However, no method of transmission over the internet is 100% secure. Always keep your wallet private keys secure and never share them with anyone.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us through our support channels.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

