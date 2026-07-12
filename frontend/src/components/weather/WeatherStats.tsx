/**
 * WeatherStats Component
 * Displays weather statistics and insights for a location
 * Shows: averages, records, patterns, and anomalies
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { apiService } from '../../services/api'

interface WeatherStatsProps {
  latitude: number
  longitude: number
  startDate?: Date
  endDate?: Date
}

export default function WeatherStats({
  latitude,
  longitude,
  startDate,
  endDate,
}: WeatherStatsProps) {
  // Fetch historical data for analysis
  const { data: historyRes, isLoading, isError } = useQuery({
    queryKey: ['weather-stats', latitude, longitude, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!startDate || !endDate) {
        // Default to last 30 days
        const end = new Date()
        end.setHours(0, 0, 0, 0)
        const start = new Date(end)
        start.setDate(start.getDate() - 30)

        const startStr = start.toISOString().split('T')[0]
        const endStr = end.toISOString().split('T')[0]

        const response = await apiService.client.get('/weather/history', {
          params: { latitude, longitude, start_date: startStr, end_date: endStr },
        })
        return response.data
      } else {
        const startStr = startDate.toISOString().split('T')[0]
        const endStr = endDate.toISOString().split('T')[0]

        const response = await apiService.client.get('/weather/history', {
          params: { latitude, longitude, start_date: startStr, end_date: endStr },
        })
        return response.data
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })

  const records = historyRes?.data?.records || []

  // Calculate statistics
  const stats = useMemo(() => {
    if (records.length === 0) return null

    const temps = records.map((r: any) => r.temperature_max)
    const tempMins = records.map((r: any) => r.temperature_min)
    const precips = records.map((r: any) => r.precipitation)
    const winds = records.map((r: any) => r.wind_speed_max)

    const avgTemp = temps.reduce((s, v) => s + v, 0) / temps.length
    const avgTempMin = tempMins.reduce((s, v) => s + v, 0) / tempMins.length
    const maxTemp = Math.max(...temps)
    const minTemp = Math.min(...tempMins)
    const totalPrecip = precips.reduce((s, v) => s + v, 0)
    const rainyDays = precips.filter((p: number) => p > 0).length
    const maxWind = Math.max(...winds)
    const avgWind = winds.reduce((s, v) => s + v, 0) / winds.length

    // Consecutive dry days (last streak)
    let currentStreak = 0
    let maxDryStreak = 0
    for (let i = records.length - 1; i >= 0; i--) {
      if (precips[i] === 0 || precips[i] < 0.5) {
        currentStreak++
        maxDryStreak = Math.max(maxDryStreak, currentStreak)
      } else {
        break
      }
    }

    // Temperature trend (comparing first half to second half)
    const mid = Math.floor(records.length / 2)
    const avgFirstHalf = temps.slice(0, mid).reduce((s, v) => s + v, 0) / mid
    const avgSecondHalf = temps.slice(mid).reduce((s, v) => s + v, 0) / (records.length - mid)
    const tempTrend = avgSecondHalf > avgFirstHalf ? 'warming' : avgSecondHalf < avgFirstHalf ? 'cooling' : 'stable'

    // Precipitation trend
    const rainyDaysFirst = precips.slice(0, mid).filter((p: number) => p > 0).length
    const rainyDaysSecond = precips.slice(mid).filter((p: number) => p > 0).length
    const precipTrend = rainyDaysSecond > rainyDaysFirst ? 'increasing' : rainyDaysSecond < rainyDaysFirst ? 'decreasing' : 'stable'

    return {
      avgTemp: avgTemp.toFixed(1),
      avgTempMin: avgTempMin.toFixed(1),
      maxTemp: maxTemp.toFixed(1),
      minTemp: minTemp.toFixed(1),
      tempRange: (maxTemp - minTemp).toFixed(1),
      totalPrecip: totalPrecip.toFixed(1),
      rainyDays,
      rainyDaysPercent: ((rainyDays / records.length) * 100).toFixed(0),
      maxWind: (maxWind * 3.6).toFixed(1),
      avgWind: (avgWind * 3.6).toFixed(1),
      maxDryStreak,
      tempTrend,
      precipTrend,
      recordCount: records.length,
    }
  }, [records])

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Calculating statistics...</div>
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <p className="text-sm text-gray-500">
        Analysis based on {stats.recordCount} days of historical data
      </p>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Average Temperature */}
        <div className="card p-6">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
            Average Temperature
          </p>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-400">{stats.avgTemp}°C</span>
              <span className="text-sm text-gray-500">high</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-blue-400">{stats.avgTempMin}°C</span>
              <span className="text-xs text-gray-500">low</span>
            </div>
          </div>
        </div>

        {/* Temperature Range */}
        <div className="card p-6">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
            Temperature Range
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Highest recorded</p>
              <p className="text-2xl font-bold text-red-400">{stats.maxTemp}°C</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Lowest recorded</p>
              <p className="text-2xl font-bold text-blue-400">{stats.minTemp}°C</p>
            </div>
            <div className="pt-2 border-t border-dark-600">
              <p className="text-xs text-gray-500">Spread</p>
              <p className="text-lg font-semibold text-amber-400">{stats.tempRange}°C</p>
            </div>
          </div>
        </div>

        {/* Temperature Trend */}
        <div className="card p-6">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
            Temperature Trend
          </p>
          <div className="flex items-center gap-3 mb-4">
            {stats.tempTrend === 'warming' && (
              <TrendingUp className="text-red-400" size={32} />
            )}
            {stats.tempTrend === 'cooling' && (
              <TrendingDown className="text-blue-400" size={32} />
            )}
            {stats.tempTrend === 'stable' && (
              <Activity className="text-gray-400" size={32} />
            )}
            <div>
              <p className="text-2xl font-bold capitalize">
                {stats.tempTrend === 'warming' && <span className="text-red-400">Warming</span>}
                {stats.tempTrend === 'cooling' && <span className="text-blue-400">Cooling</span>}
                {stats.tempTrend === 'stable' && <span className="text-gray-400">Stable</span>}
              </p>
              <p className="text-xs text-gray-500">Over the period</p>
            </div>
          </div>
        </div>

        {/* Precipitation Summary */}
        <div className="card p-6">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
            Precipitation
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.totalPrecip} mm</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Rainy days</p>
              <p className="text-xl font-semibold text-indigo-400">
                {stats.rainyDays} ({stats.rainyDaysPercent}%)
              </p>
            </div>
          </div>
        </div>

        {/* Precipitation Trend */}
        <div className="card p-6">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
            Precipitation Trend
          </p>
          <div className="flex items-center gap-3 mb-4">
            {stats.precipTrend === 'increasing' && (
              <TrendingUp className="text-cyan-400" size={32} />
            )}
            {stats.precipTrend === 'decreasing' && (
              <TrendingDown className="text-teal-400" size={32} />
            )}
            {stats.precipTrend === 'stable' && (
              <Activity className="text-gray-400" size={32} />
            )}
            <div>
              <p className="text-2xl font-bold capitalize">
                {stats.precipTrend === 'increasing' && <span className="text-cyan-400">Increasing</span>}
                {stats.precipTrend === 'decreasing' && <span className="text-teal-400">Decreasing</span>}
                {stats.precipTrend === 'stable' && <span className="text-gray-400">Stable</span>}
              </p>
              <p className="text-xs text-gray-500">Rainfall pattern</p>
            </div>
          </div>
        </div>

        {/* Wind Statistics */}
        <div className="card p-6">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
            Wind Statistics
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Average speed</p>
              <p className="text-2xl font-bold text-teal-400">{stats.avgWind} km/h</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Maximum speed</p>
              <p className="text-xl font-semibold text-amber-400">{stats.maxWind} km/h</p>
            </div>
          </div>
        </div>

        {/* Consecutive Dry Days */}
        <div className="card p-6">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
            Consecutive Dry Days
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-green-400">{stats.maxDryStreak}</p>
              <p className="text-xs text-gray-500 mt-2">days without rain</p>
            </div>
            <Sun className="text-yellow-400 opacity-30" size={56} />
          </div>
        </div>

        {/* Weather Pattern */}
        <div className="card p-6 lg:col-span-2">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-3">
            Overall Weather Pattern
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-dark-600">
              <span className="text-gray-400 text-sm">Temperature</span>
              <span className="text-white font-medium capitalize">
                {stats.tempTrend} {stats.tempTrend === 'warming' && '🔥'}
                {stats.tempTrend === 'cooling' && '❄️'}
                {stats.tempTrend === 'stable' && '➡️'}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-dark-600">
              <span className="text-gray-400 text-sm">Precipitation</span>
              <span className="text-white font-medium capitalize">
                {stats.precipTrend} {stats.precipTrend === 'increasing' && '📈'}
                {stats.precipTrend === 'decreasing' && '📉'}
                {stats.precipTrend === 'stable' && '➡️'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Dry streak</span>
              <span className="text-white font-medium">{stats.maxDryStreak} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Sun } from 'lucide-react'
