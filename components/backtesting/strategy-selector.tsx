"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, BarChart3, Target, Activity } from "lucide-react"

interface StrategySelectorProps {
  selectedStrategy: string
  onStrategyChange: (strategy: string) => void
}

export function StrategySelector({ selectedStrategy, onStrategyChange }: StrategySelectorProps) {
  const strategies = [
    {
      id: "moving-average-crossover",
      name: "Moving Average Crossover",
      icon: TrendingUp,
      description: "Buy when fast MA crosses above slow MA",
    },
    {
      id: "rsi-mean-reversion",
      name: "RSI Mean Reversion",
      icon: Activity,
      description: "Buy oversold, sell overbought",
    },
    {
      id: "bollinger-bands",
      name: "Bollinger Bands",
      icon: BarChart3,
      description: "Trade band bounces and breakouts",
    },
    {
      id: "momentum",
      name: "Momentum Strategy",
      icon: Target,
      description: "Follow strong price momentum",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Strategy Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {strategies.map((strategy) => {
            const Icon = strategy.icon
            return (
              <Button
                key={strategy.id}
                variant={selectedStrategy === strategy.id ? "default" : "outline"}
                className="w-full justify-start h-auto p-3"
                onClick={() => onStrategyChange(strategy.id)}
              >
                <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{strategy.name}</div>
                  <div className="text-xs text-muted-foreground">{strategy.description}</div>
                </div>
              </Button>
            )
          })}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Parameters</h4>

          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input id="start-date" type="date" defaultValue="2023-01-01" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input id="end-date" type="date" defaultValue="2024-01-01" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial-capital">Initial Capital</Label>
            <Input id="initial-capital" type="number" defaultValue="100000" />
          </div>

          <div className="space-y-2">
            <Label>Universe</Label>
            <Select defaultValue="sp500">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sp500">S&P 500</SelectItem>
                <SelectItem value="nasdaq100">NASDAQ 100</SelectItem>
                <SelectItem value="russell2000">Russell 2000</SelectItem>
                <SelectItem value="custom">Custom Watchlist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStrategy === "moving-average-crossover" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="fast-ma">Fast MA</Label>
                  <Input id="fast-ma" type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor="slow-ma">Slow MA</Label>
                  <Input id="slow-ma" type="number" defaultValue="20" />
                </div>
              </div>
            </div>
          )}

          {selectedStrategy === "rsi-mean-reversion" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="rsi-oversold">Oversold</Label>
                  <Input id="rsi-oversold" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="rsi-overbought">Overbought</Label>
                  <Input id="rsi-overbought" type="number" defaultValue="70" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
