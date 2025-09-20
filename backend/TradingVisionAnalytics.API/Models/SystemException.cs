using System.ComponentModel.DataAnnotations;

namespace TradingVisionAnalytics.API.Models
{
    public class ApiException
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Source { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string ExceptionType { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;

        public string? StackTrace { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(20)]
        public string Severity { get; set; } = "Medium";

        public bool IsResolved { get; set; } = false;

        public DateTime? ResolvedAt { get; set; }

        [MaxLength(500)]
        public string? ResolutionNotes { get; set; }

        [MaxLength(50)]
        public string? RequestId { get; set; }

        [MaxLength(200)]
        public string? AdditionalContext { get; set; }
    }

    public static class ExceptionSeverity
    {
        public const string Critical = "Critical";
        public const string High = "High";
        public const string Medium = "Medium";
        public const string Low = "Low";
    }
}