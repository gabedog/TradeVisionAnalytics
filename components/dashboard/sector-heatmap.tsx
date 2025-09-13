"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function SectorHeatmap() {
  const sectors = [
    { name: "Technology", performance: 1.24, size: "large" },
    { name: "Healthcare", performance: 0.87, size: "medium" },
    { name: "Financials", performance: -0.45, size: "large" },
    { name: "Consumer Disc.", performance: 0.32, size: "medium" },
    { name: "Industrials", performance: -0.12, size: "medium" },
    { name: "Energy", performance: -1.23, size: "small" },
    { name: "Materials", performance: 0.56, size: "small" },
    { name: "Utilities", performance: -0.34, size: "small" },
  ]

  const getPerformanceColor = (performance: number) => {
    if (performance > 0.5) return "bg-green-500"
    if (performance > 0) return "bg-green-300"
    if (performance > -0.5) return "bg-red-300"
    return "bg-red-500"
  }

  const getSizeClass = (size: string) => {
    switch (size) {
      case "large":
        return "col-span-2 row-span-2"
      case "medium":
        return "col-span-2"
      default:
        return "col-span-1"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Performance</CardTitle>
        <CardDescription>Today's sector performance heatmap</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 h-64">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className={cn(
                "rounded-md p-3 flex flex-col justify-center items-center text-white text-center",
                getSizeClass(sector.size),
                getPerformanceColor(sector.performance),
              )}
            >
              <div className="font-medium text-sm">{sector.name}</div>
              <div className="text-xs mt-1">
                {sector.performance > 0 ? "+" : ""}
                {sector.performance.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
