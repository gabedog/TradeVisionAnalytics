"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, RefreshCw, TrendingUp, TrendingDown, Eye, Star } from "lucide-react"

export function QuotesContent() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")

  const quote = {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 185.23,
    change: 2.34,
    changePercent: 1.28,
    volume: 45234567,
    avgVolume: 52341234,
    marketCap: "2.89T",
    dayRange: "182.45 - 186.78",
    yearRange: "164.08 - 199.62",
    pe: 28.5,
    eps: 6.5,
    dividend: 0.96,
    yield: 0.52,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quotes & Overview</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter symbol..."
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
              className="w-48 pl-9"
            />
          </div>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {quote.symbol} - {quote.name}
                </CardTitle>
                <CardDescription>Real-time quote and key metrics</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Add to Watchlist
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">${quote.price}</div>
                <div className="flex items-center gap-2">
                  {quote.change > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <div className={`text-lg ${quote.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {quote.change > 0 ? "+" : ""}
                    {quote.change} ({quote.changePercent > 0 ? "+" : ""}
                    {quote.changePercent}%)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="font-medium">{(quote.volume / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg Volume</div>
                  <div className="font-medium">{(quote.avgVolume / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="font-medium">{quote.marketCap}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">P/E Ratio</div>
                  <div className="font-medium">{quote.pe}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Day Range</div>
                  <div className="font-medium">{quote.dayRange}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">52 Week Range</div>
                  <div className="font-medium">{quote.yearRange}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">EPS (TTM)</span>
                <span className="font-medium">${quote.eps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dividend</span>
                <span className="font-medium">${quote.dividend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Yield</span>
                <span className="font-medium">{quote.yield}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Beta</span>
                <span className="font-medium">1.24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Shares Outstanding</span>
                <span className="font-medium">15.6B</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Price Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Price chart for {quote.symbol}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Volume chart for {quote.symbol}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Apple Reports Strong Q4 Earnings", time: "2 hours ago", source: "Reuters" },
                  { title: "iPhone Sales Beat Expectations", time: "4 hours ago", source: "Bloomberg" },
                  { title: "Apple Announces New Product Line", time: "1 day ago", source: "TechCrunch" },
                ].map((news, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium">{news.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {news.source} • {news.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Business Description</h4>
                  <p className="text-sm text-muted-foreground">
                    Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables,
                    and accessories worldwide. The company serves consumers, and small and mid-sized businesses; and the
                    education, enterprise, and government markets.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Industry</div>
                    <div className="font-medium">Consumer Electronics</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Sector</div>
                    <div className="font-medium">Technology</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Employees</div>
                    <div className="font-medium">164,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Founded</div>
                    <div className="font-medium">1976</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
