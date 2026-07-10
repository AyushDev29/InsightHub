@echo off
echo ================================================
echo  InsightHub AI - Backend Startup Script
echo ================================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt --quiet
echo.

REM Create logs directory
if not exist "logs\" mkdir logs

REM Start the server
echo ================================================
echo  Starting InsightHub AI Backend...
echo ================================================
echo.
echo Server will start at: http://localhost:8000
echo API Docs: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload
