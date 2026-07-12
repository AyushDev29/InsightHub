"""
Country Model — Master list of all supported countries.
"""

from sqlalchemy import Column, String, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class Country(BaseModel):
    """
    Master table for countries supported by InsightHub.
    
    Each module (weather, earthquakes, crypto, etc.) can add data for any country.
    
    Columns
    -------
    name        : Full country name (e.g., "India", "United States")
    iso_code    : ISO-3166-1 alpha-2 code (e.g., "IN", "US")
    continent   : Continent name (e.g., "Asia", "North America")
    timezone    : Default IANA timezone (e.g., "Asia/Kolkata")
    is_active   : Whether this country is enabled for data collection
    """

    __tablename__ = "countries"

    name = Column(String(100), nullable=False, unique=True, index=True)
    iso_code = Column(String(2), nullable=False, unique=True, index=True)
    continent = Column(String(50), nullable=False)
    timezone = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Relationships
    cities = relationship(
        "City", back_populates="country", cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("iso_code", name="uq_country_iso_code"),
    )

    def __repr__(self) -> str:
        return f"<Country(name='{self.name}', iso_code='{self.iso_code}')>"
