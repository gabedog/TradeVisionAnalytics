using System;
using System.IO;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace TradingVisionAnalytics.API.Services
{
    public class LoggingService : ILoggingService
    {
        private readonly ILogger<LoggingService> _logger;
        private readonly IConfiguration _configuration;
        private readonly string _logDirectory;

        public LoggingService(ILogger<LoggingService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "logs");
            
            // Ensure logs directory exists
            if (!Directory.Exists(_logDirectory))
            {
                Directory.CreateDirectory(_logDirectory);
            }
        }

        public void LogApiCall(string endpoint, string symbol, int statusCode, long responseTimeMs, int? requestSize = null, int? responseSize = null)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                Type = "API_CALL",
                Endpoint = endpoint,
                Symbol = symbol,
                StatusCode = statusCode,
                ResponseTimeMs = responseTimeMs,
                RequestSize = requestSize,
                ResponseSize = responseSize,
                Date = DateTime.UtcNow.Date.ToString("yyyy-MM-dd")
            };

            // Log to file
            WriteToFile("api-calls.log", logEntry);
            
            // Log to console
            _logger.LogInformation("FMP API Call: {Endpoint} - {Symbol} - Status: {StatusCode} - ResponseTime: {ResponseTime}ms", 
                endpoint, symbol, statusCode, responseTimeMs);
        }

        public void LogException(Exception exception, string context, string? symbol = null)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                Type = "EXCEPTION",
                Context = context,
                Symbol = symbol,
                ExceptionType = exception.GetType().Name,
                Message = exception.Message,
                StackTrace = exception.StackTrace,
                Date = DateTime.UtcNow.Date.ToString("yyyy-MM-dd")
            };

            // Log to file
            WriteToFile("exceptions.log", logEntry);
            
            // Log to console
            _logger.LogError(exception, "Exception in {Context} for {Symbol}: {Message}", 
                context, symbol ?? "N/A", exception.Message);
        }

        public void LogInfo(string message, string? symbol = null)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                Type = "INFO",
                Message = message,
                Symbol = symbol,
                Date = DateTime.UtcNow.Date.ToString("yyyy-MM-dd")
            };

            WriteToFile("info.log", logEntry);
            _logger.LogInformation("INFO: {Message} - {Symbol}", message, symbol ?? "N/A");
        }

        public void LogWarning(string message, string? symbol = null)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                Type = "WARNING",
                Message = message,
                Symbol = symbol,
                Date = DateTime.UtcNow.Date.ToString("yyyy-MM-dd")
            };

            WriteToFile("warnings.log", logEntry);
            _logger.LogWarning("WARNING: {Message} - {Symbol}", message, symbol ?? "N/A");
        }

        public void LogError(string message, string? symbol = null)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                Type = "ERROR",
                Message = message,
                Symbol = symbol,
                Date = DateTime.UtcNow.Date.ToString("yyyy-MM-dd")
            };

            WriteToFile("errors.log", logEntry);
            _logger.LogError("ERROR: {Message} - {Symbol}", message, symbol ?? "N/A");
        }

        private void WriteToFile(string fileName, object logEntry)
        {
            try
            {
                var filePath = Path.Combine(_logDirectory, fileName);
                var logLine = JsonSerializer.Serialize(logEntry) + Environment.NewLine;
                File.AppendAllText(filePath, logLine);
            }
            catch (Exception ex)
            {
                // Fallback to console if file writing fails
                _logger.LogError(ex, "Failed to write to log file {FileName}", fileName);
            }
        }
    }
}
