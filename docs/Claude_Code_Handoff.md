# Trading Vision Analytics - Claude Code Handoff Document

## Project Overview
A comprehensive trading analytics platform with Next.js frontend, C# ASP.NET Core API backend, and SQL Server database. The system tracks individual stocks and ETF holdings with historical data collection starting January 1, 2020.

## Current Status
✅ **Database Schema** - Complete with TrackedSymbols, DailyQuotes, ETFHoldings tables  
✅ **API Structure** - Controllers for Symbols, ETFs, Quotes, Logging, Scheduler  
✅ **UI Framework** - Next.js with shadcn/ui components and admin navigation  
✅ **Scheduling** - Hangfire configured for background jobs  
✅ **Logging** - Comprehensive API call and exception tracking  

## Core Requirements

### 1. Symbol Data Management System
**Goal**: Unified interface for managing historical data for any symbol (stock or ETF)

**Key Features**:
- Historical data range selection (start date: 2020-01-01)
- Data points counter and last updated timestamp
- Manual refresh and date range modification
- Status indicators (tracked/not tracked, data completeness)

**UI Components Needed**:
```
/admin/symbols/{id}/data
├── Symbol Info Card (name, type, current status)
├── Historical Data Range Picker
├── Data Statistics (points, last update, coverage)
├── Action Buttons (Refresh, Update Range, Stop Tracking)
└── For ETFs: Holdings Management Section
```

### 2. ETF Holdings Management
**Goal**: Automatic population and management of ETF holdings with delta updates

**Key Features**:
- Auto-fetch holdings from FMP API when ETF is added
- Individual holding tracking toggle
- Delta update detection for holdings changes
- Bulk operations (track all holdings, refresh all data)

**Workflow**:
1. User adds ETF symbol → System fetches holdings from FMP API
2. User reviews holdings → Toggles which individual stocks to track
3. System schedules delta updates → Weekly checks for holdings changes
4. User gets notifications → When holdings change significantly

### 3. FMP API Integration
**Goal**: Complete integration with Financial Modeling Prep API

**Required Endpoints**:
- `GET /etf-holdings/{symbol}` - Get ETF holdings
- `GET /historical-price-full/{symbol}` - Get historical data
- `GET /profile/{symbol}` - Get company profile
- Rate limiting and error handling

**Implementation**:
```csharp
public interface IFmpApiService
{
    Task<string> GetETFHoldings(string etfSymbol);
    Task<string> GetHistoricalData(string symbol, DateTime startDate, DateTime endDate);
    Task<string> GetCompanyProfile(string symbol);
    Task<bool> ValidateSymbol(string symbol);
}
```

## Technical Implementation

### 1. Database Models (Already Created)
- `TrackedSymbol` - All symbols being tracked
- `DailyQuote` - Historical price data
- `ETFHolding` - ETF composition and tracking status

### 2. API Controllers (Structure Defined)
- `SymbolsController` - CRUD operations for symbols
- `ETFsController` - ETF-specific operations
- `QuotesController` - Price data endpoints
- `SchedulerController` - Background job management

### 3. Frontend Components (Design Complete)
- Admin navigation with Symbols and ETFs submenus
- Symbol management tables with search/filter
- ETF holdings view with individual stock tracking
- Data management interface for historical data

## Specific Implementation Tasks

### Phase 1: FMP API Integration
1. **Implement FmpApiService methods**
   - `GetETFHoldings()` - Fetch ETF holdings from FMP
   - `GetHistoricalData()` - Get historical data
   - `ValidateSymbol()` - Check if symbol exists
   - Error handling and rate limiting

2. **Add API endpoints**
   - `POST /api/symbols/{id}/fetch-holdings` - Fetch ETF holdings
   - `POST /api/symbols/{id}/fetch-historical` - Get historical data
   - `PUT /api/symbols/{id}/data-range` - Update date range

### Phase 2: Symbol Data Management UI
1. **Create symbol data management page**
   - Route: `/admin/symbols/{id}/data`
   - Historical data range picker
   - Data statistics display
   - Action buttons for refresh/update

2. **Enhance existing components**
   - Add data management link to symbol rows
   - Update ETF holdings view with data management
   - Add bulk operations for ETF holdings

### Phase 3: Delta Update System
1. **Implement holdings change detection**
   - Compare current vs stored holdings
   - Identify added/removed holdings
   - Update database with changes

2. **Add scheduled jobs**
   - Weekly ETF holdings update
   - Daily historical data refresh
   - Holdings change notifications

## File Structure

### Backend (C# API)
```
backend/TradingVisionAnalytics.API/
├── Services/
│   ├── FmpApiService.cs (implement)
│   ├── SymbolDataService.cs (new)
│   └── HoldingsUpdateService.cs (new)
├── Controllers/
│   ├── SymbolDataController.cs (new)
│   └── HoldingsController.cs (new)
└── Models/ (already created)
```

### Frontend (Next.js)
```
app/admin/symbols/
├── [id]/
│   └── data/page.tsx (new)
└── page.tsx (existing)

components/admin/
├── symbol-data-management.tsx (new)
├── holdings-data-view.tsx (new)
└── data-range-picker.tsx (new)
```

## Configuration

### FMP API Settings
```json
{
  "FMP": {
    "ApiKey": "Wl1tq6IwEWD1MMz6gLhLoKBAT73kxA3",
    "BaseUrl": "https://financialmodelingprep.com/api/v3",
    "RateLimit": 250,
    "RetryAttempts": 3
  }
}
```

### Database Connection
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TVA;Integrated Security=true;TrustServerCertificate=true;"
  }
}
```

## Success Criteria

### Phase 1 Complete When:
- [ ] FMP API integration working
- [ ] Can fetch ETF holdings for QQQ, SPY, etc.
- [ ] Historical data collection working
- [ ] Error handling and logging implemented

### Phase 2 Complete When:
- [ ] Symbol data management page functional
- [ ] Users can set historical data ranges
- [ ] ETF holdings view shows individual stocks
- [ ] Bulk operations working

### Phase 3 Complete When:
- [ ] Delta updates detecting holdings changes
- [ ] Scheduled jobs running automatically
- [ ] Notifications for significant changes
- [ ] System maintaining data integrity

## Notes for Implementation

1. **Start with QQQ** - Use as test case for ETF holdings
2. **Historical data starts 2020-01-01** - This is a hard requirement
3. **Rate limiting critical** - FMP API has limits, respect them
4. **Error handling essential** - API calls can fail, handle gracefully
5. **Logging important** - Track all API calls and data operations
6. **User experience** - Make it intuitive, not overwhelming

## Questions for Claude Code

1. How will you handle FMP API rate limiting?
2. What's the best approach for bulk historical data collection?
3. How should we handle ETF holdings that change frequently?
4. What's the optimal scheduling for delta updates?
5. How can we make the UI responsive during large data operations?

---

**This document provides the complete context and requirements for implementing the symbol data management system. The architecture is solid, the design is clear, and the implementation path is well-defined.**
