"""
Location Model — stores city / location master data.
"""

from sqlalchemy import Column, String, Integer, Numeric, Boolean, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class Location(BaseModel):
    """
    Master table for every geographic location we track.

    Columns
    -------
    name         : City / place name.
    country      : Full country name.
    country_code : ISO-3166-1 alpha-2 code (e.g. "US").
    latitude     : -90 … +90.
    longitude    : -180 … +180.
    elevation    : Metres above sea level (nullable).
    timezone     : IANA tz string e.g. "America/New_York".
    population   : City population (nullable).
    is_active    : Whether we actively fetch data for this location.
    """

    __tablename__ = "locations"

    name         = Column(String(255), nullable=False, index=True)
    country      = Column(String(100), nullable=False)
    country_code = Column(String(2),   nullable=False, index=True)

    latitude  = Column(Numeric(10, 7), nullable=False)
    longitude = Column(Numeric(10, 7), nullable=False)
    elevation = Column(Integer,        nullable=True)

    timezone   = Column(String(100), nullable=True)
    population = Column(Integer,     nullable=True)
    is_active  = Column(Boolean,     default=True, nullable=False, index=True)

    # Relationships
    weather_current = relationship(
        "WeatherCurrent", back_populates="location", cascade="all, delete-orphan"
    )
    weather_hourly = relationship(
        "WeatherHourly",  back_populates="location", cascade="all, delete-orphan"
    )
    weather_daily = relationship(
        "WeatherDaily",   back_populates="location", cascade="all, delete-orphan"
    )
    weather_history = relationship(
        "WeatherHistory", back_populates="location", cascade="all, delete-orphan"
    )
    air_quality = relationship(
        "AirQuality",     back_populates="location", cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("latitude", "longitude", name="uq_location_coords"),
        CheckConstraint("latitude  >= -90  AND latitude  <= 90",  name="ck_latitude"),
        CheckConstraint("longitude >= -180 AND longitude <= 180", name="ck_longitude"),
    )

    def __repr__(self) -> str:
        return f"<Location(name='{self.name}', country='{self.country_code}')>"
