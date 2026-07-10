"""
Air Quality Index Pydantic Schemas
"""

from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class AirQualityResponse(BaseModel):
    """Air quality response schema"""
    id: UUID
    location_id: UUID
    measurement_time: datetime
    aqi: int
    aqi_category: Optional[str] = None
    pm2_5: Optional[float] = None
    pm10: Optional[float] = None
    o3: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None
    health_recommendation: Optional[str] = None
    
    class Config:
        from_attributes = True
