"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { useCollection } from "@/contexts/CollectionContext"
import { usePokemonStatistics } from "@/modules/home/hooks/usePokemonStatistics"
import { Layers, TrendingUp, Package, ArrowLeftRight, Clock, Percent } from "lucide-react"
import pokemons from "@/app/api/pokemons/pokemons.json"

interface StatCard {
  title: string
  value: string
  change?: string
  changeType?: "increase" | "decrease"
  icon: React.ReactNode
  description: string
}

// Icons are static, so we can define them outside the component
const iconProps = { className: "h-4 w-4" }
const icons = {
  cards: <Layers {...iconProps} />,
  package: <Package {...iconProps} />,
  percent: <Percent {...iconProps} />,
  clock: <Clock {...iconProps} />,
  arrowLeftRight: <ArrowLeftRight {...iconProps} />,
}

export default function OverviewStats() {
  const { totalCollected } = useCollection()
  const { percentComplete } = usePokemonStatistics()
  const [recentCards, setRecentCards] = useState(0)

  // Get total cards available from pokemons data
  const totalCardsAvailable = pokemons.length

  // Recent cards count - can be loaded from Supabase pack_openings if needed
  // For now, set to 0 as we're removing localStorage-based calculation
  useEffect(() => {
    // TODO: Load recent cards from Supabase pack_openings table if needed
    setRecentCards(0)
  }, [totalCollected]) // Update when collection changes

  // Mock data for trades - these would come from trade API
  const activeTrades = 0 // This could be fetched from trade API
  const pendingTrades = 0 // This could be fetched from trade API

  // Memoize stats array to prevent unnecessary re-renders
  const stats: StatCard[] = useMemo(() => [
    {
      title: "Total Cards",
      value: totalCardsAvailable.toLocaleString(),
      change: undefined,
      icon: icons.cards,
      description: "Available in collection",
    },
    {
      title: "Cards Collected",
      value: totalCollected.toLocaleString(),
      change: recentCards > 0 ? `+${recentCards}` : undefined,
      changeType: recentCards > 0 ? "increase" : undefined,
      icon: icons.package,
      description: "In your collection",
    },
    {
      title: "Completion Rate",
      value: `${percentComplete.toFixed(1)}%`,
      change: undefined,
      icon: icons.percent,
      description: "Collection progress",
    },
    {
      title: "Recent Cards",
      value: recentCards.toString(),
      change: "This week",
      changeType: undefined,
      icon: icons.clock,
      description: "Newly acquired",
    },
    {
      title: "Active Trades",
      value: activeTrades.toString(),
      change: undefined,
      icon: icons.arrowLeftRight,
      description: "Ongoing trades",
    },
    {
      title: "Pending Trades",
      value: pendingTrades.toString(),
      change: undefined,
      icon: icons.clock,
      description: "Awaiting response",
    },
  ], [totalCardsAvailable, totalCollected, recentCards, percentComplete, activeTrades, pendingTrades])

  return (
    <div className="grid gap-2 sm:gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 w-full">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-[#0F0F12] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-[#1F1F23] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-gray-600 dark:text-gray-400 flex-shrink-0">{stat.icon}</div>
            {stat.change && stat.changeType && (
              <div className="flex items-center text-xs">
                {stat.changeType === "increase" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                )}
                <span className={`font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
              </div>
            )}
            {stat.change && !stat.changeType && (
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</div>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

