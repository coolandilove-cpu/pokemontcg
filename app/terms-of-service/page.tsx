"use client";

import Header from "@/components/header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600 mb-6">Last updated: December 2025</p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using PokemonTCGDex ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
                <p>
                  PokemonTCGDex is a digital platform that allows users to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Purchase and open Pokémon Trading Card Game packs</li>
                  <li>Collect and manage digital Pokémon cards</li>
                  <li>View collection statistics and progress</li>
                  <li>Trade cards with other users (coming soon)</li>
                  <li>Battle with cards (coming soon)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Wallet Connection</h2>
                <p>
                  To use our Service, you must connect a Solana wallet (such as Phantom). By connecting your wallet:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You represent that you own or have the right to use the wallet</li>
                  <li>You are responsible for maintaining the security of your wallet</li>
                  <li>You understand that transactions are irreversible on the blockchain</li>
                  <li>We do not have access to your private keys or seed phrases</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Pack Purchases</h2>
                <p>
                  When purchasing packs:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All purchases are final and non-refundable</li>
                  <li>Pack contents are randomly generated</li>
                  <li>Prices are displayed in SOL (Solana cryptocurrency)</li>
                  <li>You are responsible for transaction fees</li>
                  <li>We reserve the right to change pack prices at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Digital Cards</h2>
                <p>
                  The digital cards you collect are:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Stored in our database and linked to your wallet address</li>
                  <li>Non-transferable as NFTs (currently)</li>
                  <li>Subject to our collection management system</li>
                  <li>Not redeemable for physical cards</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. User Responsibilities</h2>
                <p>You agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Use the Service only for lawful purposes</li>
                  <li>Not attempt to hack, manipulate, or exploit the Service</li>
                  <li>Not use the Service to engage in any illegal activities</li>
                  <li>Keep your wallet secure and private</li>
                  <li>Be responsible for all transactions made from your wallet</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Blockchain Transactions</h2>
                <p>
                  All transactions on the Solana blockchain are:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Irreversible once confirmed</li>
                  <li>Public and transparent</li>
                  <li>Subject to network fees</li>
                  <li>Not controlled by us</li>
                </ul>
                <p className="mt-2">
                  We are not responsible for any losses due to network issues, failed transactions, or user errors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
                <p>
                  PokemonTCGDex is provided "as is" without warranties of any kind. We are not liable for:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Any loss of funds or digital assets</li>
                  <li>Network failures or blockchain issues</li>
                  <li>Wallet security breaches</li>
                  <li>Unauthorized access to your wallet</li>
                  <li>Any indirect, incidental, or consequential damages</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Intellectual Property</h2>
                <p>
                  All content on PokemonTCGDex, including but not limited to text, graphics, logos, and images, is the property of PokemonTCGDex or its content suppliers. Pokémon characters and images are trademarks of The Pokémon Company.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes. Your continued use of the Service after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your access to the Service at any time, without prior notice, for any reason, including violation of these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our support channels.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

