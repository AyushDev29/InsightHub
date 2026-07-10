# System Architecture
# InsightHub AI - Weather Intelligence Module

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [Data Flow](#data-flow)
4. [Technology Stack](#technology-stack)
5. [Deployment Architecture](#deployment-architecture)
6. [Security Architecture](#security-architecture)
7. [Scaling Strategy](#scaling-strategy)

---

## Architecture Overview

InsightHub AI follows a **modern microservices-inspired architecture** with clear separation of concerns, designed for scalability, maintainability, and future expansion.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   React 19 + TypeScript + Vite (Frontend SPA)            │  │
│  │   - Components  - Hooks  - Services  - State Management  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS/REST
┌─────────────────────────────────────────────────────────────────┐
│                          API GATEWAY                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   FastAPI Backend (Python 3.12)                          │  │
│  │   - Routing  - Validation  - Error Handling  - Logging   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Weather    │  │  Analytics   │  │  Scheduler   │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                     REPOSITORY LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   SQLAlchemy Repositories (Data Access Layer)            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   Supabase PostgreSQL Database                           │  │
│  │   - Models  - Migrations  - Indexing  - Relationships    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Weather │  │ Historical│  │   AQI    │  │Geocoding │       │
│  │   API    │  │    API    │  │   API    │  │   API    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│           Open-Meteo APIs (Free Tier)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## System Components

### 1. Frontend Layer

**Technology:** React 19 + TypeScript + Vite

**Responsibilities:**
- User interface rendering
- Client-side routing
- State management
- API communication
- Data visualization
- User interactions

**Key Patterns:**
- **Component-Based Architecture**: Reusable, composable UI components
- **Custom Hooks**: Encapsulated business logic
- **Service Layer**: Centralized API calls
- **Type Safety**: TypeScript for compile-time safety

**Folder Structure:**
```
frontend/src/
├── components/
│   ├── common/      # Reusable UI components
│   ├── weather/     # Weather-specific components
│   └── layout/      # Layout components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API service layer
├── types/           # TypeScript definitions
├── utils/           # Utility functions
├── contexts/        # React contexts
└── styles/          # Global styles
```

---

### 2. Backend Layer (FastAPI)

**Technology:** FastAPI + Python 3.12

**Responsibilities:**
- API endpoint management
- Request validation
- Business logic orchestration
- External API integration
- Data transformation
- Error handling
- Logging and monitoring

**Key Patterns:**
- **Router-Based Architecture**: Feature-based routing
- **Dependency Injection**: For database sessions, services
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Schema Validation**: Pydantic models

**Folder Structure:**
```
backend/app/
├── api/v1/
│   ├── endpoints/   # API route handlers
│   │   ├── weather.py
│   │   ├── forecast.py
│   │   ├── history.py
│   │   ├── aqi.py
│   │   └── health.py
│   └── api.py       # API router aggregation
├── core/
│   ├── config.py    # Configuration management
│   ├── security.py  # Security utilities
│   └── logging.py   # Logging configuration
├── db/
│   ├── database.py  # Database connection
│   └── session.py   # Session management
├── models/          # SQLAlchemy ORM models
│   ├── location.py
│   ├── weather.py
│   ├── forecast.py
│   └── aqi.py
├── schemas/         # Pydantic schemas
│   ├── weather.py
│   ├── forecast.py
│   └── aqi.py
├── services/        # Business logic
│   ├── weather_service.py
│   ├── forecast_service.py
│   └── analytics_service.py
├── repositories/    # Data access layer
│   ├── weather_repository.py
│   └── location_repository.py
├── utils/           # Utilities
│   ├── http_client.py
│   ├── validators.py
│   └── formatters.py
└── middleware/      # Middleware
    ├── error_handler.py
    ├── logging.py
    └── rate_limiter.py
```

---

### 3. Scheduler Layer

**Technology:** APScheduler

**Responsibilities:**
- Periodic data fetching
- Job scheduling and execution
- Retry failed jobs
- Job logging
- Error notification

**Jobs:**
- **Hourly Weather Fetch**: Collect current weather data
- **Hourly AQI Fetch**: Collect air quality data
- **Daily Forecast Update**: Update forecast data
- **Database Cleanup**: Archive old data

**Architecture:**
```
scheduler/
├── jobs/
│   ├── weather_job.py      # Fetch weather data
│   ├── aqi_job.py          # Fetch AQI data
│   └── cleanup_job.py      # Database maintenance
├── utils/
│   ├── job_logger.py       # Job execution logging
│   └── retry_handler.py    # Retry logic
└── scheduler.py            # Main scheduler setup
```

---

### 4. Analytics Layer

**Technology:** Pandas + NumPy

**Responsibilities:**
- Data aggregation
- Statistical analysis
- Trend calculation
- Data transformation
- Report generation

**Components:**
```
analytics/
├── processors/
│   ├── temperature_processor.py
│   ├── precipitation_processor.py
│   └── wind_processor.py
└── aggregators/
    ├── daily_aggregator.py
    ├── weekly_aggregator.py
    └── monthly_aggregator.py
```

---

### 5. Database Layer

**Technology:** Supabase PostgreSQL

**Responsibilities:**
- Data persistence
- Relational integrity
- Query optimization
- Data indexing
- Backup and recovery

**Schema Design:** (See Database Design document)

---

## Data Flow

### 1. Real-Time Weather Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Scheduler triggers job (every hour)                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Weather Service calls Open-Meteo API               │
│ - Validates request parameters                              │
│ - Handles rate limiting                                     │
│ - Implements retry logic                                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Data Validation & Transformation                   │
│ - Validate API response structure                           │
│ - Clean and normalize data                                  │
│ - Transform units if needed                                 │
│ - Enrich with metadata                                      │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Repository Layer stores data                       │
│ - Insert/Update weather data                                │
│ - Update location metadata                                  │
│ - Log API call                                              │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Database persists data                             │
│ - PostgreSQL writes data                                    │
│ - Triggers update indexes                                   │
│ - Updates materialized views                                │
└─────────────────────────────────────────────────────────────┘
```

### 2. User Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User interacts with UI                             │
│ (e.g., selects location, date range)                        │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: React component triggers API call via service      │
│ - Frontend service formats request                          │
│ - Adds headers, auth (future)                               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: FastAPI receives request                           │
│ - Middleware processes request                              │
│ - Validates request schema (Pydantic)                       │
│ - Logs incoming request                                     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Router directs to endpoint                         │
│ - Endpoint calls service layer                              │
│ - Service orchestrates business logic                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Repository queries database                        │
│ - Builds optimized SQL query                                │
│ - Applies filters, joins                                    │
│ - Returns data models                                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Service transforms data                            │
│ - Formats response                                          │
│ - Applies business logic                                    │
│ - Converts to response schema                               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 7: API returns response                               │
│ - JSON response with proper status code                     │
│ - Logs response                                             │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 8: Frontend receives and displays data               │
│ - Updates component state                                   │
│ - Triggers re-render                                        │
│ - Displays data to user                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **React 19** | UI Framework | Latest features, performance, concurrent rendering |
| **TypeScript** | Type Safety | Catch errors at compile-time, better DX |
| **Vite** | Build Tool | Fast HMR, optimized production builds |
| **Tailwind CSS** | Styling | Utility-first, highly customizable, small bundle |
| **React Router** | Routing | Standard routing solution for React SPAs |
| **TanStack Query** | Data Fetching | Caching, background updates, optimistic updates |
| **Axios** | HTTP Client | Interceptors, request cancellation, timeout |
| **Recharts** | Data Viz | React-native charts, responsive, customizable |
| **Leaflet** | Maps | Open-source, feature-rich, lightweight |
| **Framer Motion** | Animations | Declarative, performant, easy to use |
| **Lucide Icons** | Icons | Modern, consistent, tree-shakeable |

### Backend Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **FastAPI** | Web Framework | Async, auto docs, type hints, performance |
| **Python 3.12** | Language | Latest features, type hints, async support |
| **Pydantic** | Validation | Data validation, serialization, type safety |
| **SQLAlchemy** | ORM | Mature, flexible, powerful query API |
| **Alembic** | Migrations | Database version control, team collaboration |
| **APScheduler** | Scheduling | Background jobs, cron-like scheduling |
| **Uvicorn** | ASGI Server | High performance, async support |
| **Httpx** | HTTP Client | Async HTTP requests to external APIs |
| **Python-dotenv** | Config | Environment variable management |

### Database Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **PostgreSQL** | Primary DB | ACID compliance, JSON support, mature |
| **Supabase** | DB Hosting | Managed PostgreSQL, real-time, scalable |

### DevOps Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Docker** | Containerization | Consistent environments, easy deployment |
| **Docker Compose** | Orchestration | Multi-container development setup |
| **GitHub Actions** | CI/CD | Automated testing, deployment |

---

## Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────────────┐
│  Developer Machine (Docker Compose)             │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   Frontend   │  │   Backend    │            │
│  │   :3000      │  │   :8000      │            │
│  └──────────────┘  └──────────────┘            │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  Scheduler   │  │  PostgreSQL  │            │
│  │              │  │   :5432      │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                       PRODUCTION                            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Vercel CDN (Frontend)                               │  │
│  │  - React SPA                                         │  │
│  │  - Static assets                                     │  │
│  │  - Edge caching                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Railway (Backend + Scheduler)                       │  │
│  │  - FastAPI containers                                │  │
│  │  - APScheduler workers                               │  │
│  │  - Horizontal scaling                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Supabase (Database)                                 │  │
│  │  - PostgreSQL cluster                                │  │
│  │  - Automated backups                                 │  │
│  │  - Connection pooling                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Current Phase (No Auth)

1. **Input Validation**: All inputs validated via Pydantic schemas
2. **SQL Injection Prevention**: Parameterized queries via SQLAlchemy
3. **XSS Protection**: React's built-in escaping
4. **HTTPS Only**: All production traffic over HTTPS
5. **Rate Limiting**: Prevent API abuse
6. **CORS**: Configured allowed origins
7. **Environment Variables**: Secrets in env files, never committed

### Future Phase (With Auth)

1. **JWT Authentication**: Stateless token-based auth
2. **Password Hashing**: bcrypt for password storage
3. **Role-Based Access Control (RBAC)**
4. **API Key Management**: For external API consumers
5. **Session Management**: Secure session handling
6. **Audit Logging**: Track all user actions

---

## Scaling Strategy

### Horizontal Scaling

**Frontend:**
- Deployed on Vercel CDN (automatic scaling)
- Static assets cached at edge locations
- Global distribution

**Backend:**
- Stateless API design (easy to scale)
- Load balancer distributes traffic
- Auto-scaling based on CPU/memory metrics
- Container orchestration (Railway/Kubernetes)

**Database:**
- Read replicas for read-heavy operations
- Connection pooling
- Query optimization
- Partitioning by time (monthly tables)

### Vertical Scaling

- Increase container resources as needed
- Database instance upgrades
- Optimize queries and indexes

### Caching Strategy

**Layer 1: Browser Cache**
- Static assets cached (JS, CSS, images)
- Service Worker for offline capability (future)

**Layer 2: CDN Cache**
- Frontend assets cached at edge
- API responses cached (short TTL)

**Layer 3: Application Cache**
- In-memory caching (Redis - future)
- Database query result caching

**Layer 4: Database Cache**
- PostgreSQL query cache
- Materialized views for complex queries

---

## Monitoring & Observability

### Logging

**Application Logs:**
- All API requests/responses
- Error stack traces
- Business logic events
- Scheduler job execution

**Log Levels:**
- DEBUG: Development only
- INFO: General information
- WARNING: Warning conditions
- ERROR: Error conditions
- CRITICAL: Critical issues

### Metrics (Future)

- Request rate
- Response time (p50, p95, p99)
- Error rate
- Database query time
- External API call success rate
- Scheduler job success rate

### Alerting (Future)

- High error rate
- Slow response times
- Database connection failures
- Scheduler job failures
- External API downtime

---

## Design Decisions & Trade-offs

### 1. Monorepo vs Multi-repo
**Decision:** Monorepo  
**Rationale:** Easier to manage, shared types, simpler deployment  
**Trade-off:** Larger repository size

### 2. REST vs GraphQL
**Decision:** REST  
**Rationale:** Simpler, well-understood, sufficient for use case  
**Trade-off:** Potential over-fetching

### 3. SQLAlchemy vs Raw SQL
**Decision:** SQLAlchemy ORM  
**Rationale:** Type safety, relationships, migrations  
**Trade-off:** Slight performance overhead

### 4. Client-side vs Server-side Rendering
**Decision:** Client-side (SPA)  
**Rationale:** Better UX, simpler deployment, rich interactions  
**Trade-off:** Initial load time, SEO considerations

### 5. Real-time vs Polling
**Decision:** Polling (hourly scheduler)  
**Rationale:** Sufficient for weather data, simpler architecture  
**Trade-off:** Not truly real-time

---

## Future Architecture Enhancements

### Phase 2: Multi-Source Intelligence
- Event-driven architecture (message queue)
- Separate microservices per data source
- API Gateway pattern

### Phase 3: AI/ML Integration
- ML model serving layer
- Feature store
- Model versioning and A/B testing

### Phase 4: Enterprise Features
- Multi-tenancy
- Advanced caching (Redis)
- WebSocket for real-time updates
- Elasticsearch for full-text search

---

**Document Version:** 1.0  
**Last Updated:** July 10, 2026  
**Next Review:** July 24, 2026
