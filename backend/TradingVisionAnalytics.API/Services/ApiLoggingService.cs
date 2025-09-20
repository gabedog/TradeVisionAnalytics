using Microsoft.EntityFrameworkCore;
using TradingVisionAnalytics.API.Data;
using TradingVisionAnalytics.API.Models;

namespace TradingVisionAnalytics.API.Services
{
    public class ApiLoggingService : IApiLoggingService
    {
        private readonly TradingDbContext _context;
        private readonly ILogger<ApiLoggingService> _logger;

        public ApiLoggingService(TradingDbContext context, ILogger<ApiLoggingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task LogApiCallAsync(string endpoint, string httpMethod, string? parameters = null,
            int statusCode = 0, int responseTimeMs = 0, int symbolsRequested = 0,
            int symbolsSuccessful = 0, int symbolsFailed = 0, string? requestId = null,
            string? errorMessage = null)
        {
            try
            {
                var apiCallLog = new ApiCallLog
                {
                    Endpoint = endpoint,
                    HttpMethod = httpMethod,
                    Parameters = parameters,
                    StatusCode = statusCode,
                    ResponseTimeMs = responseTimeMs,
                    SymbolsRequested = symbolsRequested,
                    SymbolsSuccessful = symbolsSuccessful,
                    SymbolsFailed = symbolsFailed,
                    RequestId = requestId,
                    ErrorMessage = errorMessage,
                    Timestamp = DateTime.UtcNow
                };

                _context.ApiCallLogs.Add(apiCallLog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log API call for endpoint: {Endpoint}", endpoint);
            }
        }

        public async Task LogExceptionAsync(string source, Exception exception, string? requestId = null,
            string severity = ExceptionSeverity.Medium, string? additionalContext = null)
        {
            await LogExceptionAsync(source, exception.GetType().Name, exception.Message,
                exception.StackTrace, requestId, severity, additionalContext);
        }

        public async Task LogExceptionAsync(string source, string exceptionType, string message,
            string? stackTrace = null, string? requestId = null,
            string severity = ExceptionSeverity.Medium, string? additionalContext = null)
        {
            try
            {
                var apiException = new ApiException
                {
                    Source = source,
                    ExceptionType = exceptionType,
                    Message = message.Length > 1000 ? message[..1000] : message,
                    StackTrace = stackTrace,
                    RequestId = requestId,
                    Severity = severity,
                    AdditionalContext = additionalContext,
                    Timestamp = DateTime.UtcNow
                };

                _context.ApiExceptions.Add(apiException);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log system exception from source: {Source}", source);
            }
        }

        public async Task<IEnumerable<ApiCallLog>> GetRecentApiCallsAsync(int limit = 100, int offset = 0)
        {
            return await _context.ApiCallLogs
                .OrderByDescending(x => x.Timestamp)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<IEnumerable<ApiException>> GetRecentExceptionsAsync(int limit = 100, int offset = 0,
            string? severity = null, bool? isResolved = null)
        {
            var query = _context.ApiExceptions.AsQueryable();

            if (!string.IsNullOrEmpty(severity))
                query = query.Where(x => x.Severity == severity);

            if (isResolved.HasValue)
                query = query.Where(x => x.IsResolved == isResolved.Value);

            return await query
                .OrderByDescending(x => x.Timestamp)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<DailyApiSummary?> GetDailySummaryAsync(DateOnly date)
        {
            return await _context.DailyApiSummaries
                .FirstOrDefaultAsync(x => x.Date == date);
        }

        public async Task<IEnumerable<DailyApiSummary>> GetDailySummariesAsync(DateOnly startDate, DateOnly endDate)
        {
            return await _context.DailyApiSummaries
                .Where(x => x.Date >= startDate && x.Date <= endDate)
                .OrderByDescending(x => x.Date)
                .ToListAsync();
        }

        public async Task GenerateDailySummaryAsync(DateOnly date)
        {
            try
            {
                var startDateTime = date.ToDateTime(TimeOnly.MinValue);
                var endDateTime = date.AddDays(1).ToDateTime(TimeOnly.MinValue);

                var apiCalls = await _context.ApiCallLogs
                    .Where(x => x.Timestamp >= startDateTime && x.Timestamp < endDateTime)
                    .ToListAsync();

                if (!apiCalls.Any()) return;

                var existingSummary = await GetDailySummaryAsync(date);

                var summary = existingSummary ?? new DailyApiSummary { Date = date };

                summary.TotalCalls = apiCalls.Count;
                summary.SuccessfulCalls = apiCalls.Count(x => x.IsSuccessful);
                summary.FailedCalls = apiCalls.Count(x => !x.IsSuccessful);
                summary.AverageResponseTimeMs = apiCalls.Any() ? (int)apiCalls.Average(x => x.ResponseTimeMs) : 0;
                summary.TotalSymbolsProcessed = apiCalls.Sum(x => x.SymbolsRequested);
                summary.TotalSymbolsSuccessful = apiCalls.Sum(x => x.SymbolsSuccessful);
                summary.TotalSymbolsFailed = apiCalls.Sum(x => x.SymbolsFailed);
                summary.UniqueSymbols = apiCalls
                    .Where(x => !string.IsNullOrEmpty(x.Parameters))
                    .SelectMany(x => ExtractSymbolsFromParameters(x.Parameters!))
                    .Distinct()
                    .Count();

                if (existingSummary == null)
                {
                    summary.CreatedAt = DateTime.UtcNow;
                    _context.DailyApiSummaries.Add(summary);
                }
                else
                {
                    summary.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate daily summary for date: {Date}", date);
            }
        }

        public async Task ResolveExceptionAsync(int exceptionId, string resolutionNotes)
        {
            try
            {
                var exception = await _context.ApiExceptions.FindAsync(exceptionId);
                if (exception != null)
                {
                    exception.IsResolved = true;
                    exception.ResolvedAt = DateTime.UtcNow;
                    exception.ResolutionNotes = resolutionNotes;

                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to resolve exception with ID: {ExceptionId}", exceptionId);
            }
        }

        public async Task<ApiCallLogStats> GetApiCallStatsAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.ApiCallLogs.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(x => x.Timestamp >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(x => x.Timestamp <= endDate.Value);

            var apiCalls = await query.ToListAsync();

            if (!apiCalls.Any())
            {
                return new ApiCallLogStats();
            }

            var totalCalls = apiCalls.Count;
            var successfulCalls = apiCalls.Count(x => x.IsSuccessful);
            var failedCalls = totalCalls - successfulCalls;
            var totalSymbolsProcessed = apiCalls.Sum(x => x.SymbolsRequested);
            var totalSymbolsSuccessful = apiCalls.Sum(x => x.SymbolsSuccessful);
            var totalSymbolsFailed = apiCalls.Sum(x => x.SymbolsFailed);

            return new ApiCallLogStats
            {
                TotalCalls = totalCalls,
                SuccessfulCalls = successfulCalls,
                FailedCalls = failedCalls,
                AverageResponseTime = apiCalls.Average(x => x.ResponseTimeMs),
                TotalSymbolsProcessed = totalSymbolsProcessed,
                TotalSymbolsSuccessful = totalSymbolsSuccessful,
                TotalSymbolsFailed = totalSymbolsFailed,
                SuccessRate = totalCalls > 0 ? (decimal)successfulCalls / totalCalls * 100 : 0,
                SymbolSuccessRate = totalSymbolsProcessed > 0 ? (decimal)totalSymbolsSuccessful / totalSymbolsProcessed * 100 : 0
            };
        }

        private static IEnumerable<string> ExtractSymbolsFromParameters(string parameters)
        {
            if (string.IsNullOrEmpty(parameters)) yield break;

            var symbols = new List<string>();
            try
            {
                if (parameters.Contains("symbol="))
                {
                    var symbolPart = parameters.Split('&')
                        .FirstOrDefault(p => p.StartsWith("symbol="));
                    if (symbolPart != null)
                    {
                        symbols.Add(symbolPart.Split('=')[1]);
                    }
                }

                if (parameters.Contains("symbols="))
                {
                    var symbolsPart = parameters.Split('&')
                        .FirstOrDefault(p => p.StartsWith("symbols="));
                    if (symbolsPart != null)
                    {
                        var symbolsList = symbolsPart.Split('=')[1].Split(',');
                        symbols.AddRange(symbolsList);
                    }
                }
            }
            catch
            {
                // If parsing fails, return empty list
            }

            foreach (var symbol in symbols.Where(s => !string.IsNullOrWhiteSpace(s)))
            {
                yield return symbol.Trim().ToUpper();
            }
        }
    }
}