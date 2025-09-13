"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart, TrendingUp, Activity } from "lucide-react"

interface ChartTemplatesProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

export function ChartTemplates({ selectedTemplate, onTemplateChange }: ChartTemplatesProps) {
  const templates = [
    {
      id: "candlestick",
      name: "Candlestick",
      icon: BarChart3,
      description: "OHLC candlestick chart",
    },
    {
      id: "line",
      name: "Line Chart",
      icon: LineChart,
      description: "Simple line chart",
    },
    {
      id: "volume",
      name: "Volume",
      icon: Activity,
      description: "Volume bars",
    },
    {
      id: "renko",
      name: "Renko",
      icon: TrendingUp,
      description: "Renko bricks",
    },
  ]

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Chart Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {templates.map((template) => {
            const Icon = template.icon
            return (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onTemplateChange(template.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
