"use client";

import { useState, useEffect, useRef } from "react";
import { IPokemon } from "@/app/api/pokemons/route";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PackOpeningAnimationProps {
  cards: IPokemon[];
  onComplete: (openedCard: IPokemon) => void;
  onBack: () => void;
}

// Rarity weights for pack opening (similar to real TCG packs)
const RARITY_WEIGHTS = {
  "◊": 0.5, // Common - 50%
  "◊◊": 0.3, // Uncommon - 30%
  "◊◊◊": 0.15, // Rare - 15%
  "◊◊◊◊": 0.05, // Ultra Rare - 5%
};

// Get rarity color based on rarity symbol
const getRarityColor = (rarity: string) => {
  if (rarity.includes("◊◊◊◊")) return "from-purple-500 via-pink-500 to-purple-600";
  if (rarity.includes("◊◊◊")) return "from-blue-500 via-cyan-500 to-blue-600";
  if (rarity.includes("◊◊")) return "from-green-500 via-emerald-500 to-green-600";
  return "from-gray-400 via-gray-500 to-gray-600";
};

// Get rarity glow color
const getRarityGlow = (rarity: string) => {
  if (rarity.includes("◊◊◊◊")) return "shadow-[0_0_40px_rgba(168,85,247,0.8)]";
  if (rarity.includes("◊◊◊")) return "shadow-[0_0_40px_rgba(59,130,246,0.8)]";
  if (rarity.includes("◊◊")) return "shadow-[0_0_40px_rgba(34,197,94,0.8)]";
  return "shadow-[0_0_40px_rgba(156,163,175,0.8)]";
};

// Randomly select 1 card from pack with rarity weights
const selectPackCard = (allCards: IPokemon[]): IPokemon => {
  const cardsByRarity = {
    "◊": allCards.filter((c) => c.rarity === "◊"),
    "◊◊": allCards.filter((c) => c.rarity === "◊◊"),
    "◊◊◊": allCards.filter((c) => c.rarity === "◊◊◊"),
    "◊◊◊◊": allCards.filter((c) => c.rarity === "◊◊◊◊"),
  };

  const rand = Math.random();
  let selectedRarity: keyof typeof RARITY_WEIGHTS;

  if (rand < RARITY_WEIGHTS["◊◊◊◊"]) {
    selectedRarity = "◊◊◊◊";
  } else if (rand < RARITY_WEIGHTS["◊◊◊◊"] + RARITY_WEIGHTS["◊◊◊"]) {
    selectedRarity = "◊◊◊";
  } else if (
    rand <
    RARITY_WEIGHTS["◊◊◊◊"] +
      RARITY_WEIGHTS["◊◊◊"] +
      RARITY_WEIGHTS["◊◊"]
  ) {
    selectedRarity = "◊◊";
  } else {
    selectedRarity = "◊";
  }

  const rarityCards = cardsByRarity[selectedRarity];
  if (rarityCards.length > 0) {
    return rarityCards[Math.floor(Math.random() * rarityCards.length)];
  }
  
  // Fallback to any card if rarity pool is empty
  return allCards[Math.floor(Math.random() * allCards.length)];
};

// Generate 20 random cards for animation
const generateAnimationCards = (allCards: IPokemon[], finalCard: IPokemon): IPokemon[] => {
  const animationCards: IPokemon[] = [];
  const usedCardIds = new Set<string>();
  
  // First, randomly select position for final card (0-19)
  const finalCardPosition = Math.floor(Math.random() * 20);
  
  // Generate 19 random cards (excluding the final card)
  const otherCards = allCards.filter(card => card.id !== finalCard.id);
  
  // Fill with random cards
  while (animationCards.length < 20) {
    if (animationCards.length === finalCardPosition) {
      // Insert final card at the random position
      animationCards.push(finalCard);
      usedCardIds.add(finalCard.id);
    } else {
      // Add a random card from other cards
      if (otherCards.length === 0) break; // Safety check
      
      const randomIndex = Math.floor(Math.random() * otherCards.length);
      const randomCard = otherCards[randomIndex];
      
      // Add card if not already used (allow duplicates if pack is small)
      if (!usedCardIds.has(randomCard.id) || animationCards.length < 10) {
        animationCards.push(randomCard);
        usedCardIds.add(randomCard.id);
      } else {
        // If we've used all unique cards, allow duplicates
        animationCards.push(randomCard);
      }
    }
  }
  
  return animationCards;
};

export default function PackOpeningAnimation({
  cards,
  onComplete,
  onBack,
}: PackOpeningAnimationProps) {
  const [animationCards, setAnimationCards] = useState<IPokemon[]>([]);
  const [finalCard, setFinalCard] = useState<IPokemon | null>(null);
  const [isScrolling, setIsScrolling] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // First, randomly select 1 card from all cards in the pack (with rarity weights)
    const selected = selectPackCard(cards);
    setFinalCard(selected);

    // Then generate 20 animation cards including the final card at a random position
    const cardsForAnimation = generateAnimationCards(cards, selected);
    setAnimationCards(cardsForAnimation);

    // Start horizontal scrolling animation
    const startTime = Date.now();
    const scrollDuration = 5000; // 5 seconds of scrolling to show all 20 cards
    const cardWidth = 280; // Width of each card including gap
    const totalDistance = 19 * cardWidth; // Distance to scroll (19 cards to show all 20)

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      
      // Ease out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentPosition = easeOut * totalDistance;
      
      setScrollPosition(currentPosition);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete, reveal the final card
        setIsScrolling(false);
        setTimeout(() => {
          setIsRevealed(true);
          setTimeout(() => {
            onComplete(selected);
          }, 2000);
        }, 500);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cards, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent relative overflow-hidden">

      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h2
            className="text-5xl font-bold text-yellow-400 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isRevealed ? "🎉 Congratulations! 🎉" : "Opening Pack..."}
          </motion.h2>
          <p className="text-yellow-400 text-xl">
            {isRevealed
              ? "You got an amazing card!"
              : "20 random cards are being revealed..."}
          </p>
        </div>

        {/* Card scrolling container */}
        <div className="relative mb-12">
          {/* Cards container */}
          <div
            ref={containerRef}
            className="relative h-[400px] overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <div
              className="flex gap-6 h-full items-center"
              style={{
                transform: `translateX(calc(50vw - 140px - ${scrollPosition}px))`,
                transition: isScrolling ? "none" : "transform 0.5s ease-out",
              }}
            >
              {animationCards.map((card, index) => {
                const isFinal = card.id === finalCard?.id;
                const isCenter = !isScrolling && isFinal;
                const cardPosition = index * 280; // Position of this card
                const isVisible = Math.abs(scrollPosition - cardPosition) < 400;

                return (
                  <motion.div
                    key={`${card.id}-${index}`}
                    className={`relative flex-shrink-0 ${
                      isCenter ? "z-30" : "z-10"
                    }`}
                    style={{
                      width: "280px",
                      height: "380px",
                    }}
                    animate={{
                      scale: isCenter ? 1.15 : isRevealed && isFinal ? 1.2 : isVisible ? 1 : 0.8,
                      opacity: isCenter || isRevealed ? 1 : isVisible ? 0.9 : 0.5,
                      y: isCenter ? -20 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`relative w-full h-full rounded-2xl overflow-hidden ${
                        isCenter && isRevealed
                          ? `bg-gradient-to-br ${getRarityColor(card.rarity)} ${getRarityGlow(card.rarity)} ring-4 ring-yellow-400`
                          : isFinal
                          ? `bg-gradient-to-br ${getRarityColor(card.rarity)}`
                          : "bg-gradient-to-br from-gray-800 to-gray-900"
                      } shadow-2xl`}
                      style={{
                        transform: isCenter
                          ? "perspective(1000px) rotateY(0deg)"
                          : "perspective(1000px) rotateY(15deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Always show card image */}
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Card info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 text-center">
                        <p className="text-white font-bold text-sm mb-1">
                          {card.name}
                        </p>
                        <p className={`text-xs font-semibold ${
                          card.rarity.includes("◊◊◊◊") ? "text-purple-300" :
                          card.rarity.includes("◊◊◊") ? "text-blue-300" :
                          card.rarity.includes("◊◊") ? "text-green-300" :
                          "text-gray-300"
                        }`}>
                          {card.rarity}
                        </p>
                      </div>
                      
                      {/* Highlight effect for final card when revealed */}
                      {isRevealed && isFinal && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-pink-500/20 to-purple-500/20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isScrolling && (
          <motion.div
            className="text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="inline-flex items-center gap-2 text-white/70">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
          </motion.div>
        )}

        {/* Back button */}
        <div className="mt-8 text-center">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
            disabled={isScrolling}
          >
            {isScrolling ? "Opening..." : "Back"}
          </Button>
        </div>
      </div>
    </div>
  );
}
