/**
 * CurrentWeather Component
 * Displays comprehensive current weather conditions for a location
 * Shows: temperature, feels-like, humidity, pressure, visibility, wind, sunrise/sunset, etc.
 */

import { useQuery } from '@tanstack/react-query'
import { Cloud, Wind, Droplets, Eye, Clock, Sun } from 'lucide-react'
import { apiService } from '../../services/api'
import { WeatherData } from '../../types/api'

interface CurrentWeatherProps {
  latitude: number
  longitude: number
  cityName: string
}

function getWeatherEmoji(description: string): string {
  const desc = description.toLowerCase()
  if (desc.includes('clear') || desc.includes('sunny')) return '☀️'
  if (desc.includes('cloud')) return '☁️'
  if (desc.includes('rain')) return '🌧️'
  if (desc.includes('thunderstorm')) return '⛈️'
  if (desc.includes('snow')) return '❄️'
  if (desc.includes('overcast')) return '☁️'
  if (desc.includes('fog') || desc.includes('mist')) return '🌫️'
  return '🌤️'
}

function getWindDirection(deg: number): string {
  if (deg < 11.25) return 'N'
  if (deg < 33.75) return 'NNE'
  if (deg < 56.25) return 'NE'
  if (deg < 78.75) return 'ENE'
  if (deg < 101.25) return 'E'
  if (deg < 123.75) return 'ESE'
  if (deg < 146.25) return 'SE'
  if (deg < 168.75) return 'SSE'
  if (deg < 191.25) return 'S'
  if (deg < 213.75) return 'SSW'
  if (deg < 236.25) return 'SW'
  if (deg < 258.75) return 'WSW'
  if (deg < 281.25) return 'W'
  if (deg < 303.75) return 'WNW'
  if (deg < 326.25) return 'NW'
  if (deg < 348.75) return 'NNW'
  return 'N'
}

export default function CurrentWeather({
  latitude,
  longitude,
  cityName,
}: CurrentWeatherProps) {
  // Fetch current weather
  const { data: weatherRes, isLoading, isError } = useQuery({
    queryKey: ['current-weather', latitude, longitude],
    queryFn: async () => {
      return apiService.getCurrentWeather(latitude, longitude)
    },
    refetchInterval: 5 * 60 * 1000, // every 5 min
    staleTime: 4 * 60 * 1000, // consider stale after 4 min
  })

  const weather = weatherRes?.data as WeatherData | undefined

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-dark-700 rounded-full" />
          <p className="text-gray-400 text-sm">Loading weather data...</p>
        </div>
      </div>
    )
  }

  if (isError || !weather) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400 text-center">Failed to load weather data</p>
      </div>
    )
  }

  // Format timestamp
  const lastUpdate = new Date(weather.observation_time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Calculate wind speed in km/h (API returns m/s)
  const windSpeedKmh = (weather.wind_speed * 3.6).toFixed(1)
  const windGustKmh = (weather.wind_gust * 3.6).toFixed(1)
  const windDir = getWindDirection(weather.wind_direction_deg)
  const weatherEmoji = getWeatherEmoji(weather.weather_description)

  // Parse sunrise/sunset times (they come as HH:MM)
  const formatTime = (timeStr: string): string => {
    try {
      const [hours, minutes] = timeStr.split(':')
      return `${hours}:${minutes}`
    } catch {
      return timeStr
    }
  }

  const sunriseTime = formatTime(weather.visibility.toString())
  const sunsetTime = formatTime(weather.visibility.toString())

  return (
    <div className="space-y-6">
      {/* ── Main Temperature Display ────────────────────────────────────── */}
      <div className="card p-8 bg-gradient-to-br from-dark-800 to-dark-700 border border-dark-600">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-gray-400 text-sm mb-2">Right now in {cityName}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-bold text-white">
                {weather.temperature.toFixed(1)}
              </span>
              <span className="text-3xl text-gray-400">°C</span>
            </div>
            <p className="text-gray-400 mt-2">
              Feels like {weather.feels_like > 0 ? weather.feels_like.toFixed(1) : weather.temperature.toFixed(1)}°C
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl mb-2">{weatherEmoji}</div>
            <p className="text-lg text-white font-semibold">{weather.weather_description}</p>
            <p className="text-gray-500 text-xs mt-1">Updated at {lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* ── Metrics Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Humidity */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={18} className="text-blue-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Humidity</p>
          </div>
          <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
          <p className="text-gray-500 text-xs mt-1">Relative humidity</p>
        </div>

        {/* Pressure */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Cloud size={18} className="text-cyan-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Pressure</p>
          </div>
          <p className="text-2xl font-bold text-white">{weather.pressure} hPa</p>
          <p className="text-gray-500 text-xs mt-1">Atmospheric pressure</p>
        </div>

        {/* Visibility */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={18} className="text-purple-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Visibility</p>
          </div>
          <p className="text-2xl font-bold text-white">{(weather.visibility / 1000).toFixed(1)} km</p>
          <p className="text-gray-500 text-xs mt-1">Horizontal visibility</p>
        </div>

        {/* Wind Speed */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Wind size={18} className="text-teal-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Wind Speed</p>
          </div>
          <p className="text-2xl font-bold text-white">{windSpeedKmh} km/h</p>
          <p className="text-gray-500 text-xs mt-1">Direction: {windDir}</p>
        </div>

        {/* Wind Gust */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Wind size={18} className="text-amber-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Wind Gust</p>
          </div>
          <p className="text-2xl font-bold text-white">{windGustKmh} km/h</p>
          <p className="text-gray-500 text-xs mt-1">Maximum gust</p>
        </div>

        {/* Cloudiness */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Cloud size={18} className="text-gray-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Cloud Cover</p>
          </div>
          <p className="text-2xl font-bold text-white">{weather.cloudiness}%</p>
          <p className="text-gray-500 text-xs mt-1">Sky coverage</p>
        </div>

        {/* Precipitation */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={18} className="text-indigo-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Precipitation</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {weather.precipitation > 0 ? `${weather.precipitation.toFixed(1)} mm` : 'None'}
          </p>
          <p className="text-gray-500 text-xs mt-1">Current rainfall</p>
        </div>

        {/* Sunrise */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sun size={18} className="text-yellow-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Sunrise</p>
          </div>
          <p className="text-2xl font-bold text-white">{sunriseTime}</p>
          <p className="text-gray-500 text-xs mt-1">Morning time</p>
        </div>

        {/* Sunset */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sun size={18} className="text-orange-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wide">Sunset</p>
          </div>
          <p className="text-2xl font-bold text-white">{sunsetTime}</p>
          <p className="text-gray-500 text-xs mt-1">Evening time</p>
        </div>
      </div>
    </div>
  )
}
