using System.Threading.Tasks;

namespace TradingVisionAnalytics.API.Services
{
    public interface IFmpApiService
    {
        Task<string> GetQuoteAsync(string symbol);
        Task<string> GetDailyQuotesAsync(string symbol, int days = 30);
        Task<string> GetETFHoldings(string etfSymbol);
        Task<string> GetHistoricalData(string symbol, DateTime startDate, DateTime endDate);
        Task<string> GetCompanyProfile(string symbol);
        Task<bool> ValidateSymbol(string symbol);

        // Legacy methods for backward compatibility
        Task<string> GetEtfHoldingsAsync(string symbol);
    }
}
