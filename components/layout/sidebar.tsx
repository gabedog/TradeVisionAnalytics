"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Filter,
  TrendingUp,
  LineChart,
  Target,
  Settings,
  Eye,
  DollarSign,
  PieChart,
  Users,
  Activity,
} from "lucide-react"

interface SidebarProps {
  mode: "BASIC" | "PRO" | "ULTIMATE"
}

export function Sidebar({ mode }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, available: true },
    { name: "Screener", href: "/screener", icon: Filter, available: mode !== "BASIC" },
    {
      name: "Quotes & Fundamentals",
      icon: TrendingUp,
      available: true,
      children: [
        { name: "Overview", href: "/quotes", icon: Eye },
        { name: "Financials", href: "/financials", icon: DollarSign },
        { name: "Ratios", href: "/ratios", icon: PieChart },
        { name: "Ownership", href: "/ownership", icon: Users, available: mode === "ULTIMATE" },
      ],
    },
    { name: "Market Breadth", href: "/market-breadth", icon: Activity, available: mode !== "BASIC" },
    { name: "Charts", href: "/charts", icon: LineChart, available: true },
    { name: "Backtesting", href: "/backtesting", icon: Target, available: mode === "ULTIMATE" },
    { name: "Admin", href: "/admin", icon: Settings, available: true },
  ]

  return (
    <div className="w-64 bg-sidebar border-r">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          if (!item.available) return null

          if (item.children) {
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sidebar-foreground">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
                <div className="ml-6 space-y-1">
                  {item.children.map((child) => {
                    if (child.available === false) return null
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                          pathname === child.href
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
