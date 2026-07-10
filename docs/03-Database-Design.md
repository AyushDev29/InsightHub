# Database Design
# InsightHub AI - Weather Intelligence Module

## Table of Contents
1. [Overview](#overview)
2. [Schema Design](#schema-design)
3. [Entity Relationship Diagram](#entity-relationship-diagram)
4. [Table Specifications](#table-specifications)
5. [Indexing Strategy](#indexing-strategy)
6. [Data Retention](#data-retention)
7. [Migration Strategy](#migration-strategy)

---

## Overview

### Database Technology
- **DBMS:** PostgreSQL 15+
- **Hosting:** Supabase (Managed PostgreSQL)
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic

### Design Principles
1. **Normalization:** 3NF for data integrity
2. **Performance:** Strategic indexing and partitioning
3. **Scalability:** Time-based partitioning for historical data
4. **Audit Trail:** Timestamps on all tables
5. **Type Safety:** Strong typing with constraints

---

## Schema Design

### Core Tables

```
locations           # City/location master data
weather_current     # Current weather conditions
weather_hourly      # Hourly forecast data
weather_daily       # Daily forecast data
weather_history     # Historical weather archive
air_quality         # Air quality measurements
api_logs            # External API call logs
scheduler_logs      # Scheduler job execution logs
```

### Future Tables (Not in Phase 1)

```
users               # User accounts
user_preferences    # User settings
saved_locations     # User's favorite locations
alerts              # Weather alerts configuration
predictions         # ML model predictions
```

---

## Entity Relationship Diagram

```
┌─────────────────┐
│   locations     │
│  (UUID: id)     │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴────┬──────────┬──────────┬──────────┬──────────┐
    │         │          │          │          │          │
    ▼         ▼          ▼          ▼          ▼          ▼
┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│weather_ │ │weather│ │weather│ │weather│ │air_  │ │api_  │
│current  │ │_hourly│ │_daily │ │_history│ │quality│ │logs  │
└─────────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘


┌──────────────────┐
│ scheduler_logs   │  (Independent table)
└──────────────────┘
```

---

## Table Specifications

### 1. locations

**Purpose:** Store city/location information for weather tracking

```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    elevation INTEGER,
    timezone VARCHAR(100),
    population INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_coordinates UNIQUE (latitude, longitude),
    CONSTRAINT check_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT check_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

CREATE INDEX idx_locations_name ON locations(name);
CREATE INDEX idx_locations_country ON locations(country_code);
CREATE INDEX idx_locations_coords ON locations(latitude, longitude);
CREATE INDEX idx_locations_active ON locations(is_active) WHERE is_active = TRUE;
```

**Sample Data:**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "New York",
    "country": "United States",
    "country_code": "US",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "elevation": 10,
    "timezone": "America/New_York",
    "population": 8336817,
    "is_active": true
}
```

---

### 2. weather_current

**Purpose:** Store current weather conditions

```sql
CREATE TABLE weather_current (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    
    -- Temperature
    temperature DECIMAL(5, 2) NOT NULL,           -- °C
    feels_like DECIMAL(5, 2),
    temperature_min DECIMAL(5, 2),
    temperature_max DECIMAL(5, 2),
    
    -- Atmospheric
    pressure INTEGER,                              -- hPa
    humidity INTEGER,                              -- %
    visibility INTEGER,                            -- meters
    
    -- Wind
    wind_speed DECIMAL(5, 2),                     -- m/s
    wind_direction INTEGER,                        -- degrees
    wind_gust DECIMAL(5, 2),                      -- m/s
    
    -- Precipitation
    precipitation DECIMAL(6, 2) DEFAULT 0,         -- mm
    rain DECIMAL(6, 2) DEFAULT 0,                 -- mm
    snow DECIMAL(6, 2) DEFAULT 0,                 -- mm
    
    -- Cloud and Weather
    cloudiness INTEGER,                            -- %
    weather_code INTEGER,                          -- WMO code
    weather_description VARCHAR(255),
    
    -- Sun
    sunrise TIMESTAMP WITH TIME ZONE,
    sunset TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_temperature CHECK (temperature >= -100 AND temperature <= 60),
    CONSTRAINT check_humidity CHECK (humidity >= 0 AND humidity <= 100),
    CONSTRAINT check_cloudiness CHECK (cloudiness >= 0 AND cloudiness <= 100)
);

CREATE INDEX idx_weather_current_location ON weather_current(location_id);
CREATE INDEX idx_weather_current_time ON weather_current(observation_time DESC);
CREATE UNIQUE INDEX idx_weather_current_location_time 
    ON weather_current(location_id, observation_time);
```

---

### 3. weather_hourly

**Purpose:** Store hourly weather forecast (48 hours ahead)

```sql
CREATE TABLE weather_hourly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    
    forecast_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Temperature
    temperature DECIMAL(5, 2) NOT NULL,
    feels_like DECIMAL(5, 2),
    
    -- Atmospheric
    pressure INTEGER,
    humidity INTEGER,
    
    -- Wind
    wind_speed DECIMAL(5, 2),
    wind_direction INTEGER,
    wind_gust DECIMAL(5, 2),
    
    -- Precipitation
    precipitation_probability INTEGER,             -- %
    precipitation DECIMAL(6, 2) DEFAULT 0,
    
    -- Weather
    cloudiness INTEGER,
    weather_code INTEGER,
    weather_description VARCHAR(255),
    
    -- Metadata
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_hourly_precipitation_prob 
        CHECK (precipitation_probability >= 0 AND precipitation_probability <= 100)
);

CREATE INDEX idx_weather_hourly_location ON weather_hourly(location_id);
CREATE INDEX idx_weather_hourly_forecast_time ON weather_hourly(forecast_time);
CREATE INDEX idx_weather_hourly_location_time 
    ON weather_hourly(location_id, forecast_time);
```

---

### 4. weather_daily

**Purpose:** Store daily weather forecast (16 days ahead)

```sql
CREATE TABLE weather_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    
    forecast_date DATE NOT NULL,
    
    -- Temperature
    temperature_max DECIMAL(5, 2) NOT NULL,
    temperature_min DECIMAL(5, 2) NOT NULL,
    temperature_avg DECIMAL(5, 2),
    
    -- Atmospheric
    pressure_avg INTEGER,
    humidity_avg INTEGER,
    
    -- Wind
    wind_speed_max DECIMAL(5, 2),
    wind_speed_avg DECIMAL(5, 2),
    wind_direction_dominant INTEGER,
    
    -- Precipitation
    precipitation_sum DECIMAL(6, 2) DEFAULT 0,
    precipitation_probability_max INTEGER,
    rain_sum DECIMAL(6, 2) DEFAULT 0,
    snow_sum DECIMAL(6, 2) DEFAULT 0,
    
    -- Weather
    weather_code INTEGER,
    weather_description VARCHAR(255),
    
    -- Sun
    sunrise TIMESTAMP WITH TIME ZONE,
    sunset TIMESTAMP WITH TIME ZONE,
    daylight_duration INTEGER,                     -- seconds
    
    -- Metadata
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_daily_temp_range 
        CHECK (temperature_max >= temperature_min)
);

CREATE INDEX idx_weather_daily_location ON weather_daily(location_id);
CREATE INDEX idx_weather_daily_date ON weather_daily(forecast_date);
CREATE UNIQUE INDEX idx_weather_daily_location_date 
    ON weather_daily(location_id, forecast_date);
```

---

### 5. weather_history

**Purpose:** Archive historical weather data

```sql
CREATE TABLE weather_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    
    record_date DATE NOT NULL,
    record_hour INTEGER,                           -- 0-23 for hourly, NULL for daily
    
    -- Temperature
    temperature DECIMAL(5, 2) NOT NULL,
    temperature_min DECIMAL(5, 2),
    temperature_max DECIMAL(5, 2),
    
    -- Atmospheric
    pressure INTEGER,
    humidity INTEGER,
    
    -- Wind
    wind_speed DECIMAL(5, 2),
    wind_direction INTEGER,
    
    -- Precipitation
    precipitation DECIMAL(6, 2) DEFAULT 0,
    rain DECIMAL(6, 2) DEFAULT 0,
    snow DECIMAL(6, 2) DEFAULT 0,
    
    -- Weather
    cloudiness INTEGER,
    weather_code INTEGER,
    weather_description VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_history_hour CHECK (record_hour IS NULL OR (record_hour >= 0 AND record_hour <= 23))
) PARTITION BY RANGE (record_date);

-- Create partitions by month
CREATE TABLE weather_history_2024_01 PARTITION OF weather_history
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
    
CREATE TABLE weather_history_2024_02 PARTITION OF weather_history
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Continue creating partitions as needed

CREATE INDEX idx_weather_history_location ON weather_history(location_id);
CREATE INDEX idx_weather_history_date ON weather_history(record_date DESC);
CREATE INDEX idx_weather_history_location_date 
    ON weather_history(location_id, record_date);
```

---

### 6. air_quality

**Purpose:** Store air quality measurements

```sql
CREATE TABLE air_quality (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    
    measurement_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Air Quality Index
    aqi INTEGER NOT NULL,                          -- 0-500
    aqi_category VARCHAR(50),                      -- Good, Moderate, etc.
    
    -- Pollutants (µg/m³)
    pm2_5 DECIMAL(8, 2),                          -- Particulate matter < 2.5µm
    pm10 DECIMAL(8, 2),                           -- Particulate matter < 10µm
    o3 DECIMAL(8, 2),                             -- Ozone
    no2 DECIMAL(8, 2),                            -- Nitrogen dioxide
    so2 DECIMAL(8, 2),                            -- Sulfur dioxide
    co DECIMAL(8, 2),                             -- Carbon monoxide
    
    -- Metadata
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_aqi CHECK (aqi >= 0 AND aqi <= 500)
);

CREATE INDEX idx_air_quality_location ON air_quality(location_id);
CREATE INDEX idx_air_quality_time ON air_quality(measurement_time DESC);
CREATE INDEX idx_air_quality_aqi ON air_quality(aqi);
CREATE UNIQUE INDEX idx_air_quality_location_time 
    ON air_quality(location_id, measurement_time);
```

---

### 7. api_logs

**Purpose:** Log all external API calls for monitoring and debugging

```sql
CREATE TABLE api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Request Info
    api_name VARCHAR(100) NOT NULL,                -- 'open-meteo-forecast', 'open-meteo-aqi'
    endpoint VARCHAR(500) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    request_params JSONB,
    
    -- Response Info
    status_code INTEGER,
    response_time_ms INTEGER,                      -- milliseconds
    response_size_bytes INTEGER,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    
    -- Metadata
    location_id UUID REFERENCES locations(id),
    user_agent VARCHAR(255),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_status_code CHECK (status_code >= 100 AND status_code < 600)
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE api_logs_2026_07 PARTITION OF api_logs
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

CREATE INDEX idx_api_logs_api_name ON api_logs(api_name);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX idx_api_logs_success ON api_logs(success);
CREATE INDEX idx_api_logs_location ON api_logs(location_id);
```

---

### 8. scheduler_logs

**Purpose:** Log scheduler job execution

```sql
CREATE TABLE scheduler_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Job Info
    job_name VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) NOT NULL,                 -- 'weather_fetch', 'aqi_fetch'
    
    -- Execution Info
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    
    -- Results
    status VARCHAR(20) NOT NULL,                   -- 'success', 'failed', 'partial'
    records_processed INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    error_traceback TEXT,
    
    -- Metadata
    hostname VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_status CHECK (status IN ('success', 'failed', 'partial'))
) PARTITION BY RANGE (created_at);

CREATE TABLE scheduler_logs_2026_07 PARTITION OF scheduler_logs
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

CREATE INDEX idx_scheduler_logs_job_name ON scheduler_logs(job_name);
CREATE INDEX idx_scheduler_logs_status ON scheduler_logs(status);
CREATE INDEX idx_scheduler_logs_created_at ON scheduler_logs(created_at DESC);
```

---

## Indexing Strategy

### Primary Keys
- All tables use UUID for primary keys
- Better for distributed systems
- No integer overflow concerns
- More secure (non-sequential)

### Foreign Keys
- Indexed automatically by PostgreSQL
- CASCADE delete for dependent data

### Query Optimization Indexes

**Time-based queries:**
```sql
-- Weather lookups by location and time
CREATE INDEX idx_weather_current_location_time 
    ON weather_current(location_id, observation_time);

-- Recent data queries
CREATE INDEX idx_weather_current_time 
    ON weather_current(observation_time DESC);
```

**Location-based queries:**
```sql
-- City search
CREATE INDEX idx_locations_name ON locations USING gin(name gin_trgm_ops);

-- Geo queries (future)
CREATE INDEX idx_locations_geom ON locations USING gist(
    ll_to_earth(latitude, longitude)
);
```

**Analytics queries:**
```sql
-- Date range analytics
CREATE INDEX idx_weather_history_date_range 
    ON weather_history(location_id, record_date) 
    INCLUDE (temperature, precipitation);
```

---

## Data Retention Policy

### Hot Data (Immediate Access)
- **Current Weather:** Last 7 days
- **Forecasts:** Next 16 days
- **Air Quality:** Last 30 days
- **API Logs:** Last 90 days
- **Scheduler Logs:** Last 90 days

### Warm Data (Archival)
- **Historical Weather:** All data (partitioned by month)
- Older partitions can be moved to cheaper storage

### Cold Data (Optional Backup)
- Data older than 2 years
- Compressed and stored in object storage (S3)
- Queryable via external tables

### Cleanup Jobs

```sql
-- Delete old forecast data (run daily)
DELETE FROM weather_hourly 
WHERE forecast_time < NOW() - INTERVAL '7 days';

DELETE FROM weather_daily 
WHERE forecast_date < CURRENT_DATE - INTERVAL '30 days';

-- Partition management for logs
DROP TABLE IF EXISTS api_logs_2024_01;  -- After data archived
```

---

## Migration Strategy

### Alembic Setup

**Directory Structure:**
```
backend/alembic/
├── versions/
│   ├── 001_initial_schema.py
│   ├── 002_add_indexes.py
│   └── 003_add_partitions.py
├── env.py
├── script.py.mako
└── alembic.ini
```

### Migration Commands

```bash
# Create new migration
alembic revision -m "description"

# Auto-generate migration from models
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current version
alembic current

# Show migration history
alembic history
```

### Initial Migration

```python
# alembic/versions/001_initial_schema.py
def upgrade():
    # Create locations table
    op.create_table(
        'locations',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        # ... more columns
    )
    
    # Create indexes
    op.create_index('idx_locations_name', 'locations', ['name'])
    
    # Create other tables...
```

---

## Performance Considerations

### Query Optimization

1. **Use Proper Joins**
```sql
-- Good: Explicit join with indexes
SELECT w.*, l.name 
FROM weather_current w
JOIN locations l ON w.location_id = l.id
WHERE l.name = 'New York';
```

2. **Avoid SELECT ***
```sql
-- Bad
SELECT * FROM weather_history;

-- Good
SELECT temperature, humidity, record_date 
FROM weather_history;
```

3. **Use LIMIT for Large Datasets**
```sql
SELECT * FROM weather_history 
WHERE location_id = '...'
ORDER BY record_date DESC
LIMIT 100;
```

### Connection Pooling

```python
# SQLAlchemy connection pool
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
)
```

### Materialized Views (Future)

```sql
-- Pre-computed monthly averages
CREATE MATERIALIZED VIEW weather_monthly_avg AS
SELECT 
    location_id,
    DATE_TRUNC('month', record_date) as month,
    AVG(temperature) as avg_temperature,
    AVG(humidity) as avg_humidity,
    SUM(precipitation) as total_precipitation
FROM weather_history
GROUP BY location_id, month;

CREATE INDEX ON weather_monthly_avg(location_id, month);

-- Refresh periodically
REFRESH MATERIALIZED VIEW weather_monthly_avg;
```

---

## Backup Strategy

### Automated Backups (Supabase)
- **Frequency:** Daily
- **Retention:** 30 days
- **Type:** Full backup

### Manual Backups
```bash
# Backup entire database
pg_dump -h hostname -U username -d database > backup.sql

# Backup specific tables
pg_dump -t locations -t weather_current > partial_backup.sql

# Restore
psql -h hostname -U username -d database < backup.sql
```

---

## Database Monitoring

### Key Metrics to Monitor

1. **Connection Pool Usage**
2. **Query Performance** (slow query log)
3. **Table Sizes** (growth over time)
4. **Index Usage** (unused indexes)
5. **Replication Lag** (if using replicas)

### Useful Queries

```sql
-- Find slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- Index usage
SELECT 
    indexrelname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

---

**Document Version:** 1.0  
**Last Updated:** July 10, 2026  
**Next Review:** July 24, 2026
