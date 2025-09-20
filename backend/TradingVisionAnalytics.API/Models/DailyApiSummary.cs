using System.ComponentModel.DataAnnotations;

namespace TradingVisionAnalytics.API.Models
{
    public class DailyApiSummary
    {
        public int Id { get; set; }

        public DateOnly Date { get; set; }

        public int TotalCalls { get; set; }

        public int SuccessfulCalls { get; set; }

        public int FailedCalls { get; set; }

        public int UniqueSymbols { get; set; }

        public int AverageResponseTimeMs { get; set; }

        public int TotalSymbolsProcessed { get; set; }

        public int TotalSymbolsSuccessful { get; set; }

        public int TotalSymbolsFailed { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public decimal SuccessRate => TotalCalls > 0 ? (decimal)SuccessfulCalls / TotalCalls * 100 : 0;

        public decimal SymbolSuccessRate => TotalSymbolsProcessed > 0 ? (decimal)TotalSymbolsSuccessful / TotalSymbolsProcessed * 100 : 0;
    }
}