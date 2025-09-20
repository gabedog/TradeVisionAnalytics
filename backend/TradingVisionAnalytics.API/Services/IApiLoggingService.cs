using TradingVisionAnalytics.API.Models;

namespace TradingVisionAnalytics.API.Services
{
    public interface IApiLoggingService
    {
        Task LogApiCallAsync(string endpoint, string httpMethod, string? parameters = null,
            int statusCode = 0, int responseTimeMs = 0, int symbolsRequested = 0,
            int symbolsSuccessful = 0, int symbolsFailed = 0, string? requestId = null,
            string? errorMessage = null);

        Task LogExceptionAsync(string source, Exception exception, string? requestId = null,
            string severity = ExceptionSeverity.Medium, string? additionalContext = null);

        Task LogExceptionAsync(string source, string exceptionType, string message,
            string? stackTrace = null, string? requestId = null,
            string severity = ExceptionSeverity.Medium, string? additionalContext = null);

        Task<IEnumerable<ApiCallLog>> GetRecentApiCallsAsync(int limit = 100, int offset = 0);

        Task<IEnumerable<ApiException>> GetRecentExceptionsAsync(int limit = 100, int offset = 0,
            string? severity = null, bool? isResolved = null);

        Task<DailyApiSummary?> GetDailySummaryAsync(DateOnly date);

        Task<IEnumerable<DailyApiSummary>> GetDailySummariesAsync(DateOnly startDate, DateOnly endDate);

        Task GenerateDailySummaryAsync(DateOnly date);

        Task ResolveExceptionAsync(int exceptionId, string resolutionNotes);

        Task<ApiCallLogStats> GetApiCallStatsAsync(DateTime? startDate = null, DateTime? endDate = null);
    }

    public class ApiCallLogStats
    {
        public int TotalCalls { get; set; }
        public int SuccessfulCalls { get; set; }
        public int FailedCalls { get; set; }
        public double AverageResponseTime { get; set; }
        public int TotalSymbolsProcessed { get; set; }
        public int TotalSymbolsSuccessful { get; set; }
        public int TotalSymbolsFailed { get; set; }
        public decimal SuccessRate { get; set; }
        public decimal SymbolSuccessRate { get; set; }
    }
}