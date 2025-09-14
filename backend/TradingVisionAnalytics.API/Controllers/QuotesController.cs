using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace TradingVisionAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private readonly ILogger<QuotesController> _logger;
        private readonly IConfiguration _configuration;

        public QuotesController(ILogger<QuotesController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuotes()
        {
            _logger.LogInformation("Quotes endpoint accessed");
            
            try
            {
                // Static data for initial testing
                var quotes = new[]
                {
                    new
                    {
                        Symbol = "AAPL",
                        Name = "Apple Inc.",
                        Price = 175.43m,
                        Change = 2.15m,
                        ChangePercent = 1.24m,
                        Volume = 45678900,
                        MarketCap = 2750000000000m,
                        LastUpdated = DateTime.Now
                    },
                    new
                    {
                        Symbol = "MSFT",
                        Name = "Microsoft Corporation",
                        Price = 378.85m,
                        Change = -1.25m,
                        ChangePercent = -0.33m,
                        Volume = 23456700,
                        MarketCap = 2810000000000m,
                        LastUpdated = DateTime.Now
                    },
                    new
                    {
                        Symbol = "GOOGL",
                        Name = "Alphabet Inc.",
                        Price = 142.56m,
                        Change = 3.42m,
                        ChangePercent = 2.46m,
                        Volume = 34567800,
                        MarketCap = 1780000000000m,
                        LastUpdated = DateTime.Now
                    }
                };

                return Ok(new { quotes, count = quotes.Length });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetQuotes endpoint");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{symbol}")]
        public async Task<IActionResult> GetQuote(string symbol)
        {
            _logger.LogInformation("Quote endpoint accessed for symbol: {Symbol}", symbol);
            
            try
            {
                // Static data lookup
                var quotes = new[]
                {
                    new
                    {
                        Symbol = "AAPL",
                        Name = "Apple Inc.",
                        Price = 175.43m,
                        Change = 2.15m,
                        ChangePercent = 1.24m,
                        Volume = 45678900,
                        MarketCap = 2750000000000m,
                        LastUpdated = DateTime.Now
                    },
                    new
                    {
                        Symbol = "MSFT",
                        Name = "Microsoft Corporation",
                        Price = 378.85m,
                        Change = -1.25m,
                        ChangePercent = -0.33m,
                        Volume = 23456700,
                        MarketCap = 2810000000000m,
                        LastUpdated = DateTime.Now
                    },
                    new
                    {
                        Symbol = "GOOGL",
                        Name = "Alphabet Inc.",
                        Price = 142.56m,
                        Change = 3.42m,
                        ChangePercent = 2.46m,
                        Volume = 34567800,
                        MarketCap = 1780000000000m,
                        LastUpdated = DateTime.Now
                    }
                };

                var quote = quotes.FirstOrDefault(q => q.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase));
                
                if (quote == null)
                {
                    return NotFound($"Quote not found for symbol: {symbol}");
                }

                return Ok(new { quote });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetQuote endpoint for {Symbol}", symbol);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{symbol}/daily")]
        public async Task<IActionResult> GetDailyQuotes(string symbol, int days = 30)
        {
            _logger.LogInformation("Daily quotes endpoint accessed for symbol: {Symbol}, days: {Days}", symbol, days);
            
            try
            {
                // Sample daily quotes data
                var dailyQuotes = GetSampleDailyQuotes(symbol);
                
                if (dailyQuotes == null)
                {
                    return NotFound($"Daily quotes not found for symbol: {symbol}");
                }

                // Limit to requested number of days
                if (days > 0)
                {
                    dailyQuotes = dailyQuotes.Take(days).ToArray();
                }

                return Ok(new
                {
                    symbol = symbol.ToUpper(),
                    dailyQuotes,
                    count = dailyQuotes.Length,
                    requestedDays = days
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetDailyQuotes endpoint for {Symbol}", symbol);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{symbol}/daily/range")]
        public async Task<IActionResult> GetDailyQuotesRange(string symbol, string startDate, string endDate)
        {
            _logger.LogInformation("Daily quotes range endpoint accessed for symbol: {Symbol}, from {StartDate} to {EndDate}", 
                symbol, startDate, endDate);
            
            try
            {
                var dailyQuotes = GetSampleDailyQuotes(symbol);
                
                if (dailyQuotes == null)
                {
                    return NotFound($"Daily quotes not found for symbol: {symbol}");
                }

                // Filter by date range
                var filteredQuotes = dailyQuotes
                    .Where(q => q.Date >= startDate && q.Date <= endDate)
                    .ToArray();

                return Ok(new
                {
                    symbol = symbol.ToUpper(),
                    dailyQuotes = filteredQuotes,
                    count = filteredQuotes.Length,
                    startDate,
                    endDate
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetDailyQuotesRange endpoint for {Symbol}", symbol);
                return StatusCode(500, "Internal server error");
            }
        }

        private static object[]? GetSampleDailyQuotes(string symbol)
        {
            var symbolUpper = symbol.ToUpper();
            
            return symbolUpper switch
            {
                "AAPL" => new[]
                {
                    new { Date = "2024-12-13", Open = 173.25m, High = 175.89m, Low = 172.80m, Close = 175.43m, Volume = 45678900 },
                    new { Date = "2024-12-12", Open = 171.50m, High = 174.20m, Low = 171.20m, Close = 173.28m, Volume = 42345600 },
                    new { Date = "2024-12-11", Open = 170.80m, High = 172.15m, Low = 170.10m, Close = 171.50m, Volume = 38912300 },
                    new { Date = "2024-12-10", Open = 172.00m, High = 173.45m, Low = 171.25m, Close = 170.80m, Volume = 41234500 },
                    new { Date = "2024-12-09", Open = 171.75m, High = 172.80m, Low = 170.90m, Close = 172.00m, Volume = 37890100 },
                    new { Date = "2024-12-06", Open = 170.25m, High = 172.10m, Low = 169.80m, Close = 171.75m, Volume = 40123400 },
                    new { Date = "2024-12-05", Open = 169.50m, High = 171.00m, Low = 168.90m, Close = 170.25m, Volume = 36567800 },
                    new { Date = "2024-12-04", Open = 168.75m, High = 170.25m, Low = 168.20m, Close = 169.50m, Volume = 34215600 },
                    new { Date = "2024-12-03", Open = 167.90m, High = 169.50m, Low = 167.30m, Close = 168.75m, Volume = 38901200 },
                    new { Date = "2024-12-02", Open = 166.25m, High = 168.40m, Low = 165.80m, Close = 167.90m, Volume = 35678900 }
                },
                "MSFT" => new[]
                {
                    new { Date = "2024-12-13", Open = 377.20m, High = 380.15m, Low = 376.50m, Close = 378.85m, Volume = 23456700 },
                    new { Date = "2024-12-12", Open = 375.80m, High = 378.90m, Low = 375.20m, Close = 377.20m, Volume = 21234500 },
                    new { Date = "2024-12-11", Open = 374.50m, High = 376.80m, Low = 373.90m, Close = 375.80m, Volume = 19876500 },
                    new { Date = "2024-12-10", Open = 373.25m, High = 375.40m, Low = 372.60m, Close = 374.50m, Volume = 22345600 },
                    new { Date = "2024-12-09", Open = 372.00m, High = 374.20m, Low = 371.40m, Close = 373.25m, Volume = 18765400 },
                    new { Date = "2024-12-06", Open = 370.75m, High = 372.80m, Low = 370.20m, Close = 372.00m, Volume = 20123400 },
                    new { Date = "2024-12-05", Open = 369.50m, High = 371.40m, Low = 368.90m, Close = 370.75m, Volume = 17654300 },
                    new { Date = "2024-12-04", Open = 368.25m, High = 370.20m, Low = 367.60m, Close = 369.50m, Volume = 19234500 },
                    new { Date = "2024-12-03", Open = 367.00m, High = 369.10m, Low = 366.40m, Close = 368.25m, Volume = 18543200 },
                    new { Date = "2024-12-02", Open = 365.75m, High = 367.80m, Low = 365.20m, Close = 367.00m, Volume = 17345600 }
                },
                "GOOGL" => new[]
                {
                    new { Date = "2024-12-13", Open = 140.25m, High = 143.80m, Low = 139.90m, Close = 142.56m, Volume = 34567800 },
                    new { Date = "2024-12-12", Open = 139.50m, High = 141.20m, Low = 138.80m, Close = 140.25m, Volume = 31234500 },
                    new { Date = "2024-12-11", Open = 138.75m, High = 140.40m, Low = 138.20m, Close = 139.50m, Volume = 29876500 },
                    new { Date = "2024-12-10", Open = 137.90m, High = 139.60m, Low = 137.40m, Close = 138.75m, Volume = 32345600 },
                    new { Date = "2024-12-09", Open = 137.25m, High = 138.80m, Low = 136.70m, Close = 137.90m, Volume = 28765400 },
                    new { Date = "2024-12-06", Open = 136.50m, High = 138.20m, Low = 136.00m, Close = 137.25m, Volume = 30123400 },
                    new { Date = "2024-12-05", Open = 135.75m, High = 137.40m, Low = 135.20m, Close = 136.50m, Volume = 27654300 },
                    new { Date = "2024-12-04", Open = 135.00m, High = 136.80m, Low = 134.60m, Close = 135.75m, Volume = 29234500 },
                    new { Date = "2024-12-03", Open = 134.25m, High = 136.00m, Low = 133.80m, Close = 135.00m, Volume = 28543200 },
                    new { Date = "2024-12-02", Open = 133.50m, High = 135.20m, Low = 133.00m, Close = 134.25m, Volume = 27345600 }
                },
                _ => null
            };
        }
    }
}
