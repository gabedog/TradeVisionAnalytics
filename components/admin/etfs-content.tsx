"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_URLS } from "@/lib/config/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Trash2, BarChart3, Calendar, CheckCircle, XCircle, Loader2, Eye } from "lucide-react"
import { api } from "@/lib/services/api"

interface ETF {
  id: string
  symbol: string
  name: string
  description: string
  addedDate: string
  lastUpdated: string
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR'
  totalHoldings: number
  historicalDataStart: string
  historicalDataEnd: string
  dataPoints: number
}


export function ETFsContent() {
  const router = useRouter()
  const [etfs, setEtfs] = useState<ETF[]>([])
  const [newETF, setNewETF] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch ETFs from API
  useEffect(() => {
    const fetchETFs = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URLS.csharpApi}/api/etfs`)
        if (!response.ok) throw new Error("Failed to fetch ETFs")
        const data = await response.json()

        // Transform the API data to match our interface
        const transformedETFs: ETF[] = data.etfs.map((etf: any) => ({
          id: etf.id.toString(),
          symbol: etf.symbol,
          name: etf.name,
          description: etf.description || "No description available",
          addedDate: new Date(etf.addedDate).toISOString().split('T')[0],
          lastUpdated: etf.lastUpdated ? new Date(etf.lastUpdated).toISOString().split('T')[0] : "Never",
          status: etf.status,
          totalHoldings: 0, // Will be updated when we fetch holdings
          historicalDataStart: new Date(etf.historicalDataStart).toISOString().split('T')[0],
          historicalDataEnd: etf.historicalDataEnd ? new Date(etf.historicalDataEnd).toISOString().split('T')[0] : "Ongoing",
          dataPoints: etf.dataPoints || 0
        }))

        setEtfs(transformedETFs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch ETFs")
      } finally {
        setLoading(false)
      }
    }

    fetchETFs()
  }, [])

  const filteredETFs = etfs.filter(etf =>
    etf.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    etf.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddETF = async () => {
    if (!newETF.trim()) return

    setLoading(true)
    setError(null)

    try {
      // TODO: Call API to add ETF and fetch its holdings
      const newETFData: ETF = {
        id: Date.now().toString(),
        symbol: newETF.toUpperCase(),
        name: `ETF ${newETF.toUpperCase()}`,
        description: `Description for ${newETF.toUpperCase()}`,
        addedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        totalHoldings: 0,
        historicalDataStart: '2020-01-01',
        historicalDataEnd: new Date().toISOString().split('T')[0],
        dataPoints: 0
      }

      setEtfs(prev => [...prev, newETFData])
      setNewETF("")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ETF')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveETF = async (id: string) => {
    try {
      // TODO: Call API to remove ETF
      setEtfs(prev => prev.filter(e => e.id !== id))
      if (selectedETF?.id === id) {
        setSelectedETF(null)
        setEtfHoldings([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove ETF')
    }
  }

  const handleViewETFDetails = (etf: ETF) => {
    router.push(`/admin/etfs/${etf.id}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'INACTIVE':
        return <Badge variant="secondary">Inactive</Badge>
      case 'ERROR':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ETF Holdings</h2>
          <p className="text-muted-foreground">Manage ETF symbols and their underlying stock holdings</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ETFs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9"
            />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New ETF</CardTitle>
              <CardDescription>Add a new ETF to track with its underlying holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ETF symbol (e.g., QQQ, SPY)"
                  value={newETF}
                  onChange={(e) => setNewETF(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddETF()}
                />
                <Button onClick={handleAddETF} disabled={loading || !newETF.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add ETF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracked ETFs</CardTitle>
              <CardDescription>ETFs currently being tracked with their holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Holdings</TableHead>
                    <TableHead>Data Range</TableHead>
                    <TableHead>Data Points</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredETFs.map((etf) => (
                    <TableRow key={etf.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          {etf.symbol}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{etf.name}</div>
                          <div className="text-sm text-muted-foreground">{etf.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(etf.status)}</TableCell>
                      <TableCell>{etf.totalHoldings}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {etf.historicalDataStart} - {etf.historicalDataEnd}
                        </div>
                      </TableCell>
                      <TableCell>{etf.dataPoints.toLocaleString()}</TableCell>
                      <TableCell>{etf.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewETFDetails(etf)}
                            title="View ETF Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveETF(etf.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
