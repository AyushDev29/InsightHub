"""
Common Pydantic schemas used across the application
"""

from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime


T = TypeVar("T")


class ResponseBase(BaseModel):
    """Base response model"""
    success: bool = True
    message: Optional[str] = None
    
    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response model"""
    items: List[T]
    total: int
    page: int
    page_size: int
    pages: int
    
    class Config:
        from_attributes = True


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    message: str
    details: Optional[dict] = None


class BaseSchema(BaseModel):
    """Base schema with common fields"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
