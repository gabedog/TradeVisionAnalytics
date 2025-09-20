"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Shield, TrendingUp, BarChart3, ArrowRight, FileText } from "lucide-react"
import Link from "next/link"
import { DataHealthCard } from "./data-health-card"
import { JobsCard } from "./jobs-card"
import { DatabaseCard } from "./database-card"
import { RetentionCard } from "./retention-card"
import { SchedulerCard } from "./scheduler-card"

export function AdminContent() {
  const [safeMode, setSafeMode] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Safe Mode</span>
            <Switch checked={safeMode} onCheckedChange={setSafeMode} />
          </div>
        </div>
      </div>

      {safeMode && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Safe Mode is enabled. Heavy operations like "Update All" are disabled and will show confirmation warnings.
          </AlertDescription>
        </Alert>
      )}

      {/* Symbol Management Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Stock Symbols
            </CardTitle>
            <CardDescription>Manage individual stock symbols for tracking and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Add, remove, and configure individual stock symbols for historical data collection starting January 1, 2020.
              </div>
              <Link href="/admin/symbols">
                <Button className="w-full justify-between">
                  Manage Stock Symbols
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              ETF Holdings
            </CardTitle>
            <CardDescription>Manage ETF symbols and their underlying stock holdings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Track ETF symbols and automatically monitor their individual stock holdings with full historical data.
              </div>
              <Link href="/admin/etfs">
                <Button className="w-full justify-between">
                  Manage ETF Holdings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Management Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataHealthCard />
        <JobsCard safeMode={safeMode} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              System Logging
            </CardTitle>
            <CardDescription>Monitor API calls, exceptions, and system health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                View detailed logs, track API performance, and monitor system exceptions in real-time.
              </div>
              <Link href="/admin/logging">
                <Button className="w-full justify-between">
                  View System Logs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DatabaseCard />
        <RetentionCard />
      </div>

      <div className="grid gap-6">
        <SchedulerCard />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <CardDescription>Financial Modeling Prep API key configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">API Key</div>
              <div className="text-sm text-muted-foreground">fmp_••••••••••••••••••••••••••••••••</div>
            </div>
            <Button variant="outline" size="sm">
              Edit in Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
