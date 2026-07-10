"""
Location Pydantic Schemas
"""

from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID


class LocationResponse(BaseModel):
    """Location response schema"""
    id: UUID
    name: str
    country: str
    country_code: str
    latitude: float
    longitude: float
    elevation: Optional[int] = None
    timezone: Optional[str] = None
    population: Optional[int] = None
    
    class Config:
        from_attributes = True


class LocationSearchItem(BaseModel):
    """Single location search result"""
    name: str
    country: str
    country_code: str
    latitude: float
    longitude: float
    population: Optional[int] = None


class LocationSearchResponse(BaseModel):
    """Location search response schema"""
    results: List[LocationSearchItem]
    count: int
