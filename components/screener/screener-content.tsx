"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, Search, Download, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import { ScreenerFilters } from "./screener-filters"

export function ScreenerContent() {
  const [results, setResults] = useState([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 185.23,
      change: 2.34,
      changePercent: 1.28,
      volume: 45234567,
      marketCap: "2.89T",
      pe: 28.5,
      dividend: 0.24,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 378.45,
      change: -1.23,
      changePercent: -0.32,
      volume: 23456789,
      marketCap: "2.81T",
      pe: 32.1,
      dividend: 0.75,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.67,
      change: 0.87,
      changePercent: 0.61,
      volume: 18765432,
      marketCap: "1.78T",
      pe: 25.3,
      dividend: 0.0,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Stock Screener</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {results.length} results
          </Badge>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ScreenerFilters />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Screening Results
                  </CardTitle>
                  <CardDescription>Stocks matching your criteria</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Filter results..." className="w-64 pl-9" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead className="text-right">P/E</TableHead>
                    <TableHead className="text-right">Dividend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((stock) => (
                    <TableRow key={stock.symbol} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell className="max-w-48 truncate">{stock.name}</TableCell>
                      <TableCell className="text-right font-medium">${stock.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {stock.change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={stock.change > 0 ? "text-green-600" : "text-red-600"}>
                            {stock.change > 0 ? "+" : ""}
                            {stock.change} ({stock.changePercent > 0 ? "+" : ""}
                            {stock.changePercent}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{(stock.volume / 1000000).toFixed(1)}M</TableCell>
                      <TableCell className="text-right">{stock.marketCap}</TableCell>
                      <TableCell className="text-right">{stock.pe}</TableCell>
                      <TableCell className="text-right">{stock.dividend > 0 ? `$${stock.dividend}` : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
