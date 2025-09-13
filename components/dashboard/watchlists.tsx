"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Star, TrendingUp, TrendingDown } from "lucide-react"

export function Watchlists() {
  const watchlists = [
    {
      name: "Tech Leaders",
      symbols: [
        { symbol: "AAPL", price: 185.23, change: 2.34, changePercent: 1.28 },
        { symbol: "MSFT", price: 378.45, change: -1.23, changePercent: -0.32 },
        { symbol: "GOOGL", price: 142.67, change: 0.87, changePercent: 0.61 },
      ],
    },
    {
      name: "High Dividend",
      symbols: [
        { symbol: "JNJ", price: 156.78, change: 0.45, changePercent: 0.29 },
        { symbol: "PG", price: 145.32, change: -0.67, changePercent: -0.46 },
        { symbol: "KO", price: 58.91, change: 0.12, changePercent: 0.2 },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Watchlists</CardTitle>
            <CardDescription>Your tracked symbols and portfolios</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New List
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {watchlists.map((watchlist) => (
            <div key={watchlist.name}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <h4 className="font-medium">{watchlist.name}</h4>
                <Badge variant="outline">{watchlist.symbols.length}</Badge>
              </div>
              <div className="space-y-2">
                {watchlist.symbols.map((symbol) => (
                  <div key={symbol.symbol} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      {symbol.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{symbol.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${symbol.price}</div>
                      <div className={`text-xs ${symbol.change > 0 ? "text-green-600" : "text-red-600"}`}>
                        {symbol.change > 0 ? "+" : ""}
                        {symbol.change} ({symbol.changePercent > 0 ? "+" : ""}
                        {symbol.changePercent}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
