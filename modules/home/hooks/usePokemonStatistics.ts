import { useEffect, useState, useMemo } from "react";

import {
  charizardBoosterCards,
  mewtwoBoosterCards,
  mythicalIslandCards,
  pickachuBoosterCards,
} from "@/constants/boosterCards";
import { useCollection } from "@/contexts/CollectionContext";
import pokemons from "@/app/api/pokemons/pokemons.json";

const dialgaBoosterCards = pokemons
  .filter((pokemon) => ["SpaceTiming", "Dialga"].includes(pokemon.pack))
  .map((pokemon) => pokemon.id);
const palkiaBoosterCards = pokemons
  .filter((pokemon) => ["SpaceTiming", "Palkia"].includes(pokemon.pack))
  .map((pokemon) => pokemon.id);

const triumphantLightCards = pokemons
  .filter((pokemon) => ["TriumphantLight"].includes(pokemon.pack))
  .map((pokemon) => pokemon.id);

const promoCards = pokemons
  .filter((pokemon) => ["Promo"].includes(pokemon.pack))
  .map((pokemon) => pokemon.id);

const shiningRevelryBoosterCards = pokemons
  .filter((pokemon) => ["ShiningRevelry"].includes(pokemon.pack))
  .map((pokemon) => pokemon.id);

const solgaleoBoosterCards = pokemons
  .filter((pokemon) =>
    ["CelestialGuardians", "Solgaleo"].includes(pokemon.pack)
  )
  .map((pokemon) => pokemon.id);

const lunalaBoosterCards = pokemons
  .filter((pokemon) => ["CelestialGuardians", "Lunala"].includes(pokemon.pack))
  .map((pokemon) => pokemon.id);

export const usePokemonStatistics = () => {
  const { collectedCards } = useCollection();

  const [charizardBoosterCardsObtained, setCharizardBoosterCardsObtained] =
    useState<string[]>([]);

  const [mewtwoBoosterCardsObtained, setMewtwoBoosterCardsObtained] = useState<
    string[]
  >([]);

  const [pickachuBoosterCardsObtained, setPickachuBoosterCardsObtained] =
    useState<string[]>([]);

  const [mythicalIslandCardsObtained, setMythicalIslandCardsCardsObtained] =
    useState<string[]>([]);

  const [dialgaBoosterCardsObtained, setDialgaBoosterCardsObtained] = useState<
    string[]
  >([]);

  const [palkiaBoosterCardsObtained, setPalkiaBoosterCardsObtained] = useState<
    string[]
  >([]);

  const [
    triumphantLightBoosterCardsObtained,
    setTriumphantLightBoosterCardsObtained,
  ] = useState<string[]>([]);

  const [promoBoosterCardsObtained, setPromoBoosterCardsObtained] = useState<
    string[]
  >([]);

  const [
    shiningRevelryBoosterCardsObtained,
    setShiningRevelryBoosterCardsObtained,
  ] = useState<string[]>([]);

  const [solgaleoBoosterCardsObtained, setSolgaleoBoosterCardsObtained] =
    useState<string[]>([]);

  const [lunalaBoosterCardsObtained, setLunalaBoosterCardsObtained] = useState<
    string[]
  >([]);

  const [totalCollected, setTotalCollected] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  const [fullArtPokemon, setFullArtPokemon] = useState(0);
  const [shinyPokemon, setShinyPokemon] = useState(0);

  useEffect(() => {
    // Convert Set to Array for filtering
    const collectedCardsArray = Array.from(collectedCards);

    setCharizardBoosterCardsObtained(
      collectedCardsArray.filter((card) => charizardBoosterCards.includes(card))
    );

    setPickachuBoosterCardsObtained(
      collectedCardsArray.filter((card) => pickachuBoosterCards.includes(card))
    );

    setMewtwoBoosterCardsObtained(
      collectedCardsArray.filter((card) => mewtwoBoosterCards.includes(card))
    );

    setMythicalIslandCardsCardsObtained(
      collectedCardsArray.filter((card) => mythicalIslandCards.includes(card))
    );

    setDialgaBoosterCardsObtained(
      collectedCardsArray.filter((card) => dialgaBoosterCards.includes(card))
    );

    setPalkiaBoosterCardsObtained(
      collectedCardsArray.filter((card) => palkiaBoosterCards.includes(card))
    );

    setTriumphantLightBoosterCardsObtained(
      collectedCardsArray.filter((card) => triumphantLightCards.includes(card))
    );

    setPromoBoosterCardsObtained(
      collectedCardsArray.filter((card) => promoCards.includes(card))
    );

    setShiningRevelryBoosterCardsObtained(
      collectedCardsArray.filter((card) =>
        shiningRevelryBoosterCards.includes(card)
      )
    );

    setSolgaleoBoosterCardsObtained(
      collectedCardsArray.filter((card) => solgaleoBoosterCards.includes(card))
    );
    setLunalaBoosterCardsObtained(
      collectedCardsArray.filter((card) => lunalaBoosterCards.includes(card))
    );

    setTotalCollected(collectedCardsArray.length);
    setPercentComplete(
      Math.round((collectedCardsArray.length / pokemons.length) * 100)
    );

    setFullArtPokemon(
      collectedCardsArray.filter((card) => {
        const pokemon = pokemons.find((p) => p.id === card);
        return !pokemon?.rarity.startsWith("◊") && pokemon?.rarity !== "";
      }).length
    );

    setShinyPokemon(
      collectedCardsArray.filter((card) => {
        const pokemon = pokemons.find((p) => p.id === card);
        return pokemon?.rarity.startsWith("★");
      }).length
    );
  }, [collectedCards]);

  // Calculate progress values directly from collectedCards using useMemo for accuracy
  const progressValues = useMemo(() => {
    const collectedCardsArray = Array.from(collectedCards);
    
    const charizardObtained = collectedCardsArray.filter((card) => charizardBoosterCards.includes(card)).length;
    const mewtwoObtained = collectedCardsArray.filter((card) => mewtwoBoosterCards.includes(card)).length;
    const pikachuObtained = collectedCardsArray.filter((card) => pickachuBoosterCards.includes(card)).length;
    const mythicalIslandObtained = collectedCardsArray.filter((card) => mythicalIslandCards.includes(card)).length;
    const dialgaObtained = collectedCardsArray.filter((card) => dialgaBoosterCards.includes(card)).length;
    const palkiaObtained = collectedCardsArray.filter((card) => palkiaBoosterCards.includes(card)).length;
    const triumphantLightObtained = collectedCardsArray.filter((card) => triumphantLightCards.includes(card)).length;
    const promoObtained = collectedCardsArray.filter((card) => promoCards.includes(card)).length;
    const shiningRevelryObtained = collectedCardsArray.filter((card) => shiningRevelryBoosterCards.includes(card)).length;
    const solgaleoObtained = collectedCardsArray.filter((card) => solgaleoBoosterCards.includes(card)).length;
    const lunalaObtained = collectedCardsArray.filter((card) => lunalaBoosterCards.includes(card)).length;

    const geneticApexTotal = charizardBoosterCards.length + mewtwoBoosterCards.length + pickachuBoosterCards.length;
    const geneticApexObtained = charizardObtained + mewtwoObtained + pikachuObtained;
    
    const spaceTimeTotal = dialgaBoosterCards.length + palkiaBoosterCards.length;
    const spaceTimeObtained = dialgaObtained + palkiaObtained;
    
    const celestialGuardiansTotal = solgaleoBoosterCards.length + lunalaBoosterCards.length;
    const celestialGuardiansObtained = solgaleoObtained + lunalaObtained;

    return {
      geneticApexProgress: geneticApexTotal > 0 
        ? Math.round((geneticApexObtained / geneticApexTotal) * 100)
        : 0,
      mythicalIslandProgress: mythicalIslandCards.length > 0
        ? Math.round((mythicalIslandObtained / mythicalIslandCards.length) * 100)
        : 0,
      spaceTimeSmackdownProgress: spaceTimeTotal > 0
        ? Math.round((spaceTimeObtained / spaceTimeTotal) * 100)
        : 0,
      triumphantLightProgress: triumphantLightCards.length > 0
        ? Math.round((triumphantLightObtained / triumphantLightCards.length) * 100)
        : 0,
      promoAProgress: promoCards.length > 0
        ? Math.round((promoObtained / promoCards.length) * 100)
        : 0,
      shiningRevelryProgress: shiningRevelryBoosterCards.length > 0
        ? Math.round((shiningRevelryObtained / shiningRevelryBoosterCards.length) * 100)
        : 0,
      celestialGuardiansProgress: celestialGuardiansTotal > 0
        ? Math.round((celestialGuardiansObtained / celestialGuardiansTotal) * 100)
        : 0,
    };
  }, [collectedCards]);

  return {
    charizardBoosterCardsObtained,
    charizardBoosterCards,

    mewtwoBoosterCardsObtained,
    mewtwoBoosterCards,

    pickachuBoosterCardsObtained,
    pickachuBoosterCards,

    mythicalIslandCardsObtained,
    mythicalIslandCards,

    dialgaBoosterCardsObtained,
    dialgaBoosterCards,

    palkiaBoosterCardsObtained,
    palkiaBoosterCards,

    triumphantLightBoosterCardsObtained,
    triumphantLightCards,

    promoBoosterCardsObtained,
    promoCards,

    shiningRevelryBoosterCardsObtained,
    shiningRevelryBoosterCards,

    solgaleoBoosterCardsObtained,
    solgaleoBoosterCards,

    lunalaBoosterCardsObtained,
    lunalaBoosterCards,

    totalCollected,
    percentComplete,
    fullArtPokemon,
    shinyPokemon,

    ...progressValues,
  };
};
