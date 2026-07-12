/**
 * PollutantBreakdown Component
 * Displays 6 pollutants with health impacts and WHO guidelines
 */

import { useQuery } from '@tanstack/react-query'
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { apiService } from '../../services/api'

interface PollutantBreakdownProps {
  latitude: number
  longitude: number
}

const POLLUTANTS = [
  {
    name: 'PM2.5',
    label: 'Fine Particles',
    unit: 'µg/m³',
    whoDaily: 15,
    whoAnnual: 5,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: '💨',
    health: 'Respiratory issues, cardiovascular problems',
  },
  {
    name: 'PM10',
    label: 'Coarse Particles',
    unit: 'µg/m³',
    whoDaily: 45,
    whoAnnual: null,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    icon: '🌫️',
    health: 'Irritates respiratory tract, eye irritation',
  },
  {
    name: 'O₃',
    label: 'Ozone',
    unit: 'µg/m³',
    whoDaily: 100,
    whoAnnual: null,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    icon: '⚡',
    health: 'Reduces lung function, triggers asthma',
  },
  {
    name: 'NO₂',
    label: 'Nitrogen Dioxide',
    unit: 'µg/m³',
    whoDaily: 200,
    whoAnnual: 40,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20',
    icon: '🚗',
    health: 'Airway inflammation, reduced immunity',
  },
  {
    name: 'SO₂',
    label: 'Sulfur Dioxide',
    unit: 'µg/m³',
    whoDaily: 125,
    whoAnnual: null,
    color: 'text-lime-400',
    bgColor: 'bg-lime-500/20',
    icon: '🏭',
    health: 'Bronchitis risk, breathing difficulties',
  },
  {
    name: 'CO',
    label: 'Carbon Monoxide',
    unit: 'µg/m³',
    whoDaily: 30000,
    whoAnnual: null,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    icon: '⚠️',
    health: 'Reduces oxygen in blood, fatigue',
  },
]

function getPollutantStatus(value: number | null, guideline: number | null): {
  status: string
  color: string
  exceeded: boolean
} {
  if (value === null || guideline === null) return { status: 'N/A', color: 'text-gray-400', exceeded: false }
  
  const percentage = (value / guideline) * 100
  
  if (percentage < 50) return { status: 'Good', color: 'text-green-400', exceeded: false }
  if (percentage < 100) return { status: 'Fair', color: 'text-yellow-400', exceeded: false }
  if (percentage < 150) return { status: 'Moderate', color: 'text-orange-400', exceeded: true }
  return { status: 'Poor', color: 'text-red-400', exceeded: true }
}

export default function PollutantBreakdown({
  latitude,
  longitude,
}: PollutantBreakdownProps) {
  // Fetch air quality
  const { data: aqRes, isLoading, isError } = useQuery({
    queryKey: ['pollutant-breakdown', latitude, longitude],
    queryFn: async () => {
      return apiService.getAirQuality(latitude, longitude)
    },
    refetchInterval: 15 * 60 * 1000,
    staleTime: 14 * 60 * 1000,
  })

  const aqi = aqRes?.data as any

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading pollutant data...</div>
      </div>
    )
  }

  if (isError || !aqi) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load pollutant data</p>
      </div>
    )
  }

  const pollutantValues: Record<string, number | null> = {
    'PM2.5': aqi.pm2_5,
    'PM10': aqi.pm10,
    'O₃': aqi.o3,
    'NO₂': aqi.no2,
    'SO₂': aqi.so2,
    'CO': aqi.co,
  }

  return (
    <div className="space-y-6">
      {/* Grid of Pollutant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {POLLUTANTS.map((pollutant) => {
          const value = pollutantValues[pollutant.name]
          const status = getPollutantStatus(value, pollutant.whoDaily)
          const percentage = value && pollutant.whoDaily ? ((value / pollutant.whoDaily) * 100).toFixed(0) : 'N/A'

          return (
            <div
              key={pollutant.name}
              className={`card p-6 border-l-4 ${status.exceeded ? 'border-red-500 bg-red-900/10' : 'border-green-500 bg-green-900/10'}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-white">{pollutant.name}</p>
                  <p className="text-xs text-gray-400">{pollutant.label}</p>
                </div>
                <span className="text-3xl">{pollutant.icon}</span>
              </div>

              {/* Value */}
              <div className="mb-4">
                <p className={`text-3xl font-bold ${pollutant.color}`}>
                  {value !== null ? value.toFixed(1) : '—'}
                </p>
                <p className="text-xs text-gray-500">{pollutant.unit}</p>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                  {status.status}
                </div>
              </div>

              {/* WHO Guideline */}
              <div className="mb-4 pb-4 border-b border-dark-600">
                <p className="text-xs text-gray-500 mb-1">WHO Daily Limit</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-300">{pollutant.whoDaily} {pollutant.unit}</p>
                  <p className={`text-sm font-bold ${status.color}`}>
                    {percentage}%
                  </p>
                </div>
              </div>

              {/* Health Impact */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Health Impact</p>
                <p className="text-xs text-gray-300 leading-relaxed">{pollutant.health}</p>
              </div>

              {/* Warning Alert */}
              {status.exceeded && (
                <div className="mt-4 p-2 bg-red-500/20 border border-red-500 rounded flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">Exceeds WHO guideline</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* WHO Guidelines Reference */}
      <div className="card p-6 bg-dark-700/50">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-4">WHO Guidelines Reference</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">PM2.5:</span> 15 µg/m³ daily / 5 µg/m³ annual
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">PM10:</span> 45 µg/m³ daily
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">O₃:</span> 100 µg/m³ 8-hour average
            </p>
          </div>
          <div>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">NO₂:</span> 200 µg/m³ hourly / 40 µg/m³ annual
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">SO₂:</span> 125 µg/m³ 24-hour average
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">CO:</span> 30 mg/m³ 1-hour average
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {[
          { label: 'Good', color: 'text-green-400', range: '< 50% limit' },
          { label: 'Fair', color: 'text-yellow-400', range: '50-100% limit' },
          { label: 'Moderate', color: 'text-orange-400', range: '100-150% limit' },
          { label: 'Poor', color: 'text-red-400', range: '> 150% limit' },
        ].map((level) => (
          <div key={level.label} className="card p-3">
            <p className={`font-semibold ${level.color}`}>{level.label}</p>
            <p className="text-gray-500 text-xs mt-1">{level.range}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
