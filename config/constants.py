"""
Application Constants
Defines constant values used throughout the application
"""

# Application Information
APP_NAME = "InsightHub-AI"
APP_VERSION = "0.1.0"
APP_DESCRIPTION = "AI-powered analytics and insights platform"

# API Versions
API_V1_PREFIX = "/api/v1"

# HTTP Status Codes
HTTP_200_OK = 200
HTTP_201_CREATED = 201
HTTP_204_NO_CONTENT = 204
HTTP_400_BAD_REQUEST = 400
HTTP_401_UNAUTHORIZED = 401
HTTP_403_FORBIDDEN = 403
HTTP_404_NOT_FOUND = 404
HTTP_422_UNPROCESSABLE_ENTITY = 422
HTTP_500_INTERNAL_SERVER_ERROR = 500

# Database Constants
DB_CONNECTION_TIMEOUT = 30
DB_QUERY_TIMEOUT = 60
MAX_PAGE_SIZE = 100
DEFAULT_PAGE_SIZE = 20

# Cache TTL (in seconds)
CACHE_TTL_SHORT = 300      # 5 minutes
CACHE_TTL_MEDIUM = 1800    # 30 minutes
CACHE_TTL_LONG = 3600      # 1 hour
CACHE_TTL_DAY = 86400      # 24 hours

# Data Categories
DATA_CATEGORIES = {
    'CRYPTO': 'cryptocurrency',
    'WEATHER': 'weather',
    'AQI': 'air_quality_index',
    'STOCKS': 'stock_market',
    'EXCHANGE': 'currency_exchange',
    'ECONOMY': 'economic_indicators',
    'EARTHQUAKES': 'seismic_activity',
}

# Time Intervals
TIME_INTERVALS = {
    'MINUTE': '1m',
    'FIVE_MINUTES': '5m',
    'FIFTEEN_MINUTES': '15m',
    'THIRTY_MINUTES': '30m',
    'HOUR': '1h',
    'FOUR_HOURS': '4h',
    'DAY': '1d',
    'WEEK': '1w',
    'MONTH': '1M',
}

# Date Formats
DATE_FORMAT = "%Y-%m-%d"
DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"
ISO_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"

# File Upload Limits
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.csv', '.json', '.xlsx', '.xls', '.txt'}

# ML Model Types
ML_MODELS = {
    'REGRESSION': 'regression',
    'CLASSIFICATION': 'classification',
    'CLUSTERING': 'clustering',
    'FORECASTING': 'time_series_forecasting',
    'ANOMALY_DETECTION': 'anomaly_detection',
}

# Analytics Metrics
METRICS = {
    'MEAN': 'mean',
    'MEDIAN': 'median',
    'MODE': 'mode',
    'STD_DEV': 'standard_deviation',
    'VARIANCE': 'variance',
    'MIN': 'minimum',
    'MAX': 'maximum',
    'PERCENTILE_25': 'percentile_25',
    'PERCENTILE_75': 'percentile_75',
    'PERCENTILE_95': 'percentile_95',
}

# Task Status
TASK_STATUS = {
    'PENDING': 'pending',
    'IN_PROGRESS': 'in_progress',
    'COMPLETED': 'completed',
    'FAILED': 'failed',
    'CANCELLED': 'cancelled',
}

# User Roles
USER_ROLES = {
    'ADMIN': 'admin',
    'ANALYST': 'analyst',
    'VIEWER': 'viewer',
}

# Data Quality Thresholds
DATA_QUALITY = {
    'MIN_COMPLETENESS': 0.8,  # 80% data completeness required
    'MAX_MISSING_RATIO': 0.2,  # Maximum 20% missing values
    'MIN_VARIANCE': 0.01,      # Minimum variance for features
}

# API Rate Limits
RATE_LIMITS = {
    'DEFAULT': 60,      # requests per minute
    'ANONYMOUS': 10,    # requests per minute
    'AUTHENTICATED': 100,  # requests per minute
    'PREMIUM': 1000,    # requests per minute
}

# Error Messages
ERROR_MESSAGES = {
    'INVALID_CREDENTIALS': 'Invalid username or password',
    'UNAUTHORIZED': 'Unauthorized access',
    'NOT_FOUND': 'Resource not found',
    'VALIDATION_ERROR': 'Validation error',
    'INTERNAL_ERROR': 'Internal server error',
    'RATE_LIMIT_EXCEEDED': 'Rate limit exceeded',
}

# Success Messages
SUCCESS_MESSAGES = {
    'CREATED': 'Resource created successfully',
    'UPDATED': 'Resource updated successfully',
    'DELETED': 'Resource deleted successfully',
    'PROCESSED': 'Request processed successfully',
}
