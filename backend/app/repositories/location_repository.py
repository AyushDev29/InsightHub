"""
Location Repository — all Location-related DB operations.
"""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.location import Location
from app.repositories.base import BaseRepository


class LocationRepository(BaseRepository[Location]):

    def __init__(self, db: AsyncSession):
        super().__init__(Location, db)

    async def get_by_name(self, name: str) -> Optional[Location]:
        result = await self.db.execute(
            select(Location).where(Location.name.ilike(f"%{name}%"))
        )
        return result.scalar_one_or_none()

    async def get_by_coords(self, lat: float, lon: float) -> Optional[Location]:
        result = await self.db.execute(
            select(Location).where(
                Location.latitude == lat,
                Location.longitude == lon,
            )
        )
        return result.scalar_one_or_none()

    async def get_active_locations(self) -> List[Location]:
        result = await self.db.execute(
            select(Location).where(Location.is_active.is_(True))
        )
        return list(result.scalars().all())

    async def upsert(self, data: dict) -> Location:
        """Insert or update a location by (latitude, longitude)."""
        existing = await self.get_by_coords(data["latitude"], data["longitude"])
        if existing:
            for key, value in data.items():
                setattr(existing, key, value)
            await self.db.flush()
            await self.db.refresh(existing)
            return existing
        location = Location(**data)
        return await self.create(location)
