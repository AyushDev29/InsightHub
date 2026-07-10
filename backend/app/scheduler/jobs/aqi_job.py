"""
AQI Fetch Job  — production-grade version

For every active city this job:
  1. Calls Open-Meteo Air Quality API  (measures response time)
  2. Saves the raw JSON response        (raw_api_responses table)
  3. Upserts air_quality record         (tracks inserts vs updates)
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
from app.models.aqi import AirQuality
from app.models.logs import SchedulerLog, RawAPIResponse
from app.services.openmeteo_service import openmeteo_service
from app.core.logging import logger


def _aqi_category(aqi: int | None) -> str:
    if aqi is None:   return "Unknown"
    if aqi <= 20:     return "Good"
    if aqi <= 40:     return "Fair"
    if aqi <= 60:     return "Moderate"
    if aqi <= 80:     return "Poor"
    if aqi <= 100:    return "Very Poor"
    return "Extremely Poor"


async def fetch_aqi_for_all_cities() -> dict:
    """
    Main AQI job — called by APScheduler every hour.
    Returns ingestion metrics dict.
    """
    job_name   = "fetch_aqi"
    started_at = datetime.now(timezone.utc)

    processed        = 0
    failed           = 0
    inserted         = 0
    updated          = 0
    total_retry      = 0
    api_response_times: list[int] = []
    errors: list[str] = []

    logger.info("=" * 55)
    logger.info("  [AQIJob] Starting hourly AQI fetch")
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
            try:
                logger.info(f"  → Fetching AQI for {city.name}...")

                # ── Call Open-Meteo Air Quality API ───────────────────────
                t0  = time.monotonic()
                raw = await openmeteo_service.get_air_quality(
                    float(city.latitude), float(city.longitude)
                )
                elapsed_ms = int((time.monotonic() - t0) * 1000)
                api_response_times.append(elapsed_ms)

                # ── Store raw response ────────────────────────────────────
                raw_record = RawAPIResponse(
                    source           = "open-meteo",
                    endpoint         = "air-quality/current",
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

                # ── Transform ─────────────────────────────────────────────
                cur      = raw.get("current", {})
                aqi      = cur.get("european_aqi")
                time_str = cur.get("time")

                if time_str:
                    try:
                        meas_time = datetime.fromisoformat(
                            time_str.replace("Z", "+00:00")
                        )
                    except Exception:
                        meas_time = datetime.now(timezone.utc)
                else:
                    meas_time = datetime.now(timezone.utc)

                aqi_data = {
                    "location_id":      city.id,
                    "measurement_time": meas_time,
                    "aqi":              aqi or 0,
                    "aqi_category":     _aqi_category(aqi),
                    "pm2_5":            cur.get("pm2_5"),
                    "pm10":             cur.get("pm10"),
                    "o3":               cur.get("ozone"),
                    "no2":              cur.get("nitrogen_dioxide"),
                    "so2":              cur.get("sulphur_dioxide"),
                    "co":               cur.get("carbon_monoxide"),
                    "fetched_at":       datetime.now(timezone.utc),
                }

                # ── Upsert AQI record ─────────────────────────────────────
                stmt = pg_insert(AirQuality).values(**aqi_data)
                stmt = stmt.on_conflict_do_update(
                    constraint="uq_aqi_loc_time",
                    set_={
                        "aqi":          stmt.excluded.aqi,
                        "aqi_category": stmt.excluded.aqi_category,
                        "pm2_5":        stmt.excluded.pm2_5,
                        "pm10":         stmt.excluded.pm10,
                        "fetched_at":   stmt.excluded.fetched_at,
                    }
                )
                result = await session.execute(stmt)

                if hasattr(result, "rowcount") and result.rowcount == 1:
                    inserted += 1
                else:
                    updated += 1

                processed += 1
                logger.info(
                    f"    ✔  {city.name}: "
                    f"AQI {aqi} ({_aqi_category(aqi)}) "
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
            job_type          = "aqi",
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
        f"  [AQIJob] Done — "
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
