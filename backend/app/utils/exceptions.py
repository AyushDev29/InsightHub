"""
Custom application exceptions.
"""

from fastapi import HTTPException


class NotFoundError(HTTPException):
    def __init__(self, resource: str = "Resource"):
        super().__init__(status_code=404, detail=f"{resource} not found.")


class BadRequestError(HTTPException):
    def __init__(self, message: str):
        super().__init__(status_code=400, detail=message)


class ExternalAPIError(Exception):
    """Raised when an external API call fails after retries."""
    def __init__(self, api: str, message: str):
        self.api = api
        super().__init__(f"[{api}] {message}")


class DatabaseError(Exception):
    """Raised when a repository/DB operation fails."""
