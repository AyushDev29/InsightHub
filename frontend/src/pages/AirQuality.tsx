/**
 * Air Quality Analysis Page
 * Comprehensive air quality analysis with AQI tracking, pollutants, trends, and health recommendations
 */

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import AQIOverview from '../components/airquality/AQIOverview'
import PollutantBreakdown from '../components/airquality/PollutantBreakdown'
import HealthRecommendations from '../components/airquality/HealthRecommendations'
import CityRanking from '../components/airquality/CityRanking'

const CITIES = [
  { id: 'mumbai',    name: 'Mumbai',    lat: 19.0760, lng: 72.8777 },
  { id: 'delhi',     name: 'Delhi',     lat: 28.7041, lng: 77.1025 },
  { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 'chennai',   name: 'Chennai',   lat: 13.0827, lng: 80.2707 },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { id: 'kolkata',   name: 'Kolkata',   lat: 22.5726, lng: 88.3639 },
  { id: 'pune',      name: 'Pune',      lat: 18.5204, lng: 73.8567 },
]

export default function AirQuality() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCityId = searchParams.get('city') || 'delhi'
  const [isRefreshing, setIsRefreshing] = useState(false)

  const selectedCity = CITIES.find((c) => c.id === selectedCityId) || CITIES[1]

  const handleCityChange = (cityId: string) => {
    setSearchParams({ city: cityId })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Air Quality Analysis</h1>
          <p className="text-gray-400 mt-1">
            Detailed pollution analysis for {selectedCity.name}
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

      {/* ── AQI Overview Section ───────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Current AQI</h2>
        <AQIOverview
          latitude={selectedCity.lat}
          longitude={selectedCity.lng}
          cityName={selectedCity.name}
        />
      </div>

      {/* ── Pollutant Breakdown Section ────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Pollutant Breakdown</h2>
        <PollutantBreakdown
          latitude={selectedCity.lat}
          longitude={selectedCity.lng}
        />
      </div>

      {/* ── Health Recommendations Section ────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Health Recommendations</h2>
        <HealthRecommendations
          latitude={selectedCity.lat}
          longitude={selectedCity.lng}
        />
      </div>

      {/* ── City Ranking Section ────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">City Rankings</h2>
        <CityRanking />
      </div>
    </div>
  )
}
