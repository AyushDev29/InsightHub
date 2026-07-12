/**
 * HourlyForecast Component
 * Displays 48-hour hourly forecast with 4 interactive charts:
 * 1. Temperature (with feels-like)
 * 2. Humidity
 * 3. Wind Speed
 * 4. Precipitation (chance + amount)
 */

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart,
} from 'recharts'
import { apiService } from '../../services/api'
import ChartTooltip from '../shared/ChartTooltip'

interface HourlyForecastProps {
  latitude: number
  longitude: number
  hours?: number
}

function getWeatherEmoji(description: string): string {
  const desc = description.toLowerCase()
  if (desc.includes('clear') || desc.includes('sunny')) return '☀️'
  if (desc.includes('cloud')) return '☁️'
  if (desc.includes('rain')) return '🌧️'
  if (desc.includes('thunderstorm')) return '⛈️'
  if (desc.includes('snow')) return '❄️'
  return '🌤️'
}

export default function HourlyForecast({
  latitude,
  longitude,
  hours = 48,
}: HourlyForecastProps) {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric')

  // Fetch hourly forecast
  const { data: forecastRes, isLoading, isError } = useQuery({
    queryKey: ['hourly-forecast', latitude, longitude, hours],
    queryFn: async () => {
      return apiService.getHourlyForecast(latitude, longitude, hours)
    },
    staleTime: 30 * 60 * 1000, // 30 min
    refetchInterval: 60 * 60 * 1000, // every hour
  })

  const forecasts = forecastRes?.data?.forecasts || []

  // Process chart data
  const chartData = useMemo(() => {
    return forecasts.map((f: any) => {
      const time = new Date(f.forecast_time)
      const windKmh = f.wind_speed * 3.6
      const windMph = windKmh * 0.621371

      return {
        time: time.getHours().toString().padStart(2, '0') + ':00',
        date: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temp: unitSystem === 'metric' ? f.temperature : (f.temperature * 9/5) + 32,
        feelsLike: unitSystem === 'metric' ? f.feels_like : (f.feels_like * 9/5) + 32,
        humidity: f.humidity,
        windSpeed: unitSystem === 'metric' ? windKmh : windMph,
        rainChance: f.precipitation_probability,
        rainAmount: f.precipitation,
        description: f.weather_description,
        emoji: getWeatherEmoji(f.weather_description),
      }
    })
  }, [forecasts, unitSystem])

  const tempUnit = unitSystem === 'metric' ? '°C' : '°F'
  const windUnit = unitSystem === 'metric' ? 'km/h' : 'mph'

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading forecast data...</div>
      </div>
    )
  }

  if (isError || chartData.length === 0) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load forecast data</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">
          48-Hour Hourly Forecast
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              unitSystem === 'metric'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
          >
            °C / km/h
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              unitSystem === 'imperial'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
          >
            °F / mph
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Temperature Chart */}
        <div className="card p-6">
          <h4 className="text-sm font-semibold text-white mb-4">Temperature Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#718096', fontSize: 11 }}
                interval={5}
              />
              <YAxis
                tick={{ fill: '#718096', fontSize: 11 }}
                unit={tempUnit}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip
                content={<ChartTooltip unit={tempUnit} />}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
              <Line
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="#f56565"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="feelsLike"
                name="Feels Like"
                stroke="#fc8181"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity Chart */}
        <div className="card p-6">
          <h4 className="text-sm font-semibold text-white mb-4">Humidity Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#718096', fontSize: 11 }}
                interval={5}
              />
              <YAxis
                tick={{ fill: '#718096', fontSize: 11 }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                content={<ChartTooltip unit="%" />}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#63b3ed"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Wind Speed Chart */}
        <div className="card p-6">
          <h4 className="text-sm font-semibold text-white mb-4">Wind Speed Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#718096', fontSize: 11 }}
                interval={5}
              />
              <YAxis
                tick={{ fill: '#718096', fontSize: 11 }}
                unit={windUnit}
              />
              <Tooltip
                content={<ChartTooltip unit={windUnit} />}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
              <Line
                type="monotone"
                dataKey="windSpeed"
                name="Wind Speed"
                stroke="#68d391"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Precipitation Chart */}
        <div className="card p-6">
          <h4 className="text-sm font-semibold text-white mb-4">Precipitation</h4>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#718096', fontSize: 11 }}
                interval={5}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#718096', fontSize: 11 }}
                unit="mm"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#718096', fontSize: 11 }}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip
                content={<ChartTooltip />}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
              <Bar
                yAxisId="left"
                dataKey="rainAmount"
                name="Rain Amount"
                fill="#76e4f7"
                opacity={0.6}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rainChance"
                name="Rain Chance"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {[
          {
            label: 'Warmest',
            value: `${Math.max(...chartData.map(d => d.temp)).toFixed(1)}${tempUnit}`,
            color: 'text-red-400',
          },
          {
            label: 'Coolest',
            value: `${Math.min(...chartData.map(d => d.temp)).toFixed(1)}${tempUnit}`,
            color: 'text-blue-400',
          },
          {
            label: 'Avg Humidity',
            value: `${(chartData.reduce((s, d) => s + d.humidity, 0) / chartData.length).toFixed(0)}%`,
            color: 'text-cyan-400',
          },
          {
            label: 'Max Wind',
            value: `${Math.max(...chartData.map(d => d.windSpeed)).toFixed(1)}${windUnit}`,
            color: 'text-teal-400',
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-3">
            <p className="text-xs text-gray-400 uppercase">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
