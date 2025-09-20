using System;

namespace TradingVisionAnalytics.API.Services
{
    public interface ILoggingService
    {
        void LogApiCall(string endpoint, string symbol, int statusCode, long responseTimeMs, int? requestSize = null, int? responseSize = null);
        void LogException(Exception exception, string context, string? symbol = null);
        void LogInfo(string message, string? symbol = null);
        void LogWarning(string message, string? symbol = null);
        void LogError(string message, string? symbol = null);
    }
}
