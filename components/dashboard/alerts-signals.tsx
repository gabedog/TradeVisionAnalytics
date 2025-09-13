"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Volume2, Plus } from "lucide-react"

export function AlertsSignals() {
  const alerts = [
    {
      id: 1,
      type: "breakout",
      symbol: "AAPL",
      message: "Broke above 20-day MA",
      time: "2 minutes ago",
      severity: "high",
    },
    {
      id: 2,
      type: "volume",
      symbol: "TSLA",
      message: "Unusual volume spike (+340%)",
      time: "5 minutes ago",
      severity: "medium",
    },
    {
      id: 3,
      type: "price",
      symbol: "NVDA",
      message: "Down -3.2% on high volume",
      time: "12 minutes ago",
      severity: "low",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "breakout":
        return <TrendingUp className="h-4 w-4" />
      case "volume":
        return <Volume2 className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alerts & Signals</CardTitle>
            <CardDescription>Real-time market alerts and trading signals</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Alert
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getAlertIcon(alert.type)}
                <div>
                  <div className="font-medium">{alert.symbol}</div>
                  <div className="text-sm text-muted-foreground">{alert.message}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={getSeverityVariant(alert.severity)} className="mb-1">
                  {alert.severity}
                </Badge>
                <div className="text-xs text-muted-foreground">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
