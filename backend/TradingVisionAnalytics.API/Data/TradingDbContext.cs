using Microsoft.EntityFrameworkCore;
using TradingVisionAnalytics.API.Models;

namespace TradingVisionAnalytics.API.Data
{
    public class TradingDbContext : DbContext
    {
        public TradingDbContext(DbContextOptions<TradingDbContext> options) : base(options)
        {
        }

        public DbSet<TrackedSymbol> TrackedSymbols { get; set; }
        public DbSet<DailyQuote> DailyQuotes { get; set; }
        public DbSet<ETFHolding> ETFHoldings { get; set; }
        public DbSet<ApiCallLog> ApiCallLogs { get; set; }
        public DbSet<ApiException> ApiExceptions { get; set; }
        public DbSet<DailyApiSummary> DailyApiSummaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure TrackedSymbol
            modelBuilder.Entity<TrackedSymbol>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Symbol).IsUnique();
                entity.Property(e => e.Symbol).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.HistoricalDataStart).IsRequired();
            });

            // Configure DailyQuote
            modelBuilder.Entity<DailyQuote>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.TrackedSymbolId, e.Date }).IsUnique();
                entity.Property(e => e.Open).HasColumnType("decimal(18,4)");
                entity.Property(e => e.High).HasColumnType("decimal(18,4)");
                entity.Property(e => e.Low).HasColumnType("decimal(18,4)");
                entity.Property(e => e.Close).HasColumnType("decimal(18,4)");
                entity.Property(e => e.AdjustedClose).HasColumnType("decimal(18,4)");
                entity.Property(e => e.Change).HasColumnType("decimal(18,4)");
                entity.Property(e => e.ChangePercent).HasColumnType("decimal(18,4)");
            });

            // Configure ETFHolding
            modelBuilder.Entity<ETFHolding>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.ETFSymbolId, e.HoldingSymbolId }).IsUnique();
                entity.Property(e => e.Weight).HasColumnType("decimal(18,6)");
                entity.Property(e => e.MarketValue).HasColumnType("decimal(18,2)");
            });

            // Configure relationships
            modelBuilder.Entity<TrackedSymbol>()
                .HasMany(e => e.DailyQuotes)
                .WithOne(e => e.TrackedSymbol)
                .HasForeignKey(e => e.TrackedSymbolId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ETF relationships - ignore navigation properties to avoid conflicts
            modelBuilder.Entity<ETFHolding>(entity =>
            {
                entity.HasOne(e => e.ETFSymbol)
                    .WithMany()
                    .HasForeignKey(e => e.ETFSymbolId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.HoldingSymbol)
                    .WithMany()
                    .HasForeignKey(e => e.HoldingSymbolId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure ApiCallLog
            modelBuilder.Entity<ApiCallLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => new { e.Endpoint, e.Timestamp });
                entity.Property(e => e.Endpoint).IsRequired().HasMaxLength(200);
                entity.Property(e => e.HttpMethod).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Parameters).HasMaxLength(1000);
                entity.Property(e => e.RequestId).HasMaxLength(50);
                entity.Property(e => e.ErrorMessage).HasMaxLength(500);
            });

            // Configure ApiException
            modelBuilder.Entity<ApiException>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => new { e.Source, e.Severity });
                entity.Property(e => e.Source).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ExceptionType).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Message).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Severity).IsRequired().HasMaxLength(20);
                entity.Property(e => e.RequestId).HasMaxLength(50);
                entity.Property(e => e.ResolutionNotes).HasMaxLength(500);
                entity.Property(e => e.AdditionalContext).HasMaxLength(200);
            });

            // Configure DailyApiSummary
            modelBuilder.Entity<DailyApiSummary>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Date).IsUnique();
                entity.Property(e => e.Date).IsRequired();
            });
        }
    }
}