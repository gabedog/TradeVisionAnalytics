"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export function AdvanceDeclineChart() {
  const data = [
    { date: "2024-01-08", advancing: 1234, declining: 987 },
    { date: "2024-01-09", advancing: 1456, declining: 765 },
    { date: "2024-01-10", advancing: 987, declining: 1234 },
    { date: "2024-01-11", advancing: 1567, declining: 654 },
    { date: "2024-01-12", advancing: 1247, declining: 856 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Advance/Decline History
        </CardTitle>
        <CardDescription>5-day advance/decline trend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((day, index) => {
            const total = day.advancing + day.declining
            const advancePercent = (day.advancing / total) * 100
            const net = day.advancing - day.declining

            return (
              <div key={day.date} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{new Date(day.date).toLocaleDateString()}</span>
                  <span className={net > 0 ? "text-green-600" : "text-red-600"}>
                    {net > 0 ? "+" : ""}
                    {net}
                  </span>
                </div>
                <div className="flex h-6 rounded-md overflow-hidden">
                  <div
                    className="bg-green-500 flex items-center justify-center text-xs text-white"
                    style={{ width: `${advancePercent}%` }}
                  >
                    {day.advancing}
                  </div>
                  <div
                    className="bg-red-500 flex items-center justify-center text-xs text-white"
                    style={{ width: `${100 - advancePercent}%` }}
                  >
                    {day.declining}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
