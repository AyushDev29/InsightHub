/**
 * CorrelationMatrix Component
 * Displays correlations between different weather and AQI metrics
 * Shows how various parameters relate to each other
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../../services/api'

interface CorrelationMatrixProps {
  city: { id: string; name: string; lat: number; lon: number }
}

// Predefined correlations based on meteorology (sample data)
const CORRELATIONS: Record<string, Record<string, number>> = {
  'Temperature': {
    'Feels Like': 0.92,
    'Humidity': -0.65,
    'AQI': 0.15,
    'Wind Speed': -0.35,
    'Pressure': -0.42,
  },
  'Humidity': {
    'Temperature': -0.65,
    'Feels Like': -0.70,
    'AQI': 0.48,
    'Wind Speed': -0.25,
    'Pressure': -0.38,
  },
  'AQI': {
    'Temperature': 0.15,
    'Humidity': 0.48,
    'Wind Speed': -0.72,
    'Pressure': 0.35,
    'Feels Like': 0.10,
  },
  'Wind Speed': {
    'Temperature': -0.35,
    'Humidity': -0.25,
    'AQI': -0.72,
    'Pressure': 0.28,
    'Feels Like': -0.40,
  },
  'Pressure': {
    'Temperature': -0.42,
    'Humidity': -0.38,
    'AQI': 0.35,
    'Wind Speed': 0.28,
    'Feels Like': -0.45,
  },
}

const METRICS = ['Temperature', 'Humidity', 'AQI', 'Wind Speed', 'Pressure']

// Correlation strength interpretation
function getCorrelationColor(value: number): string {
  const abs = Math.abs(value)
  if (abs > 0.7) return 'bg-red-600' // Strong positive
  if (abs > 0.5) return 'bg-orange-600' // Moderate
  if (abs > 0.3) return 'bg-yellow-600' // Weak
  if (abs > 0.1) return 'bg-blue-600' // Very weak
  return 'bg-gray-700' // No correlation
}

function getCorrelationInterpretation(
  metric1: string,
  metric2: string,
  value: number
): string {
  const abs = Math.abs(value)

  if (abs < 0.1) return 'No correlation'
  if (abs < 0.3) return 'Very weak relationship'
  if (abs < 0.5) return 'Weak relationship'
  if (abs < 0.7) return 'Moderate relationship'
  if (abs <= 1.0) return 'Strong relationship'

  return 'Unknown'
}

export default function CorrelationMatrix({ city }: CorrelationMatrixProps) {
  // Fetch current weather to show realtime context
  const { data: weatherRes } = useQuery({
    queryKey: ['correlation-weather', city],
    queryFn: async () => {
      return apiService.getCurrentWeather(city.lat, city.lon)
    },
    staleTime: 30 * 60 * 1000,
  })

  const weather = weatherRes?.data

  // Generate correlation data
  const correlationPairs = useMemo(() => {
    const pairs = []
    for (let i = 0; i < METRICS.length; i++) {
      for (let j = i + 1; j < METRICS.length; j++) {
        const m1 = METRICS[i]
        const m2 = METRICS[j]
        const value = CORRELATIONS[m1][m2]
        pairs.push({
          metric1: m1,
          metric2: m2,
          value,
          abs: Math.abs(value),
          positive: value > 0,
        })
      }
    }
    return pairs.sort((a, b) => b.abs - a.abs)
  }, [])

  return (
    <div className="space-y-4">
      {/* Matrix Visualization */}
      <div className="card p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          Correlation Matrix - {city.name}
        </h3>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-gray-400 px-2 py-2">Metric</th>
              {METRICS.map(m => (
                <th key={m} className="text-center text-gray-400 px-2 py-2 text-xs">
                  {m.substring(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map(m1 => (
              <tr key={m1}>
                <td className="text-gray-300 px-2 py-2 font-medium text-xs">
                  {m1}
                </td>
                {METRICS.map(m2 => {
                  if (m1 === m2) {
                    return (
                      <td
                        key={`${m1}-${m2}`}
                        className="text-center px-2 py-2 bg-dark-700"
                      >
                        <div className="text-xs font-bold text-white">1.0</div>
                      </td>
                    )
                  }

                  const idx1 = METRICS.indexOf(m1)
                  const idx2 = METRICS.indexOf(m2)
                  let value = 0

                  if (idx1 < idx2) {
                    value = CORRELATIONS[m1][m2]
                  } else {
                    value = CORRELATIONS[m2][m1]
                  }

                  const color = getCorrelationColor(value)
                  const direction = value > 0 ? '↗' : '↘'

                  return (
                    <td
                      key={`${m1}-${m2}`}
                      className="text-center px-2 py-2"
                    >
                      <div
                        className={`${color} rounded p-2 transition-all hover:shadow-lg hover:shadow-white/20`}
                      >
                        <div className="text-xs font-bold text-white">
                          {value.toFixed(2)}
                        </div>
                        <div className="text-xs">{direction}</div>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Correlation Legend */}
      <div className="card p-4 space-y-3">
        <h4 className="font-medium text-white text-sm">Correlation Strength</h4>
        <div className="space-y-2">
          {[
            { color: 'bg-red-600', label: 'Strong (0.7 - 1.0)', abs: 0.85 },
            { color: 'bg-orange-600', label: 'Moderate (0.5 - 0.7)', abs: 0.6 },
            { color: 'bg-yellow-600', label: 'Weak (0.3 - 0.5)', abs: 0.4 },
            { color: 'bg-blue-600', label: 'Very Weak (0.1 - 0.3)', abs: 0.2 },
            { color: 'bg-gray-700', label: 'None (< 0.1)', abs: 0.05 },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`${item.color} w-8 h-8 rounded`} />
              <span className="text-xs text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Correlations */}
      <div className="card p-6 space-y-3">
        <h3 className="font-semibold text-white text-sm">Key Relationships</h3>
        <div className="space-y-3">
          {correlationPairs.slice(0, 5).map(pair => (
            <div
              key={`${pair.metric1}-${pair.metric2}`}
              className="flex items-start justify-between p-3 bg-dark-700/50 rounded"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {pair.metric1} {' & '} {pair.metric2}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {pair.positive ? '✓ Positive' : '✗ Negative'} correlation:{' '}
                  {getCorrelationInterpretation(pair.metric1, pair.metric2, pair.value)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {pair.metric1 === 'Temperature' &&
                    pair.metric2 === 'Feels Like' &&
                    '→ Higher temperature increases feels-like temperature'}
                  {pair.metric1 === 'Temperature' &&
                    pair.metric2 === 'Humidity' &&
                    '→ Higher temperatures typically reduce humidity'}
                  {pair.metric1 === 'AQI' &&
                    pair.metric2 === 'Wind Speed' &&
                    '→ Strong winds help disperse pollution, lowering AQI'}
                  {pair.metric1 === 'AQI' &&
                    pair.metric2 === 'Humidity' &&
                    '→ Higher humidity can trap pollutants, raising AQI'}
                  {pair.metric1 === 'Wind Speed' &&
                    pair.metric2 === 'Temperature' &&
                    '→ Wind patterns can reduce perceived temperature'}
                </p>
              </div>
              <div className="ml-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {pair.value.toFixed(2)}
                  </p>
                  <p className={`text-xs font-medium ${pair.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {pair.positive ? 'Positive' : 'Negative'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Values */}
      {weather && (
        <div className="card p-4 bg-primary-900/20 border border-primary-700/30 space-y-2">
          <p className="text-sm font-medium text-primary-300">📊 Current Metrics ({city.name}):</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <p className="text-primary-300">Temperature: <span className="font-bold">{weather.temperature}°C</span></p>
            <p className="text-primary-300">Feels Like: <span className="font-bold">{weather.feels_like}°C</span></p>
            <p className="text-primary-300">Humidity: <span className="font-bold">{weather.humidity}%</span></p>
            <p className="text-primary-300">Wind: <span className="font-bold">{(weather.wind_speed * 3.6).toFixed(1)} km/h</span></p>
          </div>
        </div>
      )}
    </div>
  )
}
