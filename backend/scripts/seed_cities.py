"""
Seed Script: Indian Cities

Seeds the database with 7 major Indian cities for weather tracking.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select
from app.db.database import AsyncSessionLocal, init_db
from app.models.location import Location
from app.core.logging import logger


# 7 Major Indian Cities with Coordinates
INDIAN_CITIES = [
    {
        "name": "Mumbai",
        "country": "India",
        "country_code": "IN",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "elevation": 14,
        "timezone": "Asia/Kolkata",
        "population": 20411000,
    },
    {
        "name": "Delhi",
        "country": "India",
        "country_code": "IN",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "elevation": 216,
        "timezone": "Asia/Kolkata",
        "population": 31400000,
    },
    {
        "name": "Bengaluru",
        "country": "India",
        "country_code": "IN",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "elevation": 920,
        "timezone": "Asia/Kolkata",
        "population": 12765000,
    },
    {
        "name": "Chennai",
        "country": "India",
        "country_code": "IN",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "elevation": 7,
        "timezone": "Asia/Kolkata",
        "population": 10456000,
    },
    {
        "name": "Hyderabad",
        "country": "India",
        "country_code": "IN",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "elevation": 542,
        "timezone": "Asia/Kolkata",
        "population": 10001000,
    },
    {
        "name": "Kolkata",
        "country": "India",
        "country_code": "IN",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "elevation": 9,
        "timezone": "Asia/Kolkata",
        "population": 14850000,
    },
    {
        "name": "Pune",
        "country": "India",
        "country_code": "IN",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "elevation": 560,
        "timezone": "Asia/Kolkata",
        "population": 6629000,
    },
]


async def seed_cities():
    """Seed Indian cities into the database"""
    
    logger.info("=" * 60)
    logger.info("  Seeding Indian Cities")
    logger.info("=" * 60)
    
    # Initialize database
    await init_db()
    logger.info("✔  Database initialized")
    
    async with AsyncSessionLocal() as session:
        try:
            seeded_count = 0
            skipped_count = 0
            
            for city_data in INDIAN_CITIES:
                # Check if city already exists
                result = await session.execute(
                    select(Location).where(
                        Location.name == city_data["name"],
                        Location.country == city_data["country"]
                    )
                )
                existing = result.scalar_one_or_none()
                
                if existing:
                    logger.info(f"⊘  {city_data['name']} already exists - skipping")
                    skipped_count += 1
                    continue
                
                # Create new location
                location = Location(**city_data)
                session.add(location)
                seeded_count += 1
                logger.info(f"✔  Added {city_data['name']}, {city_data['country']}")
            
            # Commit all changes
            await session.commit()
            
            logger.info("=" * 60)
            logger.info(f"  Seeding Complete!")
            logger.info(f"  Added: {seeded_count} cities")
            logger.info(f"  Skipped: {skipped_count} cities (already exist)")
            logger.info("=" * 60)
            
        except Exception as e:
            logger.error(f"Error seeding cities: {e}")
            await session.rollback()
            raise


async def verify_cities():
    """Verify all cities were seeded correctly"""
    
    logger.info("\n" + "=" * 60)
    logger.info("  Verifying Seeded Cities")
    logger.info("=" * 60)
    
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Location).where(Location.country == "India").order_by(Location.name)
        )
        cities = result.scalars().all()
        
        logger.info(f"\n  Found {len(cities)} Indian cities in database:\n")
        
        for city in cities:
            logger.info(
                f"  • {city.name}, {city.country} "
                f"({city.latitude:.4f}, {city.longitude:.4f})"
            )
        
        logger.info("\n" + "=" * 60)


if __name__ == "__main__":
    async def main():
        await seed_cities()
        await verify_cities()
    
    asyncio.run(main())
