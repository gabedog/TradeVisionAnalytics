from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api-calls.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(title="Trading Vision Analytics API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static data for initial testing
SAMPLE_QUOTES = [
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "price": 175.43,
        "change": 2.15,
        "changePercent": 1.24,
        "volume": 45678900,
        "marketCap": 2750000000000,
        "lastUpdated": datetime.now().isoformat()
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "price": 378.85,
        "change": -1.25,
        "changePercent": -0.33,
        "volume": 23456700,
        "marketCap": 2810000000000,
        "lastUpdated": datetime.now().isoformat()
    },
    {
        "symbol": "GOOGL",
        "name": "Alphabet Inc.",
        "price": 142.56,
        "change": 3.42,
        "changePercent": 2.46,
        "volume": 34567800,
        "marketCap": 1780000000000,
        "lastUpdated": datetime.now().isoformat()
    }
]

# Sample daily quotes data (last 30 days for AAPL)
SAMPLE_DAILY_QUOTES = {
    "AAPL": [
        {"date": "2024-12-13", "open": 173.25, "high": 175.89, "low": 172.80, "close": 175.43, "volume": 45678900},
        {"date": "2024-12-12", "open": 171.50, "high": 174.20, "low": 171.20, "close": 173.28, "volume": 42345600},
        {"date": "2024-12-11", "open": 170.80, "high": 172.15, "low": 170.10, "close": 171.50, "volume": 38912300},
        {"date": "2024-12-10", "open": 172.00, "high": 173.45, "low": 171.25, "close": 170.80, "volume": 41234500},
        {"date": "2024-12-09", "open": 171.75, "high": 172.80, "low": 170.90, "close": 172.00, "volume": 37890100},
        {"date": "2024-12-06", "open": 170.25, "high": 172.10, "low": 169.80, "close": 171.75, "volume": 40123400},
        {"date": "2024-12-05", "open": 169.50, "high": 171.00, "low": 168.90, "close": 170.25, "volume": 36567800},
        {"date": "2024-12-04", "open": 168.75, "high": 170.25, "low": 168.20, "close": 169.50, "volume": 34215600},
        {"date": "2024-12-03", "open": 167.90, "high": 169.50, "low": 167.30, "close": 168.75, "volume": 38901200},
        {"date": "2024-12-02", "open": 166.25, "high": 168.40, "low": 165.80, "close": 167.90, "volume": 35678900}
    ],
    "MSFT": [
        {"date": "2024-12-13", "open": 377.20, "high": 380.15, "low": 376.50, "close": 378.85, "volume": 23456700},
        {"date": "2024-12-12", "open": 375.80, "high": 378.90, "low": 375.20, "close": 377.20, "volume": 21234500},
        {"date": "2024-12-11", "open": 374.50, "high": 376.80, "low": 373.90, "close": 375.80, "volume": 19876500},
        {"date": "2024-12-10", "open": 373.25, "high": 375.40, "low": 372.60, "close": 374.50, "volume": 22345600},
        {"date": "2024-12-09", "open": 372.00, "high": 374.20, "low": 371.40, "close": 373.25, "volume": 18765400},
        {"date": "2024-12-06", "open": 370.75, "high": 372.80, "low": 370.20, "close": 372.00, "volume": 20123400},
        {"date": "2024-12-05", "open": 369.50, "high": 371.40, "low": 368.90, "close": 370.75, "volume": 17654300},
        {"date": "2024-12-04", "open": 368.25, "high": 370.20, "low": 367.60, "close": 369.50, "volume": 19234500},
        {"date": "2024-12-03", "open": 367.00, "high": 369.10, "low": 366.40, "close": 368.25, "volume": 18543200},
        {"date": "2024-12-02", "open": 365.75, "high": 367.80, "low": 365.20, "close": 367.00, "volume": 17345600}
    ],
    "GOOGL": [
        {"date": "2024-12-13", "open": 140.25, "high": 143.80, "low": 139.90, "close": 142.56, "volume": 34567800},
        {"date": "2024-12-12", "open": 139.50, "high": 141.20, "low": 138.80, "close": 140.25, "volume": 31234500},
        {"date": "2024-12-11", "open": 138.75, "high": 140.40, "low": 138.20, "close": 139.50, "volume": 29876500},
        {"date": "2024-12-10", "open": 137.90, "high": 139.60, "low": 137.40, "close": 138.75, "volume": 32345600},
        {"date": "2024-12-09", "open": 137.25, "high": 138.80, "low": 136.70, "close": 137.90, "volume": 28765400},
        {"date": "2024-12-06", "open": 136.50, "high": 138.20, "low": 136.00, "close": 137.25, "volume": 30123400},
        {"date": "2024-12-05", "open": 135.75, "high": 137.40, "low": 135.20, "close": 136.50, "volume": 27654300},
        {"date": "2024-12-04", "open": 135.00, "high": 136.80, "low": 134.60, "close": 135.75, "volume": 29234500},
        {"date": "2024-12-03", "open": 134.25, "high": 136.00, "low": 133.80, "close": 135.00, "volume": 28543200},
        {"date": "2024-12-02", "open": 133.50, "high": 135.20, "low": 133.00, "close": 134.25, "volume": 27345600}
    ]
}

# Sample ETF holdings data
SAMPLE_ETF_HOLDINGS = {
    "QQQ": {
        "name": "Invesco QQQ Trust",
        "description": "Tracks the NASDAQ-100 Index",
        "totalHoldings": 100,
        "holdings": [
            {"symbol": "AAPL", "name": "Apple Inc.", "weight": 8.45, "shares": 1234567890},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "weight": 7.89, "shares": 987654321},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "weight": 5.23, "shares": 456789123},
            {"symbol": "NVDA", "name": "NVIDIA Corporation", "weight": 4.67, "shares": 234567890},
            {"symbol": "GOOGL", "name": "Alphabet Inc. Class A", "weight": 3.45, "shares": 345678901},
            {"symbol": "GOOG", "name": "Alphabet Inc. Class C", "weight": 3.12, "shares": 312345678},
            {"symbol": "TSLA", "name": "Tesla Inc.", "weight": 2.89, "shares": 234567890},
            {"symbol": "META", "name": "Meta Platforms Inc.", "weight": 2.34, "shares": 198765432},
            {"symbol": "NFLX", "name": "Netflix Inc.", "weight": 1.67, "shares": 123456789},
            {"symbol": "ADBE", "name": "Adobe Inc.", "weight": 1.45, "shares": 98765432},
            {"symbol": "PYPL", "name": "PayPal Holdings Inc.", "weight": 1.23, "shares": 87654321},
            {"symbol": "INTC", "name": "Intel Corporation", "weight": 1.12, "shares": 76543210},
            {"symbol": "CMCSA", "name": "Comcast Corporation", "weight": 0.98, "shares": 65432109},
            {"symbol": "PEP", "name": "PepsiCo Inc.", "weight": 0.87, "shares": 54321098},
            {"symbol": "COST", "name": "Costco Wholesale Corporation", "weight": 0.76, "shares": 43210987},
            {"symbol": "TMUS", "name": "T-Mobile US Inc.", "weight": 0.65, "shares": 32109876},
            {"symbol": "AVGO", "name": "Broadcom Inc.", "weight": 0.54, "shares": 21098765},
            {"symbol": "TXN", "name": "Texas Instruments Incorporated", "weight": 0.43, "shares": 10987654},
            {"symbol": "QCOM", "name": "QUALCOMM Incorporated", "weight": 0.32, "shares": 9876543},
            {"symbol": "CHTR", "name": "Charter Communications Inc.", "weight": 0.21, "shares": 8765432}
        ],
        "lastUpdated": datetime.now().isoformat()
    },
    "SPY": {
        "name": "SPDR S&P 500 ETF Trust",
        "description": "Tracks the S&P 500 Index",
        "totalHoldings": 500,
        "holdings": [
            {"symbol": "AAPL", "name": "Apple Inc.", "weight": 7.23, "shares": 1234567890},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "weight": 6.89, "shares": 987654321},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "weight": 3.45, "shares": 456789123},
            {"symbol": "NVDA", "name": "NVIDIA Corporation", "weight": 2.67, "shares": 234567890},
            {"symbol": "GOOGL", "name": "Alphabet Inc. Class A", "weight": 2.12, "shares": 345678901}
        ],
        "lastUpdated": datetime.now().isoformat()
    }
}

SAMPLE_FINANCIALS = [
    {
        "symbol": "AAPL",
        "revenue": 394328000000,
        "netIncome": 99803000000,
        "totalAssets": 352755000000,
        "totalDebt": 122797000000,
        "peRatio": 28.5,
        "pbRatio": 5.2,
        "debtToEquity": 1.73,
        "returnOnEquity": 0.147,
        "quarter": "Q4 2024"
    }
]

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Trading Vision Analytics API", "status": "running"}

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/quotes")
async def get_quotes():
    logger.info("Quotes endpoint accessed")
    try:
        return {"quotes": SAMPLE_QUOTES, "count": len(SAMPLE_QUOTES)}
    except Exception as e:
        logger.error(f"Error in quotes endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/quotes/{symbol}")
async def get_quote(symbol: str):
    logger.info(f"Quote endpoint accessed for symbol: {symbol}")
    try:
        quote = next((q for q in SAMPLE_QUOTES if q["symbol"].upper() == symbol.upper()), None)
        if not quote:
            raise HTTPException(status_code=404, detail=f"Quote not found for symbol: {symbol}")
        return {"quote": quote}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in quote endpoint for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/financials")
async def get_financials():
    logger.info("Financials endpoint accessed")
    try:
        return {"financials": SAMPLE_FINANCIALS, "count": len(SAMPLE_FINANCIALS)}
    except Exception as e:
        logger.error(f"Error in financials endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/financials/{symbol}")
async def get_financial(symbol: str):
    logger.info(f"Financial endpoint accessed for symbol: {symbol}")
    try:
        financial = next((f for f in SAMPLE_FINANCIALS if f["symbol"].upper() == symbol.upper()), None)
        if not financial:
            raise HTTPException(status_code=404, detail=f"Financial data not found for symbol: {symbol}")
        return {"financial": financial}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in financial endpoint for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/quotes/{symbol}/daily")
async def get_daily_quotes(symbol: str, days: int = 30):
    logger.info(f"Daily quotes endpoint accessed for symbol: {symbol}, days: {days}")
    try:
        symbol_upper = symbol.upper()
        if symbol_upper not in SAMPLE_DAILY_QUOTES:
            raise HTTPException(status_code=404, detail=f"Daily quotes not found for symbol: {symbol}")
        
        daily_data = SAMPLE_DAILY_QUOTES[symbol_upper]
        
        # Limit to requested number of days
        if days > 0:
            daily_data = daily_data[:days]
        
        return {
            "symbol": symbol_upper,
            "dailyQuotes": daily_data,
            "count": len(daily_data),
            "requestedDays": days
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in daily quotes endpoint for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/quotes/{symbol}/daily/range")
async def get_daily_quotes_range(symbol: str, start_date: str, end_date: str):
    logger.info(f"Daily quotes range endpoint accessed for symbol: {symbol}, from {start_date} to {end_date}")
    try:
        symbol_upper = symbol.upper()
        if symbol_upper not in SAMPLE_DAILY_QUOTES:
            raise HTTPException(status_code=404, detail=f"Daily quotes not found for symbol: {symbol}")
        
        daily_data = SAMPLE_DAILY_QUOTES[symbol_upper]
        
        # Filter by date range (simple string comparison for now)
        filtered_data = [
            quote for quote in daily_data 
            if start_date <= quote["date"] <= end_date
        ]
        
        return {
            "symbol": symbol_upper,
            "dailyQuotes": filtered_data,
            "count": len(filtered_data),
            "startDate": start_date,
            "endDate": end_date
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in daily quotes range endpoint for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/etf/{symbol}/holdings")
async def get_etf_holdings(symbol: str):
    logger.info(f"ETF holdings endpoint accessed for symbol: {symbol}")
    try:
        symbol_upper = symbol.upper()
        if symbol_upper not in SAMPLE_ETF_HOLDINGS:
            raise HTTPException(status_code=404, detail=f"ETF holdings not found for symbol: {symbol}")
        
        etf_data = SAMPLE_ETF_HOLDINGS[symbol_upper]
        return {"etfHoldings": etf_data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in ETF holdings endpoint for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/etf/{symbol}/holdings/symbols")
async def get_etf_symbols(symbol: str):
    logger.info(f"ETF symbols endpoint accessed for symbol: {symbol}")
    try:
        symbol_upper = symbol.upper()
        if symbol_upper not in SAMPLE_ETF_HOLDINGS:
            raise HTTPException(status_code=404, detail=f"ETF holdings not found for symbol: {symbol}")
        
        etf_data = SAMPLE_ETF_HOLDINGS[symbol_upper]
        symbols = [holding["symbol"] for holding in etf_data["holdings"]]
        
        return {
            "etf": symbol_upper,
            "symbols": symbols,
            "count": len(symbols),
            "totalHoldings": etf_data["totalHoldings"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in ETF symbols endpoint for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/etf")
async def get_available_etfs():
    logger.info("Available ETFs endpoint accessed")
    try:
        etf_list = []
        for symbol, data in SAMPLE_ETF_HOLDINGS.items():
            etf_list.append({
                "symbol": symbol,
                "name": data["name"],
                "description": data["description"],
                "totalHoldings": data["totalHoldings"],
                "lastUpdated": data["lastUpdated"]
            })
        
        return {"etfs": etf_list, "count": len(etf_list)}
    except Exception as e:
        logger.error(f"Error in available ETFs endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/market-breadth")
async def get_market_breadth():
    logger.info("Market breadth endpoint accessed")
    try:
        # Mock market breadth data
        breadth_data = {
            "advancing": 2345,
            "declining": 1876,
            "unchanged": 123,
            "advanceDeclineRatio": 1.25,
            "newHighs": 89,
            "newLows": 45,
            "timestamp": datetime.now().isoformat()
        }
        return {"marketBreadth": breadth_data}
    except Exception as e:
        logger.error(f"Error in market breadth endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
