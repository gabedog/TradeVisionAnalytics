using System;
using Xunit;
using TradingVisionAnalytics.API.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace TradingVisionAnalytics.Tests
{
    public class QuotesControllerTests
    {
        private readonly ILogger<QuotesController> _logger;
        private readonly IConfiguration _configuration;

        public QuotesControllerTests()
        {
            // Create mock logger and configuration
            _logger = new Mock<ILogger<QuotesController>>().Object;
            _configuration = new Mock<IConfiguration>().Object;
        }

        [Fact]
        public void GetQuotes_ReturnsSuccess()
        {
            // Arrange
            var controller = new QuotesController(_logger, _configuration);

            // Act
            var result = controller.GetQuotes().Result;

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void GetQuote_WithValidSymbol_ReturnsSuccess()
        {
            // Arrange
            var controller = new QuotesController(_logger, _configuration);
            var symbol = "AAPL";

            // Act
            var result = controller.GetQuote(symbol).Result;

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void GetDailyQuotes_WithValidSymbol_ReturnsSuccess()
        {
            // Arrange
            var controller = new QuotesController(_logger, _configuration);
            var symbol = "AAPL";
            var days = 10;

            // Act
            var result = controller.GetDailyQuotes(symbol, days).Result;

            // Assert
            Assert.NotNull(result);
        }
    }

    public class ETFControllerTests
    {
        private readonly ILogger<ETFController> _logger;
        private readonly IConfiguration _configuration;

        public ETFControllerTests()
        {
            // Create mock logger and configuration
            _logger = new Mock<ILogger<ETFController>>().Object;
            _configuration = new Mock<IConfiguration>().Object;
        }

        [Fact]
        public void GetAvailableETFs_ReturnsSuccess()
        {
            // Arrange
            var controller = new ETFController(_logger, _configuration);

            // Act
            var result = controller.GetAvailableETFs().Result;

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void GetETFHoldings_WithQQQ_ReturnsSuccess()
        {
            // Arrange
            var controller = new ETFController(_logger, _configuration);
            var symbol = "QQQ";

            // Act
            var result = controller.GetETFHoldings(symbol).Result;

            // Assert
            Assert.NotNull(result);
        }
    }

    // Simple mock classes for testing
    public class Mock<T> where T : class
    {
        public T Object { get; } = (T)Activator.CreateInstance(typeof(T))!;
    }
}
