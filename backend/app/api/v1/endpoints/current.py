"""
Current Data API v1

Endpoints for accessing current real-time data from any module.
Generic architecture: same endpoint works for weather, AQI, earthquake, traffic, crypto, etc.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import City, CurrentData
from app.schemas.current import CurrentDataResponse

router = APIRouter(
    prefix="/current",
    tags=["current"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{city_id}", response_model=Dict[str, Optional[CurrentDataResponse]])
def get_current_all_modules(
    city_id: str,
    db: Session = Depends(get_db),
):
    """
    Get current data for a city from ALL modules.
    
    Returns a dict: {module_name: CurrentDataResponse}
    
    Example response:
    {
        "weather": {...},
        "aqi": {...},
        "earthquake": {...},
        "crypto": {...}
    }
    """
    # Verify city exists
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail=f"City {city_id} not found")
    
    # Get all current data for this city
    current_data = db.query(CurrentData).filter(CurrentData.city_id == city_id).all()
    
    # Format as dict: {module: data}
    result = {}
    for data in current_data:
        result[data.module] = data
    
    return result


@router.get("/{city_id}/{module}", response_model=CurrentDataResponse)
def get_current_module(
    city_id: str,
    module: str,
    db: Session = Depends(get_db),
):
    """
    Get current data for a city from a specific module.
    
    Path Parameters:
    - city_id: City ID
    - module: Module name (e.g., 'weather', 'aqi', 'earthquake', 'crypto')
    
    Returns current data for that module or 404 if not found.
    """
    # Verify city exists
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail=f"City {city_id} not found")
    
    # Get current data
    current_data = (
        db.query(CurrentData)
        .filter(CurrentData.city_id == city_id)
        .filter(CurrentData.module == module.lower())
        .first()
    )
    
    if not current_data:
        raise HTTPException(
            status_code=404,
            detail=f"No current data for module '{module}' in city {city_id}"
        )
    
    return current_data


@router.get("/country/{iso_code}", response_model=Dict[str, Dict[str, Optional[CurrentDataResponse]]])
def get_current_all_cities_country(
    iso_code: str,
    module: Optional[str] = Query(None, description="Filter by module (optional)"),
    db: Session = Depends(get_db),
):
    """
    Get current data for ALL cities in a country.
    
    Path Parameters:
    - iso_code: Country ISO code (e.g., 'IN', 'US')
    
    Query Parameters:
    - module: Optional filter for specific module
    
    Returns nested dict: {city_id: {module: CurrentDataResponse}}
    
    Example:
    {
        "city-1": {"weather": {...}, "aqi": {...}},
        "city-2": {"weather": {...}, "aqi": {...}}
    }
    """
    # Get all cities in country
    from app.models import Country
    country = db.query(Country).filter(Country.iso_code == iso_code.upper()).first()
    if not country:
        raise HTTPException(status_code=404, detail=f"Country {iso_code} not found")
    
    cities = db.query(City).filter(City.country_id == country.id).all()
    if not cities:
        raise HTTPException(status_code=404, detail=f"No cities found for country {iso_code}")
    
    result = {}
    for city in cities:
        query = db.query(CurrentData).filter(CurrentData.city_id == city.id)
        
        if module:
            query = query.filter(CurrentData.module == module.lower())
        
        current_data = query.all()
        result[city.id] = {}
        
        for data in current_data:
            result[city.id][data.module] = data
    
    return result


@router.post("/{city_id}/{module}")
def create_or_update_current(
    city_id: str,
    module: str,
    data: Dict[str, Any],
    fetched_at: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Create or update current data for a city module.
    
    Path Parameters:
    - city_id: City ID
    - module: Module name
    
    Body:
    - data: JSON data object with module-specific fields
    - fetched_at: Unix timestamp when data was fetched
    
    Returns created/updated CurrentData record.
    """
    # Verify city exists
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail=f"City {city_id} not found")
    
    # Find or create current data
    current_data = (
        db.query(CurrentData)
        .filter(CurrentData.city_id == city_id)
        .filter(CurrentData.module == module.lower())
        .first()
    )
    
    if current_data:
        # Update existing
        current_data.data = data
        if fetched_at:
            current_data.fetched_at = fetched_at
    else:
        # Create new
        current_data = CurrentData(
            city_id=city_id,
            module=module.lower(),
            data=data,
            fetched_at=fetched_at,
        )
        db.add(current_data)
    
    db.commit()
    db.refresh(current_data)
    
    return {
        "status": "success",
        "city_id": city_id,
        "module": module,
        "message": "Current data updated"
    }
