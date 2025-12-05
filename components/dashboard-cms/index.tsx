"use client"

import OverviewStats from "./overview-stats"
import CollectionChart from "./collection-chart"
import RecentCards from "./recent-cards"
import TradeHistory from "./trade-history"

export default function CMSDashboardContent() {
  return (
    <div className="space-y-3 sm:space-y-4 w-full min-w-0 max-w-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Pokemon Collection Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your Pokemon TCG collection and track your trades
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <OverviewStats />

      {/* Collection Chart */}
      <div className="w-full">
        <CollectionChart />
      </div>

      {/* Recent Cards & Trade History Row */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 w-full">
        <RecentCards />
        <TradeHistory />
      </div>
    </div>
  )
}

