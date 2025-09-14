// API service for Trading Vision Analytics
const PYTHON_API_BASE = 'http://127.0.0.1:8001';
const CSHARP_API_BASE = 'http://localhost:5000';

// Types
export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: string;
}

export interface DailyQuote {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ETFHoldings {
  name: string;
  description: string;
  totalHoldings: number;
  holdings: Array<{
    symbol: string;
    name: string;
    weight: number;
    shares: number;
  }>;
  lastUpdated: string;
}

export interface MarketBreadth {
  advancing: number;
  declining: number;
  unchanged: number;
  advanceDeclineRatio: number;
  newHighs: number;
  newLows: number;
  timestamp: string;
}

// API Functions
export const api = {
  // Quotes API
  async getQuotes(): Promise<{ quotes: Quote[]; count: number }> {
    const response = await fetch(`${PYTHON_API_BASE}/api/quotes`);
    if (!response.ok) throw new Error('Failed to fetch quotes');
    return response.json();
  },

  async getQuote(symbol: string): Promise<{ quote: Quote }> {
    const response = await fetch(`${PYTHON_API_BASE}/api/quotes/${symbol}`);
    if (!response.ok) throw new Error(`Failed to fetch quote for ${symbol}`);
    return response.json();
  },

  async getDailyQuotes(symbol: string, days: number = 30): Promise<{
    symbol: string;
    dailyQuotes: DailyQuote[];
    count: number;
    requestedDays: number;
  }> {
    const response = await fetch(`${PYTHON_API_BASE}/api/quotes/${symbol}/daily?days=${days}`);
    if (!response.ok) throw new Error(`Failed to fetch daily quotes for ${symbol}`);
    return response.json();
  },

  // ETF API
  async getAvailableETFs(): Promise<{ etfs: Array<{ symbol: string; name: string; description: string; totalHoldings: number; lastUpdated: string }>; count: number }> {
    const response = await fetch(`${PYTHON_API_BASE}/api/etf`);
    if (!response.ok) throw new Error('Failed to fetch available ETFs');
    return response.json();
  },

  async getETFHoldings(symbol: string): Promise<{ etfHoldings: ETFHoldings }> {
    const response = await fetch(`${PYTHON_API_BASE}/api/etf/${symbol}/holdings`);
    if (!response.ok) throw new Error(`Failed to fetch ETF holdings for ${symbol}`);
    return response.json();
  },

  async getETFSymbols(symbol: string): Promise<{
    etf: string;
    symbols: string[];
    count: number;
    totalHoldings: number;
  }> {
    const response = await fetch(`${PYTHON_API_BASE}/api/etf/${symbol}/holdings/symbols`);
    if (!response.ok) throw new Error(`Failed to fetch ETF symbols for ${symbol}`);
    return response.json();
  },

  // Market Breadth API
  async getMarketBreadth(): Promise<{ marketBreadth: MarketBreadth }> {
    const response = await fetch(`${PYTHON_API_BASE}/api/market-breadth`);
    if (!response.ok) throw new Error('Failed to fetch market breadth');
    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${PYTHON_API_BASE}/health`);
    if (!response.ok) throw new Error('API health check failed');
    return response.json();
  }
};
