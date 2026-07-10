"""
Open-Meteo API Service

Wraps all four Open-Meteo APIs with:
  - Async httpx calls
  - Automatic retry with exponential back-off
  - Structured logging
  - Clear error messages
"""

import asyncio
import logging
from datetime import date
from typing import Any, Dict

import httpx

from app.core.config import settings
from app.utils.exceptions import ExternalAPIError

logger = logging.getLogger("insighthub.openmeteo")


class OpenMeteoService:
    """Singleton service for all Open-Meteo API interactions."""

    # -------------------------------------------------------------------
    # Internal helpers
    # -------------------------------------------------------------------

    async def _get(
        self,
        base_url: str,
        path: str,
        params: Dict[str, Any],
        *,
        api_label: str,
    ) -> Dict[str, Any]:
        """
        Execute a GET request with retry logic.

        Retries up to OPEN_METEO_MAX_RETRIES times on network/5xx errors
        using simple exponential back-off (1 s, 2 s, 4 s …).
        """
        url = f"{base_url}{path}"
        last_exc: Exception | None = None

        for attempt in range(1, settings.OPEN_METEO_MAX_RETRIES + 1):
            try:
                async with httpx.AsyncClient(timeout=settings.OPEN_METEO_TIMEOUT) as client:
                    response = await client.get(url, params=params)
                    response.raise_for_status()
                    return response.json()
            except httpx.HTTPStatusError as exc:
                logger.warning(
                    f"[{api_label}] HTTP {exc.response.status_code} on attempt {attempt}: {exc}"
                )
                last_exc = exc
                # 4xx errors are client mistakes — don't retry
                if exc.response.status_code < 500:
                    break
            except httpx.RequestError as exc:
                logger.warning(f"[{api_label}] Network error on attempt {attempt}: {exc}")
                last_exc = exc

            if attempt < settings.OPEN_METEO_MAX_RETRIES:
                await asyncio.sleep(2 ** (attempt - 1))

        raise ExternalAPIError(api_label, str(last_exc))

    # -------------------------------------------------------------------
    # Public API methods
    # -------------------------------------------------------------------

    async def get_current_weather(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Fetch current weather snapshot.

        Uses Open-Meteo /forecast with `current_weather=true` and
        a rich `current` variable list for detailed metrics.
        """
        return await self._get(
            settings.OPEN_METEO_BASE_URL,
            "/forecast",
            {
                "latitude": latitude,
                "longitude": longitude,
                "current_weather": "true",
                "current": (
                    "temperature_2m,relative_humidity_2m,"
                    "apparent_temperature,surface_pressure,"
                    "wind_speed_10m,wind_direction_10m,wind_gusts_10m,"
                    "precipitation,rain,snowfall,cloud_cover,weather_code,"
                    "visibility"
                ),
                "temperature_unit": "celsius",
                "windspeed_unit": "ms",
                "timezone": "UTC",
            },
            api_label="forecast-current",
        )

    async def get_hourly_forecast(
        self,
        latitude: float,
        longitude: float,
        hours: int = 48,
    ) -> Dict[str, Any]:
        """Fetch hourly forecast for the next `hours` hours (max 168)."""
        forecast_days = min((hours // 24) + 1, 7)
        return await self._get(
            settings.OPEN_METEO_BASE_URL,
            "/forecast",
            {
                "latitude": latitude,
                "longitude": longitude,
                "hourly": (
                    "temperature_2m,apparent_temperature,"
                    "relative_humidity_2m,surface_pressure,"
                    "precipitation_probability,precipitation,"
                    "cloud_cover,weather_code,"
                    "wind_speed_10m,wind_direction_10m,wind_gusts_10m"
                ),
                "forecast_days": forecast_days,
                "temperature_unit": "celsius",
                "windspeed_unit": "ms",
                "timezone": "UTC",
            },
            api_label="forecast-hourly",
        )

    async def get_daily_forecast(
        self,
        latitude: float,
        longitude: float,
        days: int = 16,
    ) -> Dict[str, Any]:
        """Fetch daily forecast up to 16 days ahead."""
        return await self._get(
            settings.OPEN_METEO_BASE_URL,
            "/forecast",
            {
                "latitude": latitude,
                "longitude": longitude,
                "daily": (
                    "weather_code,"
                    "temperature_2m_max,temperature_2m_min,"
                    "apparent_temperature_max,apparent_temperature_min,"
                    "precipitation_sum,rain_sum,snowfall_sum,"
                    "precipitation_probability_max,"
                    "wind_speed_10m_max,wind_gusts_10m_max,"
                    "wind_direction_10m_dominant,"
                    "sunrise,sunset,daylight_duration"
                ),
                "forecast_days": min(days, 16),
                "temperature_unit": "celsius",
                "windspeed_unit": "ms",
                "timezone": "UTC",
            },
            api_label="forecast-daily",
        )

    async def get_historical_weather(
        self,
        latitude: float,
        longitude: float,
        start_date: date,
        end_date: date,
    ) -> Dict[str, Any]:
        """Fetch daily historical weather for the given date range."""
        return await self._get(
            settings.OPEN_METEO_ARCHIVE_URL,
            "/archive",
            {
                "latitude": latitude,
                "longitude": longitude,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "daily": (
                    "weather_code,"
                    "temperature_2m_max,temperature_2m_min,temperature_2m_mean,"
                    "precipitation_sum,rain_sum,snowfall_sum,"
                    "wind_speed_10m_max,wind_direction_10m_dominant"
                ),
                "temperature_unit": "celsius",
                "windspeed_unit": "ms",
                "timezone": "UTC",
            },
            api_label="archive",
        )

    async def get_air_quality(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Fetch current air quality data (European AQI + pollutants)."""
        return await self._get(
            settings.OPEN_METEO_AQI_URL,
            "/air-quality",
            {
                "latitude": latitude,
                "longitude": longitude,
                "current": (
                    "european_aqi,us_aqi,"
                    "pm10,pm2_5,"
                    "carbon_monoxide,nitrogen_dioxide,"
                    "sulphur_dioxide,ozone"
                ),
                "timezone": "UTC",
            },
            api_label="aqi",
        )

    async def search_location(self, name: str, count: int = 10) -> Dict[str, Any]:
        """Geocode a city name — returns up to `count` results."""
        return await self._get(
            settings.OPEN_METEO_GEOCODING_URL,
            "/search",
            {
                "name": name,
                "count": count,
                "language": "en",
                "format": "json",
            },
            api_label="geocoding",
        )


# Module-level singleton
openmeteo_service = OpenMeteoService()
