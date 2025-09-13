"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Database, HardDrive, FolderOpen, Archive } from "lucide-react"

export function DatabaseCard() {
  const dbSize = 2.4 // GB
  const dbLimit = 10 // GB
  const usagePercent = (dbSize / dbLimit) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database (SQL Server Express)
        </CardTitle>
        <CardDescription>Local database status and management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Server/Instance</div>
              <div className="text-sm text-muted-foreground">.\\SQLEXPRESS</div>
            </div>
            <div>
              <div className="text-sm font-medium">Database</div>
              <div className="text-sm text-muted-foreground">StockAnalysis</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Storage Usage</span>
              <span>
                {dbSize} GB / {dbLimit} GB
              </span>
            </div>
            <Progress value={usagePercent} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {(dbLimit - dbSize).toFixed(1)} GB free headroom remaining
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Archive className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <HardDrive className="h-4 w-4 mr-2" />
              Compact DB
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <FolderOpen className="h-4 w-4 mr-2" />
              Open Backups
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <div>Last backup: 2024-01-14 23:00</div>
            <div>Last maintenance: 2024-01-13 02:00</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
