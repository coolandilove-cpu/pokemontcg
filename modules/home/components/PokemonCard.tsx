"use client";

import dynamic from "next/dynamic";

import { IPokemon } from "@/app/api/pokemons/route";
const Card = dynamic(() => import("@/components/card"));

import { usePokemonCard } from "../hooks/usePokemonCard";
import { useCollection } from "@/contexts/CollectionContext";

interface IPokemonCardProps {
  pokemon: IPokemon;
  claimedPokemons: string[];
}

const PokemonCard = ({ pokemon, claimedPokemons }: IPokemonCardProps) => {
  const { hasCard } = useCollection();
  const {
    boosterPackSrc,
  } = usePokemonCard({ pokemon, claimedPokemons });

  // Check if card is in collection (only from pack opening, not manual claim)
  const isInCollection = hasCard(pokemon.id);

  // In album, cards are view-only - no claim/release functionality
  // Only cards opened from packs are in collection
  return (
    <Card
      src={pokemon.image}
      name={pokemon.name}
      rarity={pokemon.rarity}
      type={pokemon.type}
      hasGrayScale={!isInCollection}
      boosters={!isInCollection ? boosterPackSrc : undefined}
    />
  );
};

export default PokemonCard;
