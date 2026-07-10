# InsightHub AI ☁️

**Transforming Live Public Data into Actionable Intelligence**

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/yourusername/insighthub-ai)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.109-green.svg)](https://fastapi.tiangolo.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

InsightHub AI is a **production-ready SaaS analytics platform** that collects live weather data from public APIs, stores historical information, performs analytics, and visualizes trends through an intuitive dashboard.

This is **Phase 1: Weather Intelligence Module** - a foundation for a multi-source intelligence platform.

### What Makes This Different?

- ✅ **Production-Ready**: Not a student project - built with enterprise standards
- ✅ **Scalable Architecture**: Microservices-ready, clean separation of concerns
- ✅ **Real-Time Data**: Hourly updates from Open-Meteo APIs
- ✅ **Modern Stack**: React 19, FastAPI, PostgreSQL, TypeScript
- ✅ **Professional UI**: Inspired by Datadog, Grafana, and Linear
- ✅ **Comprehensive Analytics**: Historical trends, forecasts, and insights

---

## 🚀 Features

### Current (Phase 1)

#### Weather Intelligence
- **Current Weather**: Real-time conditions for any location
- **Hourly Forecast**: 48-hour detailed predictions
- **16-Day Forecast**: Extended weather outlook
- **Historical Data**: Access past weather with trend analysis
- **Air Quality**: AQI monitoring with pollutant breakdown
- **City Search**: Global location search with geocoding
- **Interactive Maps**: Visualize weather patterns geographically
- **Analytics Dashboard**: Temperature, precipitation, wind trends

#### Technical Features
- Automated data collection (hourly)
- RESTful API with OpenAPI documentation
- PostgreSQL database with optimized schema
- Responsive dark-theme UI
- Real-time charts and visualizations
- Error handling and retry logic
- Comprehensive logging

### Future Phases

- **Phase 2**: Cryptocurrency, Stocks, Economy, Earthquakes
- **Phase 3**: Machine Learning predictions
- **Phase 4**: User authentication, alerts, custom dashboards
- **Phase 5**: AI-powered insights and recommendations

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Maps**: Leaflet
- **Icons**: Lucide Icons
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI (Python 3.12)
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Validation**: Pydantic
- **Scheduler**: APScheduler
- **Server**: Uvicorn
- **HTTP Client**: Httpx

### Database
- **DBMS**: PostgreSQL 15+
- **Hosting**: Supabase (Managed PostgreSQL)

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Monitoring**: Application logs, health checks

---

## 📁 Project Structure

```
InsightHub-AI/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript definitions
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   └── public/             # Static assets
│
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/v1/         # API routes
│   │   │   └── endpoints/  # Route handlers
│   │   ├── core/           # Core config & utilities
│   │   ├── db/             # Database configuration
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access layer
│   │   ├── utils/          # Utilities
│   │   └── middleware/     # Middleware
│   ├── alembic/            # Database migrations
│   └── tests/              # Backend tests
│
├── scheduler/               # APScheduler jobs
│   ├── jobs/               # Job definitions
│   └── utils/              # Scheduler utilities
│
├── analytics/               # Analytics processing
│   ├── processors/         # Data processors
│   └── aggregators/        # Data aggregators
│
├── database/                # Database scripts
│   ├── migrations/         # SQL migrations
│   └── seeds/              # Seed data
│
├── docs/                    # Documentation
│   ├── 01-PRD.md
│   ├── 02-System-Architecture.md
│   ├── 03-Database-Design.md
│   └── ...
│
├── apis/                    # API research & samples
│   ├── Weather/
│   ├── AQI/
│   └── ...
│
├── scripts/                 # Utility scripts
├── tests/                   # Integration tests
├── logs/                    # Application logs
├── config/                  # Configuration files
├── .github/                 # GitHub workflows
│
├── docker-compose.yml       # Docker orchestration
├── .env.example             # Environment template
└── README.md                # This file
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** 20+ and npm/yarn
- **Python** 3.12+
- **PostgreSQL** 15+ (or Supabase account)
- **Docker** (optional, for containerized development)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/insighthub-ai.git
cd insighthub-ai
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env with your database credentials
# DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/insighthub

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`
- API Docs: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Copy environment template
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
# or
yarn dev
```

Frontend will be available at `http://localhost:3000`

#### 4. Scheduler Setup (Optional)

```bash
cd scheduler

# Activate backend virtual environment (if not already activated)
# Install dependencies (shared with backend)
pip install -r ../backend/requirements.txt

# Run scheduler
python scheduler.py
```

---

## 🐳 Docker Setup

### Development with Docker Compose

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:8000/api/v1
Production: https://api.insighthub-ai.com/api/v1
```

### Endpoints

#### Weather

```http
GET /weather/current?location_id={uuid}
GET /weather/hourly?location_id={uuid}&hours=48
GET /weather/daily?location_id={uuid}&days=16
GET /weather/history?location_id={uuid}&start_date={date}&end_date={date}
```

#### Air Quality

```http
GET /aqi/current?location_id={uuid}
GET /aqi/history?location_id={uuid}&start_date={date}&end_date={date}
```

#### Locations

```http
GET /locations/search?query={city_name}
GET /locations/{location_id}
POST /locations
```

#### Analytics

```http
GET /analytics/temperature?location_id={uuid}&start_date={date}&end_date={date}
GET /analytics/precipitation?location_id={uuid}&start_date={date}&end_date={date}
GET /analytics/wind?location_id={uuid}&start_date={date}&end_date={date}
```

#### Health & Monitoring

```http
GET /health
GET /
```

### Interactive API Documentation

Visit `http://localhost:8000/api/docs` for Swagger UI with interactive testing.

---

## 💻 Development

### Code Style

**Backend (Python)**
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

**Frontend (TypeScript)**
```bash
# Format code
npm run format

# Lint
npm run lint

# Type check
npm run type-check
```

### Running Tests

**Backend**
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_weather_service.py
```

**Frontend**
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Database Migrations

```bash
# Create new migration
alembic revision -m "description"

# Auto-generate migration from models
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View current version
alembic current
```

---

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables:
   - `VITE_API_URL`: Your backend URL
4. Deploy

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Configure:
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add environment variables from `.env.example`
4. Deploy

### Database (Supabase)

1. Create a new Supabase project
2. Copy the connection string
3. Update `DATABASE_URL` in your backend environment
4. Run migrations: `alembic upgrade head`

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open-Meteo** for providing free weather API
- **FastAPI** community for excellent documentation
- **React** team for the amazing framework
- **Supabase** for managed PostgreSQL hosting

---

## 📧 Contact

- **Project Link**: [https://github.com/yourusername/insighthub-ai](https://github.com/yourusername/insighthub-ai)
- **Documentation**: [https://docs.insighthub-ai.com](https://docs.insighthub-ai.com)
- **Issues**: [https://github.com/yourusername/insighthub-ai/issues](https://github.com/yourusername/insighthub-ai/issues)

---

## 📊 Project Status

- ✅ Phase 1: Weather Module (In Development)
- ⏳ Phase 2: Multi-Source Intelligence (Planned)
- ⏳ Phase 3: Machine Learning (Planned)
- ⏳ Phase 4: User Features (Planned)

---

**Built with ❤️ for the data community**
