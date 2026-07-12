/**
 * AQIOverview Component
 * Displays current AQI with health recommendations and pollutant summary
 */

import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Heart } from 'lucide-react'
import { apiService } from '../../services/api'

interface AQIOverviewProps {
  latitude: number
  longitude: number
  cityName: string
}

function getAQIColor(aqi: number): { bg: string; text: string; badge: string } {
  if (aqi <= 20) return { bg: 'bg-green-900/20', text: 'text-green-400', badge: 'bg-green-500/20 text-green-300' }
  if (aqi <= 40) return { bg: 'bg-lime-900/20', text: 'text-lime-400', badge: 'bg-lime-500/20 text-lime-300' }
  if (aqi <= 60) return { bg: 'bg-yellow-900/20', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' }
  if (aqi <= 80) return { bg: 'bg-orange-900/20', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300' }
  if (aqi <= 100) return { bg: 'bg-red-900/20', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300' }
  return { bg: 'bg-red-900/40', text: 'text-red-500', badge: 'bg-red-600/30 text-red-200' }
}

function getAQICategory(aqi: number): string {
  if (aqi <= 20) return 'Good'
  if (aqi <= 40) return 'Fair'
  if (aqi <= 60) return 'Moderate'
  if (aqi <= 80) return 'Poor'
  if (aqi <= 100) return 'Very Poor'
  return 'Extremely Poor'
}

function getHealthRecommendation(aqi: number): string {
  if (aqi <= 20) return 'Air quality is good. Enjoy outdoor activities!'
  if (aqi <= 40) return 'Air quality is fair. Sensitive groups should limit prolonged outdoor exertion.'
  if (aqi <= 60) return 'Moderate air quality. People with respiratory conditions should take care.'
  if (aqi <= 80) return 'Poor air quality. Reduce strenuous outdoor activity.'
  if (aqi <= 100) return 'Very poor air quality. Avoid outdoor activities where possible.'
  return 'Extremely poor air quality. Stay indoors and keep windows closed.'
}

export default function AQIOverview({
  latitude,
  longitude,
  cityName,
}: AQIOverviewProps) {
  // Fetch air quality
  const { data: aqRes, isLoading, isError } = useQuery({
    queryKey: ['aqi-overview', latitude, longitude],
    queryFn: async () => {
      return apiService.getAirQuality(latitude, longitude)
    },
    refetchInterval: 15 * 60 * 1000, // every 15 min
    staleTime: 14 * 60 * 1000, // 14 min
  })

  const aqi = aqRes?.data as any

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-dark-700 rounded-full" />
          <p className="text-gray-400 text-sm">Loading air quality data...</p>
        </div>
      </div>
    )
  }

  if (isError || !aqi) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load air quality data</p>
      </div>
    )
  }

  const aqiValue = aqi.aqi || 0
  const category = getAQICategory(aqiValue)
  const colors = getAQIColor(aqiValue)
  const healthRec = getHealthRecommendation(aqiValue)
  const lastUpdate = new Date(aqi.measurement_time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-6">
      {/* Main AQI Display */}
      <div className={`card p-8 border ${colors.bg}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-gray-400 text-sm mb-2">Current AQI in {cityName}</p>
            <div className="flex items-baseline gap-3">
              <span className={`text-7xl font-bold ${colors.text}`}>
                {aqiValue.toFixed(0)}
              </span>
              <div className={`badge px-3 py-1 rounded-lg text-sm font-semibold ${colors.badge}`}>
                {category}
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">Updated at {lastUpdate}</p>
          </div>
          <div className="text-right">
            <AlertCircle className={colors.text} size={48} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Health Recommendation */}
      <div className={`card p-6 border-l-4 ${colors.badge} flex items-start gap-4`}>
        <Heart className={`${colors.text} flex-shrink-0`} size={24} />
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Health Recommendation</p>
          <p className="text-white text-sm leading-relaxed">{healthRec}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* PM2.5 */}
        <div className="card p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
            PM2.5
          </p>
          <p className="text-2xl font-bold text-red-400">{aqi.pm2_5?.toFixed(1) || '—'}</p>
          <p className="text-gray-500 text-xs mt-1">µg/m³ (Fine particles)</p>
        </div>

        {/* PM10 */}
        <div className="card p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
            PM10
          </p>
          <p className="text-2xl font-bold text-orange-400">{aqi.pm10?.toFixed(1) || '—'}</p>
          <p className="text-gray-500 text-xs mt-1">µg/m³ (Coarse particles)</p>
        </div>

        {/* O₃ */}
        <div className="card p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
            O₃ (Ozone)
          </p>
          <p className="text-2xl font-bold text-cyan-400">{aqi.o3?.toFixed(1) || '—'}</p>
          <p className="text-gray-500 text-xs mt-1">µg/m³</p>
        </div>

        {/* NO₂ */}
        <div className="card p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
            NO₂ (Nitrogen)
          </p>
          <p className="text-2xl font-bold text-indigo-400">{aqi.no2?.toFixed(1) || '—'}</p>
          <p className="text-gray-500 text-xs mt-1">µg/m³</p>
        </div>

        {/* SO₂ */}
        <div className="card p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
            SO₂ (Sulfur)
          </p>
          <p className="text-2xl font-bold text-lime-400">{aqi.so2?.toFixed(1) || '—'}</p>
          <p className="text-gray-500 text-xs mt-1">µg/m³</p>
        </div>

        {/* CO */}
        <div className="card p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
            CO (Carbon)
          </p>
          <p className="text-2xl font-bold text-amber-400">{aqi.co?.toFixed(1) || '—'}</p>
          <p className="text-gray-500 text-xs mt-1">µg/m³</p>
        </div>
      </div>

      {/* Information */}
      <div className="card p-4 bg-dark-700/50 text-center">
        <p className="text-xs text-gray-500">
          AQI Scale: Good (0-20) • Fair (21-40) • Moderate (41-60) • Poor (61-80) • Very Poor (81-100) • Extremely Poor (100+)
        </p>
      </div>
    </div>
  )
}
