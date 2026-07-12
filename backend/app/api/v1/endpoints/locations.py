"""
Locations API v1

Endpoints for managing countries and cities.
Country-first architecture: data is organized by country, then city, then module.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import Country, City
from app.schemas.location import CountryResponse, CityResponse, CityDetailResponse

router = APIRouter(
    prefix="/locations",
    tags=["locations"],
    responses={404: {"description": "Not found"}},
)


# ============================================================================
# Countries
# ============================================================================

@router.get("/countries", response_model=List[CountryResponse])
def get_countries(
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get all supported countries.
    
    Query Parameters:
    - is_active: Filter by active status (optional)
    
    Returns list of countries with basic info.
    """
    query = db.query(Country)
    
    if is_active is not None:
        query = query.filter(Country.is_active == is_active)
    
    countries = query.order_by(Country.name).all()
    return countries


@router.get("/countries/{iso_code}", response_model=CountryResponse)
def get_country(
    iso_code: str,
    db: Session = Depends(get_db),
):
    """Get a specific country by ISO code (e.g., 'IN', 'US')."""
    country = db.query(Country).filter(Country.iso_code == iso_code.upper()).first()
    
    if not country:
        raise HTTPException(status_code=404, detail=f"Country {iso_code} not found")
    
    return country


# ============================================================================
# Cities
# ============================================================================

@router.get("/cities", response_model=List[CityResponse])
def get_cities(
    country_iso_code: Optional[str] = Query(None, description="ISO code of country (e.g., 'IN')"),
    is_active: Optional[bool] = Query(None),
    is_favorite: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get cities with optional filters.
    
    Query Parameters:
    - country_iso_code: Filter by country ISO code (required for normal use)
    - is_active: Filter by active status
    - is_favorite: Filter by favorite status
    
    Returns list of cities.
    """
    query = db.query(City).join(Country)
    
    if country_iso_code:
        query = query.filter(Country.iso_code == country_iso_code.upper())
    else:
        # Default to active cities if no country specified
        query = query.filter(City.is_active == True)
    
    if is_active is not None:
        query = query.filter(City.is_active == is_active)
    
    if is_favorite is not None:
        query = query.filter(City.is_favorite == is_favorite)
    
    cities = query.order_by(City.name).all()
    return cities


@router.get("/countries/{iso_code}/cities", response_model=List[CityResponse])
def get_cities_by_country(
    iso_code: str,
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get all cities in a specific country.
    
    Path Parameters:
    - iso_code: Country ISO code (e.g., 'IN', 'US')
    
    Query Parameters:
    - is_active: Filter by active status
    
    Returns list of cities in the country.
    """
    country = db.query(Country).filter(Country.iso_code == iso_code.upper()).first()
    
    if not country:
        raise HTTPException(status_code=404, detail=f"Country {iso_code} not found")
    
    query = db.query(City).filter(City.country_id == country.id)
    
    if is_active is not None:
        query = query.filter(City.is_active == is_active)
    
    cities = query.order_by(City.name).all()
    return cities


@router.get("/cities/{city_id}", response_model=CityDetailResponse)
def get_city(
    city_id: str,
    db: Session = Depends(get_db),
):
    """Get a specific city by ID with full details."""
    city = db.query(City).filter(City.id == city_id).first()
    
    if not city:
        raise HTTPException(status_code=404, detail=f"City {city_id} not found")
    
    return city


@router.put("/cities/{city_id}/favorite", response_model=CityResponse)
def toggle_favorite(
    city_id: str,
    is_favorite: bool = Query(..., description="True to favorite, False to unfavorite"),
    db: Session = Depends(get_db),
):
    """
    Toggle favorite status for a city.
    
    Path Parameters:
    - city_id: City ID
    
    Query Parameters:
    - is_favorite: True to add to favorites, False to remove
    
    Returns updated city.
    """
    city = db.query(City).filter(City.id == city_id).first()
    
    if not city:
        raise HTTPException(status_code=404, detail=f"City {city_id} not found")
    
    city.is_favorite = is_favorite
    db.commit()
    db.refresh(city)
    
    return city


@router.get("/cities/favorites", response_model=List[CityResponse])
def get_favorite_cities(
    country_iso_code: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get user's favorite cities.
    
    Query Parameters:
    - country_iso_code: Filter by country (optional)
    
    Returns list of favorite cities.
    """
    query = db.query(City).filter(City.is_favorite == True)
    
    if country_iso_code:
        query = query.join(Country).filter(Country.iso_code == country_iso_code.upper())
    
    cities = query.order_by(City.name).all()
    return cities
