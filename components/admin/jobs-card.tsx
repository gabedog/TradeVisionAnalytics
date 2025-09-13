"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface JobsCardProps {
  safeMode: boolean
}

export function JobsCard({ safeMode }: JobsCardProps) {
  const [showWarning, setShowWarning] = useState(false)

  const jobs = [
    {
      name: "Smart Bulk (EOD)",
      description: "Full EOD data fetch for all symbols",
      lastRun: "2024-01-15 16:30",
      nextRun: "Manual",
      status: "idle",
      duration: "45 minutes",
    },
    {
      name: "Delta Update",
      description: "Incremental updates for recent data",
      lastRun: "2024-01-15 17:45",
      nextRun: "18:00",
      status: "scheduled",
      duration: "5 minutes",
    },
  ]

  const handleHeavyOperation = (jobName: string) => {
    if (safeMode && jobName.includes("Bulk")) {
      setShowWarning(true)
      return
    }
    // Execute job
    console.log(`Starting ${jobName}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4 text-blue-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Jobs
        </CardTitle>
        <CardDescription>Data ingestion and update jobs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showWarning && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Safe Mode is enabled. This operation may take significant time and resources.
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="destructive" onClick={() => setShowWarning(false)}>
                    Proceed Anyway
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowWarning(false)}>
                    Cancel
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {jobs.map((job) => (
            <div key={job.name} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  <span className="font-medium">{job.name}</span>
                  <Badge variant="outline">{job.status}</Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleHeavyOperation(job.name)}>
                  Run Now
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Last: {job.lastRun}</span>
                <span>Next: {job.nextRun}</span>
                <span>Duration: {job.duration}</span>
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Recent Log Tail</h4>
            <div className="text-xs font-mono space-y-1">
              <div>[17:45:23] Delta update started for 3,247 symbols</div>
              <div>[17:45:45] Fetched 1,234 price updates from FMP</div>
              <div>[17:46:12] Updated database with new EOD data</div>
              <div>[17:46:15] Delta update completed successfully</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
