using Microsoft.AspNetCore.Mvc;
using TradingVisionAnalytics.API.Services;
using TradingVisionAnalytics.API.Models;
using System;
using System.IO;
using System.Linq;

namespace TradingVisionAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoggingController : ControllerBase
    {
        private readonly ILoggingService _loggingService;
        private readonly IApiLoggingService _apiLoggingService;
        private readonly ILogger<LoggingController> _logger;

        public LoggingController(ILoggingService loggingService, IApiLoggingService apiLoggingService, ILogger<LoggingController> logger)
        {
            _loggingService = loggingService;
            _apiLoggingService = apiLoggingService;
            _logger = logger;
        }

        [HttpGet("test")]
        public IActionResult TestLogging()
        {
            try
            {
                _loggingService.LogInfo("Test logging endpoint accessed");
                _loggingService.LogInfo("Test API call logged", "TEST");

                return Ok(new { message = "Logging test completed", timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "TestLogging endpoint");
                return StatusCode(500, "Logging test failed");
            }
        }

        [HttpGet("test-exception")]
        public async Task<IActionResult> TestException()
        {
            try
            {
                _loggingService.LogInfo("Test exception endpoint accessed - generating test exception");

                // Generate a test exception for logging
                await _apiLoggingService.LogExceptionAsync("LoggingController",
                    new InvalidOperationException("This is a test exception for logging system verification"),
                    requestId: $"TestException-{DateTime.UtcNow:yyyyMMddHHmmss}",
                    severity: ExceptionSeverity.Low,
                    additionalContext: "Test exception generated to verify exception logging functionality");

                return Ok(new {
                    message = "Test exception logged successfully",
                    timestamp = DateTime.UtcNow,
                    note = "Check /api/logging/exceptions to see the logged exception"
                });
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex,
                    severity: ExceptionSeverity.High,
                    additionalContext: "Exception in test-exception endpoint");
                return StatusCode(500, "Failed to log test exception");
            }
        }

        [HttpGet("logs")]
        public IActionResult GetLogFiles()
        {
            try
            {
                var logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "logs");
                if (!Directory.Exists(logDirectory))
                {
                    return NotFound("Log directory not found.");
                }

                var logFiles = Directory.GetFiles(logDirectory, "*.log")
                    .Select(f => new
                    {
                        FileName = Path.GetFileName(f),
                        Size = new FileInfo(f).Length,
                        LastModified = System.IO.File.GetLastWriteTime(f)
                    })
                    .OrderByDescending(f => f.LastModified)
                    .ToList();

                return Ok(new { logFiles, count = logFiles.Count });
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "GetLogFiles endpoint");
                return StatusCode(500, "Failed to retrieve log files");
            }
        }

        [HttpGet("logs/{fileName}")]
        public IActionResult GetLogContent(string fileName)
        {
            try
            {
                var logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "logs");
                var filePath = Path.Combine(logDirectory, fileName);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound($"Log file '{fileName}' not found.");
                }

                var content = System.IO.File.ReadAllText(filePath);
                return Content(content, "text/plain");
            }
            catch (Exception ex)
            {
                _loggingService.LogException(ex, "GetLogContent endpoint");
                return StatusCode(500, "Failed to read log file");
            }
        }

        [HttpGet("api-calls")]
        public async Task<IActionResult> GetApiCalls([FromQuery] int limit = 100, [FromQuery] int offset = 0)
        {
            try
            {
                var apiCalls = await _apiLoggingService.GetRecentApiCallsAsync(limit, offset);
                return Ok(new { apiCalls, limit, offset });
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex, severity: ExceptionSeverity.Medium);
                return StatusCode(500, "Failed to retrieve API calls");
            }
        }

        [HttpGet("exceptions")]
        public async Task<IActionResult> GetExceptions([FromQuery] int limit = 100, [FromQuery] int offset = 0,
            [FromQuery] string? severity = null, [FromQuery] bool? isResolved = null)
        {
            try
            {
                var exceptions = await _apiLoggingService.GetRecentExceptionsAsync(limit, offset, severity, isResolved);
                return Ok(new { exceptions, limit, offset, severity, isResolved });
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex, severity: ExceptionSeverity.Medium);
                return StatusCode(500, "Failed to retrieve exceptions");
            }
        }

        [HttpGet("daily-summary/{date}")]
        public async Task<IActionResult> GetDailySummary(string date)
        {
            try
            {
                if (!DateOnly.TryParse(date, out var parsedDate))
                {
                    return BadRequest("Invalid date format. Use YYYY-MM-DD.");
                }

                var summary = await _apiLoggingService.GetDailySummaryAsync(parsedDate);
                if (summary == null)
                {
                    return NotFound($"No summary found for date: {date}");
                }

                return Ok(summary);
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex, severity: ExceptionSeverity.Medium);
                return StatusCode(500, "Failed to retrieve daily summary");
            }
        }

        [HttpGet("daily-summaries")]
        public async Task<IActionResult> GetDailySummaries([FromQuery] string? startDate = null, [FromQuery] string? endDate = null)
        {
            try
            {
                var start = string.IsNullOrEmpty(startDate) ? DateOnly.FromDateTime(DateTime.Today.AddDays(-30)) : DateOnly.Parse(startDate);
                var end = string.IsNullOrEmpty(endDate) ? DateOnly.FromDateTime(DateTime.Today) : DateOnly.Parse(endDate);

                var summaries = await _apiLoggingService.GetDailySummariesAsync(start, end);
                return Ok(new { summaries, startDate = start, endDate = end });
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex, severity: ExceptionSeverity.Medium);
                return StatusCode(500, "Failed to retrieve daily summaries");
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetApiCallStats([FromQuery] string? startDate = null, [FromQuery] string? endDate = null)
        {
            try
            {
                DateTime? start = string.IsNullOrEmpty(startDate) ? null : DateTime.Parse(startDate);
                DateTime? end = string.IsNullOrEmpty(endDate) ? null : DateTime.Parse(endDate);

                var stats = await _apiLoggingService.GetApiCallStatsAsync(start, end);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex, severity: ExceptionSeverity.Medium);
                return StatusCode(500, "Failed to retrieve API call stats");
            }
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                var yesterday = today.AddDays(-1);
                var lastWeek = today.AddDays(-7);

                var todayStats = await _apiLoggingService.GetApiCallStatsAsync(
                    today.ToDateTime(TimeOnly.MinValue),
                    today.AddDays(1).ToDateTime(TimeOnly.MinValue));

                var weekStats = await _apiLoggingService.GetApiCallStatsAsync(
                    lastWeek.ToDateTime(TimeOnly.MinValue),
                    DateTime.Now);

                var recentExceptions = await _apiLoggingService.GetRecentExceptionsAsync(10, 0, isResolved: false);
                var recentApiCalls = await _apiLoggingService.GetRecentApiCallsAsync(10, 0);

                var dashboard = new
                {
                    today = todayStats,
                    thisWeek = weekStats,
                    recentExceptions,
                    recentApiCalls,
                    generatedAt = DateTime.UtcNow
                };

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex, severity: ExceptionSeverity.High);
                return StatusCode(500, "Failed to retrieve dashboard data");
            }
        }

        [HttpPost("exceptions/{id}/resolve")]
        public async Task<IActionResult> ResolveException(int id, [FromBody] ResolveExceptionRequest request)
        {
            try
            {
                await _apiLoggingService.ResolveExceptionAsync(id, request.ResolutionNotes ?? "Resolved via API");
                return Ok(new { message = "Exception resolved successfully", exceptionId = id });
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex, severity: ExceptionSeverity.Medium);
                return StatusCode(500, "Failed to resolve exception");
            }
        }

        [HttpPost("generate-daily-summary/{date}")]
        public async Task<IActionResult> GenerateDailySummary(string date)
        {
            try
            {
                if (!DateOnly.TryParse(date, out var parsedDate))
                {
                    return BadRequest("Invalid date format. Use YYYY-MM-DD.");
                }

                await _apiLoggingService.GenerateDailySummaryAsync(parsedDate);
                return Ok(new { message = "Daily summary generated successfully", date = parsedDate });
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("LoggingController", ex, severity: ExceptionSeverity.Medium);
                return StatusCode(500, "Failed to generate daily summary");
            }
        }
    }

    public class ResolveExceptionRequest
    {
        public string? ResolutionNotes { get; set; }
    }
}
