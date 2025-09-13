"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Pause, CheckCircle, AlertTriangle } from "lucide-react"

export function SchedulerCard() {
  const jobs = [
    {
      name: "EOD Ingest",
      schedule: "Daily at 17:00",
      status: "active",
      lastRun: "2024-01-15 17:00",
      nextRun: "2024-01-16 17:00",
      result: "success",
    },
    {
      name: "Delta Update",
      schedule: "Every 15 minutes",
      status: "active",
      lastRun: "2024-01-15 17:45",
      nextRun: "2024-01-15 18:00",
      result: "success",
    },
    {
      name: "Prune/Archive",
      schedule: "Daily at 02:00",
      status: "active",
      lastRun: "2024-01-15 02:00",
      nextRun: "2024-01-16 02:00",
      result: "success",
    },
    {
      name: "Weekly Maintenance",
      schedule: "Sundays at 01:00",
      status: "active",
      lastRun: "2024-01-14 01:00",
      nextRun: "2024-01-21 01:00",
      result: "warning",
    },
  ]

  const getStatusIcon = (result: string) => {
    switch (result) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    return status === "active" ? "default" : "secondary"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Scheduler (Hangfire)
        </CardTitle>
        <CardDescription>Recurring job status and management (no SQL Agent required)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.name} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.result)}
                  <span className="font-medium">{job.name}</span>
                  <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pause className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{job.schedule}</div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Last: {job.lastRun}</span>
                <span>Next: {job.nextRun}</span>
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Scheduler Log Tail</h4>
            <div className="text-xs font-mono space-y-1">
              <div>[17:45:00] Starting scheduled Delta Update job</div>
              <div>[17:45:23] Job completed successfully in 23 seconds</div>
              <div>[17:46:00] Next Delta Update scheduled for 18:00</div>
              <div>[02:00:00] Weekly Maintenance completed with warnings</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
