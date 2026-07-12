"""
WeatherCurrent Model — real-time weather snapshot per city.
"""

from sqlalchemy import (
    Column, Integer, Numeric, DateTime, String,
    ForeignKey, CheckConstraint, UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.base import BaseModel, GUID


class WeatherCurrent(BaseModel):
    """
    Stores the latest weather observation for a city.

    All temperatures are Celsius, wind speed m/s, pressure hPa,
    precipitation mm, distances metres.
    """

    __tablename__ = "weather_current"

    city_id = Column(
        String(36), ForeignKey("cities.id", ondelete="CASCADE"),
        nullable=False, index=True
    )

    # Temperature
    temperature      = Column(Numeric(5, 2), nullable=False)
    feels_like       = Column(Numeric(5, 2), nullable=True)
    temperature_min  = Column(Numeric(5, 2), nullable=True)
    temperature_max  = Column(Numeric(5, 2), nullable=True)

    # Atmospheric
    pressure   = Column(Integer, nullable=True)   # hPa
    humidity   = Column(Integer, nullable=True)   # %
    visibility = Column(Integer, nullable=True)   # metres

    # Wind
    wind_speed     = Column(Numeric(5, 2), nullable=True)   # m/s
    wind_direction = Column(Integer,       nullable=True)   # degrees 0-360
    wind_gust      = Column(Numeric(5, 2), nullable=True)   # m/s

    # Precipitation
    precipitation = Column(Numeric(6, 2), default=0, nullable=False)  # mm
    rain          = Column(Numeric(6, 2), default=0, nullable=False)
    snow          = Column(Numeric(6, 2), default=0, nullable=False)

    # Sky / condition
    cloudiness          = Column(Integer,      nullable=True)   # %
    weather_code        = Column(Integer,      nullable=True)   # WMO code
    weather_description = Column(String(255),  nullable=True)

    # Sun
    sunrise = Column(DateTime(timezone=True), nullable=True)
    sunset  = Column(DateTime(timezone=True), nullable=True)

    # When this observation was taken (not when we stored it)
    observation_time = Column(DateTime(timezone=True), nullable=False, index=True)

    # Relationship (backward compatible: 'location' alias for 'city')
    city = relationship("City", back_populates="weather_current")
    
    @property
    def location(self):
        """Backward compatibility alias."""
        return self.city

    __table_args__ = (
        UniqueConstraint("city_id", "observation_time", name="uq_weather_current_city_time"),
        CheckConstraint("temperature >= -100 AND temperature <= 60", name="ck_temperature"),
        CheckConstraint("humidity    >= 0    AND humidity    <= 100", name="ck_humidity"),
        CheckConstraint("cloudiness  >= 0    AND cloudiness  <= 100", name="ck_cloudiness"),
    )

    def __repr__(self) -> str:
        return f"<WeatherCurrent(city_id={self.city_id}, temp={self.temperature}°C)>"
