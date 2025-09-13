"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, BarChart3, Target, Activity } from "lucide-react"

export function BacktestResults() {
  const metrics = {
    totalReturn: 24.5,
    annualizedReturn: 12.3,
    sharpeRatio: 1.45,
    maxDrawdown: -8.2,
    winRate: 62.5,
    totalTrades: 147,
    avgWin: 3.2,
    avgLoss: -1.8,
    profitFactor: 1.85,
  }

  const monthlyReturns = [
    { month: "Jan 2023", return: 2.1 },
    { month: "Feb 2023", return: -1.3 },
    { month: "Mar 2023", return: 3.8 },
    { month: "Apr 2023", return: 1.9 },
    { month: "May 2023", return: -0.7 },
    { month: "Jun 2023", return: 2.4 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance Summary
          </CardTitle>
          <CardDescription>Key metrics for the backtest period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">+{metrics.totalReturn}%</div>
              <div className="text-sm text-muted-foreground">Total Return</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{metrics.annualizedReturn}%</div>
              <div className="text-sm text-muted-foreground">Annualized</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{metrics.sharpeRatio}</div>
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{metrics.maxDrawdown}%</div>
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{metrics.winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{metrics.totalTrades}</div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Equity Curve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Equity curve chart</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monthly Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monthlyReturns.map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm">{item.month}</span>
                  <Badge variant={item.return > 0 ? "default" : "destructive"}>
                    {item.return > 0 ? "+" : ""}
                    {item.return}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Trade Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-green-600">+{metrics.avgWin}%</div>
              <div className="text-sm text-muted-foreground">Avg Win</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-red-600">{metrics.avgLoss}%</div>
              <div className="text-sm text-muted-foreground">Avg Loss</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">{metrics.profitFactor}</div>
              <div className="text-sm text-muted-foreground">Profit Factor</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">92</div>
              <div className="text-sm text-muted-foreground">Winning Trades</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
