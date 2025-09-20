namespace TradingVisionAnalytics.API.Configuration
{
    public class FmpApiSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = "https://financialmodelingprep.com/api/v3";
    }
}
