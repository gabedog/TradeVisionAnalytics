"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart3, Settings, Database, RefreshCw } from "lucide-react"
import { ChartTemplates } from "./chart-templates"
import { ChartDrawer } from "./chart-drawer"

export function ChartsContent() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [cacheEnabled, setCacheEnabled] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("candlestick")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Charts</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: 1 minute ago
          </Badge>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chart Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
                  placeholder="Enter symbol..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select defaultValue="1D">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Minute</SelectItem>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1H">1 Hour</SelectItem>
                    <SelectItem value="1D">1 Day</SelectItem>
                    <SelectItem value="1W">1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select defaultValue="6M">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1M">1 Month</SelectItem>
                    <SelectItem value="3M">3 Months</SelectItem>
                    <SelectItem value="6M">6 Months</SelectItem>
                    <SelectItem value="1Y">1 Year</SelectItem>
                    <SelectItem value="2Y">2 Years</SelectItem>
                    <SelectItem value="5Y">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="cache-data" className="text-sm">
                  Cache data locally
                </Label>
                <Switch id="cache-data" checked={cacheEnabled} onCheckedChange={setCacheEnabled} />
              </div>

              {cacheEnabled && (
                <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                  <Database className="h-3 w-3 inline mr-1" />
                  OHLC data will be saved to SQLite for reuse
                </div>
              )}

              <Button variant="outline" className="w-full bg-transparent" onClick={() => setDrawerOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Chart Settings
              </Button>
            </CardContent>
          </Card>

          <ChartTemplates selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                {selectedSymbol} - {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Chart
              </CardTitle>
              <CardDescription>Interactive price chart with technical indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Chart for {selectedSymbol} will be displayed here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Template: {selectedTemplate} | Cache: {cacheEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Tabs defaultValue="indicators" className="w-full">
              <TabsList>
                <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
                <TabsTrigger value="overlays">Overlays</TabsTrigger>
                <TabsTrigger value="studies">Studies</TabsTrigger>
              </TabsList>
              <TabsContent value="indicators" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["RSI", "MACD", "Bollinger Bands", "Stochastic", "Williams %R", "CCI", "ADX", "ATR"].map(
                        (indicator) => (
                          <Button key={indicator} variant="outline" size="sm">
                            {indicator}
                          </Button>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="overlays" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        "SMA",
                        "EMA",
                        "Volume",
                        "Support/Resistance",
                        "Fibonacci",
                        "Trend Lines",
                        "Channels",
                        "Pivot Points",
                      ].map((overlay) => (
                        <Button key={overlay} variant="outline" size="sm">
                          {overlay}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="studies" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        "Volume Profile",
                        "Market Profile",
                        "VWAP",
                        "Anchored VWAP",
                        "Time & Sales",
                        "Order Flow",
                        "Delta",
                        "Cumulative Delta",
                      ].map((study) => (
                        <Button key={study} variant="outline" size="sm">
                          {study}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ChartDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}
