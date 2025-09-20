using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradingVisionAnalytics.API.Models
{
    [Table("TrackedSymbols")]
    public class TrackedSymbol
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string Symbol { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // STOCK, ETF

        [Required]
        public DateTime AddedDate { get; set; }

        public DateTime? LastUpdated { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "ACTIVE"; // ACTIVE, INACTIVE, ERROR

        [Required]
        public DateTime HistoricalDataStart { get; set; } = new DateTime(2020, 1, 1);

        public DateTime? HistoricalDataEnd { get; set; }

        public int DataPoints { get; set; } = 0;

        [StringLength(4000)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? Sector { get; set; }

        [StringLength(100)]
        public string? Industry { get; set; }

        // Navigation properties
        public virtual ICollection<DailyQuote> DailyQuotes { get; set; } = new List<DailyQuote>();
    }
}
