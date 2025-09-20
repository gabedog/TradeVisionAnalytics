"use client"

import { useState, useEffect } from "react"

export function SymbolsContent() {
  const [symbols, setSymbols] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSymbols = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/symbols")
      if (!response.ok) throw new Error('Failed to fetch symbols')
      const data = await response.json()
      console.log('API Response:', data)
      setSymbols(data.symbols || [])
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSymbols()
  }, [])

  if (loading) {
    return <div>Loading symbols...</div>
  }

  if (error) {
    return (
      <div>
        <div style={{color: 'red'}}>Error: {error}</div>
        <button onClick={fetchSymbols}>Retry</button>
      </div>
    )
  }

  return (
    <div>
      <h2>Tracked Symbols</h2>
      <p>Found {symbols.length} symbols</p>
      {symbols.length === 0 ? (
        <p>No symbols found</p>
      ) : (
        <div>
          {symbols.slice(0, 5).map((symbol) => (
            <div key={symbol.id} style={{border: '1px solid #ccc', padding: '8px', margin: '4px'}}>
              <strong>{symbol.symbol}</strong> - {symbol.name} ({symbol.type})
              <br />
              ETF Count: {symbol.etfCount || 0}
            </div>
          ))}
          {symbols.length > 5 && (
            <p>...and {symbols.length - 5} more</p>
          )}
        </div>
      )}
    </div>
  )
}