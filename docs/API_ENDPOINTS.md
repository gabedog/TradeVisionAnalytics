# Trading Vision Analytics API Endpoints

## Python API (Port 8000)
Base URL: `http://localhost:8000`

### Quotes Endpoints
- `GET /api/quotes` - Get all current quotes
- `GET /api/quotes/{symbol}` - Get quote for specific symbol
- `GET /api/quotes/{symbol}/daily?days=30` - Get daily quotes for symbol (last N days)
- `GET /api/quotes/{symbol}/daily/range?start_date=2024-12-01&end_date=2024-12-13` - Get daily quotes for date range

### ETF Endpoints
- `GET /api/etf` - Get available ETFs
- `GET /api/etf/{symbol}/holdings` - Get full holdings for ETF (e.g., QQQ)
- `GET /api/etf/{symbol}/holdings/symbols` - Get just the symbols from ETF holdings

### Other Endpoints
- `GET /api/financials` - Get financial data
- `GET /api/financials/{symbol}` - Get financial data for specific symbol
- `GET /api/market-breadth` - Get market breadth indicators
- `GET /health` - Health check

## C# API (Port 5000/5001)
Base URL: `http://localhost:5000` or `https://localhost:5001`

### Quotes Endpoints
- `GET /api/quotes` - Get all current quotes
- `GET /api/quotes/{symbol}` - Get quote for specific symbol
- `GET /api/quotes/{symbol}/daily?days=30` - Get daily quotes for symbol
- `GET /api/quotes/{symbol}/daily/range?startDate=2024-12-01&endDate=2024-12-13` - Get daily quotes for date range

### ETF Endpoints
- `GET /api/etf` - Get available ETFs
- `GET /api/etf/{symbol}/holdings` - Get full holdings for ETF
- `GET /api/etf/{symbol}/holdings/symbols` - Get just the symbols from ETF holdings

## Sample Data Available

### Stock Symbols
- AAPL (Apple Inc.)
- MSFT (Microsoft Corporation)
- GOOGL (Alphabet Inc.)
- AMZN (Amazon.com Inc.)
- NVDA (NVIDIA Corporation)
- TSLA (Tesla Inc.)
- META (Meta Platforms Inc.)
- And more from QQQ holdings...

### ETFs
- QQQ (Invesco QQQ Trust) - NASDAQ-100 Index
- SPY (SPDR S&P 500 ETF Trust) - S&P 500 Index

## Running the APIs

### Python API
```bash
cd python-api
pip install -r requirements.txt
python main.py
# or
python run.py
```

### C# API
```bash
cd backend/TradingVisionAnalytics.API
dotnet run
```

### Running Tests
```bash
cd backend/TradingVisionAnalytics.Tests
dotnet test
```

## Next Steps
1. Connect Next.js UI to these APIs
2. Add real FMP API integration
3. Add database connectivity
4. Add more ETF holdings (IWM, DIA, etc.)
5. Add more comprehensive financial data
