"""
Database Connection and Session Management

Handles SQLAlchemy async engine creation and session management.
Supports SQLite for development and PostgreSQL (Supabase) for production.
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.core.config import settings
from app.core.logging import logger


def _build_engine():
    """
    Build the async SQLAlchemy engine.
    SQLite does not support pool_size / max_overflow, so we strip those
    args for SQLite connections.
    """
    url = settings.DATABASE_URL
    is_sqlite = url.startswith("sqlite")

    kwargs = {
        "echo": settings.DEBUG,
        "pool_pre_ping": True,
    }

    if not is_sqlite:
        # PostgreSQL / asyncpg supports pooling options
        kwargs["pool_size"] = settings.DATABASE_POOL_SIZE
        kwargs["max_overflow"] = settings.DATABASE_MAX_OVERFLOW
        kwargs["pool_recycle"] = 3600
    else:
        # SQLite requires connect_args to allow multi-thread access
        kwargs["connect_args"] = {"check_same_thread": False}

    return create_async_engine(url, **kwargs)


# Create async engine
engine = _build_engine()

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Declarative base (all models inherit from this)
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency — yields a database session per request.

    Usage:
        @router.get("/example")
        async def example(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as exc:
            await session.rollback()
            logger.error(f"Database session error: {exc}")
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """
    Create all tables on startup (development only).
    In production, always use Alembic migrations.
    
    If database is not available, log warning but don't crash.
    """
    try:
        from app.models import location, weather, forecast, aqi, logs  # noqa: F401

        async with engine.begin() as conn:
            logger.info("Creating / verifying database tables...")
            await conn.run_sync(Base.metadata.create_all)
            logger.info("✔  Database tables ready.")

        logger.info("✔  Database initialised successfully.")
    except Exception as exc:
        logger.error(f"⚠  Database initialisation warning: {exc}")
        logger.error(f"   Make sure DATABASE_URL is set correctly in environment variables.")
        logger.error(f"   Current DATABASE_URL: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'not set'}")
        # Don't re-raise - let app continue (API might still work)
        # raise


async def close_db() -> None:
    """Dispose engine connections on shutdown."""
    await engine.dispose()
    logger.info("Database connections closed.")
