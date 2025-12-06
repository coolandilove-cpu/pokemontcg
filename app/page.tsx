"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Search } from "lucide-react";
import { ChevronRight, Bookmark, Star, BookOpen, Trophy } from "lucide-react";
import Header from "@/components/header";
import { useCollection } from "@/contexts/CollectionContext";
import { useRouter } from "next/navigation";
import DialogImportLocalStorageCards from "@/modules/home/components/DialogImportLocalStorageCards";
import pokemons from "@/app/api/pokemons/pokemons.json";

export default function HomePage() {
  const router = useRouter();
  const { totalCollected, collectedCards } = useCollection();

  // Calculate statistics from collected cards only
  const totalCardsAvailable = pokemons.length;
  const percentComplete = totalCollected > 0 
    ? Math.round((totalCollected / totalCardsAvailable) * 100 * 10) / 10 
    : 0;
  
  // Count shiny pokemon from collected cards
  // Note: This would need to check actual card data, for now set to 0
  const shinyPokemon = 0;

  // Calculate progress for each pack based on collected cards
  const calculatePackProgress = (packIds: string[]) => {
    const packCards = pokemons.filter(p => packIds.includes(p.pack));
    const collectedPackCards = Array.from(collectedCards).filter(cardId => {
      const card = pokemons.find(p => p.id === cardId);
      return card && packIds.includes(card.pack);
    });
    return packCards.length > 0 
      ? Math.round((collectedPackCards.length / packCards.length) * 100)
      : 0;
  };

  const albumCollections = [
    {
      id: "genetic-apex",
      name: "Genetic Apex",
      color: "bg-purple-500",
      description: "The first collection released for Pokémon TCG Pocket",
      progress: calculatePackProgress(["GeneticApex", "Charizard", "Mewtwo", "Pikachu"]),
      cover: "/charizard.jpg",
    },
    {
      id: "mythical-island",
      name: "Mythical Island",
      color: "bg-green-500",
      description:
        "The first themed booster pack and the second general expansion",
      progress: calculatePackProgress(["MythicalIsland"]),
      cover: "/mytical-island.png",
    },
    {
      id: "space-time-smackdown",
      name: "Space-Time Smackdown",
      color: "bg-blue-500",
      description: "The second main expansion and third general expansion",
      progress: calculatePackProgress(["SpaceTiming", "Dialga", "Palkia"]),
      cover: "/dialga.png",
    },
    {
      id: "triumphant-light",
      name: "Triumphant Light",
      color: "bg-yellow-500",
      description:
        "The second themed booster pack and the fourth general expansion",
      progress: calculatePackProgress(["TriumphantLight"]),
      cover: "/triumphant-light.png",
    },
    {
      id: "shining-revelry",
      name: "Shining Revelry",
      color: "bg-gray-500",
      description:
        "The third themed booster pack and the fifth general expansion",
      progress: calculatePackProgress(["ShiningRevelry"]),
      cover: "/shining-revelry.png",
    },
    {
      id: "celestial-guardians",
      name: "Celestial Guardians",
      color: "bg-blue-500",
      description: "The third main expansion and sixth general expansion",
      progress: calculatePackProgress(["CelestialGuardians", "Solgaleo", "Lunala"]),
      cover: "/solgaleo.png",
    },
    {
      id: "promo-a",
      name: "Promo A",
      color: "bg-pink-500",
      description: "Promotional and special cards",
      progress: calculatePackProgress(["Promo"]),
      cover: "/promo.webp",
    },
  ];

  return (
    <div className="overflow-auto w-screen font-sans">
      <div className="container mx-auto px-8 ">
        <Header />
      </div>

      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-4/6">
              <h2 className="text-4xl font-bold mb-4">
                Your Digital Pokémon TCG Pocket Album
              </h2>
              <p className="text-xl mb-6">
                Collect, organize and share your Pokémon TCG Pocket collection
                with trainers from around the world!
              </p>
              <p className="text-xl md:flex hidden items-center gap-2">
                <ArrowLeft />
                Click on one of the collections on the side to start exploring!
              </p>
            </div>
            <div className="md:w-2/6 flex justify-center">
              <img
                src="/pokedex.png"
                alt="Pokémon Album Showcase"
                className="w-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Always show, display 0 if no cards collected */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Your Pokémon Journey
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-blue-600">
                  {totalCollected}
                </CardTitle>
                <CardDescription>Pokémon Collected</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-green-600">
                  {percentComplete}%
                </CardTitle>
                <CardDescription>Total Progress</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Progress value={percentComplete} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-none shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-yellow-600">
                  {shinyPokemon}
                </CardTitle>
                <CardDescription>Shiny Collected</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Your Collections</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albumCollections.map((collection) => (
              <Card
                key={collection.id}
                className={`overflow-hidden transition-all hover:shadow-lg`}
              >
                <div className={`h-1.5 ${collection.color}`}></div>
                <div className="p-6 flex gap-4">
                  <img
                    src={collection.cover}
                    alt={collection.name}
                    className="w-24 h-48 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{collection.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {collection.description}
                    </p>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">
                          {collection.progress}%
                        </span>
                      </div>
                      <Progress value={collection.progress} className="h-1.5" />
                    </div>
                    <Button
                      size="sm"
                      className={collection.color}
                      onClick={() => router.push(`/${collection.id}`)}
                    >
                      <BookOpen size={16} className="mr-1" />
                      Open Album
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/pokedex.png"
                  alt="PokéAlbum Logo"
                  className="w-10 h-10"
                />
                <h2 className="text-xl font-bold">PokémonTCGDEX</h2>
              </div>
              <p className="text-gray-400">
                Your platform to collect, organize and share your Pokémon TCG
                Pocket collection with friends and other trainers.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
              <p className="text-gray-400 text-sm">
                © 2025 PokémonTCGDEX. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                <a
                  href="https://x.com/pokemontcgdex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white fill-current"
                    aria-label="X"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                <a
                  href="https://discord.gg/xFGJDB44"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white fill-current"
                    aria-label="Discord"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <DialogImportLocalStorageCards />
    </div>
  );
}
