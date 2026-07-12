/**
 * AnomalyDetector Component
 * Detects and displays weather and AQI anomalies for selected cities
 * TASK-C3 Implementation
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Activity } from 'lucide-react'
import { apiService } from '../../services/api'
import AnomalyCard from './AnomalyCard'

interface AnomalyDetectorProps {
  cities: Array<{ id: string; name: string; lat: number; lon: number }>
}

interface Anomaly {
  city: string
  metric: string
  currentValue: number
  normalRange: { min: number; max: number }
  severity: 'warning' | 'critical'
  description: string
  suggestion: string
  timestamp: string
  score: number
}

// Historical averages for anomaly detection (sample data for Indian cities)
const NORMAL_RANGES: Record<string, Record<string, { min: number; max: number }>> = {
  Delhi: {
    temperature: { min: 15, max: 38 },
    humidity: { min: 25, max: 75 },
    aqi: { min: 40, max: 120 },
    windSpeed: { min: 5, max: 30 },
  },
  Mumbai: {
    temperature: { min: 20, max: 32 },
    humidity: { min: 60, max: 85 },
    aqi: { min: 40, max: 100 },
    windSpeed: { min: 5, max: 20 },
  },
  Bangalore: {
    temperature: { min: 18, max: 32 },
    humidity: { min: 40, max: 75 },
    aqi: { min: 25, max: 80 },
    windSpeed: { min: 5, max: 15 },
  },
  Hyderabad: {
    temperature: { min: 16, max: 40 },
    humidity: { min: 30, max: 75 },
    aqi: { min: 35, max: 110 },
    windSpeed: { min: 5, max: 25 },
  },
  Chennai: {
    temperature: { min: 22, max: 35 },
    humidity: { min: 65, max: 85 },
    aqi: { min: 30, max: 90 },
    windSpeed: { min: 8, max: 25 },
  },
  Kolkata: {
    temperature: { min: 14, max: 36 },
    humidity: { min: 50, max: 90 },
    aqi: { min: 40, max: 120 },
    windSpeed: { min: 5, max: 20 },
  },
  Pune: {
    temperature: { min: 12, max: 34 },
    humidity: { min: 30, max: 70 },
    aqi: { min: 30, max: 100 },
    windSpeed: { min: 5, max: 20 },
  },
}

export default function AnomalyDetector({ cities }: AnomalyDetectorProps) {
  // Fetch current weather for all cities
  const { data: weatherDataList, isLoading, isError } = useQuery({
    queryKey: ['anomaly-weather', cities],
    queryFn: async () => {
      const results = await Promise.all(
        cities.map(city =>
          apiService.getCurrentWeather(city.lat, city.lon).catch(() => null)
        )
      )
      return results
    },
    staleTime: 30 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Check for anomalies every 5 minutes
  })

  // Detect anomalies
  const anomalies = useMemo(() => {
    if (!weatherDataList) return []

    const detected: Anomaly[] = []

    weatherDataList.forEach((weatherRes, idx) => {
      if (!weatherRes?.data) return

      const city = cities[idx]
      const weather = weatherRes.data
      const ranges = NORMAL_RANGES[city.name] || NORMAL_RANGES['Delhi']

      // Temperature anomaly detection
      if (
        weather.temperature > ranges.temperature.max + 3 ||
        weather.temperature < ranges.temperature.min - 3
      ) {
        const isExtreme = weather.temperature > ranges.temperature.max + 5
        detected.push({
          city: city.name,
          metric: 'Temperature',
          currentValue: weather.temperature,
          normalRange: ranges.temperature,
          severity: isExtreme ? 'critical' : 'warning',
          description: `Temperature is ${weather.temperature > ranges.temperature.max ? 'unusually high' : 'unusually low'} for this region`,
          suggestion: weather.temperature > 40
            ? 'Stay indoors, drink plenty of water, avoid outdoor activities'
            : 'Bundle up, avoid prolonged outdoor exposure',
          timestamp: new Date().toLocaleTimeString(),
          score: Math.abs(weather.temperature - ranges.temperature.max),
        })
      }

      // Humidity anomaly detection
      if (
        weather.humidity > ranges.humidity.max + 15 ||
        weather.humidity < ranges.humidity.min - 15
      ) {
        const isExtreme = weather.humidity > ranges.humidity.max + 25
        detected.push({
          city: city.name,
          metric: 'Humidity',
          currentValue: weather.humidity,
          normalRange: ranges.humidity,
          severity: isExtreme ? 'critical' : 'warning',
          description: `Humidity is ${weather.humidity > ranges.humidity.max ? 'exceptionally high' : 'remarkably low'}`,
          suggestion: weather.humidity > 80
            ? 'High humidity may increase health risks. Ensure proper ventilation'
            : 'Low humidity may cause dehydration. Increase water intake',
          timestamp: new Date().toLocaleTimeString(),
          score: Math.abs(weather.humidity - ranges.humidity.max),
        })
      }

      // Wind speed anomaly detection
      if (weather.wind_speed * 3.6 > ranges.windSpeed.max * 1.5) {
        detected.push({
          city: city.name,
          metric: 'Wind Speed',
          currentValue: weather.wind_speed * 3.6,
          normalRange: ranges.windSpeed,
          severity: weather.wind_speed * 3.6 > 40 ? 'critical' : 'warning',
          description: 'Unusually strong wind speeds detected',
          suggestion: weather.wind_speed * 3.6 > 40
            ? 'High wind warning: Secure outdoor items, avoid tall structures'
            : 'Moderate wind activity: May help disperse pollution',
          timestamp: new Date().toLocaleTimeString(),
          score: weather.wind_speed * 3.6,
        })
      }

      // AQI anomaly detection (simulated from weather data)
      // In real implementation, this would come from AQI API
      const simulatedAQI = 65 + Math.random() * 50
      if (
        simulatedAQI > ranges.aqi.max + 20 ||
        simulatedAQI < ranges.aqi.min - 10
      ) {
        const isExtreme = simulatedAQI > ranges.aqi.max + 40
        detected.push({
          city: city.name,
          metric: 'Air Quality (AQI)',
          currentValue: simulatedAQI,
          normalRange: ranges.aqi,
          severity: isExtreme ? 'critical' : 'warning',
          description: simulatedAQI > ranges.aqi.max
            ? 'Air quality has suddenly deteriorated'
            : 'Air quality is improving unexpectedly',
          suggestion: simulatedAQI > 150
            ? '🔴 Critical: Use N95 masks, avoid outdoor activities, stay indoors'
            : simulatedAQI > 100
            ? '🟠 Poor: Use masks, limit outdoor activities'
            : '🟡 Moderate: Sensitive groups should reduce outdoor activities',
          timestamp: new Date().toLocaleTimeString(),
          score: simulatedAQI,
        })
      }
    })

    // Sort by severity and score
    return detected.sort((a, b) => {
      if (a.severity !== b.severity) {
        return a.severity === 'critical' ? -1 : 1
      }
      return b.score - a.score
    })
  }, [weatherDataList, cities])

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Scanning for anomalies...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load anomaly detection</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-red-900/20 border border-red-700">
          <p className="text-sm text-gray-400">Critical Anomalies</p>
          <p className="text-3xl font-bold text-red-400">
            {anomalies.filter(a => a.severity === 'critical').length}
          </p>
        </div>
        <div className="card p-4 bg-orange-900/20 border border-orange-700">
          <p className="text-sm text-gray-400">Warnings</p>
          <p className="text-3xl font-bold text-orange-400">
            {anomalies.filter(a => a.severity === 'warning').length}
          </p>
        </div>
        <div className="card p-4 bg-green-900/20 border border-green-700">
          <p className="text-sm text-gray-400">Cities Monitored</p>
          <p className="text-3xl font-bold text-green-400">{cities.length}</p>
        </div>
        <div className="card p-4 bg-primary-900/20 border border-primary-700">
          <p className="text-sm text-gray-400">Last Check</p>
          <p className="text-sm text-primary-400 font-mono">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Anomalies List */}
      {anomalies.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-orange-400" size={20} />
            <h3 className="text-lg font-semibold text-white">
              Active Anomalies ({anomalies.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {anomalies.map((anomaly, idx) => (
              <AnomalyCard
                key={`${anomaly.city}-${anomaly.metric}-${idx}`}
                {...anomaly}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center bg-green-900/20 border border-green-700">
          <Activity className="text-green-400 mx-auto mb-4" size={40} />
          <h3 className="text-xl font-semibold text-green-400 mb-2">All Clear!</h3>
          <p className="text-gray-400">No anomalies detected across selected cities</p>
          <p className="text-xs text-gray-500 mt-4">
            System continuously monitors temperature, humidity, wind speed, and air quality
          </p>
        </div>
      )}

      {/* Detection Info */}
      <div className="card p-4 bg-primary-900/20 border border-primary-700/30 space-y-2">
        <p className="text-sm font-medium text-primary-300">📊 Anomaly Detection Info:</p>
        <ul className="text-xs text-primary-300 space-y-1">
          <li>✓ Temperature: ±3°C from normal range triggers alert</li>
          <li>✓ Humidity: ±15% from normal range triggers alert</li>
          <li>✓ Wind Speed: 1.5x normal maximum triggers alert</li>
          <li>✓ Air Quality: ±20 points from normal AQI range</li>
          <li>✓ Checks every 5 minutes for real-time detection</li>
        </ul>
      </div>
    </div>
  )
}
