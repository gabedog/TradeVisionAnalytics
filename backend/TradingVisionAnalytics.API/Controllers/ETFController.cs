using Microsoft.AspNetCore.Mvc;

namespace TradingVisionAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ETFController : ControllerBase
    {
        private readonly ILogger<ETFController> _logger;
        private readonly IConfiguration _configuration;

        public ETFController(ILogger<ETFController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetAvailableETFs()
        {
            _logger.LogInformation("Available ETFs endpoint accessed");
            
            try
            {
                var etfs = new[]
                {
                    new
                    {
                        Symbol = "QQQ",
                        Name = "Invesco QQQ Trust",
                        Description = "Tracks the NASDAQ-100 Index",
                        TotalHoldings = 100,
                        LastUpdated = DateTime.Now
                    },
                    new
                    {
                        Symbol = "SPY",
                        Name = "SPDR S&P 500 ETF Trust",
                        Description = "Tracks the S&P 500 Index",
                        TotalHoldings = 500,
                        LastUpdated = DateTime.Now
                    }
                };

                return Ok(new { etfs, count = etfs.Length });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAvailableETFs endpoint");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{symbol}/holdings")]
        public IActionResult GetETFHoldings(string symbol)
        {
            _logger.LogInformation("ETF holdings endpoint accessed for symbol: {Symbol}", symbol);
            
            try
            {
                var etfHoldings = GetSampleETFHoldings(symbol);
                
                if (etfHoldings == null)
                {
                    return NotFound($"ETF holdings not found for symbol: {symbol}");
                }

                return Ok(new { etfHoldings });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetETFHoldings endpoint for {Symbol}", symbol);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{symbol}/holdings/symbols")]
        public IActionResult GetETFSymbols(string symbol)
        {
            _logger.LogInformation("ETF symbols endpoint accessed for symbol: {Symbol}", symbol);
            
            try
            {
                var etfHoldings = GetSampleETFHoldings(symbol);
                
                if (etfHoldings == null)
                {
                    return NotFound($"ETF holdings not found for symbol: {symbol}");
                }

                var symbols = etfHoldings.Holdings.Select(h => ((dynamic)h).Symbol).ToArray();

                return Ok(new
                {
                    etf = symbol.ToUpper(),
                    symbols,
                    count = symbols.Length,
                    totalHoldings = etfHoldings.TotalHoldings
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetETFSymbols endpoint for {Symbol}", symbol);
                return StatusCode(500, "Internal server error");
            }
        }

        private static ETFHoldings? GetSampleETFHoldings(string symbol)
        {
            var symbolUpper = symbol.ToUpper();
            
            return symbolUpper switch
            {
                "QQQ" => new ETFHoldings
                {
                    Name = "Invesco QQQ Trust",
                    Description = "Tracks the NASDAQ-100 Index",
                    TotalHoldings = 100,
                    Holdings = new[]
                    {
                        new { Symbol = "AAPL", Name = "Apple Inc.", Weight = 8.45m, Shares = 1234567890L },
                        new { Symbol = "MSFT", Name = "Microsoft Corporation", Weight = 7.89m, Shares = 987654321L },
                        new { Symbol = "AMZN", Name = "Amazon.com Inc.", Weight = 5.23m, Shares = 456789123L },
                        new { Symbol = "NVDA", Name = "NVIDIA Corporation", Weight = 4.67m, Shares = 234567890L },
                        new { Symbol = "GOOGL", Name = "Alphabet Inc. Class A", Weight = 3.45m, Shares = 345678901L },
                        new { Symbol = "GOOG", Name = "Alphabet Inc. Class C", Weight = 3.12m, Shares = 312345678L },
                        new { Symbol = "TSLA", Name = "Tesla Inc.", Weight = 2.89m, Shares = 234567890L },
                        new { Symbol = "META", Name = "Meta Platforms Inc.", Weight = 2.34m, Shares = 198765432L },
                        new { Symbol = "NFLX", Name = "Netflix Inc.", Weight = 1.67m, Shares = 123456789L },
                        new { Symbol = "ADBE", Name = "Adobe Inc.", Weight = 1.45m, Shares = 98765432L },
                        new { Symbol = "PYPL", Name = "PayPal Holdings Inc.", Weight = 1.23m, Shares = 87654321L },
                        new { Symbol = "INTC", Name = "Intel Corporation", Weight = 1.12m, Shares = 76543210L },
                        new { Symbol = "CMCSA", Name = "Comcast Corporation", Weight = 0.98m, Shares = 65432109L },
                        new { Symbol = "PEP", Name = "PepsiCo Inc.", Weight = 0.87m, Shares = 54321098L },
                        new { Symbol = "COST", Name = "Costco Wholesale Corporation", Weight = 0.76m, Shares = 43210987L },
                        new { Symbol = "TMUS", Name = "T-Mobile US Inc.", Weight = 0.65m, Shares = 32109876L },
                        new { Symbol = "AVGO", Name = "Broadcom Inc.", Weight = 0.54m, Shares = 21098765L },
                        new { Symbol = "TXN", Name = "Texas Instruments Incorporated", Weight = 0.43m, Shares = 10987654L },
                        new { Symbol = "QCOM", Name = "QUALCOMM Incorporated", Weight = 0.32m, Shares = 9876543L },
                        new { Symbol = "CHTR", Name = "Charter Communications Inc.", Weight = 0.21m, Shares = 8765432L }
                    },
                    LastUpdated = DateTime.Now
                },
                "SPY" => new ETFHoldings
                {
                    Name = "SPDR S&P 500 ETF Trust",
                    Description = "Tracks the S&P 500 Index",
                    TotalHoldings = 500,
                    Holdings = new[]
                    {
                        new { Symbol = "AAPL", Name = "Apple Inc.", Weight = 7.23m, Shares = 1234567890L },
                        new { Symbol = "MSFT", Name = "Microsoft Corporation", Weight = 6.89m, Shares = 987654321L },
                        new { Symbol = "AMZN", Name = "Amazon.com Inc.", Weight = 3.45m, Shares = 456789123L },
                        new { Symbol = "NVDA", Name = "NVIDIA Corporation", Weight = 2.67m, Shares = 234567890L },
                        new { Symbol = "GOOGL", Name = "Alphabet Inc. Class A", Weight = 2.12m, Shares = 345678901L }
                    },
                    LastUpdated = DateTime.Now
                },
                _ => null
            };
        }
    }

    public class ETFHoldings
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int TotalHoldings { get; set; }
        public object[] Holdings { get; set; } = Array.Empty<object>();
        public DateTime LastUpdated { get; set; }
    }
}
