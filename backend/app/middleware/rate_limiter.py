"""
Simple in-process rate limiter middleware.

Uses a sliding-window counter per client IP.
For production, replace with Redis-backed throttling.
"""

import time
import logging
from collections import defaultdict
from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.config import settings

logger = logging.getLogger("insighthub.rate_limiter")

# { ip_address: [timestamp, ...] }
_request_log: dict[str, list[float]] = defaultdict(list)
WINDOW = 60.0  # seconds


async def rate_limiter_middleware(request: Request, call_next):
    if not settings.RATE_LIMIT_ENABLED:
        return await call_next(request)

    ip = request.client.host if request.client else "unknown"
    now = time.time()
    window_start = now - WINDOW

    # Remove timestamps outside the current window
    _request_log[ip] = [t for t in _request_log[ip] if t > window_start]

    if len(_request_log[ip]) >= settings.RATE_LIMIT_PER_MINUTE:
        logger.warning(f"Rate limit exceeded for {ip}")
        return JSONResponse(
            status_code=429,
            content={
                "success": False,
                "error": "Too Many Requests",
                "message": f"Rate limit exceeded. Max {settings.RATE_LIMIT_PER_MINUTE} requests per minute.",
            },
        )

    _request_log[ip].append(now)
    return await call_next(request)
