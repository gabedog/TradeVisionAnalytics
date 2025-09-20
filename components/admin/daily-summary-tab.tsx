"use client"

import { useState, useEffect } from "react"
import { API_URLS } from "@/lib/config/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface DailySummary {
  id: number
  date: string
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  uniqueSymbols: number
  averageResponseTimeMs: number
  totalSymbolsProcessed: number
  totalSymbolsSuccessful: number
  totalSymbolsFailed: number
  successRate: number
  symbolSuccessRate: number
  createdAt: string
  updatedAt?: string
}

export function DailySummaryTab() {
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const fetchSummaries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        startDate,
        endDate
      })

      const response = await fetch(`${API_URLS.csharpApi}/api/logging/daily-summaries?${params}`)
      if (!response.ok) throw new Error("Failed to fetch daily summaries")
      const data = await response.json()
      setSummaries(data.summaries)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const generateSummary = async (date: string) => {
    try {
      const response = await fetch(`${API_URLS.csharpApi}/api/logging/generate-daily-summary/${date}`, {
        method: "POST"
      })
      if (!response.ok) throw new Error("Failed to generate summary")
      await fetchSummaries() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary")
    }
  }

  useEffect(() => {
    fetchSummaries()
  }, [startDate, endDate])

  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 95) {
      return <Badge variant="default" className="bg-green-100 text-green-800">{rate.toFixed(1)}%</Badge>
    } else if (rate >= 80) {
      return <Badge variant="secondary">{rate.toFixed(1)}%</Badge>
    } else {
      return <Badge variant="destructive">{rate.toFixed(1)}%</Badge>
    }
  }

  const getResponseTimeBadge = (timeMs: number) => {
    if (timeMs < 500) {
      return <Badge variant="default" className="bg-green-100 text-green-800">{timeMs}ms</Badge>
    } else if (timeMs < 2000) {
      return <Badge variant="secondary">{timeMs}ms</Badge>
    } else {
      return <Badge variant="destructive">{timeMs}ms</Badge>
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily API Summary</CardTitle>
            <CardDescription>Aggregated daily statistics and performance metrics</CardDescription>
          </div>
          <Button onClick={fetchSummaries} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">From:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">To:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Button
              onClick={() => generateSummary(endDate)}
              variant="outline"
              size="sm"
            >
              Generate Today's Summary
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading summaries...
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-600">
              Error: {error}
            </div>
          ) : summaries.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No data available for the selected date range.
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summaries.reduce((sum, s) => sum + s.totalCalls, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across {summaries.length} days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summaries.length > 0
                        ? (summaries.reduce((sum, s) => sum + s.successRate, 0) / summaries.length).toFixed(1)
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      API call success rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Symbols Processed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summaries.reduce((sum, s) => sum + s.totalSymbolsProcessed, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Individual symbol requests
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {summaries.length > 0
                        ? Math.round(summaries.reduce((sum, s) => sum + s.averageResponseTimeMs, 0) / summaries.length)
                        : 0}ms
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average across all days
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>API Calls</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Symbols</TableHead>
                      <TableHead>Symbol Success</TableHead>
                      <TableHead>Avg Response</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaries.map((summary, index) => {
                      const previousSummary = summaries[index + 1]
                      return (
                        <TableRow key={summary.id}>
                          <TableCell className="font-medium">
                            {new Date(summary.date + 'T12:00:00').toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono">{summary.totalCalls.toLocaleString()}</span>
                              {previousSummary && getTrendIcon(summary.totalCalls, previousSummary.totalCalls)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {summary.successfulCalls} success, {summary.failedCalls} failed
                            </div>
                          </TableCell>
                          <TableCell>
                            {getSuccessRateBadge(summary.successRate)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Processed: {summary.totalSymbolsProcessed.toLocaleString()}</div>
                              <div className="text-muted-foreground">Unique: {summary.uniqueSymbols}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getSuccessRateBadge(summary.symbolSuccessRate)}
                            <div className="text-xs text-muted-foreground mt-1">
                              {summary.totalSymbolsSuccessful}/{summary.totalSymbolsProcessed}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getResponseTimeBadge(summary.averageResponseTimeMs)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {summary.updatedAt
                              ? new Date(summary.updatedAt).toLocaleString()
                              : new Date(summary.createdAt).toLocaleString()
                            }
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}