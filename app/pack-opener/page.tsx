"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackOpeningAnimation from "@/components/pack-opener/PackOpeningAnimation";
import { IPokemon } from "@/app/api/pokemons/route";
import { Package, ArrowLeft, Zap } from "lucide-react";
import { collections } from "@/constants/collections";
import { usePurchasePack } from "@/hooks/usePurchasePack";
import { useWallet } from "@solana/wallet-adapter-react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useCollection } from "@/contexts/CollectionContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { savePackOpening } from "@/services/packOpeningService";
import { isSupabaseConfigured } from "@/lib/supabase";

// Pack pricing based on rarity
// Rare/Legendary packs: Higher price (0.08 - 0.1 SOL)
// Common/Regular packs: Lower price (0.05 - 0.07 SOL)
// Giữ nguyên thứ tự ban đầu, giá trong khoảng 0.05 - 0.1 SOL

const PACKS = [
  {
    id: "mythical-island",
    name: "Mythical Island",
    description: "Mythical Island expansion",
    image: "/mytical-island.png",
    color: "from-green-500 to-emerald-600",
    glowColor: "rgba(34, 197, 94, 0.3)",
    price: 0.06, // Common pack - Fixed price
    rarity: "common",
  },
  {
    id: "a1-mewtwo",
    name: "Genetic Apex Mewtwo",
    description: "Mewtwo pack",
    image: "/mewtwo.jpg",
    color: "from-purple-500 to-pink-600",
    glowColor: "rgba(147, 51, 234, 0.3)",
    price: 0.1, // Rare pack - Fixed price
    rarity: "rare",
  },
  {
    id: "celestial-guardians-lunala",
    name: "Celestial Guardians Lunala",
    description: "Lunala pack",
    image: "/lunala.png",
    color: "from-indigo-500 to-blue-600",
    glowColor: "rgba(99, 102, 241, 0.3)",
    price: 0.09, // Rare pack - Fixed price
    rarity: "rare",
  },
  {
    id: "space-time-smackdown-palkia",
    name: "Space-Time Smackdown Palkia",
    description: "Palkia pack",
    image: "/palkia.png",
    color: "from-blue-500 to-cyan-600",
    glowColor: "rgba(59, 130, 246, 0.3)",
    price: 0.08, // Rare pack - Fixed price
    rarity: "rare",
  },
  {
    id: "a1-pikachu",
    name: "Genetic Apex Pikachu",
    description: "Pikachu pack",
    image: "/pikachu.jpg",
    color: "from-yellow-400 to-amber-500",
    glowColor: "rgba(234, 179, 8, 0.3)",
    price: 0.07, // Common pack - Fixed price
    rarity: "common",
  },
  {
    id: "shining-revelry",
    name: "Shining Revelry",
    description: "Shining Revelry expansion",
    image: "/shining-revelry.png",
    color: "from-purple-500 to-pink-600",
    glowColor: "rgba(168, 85, 247, 0.3)",
    price: 0.06, // Common pack - Fixed price
    rarity: "common",
  },
  {
    id: "celestial-guardians-solgaleo",
    name: "Celestial Guardians Solgaleo",
    description: "Solgaleo pack",
    image: "/solgaleo.png",
    color: "from-indigo-500 to-blue-600",
    glowColor: "rgba(99, 102, 241, 0.3)",
    price: 0.09, // Rare pack - Fixed price
    rarity: "rare",
  },
  {
    id: "triumphant-light",
    name: "Triumphant Light",
    description: "Triumphant Light expansion",
    image: "/triumphant-light.png",
    color: "from-yellow-500 to-amber-600",
    glowColor: "rgba(234, 179, 8, 0.3)",
    price: 0.05, // Common pack - Fixed price
    rarity: "common",
  },
  {
    id: "space-time-smackdown-dialga",
    name: "Space-Time Smackdown Dialga",
    description: "Dialga pack",
    image: "/dialga.png",
    color: "from-blue-500 to-cyan-600",
    glowColor: "rgba(59, 130, 246, 0.3)",
    price: 0.08, // Rare pack - Fixed price
    rarity: "rare",
  },
  {
    id: "a1-charizard",
    name: "Genetic Apex Charizard",
    description: "Charizard pack",
    image: "/charizard.jpg",
    color: "from-red-600 to-orange-700",
    glowColor: "rgba(220, 38, 38, 0.3)",
    price: 0.1, // Rare pack - Fixed price
    rarity: "rare",
  },
  {
    id: "promo-a",
    name: "Promo A",
    description: "Promotional cards",
    image: "/promo.webp",
    color: "from-pink-500 to-rose-600",
    glowColor: "rgba(236, 72, 153, 0.3)",
    price: 0.05, // Common pack - Fixed price
    rarity: "common",
  },
];

export default function PackOpenerPage() {
  // Use fixed prices from PACKS array (no random generation)
  const packsWithPrices = useMemo(() => {
    return PACKS; // Prices are already fixed in PACKS array
  }, []);

  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [packCards, setPackCards] = useState<IPokemon[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [openedCard, setOpenedCard] = useState<IPokemon | null>(null);
  const [purchasedPacks, setPurchasedPacks] = useState<Set<string>>(new Set());
  const [purchaseStatus, setPurchaseStatus] = useState<{
    packId: string | null;
    status: "idle" | "purchasing" | "success" | "error";
    signature?: string;
    transactionId?: string;
    error?: string;
  }>({ packId: null, status: "idle" });

  const { connected, publicKey } = useWallet();
  const { purchasePack, isPurchasing } = usePurchasePack();
  const { addCard, totalCollected } = useCollection();
  const { addNotification } = useNotifications();
  
  // Track previous total to detect milestones
  const prevTotalRef = useRef(totalCollected);
  
  useEffect(() => {
    if (totalCollected > prevTotalRef.current) {
      const newTotal = totalCollected;
      const milestones = [10, 25, 50, 100, 200, 300, 500];
      const achievedMilestone = milestones.find(
        (m) => prevTotalRef.current < m && newTotal >= m
      );
      
      if (achievedMilestone) {
        addNotification({
          type: "achievement",
          title: "Achievement Unlocked!",
          message: `Congratulations! You collected ${achievedMilestone} cards!`,
        });
      }
    }
    prevTotalRef.current = totalCollected;
  }, [totalCollected, addNotification]);

  useEffect(() => {
    if (selectedPack) {
      fetchPackCards(selectedPack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPack]);

  const fetchPackCards = async (packId: string) => {
    try {
      const pack = packsWithPrices.find((p) => p.id === packId);
      if (!pack) return;

      // Use the same logic as album page - filter using collections
      if (!collections[packId]) {
        console.error(`No collection mapping found for pack: ${packId}`);
        setPackCards([]);
        return;
      }

      const response = await fetch(`/api/pokemons?pack=${packId}`);
      const cards: IPokemon[] = await response.json();
      setPackCards(cards);
    } catch (error) {
      console.error("Error fetching pack cards:", error);
      setPackCards([]);
    }
  };

  const handlePurchaseAndOpen = async () => {
    if (!selectedPack) return;
    
    const pack = packsWithPrices.find((p) => p.id === selectedPack);
    if (!pack) return;

    // Check if pack is already purchased
    if (purchasedPacks.has(selectedPack)) {
      handleOpenPack();
      return;
    }

    // Check if wallet is connected
    if (!connected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setPurchaseStatus({ packId: selectedPack, status: "purchasing" });

      // Purchase pack
      const result = await purchasePack({
        packId: selectedPack,
        packName: pack.name,
        price: pack.price || 0.1,
      });

      // Check if user rejected the transaction
      if (result.rejected) {
        setPurchaseStatus({
          packId: selectedPack,
          status: "idle",
        });
        
        // Show friendly notification instead of error
        addNotification({
          type: "system",
          title: "Transaction Cancelled",
          message: "You cancelled the transaction. No charges were made.",
        });
        return;
      }

      // Mark pack as purchased
      setPurchasedPacks((prev) => new Set([...prev, selectedPack]));
      setPurchaseStatus({
        packId: selectedPack,
        status: "success",
        signature: result.signature || undefined,
        transactionId: result.transactionId, // Store transaction ID
      });

      // Add notification for successful purchase
      addNotification({
        type: "pack",
        title: "Pack Purchased!",
        message: `You successfully purchased ${pack.name} for ${pack.price} SOL`,
      });

      // Wait a bit then open pack
      setTimeout(() => {
        handleOpenPack();
      }, 1500);
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string; stack?: string };
      console.error("Error in handlePurchaseAndOpen:", {
        error,
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
        packId: selectedPack,
      });
      
      const errorMessage = err?.message || String(error) || "Purchase failed";
      
      setPurchaseStatus({
        packId: selectedPack,
        status: "error",
        error: errorMessage,
      });
      
      // Show error notification with more details
      addNotification({
        type: "system",
        title: "Purchase Failed",
        message: errorMessage.includes("Wallet not connected") 
          ? "Please connect your wallet first"
          : errorMessage.includes("Merchant wallet")
          ? "Merchant wallet not configured. Please contact support."
          : errorMessage.includes("insufficient")
          ? "Insufficient SOL balance. Please add more SOL to your wallet."
          : errorMessage || "Failed to purchase pack. Please try again.",
      });
    }
  };

  const handleOpenPack = () => {
    if (packCards.length === 0) return;
    setIsOpening(true);
    setOpenedCard(null);
  };

  const handleAnimationComplete = async (card: IPokemon) => {
    setOpenedCard(card);
    setIsOpening(false);
    
    // Get pack name
    const pack = selectedPack ? PACKS.find(p => p.id === selectedPack) : null;
    const packName = pack?.name || "Pack";
    
    // Save to Supabase if configured and wallet is connected
    if (isSupabaseConfigured && connected && publicKey) {
      try {
        const walletAddress = publicKey.toString();
        
        // Use transaction ID from purchase status (already saved during purchase)
        const transactionId = purchaseStatus.transactionId || null;
        
        // Save pack opening to Supabase
        await savePackOpening({
          walletAddress,
          transactionId,
          packId: selectedPack || "",
          packName,
          card,
        });
        
        // Add card to collection in Supabase (this also updates local state via addCard)
        // addCard() will handle both local state update and Supabase save
        await addCard(card, selectedPack || undefined, "pack_opening");
        
        console.log(`✅ Card ${card.name} (${card.id}) saved to Supabase and added to collection`);
      } catch (error) {
        console.error("Error saving pack opening to Supabase:", error);
        // Still add card locally even if Supabase fails
        await addCard(card, selectedPack || undefined, "pack_opening");
      }
    } else {
      // If Supabase not configured, just add to local collection
      await addCard(card, selectedPack || undefined, "pack_opening");
    }
    
    // Add notification for pack opening
    addNotification({
      type: "pack",
      title: "New Card Received!",
      message: `You opened ${packName} and received ${card.name}!`,
    });
  };

  const handleBack = () => {
    setSelectedPack(null);
    setOpenedCard(null);
    setIsOpening(false);
  };

  if (isOpening) {
    return (
      <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/bg_pokemon.jpg)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full h-full">
          <PackOpeningAnimation
            cards={packCards}
            onComplete={handleAnimationComplete}
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  if (openedCard) {
    const getRarityColor = (rarity: string) => {
      if (rarity.includes("◊◊◊◊")) return "from-purple-500 to-pink-500";
      if (rarity.includes("◊◊◊")) return "from-blue-500 to-cyan-500";
      if (rarity.includes("◊◊")) return "from-green-500 to-emerald-500";
      return "from-gray-400 to-gray-600";
    };

    const getTypeColor = (type: string) => {
      const typeLower = type?.toLowerCase() || "";
      const colorMap: Record<string, { bg: string; border: string; text: string }> = {
        grass: {
          bg: "bg-green-500/20",
          border: "border-green-400/50",
          text: "text-green-300"
        },
        fire: {
          bg: "bg-red-500/20",
          border: "border-red-400/50",
          text: "text-red-300"
        },
        water: {
          bg: "bg-blue-500/20",
          border: "border-blue-400/50",
          text: "text-blue-300"
        },
        electric: {
          bg: "bg-yellow-500/20",
          border: "border-yellow-400/50",
          text: "text-yellow-300"
        },
        lightning: {
          bg: "bg-yellow-500/20",
          border: "border-yellow-400/50",
          text: "text-yellow-300"
        },
        psychic: {
          bg: "bg-purple-500/20",
          border: "border-purple-400/50",
          text: "text-purple-300"
        },
        fighting: {
          bg: "bg-orange-500/20",
          border: "border-orange-400/50",
          text: "text-orange-300"
        },
        dark: {
          bg: "bg-gray-800/30",
          border: "border-gray-600/50",
          text: "text-gray-300"
        },
        darkness: {
          bg: "bg-gray-800/30",
          border: "border-gray-600/50",
          text: "text-gray-300"
        },
        steel: {
          bg: "bg-gray-400/20",
          border: "border-gray-300/50",
          text: "text-gray-200"
        },
        fairy: {
          bg: "bg-pink-500/20",
          border: "border-pink-400/50",
          text: "text-pink-300"
        },
        dragon: {
          bg: "bg-indigo-500/20",
          border: "border-indigo-400/50",
          text: "text-indigo-300"
        },
        normal: {
          bg: "bg-gray-500/20",
          border: "border-gray-400/50",
          text: "text-gray-300"
        },
        coach: {
          bg: "bg-amber-500/20",
          border: "border-amber-400/50",
          text: "text-amber-300"
        },
        item: {
          bg: "bg-cyan-500/20",
          border: "border-cyan-400/50",
          text: "text-cyan-300"
        },
        trainer: {
          bg: "bg-teal-500/20",
          border: "border-teal-400/50",
          text: "text-teal-300"
        }
      };

      return colorMap[typeLower] || {
        bg: "bg-gray-500/20",
        border: "border-gray-400/50",
        text: "text-gray-300"
      };
    };

    const typeColors = getTypeColor(openedCard.type);

    return (
      <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed overflow-y-auto" style={{ backgroundImage: 'url(/bg_pokemon.jpg)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full min-h-full">
          <div className="w-full max-w-4xl mx-auto px-4 py-4">
            <Header />
            <div className="mt-4">
              <Button
                onClick={handleBack}
                variant="outline"
                size="sm"
                className="mb-4 bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black text-sm"
              >
                <ArrowLeft className="w-3 h-3 mr-2" />
                Back to Pack Selection
              </Button>
              
              

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-stretch justify-center"
              >
                {/* Card Image - Left Side */}
                <Card
                  className={`bg-transparent border-none ${getRarityColor(openedCard.rarity)} shadow-2xl max-w-xs sm:max-w-sm w-full overflow-hidden flex-shrink-0`}
                >
                  <CardContent className="p-0 h-full">
                    <img
                      src={openedCard.image}
                      alt={openedCard.name}
                      className="w-full h-full object-contain"
                    />
                  </CardContent>
                </Card>

                {/* Card Info - Right Side - Same height as card */}
                <Card className={`${typeColors.bg} backdrop-blur-md border-2 ${typeColors.border} shadow-2xl max-w-lg w-full flex-shrink-0 flex flex-col overflow-y-auto`}>
                  <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className={`text-3xl sm:text-4xl font-bold ${typeColors.text} mb-5 text-center sm:text-left border-b ${typeColors.border} pb-3`}>
                        {openedCard.name}
                      </h3>
                      
                      <div className="space-y-4 mt-4">
                        {/* Rarity - Always visible */}
                        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-300 font-bold text-base">Rarity:</span>
                            <span className="text-yellow-400 font-bold text-lg">{openedCard.rarity}</span>
                          </div>
                        </div>

                        {/* Type - Always visible */}
                        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-300 font-bold text-base">Type:</span>
                            <span className="text-white font-semibold text-base capitalize">{openedCard.type || "Unknown"}</span>
                          </div>
                        </div>

                        {/* HP - Always visible */}
                        {openedCard.health && (
                          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-300 font-bold text-base">HP:</span>
                              <span className="text-white font-semibold text-lg">{openedCard.health}</span>
                            </div>
                          </div>
                        )}

                        {/* Ability */}
                        {openedCard.ability && (
                          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-yellow-300 font-bold text-base">Ability:</span>
                              <span className="text-white/95 font-medium text-sm leading-relaxed">{openedCard.ability}</span>
                            </div>
                          </div>
                        )}

                        {/* Attack */}
                        {openedCard.attack && (
                          <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-yellow-300 font-bold text-base">Attack:</span>
                              <span className="text-white/95 font-medium text-sm leading-relaxed">{openedCard.attack}</span>
                            </div>
                          </div>
                        )}

                        {/* Skill */}
                        {openedCard.skill && (
                          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-yellow-300 font-bold text-base">Skill:</span>
                              <span className="text-white/95 font-medium text-sm leading-relaxed">{openedCard.skill}</span>
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {openedCard.description && (
                          <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-yellow-300 font-bold text-base">Description:</span>
                              <span className="text-white/85 font-normal text-xs italic leading-relaxed">{openedCard.description}</span>
                            </div>
                          </div>
                        )}

                        {/* Battle Stats */}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          {/* Weakness */}
                          {openedCard.weakness && (
                            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-2 text-center">
                              <span className="text-yellow-300 font-semibold text-xs block mb-1">Weakness</span>
                              <span className="text-white font-medium text-xs">{openedCard.weakness}</span>
                            </div>
                          )}

                          {/* Resistance */}
                          {openedCard.resistance && (
                            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-2 text-center">
                              <span className="text-yellow-300 font-semibold text-xs block mb-1">Resistance</span>
                              <span className="text-white font-medium text-xs">{openedCard.resistance}</span>
                            </div>
                          )}

                          {/* Retreat */}
                          {openedCard.retreat && (
                            <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-2 text-center">
                              <span className="text-yellow-300 font-semibold text-xs block mb-1">Retreat</span>
                              <span className="text-white font-medium text-xs">{openedCard.retreat}</span>
                            </div>
                          )}
                        </div>

                        {/* Pack Info */}
                        <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-lg p-3 mt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-300 font-bold text-base">Pack:</span>
                            <span className="text-white font-semibold text-base">{openedCard.pack || "Unknown"}</span>
                          </div>
                        </div>

                        {/* Card ID */}
                        {openedCard.id && (
                          <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-300 font-semibold text-xs">Card ID:</span>
                              <span className="text-white/70 font-mono text-xs">{openedCard.id}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rarity Badge - Pushed to bottom */}
                    <div className="mt-auto pt-4 border-t border-yellow-400/20">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          openedCard.rarity.includes("◊◊◊◊") ? "bg-purple-500/30 text-purple-300 border border-purple-400" :
                          openedCard.rarity.includes("◊◊◊") ? "bg-blue-500/30 text-blue-300 border border-blue-400" :
                          openedCard.rarity.includes("◊◊") ? "bg-green-500/30 text-green-300 border border-green-400" :
                          "bg-gray-500/30 text-gray-300 border border-gray-400"
                        }`}>
                          {openedCard.rarity.includes("◊◊◊◊") ? "ULTRA RARE" :
                           openedCard.rarity.includes("◊◊◊") ? "RARE" :
                           openedCard.rarity.includes("◊◊") ? "UNCOMMON" :
                           "COMMON"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="mt-4 text-center">
                <Button
                  onClick={handleBack}
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-4 py-2 rounded-full shadow-lg text-sm"
                >
                  Open Another Pack
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .pack-opener-scroll::-webkit-scrollbar {
          width: 12px;
        }
        .pack-opener-scroll::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        .pack-opener-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(168, 85, 247, 0.8), rgba(59, 130, 246, 0.8));
          border-radius: 10px;
          border: 2px solid rgba(15, 23, 42, 0.3);
        }
        .pack-opener-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(168, 85, 247, 1), rgba(59, 130, 246, 1));
        }
        .pack-opener-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, 0.8) rgba(15, 23, 42, 0.3);
        }
      `}</style>
        <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed overflow-y-auto pack-opener-scroll" style={{ backgroundImage: 'url(/bg_pokemon.jpg)' }}>
          <div className="fixed inset-0 bg-black/40"></div>
          <div className="relative z-10 w-full min-h-full" style={{ overflow: 'visible' }}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32" style={{ overflow: 'visible' }}>
            <Header />

            {!selectedPack ? (
              <div className="w-full max-w-7xl mx-auto px-4 mt-8 pt-4" style={{ overflow: 'visible' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-8" style={{ overflow: 'visible' }}>
                  {packsWithPrices.map((pack, index) => (
                    <motion.div
                      key={pack.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ scale: 1.05, y: -10, zIndex: 50 }}
                      className="relative w-full py-4 px-2"
                      style={{ 
                        transformOrigin: 'center center',
                      }}
                    >
                      <Card
                        className="bg-transparent border-none transition-all duration-300 cursor-pointer group w-full h-full"
                        onClick={() => setSelectedPack(pack.id)}
                        style={{ 
                          transform: 'translateZ(0)',
                        }}
                      >                   
                        <CardHeader className="p-0 relative z-10">
                          <div className="relative h-80 w-full flex items-center justify-center" style={{ overflow: 'visible' }}>
                            <img
                              src={pack.image}
                              alt={pack.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                              style={{ maxHeight: '100%' }}
                            />
                          </div>
                        </CardHeader>

                        {/* Hover effect indicator */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-yellow-400 text-sm font-semibold flex items-center gap-2"
                          >
                            Click to Open
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </motion.div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="sm"
                  className="mb-6 bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black text-sm"
                >
                  <ArrowLeft className="w-3 h-3 mr-2" />
                  Back to Pack Selection
                </Button>
                
                {(() => {
                  const pack = packsWithPrices.find((p) => p.id === selectedPack);
                  return (
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-stretch justify-center">
                      {/* Pack Image - Left Side */}
                      <Card 
                        className={`bg-transparent border-none ${pack?.color} shadow-2xl max-w-[200px] sm:max-w-[250px] w-full overflow-hidden flex-shrink-0`}
                        style={{
                          boxShadow: `0 0 40px ${pack?.glowColor || "rgba(168, 85, 247, 0.3)"}`,
                        }}
                      >
                        <CardContent className="p-0 h-full">
                          <img
                            src={pack?.image}
                            alt={pack?.name}
                            className="w-full h-full object-contain"
                          />
                        </CardContent>
                      </Card>

                      {/* Pack Info - Right Side */}
                      <Card 
                        className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-white/20 backdrop-blur-xl shadow-2xl max-w-sm w-full flex-shrink-0 flex flex-col`}
                      >
                        <div className="relative flex-1 flex flex-col">
                          <div className={`absolute inset-0 bg-gradient-to-br ${pack?.color} opacity-10`}></div>
                          
                          <CardHeader className="text-center pb-3 relative z-10 pt-4 px-4">
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <CardTitle className={`text-2xl sm:text-3xl font-extrabold mb-2 bg-gradient-to-r ${pack?.color} bg-clip-text text-transparent`}>
                                {pack?.name}
                              </CardTitle>
                              {pack?.description && (
                                <p className="text-white/70 text-xs mt-1">
                                  {pack.description}
                                </p>
                              )}
                            </motion.div>
                          </CardHeader>
                          
                          <CardContent className="text-center pb-4 relative z-10 flex flex-col flex-1 justify-between px-4">
                            <div className="flex-1">
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/90 text-sm sm:text-base mb-4 leading-relaxed"
                              >
                                Ready to open? Watch 20 cards scroll by and discover your card!
                              </motion.p>

                              {packCards.length > 0 && (
                                <div className="mb-4 p-2 bg-white/5 rounded-lg border border-white/10">
                                  <p className="text-white/80 text-xs font-semibold">
                                    {packCards.length} cards available in this pack
                                  </p>
                                </div>
                              )}

                              {packCards.length === 0 && (
                                <motion.div 
                                  className="mb-4 p-2 bg-yellow-500/10 rounded-lg border border-yellow-400/30"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <p className="text-yellow-300 text-xs font-semibold">
                                    Loading cards...
                                  </p>
                                </motion.div>
                              )}
                            </div>

                            <div className="mt-4 space-y-3">
                              {/* Price Display */}
                              {pack?.price && (
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 mb-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white/70 text-sm">Price:</span>
                                    <span className="text-yellow-400 font-bold text-lg">
                                      {pack.price} SOL
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Purchase Status */}
                              {purchaseStatus.packId === selectedPack && (
                                <div className="mb-3">
                                  {purchaseStatus.status === "purchasing" && (
                                    <div className="flex items-center gap-2 text-yellow-300 text-sm">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Processing payment...
                                    </div>
                                  )}
                                  {purchaseStatus.status === "success" && (
                                    <div className="flex items-center gap-2 text-green-300 text-sm">
                                      <CheckCircle2 className="w-4 h-4" />
                                      Purchase successful! Opening pack...
                                    </div>
                                  )}
                                  {purchaseStatus.status === "error" && (
                                    <div className="flex items-center gap-2 text-red-300 text-sm">
                                      <AlertCircle className="w-4 h-4" />
                                      {purchaseStatus.error || "Purchase failed"}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Purchase/Open Button */}
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {purchasedPacks.has(selectedPack) ? (
                                  <Button
                                    onClick={handleOpenPack}
                                    size="lg"
                                    disabled={packCards.length === 0 || isOpening}
                                    className={`bg-gradient-to-r ${pack?.color} hover:opacity-90 text-white font-bold text-base sm:text-lg px-6 py-4 rounded-lg shadow-xl border-2 border-white/20 transition-all duration-300 w-full`}
                                  >
                                    <Package className="w-4 h-4 mr-2" />
                                    Open Pack Now!
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={handlePurchaseAndOpen}
                                    size="lg"
                                    disabled={!connected || packCards.length === 0 || isPurchasing || purchaseStatus.status === "purchasing"}
                                    className={`bg-gradient-to-r ${pack?.color} hover:opacity-90 text-white font-bold text-base sm:text-lg px-6 py-4 rounded-lg shadow-xl border-2 border-white/20 transition-all duration-300 w-full`}
                                  >
                                    {isPurchasing || purchaseStatus.status === "purchasing" ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Purchasing...
                                      </>
                                    ) : !connected ? (
                                      <>
                                        <Zap className="w-4 h-4 mr-2" />
                                        Connect Wallet to Purchase
                                      </>
                                    ) : (
                                      <>
                                        <Zap className="w-4 h-4 mr-2" />
                                        Purchase & Open Pack
                                      </>
                                    )}
                                  </Button>
                                )}
                              </motion.div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </div>
          </div>
        </div>
    </>
  );
}
