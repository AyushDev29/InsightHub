"""Restructure to country-first architecture

Revision ID: 002
Revises: 001
Create Date: 2026-07-12 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Step 1: Create countries table
    op.create_table(
        'countries',
        sa.Column('id', sa.CHAR(36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('iso_code', sa.String(2), nullable=False),
        sa.Column('continent', sa.String(50), nullable=False),
        sa.Column('timezone', sa.String(100), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name', name='uq_country_name'),
        sa.UniqueConstraint('iso_code', name='uq_country_iso_code'),
    )
    op.create_index(op.f('ix_countries_is_active'), 'countries', ['is_active'])
    op.create_index(op.f('ix_countries_iso_code'), 'countries', ['iso_code'])
    op.create_index(op.f('ix_countries_name'), 'countries', ['name'])

    # Step 2: Rename locations table to cities (PostgreSQL)
    op.rename_table('locations', 'cities')

    # Step 3: Add country_id, state, is_favorite to cities
    op.add_column('cities', sa.Column('country_id', sa.CHAR(36), nullable=True))
    op.add_column('cities', sa.Column('state', sa.String(100), nullable=True))
    op.add_column('cities', sa.Column('is_favorite', sa.Boolean(), nullable=False, server_default='false'))

    # Step 4: Remove old country columns from cities
    op.drop_column('cities', 'country')
    op.drop_column('cities', 'country_code')

    # Step 5: Seed India country record
    op.execute(
        """
        INSERT INTO countries (id, created_at, updated_at, name, iso_code, continent, timezone, is_active)
        VALUES (
            '00000000-0000-0000-0000-000000000001',
            NOW(),
            NOW(),
            'India',
            'IN',
            'Asia',
            'Asia/Kolkata',
            true
        )
        ON CONFLICT (iso_code) DO NOTHING;
        """
    )

    # Step 6: Update cities.country_id to India
    op.execute(
        """
        UPDATE cities SET country_id = '00000000-0000-0000-0000-000000000001'
        WHERE country_id IS NULL;
        """
    )

    # Step 7: Make country_id NOT NULL
    op.alter_column('cities', 'country_id', nullable=False)

    # Step 8: Add foreign key constraint
    op.create_foreign_key(
        'fk_cities_country_id',
        'cities', 'countries',
        ['country_id'], ['id'],
        ondelete='RESTRICT'
    )

    # Step 9: Update constraint names for weather_current
    op.drop_constraint('uq_weather_current_loc_time', 'weather_current', type_='unique')
    op.create_unique_constraint(
        'uq_weather_current_city_time',
        'weather_current',
        ['location_id', 'observation_time']
    )

    # Step 10: Update constraint names for air_quality
    op.drop_constraint('uq_aqi_loc_time', 'air_quality', type_='unique')
    op.create_unique_constraint(
        'uq_aqi_city_time',
        'air_quality',
        ['location_id', 'measurement_time']
    )

    # Step 11: Rename location_id to city_id in weather_current
    op.alter_column(
        'weather_current', 'location_id',
        new_column_name='city_id',
        existing_type=sa.CHAR(36),
        existing_nullable=False
    )
    op.drop_constraint('weather_current_location_id_fkey', 'weather_current', type_='foreignkey')
    op.create_foreign_key(
        'fk_weather_current_city_id',
        'weather_current', 'cities',
        ['city_id'], ['id'],
        ondelete='CASCADE'
    )

    # Step 12: Rename location_id to city_id in air_quality
    op.alter_column(
        'air_quality', 'location_id',
        new_column_name='city_id',
        existing_type=sa.CHAR(36),
        existing_nullable=False
    )
    op.drop_constraint('air_quality_location_id_fkey', 'air_quality', type_='foreignkey')
    op.create_foreign_key(
        'fk_air_quality_city_id',
        'air_quality', 'cities',
        ['city_id'], ['id'],
        ondelete='CASCADE'
    )

    # Step 13: Rename location_id in weather_hourly
    op.alter_column(
        'weather_hourly', 'location_id',
        new_column_name='city_id',
        existing_type=sa.CHAR(36),
        existing_nullable=False
    )
    op.drop_constraint('weather_hourly_location_id_fkey', 'weather_hourly', type_='foreignkey')
    op.create_foreign_key(
        'fk_weather_hourly_city_id',
        'weather_hourly', 'cities',
        ['city_id'], ['id'],
        ondelete='CASCADE'
    )

    # Step 14: Rename location_id in weather_daily
    op.alter_column(
        'weather_daily', 'location_id',
        new_column_name='city_id',
        existing_type=sa.CHAR(36),
        existing_nullable=False
    )
    op.drop_constraint('weather_daily_location_id_fkey', 'weather_daily', type_='foreignkey')
    op.create_foreign_key(
        'fk_weather_daily_city_id',
        'weather_daily', 'cities',
        ['city_id'], ['id'],
        ondelete='CASCADE'
    )

    # Step 15: Rename location_id in weather_history
    op.alter_column(
        'weather_history', 'location_id',
        new_column_name='city_id',
        existing_type=sa.CHAR(36),
        existing_nullable=False
    )
    op.drop_constraint('weather_history_location_id_fkey', 'weather_history', type_='foreignkey')
    op.create_foreign_key(
        'fk_weather_history_city_id',
        'weather_history', 'cities',
        ['city_id'], ['id'],
        ondelete='CASCADE'
    )

    # Step 16: Create current_data table (using UUID type to match cities.id)
    op.create_table(
        'current_data',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('city_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('module', sa.String(50), nullable=False),
        sa.Column('data', postgresql.JSON(), nullable=True),
        sa.Column('fetched_at', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['city_id'], ['cities.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('city_id', 'module', name='uq_current_data_city_module'),
    )
    op.create_index(op.f('ix_current_data_city_id'), 'current_data', ['city_id'])
    op.create_index(op.f('ix_current_data_module'), 'current_data', ['module'])

    # Step 17: Create raw_responses table (using UUID type)
    op.create_table(
        'raw_responses',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('city_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('module', sa.String(50), nullable=False),
        sa.Column('response_type', sa.String(20), nullable=False),
        sa.Column('data', postgresql.JSON(), nullable=True),
        sa.Column('response_time', sa.Integer(), nullable=True),
        sa.Column('status_code', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['city_id'], ['cities.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_raw_responses_city_id'), 'raw_responses', ['city_id'])
    op.create_index(op.f('ix_raw_responses_module'), 'raw_responses', ['module'])

    # Step 18: Create new indices for cities
    # Note: Old indices from locations table were manually recreated, no need to drop them
    op.create_index(op.f('ix_cities_country_id'), 'cities', ['country_id'])
    op.create_index(op.f('ix_cities_is_favorite'), 'cities', ['is_favorite'])


def downgrade() -> None:
    # Reverse all the steps above (in reverse order)
    op.drop_index(op.f('ix_cities_name'), table_name='cities')
    op.drop_index(op.f('ix_cities_is_favorite'), table_name='cities')
    op.drop_index(op.f('ix_cities_is_active'), table_name='cities')
    op.drop_index(op.f('ix_cities_country_id'), table_name='cities')
    
    op.create_index('ix_locations_name', 'cities', ['name'])
    op.create_index('ix_locations_is_active', 'cities', ['is_active'])
    op.create_index('ix_locations_country_code', 'cities', ['country_id'])

    op.drop_table('raw_responses')
    op.drop_table('current_data')

    op.drop_constraint('fk_weather_history_city_id', 'weather_history', type_='foreignkey')
    op.alter_column('weather_history', 'city_id', new_column_name='location_id')
    op.create_foreign_key('weather_history_location_id_fkey', 'weather_history', 'cities', ['location_id'], ['id'], ondelete='CASCADE')

    op.drop_constraint('fk_weather_daily_city_id', 'weather_daily', type_='foreignkey')
    op.alter_column('weather_daily', 'city_id', new_column_name='location_id')
    op.create_foreign_key('weather_daily_location_id_fkey', 'weather_daily', 'cities', ['location_id'], ['id'], ondelete='CASCADE')

    op.drop_constraint('fk_weather_hourly_city_id', 'weather_hourly', type_='foreignkey')
    op.alter_column('weather_hourly', 'city_id', new_column_name='location_id')
    op.create_foreign_key('weather_hourly_location_id_fkey', 'weather_hourly', 'cities', ['location_id'], ['id'], ondelete='CASCADE')

    op.drop_constraint('fk_air_quality_city_id', 'air_quality', type_='foreignkey')
    op.alter_column('air_quality', 'city_id', new_column_name='location_id')
    op.create_foreign_key('air_quality_location_id_fkey', 'air_quality', 'cities', ['location_id'], ['id'], ondelete='CASCADE')

    op.drop_constraint('fk_weather_current_city_id', 'weather_current', type_='foreignkey')
    op.alter_column('weather_current', 'city_id', new_column_name='location_id')
    op.create_foreign_key('weather_current_location_id_fkey', 'weather_current', 'cities', ['location_id'], ['id'], ondelete='CASCADE')

    op.drop_constraint('uq_aqi_city_time', 'air_quality', type_='unique')
    op.create_unique_constraint('uq_aqi_loc_time', 'air_quality', ['location_id', 'measurement_time'])

    op.drop_constraint('uq_weather_current_city_time', 'weather_current', type_='unique')
    op.create_unique_constraint('uq_weather_current_loc_time', 'weather_current', ['location_id', 'observation_time'])

    op.drop_constraint('fk_cities_country_id', 'cities', type_='foreignkey')
    op.alter_column('cities', 'country_id', nullable=True)
    op.add_column('cities', sa.Column('country_code', sa.String(2), nullable=False, server_default='IN'))
    op.add_column('cities', sa.Column('country', sa.String(100), nullable=False, server_default='India'))
    op.drop_column('cities', 'is_favorite')
    op.drop_column('cities', 'state')
    op.drop_column('cities', 'country_id')

    op.rename_table('cities', 'locations')

    op.drop_table('countries')
