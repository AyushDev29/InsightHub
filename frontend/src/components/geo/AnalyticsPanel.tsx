/**
 * AnalyticsPanel Component
 * Shows real-time analytics metrics alongside the map
 */

import { CityMarker } from '../../types/geo'
import { getTimeAgo } from '../../utils/geoHelpers'

interface AnalyticsPanelProps {
  cities: CityMarker[]
}

export default function AnalyticsPanel({ cities }: AnalyticsPanelProps) {
  if (cities.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No cities selected</p>
      </div>
    )
  }

  // Calculate statistics
  const temperatures = cities.map(c => c.temperature)
  const aqis = cities.map(c => c.aqi)
  const windSpeeds = cities.map(c => c.windSpeed)
  const humidities = cities.map(c => c.humidity)

  const hottest = cities.reduce((max, c) => (c.temperature > max.temperature ? c : max))
  const coldest = cities.reduce((min, c) => (c.temperature < min.temperature ? c : min))
  const worstAQI = cities.reduce((max, c) => (c.aqi > max.aqi ? c : max))
  const bestAQI = cities.reduce((min, c) => (c.aqi < min.aqi ? c : min))
  const windiest = cities.reduce((max, c) => (c.windSpeed > max.windSpeed ? c : max))
  const mostHumid = cities.reduce((max, c) => (c.humidity > max.humidity ? c : max))

  const avgTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)
  const avgAQI = Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length)
  const avgWind = (windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length).toFixed(1)
  const avgHumidity = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length)

  const latestUpdate = new Date(Math.max(...cities.map(c => c.lastUpdated.getTime())))

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-dark-700/50 rounded p-3">
          <p className="text-xs text-gray-400 uppercase">Avg Temp</p>
          <p className="text-lg font-bold text-red-400">{avgTemp}°C</p>
        </div>
        <div className="bg-dark-700/50 rounded p-3">
          <p className="text-xs text-gray-400 uppercase">Avg AQI</p>
          <p className="text-lg font-bold text-orange-400">{avgAQI}</p>
        </div>
        <div className="bg-dark-700/50 rounded p-3">
          <p className="text-xs text-gray-400 uppercase">Avg Wind</p>
          <p className="text-lg font-bold text-teal-400">{avgWind} km/h</p>
        </div>
        <div className="bg-dark-700/50 rounded p-3">
          <p className="text-xs text-gray-400 uppercase">Avg Humidity</p>
          <p className="text-lg font-bold text-cyan-400">{avgHumidity}%</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-2 border-t border-dark-600 pt-4">
        <h4 className="text-sm font-semibold text-white uppercase">Top Metrics</h4>

        {/* Hottest */}
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded">
          <div>
            <p className="text-xs text-gray-400">🔥 Hottest</p>
            <p className="text-sm font-medium text-white">{hottest.name}</p>
          </div>
          <p className="text-lg font-bold text-red-400">{hottest.temperature}°C</p>
        </div>

        {/* Coldest */}
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded">
          <div>
            <p className="text-xs text-gray-400">❄️ Coldest</p>
            <p className="text-sm font-medium text-white">{coldest.name}</p>
          </div>
          <p className="text-lg font-bold text-blue-400">{coldest.temperature}°C</p>
        </div>

        {/* Worst AQI */}
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded">
          <div>
            <p className="text-xs text-gray-400">🔴 Worst AQI</p>
            <p className="text-sm font-medium text-white">{worstAQI.name}</p>
          </div>
          <p className="text-lg font-bold text-orange-400">{worstAQI.aqi}</p>
        </div>

        {/* Best AQI */}
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded">
          <div>
            <p className="text-xs text-gray-400">🟢 Best AQI</p>
            <p className="text-sm font-medium text-white">{bestAQI.name}</p>
          </div>
          <p className="text-lg font-bold text-green-400">{bestAQI.aqi}</p>
        </div>

        {/* Windiest */}
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded">
          <div>
            <p className="text-xs text-gray-400">💨 Windiest</p>
            <p className="text-sm font-medium text-white">{windiest.name}</p>
          </div>
          <p className="text-lg font-bold text-teal-400">{windiest.windSpeed} km/h</p>
        </div>

        {/* Most Humid */}
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded">
          <div>
            <p className="text-xs text-gray-400">💧 Most Humid</p>
            <p className="text-sm font-medium text-white">{mostHumid.name}</p>
          </div>
          <p className="text-lg font-bold text-cyan-400">{mostHumid.humidity}%</p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t border-dark-600">
        <p>Last updated: {getTimeAgo(latestUpdate)}</p>
      </div>
    </div>
  )
}
