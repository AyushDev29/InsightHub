"""
Air Quality Index (AQI) Model.
"""

from sqlalchemy import (
    Column, Integer, Numeric, DateTime, String,
    ForeignKey, CheckConstraint, UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class AirQuality(BaseModel):
    """
    Air quality measurement for a city at a point in time.

    AQI scale used: European AQI (0 – 500).
    Pollutant concentrations are stored in µg/m³.
    """

    __tablename__ = "air_quality"

    city_id          = Column(String(36), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    measurement_time = Column(DateTime(timezone=True), nullable=False, index=True)

    # Index value + category
    aqi          = Column(Integer,     nullable=False, index=True)
    aqi_category = Column(String(50),  nullable=True)

    # Individual pollutants (µg/m³)
    pm2_5 = Column(Numeric(8, 2), nullable=True)
    pm10  = Column(Numeric(8, 2), nullable=True)
    o3    = Column(Numeric(8, 2), nullable=True)
    no2   = Column(Numeric(8, 2), nullable=True)
    so2   = Column(Numeric(8, 2), nullable=True)
    co    = Column(Numeric(8, 2), nullable=True)

    fetched_at = Column(DateTime(timezone=True), nullable=False)

    city = relationship("City", back_populates="air_quality")
    
    @property
    def location(self):
        """Backward compatibility alias."""
        return self.city

    __table_args__ = (
        UniqueConstraint("city_id", "measurement_time", name="uq_aqi_city_time"),
        CheckConstraint("aqi >= 0 AND aqi <= 500", name="ck_aqi"),
    )

    @property
    def health_recommendation(self) -> str:
        """Plain-English health advice based on European AQI band."""
        if self.aqi <= 20:
            return "Air quality is Good. Perfect for all outdoor activities."
        if self.aqi <= 40:
            return "Air quality is Fair. Sensitive individuals should limit prolonged outdoor exertion."
        if self.aqi <= 60:
            return "Air quality is Moderate. People with respiratory conditions should reduce outdoor time."
        if self.aqi <= 80:
            return "Air quality is Poor. Everyone should reduce strenuous outdoor activity."
        if self.aqi <= 100:
            return "Air quality is Very Poor. Avoid outdoor activities where possible."
        return "Air quality is Extremely Poor. Stay indoors and keep windows closed."

    def __repr__(self) -> str:
        return f"<AirQuality(city_id={self.city_id}, aqi={self.aqi}, category={self.aqi_category})>"
