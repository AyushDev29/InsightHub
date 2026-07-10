# InsightHub AI - Complete Folder Structure

## Complete Project Tree

```
InsightHub-AI/
│
├── .github/                          # GitHub configuration
│   ├── workflows/                    # CI/CD workflows
│   │   ├── backend-tests.yml
│   │   ├── frontend-tests.yml
│   │   └── deploy.yml
│   └── ISSUE_TEMPLATE/               # Issue templates
│
├── frontend/                         # React frontend application
│   ├── public/                       # Static files
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── assets/                   # Static assets
│   │   │   ├── icons/                # SVG icons
│   │   │   └── images/               # Images
│   │   ├── components/               # React components
│   │   │   ├── common/               # Reusable components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   └── Badge.tsx
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── PageContainer.tsx
│   │   │   └── weather/              # Weather-specific components
│   │   │       ├── WeatherCard.tsx
│   │   │       ├── MetricCard.tsx
│   │   │       ├── StatCard.tsx
│   │   │       ├── ForecastCard.tsx
│   │   │       ├── AQICard.tsx
│   │   │       ├── ChartContainer.tsx
│   │   │       └── MapContainer.tsx
│   │   ├── contexts/                 # React contexts
│   │   │   ├── ThemeContext.tsx
│   │   │   └── LocationContext.tsx
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useWeather.ts
│   │   │   ├── useForecast.ts
│   │   │   ├── useAQI.ts
│   │   │   ├── useLocation.ts
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   └── weather/
│   │   │       ├── CurrentWeather.tsx
│   │   │       ├── HourlyForecast.tsx
│   │   │       ├── DailyForecast.tsx
│   │   │       ├── HistoricalWeather.tsx
│   │   │       ├── AirQuality.tsx
│   │   │       ├── CitySearch.tsx
│   │   │       ├── WeatherMaps.tsx
│   │   │       └── WeatherAnalytics.tsx
│   │   ├── services/                 # API service layer
│   │   │   ├── api.ts                # Axios configuration
│   │   │   ├── weather.service.ts
│   │   │   ├── forecast.service.ts
│   │   │   ├── aqi.service.ts
│   │   │   ├── location.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── styles/                   # Global styles
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   ├── types/                    # TypeScript definitions
│   │   │   ├── index.ts
│   │   │   ├── weather.types.ts
│   │   │   ├── forecast.types.ts
│   │   │   ├── aqi.types.ts
│   │   │   └── location.types.ts
│   │   ├── utils/                    # Utility functions
│   │   │   ├── formatters.ts
│   │   │   ├── converters.ts
│   │   │   ├── validators.ts
│   │   │   ├── weather-codes.ts
│   │   │   └── colors.ts
│   │   ├── App.tsx                   # Root component
│   │   ├── main.tsx                  # Entry point
│   │   ├── router.tsx                # React Router config
│   │   └── vite-env.d.ts             # Vite types
│   ├── .env.example                  # Environment template
│   ├── .eslintrc.json                # ESLint config
│   ├── .prettierrc                   # Prettier config
│   ├── index.html                    # HTML entry
│   ├── package.json                  # Dependencies
│   ├── postcss.config.js             # PostCSS config
│   ├── tailwind.config.js            # Tailwind config
│   ├── tsconfig.json                 # TypeScript config
│   └── vite.config.ts                # Vite config
│
├── backend/                          # FastAPI backend application
│   ├── alembic/                      # Database migrations
│   │   ├── versions/                 # Migration files
│   │   │   ├── 001_initial_schema.py
│   │   │   ├── 002_add_indexes.py
│   │   │   └── 003_add_partitions.py
│   │   ├── env.py                    # Alembic environment
│   │   ├── script.py.mako            # Migration template
│   │   └── alembic.ini               # Alembic config
│   ├── app/
│   │   ├── api/                      # API routes
│   │   │   ├── __init__.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── api.py            # Router aggregation
│   │   │       └── endpoints/        # Route handlers
│   │   │           ├── __init__.py
│   │   │           ├── health.py
│   │   │           ├── weather.py
│   │   │           ├── forecast.py
│   │   │           ├── aqi.py
│   │   │           ├── locations.py
│   │   │           └── analytics.py
│   │   ├── core/                     # Core configuration
│   │   │   ├── __init__.py
│   │   │   ├── config.py             # Settings ✅
│   │   │   ├── logging.py            # Logging setup ✅
│   │   │   ├── security.py           # Security utilities
│   │   │   └── constants.py          # Constants
│   │   ├── db/                       # Database
│   │   │   ├── __init__.py
│   │   │   ├── database.py           # Database connection
│   │   │   ├── session.py            # Session management
│   │   │   └── base.py               # Base model
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── location.py
│   │   │   ├── weather.py
│   │   │   ├── forecast.py
│   │   │   ├── aqi.py
│   │   │   └── logs.py
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── common.py
│   │   │   ├── location.py
│   │   │   ├── weather.py
│   │   │   ├── forecast.py
│   │   │   ├── aqi.py
│   │   │   ├── analytics.py
│   │   │   └── response.py
│   │   ├── services/                 # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── weather_service.py
│   │   │   ├── forecast_service.py
│   │   │   ├── aqi_service.py
│   │   │   ├── location_service.py
│   │   │   └── analytics_service.py
│   │   ├── repositories/             # Data access layer
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── location_repository.py
│   │   │   ├── weather_repository.py
│   │   │   ├── forecast_repository.py
│   │   │   └── aqi_repository.py
│   │   ├── utils/                    # Utilities
│   │   │   ├── __init__.py
│   │   │   ├── http_client.py        # HTTP client wrapper
│   │   │   ├── validators.py         # Custom validators
│   │   │   ├── formatters.py         # Data formatters
│   │   │   └── exceptions.py         # Custom exceptions
│   │   ├── middleware/               # Middleware
│   │   │   ├── __init__.py
│   │   │   ├── error_handler.py
│   │   │   ├── logging.py
│   │   │   └── rate_limiter.py
│   │   ├── __init__.py
│   │   └── main.py                   # FastAPI app ✅
│   ├── tests/                        # Tests
│   │   ├── __init__.py
│   │   ├── conftest.py               # Test fixtures
│   │   ├── test_services/
│   │   ├── test_repositories/
│   │   └── test_api/
│   ├── .env.example                  # Environment template ✅
│   ├── requirements.txt              # Python dependencies ✅
│   ├── Dockerfile                    # Docker image
│   └── pytest.ini                    # Pytest config
│
├── scheduler/                        # APScheduler jobs
│   ├── jobs/                         # Job definitions
│   │   ├── __init__.py
│   │   ├── weather_job.py            # Fetch weather data
│   │   ├── aqi_job.py                # Fetch AQI data
│   │   ├── forecast_job.py           # Update forecasts
│   │   └── cleanup_job.py            # Database cleanup
│   ├── utils/                        # Scheduler utilities
│   │   ├── __init__.py
│   │   ├── job_logger.py             # Job logging
│   │   └── retry_handler.py          # Retry logic
│   ├── scheduler.py                  # Main scheduler
│   └── config.py                     # Scheduler config
│
├── analytics/                        # Analytics processing
│   ├── processors/                   # Data processors
│   │   ├── __init__.py
│   │   ├── temperature_processor.py
│   │   ├── precipitation_processor.py
│   │   ├── wind_processor.py
│   │   ├── pressure_processor.py
│   │   └── humidity_processor.py
│   ├── aggregators/                  # Data aggregators
│   │   ├── __init__.py
│   │   ├── daily_aggregator.py
│   │   ├── weekly_aggregator.py
│   │   ├── monthly_aggregator.py
│   │   └── custom_aggregator.py
│   └── __init__.py
│
├── database/                         # Database scripts
│   ├── migrations/                   # SQL migrations
│   │   └── README.md
│   ├── seeds/                        # Seed data
│   │   ├── locations.sql
│   │   └── sample_data.sql
│   └── schema.sql                    # Complete schema
│
├── ml/                               # Machine learning (Future)
│   ├── models/                       # ML models
│   ├── notebooks/                    # Jupyter notebooks
│   ├── training/                     # Training scripts
│   └── inference/                    # Inference scripts
│
├── docs/                             # Documentation ✅
│   ├── 00-PROJECT-SUMMARY.md         # Project overview ✅
│   ├── 01-PRD.md                     # Product requirements ✅
│   ├── 02-System-Architecture.md     # Technical architecture ✅
│   ├── 03-Database-Design.md         # Database schema ✅
│   ├── 04-API-Research.md            # API documentation
│   ├── 05-Frontend-Design.md         # UI/UX design
│   ├── 06-Backend-Design.md          # Backend architecture
│   ├── 07-ML-Pipeline.md             # ML pipeline (future)
│   ├── 08-Deployment.md              # Deployment guide
│   ├── 09-Roadmap.md                 # Product roadmap
│   ├── 10-Meeting-Notes.md           # Meeting notes
│   ├── FOLDER_STRUCTURE.md           # This file ✅
│   └── IMPLEMENTATION_PLAN.md        # Implementation plan ✅
│
├── apis/                             # API research ✅
│   ├── Weather/                      # Weather API
│   │   ├── README.md
│   │   ├── Sample Response.json
│   │   └── API Notes.md
│   ├── AQI/                          # Air Quality API
│   │   ├── README.md
│   │   ├── Sample Response.json
│   │   └── API Notes.md
│   ├── Crypto/                       # Crypto API (future)
│   │   ├── README.md
│   │   ├── Sample Response.json
│   │   └── API Notes.md
│   ├── Stocks/                       # Stocks API (future)
│   │   ├── README.md
│   │   ├── Sample Response.json
│   │   └── API Notes.md
│   ├── Exchange/                     # Currency API (future)
│   │   ├── README.md
│   │   ├── Sample Response.json
│   │   └── API Notes.md
│   ├── Economy/                      # Economy API (future)
│   │   ├── README.md
│   │   ├── Sample Response.json
│   │   └── API Notes.md
│   └── Earthquakes/                  # Earthquake API (future)
│       ├── README.md
│       ├── Sample Response.json
│       └── API Notes.md
│
├── assets/                           # Project assets ✅
│   ├── icons/                        # Icons
│   ├── images/                       # Images
│   └── logos/                        # Logos
│
├── scripts/                          # Utility scripts ✅
│   ├── setup.sh                      # Initial setup
│   ├── seed_db.py                    # Database seeding
│   ├── backup_db.sh                  # Database backup
│   └── deploy.sh                     # Deployment
│
├── tests/                            # Integration tests ✅
│   ├── integration/                  # Integration tests
│   ├── e2e/                          # End-to-end tests
│   └── performance/                  # Performance tests
│
├── logs/                             # Application logs ✅
│   ├── app.log
│   ├── error.log
│   └── scheduler.log
│
├── config/                           # Configuration files ✅
│   ├── settings.py                   # App-wide settings ✅
│   ├── constants.py                  # Constants ✅
│   └── logging.py                    # Logging config ✅
│
├── shared/                           # Shared code ✅
│   └── README.md
│
├── data/                             # Data storage ✅
│   ├── raw/                          # Raw data
│   ├── processed/                    # Processed data
│   └── exports/                      # Data exports
│
├── notebooks/                        # Jupyter notebooks ✅
│   ├── exploration/                  # Data exploration
│   ├── analysis/                     # Data analysis
│   └── visualization/                # Data visualization
│
├── deployment/                       # Deployment configs
│   ├── kubernetes/                   # K8s manifests
│   ├── terraform/                    # Infrastructure as code
│   └── docker/                       # Docker configs
│
├── .env.example                      # Environment template ✅
├── .gitignore                        # Git ignore patterns ✅
├── docker-compose.yml                # Docker orchestration ✅
├── Dockerfile                        # Root Dockerfile
├── LICENSE                           # MIT License ✅
├── README.md                         # Project README ✅
├── CHANGELOG.md                      # Version history ✅
├── CONTRIBUTING.md                   # Contributing guide ✅
└── Makefile                          # Build commands
```

---

## Folder Purposes

### Frontend (`/frontend`)
React 19 + TypeScript + Vite application for the user interface.
- **Components**: Reusable UI components (common, layout, weather)
- **Pages**: Route-level page components
- **Services**: API communication layer
- **Hooks**: Custom React hooks for business logic
- **Types**: TypeScript type definitions
- **Utils**: Helper functions and utilities

### Backend (`/backend`)
FastAPI + Python 3.12 application for the API server.
- **API**: FastAPI routes organized by version
- **Core**: Configuration, logging, security
- **Models**: SQLAlchemy ORM models
- **Schemas**: Pydantic validation schemas
- **Services**: Business logic layer
- **Repositories**: Data access layer
- **Middleware**: Request/response middleware
- **Utils**: Helper functions

### Scheduler (`/scheduler`)
APScheduler jobs for automated data collection.
- **Jobs**: Scheduled job definitions
- **Utils**: Job logging and retry logic

### Analytics (`/analytics`)
Data processing and analytics layer.
- **Processors**: Transform and analyze specific data types
- **Aggregators**: Aggregate data over time periods

### Database (`/database`)
Database schemas, migrations, and seed data.
- **Migrations**: SQL migration scripts
- **Seeds**: Initial and sample data

### Documentation (`/docs`)
Comprehensive project documentation.
- Architecture, design, API docs, guides

### APIs (`/apis`)
External API research and documentation.
- Sample responses, API notes, integration guides

### Config (`/config`)
Shared configuration files.
- Application settings, constants, logging

### Assets (`/assets`)
Project assets (icons, images, logos).

### Scripts (`/scripts`)
Utility scripts for development and deployment.

### Tests (`/tests`)
Integration and E2E tests.

### Logs (`/logs`)
Application log files.

### Data (`/data`)
Data storage and exports.

### Notebooks (`/notebooks`)
Jupyter notebooks for analysis.

---

## File Count Summary

| Category | File Count |
|----------|------------|
| **Backend** | ~40 files |
| **Frontend** | ~60 files |
| **Scheduler** | ~10 files |
| **Analytics** | ~10 files |
| **Documentation** | ~15 files |
| **Configuration** | ~10 files |
| **Tests** | ~20 files |
| **Total** | **~165 files** |

---

## Status Legend

- ✅ **Created**: File/folder exists
- ⏳ **Planned**: Will be created
- 🔄 **In Progress**: Being developed

---

## Key Principles

1. **Feature-Based Organization**: Components grouped by feature
2. **Separation of Concerns**: Clear boundaries between layers
3. **Scalability**: Easy to add new features
4. **Maintainability**: Logical structure, easy to navigate
5. **Type Safety**: TypeScript + Python type hints throughout

---

**Last Updated**: July 10, 2026  
**Version**: 1.0
