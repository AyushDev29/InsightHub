# ============================================================================
# Development Server Startup Script (Windows PowerShell)
# ============================================================================
# 
# Purpose: Clean up zombie processes and start backend + frontend fresh
# Usage: .\scripts\dev-clean.ps1
#
# What it does:
# 1. Kills any existing Node.js processes (frontend dev server)
# 2. Kills any existing Python uvicorn processes (backend server)
# 3. Waits for ports to be freed
# 4. Starts backend on port 8000
# 5. Starts frontend (will use 5173 or fallback to 5174/5175)
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       InsightHub AI - Development Server (Clean Start)         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Step 1: Kill existing processes
# ============================================================================

Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow

# Kill Node.js processes (Vite frontend)
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "  • Stopping Node.js (Vite dev server)..." -ForegroundColor Gray
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "    ✓ Stopped" -ForegroundColor Green
} else {
    Write-Host "  • No Node.js processes running" -ForegroundColor Gray
}

# Kill Python processes (uvicorn backend)
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*uvicorn*"
}
if ($pythonProcesses) {
    Write-Host "  • Stopping Python (uvicorn backend)..." -ForegroundColor Gray
    $pythonProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "    ✓ Stopped" -ForegroundColor Green
} else {
    Write-Host "  • No Python uvicorn processes running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "⏳ Waiting 2 seconds for ports to be freed..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# ============================================================================
# Step 2: Verify ports are free
# ============================================================================

Write-Host ""
Write-Host "🔍 Checking port availability..." -ForegroundColor Yellow

$ports = @(8000, 5173, 5174, 5175)
$portsInUse = @()

foreach ($port in $ports) {
    try {
        $result = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            $portsInUse += $port
            Write-Host "  ⚠ Port $port is still in use" -ForegroundColor Red
        } else {
            Write-Host "  ✓ Port $port is available" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ✓ Port $port is available" -ForegroundColor Green
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ ERROR: The following ports are still in use: $($portsInUse -join ', ')" -ForegroundColor Red
    Write-Host "   Try running this script again or manually kill the processes." -ForegroundColor Red
    exit 1
}

# ============================================================================
# Step 3: Start Backend
# ============================================================================

Write-Host ""
Write-Host "🚀 Starting backend server (port 8000)..." -ForegroundColor Cyan

$backendPath = Join-Path (Split-Path -Parent $PSScriptRoot) "backend"
$backendProcess = Start-Process `
    -FilePath "python" `
    -ArgumentList "-m uvicorn app.main:app --reload --port 8000" `
    -WorkingDirectory $backendPath `
    -NoNewWindow `
    -PassThru

Write-Host "  ✓ Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

# ============================================================================
# Step 4: Start Frontend
# ============================================================================

Write-Host ""
Write-Host "🚀 Starting frontend server (port 5173+)..." -ForegroundColor Cyan

$frontendPath = Join-Path (Split-Path -Parent $PSScriptRoot) "frontend"
Start-Process `
    -FilePath "npm" `
    -ArgumentList "run dev" `
    -WorkingDirectory $frontendPath `
    -NoNewWindow

Write-Host "  ✓ Frontend starting..." -ForegroundColor Green

# ============================================================================
# Step 5: Done
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✓ All systems started!                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access your app:" -ForegroundColor Cyan
Write-Host "  • Frontend:     http://localhost:5173 (or 5174 if port busy)" -ForegroundColor White
Write-Host "  • Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "  • API Docs:     http://localhost:8000/api/docs" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "  • Press Ctrl+C in terminal to stop both servers" -ForegroundColor Gray
Write-Host "  • Frontend will auto-reload on code changes" -ForegroundColor Gray
Write-Host "  • Backend will auto-reload on code changes" -ForegroundColor Gray
Write-Host ""

