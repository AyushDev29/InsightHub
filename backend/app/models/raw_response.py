"""
RawResponse Model — Optional full API responses for debugging/analysis.

When scheduler fetches data, it can optionally store the full raw response.
Useful for:
- Debugging data transformation issues
- Analyzing API changes over time
- Replaying/re-processing data without refetching
"""

from sqlalchemy import Column, String, Integer, JSON, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class RawResponse(BaseModel):
    """
    Store complete API responses for future analysis.
    
    Columns
    -------
    city_id       : Foreign key to Cities table
    module        : Module name (weather, aqi, etc)
    response_type : 'current', 'forecast', 'archive'
    data          : Complete raw JSON from API
    response_time : HTTP response time in ms
    status_code   : HTTP status code (200, 429, 500, etc)
    """

    __tablename__ = "raw_responses"

    city_id = Column(String(36), ForeignKey("cities.id"), nullable=False, index=True)
    module = Column(String(50), nullable=False, index=True)
    response_type = Column(String(20), nullable=False)  # 'current', 'forecast', 'archive'
    data = Column(JSON, nullable=True)
    response_time = Column(Integer, nullable=True)  # milliseconds
    status_code = Column(Integer, nullable=True)

    # Relationships
    city = relationship("City")

    def __repr__(self) -> str:
        return f"<RawResponse(city_id='{self.city_id}', module='{self.module}', type='{self.response_type}')>"
