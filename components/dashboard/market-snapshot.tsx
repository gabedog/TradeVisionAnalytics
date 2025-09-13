"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export function MarketSnapshot() {
  const marketData = [
    { symbol: "SPY", name: "SPDR S&P 500", price: 478.34, change: 1.23, changePercent: 0.26, trend: "up" },
    { symbol: "QQQ", name: "Invesco QQQ Trust", price: 382.45, change: -2.34, changePercent: -0.61, trend: "down" },
    { symbol: "IWM", name: "iShares Russell 2000", price: 198.76, change: 0.87, changePercent: 0.44, trend: "up" },
    { symbol: "VIX", name: "CBOE Volatility Index", price: 14.23, change: -0.45, changePercent: -3.06, trend: "down" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Snapshot</CardTitle>
        <CardDescription>Key market indicators and ETFs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <div>
                  <div className="font-medium">{item.symbol}</div>
                  <div className="text-sm text-muted-foreground">{item.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${item.price}</div>
                <Badge variant={item.trend === "up" ? "default" : "destructive"} className="text-xs">
                  {item.change > 0 ? "+" : ""}
                  {item.change} ({item.changePercent > 0 ? "+" : ""}
                  {item.changePercent}%)
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
