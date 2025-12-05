"use server";

import PokemonStatistics from "./components/PokemonStatistics";
import { IPokemon } from "@/app/api/pokemons/route";
import PokemonList from "./components/PokemonList";

const HomePage = async () => {
  const response = await fetch(
    `${process.env.API_URL}/api/pokemons?pack=geneticApex`
  );

  if (!response.ok) {
      return <div>Error loading pokemons</div>;
  }

  const data: IPokemon[] = await response?.json();

  return (
    <section className="flex justify-start flex-col gap-8">
      <div className="flex justify-start flex-col">
        <h1 className="text-4xl font-bold text-slate-800  font-sans">
          Pokémon TCG Pocket Card Collection
        </h1>

        <h2 className="font-sans text-xl text-slate-600 pb-8">
          These are your statistics (cards obtained from the pack / total
          cards in the pack), update the data by clicking on the cards below to
          find out which packs to open to complete the collection.
        </h2>

        <PokemonStatistics collection="geneticApex" />
      </div>

      <main className="flex flex-col items-center gap-10">
        <PokemonList data={data} />
      </main>
    </section>
  );
};

export default HomePage;
