"""
Application Settings Configuration
Loads environment variables and provides centralized configuration
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Environment
ENV = os.getenv('ENVIRONMENT', 'development')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# Database Configuration
DATABASE = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'name': os.getenv('DB_NAME', 'insighthub'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', ''),
    'pool_size': int(os.getenv('DB_POOL_SIZE', 10)),
    'max_overflow': int(os.getenv('DB_MAX_OVERFLOW', 20)),
}

# Backend API Configuration
BACKEND = {
    'host': os.getenv('BACKEND_HOST', '0.0.0.0'),
    'port': int(os.getenv('BACKEND_PORT', 8000)),
    'workers': int(os.getenv('BACKEND_WORKERS', 4)),
    'reload': os.getenv('BACKEND_RELOAD', 'False').lower() == 'true',
}

# Frontend Configuration
FRONTEND = {
    'port': int(os.getenv('FRONTEND_PORT', 3000)),
    'api_url': os.getenv('REACT_APP_API_URL', 'http://localhost:8000'),
}

# Security
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
JWT_SECRET = os.getenv('JWT_SECRET', SECRET_KEY)
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))

# Redis Configuration
REDIS = {
    'host': os.getenv('REDIS_HOST', 'localhost'),
    'port': int(os.getenv('REDIS_PORT', 6379)),
    'password': os.getenv('REDIS_PASSWORD', ''),
    'db': int(os.getenv('REDIS_DB', 0)),
}

# ML Service Configuration
ML_SERVICE = {
    'host': os.getenv('ML_SERVICE_HOST', 'localhost'),
    'port': int(os.getenv('ML_SERVICE_PORT', 8001)),
    'model_path': os.getenv('ML_MODEL_PATH', str(BASE_DIR / 'ml' / 'models')),
    'batch_size': int(os.getenv('ML_BATCH_SIZE', 32)),
}

# Analytics Configuration
ANALYTICS = {
    'batch_size': int(os.getenv('ANALYTICS_BATCH_SIZE', 1000)),
    'worker_threads': int(os.getenv('ANALYTICS_WORKER_THREADS', 4)),
    'cache_ttl': int(os.getenv('ANALYTICS_CACHE_TTL', 3600)),
}

# Scheduler Configuration
SCHEDULER = {
    'enabled': os.getenv('SCHEDULER_ENABLED', 'True').lower() == 'true',
    'timezone': os.getenv('SCHEDULER_TIMEZONE', 'UTC'),
}

# Logging Configuration
LOGGING = {
    'level': os.getenv('LOG_LEVEL', 'INFO'),
    'file': os.getenv('LOG_FILE', str(BASE_DIR / 'logs' / 'app.log')),
    'max_bytes': int(os.getenv('LOG_MAX_BYTES', 10485760)),  # 10MB
    'backup_count': int(os.getenv('LOG_BACKUP_COUNT', 5)),
}

# AWS Configuration (optional)
AWS = {
    'access_key_id': os.getenv('AWS_ACCESS_KEY_ID', ''),
    'secret_access_key': os.getenv('AWS_SECRET_ACCESS_KEY', ''),
    'region': os.getenv('AWS_REGION', 'us-east-1'),
    's3_bucket': os.getenv('AWS_S3_BUCKET', ''),
}

# API Keys for External Services
API_KEYS = {
    'crypto': os.getenv('CRYPTO_API_KEY', ''),
    'weather': os.getenv('WEATHER_API_KEY', ''),
    'aqi': os.getenv('AQI_API_KEY', ''),
    'stocks': os.getenv('STOCKS_API_KEY', ''),
    'exchange': os.getenv('EXCHANGE_API_KEY', ''),
    'economy': os.getenv('ECONOMY_API_KEY', ''),
    'earthquakes': os.getenv('EARTHQUAKES_API_KEY', ''),
}

# CORS Settings
CORS = {
    'origins': os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(','),
    'allow_credentials': True,
    'allow_methods': ['*'],
    'allow_headers': ['*'],
}

# Rate Limiting
RATE_LIMIT = {
    'enabled': os.getenv('RATE_LIMIT_ENABLED', 'True').lower() == 'true',
    'requests_per_minute': int(os.getenv('RATE_LIMIT_PER_MINUTE', 60)),
}
