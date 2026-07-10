"""
Forecast Models: hourly (48 h), daily (16 d), history archive.
"""

from sqlalchemy import (
    Column, Integer, Numeric, DateTime, Date, String,
    ForeignKey, CheckConstraint, UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.base import BaseModel, GUID


class WeatherHourly(BaseModel):
    """48-hour hourly forecast."""

    __tablename__ = "weather_hourly"

    location_id   = Column(GUID(), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    forecast_time = Column(DateTime(timezone=True), nullable=False, index=True)

    temperature              = Column(Numeric(5, 2), nullable=False)
    feels_like               = Column(Numeric(5, 2), nullable=True)
    pressure                 = Column(Integer,       nullable=True)
    humidity                 = Column(Integer,       nullable=True)
    wind_speed               = Column(Numeric(5, 2), nullable=True)
    wind_direction           = Column(Integer,       nullable=True)
    wind_gust                = Column(Numeric(5, 2), nullable=True)
    precipitation_probability = Column(Integer,      nullable=True)   # %
    precipitation            = Column(Numeric(6, 2), default=0, nullable=False)
    cloudiness               = Column(Integer,       nullable=True)
    weather_code             = Column(Integer,       nullable=True)
    weather_description      = Column(String(255),   nullable=True)

    fetched_at = Column(DateTime(timezone=True), nullable=False)

    location = relationship("Location", back_populates="weather_hourly")

    __table_args__ = (
        CheckConstraint(
            "precipitation_probability IS NULL OR "
            "(precipitation_probability >= 0 AND precipitation_probability <= 100)",
            name="ck_hourly_precip_prob",
        ),
    )


class WeatherDaily(BaseModel):
    """16-day daily forecast."""

    __tablename__ = "weather_daily"

    location_id   = Column(GUID(), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    forecast_date = Column(Date, nullable=False, index=True)

    temperature_max             = Column(Numeric(5, 2), nullable=False)
    temperature_min             = Column(Numeric(5, 2), nullable=False)
    temperature_avg             = Column(Numeric(5, 2), nullable=True)
    pressure_avg                = Column(Integer,       nullable=True)
    humidity_avg                = Column(Integer,       nullable=True)
    wind_speed_max              = Column(Numeric(5, 2), nullable=True)
    wind_speed_avg              = Column(Numeric(5, 2), nullable=True)
    wind_direction_dominant     = Column(Integer,       nullable=True)
    precipitation_sum           = Column(Numeric(6, 2), default=0, nullable=False)
    precipitation_probability_max = Column(Integer,     nullable=True)
    rain_sum                    = Column(Numeric(6, 2), default=0, nullable=False)
    snow_sum                    = Column(Numeric(6, 2), default=0, nullable=False)
    weather_code                = Column(Integer,       nullable=True)
    weather_description         = Column(String(255),   nullable=True)
    sunrise                     = Column(DateTime(timezone=True), nullable=True)
    sunset                      = Column(DateTime(timezone=True), nullable=True)
    daylight_duration           = Column(Integer,       nullable=True)   # seconds

    fetched_at = Column(DateTime(timezone=True), nullable=False)

    location = relationship("Location", back_populates="weather_daily")

    __table_args__ = (
        UniqueConstraint("location_id", "forecast_date", name="uq_weather_daily_loc_date"),
        CheckConstraint("temperature_max >= temperature_min", name="ck_daily_temp_range"),
    )


class WeatherHistory(BaseModel):
    """Historical weather archive (daily granularity)."""

    __tablename__ = "weather_history"

    location_id  = Column(GUID(), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    record_date  = Column(Date,    nullable=False, index=True)
    record_hour  = Column(Integer, nullable=True)   # 0-23 for hourly; NULL = daily

    temperature      = Column(Numeric(5, 2), nullable=False)
    temperature_min  = Column(Numeric(5, 2), nullable=True)
    temperature_max  = Column(Numeric(5, 2), nullable=True)
    pressure         = Column(Integer,       nullable=True)
    humidity         = Column(Integer,       nullable=True)
    wind_speed       = Column(Numeric(5, 2), nullable=True)
    wind_direction   = Column(Integer,       nullable=True)
    precipitation    = Column(Numeric(6, 2), default=0, nullable=False)
    rain             = Column(Numeric(6, 2), default=0, nullable=False)
    snow             = Column(Numeric(6, 2), default=0, nullable=False)
    cloudiness       = Column(Integer,       nullable=True)
    weather_code     = Column(Integer,       nullable=True)
    weather_description = Column(String(255), nullable=True)

    location = relationship("Location", back_populates="weather_history")

    __table_args__ = (
        CheckConstraint(
            "record_hour IS NULL OR (record_hour >= 0 AND record_hour <= 23)",
            name="ck_record_hour",
        ),
    )
