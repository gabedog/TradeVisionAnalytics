"use client"

import { useState, useEffect } from "react"
import { API_URLS } from "@/lib/config/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface ApiCall {
  id: number
  endpoint: string
  httpMethod: string
  statusCode: number
  responseTimeMs: number
  timestamp: string
  symbolsRequested: number
  symbolsSuccessful: number
  symbolsFailed: number
  parameters?: string
  errorMessage?: string
  isSuccessful: boolean
}

export function ApiCallsTab() {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [limit] = useState(50)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchApiCalls = async (offset = 0) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URLS.csharpApi}/api/logging/api-calls?limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error("Failed to fetch API calls")
      const data = await response.json()
      setApiCalls(data.apiCalls)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiCalls(currentPage * limit)
  }, [currentPage, limit])

  const handleRefresh = () => {
    setCurrentPage(0)
    fetchApiCalls(0)
  }

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
    } else if (statusCode >= 400) {
      return <Badge variant="destructive">Error</Badge>
    } else {
      return <Badge variant="secondary">{statusCode}</Badge>
    }
  }

  const getResponseTimeBadge = (timeMs: number) => {
    if (timeMs < 500) {
      return <Badge variant="default" className="bg-green-100 text-green-800">{timeMs}ms</Badge>
    } else if (timeMs < 2000) {
      return <Badge variant="secondary">{timeMs}ms</Badge>
    } else {
      return <Badge variant="destructive">{timeMs}ms</Badge>
    }
  }

  const filteredCalls = apiCalls.filter(call =>
    call.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.httpMethod.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Call History</CardTitle>
            <CardDescription>Recent API calls with performance metrics</CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by endpoint or method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading API calls...
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-600">
              Error: {error}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Symbols</TableHead>
                      <TableHead>Success Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(call.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{call.httpMethod}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm max-w-xs truncate">
                          {call.endpoint}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(call.statusCode)}
                        </TableCell>
                        <TableCell>
                          {getResponseTimeBadge(call.responseTimeMs)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Requested: {call.symbolsRequested}</div>
                            <div>Successful: {call.symbolsSuccessful}</div>
                            {call.symbolsFailed > 0 && (
                              <div className="text-red-600">Failed: {call.symbolsFailed}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {call.symbolsRequested > 0 ? (
                            <Badge
                              variant={call.symbolsSuccessful === call.symbolsRequested ? "default" : "destructive"}
                              className={call.symbolsSuccessful === call.symbolsRequested ? "bg-green-100 text-green-800" : ""}
                            >
                              {((call.symbolsSuccessful / call.symbolsRequested) * 100).toFixed(0)}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredCalls.length} of {apiCalls.length} calls
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">Page {currentPage + 1}</span>
                  <Button
                    onClick={handleNextPage}
                    disabled={filteredCalls.length < limit}
                    variant="outline"
                    size="sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}