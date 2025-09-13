"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

export function BreadthIndicators() {
  const indicators = [
    {
      name: "Arms Index (TRIN)",
      value: 0.87,
      status: "bullish",
      description: "Below 1.0 indicates buying pressure",
    },
    {
      name: "Advance-Decline Line",
      value: 12847,
      status: "bullish",
      description: "Cumulative A/D trending higher",
    },
    {
      name: "McClellan Summation",
      value: 234.5,
      status: "bullish",
      description: "Above zero indicates bullish breadth",
    },
    {
      name: "High-Low Index",
      value: 78.3,
      status: "bullish",
      description: "Above 70 shows strong momentum",
    },
    {
      name: "Bullish Percent Index",
      value: 65.2,
      status: "neutral",
      description: "Percentage of stocks in bullish patterns",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "bullish":
        return "default"
      case "bearish":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Breadth Indicators
        </CardTitle>
        <CardDescription>Key market breadth measurements and signals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indicators.map((indicator) => (
            <div key={indicator.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(indicator.status)}
                <div>
                  <div className="font-medium">{indicator.name}</div>
                  <div className="text-sm text-muted-foreground">{indicator.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{indicator.value}</div>
                <Badge variant={getStatusVariant(indicator.status)} className="text-xs mt-1">
                  {indicator.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
