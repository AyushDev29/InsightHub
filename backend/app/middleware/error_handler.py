"""
Global error-handler middleware.

Catches unhandled exceptions and returns a clean JSON 500 response
instead of leaking stack traces to clients.
"""

import logging
from fastapi import Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("insighthub.errors")


async def error_handler_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        logger.exception(f"Unhandled exception on {request.method} {request.url.path}: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal Server Error",
                "message": "An unexpected error occurred. Please try again later.",
            },
        )
