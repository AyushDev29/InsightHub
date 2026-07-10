"""
InsightHub AI — APScheduler Setup

Schedules:
  - Weather fetch  → every hour at :00
  - AQI fetch      → every hour at :05  (5-min offset avoids hammering API at exact same time)

Usage (from FastAPI lifespan or standalone):
    from app.scheduler.scheduler import start_scheduler, stop_scheduler
"""

import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.config import settings
from app.core.logging import logger
from app.scheduler.jobs.weather_job import fetch_weather_for_all_cities
from app.scheduler.jobs.aqi_job import fetch_aqi_for_all_cities

# Global scheduler instance
scheduler = AsyncIOScheduler(timezone="UTC")
_is_running = False


def _register_jobs():
    """Register all scheduled jobs."""

    # Weather job — every hour at minute 0
    scheduler.add_job(
        fetch_weather_for_all_cities,
        trigger=CronTrigger(minute=0),       # e.g. 01:00, 02:00, 03:00 ...
        id="fetch_weather",
        name="Fetch Weather for All Cities",
        replace_existing=True,
        misfire_grace_time=300,              # allow up to 5 min late start
        max_instances=1,                     # never run two at once
    )

    # AQI job — every hour at minute 5
    scheduler.add_job(
        fetch_aqi_for_all_cities,
        trigger=CronTrigger(minute=5),       # e.g. 01:05, 02:05, 03:05 ...
        id="fetch_aqi",
        name="Fetch AQI for All Cities",
        replace_existing=True,
        misfire_grace_time=300,
        max_instances=1,
    )

    logger.info("  ✔  Scheduler jobs registered:")
    logger.info("     • fetch_weather — every hour at :00")
    logger.info("     • fetch_aqi     — every hour at :05")


async def start_scheduler():
    """Start the scheduler. Call this from FastAPI lifespan startup."""
    global _is_running

    if not settings.SCHEDULER_ENABLED:
        logger.info("  ⊘  Scheduler disabled (SCHEDULER_ENABLED=False)")
        return

    if _is_running:
        logger.warning("  ⚠  Scheduler already running, skipping start")
        return

    _register_jobs()
    scheduler.start()
    _is_running = True

    logger.info("  ✔  Scheduler started (timezone=UTC)")

    # Run jobs immediately on startup so we don't wait up to 1 hour for first data
    logger.info("  → Running initial data fetch on startup...")
    asyncio.create_task(_run_initial_fetch())


async def stop_scheduler():
    """Stop the scheduler gracefully. Call from FastAPI lifespan shutdown."""
    global _is_running

    if _is_running and scheduler.running:
        scheduler.shutdown(wait=False)
        _is_running = False
        logger.info("  ✔  Scheduler stopped")


async def _run_initial_fetch():
    """
    Run both jobs immediately on startup.
    This ensures we always have fresh data when the server starts,
    rather than waiting up to 1 hour for the first scheduled run.
    """
    try:
        logger.info("  [Startup] Running initial weather fetch...")
        await fetch_weather_for_all_cities()
    except Exception as exc:
        logger.error(f"  [Startup] Weather fetch failed: {exc}")

    try:
        logger.info("  [Startup] Running initial AQI fetch...")
        await fetch_aqi_for_all_cities()
    except Exception as exc:
        logger.error(f"  [Startup] AQI fetch failed: {exc}")

    logger.info("  [Startup] Initial fetch complete ✔")
