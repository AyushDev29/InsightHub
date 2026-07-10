@echo off
echo.
echo ========================================
echo   Supabase PostgreSQL Setup
echo ========================================
echo.

cd /d "%~dp0\.."

echo Step 1: Installing PostgreSQL drivers...
echo.
pip install asyncpg==0.30.0 psycopg2-binary==2.9.10
echo.

echo Step 2: Testing database connection...
echo.
python scripts\test_connection.py
if errorlevel 1 (
    echo.
    echo Connection test failed! Please check your DATABASE_URL in .env
    pause
    exit /b 1
)
echo.

echo Step 3: Running database migrations...
echo.
alembic upgrade head
if errorlevel 1 (
    echo.
    echo Migration failed!
    pause
    exit /b 1
)
echo.

echo Step 4: Seeding Indian cities...
echo.
python scripts\seed_cities.py
echo.

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Your database is ready with:
echo   - 8 tables created
echo   - 7 Indian cities seeded
echo.
echo Next: Start the server
echo   uvicorn app.main:app --reload
echo.
pause
