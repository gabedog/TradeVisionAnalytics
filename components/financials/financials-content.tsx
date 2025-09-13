"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Download, RefreshCw } from "lucide-react"

export function FinancialsContent() {
  const incomeStatement = [
    { item: "Revenue", q1: "97.3B", q2: "94.8B", q3: "89.5B", q4: "117.2B", annual: "398.8B" },
    { item: "Cost of Revenue", q1: "54.7B", q2: "52.8B", q3: "48.3B", q4: "64.3B", annual: "220.1B" },
    { item: "Gross Profit", q1: "42.6B", q2: "42.0B", q3: "41.2B", q4: "52.9B", annual: "178.7B" },
    { item: "Operating Expenses", q1: "13.4B", q2: "13.1B", q3: "13.2B", q4: "14.3B", annual: "54.0B" },
    { item: "Operating Income", q1: "29.2B", q2: "28.9B", q3: "28.0B", q4: "38.6B", annual: "124.7B" },
    { item: "Net Income", q1: "25.0B", q2: "24.2B", q3: "22.9B", q4: "33.9B", annual: "106.0B" },
  ]

  const balanceSheet = [
    { item: "Total Assets", current: "352.8B", previous: "365.7B" },
    { item: "Current Assets", current: "143.6B", previous: "135.4B" },
    { item: "Cash and Equivalents", current: "29.9B", previous: "48.3B" },
    { item: "Total Liabilities", current: "290.4B", previous: "302.1B" },
    { item: "Current Liabilities", current: "145.3B", previous: "153.9B" },
    { item: "Total Equity", current: "62.4B", previous: "63.6B" },
  ]

  const cashFlow = [
    { item: "Operating Cash Flow", q1: "28.6B", q2: "26.3B", q3: "24.0B", q4: "34.0B", annual: "112.9B" },
    { item: "Investing Cash Flow", q1: "-4.1B", q2: "-2.8B", q3: "-1.7B", q4: "-10.1B", annual: "-18.7B" },
    { item: "Financing Cash Flow", q1: "-23.5B", q2: "-25.2B", q3: "-18.8B", q4: "-20.7B", annual: "-88.2B" },
    { item: "Free Cash Flow", q1: "24.2B", q2: "23.1B", q3: "20.8B", q4: "26.3B", annual: "94.4B" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Financial Statements</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">AAPL</Badge>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="income" className="w-full">
        <TabsList>
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Income Statement
              </CardTitle>
              <CardDescription>Quarterly and annual income statement data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Q1 2024</TableHead>
                    <TableHead className="text-right">Q2 2024</TableHead>
                    <TableHead className="text-right">Q3 2024</TableHead>
                    <TableHead className="text-right">Q4 2024</TableHead>
                    <TableHead className="text-right">Annual 2024</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeStatement.map((row) => (
                    <TableRow key={row.item}>
                      <TableCell className="font-medium">{row.item}</TableCell>
                      <TableCell className="text-right">{row.q1}</TableCell>
                      <TableCell className="text-right">{row.q2}</TableCell>
                      <TableCell className="text-right">{row.q3}</TableCell>
                      <TableCell className="text-right">{row.q4}</TableCell>
                      <TableCell className="text-right font-medium">{row.annual}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Balance Sheet
              </CardTitle>
              <CardDescription>Current and previous period balance sheet data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Current Period</TableHead>
                    <TableHead className="text-right">Previous Period</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheet.map((row) => {
                    const current = Number.parseFloat(row.current.replace("B", ""))
                    const previous = Number.parseFloat(row.previous.replace("B", ""))
                    const change = (((current - previous) / previous) * 100).toFixed(1)

                    return (
                      <TableRow key={row.item}>
                        <TableCell className="font-medium">{row.item}</TableCell>
                        <TableCell className="text-right">{row.current}</TableCell>
                        <TableCell className="text-right">{row.previous}</TableCell>
                        <TableCell
                          className={`text-right ${Number.parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {Number.parseFloat(change) >= 0 ? "+" : ""}
                          {change}%
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cash Flow Statement
              </CardTitle>
              <CardDescription>Quarterly and annual cash flow data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Q1 2024</TableHead>
                    <TableHead className="text-right">Q2 2024</TableHead>
                    <TableHead className="text-right">Q3 2024</TableHead>
                    <TableHead className="text-right">Q4 2024</TableHead>
                    <TableHead className="text-right">Annual 2024</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashFlow.map((row) => (
                    <TableRow key={row.item}>
                      <TableCell className="font-medium">{row.item}</TableCell>
                      <TableCell className="text-right">{row.q1}</TableCell>
                      <TableCell className="text-right">{row.q2}</TableCell>
                      <TableCell className="text-right">{row.q3}</TableCell>
                      <TableCell className="text-right">{row.q4}</TableCell>
                      <TableCell className="text-right font-medium">{row.annual}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
