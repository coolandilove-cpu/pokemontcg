"use client"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { useEffect, useState } from "react"
import { usePokemonStatistics } from "@/modules/home/hooks/usePokemonStatistics"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        font: {
          size: 11,
        },
        callback: function (value: any) {
          return value + "%"
        },
      },
    },
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
}

const mobileChartOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    legend: {
      ...chartOptions.plugins.legend,
      labels: {
        ...chartOptions.plugins.legend.labels,
        padding: 10,
        font: {
          size: 10,
        },
      },
    },
  },
  scales: {
    ...chartOptions.scales,
    y: {
      ...chartOptions.scales.y,
      ticks: {
        font: {
          size: 9,
        },
        maxTicksLimit: 6,
        callback: function (value: any) {
          return value + "%"
        },
      },
    },
    x: {
      ...chartOptions.scales.x,
      ticks: {
        font: {
          size: 9,
        },
        maxRotation: 45,
        minRotation: 0,
      },
    },
  },
}

export default function CollectionChart() {
  const [isMobile, setIsMobile] = useState(false)
  const {
    geneticApexProgress,
    mythicalIslandProgress,
    spaceTimeSmackdownProgress,
    triumphantLightProgress,
    shiningRevelryProgress,
    celestialGuardiansProgress,
    promoAProgress,
  } = usePokemonStatistics()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const collectionData = {
    labels: [
      "Genetic Apex",
      "Mythical Island",
      "Space-Time Smackdown",
      "Triumphant Light",
      "Shining Revelry",
      "Celestial Guardians",
      "Promo A",
    ],
    datasets: [
      {
        label: "Collection Progress",
        data: [
          geneticApexProgress,
          mythicalIslandProgress,
          spaceTimeSmackdownProgress,
          triumphantLightProgress,
          shiningRevelryProgress,
          celestialGuardiansProgress,
          promoAProgress,
        ],
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(107, 114, 128, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgb(139, 92, 246)",
          "rgb(16, 185, 129)",
          "rgb(59, 130, 246)",
          "rgb(245, 158, 11)",
          "rgb(107, 114, 128)",
          "rgb(6, 182, 212)",
          "rgb(236, 72, 153)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200 dark:border-[#1F1F23] w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Collection Progress by Pack</h3>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Completion percentage</span>
      </div>
      <div className="h-48 sm:h-64 lg:h-96 w-full">
        <Bar data={collectionData} options={isMobile ? mobileChartOptions : chartOptions} />
      </div>
    </div>
  )
}

