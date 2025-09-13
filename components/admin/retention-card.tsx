"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Archive, Play } from "lucide-react"

export function RetentionCard() {
  const [dailyYears, setDailyYears] = useState("5")
  const [intradayDays, setIntradayDays] = useState("30")
  const [annualReports, setAnnualReports] = useState("10")
  const [quarterlyReports, setQuarterlyReports] = useState("20")
  const [pruneProgress, setPruneProgress] = useState(0)
  const [isPruning, setIsPruning] = useState(false)

  const handlePrune = () => {
    setIsPruning(true)
    // Simulate progress
    const interval = setInterval(() => {
      setPruneProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsPruning(false)
          return 0
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Data Retention
        </CardTitle>
        <CardDescription>Configure data retention policies and archival</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily-years">Daily Bars (Years)</Label>
              <Input
                id="daily-years"
                value={dailyYears}
                onChange={(e) => setDailyYears(e.target.value)}
                type="number"
                min="1"
                max="20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intraday-days">Intraday (Days, Watchlists Only)</Label>
              <Input
                id="intraday-days"
                value={intradayDays}
                onChange={(e) => setIntradayDays(e.target.value)}
                type="number"
                min="1"
                max="365"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual-reports">Annual Reports</Label>
              <Input
                id="annual-reports"
                value={annualReports}
                onChange={(e) => setAnnualReports(e.target.value)}
                type="number"
                min="1"
                max="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quarterly-reports">Quarterly Reports</Label>
              <Input
                id="quarterly-reports"
                value={quarterlyReports}
                onChange={(e) => setQuarterlyReports(e.target.value)}
                type="number"
                min="1"
                max="100"
              />
            </div>
          </div>

          {isPruning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pruning in progress...</span>
                <span>{pruneProgress}%</span>
              </div>
              <Progress value={pruneProgress} />
            </div>
          )}

          <Button onClick={handlePrune} disabled={isPruning} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            {isPruning ? "Pruning..." : "Run Prune/Archive"}
          </Button>

          <div className="text-xs text-muted-foreground">
            <div>Estimated space to be freed: ~450 MB</div>
            <div>Last prune: 2024-01-13 02:15 (freed 380 MB)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
