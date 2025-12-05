"use client"

import type React from "react"
import Image from "next/image"
import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  ChevronDown,
  Home,
  ShoppingCart,
  Package,
  FileText,
  Database,
  Globe,
  Mail,
  Calendar,
  ImageIcon,
  Zap,
  Code,
  Layers,
  Monitor,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  UserPlus,
  UserX,
  Lock,
  Key,
  Eye,
  Bell,
  MessageSquare,
  Camera,
  Headphones,
  Play,
  Bookmark,
  Tag,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Plus,
  Minus,
  Check,
  Star,
  Map,
  Truck,
  Clock,
  Timer,
  DollarSign,
  TrendingDown,
  Puzzle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type MenuState = "full" | "collapsed" | "hidden"

interface SubMenuItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<any>
  image?: string // Path to image in public/sidebar
  badge?: string
  isNew?: boolean
  children?: SubMenuItem[]
}

interface MenuItem {
  id: string
  label: string
  href?: string
  icon: React.ComponentType<any>
  image?: string // Path to image in public/sidebar
  badge?: string
  isNew?: boolean
  children?: SubMenuItem[]
}

interface MenuSection {
  id: string
  label: string
  items: MenuItem[]
}

const menuData: MenuSection[] = [
  {
    id: "overview",
    label: "Collection",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: Home,
        image: "/sidebar/dashboard.jpg",
        children: [
          {
            id: "collection-stats",
            label: "Collection Stats",
            href: "/dashboard/collection-stats",
            icon: BarChart2,
            image: "/sidebar/collection-stats.jpg",
          },
          {
            id: "recent-activity",
            label: "Recent Activity",
            href: "/dashboard/recent-activity",
            icon: Activity,
            image: "/sidebar/recent-activity.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "poketrade",
    label: "PokeTrade",
    items: [
      {
        id: "cards",
        label: "My Cards",
        href: "/cards",
        icon: Package,
        image: "/sidebar/my-cards.jpg",
        children: [
          {
            id: "all-cards",
            label: "All Cards",
            href: "/cards/all",
            icon: Package,
            image: "/sidebar/all-cards.jpg",
          },
          {
            id: "types",
            label: "Types",
            href: "/cards/types",
            icon: Tag,
            image: "/sidebar/types.jpg",
            children: [
              {
                id: "grass",
                label: "Grass",
                href: "/cards/types/grass",
                image: "/sidebar/grass.jpg",
              },
              {
                id: "fire",
                label: "Fire",
                href: "/cards/types/fire",
                image: "/sidebar/fire.jpg",
              },
              {
                id: "water",
                label: "Water",
                href: "/cards/types/water",
                image: "/sidebar/water.jpg",
              },
              {
                id: "electric",
                label: "Electric",
                href: "/cards/types/electric",
                image: "/sidebar/electric.jpg",
              },
              {
                id: "psychic",
                label: "Psychic",
                href: "/cards/types/psychic",
                image: "/sidebar/psychic.jpg",
              },
              {
                id: "fighting",
                label: "Fighting",
                href: "/cards/types/fighting",
                image: "/sidebar/fighting.jpg",
              },
              {
                id: "darkness",
                label: "Darkness",
                href: "/cards/types/darkness",
                image: "/sidebar/darkness.jpg",
              },
              {
                id: "metal",
                label: "Metal",
                href: "/cards/types/metal",
                image: "/sidebar/metal.jpg",
              },
            ],
          },
        ],
      },
      {
        id: "trades",
        label: "Trades",
        href: "/trades",
        icon: ShoppingCart,
        image: "/sidebar/trades.jpg",
        children: [
          {
            id: "all-trades",
            label: "All Trades",
            href: "/trades/all",
            icon: ShoppingCart,
            image: "/sidebar/all-trades.jpg",
          },
          {
            id: "pending",
            label: "Pending",
            href: "/trades/pending",
            icon: Clock,
            image: "/sidebar/pending.jpg",
          },
          {
            id: "active",
            label: "Active",
            href: "/trades/active",
            icon: Timer,
            image: "/sidebar/active.jpg",
          },
          {
            id: "completed",
            label: "Completed",
            href: "/trades/completed",
            icon: Check,
            image: "/sidebar/completed.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "wallet",
    label: "Wallet",
    items: [
      {
        id: "transactions",
        label: "Trade History",
        href: "/transactions",
        icon: Wallet,
        image: "/sidebar/trade-history.jpg",
        children: [
          {
            id: "all-transactions",
            label: "All Transactions",
            href: "/transactions/all",
            icon: Wallet,
            image: "/sidebar/all-transactions.jpg",
          },
          {
            id: "received",
            label: "Received",
            href: "/transactions/received",
            icon: TrendingUp,
            image: "/sidebar/received.png",
          },
          {
            id: "sent",
            label: "Sent",
            href: "/transactions/sent",
            icon: TrendingDown,
            image: "/sidebar/sent.jpg",
          },
        ],
      },
      {
        id: "balance",
        label: "Balance",
        href: "/balance",
        icon: CreditCard,
        image: "/sidebar/balance.jpg",
      },
    ],
  },
]

export default function Sidebar() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuState, setMenuState] = useState<MenuState>("full")
  const [isHovered, setIsHovered] = useState(false)
  const [previousDesktopState, setPreviousDesktopState] = useState<MenuState>("full")
  const [isMobile, setIsMobile] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Cycle through menu states: full -> collapsed -> hidden -> full
  const toggleMenuState = () => {
    setMenuState((prev) => {
      switch (prev) {
        case "full":
          return "collapsed"
        case "collapsed":
          return "hidden"
        case "hidden":
          return "full"
        default:
          return "full"
      }
    })
  }

  // Function to set menu state from theme customizer
  const setMenuStateFromCustomizer = (state: MenuState) => {
    if (!isMobile) {
      setMenuState(state)
    }
  }

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024 // lg breakpoint
      setIsMobile(!isDesktop)

      if (!isDesktop) {
        // On mobile/tablet, save current desktop state and set to hidden
        if (menuState !== "hidden") {
          setPreviousDesktopState(menuState)
          setMenuState("hidden")
        }
      } else {
        // On desktop, restore previous state if coming from mobile
        if (menuState === "hidden" && previousDesktopState !== "hidden") {
          setMenuState(previousDesktopState)
        }
      }
    }

    // Check on mount
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [menuState, previousDesktopState])

  // Export functions to window for TopNav and ThemeCustomizer to access
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).toggleMenuState = toggleMenuState
      ;(window as any).menuState = menuState
      ;(window as any).isHovered = isHovered
      ;(window as any).isMobile = isMobile
      ;(window as any).setIsMobileMenuOpen = setIsMobileMenuOpen
      ;(window as any).isMobileMenuOpen = isMobileMenuOpen
      ;(window as any).setMenuStateFromCustomizer = setMenuStateFromCustomizer
    }
  }, [menuState, isHovered, isMobile, isMobileMenuOpen])

  function handleNavigation() {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  function NavItem({
    item,
    level = 0,
    parentId = "",
  }: {
    item: MenuItem | SubMenuItem
    level?: number
    parentId?: string
  }) {
    const itemId = `${parentId}-${item.id}`
    const isExpanded = expandedItems.has(itemId)
    const hasChildren = item.children && item.children.length > 0
    const showText = menuState === "full" || (menuState === "collapsed" && isHovered) || (isMobile && isMobileMenuOpen)
    const showExpandIcon = hasChildren && showText
    const [imageError, setImageError] = useState(false)

    // Reset image error when item changes
    useEffect(() => {
      setImageError(false)
    }, [item.image])

    const paddingLeft = level === 0 ? "px-3" : level === 1 ? "pl-8 pr-3" : "pl-12 pr-3"

    const content = (
      <div
        className={cn(
          "flex items-center py-2 text-sm rounded-md transition-colors sidebar-menu-item hover:bg-gray-50 dark:hover:bg-[#1F1F23] relative group cursor-pointer",
          paddingLeft,
        )}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault()
            toggleExpanded(itemId)
          }
          // For items without children, let Link handle navigation
        }}
        title={menuState === "collapsed" && !isHovered && !isMobile ? item.label : undefined}
      >
        {item.image && !imageError ? (
          <div className="h-8 w-8 relative flex items-center justify-center flex-shrink-0">
            <Image
              src={item.image}
              alt={item.label}
              width={32}
              height={32}
              className="object-contain w-full h-full"
              onError={() => {
                // Fallback to icon if image fails to load
                setImageError(true)
              }}
            />
          </div>
        ) : item.icon ? (
          <item.icon className="h-4 w-4 flex-shrink-0 sidebar-menu-icon" />
        ) : null}

        {showText && (
          <>
            <span className="ml-3 flex-1 transition-opacity duration-200 sidebar-menu-text">{item.label}</span>

            {/* Badges and indicators */}
            <div className="flex items-center space-x-1">
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  New
                </span>
              )}
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {item.badge}
                </span>
              )}
              {showExpandIcon && (
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform duration-200", isExpanded ? "rotate-180" : "rotate-0")}
                />
              )}
            </div>
          </>
        )}

        {/* Tooltip for collapsed state when not hovered and not mobile */}
        {menuState === "collapsed" && !isHovered && !isMobile && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.label}
            {item.badge && <span className="ml-1 text-blue-300">({item.badge})</span>}
          </div>
        )}
      </div>
    )

    return (
      <div>
        {item.href && !hasChildren ? (
          <Link href={item.href} onClick={() => handleNavigation()}>
            {content}
          </Link>
        ) : (
          content
        )}
        {hasChildren && isExpanded && showText && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItem key={child.id} item={child} level={level + 1} parentId={itemId} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Calculate sidebar width - expand when collapsed and hovered, or full width on mobile
  const getSidebarWidth = () => {
    if (isMobile) {
      return "w-64" // Always full width on mobile
    }
    if (menuState === "collapsed" && isHovered) {
      return "w-64" // Expand to full width when hovered
    }
    return menuState === "collapsed" ? "w-16" : "w-64"
  }

  // Show text if menu is full OR if collapsed and hovered OR on mobile
  const showText = menuState === "full" || (menuState === "collapsed" && isHovered) || (isMobile && isMobileMenuOpen)

  // On mobile, show sidebar as overlay when isMobileMenuOpen is true
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar overlay */}
        <nav
          className={`
            fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] 
            border-r border-gray-200 dark:border-[#1F1F23] 
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
              <Link
                href="/"
                className="flex items-center gap-3 w-full"
              >
                <img
                  src="/pokedex.png"
                  alt="PokemonTCGDex"
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                  PokemonTCGDex
                </span>
              </Link>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
              style={{
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE and Edge */,
              }}
            >
              <div className="space-y-6">
                {menuData.map((section) => (
                  <div key={section.id}>
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem key={item.id} item={item} parentId={section.id} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
              <div className="space-y-1">
                <NavItem item={{ id: "settings", label: "Settings", href: "/settings", icon: Settings, image: "/sidebar/settings.jpg" }} />
                <NavItem item={{ id: "help", label: "Help", href: "/help", icon: HelpCircle, image: "/sidebar/help.jpg" }} />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile overlay backdrop */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[65]" onClick={() => setIsMobileMenuOpen(false)} />
        )}
      </>
    )
  }

  // Desktop sidebar
  return (
    <nav
      className={`
        fixed inset-y-0 left-0 z-[60] bg-white dark:bg-[#0F0F12] 
        border-r border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out
        ${menuState === "hidden" ? "w-0 border-r-0" : getSidebarWidth()}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        overflow: menuState === "hidden" ? "hidden" : "visible",
      }}
    >
      {menuState !== "hidden" && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
            {showText ? (
              <Link
                href="/"
                className="flex items-center gap-3 w-full"
              >
                <img
                  src="/pokedex.png"
                  alt="PokemonTCGDex"
                  width={32}
                  height={32}
                  className="flex-shrink-0 hidden dark:block"
                />
                <img
                  src="/pokedex.png"
                  alt="PokemonTCGDex"
                  width={32}
                  height={32}
                  className="flex-shrink-0 block dark:hidden"
                />
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white transition-opacity duration-200">
                  PokemonTCGDex
                </span>
              </Link>
            ) : (
              <div className="flex justify-center w-full">
                <img
                  src="/pokedex.png"
                  alt="PokemonTCGDex"
                  width={32}
                  height={32}
                  className="flex-shrink-0 hidden dark:block"
                />
                <img
                  src="/pokedex.png"
                  alt="PokemonTCGDex"
                  width={32}
                  height={32}
                  className="flex-shrink-0 block dark:hidden"
                />
              </div>
            )}
          </div>

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
          >
            <div className="space-y-6">
              {menuData.map((section) => (
                <div key={section.id}>
                  {showText && (
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label transition-opacity duration-200">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem key={item.id} item={item} parentId={section.id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem item={{ id: "settings", label: "Settings", href: "/settings", icon: Settings, image: "/sidebar/settings.jpg" }} />
              <NavItem item={{ id: "help", label: "Help", href: "/help", icon: HelpCircle, image: "/sidebar/help.jpg" }} />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

