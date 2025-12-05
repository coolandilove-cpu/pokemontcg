import PokemonStatistics from "@/modules/home/components/PokemonStatistics";
import { IPokemon } from "../api/pokemons/route";
import PokemonList from "@/modules/home/components/PokemonList";
import { FC } from "react";
import Header from "@/components/header";
import PokemonListFilters from "@/modules/home/components/PokemonListFilters";
import pokemons from "../api/pokemons/pokemons.json";
import { collections } from "@/constants/collections";

const HomePage: FC<{ params: Promise<{ pack: string }> }> = async ({
  params,
}) => {
  const { pack } = await params;

  // Filter pokemons directly from JSON instead of fetching
  let data: IPokemon[] = [];
  
  // List of reserved routes that should not be handled by this dynamic route
  const reservedRoutes = [
    'balance', 'cards', 'trades', 'transactions', 'dashboard', 
    'analytics', 'settings', 'help', 'api', 'backup', 'chat',
    'customers', 'invoices', 'integrations', 'media', 'meetings',
    'members', 'orders', 'organization', 'pack-opener', 'pages',
    'payments', 'plugins', 'products', 'projects', 'seo', 'trade'
  ];

  // If pack is a reserved route, return 404
  if (reservedRoutes.includes(pack)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page not found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  try {
    if (pack && collections[pack]) {
      data = pokemons.filter((pokemon) =>
        collections[pack].includes(pokemon.pack)
      );
    } else {
      console.error(`Invalid pack: ${pack}`);
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Pack not found</h1>
            <p className="text-gray-600">The pack "{pack}" does not exist.</p>
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error('Error loading pokemons:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error loading pokemons</h1>
          <p className="text-gray-600">An error occurred while loading the data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto w-screen font-sans">
      <div className="container mx-auto px-8 ">
        <Header />
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-4/6">
              <h2 className="text-4xl font-bold mb-4 capitalize">
                {pack.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} Pack
              </h2>
              <p className="text-xl mb-6">
                These are your statistics (cards obtained from the pack / total
                cards in the pack), update the data by clicking on the cards below
                and find out how many cards you already have from each pack!
              </p>
            </div>
            <div className="md:w-2/6 flex justify-center">
              <PokemonStatistics collection={pack} />
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-start flex-col gap-8">
        <main className="flex flex-col items-center gap-10 container mx-auto px-4">
          {/* <PokemonListFilters /> */}

          <PokemonList data={data} />
        </main>
      </section>
    </div>
  );
};

export default HomePage;
