"""
Weather Pydantic Schemas
"""

from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime, date
from uuid import UUID


class WeatherCurrentResponse(BaseModel):
    """Current weather response schema"""
    id: UUID
    location_id: UUID
    temperature: float
    feels_like: Optional[float] = None
    temperature_min: Optional[float] = None
    temperature_max: Optional[float] = None
    pressure: Optional[int] = None
    humidity: Optional[int] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[int] = None
    weather_code: Optional[int] = None
    weather_description: Optional[str] = None
    observation_time: datetime
    
    class Config:
        from_attributes = True


class WeatherHourlyItem(BaseModel):
    """Single hourly forecast item"""
    forecast_time: datetime
    temperature: float
    feels_like: Optional[float] = None
    precipitation_probability: Optional[int] = None
    precipitation: float = 0
    weather_code: Optional[int] = None
    weather_description: Optional[str] = None
    
    class Config:
        from_attributes = True


class WeatherHourlyResponse(BaseModel):
    """Hourly forecast response schema"""
    location_id: UUID
    forecasts: List[WeatherHourlyItem]
    
    class Config:
        from_attributes = True


class WeatherDailyItem(BaseModel):
    """Single daily forecast item"""
    forecast_date: date
    temperature_max: float
    temperature_min: float
    precipitation_sum: float = 0
    weather_code: Optional[int] = None
    weather_description: Optional[str] = None
    
    class Config:
        from_attributes = True


class WeatherDailyResponse(BaseModel):
    """Daily forecast response schema"""
    location_id: UUID
    forecasts: List[WeatherDailyItem]
    
    class Config:
        from_attributes = True


class WeatherHistoryItem(BaseModel):
    """Single historical weather item"""
    record_date: date
    temperature: float
    temperature_min: Optional[float] = None
    temperature_max: Optional[float] = None
    precipitation: float = 0
    weather_code: Optional[int] = None
    
    class Config:
        from_attributes = True


class WeatherHistoryResponse(BaseModel):
    """Historical weather response schema"""
    location_id: UUID
    records: List[WeatherHistoryItem]
    
    class Config:
        from_attributes = True
