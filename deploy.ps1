#!/usr/bin/env powershell

# Stock Intelligence Platform - Deployment Script
# This script will deploy the frontend and backend

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Stock Intelligence Platform - Deployment" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if already logged in
Write-Host "Checking Firebase authentication..." -ForegroundColor Yellow
$loginCheck = & firebase projects:list 2>&1

if ($loginCheck -match "Error" -or $loginCheck -match "Failed") {
    Write-Host "You need to login to Firebase" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Running: firebase login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "A browser window will open. Sign in with:" -ForegroundColor Green
    Write-Host "Email: officialayush292006@gmail.com" -ForegroundColor Green
    Write-Host ""
    Write-Host "After signing in, return to this terminal." -ForegroundColor Green
    Write-Host ""
    Read-Host "Press Enter to open browser and login"
    
    firebase login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Login failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✓ Firebase authentication successful!" -ForegroundColor Green
Write-Host ""

# Check build exists
Write-Host "Checking frontend build..." -ForegroundColor Yellow
if (-Not (Test-Path "frontend/dist/index.html")) {
    Write-Host "Frontend build not found. Building..." -ForegroundColor Yellow
    cd frontend
    npm run build
    cd ..
}
Write-Host "✓ Frontend build exists" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "Deploying to Firebase Hosting..." -ForegroundColor Cyan
Write-Host ""
firebase deploy --only hosting -m "Stock Intelligence Platform - Phase 2 Complete"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host "✓ Frontend Deployed Successfully!" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Live at: https://datamind-71f46.web.app" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Deploy backend to Railway" -ForegroundColor Cyan
    Write-Host "Go to: https://railway.app/dashboard" -ForegroundColor Cyan
    Write-Host "Click 'Redeploy Latest' on backend service" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Deployment failed" -ForegroundColor Red
    exit 1
}

