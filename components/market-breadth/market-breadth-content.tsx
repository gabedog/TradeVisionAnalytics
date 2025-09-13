"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, TrendingUp, BarChart3, RefreshCw, AlertTriangle, Play } from "lucide-react"
import { BreadthIndicators } from "./breadth-indicators"
import { AdvanceDeclineChart } from "./advance-decline-chart"

export function MarketBreadthContent() {
  const [selectedScope, setSelectedScope] = useState("sp500")
  const [symbolCount, setSymbolCount] = useState(503)

  const scopes = [
    { value: "sp500", label: "S&P 500", count: 503 },
    { value: "nasdaq", label: "NASDAQ", count: 2847 },
    { value: "nyse", label: "NYSE", count: 1234 },
    { value: "russell2000", label: "Russell 2000", count: 1987 },
  ]

  const handleScopeChange = (value: string) => {
    setSelectedScope(value)
    const scope = scopes.find((s) => s.value === value)
    setSymbolCount(scope?.count || 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Market Breadth</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedScope} onValueChange={handleScopeChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scopes.map((scope) => (
                <SelectItem key={scope.value} value={scope.value}>
                  {scope.label} ({scope.count} symbols)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Compute Now
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {symbolCount < 100 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: The chosen scope has fewer than 100 symbols ingested. Breadth calculations may be less reliable
            with limited data.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advance/Decline</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247 / 856</div>
            <p className="text-xs text-green-600">+391 net advancing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Highs/Lows</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89 / 23</div>
            <p className="text-xs text-blue-600">+66 net new highs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Up/Down Volume</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3B / 1.1B</div>
            <p className="text-xs text-purple-600">68% up volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">McClellan Oscillator</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+45.7</div>
            <p className="text-xs text-green-600">Bullish momentum</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BreadthIndicators />
        <AdvanceDeclineChart />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sector Breadth
          </CardTitle>
          <CardDescription>
            Advance/decline by sector for {scopes.find((s) => s.value === selectedScope)?.label}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { sector: "Technology", advancing: 45, declining: 12, total: 57 },
              { sector: "Healthcare", advancing: 32, declining: 18, total: 50 },
              { sector: "Financials", advancing: 28, declining: 25, total: 53 },
              { sector: "Consumer Discretionary", advancing: 23, declining: 19, total: 42 },
              { sector: "Industrials", advancing: 31, declining: 14, total: 45 },
              { sector: "Energy", advancing: 8, declining: 15, total: 23 },
            ].map((sector) => {
              const advancePercent = (sector.advancing / sector.total) * 100
              return (
                <div key={sector.sector} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium">{sector.sector}</div>
                    <div className="flex-1 bg-muted rounded-full h-2 min-w-32">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${advancePercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {sector.advancing} / {sector.declining}
                    </div>
                    <div className="text-xs text-muted-foreground">{advancePercent.toFixed(0)}% advancing</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
