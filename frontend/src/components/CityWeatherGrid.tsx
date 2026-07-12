import { Wind, Droplets, Eye } from 'lucide-react'
import { useWeather, useAirQuality } from '../hooks/useWeather'
import { formatTemperature, getWeatherIcon } from '../utils/weather'
import CityWeatherSkeleton from './CityWeatherSkeleton'
import { useNavigate } from 'react-router-dom'

interface City {
  id: string
  name: string
  lat: number
  lng: number
}

interface CityWeatherGridProps {
  cities: City[]
}

function CityCard({ city }: { city: City }) {
  const navigate = useNavigate()
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useWeather(city.lat, city.lng)
  const { data: aqi, isLoading: aqiLoading, error: aqiError } = useAirQuality(city.lat, city.lng)

  if (weatherLoading || aqiLoading) return <CityWeatherSkeleton />

  if (weatherError || aqiError) {
    return (
      <div className="card p-4 bg-red-500/10 border-red-500/20">
        <p className="text-red-400 text-sm">Failed to load data for {city.name}</p>
      </div>
    )
  }

  if (!weather || !aqi) {
    return (
      <div className="card p-4">
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    )
  }

  // Wind in km/h (backend sends m/s → multiply by 3.6)
  const windKmh = Math.round((weather.wind_speed || 0) * 3.6)

  // Visibility: backend sends metres, show as km with 1 decimal
  const visKm = weather.visibility != null ? (weather.visibility / 1000).toFixed(1) : '—'

  // Feels-like: only show when the backend actually returns it
  const feelsLike = weather.feels_like != null && weather.feels_like !== 0
    ? `Feels like ${formatTemperature(weather.feels_like)}`
    : weather.humidity != null
    ? `Humidity ${weather.humidity}%`
    : ''

  // AQI colour
  const aqiColour =
    aqi.aqi <= 20 ? 'bg-green-500/20 text-green-400' :
    aqi.aqi <= 40 ? 'bg-lime-500/20 text-lime-400' :
    aqi.aqi <= 60 ? 'bg-yellow-500/20 text-yellow-400' :
    aqi.aqi <= 80 ? 'bg-orange-500/20 text-orange-400' :
    'bg-red-500/20 text-red-400'

  return (
    <div
      className="card-hover p-6 cursor-pointer"
      onClick={() => navigate(`/city/${city.id}`, { state: { city } })}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{city.name}</h3>
          <p className="text-sm text-gray-400">{weather.weather_description}</p>
        </div>
        <span className="text-4xl">{getWeatherIcon(weather.weather_code, weather.is_day)}</span>
      </div>

      {/* Temperature */}
      <div className="mb-4">
        <p className="text-4xl font-bold text-white">{formatTemperature(weather.temperature)}</p>
        {feelsLike && <p className="text-sm text-gray-400 mt-1">{feelsLike}</p>}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-dark-700">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Wind size={14} className="text-primary-400" />
            <p className="text-xs text-gray-400">Wind</p>
          </div>
          <p className="text-sm font-medium text-white">{windKmh > 0 ? windKmh + ' km/h' : '—'}</p>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <Droplets size={14} className="text-primary-400" />
            <p className="text-xs text-gray-400">Humidity</p>
          </div>
          <p className="text-sm font-medium text-white">
            {weather.humidity != null && weather.humidity > 0 ? `${weather.humidity}%` : '—'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <Eye size={14} className="text-primary-400" />
            <p className="text-xs text-gray-400">Visibility</p>
          </div>
          <p className="text-sm font-medium text-white">{weather.visibility && weather.visibility > 0 ? visKm + ' km' : '—'}</p>
        </div>
      </div>

      {/* AQI */}
      <div className="pt-4 border-t border-dark-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Air Quality Index</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${aqiColour}`}>
            {aqi.aqi} · {aqi.aqi_category}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CityWeatherGrid({ cities }: CityWeatherGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => (
        <CityCard key={city.id} city={city} />
      ))}
    </div>
  )
}