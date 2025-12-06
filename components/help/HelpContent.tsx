"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Wallet,
  ArrowLeftRight,
  Database,
  BookOpen,
  Mail,
  Sword,
} from "lucide-react";

export default function HelpContent() {
  const faqs = [
    {
      question: "How do I connect my wallet?",
      answer:
        "Click on the 'Connect Wallet' button in the top right corner. Make sure you have a Solana wallet extension (like Phantom) installed in your browser. Select your wallet and approve the connection.",
    },
    {
      question: "How do I purchase card packs?",
      answer:
        "Navigate to the 'Pack Opener' page from the header menu. Select a pack you want to purchase, click on it, and confirm the transaction in your wallet. After the transaction is confirmed, you can open the pack to reveal your cards.",
    },
    {
      question: "How do I trade cards with other users?",
      answer:
        "Go to the 'Trade' page from the header menu. The trading feature is coming soon! You'll be able to view pending trades, create new trade offers, and accept trade requests from other users. Make sure both parties have connected their wallets.",
    },
    {
      question: "What is TCG Battle?",
      answer:
        "TCG Battle is a new feature coming soon! You'll be able to battle with your Pokémon cards against other trainers. Challenge other players and prove your skills in epic card battles. Stay tuned for updates!",
    },
    {
      question: "Where is my collection stored?",
      answer:
        "Your collection is stored in Supabase database, associated with your wallet address. Your cards are saved when you open packs, and you can view them in the Dashboard. Your collection is tied to your wallet address and will persist across sessions and devices.",
    },
    {
      question: "Can I view my collection on another device?",
      answer:
        "Yes! As long as you connect the same wallet address, your collection will be available on any device. Your collection is stored in the cloud (Supabase), so it syncs automatically across all devices using the same wallet.",
    },
    {
      question: "What networks are supported?",
      answer:
        "The application supports both Solana Mainnet and Devnet. By default, it uses Mainnet for production. You can switch to Devnet for testing by setting NEXT_PUBLIC_SOLANA_NETWORK=devnet in your environment variables.",
    },
    {
      question: "How do I view my transaction history?",
      answer:
        "Go to Dashboard to view all your transactions. You can see pack purchases, SOL transfers, and transaction details. All transactions are saved to Supabase and linked to your wallet address.",
    },
    {
      question: "How do I open packs?",
      answer:
        "Go to the Pack Opener page, select a pack you want to purchase, click 'Purchase & Open Pack', confirm the transaction in your wallet, and watch the pack opening animation to reveal your cards. Your cards are automatically added to your collection.",
    },
    {
      question: "What happens if I disconnect my wallet?",
      answer:
        "If you disconnect your wallet, your collection data remains stored in Supabase but won't be accessible until you reconnect the same wallet address. Your collection is tied to your wallet address, so make sure to use the same wallet when reconnecting.",
    },
  ];

  const guides = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of using PokemonTCGDex",
      steps: [
        "Install a Solana wallet extension (Phantom recommended)",
        "Connect your wallet to the application",
        "Browse available card packs in Pack Opener",
        "Purchase packs using SOL (mainnet or devnet)",
        "Open packs to reveal your cards",
        "View and manage your collection in the Dashboard",
      ],
    },
    {
      title: "Wallet Management",
      icon: Wallet,
      description: "Everything about managing your wallet",
      steps: [
        "Connect your Solana wallet (Phantom, Solflare, etc.)",
        "Ensure you have SOL for transactions",
        "For testing, use Devnet and get free SOL from faucets",
        "For production, use Mainnet with real SOL",
        "Keep your wallet secure - never share your private keys",
      ],
    },
    {
      title: "Trading Cards",
      icon: ArrowLeftRight,
      description: "How to trade cards with other users (Coming Soon)",
      steps: [
        "Navigate to the Trade page from header menu",
        "View available trade offers (feature coming soon)",
        "Create a new trade by selecting cards to offer",
        "Specify cards you want to receive",
        "Wait for the other party to accept",
        "Complete the trade transaction on Solana blockchain",
      ],
    },
    {
      title: "TCG Battle",
      icon: Sword,
      description: "Battle with your Pokémon cards (Coming Soon)",
      steps: [
        "Navigate to the TCG Battle page from header menu",
        "Select your battle deck from your collection",
        "Challenge other trainers to battles",
        "Use strategy and card abilities to win",
        "Earn rewards and climb the leaderboard",
        "Feature coming soon - stay tuned!",
      ],
    },
    {
      title: "Collection Management",
      icon: Database,
      description: "View and manage your Pokémon card collection",
      steps: [
        "View your collection in Dashboard",
        "See all cards you've collected from opening packs",
        "Filter cards by type, rarity, or pack",
        "View collection statistics and progress",
        "Your collection is automatically saved to Supabase",
        "Access your collection from any device with the same wallet",
      ],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find answers to common questions and learn how to use PokemonTCGDex
        </p>
      </div>

      {/* Guides */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Guides
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <guide.icon className="h-5 w-5" />
                  {guide.title}
                </CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Contact our support team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For technical issues, please include your wallet address and a description of the
            problem. We typically respond within 24-48 hours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

