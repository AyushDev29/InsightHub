"""
Database Models

All SQLAlchemy ORM models for the application
"""

from app.models.country import Country
from app.models.location import City, Location  # Location is alias for backward compatibility
from app.models.weather import WeatherCurrent
from app.models.forecast import WeatherHourly, WeatherDaily, WeatherHistory
from app.models.aqi import AirQuality
from app.models.logs import APILog, SchedulerLog, RawAPIResponse
from app.models.current_data import CurrentData
from app.models.raw_response import RawResponse

__all__ = [
    "Country",
    "City",
    "Location",  # Backward compatibility
    "WeatherCurrent",
    "WeatherHourly",
    "WeatherDaily",
    "WeatherHistory",
    "AirQuality",
    "APILog",
    "SchedulerLog",
    "RawAPIResponse",
    "CurrentData",
    "RawResponse",
]
