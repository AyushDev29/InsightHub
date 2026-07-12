"""
City Model — stores city / location master data.
Every city belongs to exactly one country.
Every module (weather, earthquakes, traffic, crypto) can have data for any city.
"""

from sqlalchemy import Column, String, Integer, Numeric, Boolean, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base import BaseModel, GUID


class City(BaseModel):
    """
    Master table for every city / location we track.
    
    Replaces the old 'Location' table with country-first design.
    All modules reference this table, not hardcoded locations.

    Columns
    -------
    country_id    : Foreign key to Countries table
    name          : City / place name
    state         : State / province (nullable)
    latitude      : -90 … +90
    longitude     : -180 … +180
    elevation     : Metres above sea level (nullable)
    timezone      : IANA tz string (can override country default)
    population    : City population (nullable)
    is_active     : Whether we actively fetch data for this city
    is_favorite   : User favorite flag
    """

    __tablename__ = "cities"

    country_id = Column(GUID(), ForeignKey("countries.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    state = Column(String(100), nullable=True)

    latitude = Column(Numeric(10, 7), nullable=False)
    longitude = Column(Numeric(10, 7), nullable=False)
    elevation = Column(Integer, nullable=True)

    timezone = Column(String(100), nullable=True)
    population = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    is_favorite = Column(Boolean, default=False, nullable=False, index=True)

    # Relationships
    country = relationship("Country", back_populates="cities")
    
    weather_current = relationship(
        "WeatherCurrent", back_populates="city", cascade="all, delete-orphan"
    )
    weather_hourly = relationship(
        "WeatherHourly", back_populates="location", cascade="all, delete-orphan", foreign_keys="WeatherHourly.location_id", viewonly=True
    )
    weather_daily = relationship(
        "WeatherDaily", back_populates="location", cascade="all, delete-orphan", foreign_keys="WeatherDaily.location_id", viewonly=True
    )
    weather_history = relationship(
        "WeatherHistory", back_populates="location", cascade="all, delete-orphan", foreign_keys="WeatherHistory.location_id", viewonly=True
    )
    air_quality = relationship(
        "AirQuality", back_populates="city", cascade="all, delete-orphan"
    )
    current_data = relationship(
        "CurrentData", back_populates="city", cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("latitude", "longitude", name="uq_city_coords"),
        CheckConstraint("latitude  >= -90  AND latitude  <= 90", name="ck_latitude"),
        CheckConstraint("longitude >= -180 AND longitude <= 180", name="ck_longitude"),
    )

    def __repr__(self) -> str:
        return f"<City(name='{self.name}', country_id='{self.country_id}')>"


# Keep Location as alias for backward compatibility during migration
Location = City

