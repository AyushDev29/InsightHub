cd 'c:\projects\data analust project\InsightHub-AI'

Write-Host "Stock Intelligence Platform Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Login
Write-Host "Step 1: Authenticating with Firebase..." -ForegroundColor Yellow
firebase login

Write-Host ""
Write-Host "Step 2: Deploying Frontend..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "Live at: https://datamind-71f46.web.app" -ForegroundColor Green
Write-Host "========================================"  -ForegroundColor Green
