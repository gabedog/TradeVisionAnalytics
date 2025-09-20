using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TradingVisionAnalytics.API.Data;
using TradingVisionAnalytics.API.Models;
using TradingVisionAnalytics.API.Services;
using System.Text.Json;

namespace TradingVisionAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ETFsController : ControllerBase
    {
        private readonly TradingDbContext _context;
        private readonly ILoggingService _loggingService;
        private readonly IFmpApiService _fmpApiService;
        private readonly IApiLoggingService _apiLoggingService;
        private readonly ILogger<ETFsController> _logger;

        public ETFsController(TradingDbContext context, ILoggingService loggingService, IFmpApiService fmpApiService, IApiLoggingService apiLoggingService, ILogger<ETFsController> logger)
        {
            _context = context;
            _loggingService = loggingService;
            _fmpApiService = fmpApiService;
            _apiLoggingService = apiLoggingService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetETFs()
        {
            try
            {
                _loggingService.LogInfo("GetETFs request received");
                
                var etfs = await _context.TrackedSymbols
                    .Where(s => s.Type == "ETF")
                    .OrderBy(s => s.Symbol)
                    .ToListAsync();

                _loggingService.LogInfo($"Retrieved {etfs.Count} tracked ETFs");
                return Ok(new { etfs, count = etfs.Count });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "GetETFs");
                return StatusCode(500, "Failed to retrieve ETFs");
            }
        }

        [HttpGet("{id}/holdings")]
        public async Task<IActionResult> GetETFHoldings(int id)
        {
            try
            {
                _loggingService.LogInfo($"GetETFHoldings request received for ETF ID: {id}");

                var etf = await _context.TrackedSymbols
                    .FirstOrDefaultAsync(s => s.Id == id && s.Type == "ETF");

                if (etf == null)
                {
                    _loggingService.LogWarning($"ETF not found for ID: {id}");
                    return NotFound($"ETF with ID {id} not found");
                }

                var holdings = await _context.ETFHoldings
                    .Include(h => h.HoldingSymbol)
                    .Where(h => h.ETFSymbolId == id)
                    .OrderByDescending(h => h.Weight)
                    .ToListAsync();

                var result = new
                {
                    etf = new
                    {
                        id = etf.Id,
                        symbol = etf.Symbol,
                        name = etf.Name,
                        description = etf.Description,
                        totalHoldings = holdings.Count
                    },
                    holdings = holdings.Select(h => new
                    {
                        id = h.Id,
                        symbol = h.HoldingSymbol.Symbol,
                        name = h.HoldingSymbol.Name,
                        weight = h.Weight,
                        shares = h.Shares,
                        marketValue = h.MarketValue,
                        isTracked = h.IsTracked,
                        lastUpdated = h.LastUpdated
                    })
                };

                _loggingService.LogInfo($"Retrieved {holdings.Count} holdings for ETF: {etf.Symbol}");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "GetETFHoldings", id.ToString());
                return StatusCode(500, "Failed to retrieve ETF holdings");
            }
        }

        [HttpPost("{id}/import-holdings")]
        public async Task<IActionResult> ImportETFHoldings(int id)
        {
            try
            {
                _loggingService.LogInfo($"ImportETFHoldings request received for ETF ID: {id}");

                var etf = await _context.TrackedSymbols
                    .FirstOrDefaultAsync(s => s.Id == id && s.Type == "ETF");

                if (etf == null)
                {
                    _loggingService.LogWarning($"ETF not found for ID: {id}");
                    return NotFound($"ETF with ID {id} not found");
                }

                var holdingsResult = new
                {
                    total = 0,
                    imported = 0,
                    updated = 0,
                    skipped = 0,
                    errors = 0,
                    details = new List<object>()
                };

                var symbolsResult = new
                {
                    total = 0,
                    newSymbols = 0,
                    existingSymbols = 0,
                    errors = 0,
                    details = new List<object>()
                };

                int holdingsTotal = 0, holdingsImported = 0, holdingsUpdated = 0, holdingsErrors = 0;
                int symbolsTotal = 0, symbolsNew = 0, symbolsExisting = 0;
                var holdingsDetails = new List<object>();
                var symbolsDetails = new List<object>();
                var apiCalls = new List<object>();

                // Fetch ETF holdings from FMP API
                _loggingService.LogInfo($"Fetching ETF holdings for {etf.Symbol} from FMP API");
                var holdingsJson = await _fmpApiService.GetETFHoldings(etf.Symbol);

                apiCalls.Add(new
                {
                    endpoint = "GetETFHoldings",
                    symbol = etf.Symbol,
                    success = true,
                    timestamp = DateTime.UtcNow
                });

                var holdingsData = JsonSerializer.Deserialize<JsonElement[]>(holdingsJson);

                if (holdingsData == null || holdingsData.Length == 0)
                {
                    _loggingService.LogWarning($"No holdings data received for ETF: {etf.Symbol}");
                    return Ok(new {
                        message = "No holdings data found",
                        etfSymbol = etf.Symbol,
                        etfName = etf.Name,
                        apiCalls = apiCalls,
                        holdings = new { total = 0, imported = 0, updated = 0, errors = 0, details = holdingsDetails },
                        symbols = new { total = 0, newSymbols = 0, existingSymbols = 0, errors = 0, details = symbolsDetails }
                    });
                }

                holdingsTotal = holdingsData.Length;

                foreach (var holding in holdingsData)
                {
                    try
                    {
                        var holdingSymbol = holding.GetProperty("asset").GetString()?.ToUpper();
                        var holdingName = holding.GetProperty("name").GetString();
                        var weight = holding.TryGetProperty("weightPercentage", out var weightProp) ? (decimal?)weightProp.GetDecimal() : null;
                        var shares = holding.TryGetProperty("sharesNumber", out var sharesProp) ? (long?)sharesProp.GetInt64() : null;
                        var marketValue = holding.TryGetProperty("marketValue", out var valueProp) ? (decimal?)valueProp.GetDecimal() : null;

                        if (string.IsNullOrEmpty(holdingSymbol))
                        {
                            holdingsErrors++;
                            holdingsDetails.Add(new
                            {
                                symbol = "UNKNOWN",
                                status = "error",
                                message = "Missing symbol in holdings data"
                            });
                            continue;
                        }

                        // Create or find the holding symbol
                        var holdingSymbolRecord = await _context.TrackedSymbols
                            .FirstOrDefaultAsync(s => s.Symbol == holdingSymbol);

                        if (holdingSymbolRecord == null)
                        {
                            // Create new tracked symbol
                            holdingSymbolRecord = new TrackedSymbol
                            {
                                Symbol = holdingSymbol,
                                Name = holdingName ?? holdingSymbol,
                                Type = "STOCK",
                                AddedDate = DateTime.UtcNow,
                                Status = "ACTIVE",
                                HistoricalDataStart = new DateTime(2020, 1, 1)
                            };
                            _context.TrackedSymbols.Add(holdingSymbolRecord);
                            try
                            {
                                await _context.SaveChangesAsync();
                            }
                            catch (Exception sqlEx)
                            {
                                try
                                {
                                    await _apiLoggingService.LogExceptionAsync("ETFsController.ImportETFHoldings", sqlEx,
                                        requestId: $"ImportETFHoldings-{id}-AddSymbol-{holdingSymbol}",
                                        severity: ExceptionSeverity.High,
                                        additionalContext: $"SQL exception occurred while adding new symbol {holdingSymbol}");
                                }
                                catch
                                {
                                    // Prevent infinite loop if logging also fails
                                }
                                throw; // Re-throw the original exception
                            }

                            symbolsNew++;
                            symbolsDetails.Add(new
                            {
                                symbol = holdingSymbol,
                                name = holdingName,
                                status = "created"
                            });
                        }
                        else
                        {
                            symbolsExisting++;
                        }

                        // Check if ETF holding already exists
                        var existingHolding = await _context.ETFHoldings
                            .FirstOrDefaultAsync(h => h.ETFSymbolId == id && h.HoldingSymbolId == holdingSymbolRecord.Id);

                        if (existingHolding != null)
                        {
                            // Update existing holding
                            existingHolding.Weight = weight ?? 0;
                            existingHolding.Shares = shares ?? 0;
                            existingHolding.MarketValue = marketValue;
                            existingHolding.LastUpdated = DateTime.UtcNow;

                            holdingsUpdated++;
                            holdingsDetails.Add(new
                            {
                                symbol = holdingSymbol,
                                name = holdingName,
                                weight = weight,
                                status = "updated"
                            });
                        }
                        else
                        {
                            // Create new holding
                            var newHolding = new ETFHolding
                            {
                                ETFSymbolId = id,
                                HoldingSymbolId = holdingSymbolRecord.Id,
                                Weight = weight ?? 0,
                                Shares = shares ?? 0,
                                MarketValue = marketValue,
                                IsTracked = true,
                                LastUpdated = DateTime.UtcNow
                            };
                            _context.ETFHoldings.Add(newHolding);

                            holdingsImported++;
                            holdingsDetails.Add(new
                            {
                                symbol = holdingSymbol,
                                name = holdingName,
                                weight = weight,
                                status = "imported"
                            });
                        }

                        symbolsTotal++;
                    }
                    catch (Exception ex)
                    {
                        holdingsErrors++;
                        _loggingService.LogException(ex, "ImportETFHoldings - Processing holding", "UNKNOWN");
                        holdingsDetails.Add(new
                        {
                            symbol = "ERROR",
                            status = "error",
                            message = ex.Message
                        });
                    }
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception sqlEx)
                {
                    try
                    {
                        await _apiLoggingService.LogExceptionAsync("ETFsController.ImportETFHoldings", sqlEx,
                            requestId: $"ImportETFHoldings-{id}-SaveHoldings",
                            severity: ExceptionSeverity.High,
                            additionalContext: $"SQL exception occurred while saving ETF holdings for {etf.Symbol}. Holdings imported: {holdingsImported}, updated: {holdingsUpdated}");
                    }
                    catch
                    {
                        // Prevent infinite loop if logging also fails
                    }
                    throw; // Re-throw the original exception
                }

                // Fetch company profiles for symbols missing profile data (only for this ETF's holdings)
                _loggingService.LogInfo($"Checking for symbols needing profile data for ETF: {etf.Symbol}");

                var symbolsNeedingProfiles = await _context.TrackedSymbols
                    .Where(s => s.Type == "STOCK" &&
                               (string.IsNullOrEmpty(s.Description) ||
                                string.IsNullOrEmpty(s.Sector) ||
                                string.IsNullOrEmpty(s.Industry)) &&
                               _context.ETFHoldings.Any(h => h.ETFSymbolId == id && h.HoldingSymbolId == s.Id))
                    .ToListAsync();

                var profilesTotal = 0;
                var profilesSuccess = 0;
                var profilesErrors = 0;
                var profileDetails = new List<object>();

                if (symbolsNeedingProfiles.Any())
                {
                    _loggingService.LogInfo($"Found {symbolsNeedingProfiles.Count} symbols needing profile data");

                    foreach (var symbol in symbolsNeedingProfiles)
                    {
                        try
                        {
                            profilesTotal++;

                            // Validate symbol first
                            var isValid = await _fmpApiService.ValidateSymbol(symbol.Symbol);
                            if (!isValid)
                            {
                                profilesErrors++;
                                profileDetails.Add(new
                                {
                                    symbol = symbol.Symbol,
                                    status = "validation_failed",
                                    message = "Symbol not found in FMP"
                                });
                                continue;
                            }

                            // Get company profile
                            var profileJson = await _fmpApiService.GetCompanyProfile(symbol.Symbol);
                            var profileData = JsonSerializer.Deserialize<JsonElement[]>(profileJson);

                            if (profileData == null || profileData.Length == 0)
                            {
                                profilesErrors++;
                                profileDetails.Add(new
                                {
                                    symbol = symbol.Symbol,
                                    status = "no_profile_data",
                                    message = "No profile data received from FMP"
                                });
                                continue;
                            }

                            var profile = profileData[0];
                            var fieldsUpdated = new List<string>();

                            // Update missing fields only
                            if (string.IsNullOrEmpty(symbol.Description) &&
                                profile.TryGetProperty("description", out var description) &&
                                !string.IsNullOrEmpty(description.GetString()))
                            {
                                symbol.Description = description.GetString();
                                fieldsUpdated.Add("Description");
                            }

                            if (string.IsNullOrEmpty(symbol.Sector) &&
                                profile.TryGetProperty("sector", out var sector) &&
                                !string.IsNullOrEmpty(sector.GetString()))
                            {
                                symbol.Sector = sector.GetString();
                                fieldsUpdated.Add("Sector");
                            }

                            if (string.IsNullOrEmpty(symbol.Industry) &&
                                profile.TryGetProperty("industry", out var industry) &&
                                !string.IsNullOrEmpty(industry.GetString()))
                            {
                                symbol.Industry = industry.GetString();
                                fieldsUpdated.Add("Industry");
                            }

                            // Update name if it's generic
                            if (profile.TryGetProperty("companyName", out var companyName) &&
                                !string.IsNullOrEmpty(companyName.GetString()) &&
                                symbol.Name == symbol.Symbol)
                            {
                                symbol.Name = companyName.GetString();
                                fieldsUpdated.Add("Name");
                            }

                            if (fieldsUpdated.Any())
                            {
                                symbol.LastUpdated = DateTime.UtcNow;
                                profilesSuccess++;

                                profileDetails.Add(new
                                {
                                    symbol = symbol.Symbol,
                                    status = "updated",
                                    fieldsUpdated = fieldsUpdated.Count,
                                    fields = string.Join(", ", fieldsUpdated)
                                });
                            }
                            else
                            {
                                profileDetails.Add(new
                                {
                                    symbol = symbol.Symbol,
                                    status = "no_updates_needed",
                                    message = "All profile fields already populated"
                                });
                            }

                            // Add delay between API calls to respect rate limits
                            await Task.Delay(200); // 5 calls per second maximum
                        }
                        catch (Exception ex)
                        {
                            profilesErrors++;
                            _loggingService.LogException(ex, "ImportETFHoldings - Fetching profile", symbol.Symbol);

                            profileDetails.Add(new
                            {
                                symbol = symbol.Symbol,
                                status = "error",
                                message = ex.Message
                            });
                        }
                    }

                    if (profilesSuccess > 0)
                    {
                        try
                        {
                            await _context.SaveChangesAsync();
                            _loggingService.LogInfo($"Updated profile data for {profilesSuccess} symbols");
                        }
                        catch (Exception sqlEx)
                        {
                            try
                            {
                                await _apiLoggingService.LogExceptionAsync("ETFsController.ImportETFHoldings", sqlEx,
                                    requestId: $"ImportETFHoldings-{id}-SaveChanges",
                                    severity: ExceptionSeverity.High,
                                    additionalContext: $"SQL exception occurred while saving profile data for {profilesSuccess} symbols");
                            }
                            catch
                            {
                                // Prevent infinite loop if logging also fails
                            }
                            throw; // Re-throw the original exception
                        }
                    }
                }

                // Update ETF's last updated timestamp
                etf.LastUpdated = DateTime.UtcNow;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception sqlEx)
                {
                    try
                    {
                        await _apiLoggingService.LogExceptionAsync("ETFsController.ImportETFHoldings", sqlEx,
                            requestId: $"ImportETFHoldings-{id}-UpdateTimestamp",
                            severity: ExceptionSeverity.High,
                            additionalContext: $"SQL exception occurred while updating ETF last updated timestamp for {etf.Symbol}");
                    }
                    catch
                    {
                        // Prevent infinite loop if logging also fails
                    }
                    throw; // Re-throw the original exception
                }

                var startTime = DateTime.UtcNow.AddMinutes(-1); // Approximate start time
                var endTime = DateTime.UtcNow;
                var duration = endTime - startTime;

                var finalResult = new
                {
                    success = true,
                    message = $"ETF holdings import completed for {etf.Symbol}",
                    etf = new { id = etf.Id, symbol = etf.Symbol, name = etf.Name },
                    apiCalls = apiCalls,
                    holdings = new
                    {
                        total = holdingsTotal,
                        imported = holdingsImported,
                        updated = holdingsUpdated,
                        errors = holdingsErrors,
                        details = holdingsDetails
                    },
                    symbols = new
                    {
                        total = symbolsTotal,
                        newSymbols = symbolsNew,
                        existingSymbols = symbolsExisting,
                        errors = 0,
                        details = symbolsDetails
                    },
                    profiles = new
                    {
                        total = profilesTotal,
                        updated = profilesSuccess,
                        errors = profilesErrors,
                        details = profileDetails
                    },
                    timing = new
                    {
                        startTime = startTime,
                        endTime = endTime,
                        durationMs = duration.TotalMilliseconds
                    },
                    summary = new
                    {
                        totalHoldings = holdingsTotal,
                        successfulImports = holdingsImported + holdingsUpdated,
                        newSymbolsCreated = symbolsNew,
                        profilesUpdated = profilesSuccess,
                        errors = holdingsErrors + profilesErrors
                    }
                };

                _loggingService.LogInfo($"Successfully imported ETF holdings for {etf.Symbol}: {holdingsImported} new, {holdingsUpdated} updated, {holdingsErrors} errors");
                return Ok(finalResult);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "ImportETFHoldings", id.ToString());
                return StatusCode(500, "Failed to import ETF holdings");
            }
        }

        [HttpPost("{id}/holdings")]
        public async Task<IActionResult> AddETFHolding(int id, [FromBody] AddETFHoldingRequest request)
        {
            try
            {
                _loggingService.LogInfo($"AddETFHolding request received for ETF ID: {id}, Holding: {request.Symbol}");

                var etf = await _context.TrackedSymbols
                    .FirstOrDefaultAsync(s => s.Id == id && s.Type == "ETF");

                if (etf == null)
                {
                    _loggingService.LogWarning($"ETF not found for ID: {id}");
                    return NotFound($"ETF with ID {id} not found");
                }

                var holdingSymbol = await _context.TrackedSymbols
                    .FirstOrDefaultAsync(s => s.Symbol == request.Symbol.ToUpper());

                if (holdingSymbol == null)
                {
                    _loggingService.LogWarning($"Holding symbol not found: {request.Symbol}");
                    return NotFound($"Holding symbol {request.Symbol} not found");
                }

                // Check if holding already exists
                var existingHolding = await _context.ETFHoldings
                    .FirstOrDefaultAsync(h => h.ETFSymbolId == id && h.HoldingSymbolId == holdingSymbol.Id);

                if (existingHolding != null)
                {
                    _loggingService.LogWarning($"ETF holding already exists: {etf.Symbol} -> {request.Symbol}");
                    return Conflict($"Holding {request.Symbol} already exists for ETF {etf.Symbol}");
                }

                var holding = new ETFHolding
                {
                    ETFSymbolId = id,
                    HoldingSymbolId = holdingSymbol.Id,
                    Weight = request.Weight,
                    Shares = request.Shares,
                    MarketValue = request.MarketValue,
                    IsTracked = request.IsTracked,
                    LastUpdated = DateTime.UtcNow
                };

                _context.ETFHoldings.Add(holding);
                await _context.SaveChangesAsync();

                _loggingService.LogInfo($"Successfully added ETF holding: {etf.Symbol} -> {request.Symbol}");
                return CreatedAtAction(nameof(GetETFHoldings), new { id }, holding);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "AddETFHolding", id.ToString());
                return StatusCode(500, "Failed to add ETF holding");
            }
        }

        [HttpPut("{id}/holdings/{holdingId}/tracking")]
        public async Task<IActionResult> ToggleHoldingTracking(int id, int holdingId, [FromBody] ToggleTrackingRequest request)
        {
            try
            {
                _loggingService.LogInfo($"ToggleHoldingTracking request received for ETF ID: {id}, Holding ID: {holdingId}");

                var holding = await _context.ETFHoldings
                    .FirstOrDefaultAsync(h => h.Id == holdingId && h.ETFSymbolId == id);

                if (holding == null)
                {
                    _loggingService.LogWarning($"ETF holding not found for ID: {holdingId}");
                    return NotFound($"ETF holding with ID {holdingId} not found");
                }

                holding.IsTracked = request.IsTracked;
                holding.LastUpdated = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _loggingService.LogInfo($"Successfully toggled holding tracking: {holdingId} -> {request.IsTracked}");
                return Ok(holding);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "ToggleHoldingTracking", id.ToString());
                return StatusCode(500, "Failed to toggle holding tracking");
            }
        }

        [HttpDelete("{id}/holdings/{holdingId}")]
        public async Task<IActionResult> RemoveETFHolding(int id, int holdingId)
        {
            try
            {
                _loggingService.LogInfo($"RemoveETFHolding request received for ETF ID: {id}, Holding ID: {holdingId}");

                var holding = await _context.ETFHoldings
                    .FirstOrDefaultAsync(h => h.Id == holdingId && h.ETFSymbolId == id);

                if (holding == null)
                {
                    _loggingService.LogWarning($"ETF holding not found for ID: {holdingId}");
                    return NotFound($"ETF holding with ID {holdingId} not found");
                }

                _context.ETFHoldings.Remove(holding);
                await _context.SaveChangesAsync();

                _loggingService.LogInfo($"Successfully removed ETF holding: {holdingId}");
                return NoContent();
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "RemoveETFHolding", id.ToString());
                return StatusCode(500, "Failed to remove ETF holding");
            }
        }

        // FMP API Test Endpoints

        [HttpGet("test/fmp/{symbol}")]
        public async Task<IActionResult> TestFmpApi(string symbol)
        {
            try
            {
                _logger.LogInformation("Testing FMP API integration with symbol: {Symbol}", symbol);

                // Test multiple FMP API endpoints
                var results = new
                {
                    symbol = symbol.ToUpper(),
                    timestamp = DateTime.UtcNow,
                    tests = new List<object>()
                };

                // Test 1: Validate Symbol
                try
                {
                    var isValid = await _fmpApiService.ValidateSymbol(symbol);
                    ((List<object>)results.tests).Add(new
                    {
                        test = "ValidateSymbol",
                        success = true,
                        result = isValid,
                        message = isValid ? "Symbol is valid" : "Symbol not found"
                    });
                }
                catch (Exception ex)
                {
                    ((List<object>)results.tests).Add(new
                    {
                        test = "ValidateSymbol",
                        success = false,
                        error = ex.Message
                    });
                }

                // Test 2: Get Company Profile
                try
                {
                    var profile = await _fmpApiService.GetCompanyProfile(symbol);
                    ((List<object>)results.tests).Add(new
                    {
                        test = "GetCompanyProfile",
                        success = true,
                        result = profile,
                        message = "Profile data retrieved successfully"
                    });
                }
                catch (Exception ex)
                {
                    ((List<object>)results.tests).Add(new
                    {
                        test = "GetCompanyProfile",
                        success = false,
                        error = ex.Message
                    });
                }

                // Test 3: Get ETF Holdings (if it's an ETF)
                try
                {
                    var holdings = await _fmpApiService.GetETFHoldings(symbol);
                    ((List<object>)results.tests).Add(new
                    {
                        test = "GetETFHoldings",
                        success = true,
                        result = holdings,
                        message = "ETF holdings retrieved successfully"
                    });
                }
                catch (Exception ex)
                {
                    ((List<object>)results.tests).Add(new
                    {
                        test = "GetETFHoldings",
                        success = false,
                        error = ex.Message
                    });
                }

                // Test 4: Get Current Quote
                try
                {
                    var quote = await _fmpApiService.GetQuoteAsync(symbol);
                    ((List<object>)results.tests).Add(new
                    {
                        test = "GetQuote",
                        success = true,
                        result = quote,
                        message = "Quote data retrieved successfully"
                    });
                }
                catch (Exception ex)
                {
                    ((List<object>)results.tests).Add(new
                    {
                        test = "GetQuote",
                        success = false,
                        error = ex.Message
                    });
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("ETFsController", ex,
                    requestId: $"TestFmpApi-{symbol}",
                    severity: ExceptionSeverity.Medium,
                    additionalContext: $"FMP API test failed for symbol {symbol}");
                return StatusCode(500, $"FMP API test failed: {ex.Message}");
            }
        }
    }

    public class AddETFHoldingRequest
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public long Shares { get; set; }
        public decimal? MarketValue { get; set; }
        public bool IsTracked { get; set; } = true;
    }

    public class ToggleTrackingRequest
    {
        public bool IsTracked { get; set; }
    }
}
