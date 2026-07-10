"""
Pydantic Schemas for Request/Response validation
"""

from app.schemas.weather import (
    WeatherCurrentResponse,
    WeatherHourlyResponse,
    WeatherDailyResponse,
    WeatherHistoryResponse,
)
from app.schemas.aqi import AirQualityResponse
from app.schemas.location import LocationResponse, LocationSearchResponse

__all__ = [
    "WeatherCurrentResponse",
    "WeatherHourlyResponse",
    "WeatherDailyResponse",
    "WeatherHistoryResponse",
    "AirQualityResponse",
    "LocationResponse",
    "LocationSearchResponse",
]
