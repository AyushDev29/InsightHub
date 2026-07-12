"""
Module Registry Model — Master list of all data modules.

Every module (weather, earthquake, crypto, stocks, etc.) registers itself here.
The scheduler uses this to determine what to fetch and how often.
"""

from sqlalchemy import Column, String, Integer, Boolean

from app.db.base import BaseModel


class DataModule(BaseModel):
    """
    Registry of all available modules.
    
    Instead of hardcoding FetchWeather(), FetchAQI(), etc.,
    the scheduler iterates through enabled modules and calls fetch(module).
    
    Columns
    -------
    name                : Internal identifier (weather, aqi, earthquake, crypto)
    display_name        : User-facing name (Weather, Air Quality, Earthquakes, Cryptocurrency)
    description         : Module description
    icon_name           : Icon to display (weather-cloud, air-quality, etc)
    api_provider        : External API provider (Open-Meteo, AirVisual, USGS, etc)
    status              : active, inactive, beta, or deprecated
    enabled             : Whether to fetch this module
    refresh_interval_minutes : How often to update (60 for hourly, 1440 for daily)
    supports_history    : Whether module has historical data
    supports_prediction : Whether module has prediction/forecast data
    supports_current    : Whether module has current/real-time data
    config              : JSON config for module-specific settings
    """

    __tablename__ = "data_modules"

    name = Column(String(50), nullable=False, unique=True, index=True)
    display_name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    icon_name = Column(String(50), nullable=True)
    
    api_provider = Column(String(100), nullable=True)
    status = Column(String(20), default="active", nullable=False)  # active, inactive, beta, deprecated
    enabled = Column(Boolean, default=True, nullable=False, index=True)
    
    refresh_interval_minutes = Column(Integer, default=60, nullable=False)
    
    supports_history = Column(Boolean, default=False, nullable=False)
    supports_prediction = Column(Boolean, default=False, nullable=False)
    supports_current = Column(Boolean, default=True, nullable=False)
    
    config = Column(String(2000), nullable=True)  # JSON string with module-specific config

    def __repr__(self) -> str:
        return f"<DataModule(name='{self.name}', display_name='{self.display_name}', enabled={self.enabled})>"
