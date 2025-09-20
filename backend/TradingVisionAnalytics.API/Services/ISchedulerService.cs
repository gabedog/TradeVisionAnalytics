using System;

namespace TradingVisionAnalytics.API.Services
{
    public interface ISchedulerService
    {
        void ScheduleDailyQuotesCollection();
        void ScheduleEtfHoldingsUpdate();
        void ScheduleMarketBreadthCalculation();
        void ScheduleFmpApiRateLimit();
        void EnqueueDataProcessing(string symbol, string dataType);
    }
}
