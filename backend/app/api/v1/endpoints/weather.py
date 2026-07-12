"""
Weather API Endpoints — v1

Endpoints
---------
GET /api/v1/weather/current      Current conditions
GET /api/v1/weather/hourly       48-hour hourly forecast
GET /api/v1/weather/daily        16-day daily forecast
GET /api/v1/weather/history      Historical daily data
GET /api/v1/weather/air-quality  AQI + pollutants
GET /api/v1/weather/search       Geocode a city name
"""

from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query

from app.core.logging import logger
from app.services.openmeteo_service import openmeteo_service
from app.utils.exceptions import ExternalAPIError
from app.utils.weather_codes import describe_wmo
from app.utils.formatters import wind_direction_label

router = APIRouter(prefix="/weather", tags=["Weather"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _safe(lst: list | None, index: int, default=None):
    """Return lst[index] if it exists, otherwise default."""
    if lst is None:
        return default
    try:
        return lst[index]
    except IndexError:
        return default


def _aqi_category(aqi: int | None) -> str:
    """European AQI band → label."""
    if aqi is None:
        return "Unknown"
    if aqi <= 20:
        return "Good"
    if aqi <= 40:
        return "Fair"
    if aqi <= 60:
        return "Moderate"
    if aqi <= 80:
        return "Poor"
    if aqi <= 100:
        return "Very Poor"
    return "Extremely Poor"


def _aqi_health(aqi: int | None) -> str:
    """Short health recommendation."""
    if aqi is None:
        return "No data available."
    if aqi <= 20:
        return "Air quality is good. Enjoy outdoor activities."
    if aqi <= 40:
        return "Air quality is fair. Sensitive groups should limit prolonged outdoor exertion."
    if aqi <= 60:
        return "Moderate. People with respiratory conditions should take care."
    if aqi <= 80:
        return "Poor. Reduce strenuous outdoor activity."
    if aqi <= 100:
        return "Very poor. Avoid outdoor activities where possible."
    return "Extremely poor. Stay indoors and keep windows closed."


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "/current",
    summary="Get current weather conditions",
    response_description="Current temperature, wind, pressure and more",
)
async def get_current_weather(
    latitude: float  = Query(..., ge=-90,  le=90,  description="Latitude  (-90 to 90)"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude (-180 to 180)"),
) -> Dict[str, Any]:
    """
    Returns the latest weather observation for the given coordinates.

    Data sourced from **Open-Meteo /v1/forecast**.
    """
    try:
        raw = await openmeteo_service.get_current_weather(latitude, longitude)
    except ExternalAPIError as exc:
        logger.error(str(exc))
        raise HTTPException(status_code=502, detail="Could not reach weather API. Please try again.")

    # Open-Meteo now returns: current_units, current (detailed)
    # (legacy current_weather object removed from request)
    cur = raw.get("current", {})

    weather_code = cur.get("weather_code")
    temp = cur.get("temperature_2m") or 0  # Provide defaults

    return {
        "success": True,
        "data": {
            "id":               str(uuid4()),
            "latitude":         latitude,
            "longitude":        longitude,
            # Temperatures
            "temperature":              temp,
            "feels_like":               cur.get("apparent_temperature") or temp,
            # Atmosphere - provide defaults if missing from API
            "humidity":                 cur.get("relative_humidity_2m") or 0,
            "pressure":                 cur.get("surface_pressure") or 1013,
            "visibility":               cur.get("visibility") or 10000,
            "cloudiness":               cur.get("cloud_cover") or 0,
            # Wind
            "wind_speed":               cur.get("wind_speed_10m") or 0,
            "wind_direction_deg":       cur.get("wind_direction_10m") or 0,
            "wind_direction_label":     wind_direction_label(cur.get("wind_direction_10m") or 0),
            "wind_gust":                cur.get("wind_gusts_10m") or 0,
            # Precipitation
            "precipitation":            cur.get("precipitation") or 0,
            "rain":                     cur.get("rain") or 0,
            "snow":                     cur.get("snowfall") or 0,
            # Condition
            "weather_code":             weather_code,
            "weather_description":      describe_wmo(weather_code),
            # Meta
            "observation_time":         cur.get("time"),
            "is_day":                   1,  # Placeholder: is_day not in current response
            "units": {
                "temperature":  "°C",
                "wind_speed":   "m/s",
                "pressure":     "hPa",
                "precipitation":"mm",
                "visibility":   "m",
            },
        },
    }


@router.get(
    "/hourly",
    summary="Get hourly weather forecast",
    response_description="Hour-by-hour forecast up to 168 hours ahead",
)
async def get_hourly_forecast(
    latitude:  float = Query(..., ge=-90,  le=90,  description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    hours:     int   = Query(48,  ge=1,    le=168, description="Number of hours to return (max 168)"),
) -> Dict[str, Any]:
    """
    Returns hourly forecasts for the next *hours* hours.

    Data sourced from **Open-Meteo /v1/forecast** (hourly variables).
    """
    try:
        raw = await openmeteo_service.get_hourly_forecast(latitude, longitude, hours)
    except ExternalAPIError as exc:
        logger.error(str(exc))
        raise HTTPException(status_code=502, detail="Could not reach weather API.")

    hourly = raw.get("hourly", {})
    times  = hourly.get("time", [])
    total  = min(hours, len(times))

    forecasts = [
        {
            "forecast_time":             times[i],
            "temperature":               _safe(hourly.get("temperature_2m"), i),
            "feels_like":                _safe(hourly.get("apparent_temperature"), i),
            "humidity":                  _safe(hourly.get("relative_humidity_2m"), i),
            "pressure":                  _safe(hourly.get("surface_pressure"), i),
            "wind_speed":                _safe(hourly.get("wind_speed_10m"), i),
            "wind_direction_deg":        _safe(hourly.get("wind_direction_10m"), i),
            "wind_direction_label":      wind_direction_label(_safe(hourly.get("wind_direction_10m"), i)),
            "wind_gust":                 _safe(hourly.get("wind_gusts_10m"), i),
            "precipitation_probability": _safe(hourly.get("precipitation_probability"), i),
            "precipitation":             _safe(hourly.get("precipitation"), i, 0),
            "cloudiness":                _safe(hourly.get("cloud_cover"), i),
            "weather_code":              _safe(hourly.get("weather_code"), i),
            "weather_description":       describe_wmo(_safe(hourly.get("weather_code"), i)),
        }
        for i in range(total)
    ]

    return {
        "success": True,
        "data": {
            "latitude":  latitude,
            "longitude": longitude,
            "count":     len(forecasts),
            "forecasts": forecasts,
        },
    }


@router.get(
    "/daily",
    summary="Get daily weather forecast",
    response_description="Day-by-day forecast up to 16 days ahead",
)
async def get_daily_forecast(
    latitude:  float = Query(..., ge=-90,  le=90,  description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    days:      int   = Query(16,  ge=1,    le=16,  description="Number of days to return (max 16)"),
) -> Dict[str, Any]:
    """
    Returns daily high/low temperatures, precipitation and conditions
    for the next *days* days.
    """
    try:
        raw = await openmeteo_service.get_daily_forecast(latitude, longitude, days)
    except ExternalAPIError as exc:
        logger.error(str(exc))
        raise HTTPException(status_code=502, detail="Could not reach weather API.")

    daily = raw.get("daily", {})
    times = daily.get("time", [])
    total = min(days, len(times))

    forecasts = [
        {
            "forecast_date":              times[i],
            "temperature_max":            _safe(daily.get("temperature_2m_max"), i),
            "temperature_min":            _safe(daily.get("temperature_2m_min"), i),
            "feels_like_max":             _safe(daily.get("apparent_temperature_max"), i),
            "feels_like_min":             _safe(daily.get("apparent_temperature_min"), i),
            "precipitation_sum":          _safe(daily.get("precipitation_sum"), i, 0),
            "rain_sum":                   _safe(daily.get("rain_sum"), i, 0),
            "snow_sum":                   _safe(daily.get("snowfall_sum"), i, 0),
            "precipitation_probability":  _safe(daily.get("precipitation_probability_max"), i),
            "wind_speed_max":             _safe(daily.get("wind_speed_10m_max"), i),
            "wind_gust_max":              _safe(daily.get("wind_gusts_10m_max"), i),
            "wind_direction_dominant_deg":_safe(daily.get("wind_direction_10m_dominant"), i),
            "wind_direction_dominant":    wind_direction_label(_safe(daily.get("wind_direction_10m_dominant"), i)),
            "sunrise":                    _safe(daily.get("sunrise"), i),
            "sunset":                     _safe(daily.get("sunset"), i),
            "daylight_duration_s":        _safe(daily.get("daylight_duration"), i),
            "weather_code":               _safe(daily.get("weather_code"), i),
            "weather_description":        describe_wmo(_safe(daily.get("weather_code"), i)),
        }
        for i in range(total)
    ]

    return {
        "success": True,
        "data": {
            "latitude":  latitude,
            "longitude": longitude,
            "count":     len(forecasts),
            "forecasts": forecasts,
        },
    }


@router.get(
    "/history",
    summary="Get historical weather data",
    response_description="Daily weather records for the requested date range",
)
async def get_weather_history(
    latitude:   float = Query(..., ge=-90,  le=90,  description="Latitude"),
    longitude:  float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: date  = Query(..., description="Start date  YYYY-MM-DD"),
    end_date:   date  = Query(..., description="End date    YYYY-MM-DD"),
) -> Dict[str, Any]:
    """
    Returns daily historical weather between *start_date* and *end_date*.

    - Maximum range: **365 days**.
    - End date must be at least **1 day before today** (no future dates).

    Data sourced from **Open-Meteo Archive API**.
    """
    today = date.today()

    if end_date >= today:
        raise HTTPException(
            status_code=400,
            detail=f"end_date must be before today ({today}). Historical data is not available for future dates.",
        )
    if end_date < start_date:
        raise HTTPException(status_code=400, detail="end_date must be after start_date.")
    if (end_date - start_date).days > 365:
        raise HTTPException(status_code=400, detail="Date range cannot exceed 365 days.")

    try:
        raw = await openmeteo_service.get_historical_weather(latitude, longitude, start_date, end_date)
    except ExternalAPIError as exc:
        logger.error(str(exc))
        raise HTTPException(status_code=502, detail="Could not reach weather archive API.")

    daily = raw.get("daily", {})
    times = daily.get("time", [])

    records = [
        {
            "record_date":       times[i],
            "temperature_max":   _safe(daily.get("temperature_2m_max"), i),
            "temperature_min":   _safe(daily.get("temperature_2m_min"), i),
            "temperature_mean":  _safe(daily.get("temperature_2m_mean"), i),
            "precipitation":     _safe(daily.get("precipitation_sum"), i, 0),
            "rain":              _safe(daily.get("rain_sum"), i, 0),
            "snow":              _safe(daily.get("snowfall_sum"), i, 0),
            "wind_speed_max":    _safe(daily.get("wind_speed_10m_max"), i),
            "wind_direction_dominant_deg": _safe(daily.get("wind_direction_10m_dominant"), i),
            "wind_direction_dominant":     wind_direction_label(_safe(daily.get("wind_direction_10m_dominant"), i)),
            "weather_code":      _safe(daily.get("weather_code"), i),
            "weather_description": describe_wmo(_safe(daily.get("weather_code"), i)),
        }
        for i in range(len(times))
    ]

    return {
        "success": True,
        "data": {
            "latitude":   latitude,
            "longitude":  longitude,
            "start_date": start_date.isoformat(),
            "end_date":   end_date.isoformat(),
            "count":      len(records),
            "records":    records,
        },
    }


@router.get(
    "/air-quality",
    summary="Get current air quality",
    response_description="European AQI plus individual pollutant concentrations",
)
async def get_air_quality(
    latitude:  float = Query(..., ge=-90,  le=90,  description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
) -> Dict[str, Any]:
    """
    Returns the current Air Quality Index (European scale) and
    concentrations of PM2.5, PM10, O₃, NO₂, SO₂, and CO.
    """
    try:
        raw = await openmeteo_service.get_air_quality(latitude, longitude)
    except ExternalAPIError as exc:
        logger.error(str(exc))
        raise HTTPException(status_code=502, detail="Could not reach air quality API.")

    cur = raw.get("current", {})
    aqi = cur.get("european_aqi")

    return {
        "success": True,
        "data": {
            "id":               str(uuid4()),
            "latitude":         latitude,
            "longitude":        longitude,
            "measurement_time": cur.get("time", datetime.now(timezone.utc).isoformat()),
            # AQI
            "aqi":              aqi,
            "aqi_us":           cur.get("us_aqi"),
            "aqi_category":     _aqi_category(aqi),
            "health_recommendation": _aqi_health(aqi),
            # Pollutants (µg/m³)
            "pm2_5":  cur.get("pm2_5"),
            "pm10":   cur.get("pm10"),
            "o3":     cur.get("ozone"),
            "no2":    cur.get("nitrogen_dioxide"),
            "so2":    cur.get("sulphur_dioxide"),
            "co":     cur.get("carbon_monoxide"),
            "units": {
                "pm2_5": "ug/m3",
                "pm10":  "ug/m3",
                "o3":    "ug/m3",
                "no2":   "ug/m3",
                "so2":   "ug/m3",
                "co":    "ug/m3",
            },
        },
    }


@router.get(
    "/search",
    summary="Search locations by name",
    response_description="List of matching cities with coordinates",
)
async def search_locations(
    query: str = Query(..., min_length=2, description="City name to search (min 2 chars)"),
    count: int = Query(10, ge=1, le=100,  description="Maximum results to return"),
) -> Dict[str, Any]:
    """
    Geocodes a city name and returns up to *count* matching results
    with latitude / longitude coordinates.

    Use the returned coordinates in other endpoints.
    """
    try:
        raw = await openmeteo_service.search_location(query, count)
    except ExternalAPIError as exc:
        logger.error(str(exc))
        raise HTTPException(status_code=502, detail="Could not reach geocoding API.")

    results = [
        {
            "name":         r.get("name"),
            "country":      r.get("country"),
            "country_code": r.get("country_code"),
            "state":        r.get("admin1"),          # state / province
            "latitude":     r.get("latitude"),
            "longitude":    r.get("longitude"),
            "elevation":    r.get("elevation"),
            "timezone":     r.get("timezone"),
            "population":   r.get("population"),
        }
        for r in raw.get("results", [])
    ]

    return {
        "success": True,
        "data": {
            "query":   query,
            "count":   len(results),
            "results": results,
        },
    }
