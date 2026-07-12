/**
 * HistoricalChart Component
 * Displays historical weather data with trend charts
 * Allows custom date range selection and CSV export
 */

import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import {
  LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import DateRangePicker from '../shared/DateRangePicker'
import ChartTooltip from '../shared/ChartTooltip'
import { useHistoricalWeather } from '../../hooks/useHistoricalWeather'

interface HistoricalChartProps {
  latitude: number
  longitude: number
}

export default function HistoricalChart({
  latitude,
  longitude,
}: HistoricalChartProps) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Fetch historical data
  const { data: historyRes, isLoading, isError } = useHistoricalWeather(
    latitude,
    longitude,
    startDate,
    endDate
  )

  const records = historyRes?.data?.records || []

  // Process data for charts
  const chartData = useMemo(() => {
    return records.map((r: any) => {
      const date = new Date(r.record_date)
      return {
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        fullDate: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        tempMax: r.temperature_max,
        tempMin: r.temperature_min,
        tempMean: r.temperature_mean,
        precipitation: r.precipitation,
        windMax: r.wind_speed_max * 3.6, // m/s to km/h
      }
    })
  }, [records])

  // Handle date selection
  const handleDateSelect = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
  }

  // Export to CSV
  const handleExport = () => {
    if (chartData.length === 0) {
      alert('No data to export')
      return
    }

    const headers = ['Date', 'Max Temp (°C)', 'Min Temp (°C)', 'Avg Temp (°C)', 'Precipitation (mm)', 'Max Wind (km/h)']
    const rows = chartData.map((d: any) => [
      d.fullDate,
      d.tempMax.toFixed(1),
      d.tempMin.toFixed(1),
      d.tempMean.toFixed(1),
      d.precipitation.toFixed(1),
      d.windMax.toFixed(1),
    ])

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weather-history-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Min/Max stats
  const stats = useMemo(() => {
    if (chartData.length === 0) return null
    return {
      maxTemp: Math.max(...chartData.map((d: any) => d.tempMax)),
      minTemp: Math.min(...chartData.map((d: any) => d.tempMin)),
      avgPrecip: (chartData.reduce((s: number, d: any) => s + d.precipitation, 0) / chartData.length).toFixed(1),
      totalPrecip: chartData.reduce((s: number, d: any) => s + d.precipitation, 0).toFixed(1),
    }
  }, [chartData])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <DateRangePicker
          onSelect={handleDateSelect}
          maxRangeDays={30}
          maxDate={new Date()}
        />
        <button
          onClick={handleExport}
          disabled={chartData.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Loading / Error States */}
      {isLoading && (
        <div className="card p-8 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading historical data...</div>
        </div>
      )}

      {isError && (
        <div className="card p-8 bg-red-900/20 border border-red-700">
          <p className="text-red-400">Failed to load historical data</p>
        </div>
      )}

      {/* Charts */}
      {!isLoading && !isError && chartData.length > 0 && (
        <>
          {/* Temperature Chart */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-white mb-4">Temperature Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#718096', fontSize: 11 }}
                  interval={Math.floor(chartData.length / 8)}
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
                <Line
                  type="monotone"
                  dataKey="tempMax"
                  name="Max Temperature"
                  stroke="#f56565"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="tempMin"
                  name="Min Temperature"
                  stroke="#63b3ed"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="tempMean"
                  name="Mean Temperature"
                  stroke="#a78bfa"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Precipitation Chart */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-white mb-4">Precipitation Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#718096', fontSize: 11 }}
                  interval={Math.floor(chartData.length / 8)}
                />
                <YAxis
                  tick={{ fill: '#718096', fontSize: 11 }}
                  unit="mm"
                />
                <Tooltip
                  content={<ChartTooltip unit="mm" />}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                <Bar
                  dataKey="precipitation"
                  name="Precipitation"
                  fill="#76e4f7"
                  opacity={0.7}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  label: 'Highest Temp',
                  value: `${stats.maxTemp.toFixed(1)}°C`,
                  color: 'text-red-400',
                },
                {
                  label: 'Lowest Temp',
                  value: `${stats.minTemp.toFixed(1)}°C`,
                  color: 'text-blue-400',
                },
                {
                  label: 'Avg Daily Precip',
                  value: `${stats.avgPrecip}mm`,
                  color: 'text-cyan-400',
                },
                {
                  label: 'Total Precip',
                  value: `${stats.totalPrecip}mm`,
                  color: 'text-indigo-400',
                },
              ].map((stat) => (
                <div key={stat.label} className="card p-4">
                  <p className="text-xs text-gray-400 uppercase">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Record Count */}
          <div className="text-center text-gray-500 text-sm py-2">
            Showing {chartData.length} days of historical data
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && !isError && chartData.length === 0 && startDate && endDate && (
        <div className="card p-8 text-center">
          <p className="text-gray-400">No data available for the selected date range</p>
        </div>
      )}

      {/* Initial State */}
      {!isLoading && !isError && chartData.length === 0 && !startDate && !endDate && (
        <div className="card p-8 text-center">
          <p className="text-gray-400 text-sm">Select a date range to view historical weather data</p>
        </div>
      )}
    </div>
  )
}
