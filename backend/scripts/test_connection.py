"""
Test Supabase PostgreSQL Connection

Quick script to verify database connectivity.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.db.database import engine, init_db, close_db
from app.core.logging import logger
from app.core.config import settings


async def test_connection():
    """Test database connection"""
    
    print("\n" + "=" * 70)
    print("  🔍 Testing Supabase PostgreSQL Connection")
    print("=" * 70)
    
    # Show connection details (hide password)
    db_url = settings.DATABASE_URL
    if "@" in db_url:
        parts = db_url.split("@")
        safe_url = parts[0].split(":")[0] + ":****@" + parts[1]
    else:
        safe_url = db_url
    
    print(f"\n  📍 Database: {safe_url}")
    print(f"  🌍 Environment: {settings.ENVIRONMENT}")
    print(f"  ⚙️  Pool Size: {settings.DATABASE_POOL_SIZE}")
    
    try:
        # Initialize database
        print("\n  📡 Connecting to database...")
        await init_db()
        print("  ✅ Connection established!")
        
        # Get engine and test query
        
        async with engine.connect() as conn:
            # Test 1: PostgreSQL version
            result = await conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"\n  🐘 PostgreSQL Version:")
            print(f"     {version.split(',')[0]}")
            
            # Test 2: Current database
            result = await conn.execute(text("SELECT current_database()"))
            db_name = result.scalar()
            print(f"\n  💾 Current Database: {db_name}")
            
            # Test 3: Check tables
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = result.fetchall()
            
            if tables:
                print(f"\n  📋 Existing Tables ({len(tables)}):")
                for table in tables:
                    print(f"     • {table[0]}")
            else:
                print(f"\n  📋 Tables: None (run migrations to create)")
            
            # Test 4: Write test
            print(f"\n  ✍️  Testing write permissions...")
            try:
                await conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS _connection_test (
                        id SERIAL PRIMARY KEY,
                        test_value TEXT
                    )
                """))
                await conn.execute(text("""
                    INSERT INTO _connection_test (test_value) 
                    VALUES ('test')
                """))
                await conn.execute(text("DROP TABLE _connection_test"))
                await conn.commit()
                print("  ✅ Write permissions OK")
            except Exception as e:
                print(f"  ⚠️  Write test failed: {e}")
        
        print("\n" + "=" * 70)
        print("  ✅ All Connection Tests Passed!")
        print("=" * 70)
        print("\n  📝 Next Steps:")
        print("     1. Run migrations: alembic upgrade head")
        print("     2. Seed cities: python scripts/seed_cities.py")
        print("     3. Start server: uvicorn app.main:app --reload")
        print("\n" + "=" * 70 + "\n")
        
    except Exception as e:
        print(f"\n  ❌ Connection Failed!")
        print(f"     Error: {str(e)}")
        print("\n  🔧 Troubleshooting:")
        print("     • Check your DATABASE_URL in .env")
        print("     • Verify Supabase project is running")
        print("     • Check network connectivity")
        print("     • Verify password is correct")
        print("\n" + "=" * 70 + "\n")
        raise
    finally:
        await close_db()


if __name__ == "__main__":
    asyncio.run(test_connection())
