$$ $$  $$ $$# Trading Vision Analytics - Claude Code Context

## Project Overview
A comprehensive trading analytics platform built with Next.js frontend, Python API, and C# API backend.
NOTE: For the c# part of the project, the POCOs are created first, and the Tables are created from the POCOs.
The same is true for the Python Objects as well. Create the Objects and then create the Tables. Use Pascal Case
for Objects and Tables.
The order of creation will be first, create the POCOs based on the UI requirements. For the C# API, this would be the API
and the data being captured from the FMP API. For Python, the UI frontend developed in NextJs is the driver for the Python API,
and subesequently the Business Objects and any new tables that need to be created.
We will will work in small vertical slices. Example, first create C# objects and tables for Quotes, then C# api calls to get the quotes
and stored them in the database. Then hook up NextJs part of the site to make that call. We will test that slice, then move to 
another piece of functionality. This way we will build the project in small vertical slices, and not try to do everything at once.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Python API**: FastAPI, SQLAlchemy Core (Port 8001)
- **C# API**: ASP.NET Core, EF Core (Port 5000)
- **Database**: SQL Server Developer (TVA database)
- **Data Source**: Financial Modeling Prep (FMP) API

## Current Status
✅ Basic API infrastructure complete
✅ Daily quotes endpoints working
✅ QQQ ETF holdings data available
✅ Next.js UI connected to APIs
✅ Unit tests created

## Key Files
- **Python API**: `python-api/main.py` - FastAPI server with quotes and ETF endpoints
- **C# API**: `backend/TradingVisionAnalytics.API/` - ASP.NET Core API
- **UI Components**: `components/quotes/quotes-content.tsx` - Updated to use APIs
- **API Service**: `lib/services/api.ts` - TypeScript API client
- **Config**: `connection-config.json` - Database and API keys (in .gitignore)

## API Endpoints
- `GET /api/quotes` - All quotes
- `GET /api/quotes/{symbol}` - Specific quote
- `GET /api/quotes/{symbol}/daily` - Daily historical data
- `GET /api/etf/QQQ/holdings/symbols` - QQQ stock symbols
- `GET /api/market-breadth` - Market breadth indicators

## Next Steps
1. Connect to real FMP API for live data
2. Add database connectivity
3. Implement more ETF holdings (IWM, DIA, etc.)
4. Add comprehensive financial data
5. Build charting functionality

## Database Connection
- Server: localhost
- Database: TVA
- User: sa
- Password: MJMS0ft
- FMP API Key: Wl1tq6IwEWDm1MMz6gLhLoKBAT73kxA3

## Running the Project
1. Python API: `cd python-api && python main.py` (Port 8001)
2. C# API: `cd backend/TradingVisionAnalytics.API && dotnet run` (Port 5000)
3. Next.js UI: `npm run dev` (Port 3000)

