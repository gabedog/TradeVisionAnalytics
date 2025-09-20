"use client"

import { useState, useEffect } from "react"
import { API_URLS } from "@/lib/config/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, Search, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Eye } from "lucide-react"

interface ApiException {
  id: number
  source: string
  exceptionType: string
  message: string
  stackTrace?: string
  timestamp: string
  severity: string
  isResolved: boolean
  resolvedAt?: string
  resolutionNotes?: string
  requestId?: string
  additionalContext?: string
}

export function ExceptionsTab() {
  const [exceptions, setExceptions] = useState<ApiException[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [limit] = useState(25)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [resolvedFilter, setResolvedFilter] = useState<string>("all")
  const [selectedError, setSelectedError] = useState<ApiException | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [resolving, setResolving] = useState(false)

  const fetchExceptions = async (offset = 0) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })

      if (severityFilter && severityFilter !== "all") params.append("severity", severityFilter)
      if (resolvedFilter && resolvedFilter !== "all") params.append("isResolved", resolvedFilter)

      const response = await fetch(`${API_URLS.csharpApi}/api/logging/exceptions?${params}`)
      if (!response.ok) throw new Error("Failed to fetch exceptions")
      const data = await response.json()
      setExceptions(data.exceptions)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExceptions(currentPage * limit)
  }, [currentPage, limit, severityFilter, resolvedFilter])

  const handleRefresh = () => {
    setCurrentPage(0)
    fetchExceptions(0)
  }

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleResolveException = async (id: number) => {
    try {
      setResolving(true)
      const response = await fetch(`${API_URLS.csharpApi}/api/logging/exceptions/${id}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resolutionNotes: resolutionNotes || "Resolved via admin interface"
        })
      })

      if (!response.ok) throw new Error("Failed to resolve exception")

      setSelectedError(null)
      setResolutionNotes("")
      handleRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve exception")
    } finally {
      setResolving(false)
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const filteredExceptions = exceptions.filter(exception =>
    exception.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exception.exceptionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exception.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Exceptions</CardTitle>
            <CardDescription>Track and manage system exceptions and errors</CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exceptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="false">Unresolved</SelectItem>
                <SelectItem value="true">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading exceptions...
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
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExceptions.map((exception) => (
                      <TableRow key={exception.id}>
                        <TableCell>
                          {exception.isResolved ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Open
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {new Date(exception.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {exception.source}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {exception.exceptionType}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {exception.message}
                        </TableCell>
                        <TableCell>
                          {getSeverityBadge(exception.severity)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedError(exception)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Exception Details</DialogTitle>
                                  <DialogDescription>
                                    {exception.exceptionType} from {exception.source}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium">Message</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{exception.message}</p>
                                  </div>
                                  {exception.stackTrace && (
                                    <div>
                                      <h4 className="font-medium">Stack Trace</h4>
                                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-40">
                                        {exception.stackTrace}
                                      </pre>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Severity:</span> {getSeverityBadge(exception.severity)}
                                    </div>
                                    <div>
                                      <span className="font-medium">Timestamp:</span> {new Date(exception.timestamp).toLocaleString()}
                                    </div>
                                    {exception.requestId && (
                                      <div>
                                        <span className="font-medium">Request ID:</span> {exception.requestId}
                                      </div>
                                    )}
                                    {exception.additionalContext && (
                                      <div>
                                        <span className="font-medium">Context:</span> {exception.additionalContext}
                                      </div>
                                    )}
                                  </div>
                                  {!exception.isResolved && (
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Resolution Notes</h4>
                                      <Textarea
                                        placeholder="Enter resolution notes..."
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                      />
                                    </div>
                                  )}
                                </div>
                                {!exception.isResolved && (
                                  <DialogFooter>
                                    <Button
                                      onClick={() => handleResolveException(exception.id)}
                                      disabled={resolving}
                                    >
                                      {resolving ? "Resolving..." : "Mark as Resolved"}
                                    </Button>
                                  </DialogFooter>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredExceptions.length} of {exceptions.length} exceptions
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
                    disabled={filteredExceptions.length < limit}
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