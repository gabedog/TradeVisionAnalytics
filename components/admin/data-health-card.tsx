"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, CheckCircle } from "lucide-react"

export function DataHealthCard() {
  const exchanges = [
    { name: "NYSE", lastEOD: "2024-01-15 16:00 EST", status: "healthy", missingBars: 0 },
    { name: "NASDAQ", lastEOD: "2024-01-15 16:00 EST", status: "healthy", missingBars: 0 },
    { name: "AMEX", lastEOD: "2024-01-15 16:00 EST", status: "warning", missingBars: 12 },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "healthy":
        return "default"
      case "warning":
        return "secondary"
      default:
        return "destructive"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Data Health
        </CardTitle>
        <CardDescription>EOD data status and missing bars count</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">FMP API Calls Today</span>
            <Badge variant="outline">1,247 / 5,000</Badge>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Exchange Status</h4>
            {exchanges.map((exchange) => (
              <div key={exchange.name} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {getStatusIcon(exchange.status)}
                  <span className="font-medium">{exchange.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{exchange.lastEOD}</div>
                  {exchange.missingBars > 0 && (
                    <Badge variant={getStatusVariant(exchange.status)} className="text-xs mt-1">
                      {exchange.missingBars} missing
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
