@echo off
echo Starting Trading Vision Analytics Services...

echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "cd /d C:\MyData\Documents\Code\Trade Vision Analytics && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting C# API...
start "C# API" cmd /k "cd /d C:\MyData\Documents\Code\Trade Vision Analytics\backend\TradingVisionAnalytics.API && dotnet run --urls http://localhost:5000"

timeout /t 3 /nobreak >nul

echo Starting Python API...
start "Python API" cmd /k "cd /d C:\MyData\Documents\Code\Trade Vision Analytics\python-api && python main.py"

echo.
echo All services starting...
echo Frontend: http://localhost:3000 (or 3001 if 3000 is busy)
echo C# API: http://localhost:5000
echo Python API: http://localhost:8001
echo Hangfire Dashboard: http://localhost:5000/hangfire
echo.
pause

