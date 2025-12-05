"use client"

import { ArrowLeftRight, CheckCircle, XCircle, Clock, User } from "lucide-react"

interface Trade {
  id: string
  type: "sent" | "received"
  status: "completed" | "pending" | "cancelled"
  partner: string
  cards: string[]
  timestamp: string
}

// Mock data - this would come from your trade API
const mockTrades: Trade[] = [
  // This would be populated from actual trade history
]

export default function TradeHistory() {
  const trades = mockTrades.length > 0 ? mockTrades : []

  const getStatusIcon = (status: Trade["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: Trade["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400"
      case "cancelled":
        return "text-red-600 dark:text-red-400"
      case "pending":
        return "text-yellow-600 dark:text-yellow-400"
    }
  }

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200 dark:border-[#1F1F23] w-full min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Trade History</h3>
        <button className="text-xs sm:text-sm text-primary hover:underline">View all</button>
      </div>

      {trades.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ArrowLeftRight className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No trade history</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your completed and pending trades will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trades.slice(0, 5).map((trade) => (
            <div
              key={trade.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-[#1F1F23] hover:bg-gray-50 dark:hover:bg-[#1F1F23] transition-colors"
            >
              <div className="flex-shrink-0">
                {getStatusIcon(trade.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${trade.type === "sent" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"}`}>
                    {trade.type === "sent" ? "Sent to" : "Received from"}
                  </span>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{trade.partner}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {trade.cards.length} card{trade.cards.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{trade.timestamp}</p>
              </div>
              <div className={`text-xs font-medium ${getStatusColor(trade.status)}`}>
                {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

