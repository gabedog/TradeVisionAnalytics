using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace TradingVisionAnalytics.API.Services
{
    public class StartupService : IHostedService
    {
        private readonly ISchedulerService _schedulerService;
        private readonly ILoggingService _loggingService;
        private readonly ILogger<StartupService> _logger;

        public StartupService(ISchedulerService schedulerService, ILoggingService loggingService, ILogger<StartupService> logger)
        {
            _schedulerService = schedulerService;
            _loggingService = loggingService;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Starting Trading Vision Analytics scheduler...");
                _loggingService.LogInfo("Application startup - initializing scheduler");

                // Schedule all recurring jobs
                _schedulerService.ScheduleDailyQuotesCollection();
                _schedulerService.ScheduleEtfHoldingsUpdate();
                _schedulerService.ScheduleMarketBreadthCalculation();
                _schedulerService.ScheduleFmpApiRateLimit();

                _logger.LogInformation("All scheduled jobs initialized successfully");
                _loggingService.LogInfo("All scheduled jobs initialized successfully");

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize scheduler");
                _loggingService.LogException(ex, "StartupService.StartAsync");
                throw;
            }
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Stopping Trading Vision Analytics scheduler...");
                _loggingService.LogInfo("Application shutdown - stopping scheduler");

                // Hangfire will handle job cleanup automatically
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during scheduler shutdown");
                _loggingService.LogException(ex, "StartupService.StopAsync");
            }
        }
    }
}
