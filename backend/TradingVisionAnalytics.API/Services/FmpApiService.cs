using System;
using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TradingVisionAnalytics.API.Models;
using System.Text.Json;

namespace TradingVisionAnalytics.API.Services
{
    public class FmpApiService : IFmpApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IApiLoggingService _apiLoggingService;
        private readonly ILogger<FmpApiService> _logger;
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly int _rateLimit;
        private readonly int _retryAttempts;

        public FmpApiService(HttpClient httpClient, IConfiguration configuration, IApiLoggingService apiLoggingService, ILogger<FmpApiService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _apiLoggingService = apiLoggingService;
            _logger = logger;
            _apiKey = _configuration["FMP:ApiKey"] ?? throw new InvalidOperationException("FMP API key not configured");
            _baseUrl = _configuration["FMP:BaseUrl"] ?? "https://financialmodelingprep.com/api/v3";
            _rateLimit = _configuration.GetValue<int>("FMP:RateLimit", 250);
            _retryAttempts = _configuration.GetValue<int>("FMP:RetryAttempts", 3);
        }

        public async Task<string> GetQuoteAsync(string symbol)
        {
            var endpoint = $"{_baseUrl}/quote/{symbol}?apikey={_apiKey}";
            var parameters = $"symbol={symbol}";
            return await CallFmpApiAsync(endpoint, "GET", parameters, 1, 0, 0, $"GetQuote-{symbol}");
        }

        public async Task<string> GetDailyQuotesAsync(string symbol, int days = 30)
        {
            var endpoint = $"{_baseUrl}/historical-price-full/{symbol}?timeseries={days}&apikey={_apiKey}";
            var parameters = $"symbol={symbol}&days={days}";
            return await CallFmpApiAsync(endpoint, "GET", parameters, 1, 0, 0, $"GetDailyQuotes-{symbol}");
        }

        public async Task<string> GetETFHoldings(string etfSymbol)
        {
            var endpoint = $"{_baseUrl}/etf-holder/{etfSymbol}?apikey={_apiKey}";
            var parameters = $"etf={etfSymbol}";
            return await CallFmpApiAsync(endpoint, "GET", parameters, 1, 0, 0, $"GetETFHoldings-{etfSymbol}");
        }

        public async Task<string> GetHistoricalData(string symbol, DateTime startDate, DateTime endDate)
        {
            var startDateStr = startDate.ToString("yyyy-MM-dd");
            var endDateStr = endDate.ToString("yyyy-MM-dd");
            var endpoint = $"{_baseUrl}/historical-price-full/{symbol}?from={startDateStr}&to={endDateStr}&apikey={_apiKey}";
            var parameters = $"symbol={symbol}&from={startDateStr}&to={endDateStr}";
            return await CallFmpApiAsync(endpoint, "GET", parameters, 1, 0, 0, $"GetHistoricalData-{symbol}");
        }

        public async Task<string> GetCompanyProfile(string symbol)
        {
            var endpoint = $"{_baseUrl}/profile/{symbol}?apikey={_apiKey}";
            var parameters = $"symbol={symbol}";
            return await CallFmpApiAsync(endpoint, "GET", parameters, 1, 0, 0, $"GetCompanyProfile-{symbol}");
        }

        public async Task<bool> ValidateSymbol(string symbol)
        {
            try
            {
                var profile = await GetCompanyProfile(symbol);
                var profileData = JsonSerializer.Deserialize<JsonElement[]>(profile);
                return profileData != null && profileData.Length > 0;
            }
            catch (Exception ex)
            {
                await _apiLoggingService.LogExceptionAsync("FmpApiService", ex,
                    requestId: $"ValidateSymbol-{symbol}",
                    severity: ExceptionSeverity.Low,
                    additionalContext: $"Symbol validation failed for {symbol}");
                return false;
            }
        }

        // Legacy method for backward compatibility
        public async Task<string> GetEtfHoldingsAsync(string symbol)
        {
            return await GetETFHoldings(symbol);
        }

        private async Task<string> CallFmpApiAsync(string endpoint, string httpMethod, string? parameters = null,
            int symbolsRequested = 1, int symbolsSuccessful = 0, int symbolsFailed = 0, string? requestId = null)
        {
            var stopwatch = Stopwatch.StartNew();
            var statusCode = 0;
            string? errorMessage = null;

            try
            {
                _logger.LogInformation("Starting FMP API call to {Endpoint}", endpoint);

                var response = await _httpClient.GetAsync(endpoint);
                statusCode = (int)response.StatusCode;
                stopwatch.Stop();

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    symbolsSuccessful = symbolsRequested; // Assume success if HTTP 200

                    // Log successful API call to database
                    await _apiLoggingService.LogApiCallAsync(
                        endpoint: endpoint,
                        httpMethod: httpMethod,
                        parameters: parameters,
                        statusCode: statusCode,
                        responseTimeMs: (int)stopwatch.ElapsedMilliseconds,
                        symbolsRequested: symbolsRequested,
                        symbolsSuccessful: symbolsSuccessful,
                        symbolsFailed: symbolsFailed,
                        requestId: requestId
                    );

                    _logger.LogInformation("FMP API call successful: {RequestId} - {Size} bytes in {Ms}ms",
                        requestId, content.Length, stopwatch.ElapsedMilliseconds);

                    return content;
                }
                else
                {
                    symbolsFailed = symbolsRequested;
                    errorMessage = $"HTTP {statusCode}: {response.ReasonPhrase}";

                    // Log failed API call to database
                    await _apiLoggingService.LogApiCallAsync(
                        endpoint: endpoint,
                        httpMethod: httpMethod,
                        parameters: parameters,
                        statusCode: statusCode,
                        responseTimeMs: (int)stopwatch.ElapsedMilliseconds,
                        symbolsRequested: symbolsRequested,
                        symbolsSuccessful: symbolsSuccessful,
                        symbolsFailed: symbolsFailed,
                        requestId: requestId,
                        errorMessage: errorMessage
                    );

                    _logger.LogWarning("FMP API call failed: {RequestId} - Status: {StatusCode}", requestId, statusCode);
                    throw new HttpRequestException($"FMP API call failed with status {statusCode}: {response.ReasonPhrase}");
                }
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                symbolsFailed = symbolsRequested;
                errorMessage = ex.Message;

                // Log exception to database
                await _apiLoggingService.LogExceptionAsync("FmpApiService", ex,
                    requestId: requestId,
                    severity: ExceptionSeverity.High,
                    additionalContext: $"FMP API call failed: {endpoint}");

                // Log failed API call to database
                await _apiLoggingService.LogApiCallAsync(
                    endpoint: endpoint,
                    httpMethod: httpMethod,
                    parameters: parameters,
                    statusCode: statusCode,
                    responseTimeMs: (int)stopwatch.ElapsedMilliseconds,
                    symbolsRequested: symbolsRequested,
                    symbolsSuccessful: symbolsSuccessful,
                    symbolsFailed: symbolsFailed,
                    requestId: requestId,
                    errorMessage: errorMessage
                );

                _logger.LogError(ex, "FMP API call exception: {RequestId}", requestId);
                throw;
            }
        }
    }
}
