"""
API v1 Router

Aggregates all API v1 endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import weather, locations, current, modules

# Create API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(weather.router)
api_router.include_router(locations.router)
api_router.include_router(current.router)
api_router.include_router(modules.router)

# Add more routers here as they are created
# api_router.include_router(analytics.router)
