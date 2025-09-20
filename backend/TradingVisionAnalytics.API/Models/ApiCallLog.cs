using System.ComponentModel.DataAnnotations;

namespace TradingVisionAnalytics.API.Models
{
    public class ApiCallLog
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Endpoint { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string HttpMethod { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Parameters { get; set; }

        public int StatusCode { get; set; }

        public int ResponseTimeMs { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public int SymbolsRequested { get; set; }

        public int SymbolsSuccessful { get; set; }

        public int SymbolsFailed { get; set; }

        [MaxLength(50)]
        public string? RequestId { get; set; }

        [MaxLength(500)]
        public string? ErrorMessage { get; set; }

        public bool IsSuccessful => StatusCode >= 200 && StatusCode < 300;
    }
}