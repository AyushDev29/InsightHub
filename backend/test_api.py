"""
Quick API Test Script

Tests all weather endpoints to verify they're working
"""

import asyncio
import httpx
from datetime import date, timedelta


BASE_URL = "http://localhost:8000/api/v1"

# Test coordinates (New York City)
LATITUDE = 40.7128
LONGITUDE = -74.0060


async def test_health():
    """Test health endpoint"""
    print("🔍 Testing Health Endpoint...")
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/health")
        print(f"✅ Health: {response.status_code}")
        print(f"   Response: {response.json()}\n")


async def test_current_weather():
    """Test current weather endpoint"""
    print("🌤️  Testing Current Weather...")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/weather/current",
            params={"latitude": LATITUDE, "longitude": LONGITUDE}
        )
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        if data.get("success"):
            weather = data["data"]
            print(f"   Temperature: {weather.get('temperature')}°C")
            print(f"   Wind Speed: {weather.get('wind_speed')} m/s")
            print(f"   Weather Code: {weather.get('weather_code')}\n")
        else:
            print(f"   ❌ Error: {data}\n")


async def test_hourly_forecast():
    """Test hourly forecast endpoint"""
    print("⏰ Testing Hourly Forecast...")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/weather/hourly",
            params={"latitude": LATITUDE, "longitude": LONGITUDE, "hours": 24}
        )
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        if data.get("success"):
            forecasts = data["data"]["forecasts"]
            print(f"   Got {len(forecasts)} hourly forecasts")
            if forecasts:
                print(f"   First forecast: {forecasts[0]['forecast_time']}, {forecasts[0]['temperature']}°C\n")
        else:
            print(f"   ❌ Error: {data}\n")


async def test_daily_forecast():
    """Test daily forecast endpoint"""
    print("📅 Testing Daily Forecast...")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/weather/daily",
            params={"latitude": LATITUDE, "longitude": LONGITUDE, "days": 7}
        )
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        if data.get("success"):
            forecasts = data["data"]["forecasts"]
            print(f"   Got {len(forecasts)} daily forecasts")
            if forecasts:
                print(f"   Tomorrow: Max {forecasts[1]['temperature_max']}°C, Min {forecasts[1]['temperature_min']}°C\n")
        else:
            print(f"   ❌ Error: {data}\n")


async def test_historical_weather():
    """Test historical weather endpoint"""
    print("📜 Testing Historical Weather...")
    end_date = date.today() - timedelta(days=1)
    start_date = end_date - timedelta(days=7)
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/weather/history",
            params={
                "latitude": LATITUDE,
                "longitude": LONGITUDE,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
            }
        )
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        if data.get("success"):
            records = data["data"]["records"]
            print(f"   Got {len(records)} historical records")
            if records:
                print(f"   Last record: {records[-1]['record_date']}\n")
        else:
            print(f"   ❌ Error: {data}\n")


async def test_air_quality():
    """Test air quality endpoint"""
    print("🌬️  Testing Air Quality...")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/weather/air-quality",
            params={"latitude": LATITUDE, "longitude": LONGITUDE}
        )
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        if data.get("success"):
            aqi_data = data["data"]
            print(f"   AQI: {aqi_data.get('aqi')} ({aqi_data.get('aqi_category')})")
            print(f"   PM2.5: {aqi_data.get('pm2_5')} µg/m³")
            print(f"   PM10: {aqi_data.get('pm10')} µg/m³\n")
        else:
            print(f"   ❌ Error: {data}\n")


async def test_location_search():
    """Test location search endpoint"""
    print("🔍 Testing Location Search...")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/weather/search",
            params={"query": "New York", "count": 5}
        )
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        if data.get("success"):
            results = data["data"]["results"]
            print(f"   Found {len(results)} locations")
            if results:
                for i, loc in enumerate(results[:3], 1):
                    print(f"   {i}. {loc['name']}, {loc['country']} ({loc['latitude']}, {loc['longitude']})")
            print()
        else:
            print(f"   ❌ Error: {data}\n")


async def main():
    """Run all tests"""
    print("=" * 60)
    print("🚀 InsightHub AI - Backend API Tests")
    print("=" * 60)
    print()
    
    try:
        await test_health()
        await test_current_weather()
        await test_hourly_forecast()
        await test_daily_forecast()
        await test_historical_weather()
        await test_air_quality()
        await test_location_search()
        
        print("=" * 60)
        print("✅ All Tests Completed!")
        print("=" * 60)
        print()
        print("🎉 Your backend is working perfectly!")
        print("📚 Visit http://localhost:8000/api/docs for Swagger UI")
        
    except httpx.ConnectError:
        print("❌ Error: Could not connect to backend")
        print("   Make sure the server is running:")
        print("   > cd backend")
        print("   > uvicorn app.main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
