using Microsoft.EntityFrameworkCore;
using TradingVisionAnalytics.API.Controllers;
using TradingVisionAnalytics.API.Data;
using TradingVisionAnalytics.API.Services;
using TradingVisionAnalytics.API.Configuration;
using TradingVisionAnalytics.API.Filters;
using Hangfire;
using Hangfire.SqlServer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<TradingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

// Add custom services
builder.Services.AddScoped<ILoggingService, LoggingService>();
builder.Services.AddScoped<IApiLoggingService, ApiLoggingService>();
builder.Services.AddScoped<IFmpApiService, FmpApiService>();
builder.Services.AddScoped<ISchedulerService, SchedulerService>();
builder.Services.AddHttpClient<IFmpApiService, FmpApiService>();

// Configure HttpClient for FMP API
builder.Services.AddHttpClient<FmpApiService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "TradingVisionAnalytics/1.0");
});
// Remove StartupService for now - we'll initialize jobs manually
// builder.Services.AddHostedService<StartupService>();

// Add configuration
builder.Services.Configure<FmpApiSettings>(builder.Configuration.GetSection("FMP"));

// Add Hangfire
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection") ?? 
        "Server=localhost;Database=TVA;User Id=sa;Password=MJMS0ft;TrustServerCertificate=true;"));

builder.Services.AddHangfireServer();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowNextJS");

app.UseAuthorization();

// Add Hangfire Dashboard
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireAuthorizationFilter() }
});

app.MapControllers();

app.Run();
