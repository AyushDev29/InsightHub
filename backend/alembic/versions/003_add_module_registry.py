"""Add module registry for generic data fetching

Revision ID: 003
Revises: 002
Create Date: 2026-07-12 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create data_modules table (status as VARCHAR, not ENUM to avoid conflicts)
    op.create_table(
        'data_modules',
        sa.Column('id', sa.CHAR(36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('display_name', sa.String(100), nullable=False),
        sa.Column('description', sa.String(500), nullable=True),
        sa.Column('icon_name', sa.String(50), nullable=True),
        sa.Column('api_provider', sa.String(100), nullable=True),
        sa.Column('status', sa.String(20), nullable=False, server_default='active'),
        sa.Column('enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('refresh_interval_minutes', sa.Integer(), nullable=False, server_default='60'),
        sa.Column('supports_history', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('supports_prediction', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('supports_current', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('config', sa.String(2000), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name', name='uq_module_name'),
    )
    op.create_index(op.f('ix_data_modules_enabled'), 'data_modules', ['enabled'])
    op.create_index(op.f('ix_data_modules_name'), 'data_modules', ['name'])
    
    # Seed initial modules
    op.execute(
        """
        INSERT INTO data_modules (
            id, created_at, updated_at, name, display_name, description,
            icon_name, api_provider, status, enabled,
            refresh_interval_minutes, supports_history, supports_prediction, supports_current
        ) VALUES
        (
            '00000000-0000-0000-0000-000000000100',
            NOW(), NOW(),
            'weather', 'Weather', 'Current weather, hourly/daily forecast',
            'cloud-sun', 'Open-Meteo', 'active', true,
            60, true, true, true
        ),
        (
            '00000000-0000-0000-0000-000000000101',
            NOW(), NOW(),
            'aqi', 'Air Quality', 'Air quality index and pollution data',
            'air-quality', 'Open-Meteo', 'active', true,
            60, true, false, true
        ),
        (
            '00000000-0000-0000-0000-000000000102',
            NOW(), NOW(),
            'earthquake', 'Earthquakes', 'Seismic activity and earthquake data',
            'earthquake', 'USGS', 'inactive', false,
            15, true, false, true
        ),
        (
            '00000000-0000-0000-0000-000000000103',
            NOW(), NOW(),
            'crypto', 'Cryptocurrency', 'Bitcoin, Ethereum, major crypto prices',
            'coins', 'CoinGecko', 'inactive', false,
            5, true, false, true
        ),
        (
            '00000000-0000-0000-0000-000000000104',
            NOW(), NOW(),
            'stocks', 'Stocks', 'Stock market data and indices',
            'trending-up', 'Alpha Vantage', 'inactive', false,
            60, true, false, true
        ),
        (
            '00000000-0000-0000-0000-000000000105',
            NOW(), NOW(),
            'traffic', 'Traffic', 'Real-time traffic conditions',
            'traffic-light', 'Here Maps', 'inactive', false,
            10, false, false, true
        )
        ON CONFLICT (name) DO NOTHING;
        """
    )


def downgrade() -> None:
    op.drop_table('data_modules')
