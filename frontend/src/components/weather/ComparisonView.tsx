/**
 * ComparisonView Component
 * Compare weather between 2-3 cities side-by-side
 * Shows: metrics table, temperature overlay chart, and comparison stats
 */

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import CitySelector from '../shared/CitySelector'
import ChartTooltip from '../shared/ChartTooltip'
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

const COLORS = ['#f56565', '#63b3ed', '#68d391']

export default function ComparisonView() {
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>(['delhi', 'mumbai'])

  // Fetch current weather for all selected cities
  const { data: weatherData, isLoading, isError } = useQuery({
    queryKey: ['comparison-weather', selectedCityIds],
    queryFn: async () => {
      const results: Record<string, any> = {}
      await Promise.all(
        selectedCityIds.map(async (cityId) => {
          const city = CITIES.find((c) => c.id === cityId)
          if (!city) return

          try {
            const res = await apiService.getCurrentWeather(city.lat, city.lng)
            results[cityId] = { ...res.data, cityName: city.name }
          } catch (error) {
            results[cityId] = null
          }
        })
      )
      return results
    },
    refetchInterval: 5 * 60 * 1000, // every 5 min
    staleTime: 4 * 60 * 1000,
  })

  // Fetch hourly forecast for selected cities
  const { data: hourlyData } = useQuery({
    queryKey: ['comparison-hourly', selectedCityIds],
    queryFn: async () => {
      const results: Record<string, any[]> = {}
      await Promise.all(
        selectedCityIds.map(async (cityId) => {
          const city = CITIES.find((c) => c.id === cityId)
          if (!city) return

          try {
            const res = await apiService.getHourlyForecast(city.lat, city.lng, 24)
            results[cityId] = res.data?.forecasts || []
          } catch {
            results[cityId] = []
          }
        })
      )
      return results
    },
    staleTime: 30 * 60 * 1000,
  })

  // Process hourly data for overlay chart
  const overlayChartData = useMemo(() => {
    if (!hourlyData) return []

    const firstCityData = hourlyData[selectedCityIds[0]] || []
    return firstCityData.map((forecast: any, idx: number) => {
      const time = new Date(forecast.forecast_time)
      const data: any = {
        time: time.getHours().toString().padStart(2, '0') + ':00',
      }

      selectedCityIds.forEach((cityId, colorIdx) => {
        const cityForecasts = hourlyData[cityId] || []
        const cityForecast = cityForecasts[idx]
        data[`temp_${cityId}`] = cityForecast?.temperature ?? null
      })

      return data
    })
  }, [hourlyData, selectedCityIds])

  // Calculate comparison stats
  const comparisonStats = useMemo(() => {
    if (!weatherData) return null

    const validCities = selectedCityIds
      .map((id) => ({ id, data: weatherData[id] }))
      .filter((c) => c.data !== null)

    if (validCities.length < 2) return null

    const temps = validCities.map((c) => c.data.temperature)
    const maxTemp = Math.max(...temps)
    const minTemp = Math.min(...temps)
    const warmestCity = validCities.find((c) => c.data.temperature === maxTemp)
    const coolestCity = validCities.find((c) => c.data.temperature === minTemp)

    return {
      warmestCity: warmestCity?.data.cityName,
      warmestTemp: maxTemp,
      coolestCity: coolestCity?.data.cityName,
      coolestTemp: minTemp,
      tempDiff: (maxTemp - minTemp).toFixed(1),
    }
  }, [weatherData, selectedCityIds])

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading comparison data...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load comparison data</p>
      </div>
    )
  }

  const validCities = selectedCityIds
    .map((id) => ({ id, data: weatherData?.[id] }))
    .filter((c) => c.data !== null && c.data !== undefined) as Array<{ id: string; data: any }>

  return (
    <div className="space-y-6">
      {/* City Selector */}
      <div>
        <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Select Cities</p>
        <CitySelector
          selectedCities={selectedCityIds}
          onSelect={setSelectedCityIds}
          multiSelect={true}
          maxSelections={3}
        />
      </div>

      {/* Metrics Table */}
      {validCities.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="text-left px-4 py-3 text-gray-400 font-semibold">Metric</th>
                {validCities.map((c) => (
                  <th
                    key={c.id}
                    className="text-left px-4 py-3 text-gray-300 font-semibold text-right"
                  >
                    {c.data.cityName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Temperature', key: 'temperature', format: (v: number) => `${v.toFixed(1)}°C` },
                { label: 'Feels Like', key: 'feels_like', format: (v: number) => `${v.toFixed(1)}°C` },
                { label: 'Humidity', key: 'humidity', format: (v: number) => `${v}%` },
                { label: 'Wind Speed', key: 'wind_speed', format: (v: number) => `${(v * 3.6).toFixed(1)} km/h` },
                { label: 'Wind Direction', key: 'wind_direction_label', format: (v: string) => v },
                { label: 'Pressure', key: 'pressure', format: (v: number) => `${v} hPa` },
                { label: 'Visibility', key: 'visibility', format: (v: number) => `${(v / 1000).toFixed(1)} km` },
                { label: 'Cloud Cover', key: 'cloudiness', format: (v: number) => `${v}%` },
              ].map((metric) => (
                <tr key={metric.key} className="border-b border-dark-700">
                  <td className="px-4 py-3 text-gray-400">{metric.label}</td>
                  {validCities.map((c) => (
                    <td
                      key={c.id}
                      className="px-4 py-3 text-white font-medium text-right"
                    >
                      {/* @ts-ignore - Type narrowing issue with optional chaining */}
                      {c.data && metric.format((c.data as any)[metric.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Comparison Stats */}
      {comparisonStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Warmest',
              value: `${comparisonStats.warmestCity}`,
              sub: `${comparisonStats.warmestTemp.toFixed(1)}°C`,
              color: 'text-red-400',
            },
            {
              label: 'Coolest',
              value: `${comparisonStats.coolestCity}`,
              sub: `${comparisonStats.coolestTemp.toFixed(1)}°C`,
              color: 'text-blue-400',
            },
            {
              label: 'Temperature Difference',
              value: `${comparisonStats.tempDiff}°C`,
              sub: 'Across cities',
              color: 'text-amber-400',
            },
            {
              label: 'Cities Selected',
              value: `${validCities.length}`,
              sub: 'for comparison',
              color: 'text-primary-400',
            },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p className="text-xs text-gray-400 uppercase font-semibold">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color} mt-2`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Temperature Overlay Chart */}
      {overlayChartData.length > 0 && validCities.length > 0 && (
        <div className="card p-6">
          <h3 className="text-base font-semibold text-white mb-4">Temperature Overlay — Next 24 Hours</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={overlayChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#718096', fontSize: 11 }}
                interval={3}
              />
              <YAxis
                tick={{ fill: '#718096', fontSize: 11 }}
                unit="°C"
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip
                content={<ChartTooltip unit="°C" />}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
              {validCities.map((c, idx) => (
                <Line
                  key={c.id}
                  type="monotone"
                  dataKey={`temp_${c.id}`}
                  name={c.data.cityName}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty State */}
      {validCities.length === 0 && (
        <div className="card p-8 text-center bg-yellow-900/20 border border-yellow-700">
          <p className="text-yellow-300">Please select at least one city to compare</p>
        </div>
      )}
    </div>
  )
}
