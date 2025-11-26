# Modern Maids - Quick Start Script
# Kills existing processes and starts both servers

Write-Host "Stopping existing servers..." -ForegroundColor Yellow

# Kill processes on ports 3002 and 4002
$ports = @(3002, 4002)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        if ($conn.OwningProcess) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "   Killed process on port $port" -ForegroundColor Green
        }
    }
}

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Cyan

# Start backend server
Write-Host "   Starting backend (port 4002)..." -ForegroundColor Yellow
$serverPath = Join-Path $PWD "server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverPath'; npm run dev" -WindowStyle Minimized

Start-Sleep -Seconds 2

# Start frontend server
Write-Host "   Starting frontend (port 3002)..." -ForegroundColor Yellow
$clientPath = Join-Path $PWD "client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientPath'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Servers starting in separate windows!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:4002" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3002" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 3-5 seconds, then open http://localhost:3002 in your browser" -ForegroundColor Yellow
