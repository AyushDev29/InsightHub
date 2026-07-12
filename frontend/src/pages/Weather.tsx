/**
 * Weather Analysis Page
 * Professional weather analysis with current conditions, hourly/daily forecasts,
 * historical data, comparison, and statistics.
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import CurrentWeather from '../components/weather/CurrentWeather'
import HourlyForecast from '../components/weather/HourlyForecast'
import DailyForecast from '../components/weather/DailyForecast'
import HistoricalChart from '../components/weather/HistoricalChart'
import ComparisonView from '../components/weather/ComparisonView'

// ─── Cities ─────────────────────────────────────────────────────────────────

const CITIES = [
  { id: 'mumbai',    name: 'Mumbai',    lat: 19.0760, lng: 72.8777 },
  { id: 'delhi',     name: 'Delhi',     lat: 28.7041, lng: 77.1025 },
  { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 'chennai',   name: 'Chennai',   lat: 13.0827, lng: 80.2707 },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { id: 'kolkata',   name: 'Kolkata',   lat: 22.5726, lng: 88.3639 },
  { id: 'pune',      name: 'Pune',      lat: 18.5204, lng: 73.8567 },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Weather() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCityId = searchParams.get('city') || 'delhi'
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get selected city data
  const selectedCity = CITIES.find((c) => c.id === selectedCityId) || CITIES[1]

  // Handle city change
  const handleCityChange = (cityId: string) => {
    setSearchParams({ city: cityId })
  }

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Weather Analysis</h1>
          <p className="text-gray-400 mt-1">
            Comprehensive weather insights for {selectedCity.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedCityId}
            onChange={(e) => handleCityChange(e.target.value)}
            className="px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white text-sm hover:border-primary-500 transition-colors focus:outline-none focus:border-primary-400"
          >
            {CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            className="p-2 rounded hover:bg-dark-700 transition-colors"
            title="Refresh data"
          >
            <RefreshCw
              size={20}
              className={`text-primary-400 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* ── Current Weather Section ────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Current Conditions</h2>
        <CurrentWeather
          latitude={selectedCity.lat}
          longitude={selectedCity.lng}
          cityName={selectedCity.name}
        />
      </div>

      {/* ── Hourly Forecast Section ────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Hourly Forecast</h2>
        <HourlyForecast
          latitude={selectedCity.lat}
          longitude={selectedCity.lng}
          hours={48}
        />
      </div>

      {/* ── Daily Forecast Section ─────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Daily Forecast</h2>
        <DailyForecast
          latitude={selectedCity.lat}
          longitude={selectedCity.lng}
          days={16}
        />
      </div>

      {/* ── Historical Data Section ────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Historical Weather Data</h2>
        <HistoricalChart
          latitude={selectedCity.lat}
          longitude={selectedCity.lng}
        />
      </div>

      {/* ── Weather Comparison Section ─────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Compare Cities</h2>
        <ComparisonView />
      </div>

      {/* ── Placeholder sections for future components ──────────────────── */}
      <div className="text-center text-gray-400 py-12">
        <p className="text-sm">More sections coming soon...</p>
        <p className="text-xs text-gray-500 mt-2">
          Statistics
        </p>
      </div>
    </div>
  )
}
