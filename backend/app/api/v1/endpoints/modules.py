"""
Modules API v1

Endpoints for managing available data modules.
Allows admin to enable/disable modules and configure refresh intervals.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import DataModule
from app.schemas.module import ModuleResponse, ModuleUpdateRequest

router = APIRouter(
    prefix="/modules",
    tags=["modules"],
    responses={404: {"description": "Not found"}},
)


@router.get("", response_model=List[ModuleResponse])
def get_modules(
    enabled: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get all available modules.
    
    Query Parameters:
    - enabled: Filter by enabled status (optional)
    
    Returns list of modules.
    """
    query = db.query(DataModule)
    
    if enabled is not None:
        query = query.filter(DataModule.enabled == enabled)
    
    modules = query.order_by(DataModule.display_name).all()
    return modules


@router.get("/{module_name}", response_model=ModuleResponse)
def get_module(
    module_name: str,
    db: Session = Depends(get_db),
):
    """Get a specific module by name."""
    module = db.query(DataModule).filter(DataModule.name == module_name.lower()).first()
    
    if not module:
        raise HTTPException(status_code=404, detail=f"Module '{module_name}' not found")
    
    return module


@router.get("/enabled", response_model=List[ModuleResponse])
def get_enabled_modules(
    db: Session = Depends(get_db),
):
    """Get all enabled modules for the scheduler to fetch."""
    modules = (
        db.query(DataModule)
        .filter(DataModule.enabled == True)
        .order_by(DataModule.refresh_interval_minutes)
        .all()
    )
    return modules


@router.put("/{module_name}", response_model=ModuleResponse)
def update_module(
    module_name: str,
    update: ModuleUpdateRequest,
    db: Session = Depends(get_db),
):
    """
    Update module settings.
    
    Path Parameters:
    - module_name: Module name (e.g., 'weather')
    
    Body:
    - enabled: Enable/disable the module
    - refresh_interval_minutes: How often to fetch
    - config: Module-specific JSON configuration
    
    Returns updated module.
    """
    module = db.query(DataModule).filter(DataModule.name == module_name.lower()).first()
    
    if not module:
        raise HTTPException(status_code=404, detail=f"Module '{module_name}' not found")
    
    # Update fields if provided
    if update.enabled is not None:
        module.enabled = update.enabled
    
    if update.refresh_interval_minutes is not None:
        module.refresh_interval_minutes = update.refresh_interval_minutes
    
    if update.config is not None:
        module.config = update.config
    
    db.commit()
    db.refresh(module)
    
    return module
