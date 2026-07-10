# InsightHub AI - Backend

FastAPI backend for InsightHub AI weather intelligence platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Setup Environment

```bash
# .env file is already created with development settings
# Edit if needed for PostgreSQL/Supabase connection
```

### 3. Run the Server

```bash
# Start development server
uvicorn app.main:app --reload

# Or using Python directly
python -m uvicorn app.main:app --reload
```

Server will start at: **http://localhost:8000**

### 4. Test the API

```bash
# In a new terminal, run the test script
python test_api.py
```

### 5. View API Documentation

Open your browser:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

---

## 📋 Available Endpoints

### Weather Endpoints

#### GET /api/v1/weather/current
Get current weather conditions

**Query Parameters:**
- `latitude` (float): Location latitude
- `longitude` (float): Location longitude

**Example:**
```bash
curl "http://localhost:8000/api/v1/weather/current?latitude=40.7128&longitude=-74.0060"
```

---

#### GET /api/v1/weather/hourly
Get hourly weather forecast (up to 168 hours)

**Query Parameters:**
- `latitude` (float): Location latitude
- `longitude` (float): Location longitude
- `hours` (int, optional): Number of hours (default: 48, max: 168)

**Example:**
```bash
curl "http://localhost:8000/api/v1/weather/hourly?latitude=40.7128&longitude=-74.0060&hours=24"
```

---

#### GET /api/v1/weather/daily
Get daily weather forecast (up to 16 days)

**Query Parameters:**
- `latitude` (float): Location latitude
- `longitude` (float): Location longitude
- `days` (int, optional): Number of days (default: 16, max: 16)

**Example:**
```bash
curl "http://localhost:8000/api/v1/weather/daily?latitude=40.7128&longitude=-74.0060&days=7"
```

---

#### GET /api/v1/weather/history
Get historical weather data

**Query Parameters:**
- `latitude` (float): Location latitude
- `longitude` (float): Location longitude
- `start_date` (date): Start date (YYYY-MM-DD)
- `end_date` (date): End date (YYYY-MM-DD)

**Example:**
```bash
curl "http://localhost:8000/api/v1/weather/history?latitude=40.7128&longitude=-74.0060&start_date=2024-01-01&end_date=2024-01-07"
```

---

#### GET /api/v1/weather/air-quality
Get air quality data (AQI and pollutants)

**Query Parameters:**
- `latitude` (float): Location latitude
- `longitude` (float): Location longitude

**Example:**
```bash
curl "http://localhost:8000/api/v1/weather/air-quality?latitude=40.7128&longitude=-74.0060"
```

---

#### GET /api/v1/weather/search
Search for locations by name

**Query Parameters:**
- `query` (string): Location name to search
- `count` (int, optional): Maximum results (default: 10, max: 100)

**Example:**
```bash
curl "http://localhost:8000/api/v1/weather/search?query=New%20York&count=5"
```

---

## 🗂️ Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   └── weather.py      # Weather endpoints
│   │       └── api.py              # API router
│   ├── core/
│   │   ├── config.py               # Configuration
│   │   └── logging.py              # Logging setup
│   ├── db/
│   │   ├── database.py             # Database connection
│   │   └── base.py                 # Base model
│   ├── models/
│   │   ├── location.py             # Location model
│   │   ├── weather.py              # Weather model
│   │   ├── forecast.py             # Forecast models
│   │   ├── aqi.py                  # Air quality model
│   │   └── logs.py                 # Logging models
│   ├── schemas/
│   │   ├── weather.py              # Weather schemas
│   │   ├── aqi.py                  # AQI schemas
│   │   └── location.py             # Location schemas
│   ├── services/
│   │   └── openmeteo_service.py    # Open-Meteo API service
│   └── main.py                     # FastAPI application
├── .env                            # Environment variables
├── requirements.txt                # Python dependencies
├── test_api.py                     # API test script
└── README.md                       # This file
```

---

## 🔧 Configuration

Edit `.env` file to configure:

```env
# Database - Currently using SQLite for quick testing
DATABASE_URL=sqlite+aiosqlite:///./insighthub.db

# For Production with PostgreSQL/Supabase:
# DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname
```

---

## 🧪 Testing

### Run Test Script
```bash
python test_api.py
```

### Manual Testing with curl

**Test Health:**
```bash
curl http://localhost:8000/health
```

**Test Current Weather (New York):**
```bash
curl "http://localhost:8000/api/v1/weather/current?latitude=40.7128&longitude=-74.0060"
```

---

## 🌍 Example Coordinates

| City | Latitude | Longitude |
|------|----------|-----------|
| New York | 40.7128 | -74.0060 |
| London | 51.5074 | -0.1278 |
| Tokyo | 35.6762 | 139.6503 |
| Mumbai | 19.0760 | 72.8777 |
| Delhi | 28.7041 | 77.1025 |
| Sydney | -33.8688 | 151.2093 |

---

## 📊 Database

Currently using **SQLite** for quick testing.

To switch to **PostgreSQL/Supabase**:

1. Update `.env`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/insighthub
```

2. Create database:
```sql
CREATE DATABASE insighthub;
```

3. Run migrations (future):
```bash
alembic upgrade head
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 8000 is already in use
# Windows:
netstat -ano | findstr :8000

# Kill the process using the port
taskkill /PID <PID> /F
```

### Module not found errors
```bash
# Make sure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Reinstall dependencies
pip install -r requirements.txt
```

### Database errors
```bash
# Delete the SQLite database and restart
del insighthub.db  # Windows
rm insighthub.db   # macOS/Linux

# Restart the server
uvicorn app.main:app --reload
```

---

## 📝 Development

### Adding New Endpoints

1. Create endpoint file in `app/api/v1/endpoints/`
2. Add router to `app/api/v1/api.py`
3. Create corresponding schemas in `app/schemas/`
4. Test with `test_api.py`

### Code Style

```bash
# Format code
black app/

# Sort imports
isort app/

# Lint
flake8 app/

# Type check
mypy app/
```

---

## 🚀 Next Steps

- [ ] Add database persistence (save API responses)
- [ ] Add repository layer
- [ ] Implement caching
- [ ] Add rate limiting
- [ ] Add authentication
- [ ] Deploy to Railway
- [ ] Add monitoring

---

## 📚 Documentation

- **API Docs**: http://localhost:8000/api/docs
- **Open-Meteo API**: https://open-meteo.com/
- **FastAPI Docs**: https://fastapi.tiangolo.com/

---

## ✅ Success Checklist

- [x] ✅ Server starts successfully
- [x] ✅ Health endpoint works
- [x] ✅ GET /weather/current works
- [x] ✅ GET /weather/hourly works
- [x] ✅ GET /weather/daily works
- [x] ✅ GET /weather/history works
- [x] ✅ GET /weather/air-quality works
- [x] ✅ GET /weather/search works

**If all above work, you have a strong backend foundation! 🎉**

---

**Last Updated**: July 10, 2026  
**Version**: 0.1.0
