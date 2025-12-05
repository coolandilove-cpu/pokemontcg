"use client"

import { Package, Clock } from "lucide-react"

interface RecentCard {
  id: string
  name: string
  image: string
  pack: string
  rarity: string
  timestamp: string
}

// Mock data - this would come from your collection context or API
const mockRecentCards: RecentCard[] = [
  // This would be populated from actual recent pack openings
]

export default function RecentCards() {
  const recentCards = mockRecentCards.length > 0 ? mockRecentCards : []

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200 dark:border-[#1F1F23] w-full min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Cards</h3>
        <button className="text-xs sm:text-sm text-primary hover:underline">View all</button>
      </div>

      {recentCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No recent cards</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Open packs to see your new cards here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentCards.slice(0, 5).map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1F1F23] transition-colors"
            >
              <div className="relative w-12 h-16 sm:w-16 sm:h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{card.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{card.pack}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.rarity}</p>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {card.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

