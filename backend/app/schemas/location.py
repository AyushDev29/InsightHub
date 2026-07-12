"""
Location Schemas - Country and City response models
"""

from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class CountryResponse(BaseModel):
    """Response schema for Country."""
    id: str
    name: str
    iso_code: str
    continent: str
    timezone: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CityResponse(BaseModel):
    """Response schema for City (basic info)."""
    id: str
    name: str
    state: Optional[str]
    latitude: float
    longitude: float
    elevation: Optional[int]
    population: Optional[int]
    is_active: bool
    is_favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CityDetailResponse(CityResponse):
    """Response schema for City with country details."""
    country_id: str
    timezone: Optional[str]
    country: CountryResponse

    class Config:
        from_attributes = True
