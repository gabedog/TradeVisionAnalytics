"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_URLS } from "@/lib/config/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Download,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  XCircle,
  Plus,
  BarChart3,
  AlertTriangle
} from "lucide-react"

interface ETF {
  id: number
  symbol: string
  name: string
  type: string
  description?: string
  sector?: string
  industry?: string
  lastUpdated?: string
}

interface Holding {
  id: number
  symbol: string
  name: string
  weight: number
  shares: number
  marketValue: number
  isTracked: boolean
  lastUpdated: string
}

interface ImportProgress {
  isImporting: boolean
  progress: number
  currentStep: string
  results?: {
    success: boolean
    message: string
    holdings: {
      total: number
      imported: number
      updated: number
      errors: number
    }
    symbols: {
      newSymbols: number
      existingSymbols: number
    }
    timing: {
      durationMs: number
    }
  }
}

interface ETFDetailContentProps {
  etfId: string
}

export function ETFDetailContent({ etfId }: ETFDetailContentProps) {
  const router = useRouter()
  const [etf, setEtf] = useState<ETF | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    isImporting: false,
    progress: 0,
    currentStep: ""
  })

  const fetchETFData = async () => {
    try {
      setLoading(true)

      // Fetch ETF info
      const etfResponse = await fetch(`${API_URLS.csharpApi}/api/etfs`)
      if (!etfResponse.ok) throw new Error("Failed to fetch ETF data")
      const etfData = await etfResponse.json()
      const foundETF = etfData.etfs.find((e: ETF) => e.id.toString() === etfId)

      if (!foundETF) {
        setError("ETF not found")
        return
      }

      setEtf(foundETF)

      // Fetch holdings
      const holdingsResponse = await fetch(`${API_URLS.csharpApi}/api/etfs/${etfId}/holdings`)
      if (!holdingsResponse.ok) throw new Error("Failed to fetch holdings")
      const holdingsData = await holdingsResponse.json()

      setHoldings(holdingsData.holdings || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const clearImportResults = () => {
    setImportProgress({
      isImporting: false,
      progress: 0,
      currentStep: "",
      results: undefined
    })
  }

  const handleImportHoldings = async () => {
    try {
      setImportProgress({
        isImporting: true,
        progress: 10,
        currentStep: "Connecting to data provider..."
      })

      // Simulate progress updates
      setTimeout(() => {
        setImportProgress(prev => ({
          ...prev,
          progress: 30,
          currentStep: "Fetching ETF holdings data..."
        }))
      }, 500)

      setTimeout(() => {
        setImportProgress(prev => ({
          ...prev,
          progress: 60,
          currentStep: "Processing holdings and symbols..."
        }))
      }, 1500)

      const response = await fetch(`${API_URLS.csharpApi}/api/etfs/${etfId}/import-holdings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(300000) // 5 minute timeout
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to import holdings: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      setImportProgress(prev => ({
        ...prev,
        progress: 100,
        currentStep: "Import completed!",
        results: result
      }))

      // Refresh the holdings data
      setTimeout(() => {
        fetchETFData()
        setImportProgress({
          isImporting: false,
          progress: 0,
          currentStep: ""
        })
      }, 2000)

    } catch (err) {
      setImportProgress({
        isImporting: false,
        progress: 0,
        currentStep: "",
        results: {
          success: false,
          message: err instanceof Error ? err.message : "Import failed",
          holdings: { total: 0, imported: 0, updated: 0, errors: 1 },
          symbols: { newSymbols: 0, existingSymbols: 0 },
          timing: { durationMs: 0 }
        }
      })
    }
  }

  const handleStartTracking = async (symbolId: number, symbol: string) => {
    try {
      const response = await fetch(`${API_URLS.csharpApi}/api/symbols`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: symbol,
          name: symbol,
          type: "STOCK"
        })
      })

      if (response.ok) {
        fetchETFData() // Refresh to show updated tracking status
      }
    } catch (err) {
      console.error("Failed to start tracking:", err)
    }
  }

  const getTrackingBadge = (isTracked: boolean) => {
    return isTracked ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Tracked
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-600">
        <XCircle className="h-3 w-3 mr-1" />
        Not Tracked
      </Badge>
    )
  }

  useEffect(() => {
    fetchETFData()
  }, [etfId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin mr-2" />
        Loading ETF details...
      </div>
    )
  }

  if (error || !etf) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error: {error || "ETF not found"}</span>
            </div>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const trackedCount = holdings.filter(h => h.isTracked).length
  const trackingPercentage = holdings.length > 0 ? (trackedCount / holdings.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to ETFs
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{etf.symbol}</h1>
            <p className="text-muted-foreground">{etf.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchETFData}
            variant="outline"
            size="sm"
            title="Refreshes ETF details and current holdings data from the database"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleImportHoldings}
            disabled={importProgress.isImporting}
            title="Imports latest ETF holdings data from Financial Modeling Prep API and updates the database with current positions and weights"
          >
            <Download className="h-4 w-4 mr-2" />
            {importProgress.isImporting ? "Importing..." : "Import Holdings"}
          </Button>
        </div>
      </div>

      {/* ETF Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holdings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">
              {trackedCount} tracked ({trackingPercentage.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracking Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trackedCount}</div>
            <Progress value={trackingPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {etf.lastUpdated ? new Date(etf.lastUpdated).toLocaleDateString() : "Never"}
            </div>
            <p className="text-xs text-muted-foreground">
              Holdings data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>
            Manage tracking and historical data for ETF holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No holdings data available.</p>
              <Button onClick={handleImportHoldings} className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                Import Holdings
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Weight %</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Market Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((holding) => (
                    <TableRow key={holding.id}>
                      <TableCell className="font-mono font-medium">
                        {holding.symbol}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {holding.name}
                      </TableCell>
                      <TableCell className="font-mono">
                        {holding.weight?.toFixed(3)}%
                      </TableCell>
                      <TableCell className="font-mono">
                        {holding.shares?.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono">
                        ${holding.marketValue?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getTrackingBadge(holding.isTracked)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!holding.isTracked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartTracking(holding.id, holding.symbol)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Track
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Navigate to historical data page
                                router.push(`/admin/symbols/${holding.id}/historical`)
                              }}
                            >
                              <BarChart3 className="h-4 w-4 mr-1" />
                              History
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Progress Dialog */}
      <Dialog
        open={importProgress.isImporting || !!importProgress.results}
        onOpenChange={(open) => {
          if (!open && !importProgress.isImporting) {
            clearImportResults()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {importProgress.isImporting ? "Importing Holdings" : "Import Complete"}
            </DialogTitle>
            <DialogDescription>
              {importProgress.isImporting ? importProgress.currentStep : "Holdings import finished"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {importProgress.isImporting && (
              <div>
                <Progress value={importProgress.progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">{importProgress.progress}%</p>
              </div>
            )}

            {importProgress.results && (
              <div className="space-y-2">
                <div className={`p-3 rounded ${importProgress.results.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={importProgress.results.success ? 'text-green-800' : 'text-red-800'}>
                    {importProgress.results.message}
                  </p>
                </div>

                {importProgress.results.success && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Holdings:</span>
                      <ul className="mt-1 space-y-1">
                        <li>• Total: {importProgress.results.holdings.total}</li>
                        <li>• Imported: {importProgress.results.holdings.imported}</li>
                        <li>• Updated: {importProgress.results.holdings.updated}</li>
                        <li>• Errors: {importProgress.results.holdings.errors}</li>
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Symbols:</span>
                      <ul className="mt-1 space-y-1">
                        <li>• New: {importProgress.results.symbols.newSymbols}</li>
                        <li>• Existing: {importProgress.results.symbols.existingSymbols}</li>
                      </ul>
                      <p className="mt-2">
                        <span className="font-medium">Duration:</span> {importProgress.results.timing.durationMs}ms
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}