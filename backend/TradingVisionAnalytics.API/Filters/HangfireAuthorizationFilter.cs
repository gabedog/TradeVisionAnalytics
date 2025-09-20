using Hangfire.Dashboard;

namespace TradingVisionAnalytics.API.Filters
{
    public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            // For development, allow all access
            // In production, you should implement proper authentication
            return true;
        }
    }
}
