"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { IPokemon } from "@/app/api/pokemons/route"
import PokemonCard from "@/modules/home/components/PokemonCard"
import { useCollection } from "@/contexts/CollectionContext"
import { useClaimedPokemons } from "@/modules/home/hooks/useClaimedPokemons"
import { Search, Filter, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CardsList() {
  const pathname = usePathname()
  const [allCards, setAllCards] = useState<IPokemon[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  
  // Auto-detect type from URL
  const urlType = useMemo(() => {
    const typeMatch = pathname?.match(/\/cards\/types\/([^\/]+)/)
    return typeMatch ? typeMatch[1] : "all"
  }, [pathname])
  
  const [selectedType, setSelectedType] = useState<string>(urlType)
  const [selectedRarity, setSelectedRarity] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [claimedPokemons, setClaimedPokemons] = useState<string[]>([])
  const { getClaimedPokemons } = useClaimedPokemons()
  const { hasCard } = useCollection()

  // Update selectedType when URL changes
  useEffect(() => {
    setSelectedType(urlType)
  }, [urlType])

  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        // Fetch all cards from all collections
        const collections = [
          "genetic-apex",
          "mythical-island",
          "space-time-smackdown",
          "triumphant-light",
          "shining-revelry",
          "celestial-guardians",
          "promo-a",
        ]
        
        const allPokemons: IPokemon[] = []
        for (const collection of collections) {
          try {
            const response = await fetch(`/api/pokemons?pack=${collection}`)
            if (response.ok) {
              const cards: IPokemon[] = await response.json()
              allPokemons.push(...cards)
            }
          } catch (error) {
            console.error(`Error fetching ${collection}:`, error)
          }
        }
        
        // Remove duplicates by id
        const uniqueCards = Array.from(
          new Map(allPokemons.map((card) => [card.id, card])).values()
        )
        setAllCards(uniqueCards)
      } catch (error) {
        console.error("Error fetching cards:", error)
      }
    }
    fetchAllCards()

    const loadClaimed = async () => {
      setClaimedPokemons(await getClaimedPokemons())
    }
    loadClaimed()
  }, [getClaimedPokemons])

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchesSearch =
        searchQuery === "" ||
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = selectedType === "all" || card.type === selectedType

      const matchesRarity =
        selectedRarity === "all" ||
        (selectedRarity === "common" && card.rarity === "◊") ||
        (selectedRarity === "uncommon" && card.rarity === "◊◊") ||
        (selectedRarity === "rare" && card.rarity === "◊◊◊") ||
        (selectedRarity === "ultra-rare" && card.rarity === "◊◊◊◊")

      return matchesSearch && matchesType && matchesRarity
    })
  }, [allCards, searchQuery, selectedType, selectedRarity])

  const uniqueTypes = useMemo(() => {
    const types = new Set(allCards.map((card) => card.type))
    return Array.from(types).sort()
  }, [allCards])

  const collectedCount = useMemo(() => {
    return filteredCards.filter((card) => hasCard(card.id)).length
  }, [filteredCards, hasCard])

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23] w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">My Cards</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showing {collectedCount} of {filteredCards.length} cards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="p-2"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="p-2"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedRarity} onValueChange={setSelectedRarity}>
          <SelectTrigger>
            <SelectValue placeholder="All Rarities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="common">Common (◊)</SelectItem>
            <SelectItem value="uncommon">Uncommon (◊◊)</SelectItem>
            <SelectItem value="rare">Rare (◊◊◊)</SelectItem>
            <SelectItem value="ultra-rare">Ultra Rare (◊◊◊◊)</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("")
            setSelectedType("all")
            setSelectedRarity("all")
          }}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Cards Grid/List */}
      {filteredCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No cards found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              : "space-y-2"
          }
        >
          {filteredCards.map((card) => (
            <div key={card.id} className={viewMode === "list" ? "flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1F1F23]" : ""}>
              <PokemonCard pokemon={card} claimedPokemons={claimedPokemons} />
              {viewMode === "list" && (
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{card.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.type} • {card.rarity}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

