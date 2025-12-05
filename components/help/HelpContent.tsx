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
        "Go to the 'Trade' page from the header menu. You can view pending trades, create new trade offers, or accept trade requests from other users. Make sure both parties have connected their wallets.",
    },
    {
      question: "Where is my collection stored?",
      answer:
        "Your collection is stored locally in your browser's localStorage, associated with your wallet address. This means your collection is tied to your wallet and will persist across sessions. You can export your collection from Settings for backup.",
    },
    {
      question: "Can I transfer my collection to another device?",
      answer:
        "Yes! Go to Settings > Collection and use the 'Export Collection' button to download a JSON file. Then on your other device, use 'Import Collection' to restore your collection. Make sure you're using the same wallet address.",
    },
    {
      question: "What networks are supported?",
      answer:
        "The application supports both Solana Mainnet and Devnet. By default, it uses Mainnet for production. You can switch to Devnet for testing by setting NEXT_PUBLIC_SOLANA_NETWORK=devnet in your environment variables.",
    },
    {
      question: "How do I view my transaction history?",
      answer:
        "Go to Dashboard > Transactions to view all your transactions. You can filter by 'All', 'Received', or 'Sent' transactions. The history shows pack purchases, trades, and other SOL transfers.",
    },
    {
      question: "What happens if I disconnect my wallet?",
      answer:
        "If you disconnect your wallet, your collection data remains stored locally but won't be accessible until you reconnect the same wallet address. Your collection is tied to your wallet address, so make sure to use the same wallet when reconnecting.",
    },
  ];

  const guides = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of using PokéAlbum",
      steps: [
        "Install a Solana wallet extension (Phantom recommended)",
        "Connect your wallet to the application",
        "Browse available card packs and collections",
        "Purchase packs using SOL",
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
      description: "How to trade cards with other users",
      steps: [
        "Navigate to the Trade page",
        "View available trade offers",
        "Create a new trade by selecting cards to offer",
        "Specify cards you want to receive",
        "Wait for the other party to accept",
        "Complete the trade transaction",
      ],
    },
    {
      title: "Collection Management",
      icon: Database,
      description: "Manage and backup your collection",
      steps: [
        "View your collection in Dashboard > Cards",
        "Filter cards by type, rarity, or pack",
        "Export your collection for backup",
        "Import collection to restore on another device",
        "Clear collection if needed (use with caution)",
      ],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find answers to common questions and learn how to use PokéAlbum
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

