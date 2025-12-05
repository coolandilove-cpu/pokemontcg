"use client"

import { useState } from "react"
import { ArrowLeftRight, Clock, CheckCircle, XCircle, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Trade {
  id: string
  type: "sent" | "received"
  status: "pending" | "active" | "completed" | "cancelled"
  partner: string
  partnerAddress: string
  cards: Array<{ id: string; name: string; image: string }>
  myCards: Array<{ id: string; name: string; image: string }>
  timestamp: string
  value?: number
}

// Mock data - this would come from trade API
const mockTrades: Trade[] = [
  // This would be populated from actual trade data
]

export default function TradesList() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const trades = mockTrades.length > 0 ? mockTrades : []

  const filteredTrades = trades.filter((trade) => {
    const matchesStatus = statusFilter === "all" || trade.status === statusFilter
    const matchesType = typeFilter === "all" || trade.type === typeFilter
    return matchesStatus && matchesType
  })

  const getStatusIcon = (status: Trade["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "active":
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: Trade["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-[#1F1F23] w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Trades</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your card trades
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Trade
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="received">Received</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStatusFilter("all")
            setTypeFilter("all")
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* Trades List */}
      {filteredTrades.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ArrowLeftRight className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No trades found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Start a new trade to exchange cards with other trainers
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-[#1F1F23] hover:bg-gray-50 dark:hover:bg-[#1F1F23] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(trade.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${trade.type === "sent" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"}`}>
                        {trade.type === "sent" ? "Sent to" : "Received from"}
                      </span>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{trade.partner}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{trade.timestamp}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(trade.status)}>
                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Your cards: </span>
                  <span className="font-medium text-gray-900 dark:text-white">{trade.myCards.length}</span>
                </div>
                <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Their cards: </span>
                  <span className="font-medium text-gray-900 dark:text-white">{trade.cards.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

