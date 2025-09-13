"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Building, TrendingUp, RefreshCw } from "lucide-react"

export function OwnershipContent() {
  const institutionalHolders = [
    { name: "Vanguard Group Inc", shares: "1.3B", percentage: "8.4%", value: "$240.9B", change: "+0.2%" },
    { name: "BlackRock Inc", shares: "1.1B", percentage: "7.1%", value: "$203.8B", change: "+0.1%" },
    { name: "Berkshire Hathaway Inc", shares: "915.6M", percentage: "5.9%", value: "$169.6B", change: "0.0%" },
    { name: "State Street Corp", shares: "631.2M", percentage: "4.1%", value: "$116.9B", change: "+0.3%" },
    { name: "Fidelity Management", shares: "445.8M", percentage: "2.9%", value: "$82.6B", change: "-0.1%" },
  ]

  const insiderHolders = [
    { name: "Timothy D. Cook", title: "CEO", shares: "3.3M", percentage: "0.02%", value: "$611.3M" },
    { name: "Luca Maestri", title: "CFO", shares: "110.1K", percentage: "0.001%", value: "$20.4M" },
    { name: "Katherine L. Adams", title: "General Counsel", shares: "427.3K", percentage: "0.003%", value: "$79.1M" },
    { name: "Deirdre O'Brien", title: "SVP People", shares: "136.1K", percentage: "0.001%", value: "$25.2M" },
  ]

  const ownershipBreakdown = [
    { type: "Institutional", percentage: 59.8, color: "bg-blue-500" },
    { type: "Mutual Funds", percentage: 23.4, color: "bg-green-500" },
    { type: "Individual", percentage: 12.1, color: "bg-yellow-500" },
    { type: "Insider", percentage: 0.1, color: "bg-purple-500" },
    { type: "Other", percentage: 4.6, color: "bg-gray-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ownership Structure</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">AAPL</Badge>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ownership Breakdown
            </CardTitle>
            <CardDescription>Distribution of shares by holder type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ownershipBreakdown.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <span className="text-lg font-bold">{item.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="mt-6 h-4 bg-muted rounded-full overflow-hidden flex">
              {ownershipBreakdown.map((item) => (
                <div key={item.type} className={item.color} style={{ width: `${item.percentage}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Shares Outstanding</span>
                <span className="font-medium">15.55B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Float</span>
                <span className="font-medium">15.53B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Institutional Ownership</span>
                <span className="font-medium">59.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Insider Ownership</span>
                <span className="font-medium">0.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Short Interest</span>
                <span className="font-medium">0.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Days to Cover</span>
                <span className="font-medium">1.2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Top Institutional Holders
          </CardTitle>
          <CardDescription>Largest institutional shareholders and recent changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutionalHolders.map((holder) => (
                <TableRow key={holder.name}>
                  <TableCell className="font-medium">{holder.name}</TableCell>
                  <TableCell className="text-right">{holder.shares}</TableCell>
                  <TableCell className="text-right">{holder.percentage}</TableCell>
                  <TableCell className="text-right">{holder.value}</TableCell>
                  <TableCell
                    className={`text-right ${holder.change.startsWith("+") ? "text-green-600" : holder.change.startsWith("-") ? "text-red-600" : "text-muted-foreground"}`}
                  >
                    {holder.change}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Insider Holdings
          </CardTitle>
          <CardDescription>Key executives and their shareholdings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insiderHolders.map((holder) => (
                <TableRow key={holder.name}>
                  <TableCell className="font-medium">{holder.name}</TableCell>
                  <TableCell>{holder.title}</TableCell>
                  <TableCell className="text-right">{holder.shares}</TableCell>
                  <TableCell className="text-right">{holder.percentage}</TableCell>
                  <TableCell className="text-right">{holder.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
