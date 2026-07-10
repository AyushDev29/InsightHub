"""
InsightHub AI — FastAPI Application Entry Point

Wires together:
  - CORS + GZip middleware
  - Request logging middleware
  - Rate-limiting middleware
  - Global error handler middleware
  - API v1 router
  - DB initialisation on startup / teardown on shutdown
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.db.database import init_db, close_db
from app.middleware.error_handler import error_handler_middleware
from app.middleware.logging import logging_middleware
from app.middleware.rate_limiter import rate_limiter_middleware
from app.scheduler.scheduler import start_scheduler, stop_scheduler

# Initialise logging as early as possible
setup_logging()


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("═" * 55)
    logger.info("  InsightHub AI Backend starting…")
    logger.info(f"  Environment : {settings.ENVIRONMENT}")
    logger.info(f"  Debug mode  : {settings.DEBUG}")
    logger.info(f"  Database    : {settings.DATABASE_URL.split('@')[-1]}")  # hide credentials
    logger.info("═" * 55)

    await init_db()
    logger.info("✔  Database ready.")

    await start_scheduler()
    logger.info("✔  Scheduler ready.")

    logger.info("✔  Application started successfully.")

    yield  # ← server is running

    logger.info("InsightHub AI Backend shutting down…")
    await stop_scheduler()
    await close_db()
    logger.info("Bye!")


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Transforming Live Public Data into Actionable Intelligence.\n\n"
        "**Weather Intelligence Module** — Phase 1"
    ),
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# Middleware stack (applied in reverse order, last added runs first)
# ---------------------------------------------------------------------------

# 1. CORS — must be outermost
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. GZip — compress large responses
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 3. Custom middleware (wraps every request)
app.middleware("http")(error_handler_middleware)
app.middleware("http")(logging_middleware)
app.middleware("http")(rate_limiter_middleware)


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# ---------------------------------------------------------------------------
# Root & Health endpoints
# ---------------------------------------------------------------------------

@app.get("/", tags=["Root"], include_in_schema=False)
async def root():
    return {
        "name":        settings.APP_NAME,
        "version":     settings.APP_VERSION,
        "description": "Transforming Live Public Data into Actionable Intelligence",
        "docs":        "/api/docs",
        "health":      "/health",
        "api_prefix":  settings.API_V1_PREFIX,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Lightweight health-check for load-balancers and uptime monitors."""
    return {
        "status":      "healthy",
        "environment": settings.ENVIRONMENT,
        "version":     settings.APP_VERSION,
    }


@app.get(f"{settings.API_V1_PREFIX}/version", tags=["Health"])
async def version():
    """Returns the current API version."""
    return {
        "version":     settings.APP_VERSION,
        "api_version": "v1",
        "environment": settings.ENVIRONMENT,
    }


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error":   "Not Found",
            "message": "The requested resource does not exist.",
            "path":    str(request.url.path),
        },
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Unhandled 500 on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error":   "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later.",
        },
    )


# ---------------------------------------------------------------------------
# Entry point (python app/main.py)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL.lower(),
    )
