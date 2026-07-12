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
from app.schemas.location import CountryResponse, CityResponse, CityDetailResponse
from app.schemas.current import CurrentDataResponse
from app.schemas.module import ModuleResponse, ModuleUpdateRequest

__all__ = [
    "WeatherCurrentResponse",
    "WeatherHourlyResponse",
    "WeatherDailyResponse",
    "WeatherHistoryResponse",
    "AirQualityResponse",
    "CountryResponse",
    "CityResponse",
    "CityDetailResponse",
    "CurrentDataResponse",
    "ModuleResponse",
    "ModuleUpdateRequest",
]
