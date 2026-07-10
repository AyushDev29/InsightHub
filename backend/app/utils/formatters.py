"""
Data formatting utilities.
"""

from datetime import datetime, timezone


def utcnow_iso() -> str:
    """Current UTC time as ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


def celsius_to_fahrenheit(c: float | None) -> float | None:
    """Convert Celsius to Fahrenheit."""
    if c is None:
        return None
    return round(c * 9 / 5 + 32, 2)


def wind_direction_label(degrees: int | None) -> str:
    """Convert wind direction in degrees to a compass label."""
    if degrees is None:
        return "N/A"
    directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    idx = round(degrees / 22.5) % 16
    return directions[idx]
