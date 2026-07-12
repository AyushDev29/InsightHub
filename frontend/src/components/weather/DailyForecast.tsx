/**
 * DailyForecast Component
 * Displays 16-day daily forecast as interactive cards
 * Shows: max/min temps, weather condition, precipitation, wind, UV index, sunrise/sunset
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Wind, Droplets, Sun, Gauge } from 'lucide-react'
import { apiService } from '../../services/api'

interface DailyForecastProps {
  latitude: number
  longitude: number
  days?: number
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

function formatTime(timeStr: string): string {
  try {
    const [hours, minutes] = timeStr.split(':')
    return `${hours}:${minutes}`
  } catch {
    return timeStr
  }
}

export default function DailyForecast({
  latitude,
  longitude,
  days = 16,
}: DailyForecastProps) {
  // Fetch daily forecast
  const { data: forecastRes, isLoading, isError } = useQuery({
    queryKey: ['daily-forecast', latitude, longitude, days],
    queryFn: async () => {
      return apiService.getDailyForecast(latitude, longitude, days)
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 4 * 60 * 60 * 1000, // every 4 hours
  })

  const forecasts = forecastRes?.data?.forecasts || []

  // Process data
  const processedData = useMemo(() => {
    return forecasts.map((f: any) => {
      const date = new Date(f.forecast_date)
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        maxTemp: f.temperature_max,
        minTemp: f.temperature_min,
        feelsLikeMax: f.feels_like_max,
        feelsLikeMin: f.feels_like_min,
        precipitation: f.precipitation_sum,
        rainChance: f.precipitation_probability,
        windSpeed: f.wind_speed_max * 3.6, // m/s to km/h
        windGust: f.wind_gust_max * 3.6,
        description: f.weather_description,
        emoji: getWeatherEmoji(f.weather_description),
        sunrise: formatTime(f.sunrise),
        sunset: formatTime(f.sunset),
      }
    })
  }, [forecasts])

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading forecast data...</div>
      </div>
    )
  }

  if (isError || processedData.length === 0) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load forecast data</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white">16-Day Forecast</h3>

      {/* Horizontal scrolling card grid */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-4 w-max">
          {processedData.map((forecast, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-48 card p-4 hover:border-primary-500 transition-all cursor-pointer hover:shadow-xl hover:bg-dark-700"
            >
              {/* Date */}
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                {forecast.date}
              </p>

              {/* Weather Emoji + Description */}
              <div className="mb-3">
                <div className="text-4xl mb-1">{forecast.emoji}</div>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {forecast.description}
                </p>
              </div>

              {/* Temperature */}
              <div className="mb-3 pb-3 border-b border-dark-600">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-bold text-red-400">
                    {forecast.maxTemp.toFixed(0)}°
                  </span>
                  <span className="text-sm font-semibold text-blue-400 mb-0.5">
                    {forecast.minTemp.toFixed(0)}°
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Feels {forecast.feelsLikeMax.toFixed(0)}° – {forecast.feelsLikeMin.toFixed(0)}°
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="space-y-2 text-xs">
                {/* Precipitation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Droplets size={14} className="text-blue-400" />
                    <span className="text-gray-400">Chance</span>
                  </div>
                  <span className="text-white font-medium">{forecast.rainChance}%</span>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Droplets size={14} className="text-cyan-400" />
                    <span className="text-gray-400">Amount</span>
                  </div>
                  <span className="text-white font-medium">
                    {forecast.precipitation > 0 ? `${forecast.precipitation.toFixed(1)}mm` : '—'}
                  </span>
                </div>

                {/* Wind */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Wind size={14} className="text-teal-400" />
                    <span className="text-gray-400">Wind</span>
                  </div>
                  <span className="text-white font-medium">
                    {forecast.windSpeed.toFixed(0)} km/h
                  </span>
                </div>

                {/* Gust */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Wind size={14} className="text-amber-400" />
                    <span className="text-gray-400">Gust</span>
                  </div>
                  <span className="text-white font-medium">
                    {forecast.windGust.toFixed(0)} km/h
                  </span>
                </div>

                {/* Sunrise/Sunset */}
                <div className="flex items-center justify-between pt-1 border-t border-dark-600">
                  <div className="flex items-center gap-1">
                    <Sun size={14} className="text-yellow-400" />
                    <span className="text-gray-400 text-xs">Rise/Set</span>
                  </div>
                  <span className="text-white font-medium text-xs">
                    {forecast.sunrise} / {forecast.sunset}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-sm">
        {[
          {
            label: 'Warmest Day',
            value: `${Math.max(...processedData.map(d => d.maxTemp)).toFixed(0)}°C`,
            color: 'text-red-400',
          },
          {
            label: 'Coolest Day',
            value: `${Math.min(...processedData.map(d => d.minTemp)).toFixed(0)}°C`,
            color: 'text-blue-400',
          },
          {
            label: 'Rainy Days',
            value: `${processedData.filter(d => d.rainChance > 50).length}`,
            color: 'text-cyan-400',
          },
          {
            label: 'Avg Humidity',
            value: `—`,
            color: 'text-gray-400',
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-3">
            <p className="text-xs text-gray-400 uppercase">{stat.label}</p>
            <p className={`text-base font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
