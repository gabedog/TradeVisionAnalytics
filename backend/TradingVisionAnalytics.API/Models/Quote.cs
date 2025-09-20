using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradingVisionAnalytics.API.Models
{
    [Table("Quotes")]
    public class Quote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string Symbol { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,4)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Change { get; set; }

        [Column(TypeName = "decimal(8,4)")]
        public decimal ChangePercent { get; set; }

        public long Volume { get; set; }

        [Column(TypeName = "decimal(20,2)")]
        public decimal? MarketCap { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? AvgPrice50Day { get; set; }

        [MaxLength(20)]
        public string? Exchange { get; set; }

        public DateTime LastUpdated { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}