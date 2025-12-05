"use client";

import CardsList from "@/components/dashboard-cms/cards-list";
import Layout from "@/components/cmsfullform/layout";

export default function PsychicTypePage() {
  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Psychic Type Cards</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Browse all Psychic type Pokemon cards
            </p>
          </div>
        </div>
        <CardsList />
      </div>
    </Layout>
  );
}

