using Microsoft.AspNetCore.Mvc;
using TradingVisionAnalytics.API.Services;

namespace TradingVisionAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchedulerController : ControllerBase
    {
        private readonly ISchedulerService _schedulerService;
        private readonly ILoggingService _loggingService;
        private readonly ILogger<SchedulerController> _logger;

        public SchedulerController(ISchedulerService schedulerService, ILoggingService loggingService, ILogger<SchedulerController> logger)
        {
            _schedulerService = schedulerService;
            _loggingService = loggingService;
            _logger = logger;
        }

        [HttpPost("start-all")]
        public IActionResult StartAllScheduledJobs()
        {
            try
            {
                _schedulerService.ScheduleDailyQuotesCollection();
                _schedulerService.ScheduleEtfHoldingsUpdate();
                _schedulerService.ScheduleMarketBreadthCalculation();
                _schedulerService.ScheduleFmpApiRateLimit();

                _loggingService.LogInfo("All scheduled jobs started successfully");
                return Ok(new { message = "All scheduled jobs started successfully", timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "StartAllScheduledJobs");
                return StatusCode(500, "Failed to start scheduled jobs");
            }
        }

        [HttpPost("daily-quotes")]
        public IActionResult StartDailyQuotesCollection()
        {
            try
            {
                _schedulerService.ScheduleDailyQuotesCollection();
                _loggingService.LogInfo("Daily quotes collection scheduled");
                return Ok(new { message = "Daily quotes collection scheduled", timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "StartDailyQuotesCollection");
                return StatusCode(500, "Failed to schedule daily quotes collection");
            }
        }

        [HttpPost("etf-holdings")]
        public IActionResult StartEtfHoldingsUpdate()
        {
            try
            {
                _schedulerService.ScheduleEtfHoldingsUpdate();
                _loggingService.LogInfo("ETF holdings update scheduled");
                return Ok(new { message = "ETF holdings update scheduled", timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "StartEtfHoldingsUpdate");
                return StatusCode(500, "Failed to schedule ETF holdings update");
            }
        }

        [HttpPost("market-breadth")]
        public IActionResult StartMarketBreadthCalculation()
        {
            try
            {
                _schedulerService.ScheduleMarketBreadthCalculation();
                _loggingService.LogInfo("Market breadth calculation scheduled");
                return Ok(new { message = "Market breadth calculation scheduled", timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "StartMarketBreadthCalculation");
                return StatusCode(500, "Failed to schedule market breadth calculation");
            }
        }

        [HttpPost("process-data")]
        public IActionResult ProcessData([FromBody] ProcessDataRequest request)
        {
            try
            {
                _schedulerService.EnqueueDataProcessing(request.Symbol, request.DataType);
                _loggingService.LogInfo($"Data processing enqueued for {request.Symbol} - {request.DataType}", request.Symbol);
                return Ok(new { message = "Data processing enqueued", symbol = request.Symbol, dataType = request.DataType, timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "ProcessData", request.Symbol);
                return StatusCode(500, "Failed to enqueue data processing");
            }
        }

        [HttpGet("status")]
        public IActionResult GetSchedulerStatus()
        {
            try
            {
                // This would typically check Hangfire job status
                var status = new
                {
                    SchedulerRunning = true,
                    JobsScheduled = 4,
                    LastUpdate = DateTime.UtcNow,
                    AvailableJobs = new[]
                    {
                        "daily-quotes-collection",
                        "etf-holdings-update", 
                        "market-breadth-calculation",
                        "fmp-api-rate-limit"
                    }
                };

                return Ok(status);
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "GetSchedulerStatus");
                return StatusCode(500, "Failed to get scheduler status");
            }
        }
    }

    public class ProcessDataRequest
    {
        public string Symbol { get; set; } = string.Empty;
        public string DataType { get; set; } = string.Empty;
    }
}
