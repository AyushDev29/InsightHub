/**
 * CityRanking Component
 * Displays all 7 cities ranked by AQI
 */

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'
import { apiService } from '../../services/api'

const CITIES = [
  { id: 'mumbai',    name: 'Mumbai',    lat: 19.0760, lng: 72.8777 },
  { id: 'delhi',     name: 'Delhi',     lat: 28.7041, lng: 77.1025 },
  { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 'chennai',   name: 'Chennai',   lat: 13.0827, lng: 80.2707 },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { id: 'kolkata',   name: 'Kolkata',   lat: 22.5726, lng: 88.3639 },
  { id: 'pune',      name: 'Pune',      lat: 18.5204, lng: 73.8567 },
]

type SortBy = 'aqi' | 'pm25' | 'pm10'

function getAQICategory(aqi: number): string {
  if (aqi <= 20) return 'Good'
  if (aqi <= 40) return 'Fair'
  if (aqi <= 60) return 'Moderate'
  if (aqi <= 80) return 'Poor'
  if (aqi <= 100) return 'Very Poor'
  return 'Extremely Poor'
}

function getAQIColor(aqi: number): string {
  if (aqi <= 20) return 'text-green-400'
  if (aqi <= 40) return 'text-lime-400'
  if (aqi <= 60) return 'text-yellow-400'
  if (aqi <= 80) return 'text-orange-400'
  if (aqi <= 100) return 'text-red-400'
  return 'text-red-600'
}

function getMedalEmoji(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

export default function CityRanking() {
  const [sortBy, setSortBy] = useState<SortBy>('aqi')

  // Fetch AQI for all cities
  const { data: citiesData, isLoading, isError } = useQuery({
    queryKey: ['city-ranking'],
    queryFn: async () => {
      const results: Record<string, any> = {}
      await Promise.all(
        CITIES.map(async (city) => {
          try {
            const res = await apiService.getAirQuality(city.lat, city.lng)
            results[city.id] = { ...res.data, cityName: city.name }
          } catch {
            results[city.id] = null
          }
        })
      )
      return results
    },
    refetchInterval: 15 * 60 * 1000,
    staleTime: 14 * 60 * 1000,
  })

  // Process and sort data
  const rankedCities = useMemo(() => {
    if (!citiesData) return []

    const cities = CITIES.map((city) => ({
      id: city.id,
      name: city.name,
      data: citiesData[city.id],
    })).filter((c) => c.data !== null)

    // Sort by selected metric
    const sorted = [...cities].sort((a, b) => {
      if (sortBy === 'aqi') return b.data.aqi - a.data.aqi
      if (sortBy === 'pm25') return b.data.pm2_5 - a.data.pm2_5
      if (sortBy === 'pm10') return b.data.pm10 - a.data.pm10
      return 0
    })

    return sorted
  }, [citiesData, sortBy])

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading city rankings...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load city rankings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm text-gray-400 font-semibold">Sort by:</p>
        {(['aqi', 'pm25', 'pm10'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              sortBy === option
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
          >
            {option === 'aqi' && 'AQI'}
            {option === 'pm25' && 'PM2.5'}
            {option === 'pm10' && 'PM10'}
          </button>
        ))}
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankedCities.map((city, idx) => {
          const rank = idx + 1
          const aqi = city.data.aqi || 0
          const category = getAQICategory(aqi)
          const color = getAQIColor(aqi)
          const medal = getMedalEmoji(rank)

          // Get comparison with previous rank
          const worseThanPrevious = idx > 0 && aqi > (rankedCities[idx - 1].data.aqi || 0)

          return (
            <div
              key={city.id}
              className="card p-4 flex items-center justify-between hover:border-primary-500 transition-all"
            >
              {/* Rank & City Name */}
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl w-8 text-center">{medal}</div>
                <div>
                  <p className="font-bold text-white text-lg">{city.name}</p>
                  <p className="text-xs text-gray-500">{rank} of {rankedCities.length}</p>
                </div>
              </div>

              {/* AQI Value */}
              <div className="text-right mr-4">
                <p className={`text-3xl font-bold ${color}`}>{aqi.toFixed(0)}</p>
                <p className={`text-xs ${color}`}>{category}</p>
              </div>

              {/* Trend Indicator */}
              <div className="w-8 text-center">
                {worseThanPrevious ? (
                  <TrendingUp className="text-red-400" size={20} />
                ) : (
                  <TrendingUp className="text-green-400 transform rotate-180" size={20} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {rankedCities.length > 0 && [
          {
            label: 'Best Air',
            city: rankedCities[rankedCities.length - 1]?.name,
            value: `${(rankedCities[rankedCities.length - 1]?.data.aqi || 0).toFixed(0)}`,
            color: 'text-green-400',
          },
          {
            label: 'Worst Air',
            city: rankedCities[0]?.name,
            value: `${(rankedCities[0]?.data.aqi || 0).toFixed(0)}`,
            color: 'text-red-400',
          },
          {
            label: 'Average AQI',
            city: 'All cities',
            value: `${(rankedCities.reduce((s, c) => s + c.data.aqi, 0) / rankedCities.length).toFixed(0)}`,
            color: 'text-amber-400',
          },
          {
            label: 'Cities Analyzed',
            city: 'Total',
            value: `${rankedCities.length}`,
            color: 'text-cyan-400',
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-xs text-gray-400 uppercase font-semibold">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.city}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="card p-4 bg-dark-700/50">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Category Legend</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {[
            { label: 'Good', color: 'text-green-400', range: '0-20' },
            { label: 'Fair', color: 'text-lime-400', range: '21-40' },
            { label: 'Moderate', color: 'text-yellow-400', range: '41-60' },
            { label: 'Poor', color: 'text-orange-400', range: '61-80' },
            { label: 'Very Poor', color: 'text-red-400', range: '81-100' },
            { label: 'Extremely Poor', color: 'text-red-600', range: '100+' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className={`font-semibold ${item.color}`}>{item.label}</p>
              <p className="text-gray-500">{item.range}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-gray-500">
        Rankings update every 15 minutes
      </div>
    </div>
  )
}
