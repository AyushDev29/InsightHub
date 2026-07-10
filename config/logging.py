"""
Logging Configuration
Sets up application-wide logging with file and console handlers
"""
import logging
import logging.handlers
import sys
from pathlib import Path
from datetime import datetime

from config.settings import LOGGING, BASE_DIR


def setup_logging(name: str = None) -> logging.Logger:
    """
    Setup and configure logging for the application
    
    Args:
        name: Logger name (typically __name__ of the module)
    
    Returns:
        Configured logger instance
    """
    # Create logs directory if it doesn't exist
    log_dir = BASE_DIR / 'logs'
    log_dir.mkdir(exist_ok=True)
    
    # Get logger
    logger = logging.getLogger(name or __name__)
    log_level = getattr(logging, LOGGING['level'].upper(), logging.INFO)
    logger.setLevel(log_level)
    
    # Remove existing handlers
    logger.handlers = []
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        fmt='%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    simple_formatter = logging.Formatter(
        fmt='%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(simple_formatter)
    logger.addHandler(console_handler)
    
    # File Handler (Rotating)
    log_file = Path(LOGGING['file'])
    file_handler = logging.handlers.RotatingFileHandler(
        filename=log_file,
        maxBytes=LOGGING['max_bytes'],
        backupCount=LOGGING['backup_count'],
        encoding='utf-8'
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(detailed_formatter)
    logger.addHandler(file_handler)
    
    # Error File Handler (separate file for errors)
    error_log_file = log_dir / 'error.log'
    error_handler = logging.handlers.RotatingFileHandler(
        filename=error_log_file,
        maxBytes=LOGGING['max_bytes'],
        backupCount=LOGGING['backup_count'],
        encoding='utf-8'
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(detailed_formatter)
    logger.addHandler(error_handler)
    
    # Prevent propagation to root logger
    logger.propagate = False
    
    return logger


def get_logger(name: str = None) -> logging.Logger:
    """
    Get or create a logger instance
    
    Args:
        name: Logger name (typically __name__ of the module)
    
    Returns:
        Logger instance
    """
    return setup_logging(name)


class LoggerMixin:
    """
    Mixin class to add logging capabilities to any class
    Usage: class MyClass(LoggerMixin): ...
    """
    
    @property
    def logger(self) -> logging.Logger:
        """Get logger for the current class"""
        if not hasattr(self, '_logger'):
            self._logger = get_logger(self.__class__.__name__)
        return self._logger


def log_execution_time(func):
    """
    Decorator to log function execution time
    
    Usage:
        @log_execution_time
        def my_function():
            pass
    """
    from functools import wraps
    import time
    
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger = get_logger(func.__module__)
        start_time = time.time()
        
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            logger.info(
                f"{func.__name__} executed in {execution_time:.4f} seconds"
            )
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(
                f"{func.__name__} failed after {execution_time:.4f} seconds: {str(e)}"
            )
            raise
    
    return wrapper


def log_api_call(func):
    """
    Decorator to log API calls with request/response details
    
    Usage:
        @log_api_call
        def api_endpoint():
            pass
    """
    from functools import wraps
    
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger = get_logger(func.__module__)
        
        # Log request
        logger.info(f"API Call: {func.__name__} - Args: {args}, Kwargs: {kwargs}")
        
        try:
            result = func(*args, **kwargs)
            logger.info(f"API Response: {func.__name__} - Success")
            return result
        except Exception as e:
            logger.error(f"API Error: {func.__name__} - {str(e)}")
            raise
    
    return wrapper


# Initialize default application logger
app_logger = setup_logging('InsightHub-AI')


if __name__ == '__main__':
    # Test logging configuration
    logger = get_logger(__name__)
    
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    logger.critical("This is a critical message")
    
    print("Logging test completed. Check logs/ directory for output.")
