"""
Logging Models — API call log, scheduler job log, raw API responses.
"""

from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime,
    ForeignKey, CheckConstraint,
)
from sqlalchemy.orm import relationship

from app.db.base import BaseModel, GUID


class APILog(BaseModel):
    """
    Records every outbound call to an external API.
    Used for monitoring, debugging, and rate-limit tracking.
    """

    __tablename__ = "api_logs"

    api_name        = Column(String(100), nullable=False, index=True)
    endpoint        = Column(String(500), nullable=False)
    http_method     = Column(String(10),  nullable=False)
    request_params  = Column(Text, nullable=True)

    status_code         = Column(Integer, nullable=True)
    response_time_ms    = Column(Integer, nullable=True)
    response_size_bytes = Column(Integer, nullable=True)
    success             = Column(Boolean, nullable=False, index=True)
    error_message       = Column(Text,    nullable=True)
    retry_count         = Column(Integer, default=0, nullable=False)  # ← NEW

    location_id = Column(GUID(), ForeignKey("locations.id"), nullable=True)

    __table_args__ = (
        CheckConstraint(
            "status_code IS NULL OR (status_code >= 100 AND status_code < 600)",
            name="ck_api_log_status_code",
        ),
    )

    def __repr__(self) -> str:
        return f"<APILog(api_name='{self.api_name}', success={self.success}, status={self.status_code})>"


class SchedulerLog(BaseModel):
    """
    Records every execution of a scheduled background job.
    Includes ingestion metrics: records inserted, API response time, retries, etc.
    """

    __tablename__ = "scheduler_logs"

    job_name  = Column(String(100), nullable=False, index=True)
    job_type  = Column(String(50),  nullable=False, index=True)

    started_at       = Column(DateTime(timezone=True), nullable=False)
    completed_at     = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer,                 nullable=True)

    status            = Column(String(20), nullable=False, index=True)
    records_processed = Column(Integer, default=0, nullable=False)
    records_failed    = Column(Integer, default=0, nullable=False)
    records_inserted  = Column(Integer, default=0, nullable=False)  # ← NEW: actually new rows
    records_updated   = Column(Integer, default=0, nullable=False)  # ← NEW: upserted existing

    # Ingestion metrics — NEW
    avg_api_response_ms = Column(Integer, nullable=True)   # average Open-Meteo response time
    total_retry_count   = Column(Integer, default=0, nullable=False)  # retries across all cities

    error_message   = Column(Text, nullable=True)
    error_traceback = Column(Text, nullable=True)
    hostname        = Column(String(255), nullable=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('success', 'failed', 'partial')",
            name="ck_scheduler_log_status",
        ),
    )

    def __repr__(self) -> str:
        return f"<SchedulerLog(job_name='{self.job_name}', status='{self.status}')>"


class RawAPIResponse(BaseModel):
    """
    Stores the raw JSON payload from every Open-Meteo API call.

    Why:
    - Open-Meteo may add/change fields in the future
    - Allows reprocessing without re-fetching
    - Essential debugging tool for ETL pipelines
    - Never lose original data even if transformation logic changes
    """

    __tablename__ = "raw_api_responses"

    # Source info
    source      = Column(String(100), nullable=False, index=True)  # e.g. "open-meteo"
    endpoint    = Column(String(200), nullable=False, index=True)  # e.g. "forecast", "air-quality"
    city        = Column(String(255), nullable=False, index=True)  # city name for easy lookup

    # Request params stored as JSON text
    request_params = Column(Text, nullable=True)

    # The full raw response from the API
    response_json  = Column(Text, nullable=False)

    # Response metadata
    http_status_code = Column(Integer, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    response_size_bytes = Column(Integer, nullable=True)

    # Link to city (optional — useful for joins)
    location_id = Column(GUID(), ForeignKey("locations.id"), nullable=True, index=True)

    # Link to the scheduler job that triggered this call
    scheduler_log_id = Column(GUID(), ForeignKey("scheduler_logs.id"), nullable=True, index=True)

    def __repr__(self) -> str:
        return f"<RawAPIResponse(source='{self.source}', endpoint='{self.endpoint}', city='{self.city}')>"
