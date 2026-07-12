"""
Current Data Schemas - Generic current data response model
"""

from typing import Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime


class CurrentDataResponse(BaseModel):
    """Response schema for CurrentData - generic current data for any module."""
    id: str
    city_id: str
    module: str
    data: Optional[Dict[str, Any]]  # Module-specific data
    fetched_at: Optional[int]  # Unix timestamp when fetched from API
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
