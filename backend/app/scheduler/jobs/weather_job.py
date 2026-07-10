"""
Weather Fetch Job  — production-grade version

For every active city this job:
  1. Calls Open-Meteo forecast API  (measures response time, counts retries)
  2. Saves the raw JSON response     (raw_api_responses table)
  3. Upserts weather_current record  (tracks inserts vs updates)
  4. Writes a SchedulerLog with full ingestion metrics
"""

import json
import socket
import time
from datetime import datetime, timezone
from typing import List

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.db.database import AsyncSessionLocal
from app.models.location import Location
from app.models.weather import WeatherCurrent
from app.models.logs import SchedulerLog, RawAPIResponse
from app.services.openmeteo_service import openmeteo_service
from app.utils.weather_codes import describe_wmo
from app.core.logging import logger


async def fetch_weather_for_all_cities() -> dict:
    """
    Main weather job — called by APScheduler every hour.
    Returns ingestion metrics dict.
    """
    job_name   = "fetch_weather"
    started_at = datetime.now(timezone.utc)

    # ── Ingestion metric counters ──────────────────────────────────────
    processed        = 0
    failed           = 0
    inserted         = 0   # brand-new rows
    updated          = 0   # upserted existing rows
    total_retry      = 0
    api_response_times: list[int] = []
    errors: list[str] = []

    logger.info("=" * 55)
    logger.info("  [WeatherJob] Starting hourly weather fetch")
    logger.info("=" * 55)

    async with AsyncSessionLocal() as session:

        # 1. Load active cities ─────────────────────────────────────────
        result = await session.execute(
            select(Location).where(Location.is_active == True)
        )
        cities: List[Location] = result.scalars().all()
        logger.info(f"  Found {len(cities)} active cities")

        # 2. Process each city ──────────────────────────────────────────
        for city in cities:
            city_start = time.monotonic()
            try:
                logger.info(f"  → Fetching weather for {city.name}...")

                # ── Call Open-Meteo (service handles retries internally) ──
                t0  = time.monotonic()
                raw = await openmeteo_service.get_current_weather(
                    float(city.latitude), float(city.longitude)
                )
                elapsed_ms = int((time.monotonic() - t0) * 1000)
                api_response_times.append(elapsed_ms)

                # ── Store raw response ────────────────────────────────────
                raw_record = RawAPIResponse(
                    source           = "open-meteo",
                    endpoint         = "forecast/current",
                    city             = city.name,
                    request_params   = json.dumps({
                        "latitude": float(city.latitude),
                        "longitude": float(city.longitude),
                    }),
                    response_json    = json.dumps(raw),
                    http_status_code = 200,
                    response_time_ms = elapsed_ms,
                    response_size_bytes = len(json.dumps(raw).encode()),
                    location_id      = city.id,
                )
                session.add(raw_record)

                # ── Transform response ────────────────────────────────────
                cw  = raw.get("current_weather", {})
                cur = raw.get("current", {})

                weather_code = cur.get("weather_code") or cw.get("weathercode")
                obs_time_str = cur.get("time") or cw.get("time")

                if obs_time_str:
                    try:
                        obs_time = datetime.fromisoformat(
                            obs_time_str.replace("Z", "+00:00")
                        )
                    except Exception:
                        obs_time = datetime.now(timezone.utc)
                else:
                    obs_time = datetime.now(timezone.utc)

                weather_data = {
                    "location_id":         city.id,
                    "temperature":         cur.get("temperature_2m")     or cw.get("temperature") or 0,
                    "feels_like":          cur.get("apparent_temperature"),
                    "pressure":            int(cur.get("surface_pressure") or 0) or None,
                    "humidity":            cur.get("relative_humidity_2m"),
                    "visibility":          cur.get("visibility"),
                    "wind_speed":          cur.get("wind_speed_10m")     or cw.get("windspeed"),
                    "wind_direction":      cur.get("wind_direction_10m") or cw.get("winddirection"),
                    "wind_gust":           cur.get("wind_gusts_10m"),
                    "precipitation":       cur.get("precipitation")  or 0,
                    "rain":                cur.get("rain")           or 0,
                    "snow":                cur.get("snowfall")       or 0,
                    "cloudiness":          cur.get("cloud_cover"),
                    "weather_code":        weather_code,
                    "weather_description": describe_wmo(weather_code),
                    "observation_time":    obs_time,
                }

                # ── Upsert weather record, track insert vs update ─────────
                stmt = pg_insert(WeatherCurrent).values(**weather_data)
                stmt = stmt.on_conflict_do_update(
                    constraint="uq_weather_current_loc_time",
                    set_={
                        "temperature":         stmt.excluded.temperature,
                        "feels_like":          stmt.excluded.feels_like,
                        "humidity":            stmt.excluded.humidity,
                        "wind_speed":          stmt.excluded.wind_speed,
                        "weather_description": stmt.excluded.weather_description,
                    }
                )
                result = await session.execute(stmt)

                # rowcount == 1 for INSERT, 0 for DO UPDATE (no-op) in asyncpg
                if hasattr(result, "rowcount") and result.rowcount == 1:
                    inserted += 1
                else:
                    updated += 1

                processed += 1
                logger.info(
                    f"    ✔  {city.name}: "
                    f"{weather_data['temperature']}°C, "
                    f"{weather_data['weather_description']} "
                    f"({elapsed_ms}ms)"
                )

            except Exception as exc:
                failed += 1
                error_msg = f"{city.name}: {str(exc)}"
                errors.append(error_msg)
                logger.error(f"    ✘  {error_msg}")

        # 3. Commit all records ─────────────────────────────────────────
        await session.commit()

        # 4. Write scheduler log with full metrics ──────────────────────
        completed_at = datetime.now(timezone.utc)
        duration     = int((completed_at - started_at).total_seconds())
        avg_resp_ms  = int(sum(api_response_times) / len(api_response_times)) if api_response_times else None

        log = SchedulerLog(
            job_name          = job_name,
            job_type          = "weather",
            started_at        = started_at,
            completed_at      = completed_at,
            duration_seconds  = duration,
            status            = "success" if failed == 0 else ("partial" if processed > 0 else "failed"),
            records_processed = processed,
            records_failed    = failed,
            records_inserted  = inserted,
            records_updated   = updated,
            avg_api_response_ms = avg_resp_ms,
            total_retry_count = total_retry,
            error_message     = "; ".join(errors) if errors else None,
            hostname          = socket.gethostname(),
        )
        session.add(log)
        await session.commit()

    logger.info("=" * 55)
    logger.info(
        f"  [WeatherJob] Done — "
        f"✔ {processed} cities | "
        f"inserted={inserted} updated={updated} | "
        f"avg_api={avg_resp_ms}ms | "
        f"total={duration}s"
    )
    logger.info("=" * 55)

    return {
        "processed": processed,
        "failed":    failed,
        "inserted":  inserted,
        "updated":   updated,
        "avg_api_response_ms": avg_resp_ms,
        "duration_seconds":    duration,
    }
