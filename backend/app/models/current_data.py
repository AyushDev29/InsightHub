"""
CurrentData Model — Generic storage for current data from any module.

Instead of separate weather_current, aqi tables, store everything generically.
This allows ANY module to add current data without database changes.

Example:
  module='weather' → current temperature, humidity, etc
  module='earthquake' → recent earthquake data
  module='crypto' → current BTC/ETH prices
  module='traffic' → current traffic congestion
"""

from sqlalchemy import Column, String, Integer, JSON, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base import BaseModel, GUID


class CurrentData(BaseModel):
    """
    Generic current data for any module.
    
    Replaces separate weather_current, aqi tables.
    Stores ONLY current snapshot, not history.
    
    Columns
    -------
    city_id       : Foreign key to Cities table
    module        : Module name (weather, aqi, earthquake, traffic, crypto)
    data          : JSON blob with module-specific current data
    fetched_at    : When this data was fetched from source API
    """

    __tablename__ = "current_data"

    city_id = Column(GUID(), ForeignKey("cities.id"), nullable=False, index=True)
    module = Column(String(50), nullable=False, index=True)  # 'weather', 'aqi', etc
    data = Column(JSON, nullable=True)  # Module-specific data
    fetched_at = Column(Integer, nullable=True)  # Unix timestamp from API

    # Relationships
    city = relationship("City", back_populates="current_data")

    __table_args__ = (
        # One record per city per module
        UniqueConstraint("city_id", "module", name="uq_current_data_city_module"),
    )

    def __repr__(self) -> str:
        return f"<CurrentData(city_id='{self.city_id}', module='{self.module}')>"
