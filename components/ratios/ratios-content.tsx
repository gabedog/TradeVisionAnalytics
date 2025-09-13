"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, TrendingUp, RefreshCw } from "lucide-react"

export function RatiosContent() {
  const ratioCategories = [
    {
      name: "Profitability Ratios",
      ratios: [
        { name: "Gross Profit Margin", value: "44.8%", benchmark: "35-45%", status: "good" },
        { name: "Operating Margin", value: "31.3%", benchmark: "20-30%", status: "excellent" },
        { name: "Net Profit Margin", value: "26.6%", benchmark: "15-25%", status: "excellent" },
        { name: "Return on Assets (ROA)", value: "30.0%", benchmark: "5-15%", status: "excellent" },
        { name: "Return on Equity (ROE)", value: "169.9%", benchmark: "15-25%", status: "excellent" },
      ],
    },
    {
      name: "Liquidity Ratios",
      ratios: [
        { name: "Current Ratio", value: "0.99", benchmark: "1.0-2.0", status: "caution" },
        { name: "Quick Ratio", value: "0.83", benchmark: "1.0+", status: "caution" },
        { name: "Cash Ratio", value: "0.21", benchmark: "0.1-0.2", status: "good" },
      ],
    },
    {
      name: "Efficiency Ratios",
      ratios: [
        { name: "Asset Turnover", value: "1.13", benchmark: "0.5-1.5", status: "good" },
        { name: "Inventory Turnover", value: "38.5", benchmark: "5-10", status: "excellent" },
        { name: "Receivables Turnover", value: "15.2", benchmark: "6-12", status: "excellent" },
      ],
    },
    {
      name: "Leverage Ratios",
      ratios: [
        { name: "Debt-to-Equity", value: "4.65", benchmark: "0.3-0.6", status: "caution" },
        { name: "Debt-to-Assets", value: "0.82", benchmark: "0.3-0.6", status: "caution" },
        { name: "Interest Coverage", value: "28.5", benchmark: "2.5+", status: "excellent" },
      ],
    },
    {
      name: "Valuation Ratios",
      ratios: [
        { name: "Price-to-Earnings (P/E)", value: "28.5", benchmark: "15-25", status: "caution" },
        { name: "Price-to-Book (P/B)", value: "48.4", benchmark: "1-3", status: "caution" },
        { name: "Price-to-Sales (P/S)", value: "7.2", benchmark: "1-3", status: "caution" },
        { name: "EV/EBITDA", value: "22.1", benchmark: "10-15", status: "caution" },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "caution":
        return "bg-yellow-500"
      default:
        return "bg-red-500"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "excellent":
        return "default"
      case "good":
        return "secondary"
      case "caution":
        return "outline"
      default:
        return "destructive"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Financial Ratios</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">AAPL</Badge>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {ratioCategories.map((category) => (
          <Card key={category.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                {category.name}
              </CardTitle>
              <CardDescription>Key {category.name.toLowerCase()} and industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.ratios.map((ratio) => (
                  <div key={ratio.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{ratio.name}</div>
                      <Badge
                        variant={getStatusVariant(ratio.status)}
                        className={`text-white ${getStatusColor(ratio.status)}`}
                      >
                        {ratio.status}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">{ratio.value}</div>
                    <div className="text-sm text-muted-foreground">Benchmark: {ratio.benchmark}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ratio Trends
          </CardTitle>
          <CardDescription>Historical ratio performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Ratio trend charts will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
