using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradingVisionAnalytics.API.Models
{
    [Table("ETFHoldings")]
    public class ETFHolding
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ETFSymbolId { get; set; } // The ETF being tracked

        [Required]
        public int HoldingSymbolId { get; set; } // The individual stock held by the ETF

        [Required]
        [Column(TypeName = "decimal(18,6)")]
        public decimal Weight { get; set; } // Percentage weight in the ETF

        [Required]
        public long Shares { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MarketValue { get; set; }

        [Required]
        public bool IsTracked { get; set; } = true; // Whether we track this individual holding

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ETFSymbolId")]
        public virtual TrackedSymbol ETFSymbol { get; set; } = null!;

        [ForeignKey("HoldingSymbolId")]
        public virtual TrackedSymbol HoldingSymbol { get; set; } = null!;
    }
}
