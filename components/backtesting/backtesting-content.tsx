"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Pause, Download, FolderOpen, Save, Target, BarChart3 } from "lucide-react"
import { StrategySelector } from "./strategy-selector"
import { BacktestResults } from "./backtest-results"

export function BacktestingContent() {
  const [jobStatus, setJobStatus] = useState<"idle" | "queued" | "running" | "done" | "failed">("idle")
  const [progress, setProgress] = useState(0)
  const [selectedStrategy, setSelectedStrategy] = useState("moving-average-crossover")

  const handleRunBacktest = () => {
    setJobStatus("queued")
    setTimeout(() => {
      setJobStatus("running")
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setJobStatus("done")
            return 100
          }
          return prev + 10
        })
      }, 500)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-500"
      case "done":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      case "queued":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Backtesting</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getStatusColor(jobStatus)} text-white`}>
            {jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}
          </Badge>
          {jobStatus === "done" && (
            <>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Run
              </Button>
              <Button size="sm" variant="outline">
                <FolderOpen className="h-4 w-4 mr-2" />
                Open Results
              </Button>
            </>
          )}
        </div>
      </div>

      <Alert>
        <Target className="h-4 w-4" />
        <AlertDescription>
          Storage policy: Full trade logs exported to CSV; DB keeps metrics + daily equity curve. Results are saved to
          ./data/backtests/ folder.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <StrategySelector selectedStrategy={selectedStrategy} onStrategyChange={setSelectedStrategy} />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Execution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobStatus === "running" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                  <div className="text-xs text-muted-foreground">Processing trades and calculating metrics...</div>
                </div>
              )}

              <Button
                onClick={handleRunBacktest}
                disabled={jobStatus === "running" || jobStatus === "queued"}
                className="w-full"
              >
                {jobStatus === "running" ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Backtest
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground">
                Job status:{" "}
                {jobStatus === "idle"
                  ? "Ready to run"
                  : jobStatus === "queued"
                    ? "Queued for execution"
                    : jobStatus === "running"
                      ? "Currently running"
                      : jobStatus === "done"
                        ? "Completed successfully"
                        : "Failed"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {jobStatus === "done" ? (
            <BacktestResults />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Backtest Results
                </CardTitle>
                <CardDescription>Results will appear here after running a backtest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a strategy and run a backtest to see results</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Strategy: {selectedStrategy.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
