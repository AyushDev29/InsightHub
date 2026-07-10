"""Initial schema — all core tables

Revision ID: 001
Revises:
Create Date: 2026-07-10
"""

from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── locations ─────────────────────────────────────────────────────────
    op.create_table(
        "locations",
        sa.Column("id",           sa.CHAR(36),      primary_key=True),
        sa.Column("name",         sa.String(255),   nullable=False),
        sa.Column("country",      sa.String(100),   nullable=False),
        sa.Column("country_code", sa.String(2),     nullable=False),
        sa.Column("latitude",     sa.Numeric(10, 7),nullable=False),
        sa.Column("longitude",    sa.Numeric(10, 7),nullable=False),
        sa.Column("elevation",    sa.Integer(),     nullable=True),
        sa.Column("timezone",     sa.String(100),   nullable=True),
        sa.Column("population",   sa.Integer(),     nullable=True),
        sa.Column("is_active",    sa.Boolean(),     default=True, nullable=False),
        sa.Column("created_at",   sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at",   sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("latitude", "longitude", name="uq_location_coords"),
    )
    op.create_index("ix_locations_name",    "locations", ["name"])
    op.create_index("ix_locations_country", "locations", ["country_code"])

    # ── weather_current ────────────────────────────────────────────────────
    op.create_table(
        "weather_current",
        sa.Column("id",           sa.CHAR(36), primary_key=True),
        sa.Column("location_id",  sa.CHAR(36), sa.ForeignKey("locations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("temperature",  sa.Numeric(5,2), nullable=False),
        sa.Column("feels_like",   sa.Numeric(5,2), nullable=True),
        sa.Column("temperature_min", sa.Numeric(5,2), nullable=True),
        sa.Column("temperature_max", sa.Numeric(5,2), nullable=True),
        sa.Column("pressure",         sa.Integer(), nullable=True),
        sa.Column("humidity",         sa.Integer(), nullable=True),
        sa.Column("visibility",       sa.Integer(), nullable=True),
        sa.Column("wind_speed",       sa.Numeric(5,2), nullable=True),
        sa.Column("wind_direction",   sa.Integer(),    nullable=True),
        sa.Column("wind_gust",        sa.Numeric(5,2), nullable=True),
        sa.Column("precipitation",    sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("rain",             sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("snow",             sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("cloudiness",       sa.Integer(),    nullable=True),
        sa.Column("weather_code",     sa.Integer(),    nullable=True),
        sa.Column("weather_description", sa.String(255), nullable=True),
        sa.Column("sunrise",          sa.DateTime(timezone=True), nullable=True),
        sa.Column("sunset",           sa.DateTime(timezone=True), nullable=True),
        sa.Column("observation_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at",       sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at",       sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_weather_current_location_id", "weather_current", ["location_id"])

    # ── weather_hourly ─────────────────────────────────────────────────────
    op.create_table(
        "weather_hourly",
        sa.Column("id",          sa.CHAR(36), primary_key=True),
        sa.Column("location_id", sa.CHAR(36), sa.ForeignKey("locations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("forecast_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("temperature",   sa.Numeric(5,2), nullable=False),
        sa.Column("feels_like",    sa.Numeric(5,2), nullable=True),
        sa.Column("pressure",      sa.Integer(), nullable=True),
        sa.Column("humidity",      sa.Integer(), nullable=True),
        sa.Column("wind_speed",    sa.Numeric(5,2), nullable=True),
        sa.Column("wind_direction",sa.Integer(), nullable=True),
        sa.Column("wind_gust",     sa.Numeric(5,2), nullable=True),
        sa.Column("precipitation_probability", sa.Integer(), nullable=True),
        sa.Column("precipitation", sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("cloudiness",    sa.Integer(), nullable=True),
        sa.Column("weather_code",  sa.Integer(), nullable=True),
        sa.Column("weather_description", sa.String(255), nullable=True),
        sa.Column("fetched_at",    sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at",    sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at",    sa.DateTime(timezone=True), nullable=False),
    )

    # ── weather_daily ──────────────────────────────────────────────────────
    op.create_table(
        "weather_daily",
        sa.Column("id",          sa.CHAR(36), primary_key=True),
        sa.Column("location_id", sa.CHAR(36), sa.ForeignKey("locations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("forecast_date", sa.Date(), nullable=False),
        sa.Column("temperature_max", sa.Numeric(5,2), nullable=False),
        sa.Column("temperature_min", sa.Numeric(5,2), nullable=False),
        sa.Column("temperature_avg", sa.Numeric(5,2), nullable=True),
        sa.Column("pressure_avg",    sa.Integer(), nullable=True),
        sa.Column("humidity_avg",    sa.Integer(), nullable=True),
        sa.Column("wind_speed_max",  sa.Numeric(5,2), nullable=True),
        sa.Column("wind_speed_avg",  sa.Numeric(5,2), nullable=True),
        sa.Column("wind_direction_dominant", sa.Integer(), nullable=True),
        sa.Column("precipitation_sum", sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("precipitation_probability_max", sa.Integer(), nullable=True),
        sa.Column("rain_sum",  sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("snow_sum",  sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("weather_code", sa.Integer(), nullable=True),
        sa.Column("weather_description", sa.String(255), nullable=True),
        sa.Column("sunrise",  sa.DateTime(timezone=True), nullable=True),
        sa.Column("sunset",   sa.DateTime(timezone=True), nullable=True),
        sa.Column("daylight_duration", sa.Integer(), nullable=True),
        sa.Column("fetched_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("location_id", "forecast_date", name="uq_weather_daily_loc_date"),
    )

    # ── weather_history ────────────────────────────────────────────────────
    op.create_table(
        "weather_history",
        sa.Column("id",          sa.CHAR(36), primary_key=True),
        sa.Column("location_id", sa.CHAR(36), sa.ForeignKey("locations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("record_date", sa.Date(),   nullable=False),
        sa.Column("record_hour", sa.Integer(),nullable=True),
        sa.Column("temperature",     sa.Numeric(5,2), nullable=False),
        sa.Column("temperature_min", sa.Numeric(5,2), nullable=True),
        sa.Column("temperature_max", sa.Numeric(5,2), nullable=True),
        sa.Column("pressure",        sa.Integer(), nullable=True),
        sa.Column("humidity",        sa.Integer(), nullable=True),
        sa.Column("wind_speed",      sa.Numeric(5,2), nullable=True),
        sa.Column("wind_direction",  sa.Integer(), nullable=True),
        sa.Column("precipitation",   sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("rain",            sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("snow",            sa.Numeric(6,2), default=0, nullable=False),
        sa.Column("cloudiness",      sa.Integer(), nullable=True),
        sa.Column("weather_code",    sa.Integer(), nullable=True),
        sa.Column("weather_description", sa.String(255), nullable=True),
        sa.Column("created_at",  sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at",  sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_weather_history_loc_date", "weather_history", ["location_id", "record_date"])

    # ── air_quality ────────────────────────────────────────────────────────
    op.create_table(
        "air_quality",
        sa.Column("id",          sa.CHAR(36), primary_key=True),
        sa.Column("location_id", sa.CHAR(36), sa.ForeignKey("locations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("measurement_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("aqi",          sa.Integer(), nullable=False),
        sa.Column("aqi_category", sa.String(50), nullable=True),
        sa.Column("pm2_5", sa.Numeric(8,2), nullable=True),
        sa.Column("pm10",  sa.Numeric(8,2), nullable=True),
        sa.Column("o3",    sa.Numeric(8,2), nullable=True),
        sa.Column("no2",   sa.Numeric(8,2), nullable=True),
        sa.Column("so2",   sa.Numeric(8,2), nullable=True),
        sa.Column("co",    sa.Numeric(8,2), nullable=True),
        sa.Column("fetched_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("location_id", "measurement_time", name="uq_aqi_loc_time"),
    )

    # ── api_logs ───────────────────────────────────────────────────────────
    op.create_table(
        "api_logs",
        sa.Column("id",           sa.CHAR(36), primary_key=True),
        sa.Column("api_name",     sa.String(100), nullable=False),
        sa.Column("endpoint",     sa.String(500), nullable=False),
        sa.Column("http_method",  sa.String(10),  nullable=False),
        sa.Column("request_params", sa.Text(),    nullable=True),
        sa.Column("status_code",  sa.Integer(),   nullable=True),
        sa.Column("response_time_ms", sa.Integer(), nullable=True),
        sa.Column("response_size_bytes", sa.Integer(), nullable=True),
        sa.Column("success",      sa.Boolean(),   nullable=False),
        sa.Column("error_message",sa.Text(),      nullable=True),
        sa.Column("location_id",  sa.CHAR(36),    sa.ForeignKey("locations.id"), nullable=True),
        sa.Column("created_at",   sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at",   sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_api_logs_api_name",  "api_logs", ["api_name"])
    op.create_index("ix_api_logs_success",   "api_logs", ["success"])
    op.create_index("ix_api_logs_created_at","api_logs", ["created_at"])

    # ── scheduler_logs ─────────────────────────────────────────────────────
    op.create_table(
        "scheduler_logs",
        sa.Column("id",               sa.CHAR(36), primary_key=True),
        sa.Column("job_name",         sa.String(100), nullable=False),
        sa.Column("job_type",         sa.String(50),  nullable=False),
        sa.Column("started_at",       sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at",     sa.DateTime(timezone=True), nullable=True),
        sa.Column("duration_seconds", sa.Integer(), nullable=True),
        sa.Column("status",           sa.String(20), nullable=False),
        sa.Column("records_processed",sa.Integer(), default=0, nullable=False),
        sa.Column("records_failed",   sa.Integer(), default=0, nullable=False),
        sa.Column("error_message",    sa.Text(),    nullable=True),
        sa.Column("error_traceback",  sa.Text(),    nullable=True),
        sa.Column("hostname",         sa.String(255), nullable=True),
        sa.Column("created_at",       sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at",       sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_scheduler_logs_job_name","scheduler_logs",["job_name"])
    op.create_index("ix_scheduler_logs_status",  "scheduler_logs",["status"])


def downgrade() -> None:
    op.drop_table("scheduler_logs")
    op.drop_table("api_logs")
    op.drop_table("air_quality")
    op.drop_table("weather_history")
    op.drop_table("weather_daily")
    op.drop_table("weather_hourly")
    op.drop_table("weather_current")
    op.drop_table("locations")
