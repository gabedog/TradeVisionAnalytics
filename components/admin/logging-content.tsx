"use client"

import { useState, useEffect } from "react"
import { API_URLS } from "@/lib/config/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertTriangle, BarChart3, Clock, TrendingUp, RefreshCw } from "lucide-react"
import { ApiCallsTab } from "./api-calls-tab"
import { ExceptionsTab } from "./exceptions-tab"
import { DailySummaryTab } from "./daily-summary-tab"

interface DashboardStats {
  today: {
    totalCalls: number
    successfulCalls: number
    failedCalls: number
    successRate: number
    averageResponseTime: number
    totalSymbolsProcessed: number
    symbolSuccessRate: number
  }
  thisWeek: {
    totalCalls: number
    successfulCalls: number
    failedCalls: number
    successRate: number
    averageResponseTime: number
    totalSymbolsProcessed: number
    symbolSuccessRate: number
  }
  recentExceptions: Array<{
    id: number
    source: string
    exceptionType: string
    message: string
    severity: string
    timestamp: string
    isResolved: boolean
  }>
  recentApiCalls: Array<{
    id: number
    endpoint: string
    httpMethod: string
    statusCode: number
    responseTimeMs: number
    timestamp: string
    symbolsRequested: number
    symbolsSuccessful: number
    symbolsFailed: number
  }>
  generatedAt: string
}

export function LoggingContent() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URLS.csharpApi}/api/logging/dashboard`)
      if (!response.ok) throw new Error("Failed to fetch dashboard data")
      const data = await response.json()
      setDashboardData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error loading dashboard: {error}</span>
            </div>
            <Button onClick={fetchDashboard} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">System Logging</h2>
        <Button onClick={fetchDashboard} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Dashboard Overview */}
      {dashboardData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's API Calls</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.today.totalCalls}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.today.successRate.toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Week's API Calls</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.thisWeek.totalCalls}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.thisWeek.successRate.toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(dashboardData.today.averageResponseTime)}ms</div>
              <p className="text-xs text-muted-foreground">
                Today's average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unresolved Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.recentExceptions.length}</div>
              <p className="text-xs text-muted-foreground">
                Recent exceptions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for detailed views */}
      <Tabs defaultValue="api-calls" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api-calls">API Calls</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="daily-summary">Daily Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="api-calls">
          <ApiCallsTab />
        </TabsContent>

        <TabsContent value="exceptions">
          <ExceptionsTab />
        </TabsContent>

        <TabsContent value="daily-summary">
          <DailySummaryTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}