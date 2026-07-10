"""
Weather Repository — current conditions, forecasts, history, AQI.
"""

from datetime import date, datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.models.weather import WeatherCurrent
from app.models.forecast import WeatherHourly, WeatherDaily, WeatherHistory
from app.models.aqi import AirQuality
from app.repositories.base import BaseRepository


class WeatherCurrentRepository(BaseRepository[WeatherCurrent]):

    def __init__(self, db: AsyncSession):
        super().__init__(WeatherCurrent, db)

    async def get_latest(self, location_id) -> Optional[WeatherCurrent]:
        result = await self.db.execute(
            select(WeatherCurrent)
            .where(WeatherCurrent.location_id == location_id)
            .order_by(desc(WeatherCurrent.observation_time))
            .limit(1)
        )
        return result.scalar_one_or_none()


class WeatherHourlyRepository(BaseRepository[WeatherHourly]):

    def __init__(self, db: AsyncSession):
        super().__init__(WeatherHourly, db)

    async def get_upcoming(self, location_id, hours: int = 48) -> List[WeatherHourly]:
        now = datetime.now(timezone.utc)
        result = await self.db.execute(
            select(WeatherHourly)
            .where(
                WeatherHourly.location_id == location_id,
                WeatherHourly.forecast_time >= now,
            )
            .order_by(WeatherHourly.forecast_time)
            .limit(hours)
        )
        return list(result.scalars().all())


class WeatherDailyRepository(BaseRepository[WeatherDaily]):

    def __init__(self, db: AsyncSession):
        super().__init__(WeatherDaily, db)

    async def get_upcoming(self, location_id, days: int = 16) -> List[WeatherDaily]:
        today = date.today()
        result = await self.db.execute(
            select(WeatherDaily)
            .where(
                WeatherDaily.location_id == location_id,
                WeatherDaily.forecast_date >= today,
            )
            .order_by(WeatherDaily.forecast_date)
            .limit(days)
        )
        return list(result.scalars().all())


class WeatherHistoryRepository(BaseRepository[WeatherHistory]):

    def __init__(self, db: AsyncSession):
        super().__init__(WeatherHistory, db)

    async def get_range(
        self, location_id, start_date: date, end_date: date
    ) -> List[WeatherHistory]:
        result = await self.db.execute(
            select(WeatherHistory)
            .where(
                WeatherHistory.location_id == location_id,
                WeatherHistory.record_date >= start_date,
                WeatherHistory.record_date <= end_date,
            )
            .order_by(WeatherHistory.record_date)
        )
        return list(result.scalars().all())


class AirQualityRepository(BaseRepository[AirQuality]):

    def __init__(self, db: AsyncSession):
        super().__init__(AirQuality, db)

    async def get_latest(self, location_id) -> Optional[AirQuality]:
        result = await self.db.execute(
            select(AirQuality)
            .where(AirQuality.location_id == location_id)
            .order_by(desc(AirQuality.measurement_time))
            .limit(1)
        )
        return result.scalar_one_or_none()
