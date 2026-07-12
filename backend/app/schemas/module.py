"""
Module Schemas - Data module registry responses
"""

from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ModuleResponse(BaseModel):
    """Response schema for DataModule."""
    id: str
    name: str
    display_name: str
    description: Optional[str]
    icon_name: Optional[str]
    api_provider: Optional[str]
    status: str
    enabled: bool
    refresh_interval_minutes: int
    supports_history: bool
    supports_prediction: bool
    supports_current: bool
    config: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ModuleUpdateRequest(BaseModel):
    """Request schema for updating module settings."""
    enabled: Optional[bool] = None
    refresh_interval_minutes: Optional[int] = None
    config: Optional[str] = None

    class Config:
        from_attributes = True
