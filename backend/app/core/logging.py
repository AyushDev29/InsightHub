"""
Logging Configuration

Sets up structured logging for the application with file and console handlers.
"""

import logging
import logging.handlers
import sys
from pathlib import Path
from pythonjsonlogger import jsonlogger

from app.core.config import settings


# ============================================================================
# LOGGER SETUP
# ============================================================================

def setup_logging():
    """
    Configure application-wide logging
    
    Creates both console and file handlers with appropriate formatters.
    JSON logging for production, human-readable for development.
    """
    # Create logs directory
    log_dir = Path(settings.LOG_FILE).parent
    log_dir.mkdir(parents=True, exist_ok=True)
    
    # Get root logger
    root_logger = logging.getLogger()
    
    # Set log level
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    root_logger.setLevel(log_level)
    
    # Remove existing handlers
    root_logger.handlers = []
    
    # ========================================================================
    # CONSOLE HANDLER
    # ========================================================================
    
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    
    if settings.ENVIRONMENT == "production":
        # JSON formatter for production
        json_formatter = jsonlogger.JsonFormatter(
            fmt="%(asctime)s %(name)s %(levelname)s %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        console_handler.setFormatter(json_formatter)
    else:
        # Human-readable formatter for development
        console_formatter = logging.Formatter(
            fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        console_handler.setFormatter(console_formatter)
    
    root_logger.addHandler(console_handler)
    
    # ========================================================================
    # FILE HANDLER (ROTATING)
    # ========================================================================
    
    file_handler = logging.handlers.RotatingFileHandler(
        filename=settings.LOG_FILE,
        maxBytes=settings.LOG_MAX_BYTES,
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding="utf-8",
    )
    file_handler.setLevel(log_level)
    
    # Detailed formatter for file logs
    file_formatter = logging.Formatter(
        fmt="%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(funcName)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    file_handler.setFormatter(file_formatter)
    
    root_logger.addHandler(file_handler)
    
    # ========================================================================
    # ERROR FILE HANDLER
    # ========================================================================
    
    error_log_file = log_dir / "error.log"
    error_handler = logging.handlers.RotatingFileHandler(
        filename=str(error_log_file),
        maxBytes=settings.LOG_MAX_BYTES,
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding="utf-8",
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(file_formatter)
    
    root_logger.addHandler(error_handler)
    
    # ========================================================================
    # SUPPRESS NOISY LOGGERS
    # ========================================================================
    
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


# Create application logger
logger = logging.getLogger("insighthub")


# ============================================================================
# LOGGER MIXIN
# ============================================================================

class LoggerMixin:
    """
    Mixin class to add logging capabilities to any class
    
    Usage:
        class MyService(LoggerMixin):
            def my_method(self):
                self.logger.info("Message")
    """
    
    @property
    def logger(self) -> logging.Logger:
        """Get logger for the current class"""
        if not hasattr(self, "_logger"):
            self._logger = logging.getLogger(f"insighthub.{self.__class__.__name__}")
        return self._logger


# ============================================================================
# DECORATORS
# ============================================================================

def log_execution_time(func):
    """
    Decorator to log function execution time
    
    Usage:
        @log_execution_time
        async def my_function():
            pass
    """
    import time
    from functools import wraps
    
    @wraps(func)
    async def async_wrapper(*args, **kwargs):
        start_time = time.time()
        func_logger = logging.getLogger(f"insighthub.{func.__module__}")
        
        try:
            result = await func(*args, **kwargs)
            execution_time = time.time() - start_time
            func_logger.info(
                f"{func.__name__} executed in {execution_time:.4f}s",
                extra={"execution_time": execution_time, "function": func.__name__},
            )
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            func_logger.error(
                f"{func.__name__} failed after {execution_time:.4f}s: {str(e)}",
                extra={"execution_time": execution_time, "function": func.__name__, "error": str(e)},
            )
            raise
    
    @wraps(func)
    def sync_wrapper(*args, **kwargs):
        start_time = time.time()
        func_logger = logging.getLogger(f"insighthub.{func.__module__}")
        
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            func_logger.info(
                f"{func.__name__} executed in {execution_time:.4f}s",
                extra={"execution_time": execution_time, "function": func.__name__},
            )
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            func_logger.error(
                f"{func.__name__} failed after {execution_time:.4f}s: {str(e)}",
                extra={"execution_time": execution_time, "function": func.__name__, "error": str(e)},
            )
            raise
    
    # Return appropriate wrapper based on function type
    import asyncio
    if asyncio.iscoroutinefunction(func):
        return async_wrapper
    return sync_wrapper


def log_api_call(api_name: str):
    """
    Decorator to log external API calls
    
    Usage:
        @log_api_call("OpenMeteo")
        async def fetch_weather():
            pass
    """
    def decorator(func):
        from functools import wraps
        
        @wraps(func)
        async def wrapper(*args, **kwargs):
            func_logger = logging.getLogger(f"insighthub.api.{api_name}")
            
            func_logger.info(
                f"API call started: {func.__name__}",
                extra={"api": api_name, "function": func.__name__},
            )
            
            try:
                result = await func(*args, **kwargs)
                func_logger.info(
                    f"API call succeeded: {func.__name__}",
                    extra={"api": api_name, "function": func.__name__, "status": "success"},
                )
                return result
            except Exception as e:
                func_logger.error(
                    f"API call failed: {func.__name__} - {str(e)}",
                    extra={"api": api_name, "function": func.__name__, "status": "failed", "error": str(e)},
                )
                raise
        
        return wrapper
    return decorator
