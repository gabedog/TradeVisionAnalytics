"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Shield } from "lucide-react"
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

      <div className="grid gap-6 md:grid-cols-2">
        <DataHealthCard />
        <JobsCard safeMode={safeMode} />
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
