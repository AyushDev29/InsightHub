"""
Base model with common columns (id, created_at, updated_at).

All ORM models inherit from BaseModel.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.ext.declarative import declared_attr

from app.db.database import Base


# ---------------------------------------------------------------------------
# Cross-DB UUID type
# Postgres  → native UUID column
# SQLite    → CHAR(36) stored as string
# ---------------------------------------------------------------------------
class GUID(TypeDecorator):
    """Platform-independent GUID / UUID type."""

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == "postgresql":
            return str(value)
        if not isinstance(value, uuid.UUID):
            return str(uuid.UUID(str(value)))
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if not isinstance(value, uuid.UUID):
            value = uuid.UUID(str(value))
        return value


def _utcnow():
    return datetime.now(timezone.utc)


class BaseModel(Base):
    """
    Abstract base model.

    Every concrete model gets:
    - id          → UUID primary key
    - created_at  → UTC timestamp on insert
    - updated_at  → UTC timestamp on insert + update
    """

    __abstract__ = True

    id = Column(
        GUID(),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=_utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    @declared_attr
    def __tablename__(cls) -> str:  # noqa: N805
        return cls.__name__.lower()

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}(id={self.id})>"
