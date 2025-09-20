# Trading Vision Analytics - Service Startup Script
# This script starts all services in the correct order

Write-Host "Starting Trading Vision Analytics Services..." -ForegroundColor Green

# Start Next.js Frontend
Write-Host "Starting Next.js Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\MyData\Documents\Code\Trade Vision Analytics'; npm run dev"

# Wait a moment for Next.js to start
Start-Sleep -Seconds 3

# Start C# API
Write-Host "Starting C# API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\MyData\Documents\Code\Trade Vision Analytics\backend\TradingVisionAnalytics.API'; dotnet run --urls 'http://localhost:5000'"

# Wait a moment for C# API to start
Start-Sleep -Seconds 3

# Start Python API
Write-Host "Starting Python API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\MyData\Documents\Code\Trade Vision Analytics\python-api'; python main.py"

Write-Host "All services starting..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000 (or 3001 if 3000 is busy)" -ForegroundColor Cyan
Write-Host "C# API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Python API: http://localhost:8001" -ForegroundColor Cyan
Write-Host "Hangfire Dashboard: http://localhost:5000/hangfire" -ForegroundColor Cyan

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

