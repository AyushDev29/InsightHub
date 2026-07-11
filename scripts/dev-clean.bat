@echo off
REM ============================================================================
REM Development Server Startup Script (Windows CMD)
REM ============================================================================
REM 
REM Purpose: Clean up zombie processes and start backend + frontend fresh
REM Usage: dev-clean.bat or double-click in Explorer
REM
REM What it does:
REM 1. Kills any existing Node.js processes (frontend dev server)
REM 2. Kills any existing Python uvicorn processes (backend server)
REM 3. Starts backend on port 8000
REM 4. Starts frontend (will use 5173 or fallback to 5174/5175)
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo ========================================================================
echo      InsightHub AI - Development Server (Clean Start)
echo ========================================================================
echo.

REM Change to project root
cd /d "%~dp0.."

REM ============================================================================
REM Step 1: Kill existing processes
REM ============================================================================

echo Cleaning up existing processes...

REM Kill Node.js processes
taskkill /IM node.exe /F >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Stopped Node.js processes
) else (
    echo   [OK] No Node.js processes running
)

REM Kill Python processes (uvicorn)
taskkill /IM python.exe /F >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Stopped Python processes
) else (
    echo   [OK] No Python processes running
)

echo.
echo Waiting 2 seconds for ports to be freed...
timeout /t 2 /nobreak >nul

REM ============================================================================
REM Step 2: Start Backend
REM ============================================================================

echo.
echo Starting backend server (port 8000)...
cd backend
start "InsightHub Backend" cmd /k python -m uvicorn app.main:app --reload --port 8000
cd ..

timeout /t 3 /nobreak >nul

REM ============================================================================
REM Step 3: Start Frontend
REM ============================================================================

echo.
echo Starting frontend server (port 5173+)...
cd frontend
start "InsightHub Frontend" cmd /k npm run dev
cd ..

REM ============================================================================
REM Step 4: Done
REM ============================================================================

echo.
echo ========================================================================
echo                    ✓ All systems started!
echo ========================================================================
echo.
echo Access your app:
echo   • Frontend:     http://localhost:5173 (or 5174 if port busy)
echo   • Backend API:  http://localhost:8000
echo   • API Docs:     http://localhost:8000/api/docs
echo.
echo Tips:
echo   • Close terminal windows to stop servers
echo   • Frontend will auto-reload on code changes
echo   • Backend will auto-reload on code changes
echo.
pause

