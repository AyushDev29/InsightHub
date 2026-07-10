"""
Application Configuration

Centralizes all application settings using Pydantic Settings.
Environment variables are loaded from .env file.
"""

from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # ========================================================================
    # APPLICATION
    # ========================================================================
    
    APP_NAME: str = Field(default="InsightHub AI", description="Application name")
    APP_VERSION: str = Field(default="0.1.0", description="Application version")
    ENVIRONMENT: str = Field(default="development", description="Environment (development, staging, production)")
    DEBUG: bool = Field(default=False, description="Debug mode")
    
    # ========================================================================
    # SERVER
    # ========================================================================
    
    HOST: str = Field(default="0.0.0.0", description="Server host")
    PORT: int = Field(default=8000, description="Server port")
    RELOAD: bool = Field(default=False, description="Auto-reload on code changes")
    WORKERS: int = Field(default=4, description="Number of worker processes")
    
    # ========================================================================
    # API
    # ========================================================================
    
    API_V1_PREFIX: str = Field(default="/api/v1", description="API v1 prefix")
    
    # ========================================================================
    # DATABASE
    # ========================================================================
    
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://user:password@localhost:5432/insighthub",
        description="Database connection URL"
    )
    DATABASE_POOL_SIZE: int = Field(default=10, description="Connection pool size")
    DATABASE_MAX_OVERFLOW: int = Field(default=20, description="Max connections overflow")
    
    # ========================================================================
    # CORS
    # ========================================================================
    
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Allowed CORS origins"
    )
    CORS_ALLOW_CREDENTIALS: bool = Field(default=True, description="Allow credentials")

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Accept JSON list, comma-separated string, or actual list."""
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                import json
                return json.loads(v)
            return [o.strip() for o in v.split(",") if o.strip()]
        return v
    
    # ========================================================================
    # RATE LIMITING
    # ========================================================================
    
    RATE_LIMIT_ENABLED: bool = Field(default=True, description="Enable rate limiting")
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, description="Requests per minute")
    
    # ========================================================================
    # EXTERNAL APIS - OPEN-METEO
    # ========================================================================
    
    OPEN_METEO_BASE_URL: str = Field(
        default="https://api.open-meteo.com/v1",
        description="Open-Meteo forecast API base URL"
    )
    OPEN_METEO_ARCHIVE_URL: str = Field(
        default="https://archive-api.open-meteo.com/v1",
        description="Open-Meteo archive API base URL"
    )
    OPEN_METEO_GEOCODING_URL: str = Field(
        default="https://geocoding-api.open-meteo.com/v1",
        description="Open-Meteo geocoding API base URL"
    )
    OPEN_METEO_AQI_URL: str = Field(
        default="https://air-quality-api.open-meteo.com/v1",
        description="Open-Meteo air quality API base URL"
    )
    OPEN_METEO_TIMEOUT: int = Field(default=30, description="API request timeout (seconds)")
    OPEN_METEO_MAX_RETRIES: int = Field(default=3, description="Max API request retries")
    
    # ========================================================================
    # SCHEDULER
    # ========================================================================
    
    SCHEDULER_ENABLED: bool = Field(default=True, description="Enable scheduler")
    SCHEDULER_TIMEZONE: str = Field(default="UTC", description="Scheduler timezone")
    WEATHER_FETCH_INTERVAL_MINUTES: int = Field(
        default=60,
        description="Weather fetch interval in minutes"
    )
    AQI_FETCH_INTERVAL_MINUTES: int = Field(
        default=60,
        description="AQI fetch interval in minutes"
    )
    
    # ========================================================================
    # LOGGING
    # ========================================================================
    
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")
    LOG_FILE: str = Field(default="logs/app.log", description="Log file path")
    LOG_MAX_BYTES: int = Field(default=10485760, description="Max log file size (10MB)")
    LOG_BACKUP_COUNT: int = Field(default=5, description="Number of log backup files")
    
    # ========================================================================
    # DATA RETENTION
    # ========================================================================
    
    FORECAST_RETENTION_DAYS: int = Field(
        default=30,
        description="Days to retain forecast data"
    )
    API_LOG_RETENTION_DAYS: int = Field(
        default=90,
        description="Days to retain API logs"
    )
    SCHEDULER_LOG_RETENTION_DAYS: int = Field(
        default=90,
        description="Days to retain scheduler logs"
    )
    
    # ========================================================================
    # PAGINATION
    # ========================================================================
    
    DEFAULT_PAGE_SIZE: int = Field(default=20, description="Default pagination size")
    MAX_PAGE_SIZE: int = Field(default=100, description="Maximum pagination size")
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"


# Create global settings instance
settings = Settings()


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_database_url() -> str:
    """Get database URL for SQLAlchemy"""
    return settings.DATABASE_URL


def is_development() -> bool:
    """Check if running in development mode"""
    return settings.ENVIRONMENT == "development"


def is_production() -> bool:
    """Check if running in production mode"""
    return settings.ENVIRONMENT == "production"


def is_testing() -> bool:
    """Check if running in test mode"""
    return settings.ENVIRONMENT == "testing"
