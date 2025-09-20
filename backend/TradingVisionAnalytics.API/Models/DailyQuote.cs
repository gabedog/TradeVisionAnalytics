using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradingVisionAnalytics.API.Models
{
    [Table("DailyQuotes")]
    public class DailyQuote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TrackedSymbolId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,4)")]
        public decimal Open { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,4)")]
        public decimal High { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,4)")]
        public decimal Low { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,4)")]
        public decimal Close { get; set; }

        [Required]
        public long Volume { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? AdjustedClose { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? Change { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? ChangePercent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("TrackedSymbolId")]
        public virtual TrackedSymbol TrackedSymbol { get; set; } = null!;
    }
}