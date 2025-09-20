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
    public class SymbolsController : ControllerBase
    {
        private readonly TradingDbContext _context;
        private readonly ILoggingService _loggingService;
        private readonly IFmpApiService _fmpApiService;
        private readonly IApiLoggingService _apiLoggingService;
        private readonly ILogger<SymbolsController> _logger;

        public SymbolsController(TradingDbContext context, ILoggingService loggingService, IFmpApiService fmpApiService, IApiLoggingService apiLoggingService, ILogger<SymbolsController> logger)
        {
            _context = context;
            _loggingService = loggingService;
            _fmpApiService = fmpApiService;
            _apiLoggingService = apiLoggingService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetSymbols()
        {
            try
            {
                _loggingService.LogInfo("GetSymbols request received");

                var symbols = await _context.TrackedSymbols
                    .OrderBy(s => s.Symbol)
                    .ToListAsync();

                // Get ETF counts and ETF lists for each symbol
                var symbolsWithEtfData = new List<object>();

                foreach (var symbol in symbols)
                {
                    var etfHoldings = await _context.ETFHoldings
                        .Include(h => h.ETFSymbol)
                        .Where(h => h.HoldingSymbolId == symbol.Id)
                        .ToListAsync();

                    var etfList = etfHoldings.Select(h => new {
                        symbol = h.ETFSymbol.Symbol,
                        name = h.ETFSymbol.Name,
                        weight = h.Weight
                    }).ToList();

                    symbolsWithEtfData.Add(new
                    {
                        id = symbol.Id,
                        symbol = symbol.Symbol,
                        name = symbol.Name,
                        type = symbol.Type,
                        status = symbol.Status,
                        addedDate = symbol.AddedDate,
                        lastUpdated = symbol.LastUpdated,
                        historicalDataStart = symbol.HistoricalDataStart,
                        historicalDataEnd = symbol.HistoricalDataEnd,
                        dataPoints = symbol.DataPoints,
                        description = symbol.Description,
                        sector = symbol.Sector,
                        industry = symbol.Industry,
                        etfCount = etfList.Count,
                        etfs = etfList
                    });
                }

                _loggingService.LogInfo($"Retrieved {symbols.Count} tracked symbols with ETF data");
                return Ok(new { symbols = symbolsWithEtfData, count = symbols.Count });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "GetSymbols");
                return StatusCode(500, "Failed to retrieve symbols");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSymbol(int id)
        {
            try
            {
                _loggingService.LogInfo($"GetSymbol request received for ID: {id}");
                
                var symbol = await _context.TrackedSymbols
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (symbol == null)
                {
                    _loggingService.LogWarning($"Symbol not found for ID: {id}");
                    return NotFound($"Symbol with ID {id} not found");
                }

                _loggingService.LogInfo($"Retrieved symbol: {symbol.Symbol}");
                return Ok(symbol);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "GetSymbol", id.ToString());
                return StatusCode(500, "Failed to retrieve symbol");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddSymbol([FromBody] AddSymbolRequest request)
        {
            try
            {
                _loggingService.LogInfo($"AddSymbol request received for: {request.Symbol}");

                // Check if symbol already exists
                var existingSymbol = await _context.TrackedSymbols
                    .FirstOrDefaultAsync(s => s.Symbol == request.Symbol.ToUpper());

                if (existingSymbol != null)
                {
                    _loggingService.LogWarning($"Symbol already exists: {request.Symbol}");
                    return Conflict($"Symbol {request.Symbol} already exists");
                }

                var symbol = new TrackedSymbol
                {
                    Symbol = request.Symbol.ToUpper(),
                    Name = request.Name,
                    Type = request.Type.ToUpper(),
                    AddedDate = DateTime.UtcNow,
                    Status = "ACTIVE",
                    HistoricalDataStart = new DateTime(2020, 1, 1),
                    Description = request.Description,
                    Sector = request.Sector,
                    Industry = request.Industry
                };

                _context.TrackedSymbols.Add(symbol);
                await _context.SaveChangesAsync();

                _loggingService.LogInfo($"Successfully added symbol: {symbol.Symbol}");
                return CreatedAtAction(nameof(GetSymbol), new { id = symbol.Id }, symbol);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "AddSymbol", request.Symbol);
                return StatusCode(500, "Failed to add symbol");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveSymbol(int id)
        {
            try
            {
                _loggingService.LogInfo($"RemoveSymbol request received for ID: {id}");

                var symbol = await _context.TrackedSymbols.FindAsync(id);
                if (symbol == null)
                {
                    _loggingService.LogWarning($"Symbol not found for ID: {id}");
                    return NotFound($"Symbol with ID {id} not found");
                }

                _context.TrackedSymbols.Remove(symbol);
                await _context.SaveChangesAsync();

                _loggingService.LogInfo($"Successfully removed symbol: {symbol.Symbol}");
                return NoContent();
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "RemoveSymbol", id.ToString());
                return StatusCode(500, "Failed to remove symbol");
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateSymbolStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                _loggingService.LogInfo($"UpdateSymbolStatus request received for ID: {id}, Status: {request.Status}");

                var symbol = await _context.TrackedSymbols.FindAsync(id);
                if (symbol == null)
                {
                    _loggingService.LogWarning($"Symbol not found for ID: {id}");
                    return NotFound($"Symbol with ID {id} not found");
                }

                symbol.Status = request.Status;
                symbol.LastUpdated = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _loggingService.LogInfo($"Successfully updated symbol status: {symbol.Symbol} -> {request.Status}");
                return Ok(symbol);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "UpdateSymbolStatus", id.ToString());
                return StatusCode(500, "Failed to update symbol status");
            }
        }

        // FMP API Integration Endpoints

        [HttpPost("{id}/fetch-holdings")]
        public async Task<IActionResult> FetchETFHoldings(int id)
        {
            try
            {
                var symbol = await _context.TrackedSymbols.FindAsync(id);
                if (symbol == null)
                {
                    return NotFound($"Symbol with ID {id} not found");
                }

                if (symbol.Type != "ETF")
                {
                    return BadRequest("Symbol must be an ETF to fetch holdings");
                }

                _logger.LogInformation("Fetching ETF holdings for {Symbol}", symbol.Symbol);

                var holdingsData = await _fmpApiService.GetETFHoldings(symbol.Symbol);

                return Ok(new {
                    symbol = symbol.Symbol,
                    holdingsData,
                    message = "ETF holdings fetched successfully"
                });
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("SymbolsController", ex,
                    requestId: $"FetchETFHoldings-{id}",
                    severity: ExceptionSeverity.Medium,
                    additionalContext: $"Failed to fetch ETF holdings for symbol ID {id}");
                return StatusCode(500, "Failed to fetch ETF holdings");
            }
        }

        [HttpPost("{id}/fetch-historical")]
        public async Task<IActionResult> FetchHistoricalData(int id, [FromBody] FetchHistoricalRequest request)
        {
            try
            {
                var symbol = await _context.TrackedSymbols.FindAsync(id);
                if (symbol == null)
                {
                    return NotFound($"Symbol with ID {id} not found");
                }

                var startDate = request.StartDate ?? new DateTime(2020, 1, 1);
                var endDate = request.EndDate ?? DateTime.Today;

                _logger.LogInformation("Fetching historical data for {Symbol} from {StartDate} to {EndDate}",
                    symbol.Symbol, startDate, endDate);

                var historicalData = await _fmpApiService.GetHistoricalData(symbol.Symbol, startDate, endDate);

                return Ok(new {
                    symbol = symbol.Symbol,
                    startDate,
                    endDate,
                    historicalData,
                    message = "Historical data fetched successfully"
                });
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("SymbolsController", ex,
                    requestId: $"FetchHistoricalData-{id}",
                    severity: ExceptionSeverity.Medium,
                    additionalContext: $"Failed to fetch historical data for symbol ID {id}");
                return StatusCode(500, "Failed to fetch historical data");
            }
        }

        [HttpPut("{id}/data-range")]
        public async Task<IActionResult> UpdateDataRange(int id, [FromBody] UpdateDataRangeRequest request)
        {
            try
            {
                var symbol = await _context.TrackedSymbols.FindAsync(id);
                if (symbol == null)
                {
                    return NotFound($"Symbol with ID {id} not found");
                }

                symbol.HistoricalDataStart = request.StartDate;
                symbol.HistoricalDataEnd = request.EndDate;
                symbol.LastUpdated = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Updated data range for {Symbol}: {StartDate} to {EndDate}",
                    symbol.Symbol, request.StartDate, request.EndDate);

                return Ok(symbol);
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("SymbolsController", ex,
                    requestId: $"UpdateDataRange-{id}",
                    severity: ExceptionSeverity.Low,
                    additionalContext: $"Failed to update data range for symbol ID {id}");
                return StatusCode(500, "Failed to update data range");
            }
        }

        [HttpPost("{id}/import-profile")]
        public async Task<IActionResult> ImportSymbolProfile(int id)
        {
            try
            {
                _loggingService.LogInfo($"ImportSymbolProfile request received for Symbol ID: {id}");

                var symbol = await _context.TrackedSymbols.FindAsync(id);
                if (symbol == null)
                {
                    _loggingService.LogWarning($"Symbol not found for ID: {id}");
                    return NotFound($"Symbol with ID {id} not found");
                }

                var apiCalls = new List<object>();
                var fieldsUpdated = new List<string>();
                var errors = new List<string>();
                bool profileRetrieved = false;
                bool profileUpdated = false;

                // Validate symbol first
                _loggingService.LogInfo($"Validating symbol {symbol.Symbol} with FMP API");
                var isValid = await _fmpApiService.ValidateSymbol(symbol.Symbol);

                apiCalls.Add(new
                {
                    endpoint = "ValidateSymbol",
                    symbol = symbol.Symbol,
                    success = isValid,
                    timestamp = DateTime.UtcNow
                });

                if (!isValid)
                {
                    errors.Add("Symbol validation failed - symbol not found in FMP");
                    return Ok(new
                    {
                        success = false,
                        message = "Symbol validation failed",
                        symbolId = id,
                        symbol = symbol.Symbol,
                        apiCalls = apiCalls,
                        profile = new { retrieved = false, updated = false, fieldsUpdated = fieldsUpdated, errors = errors }
                    });
                }

                // Get company profile
                _loggingService.LogInfo($"Fetching company profile for {symbol.Symbol} from FMP API");
                var profileJson = await _fmpApiService.GetCompanyProfile(symbol.Symbol);

                apiCalls.Add(new
                {
                    endpoint = "GetCompanyProfile",
                    symbol = symbol.Symbol,
                    success = true,
                    timestamp = DateTime.UtcNow
                });

                var profileData = JsonSerializer.Deserialize<JsonElement[]>(profileJson);

                if (profileData == null || profileData.Length == 0)
                {
                    errors.Add("No profile data received from FMP API");
                    return Ok(new
                    {
                        success = false,
                        message = "No profile data found",
                        symbolId = id,
                        symbol = symbol.Symbol,
                        apiCalls = apiCalls,
                        profile = new { retrieved = false, updated = false, fieldsUpdated = fieldsUpdated, errors = errors }
                    });
                }

                var profile = profileData[0];
                profileRetrieved = true;

                // Update symbol with profile data

                if (profile.TryGetProperty("companyName", out var companyName) && !string.IsNullOrEmpty(companyName.GetString()))
                {
                    var newName = companyName.GetString();
                    if (symbol.Name != newName)
                    {
                        symbol.Name = newName;
                        fieldsUpdated.Add($"Name: '{symbol.Name}' -> '{newName}'");
                    }
                }

                if (profile.TryGetProperty("description", out var description) && !string.IsNullOrEmpty(description.GetString()))
                {
                    var newDescription = description.GetString();
                    if (symbol.Description != newDescription)
                    {
                        symbol.Description = newDescription;
                        fieldsUpdated.Add("Description updated");
                    }
                }

                if (profile.TryGetProperty("sector", out var sector) && !string.IsNullOrEmpty(sector.GetString()))
                {
                    var newSector = sector.GetString();
                    if (symbol.Sector != newSector)
                    {
                        symbol.Sector = newSector;
                        fieldsUpdated.Add($"Sector: '{symbol.Sector}' -> '{newSector}'");
                    }
                }

                if (profile.TryGetProperty("industry", out var industry) && !string.IsNullOrEmpty(industry.GetString()))
                {
                    var newIndustry = industry.GetString();
                    if (symbol.Industry != newIndustry)
                    {
                        symbol.Industry = newIndustry;
                        fieldsUpdated.Add($"Industry: '{symbol.Industry}' -> '{newIndustry}'");
                    }
                }

                if (profile.TryGetProperty("isEtf", out var isEtf) && isEtf.GetBoolean())
                {
                    if (symbol.Type != "ETF")
                    {
                        symbol.Type = "ETF";
                        fieldsUpdated.Add($"Type: changed to ETF");
                    }
                }
                else if (symbol.Type == "UNKNOWN")
                {
                    symbol.Type = "STOCK";
                    fieldsUpdated.Add("Type: changed to STOCK");
                }

                if (fieldsUpdated.Any())
                {
                    symbol.LastUpdated = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    profileUpdated = true;
                }

                var startTime = DateTime.UtcNow.AddMinutes(-1);
                var endTime = DateTime.UtcNow;
                var duration = endTime - startTime;

                var finalResult = new
                {
                    success = true,
                    message = $"Symbol profile import completed for {symbol.Symbol}",
                    symbol = new { id = symbol.Id, symbol = symbol.Symbol, name = symbol.Name, type = symbol.Type },
                    apiCalls = apiCalls,
                    profile = new
                    {
                        retrieved = profileRetrieved,
                        updated = profileUpdated,
                        fieldsUpdated = fieldsUpdated,
                        errors = errors
                    },
                    timing = new
                    {
                        startTime = startTime,
                        endTime = endTime,
                        durationMs = duration.TotalMilliseconds
                    },
                    summary = new
                    {
                        profileRetrieved = profileRetrieved,
                        fieldsUpdated = fieldsUpdated.Count,
                        apiCallsSuccessful = apiCalls.Count,
                        errors = errors.Count
                    }
                };

                _loggingService.LogInfo($"Successfully imported profile for {symbol.Symbol}: {fieldsUpdated.Count} fields updated");
                return Ok(finalResult);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "ImportSymbolProfile", id.ToString());
                return StatusCode(500, "Failed to import symbol profile");
            }
        }

        [HttpPost("validate/{symbol}")]
        public async Task<IActionResult> ValidateSymbol(string symbol)
        {
            try
            {
                _logger.LogInformation("Validating symbol {Symbol}", symbol);

                var isValid = await _fmpApiService.ValidateSymbol(symbol.ToUpper());

                if (isValid)
                {
                    var profile = await _fmpApiService.GetCompanyProfile(symbol.ToUpper());
                    return Ok(new {
                        symbol = symbol.ToUpper(),
                        isValid = true,
                        profile,
                        message = "Symbol is valid"
                    });
                }
                else
                {
                    return Ok(new {
                        symbol = symbol.ToUpper(),
                        isValid = false,
                        message = "Symbol not found or invalid"
                    });
                }
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("SymbolsController", ex,
                    requestId: $"ValidateSymbol-{symbol}",
                    severity: ExceptionSeverity.Low,
                    additionalContext: $"Failed to validate symbol {symbol}");
                return StatusCode(500, "Failed to validate symbol");
            }
        }
    }

    public class AddSymbolRequest
    {
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Sector { get; set; }
        public string? Industry { get; set; }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class FetchHistoricalRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class UpdateDataRangeRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
