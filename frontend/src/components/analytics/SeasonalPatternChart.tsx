/**
 * SeasonalPatternChart Component
 * Displays seasonal patterns for temperature and AQI by month
 * Shows historical comparison and typical seasonal variations
 */

import { useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart,
} from 'recharts'
import ChartTooltip from '../shared/ChartTooltip'

interface SeasonalPatternChartProps {
  city: { id: string; name: string; lat: number; lon: number }
  metricType: 'temperature' | 'aqi' | 'humidity'
}

// Sample seasonal data for Indian cities
const SEASONAL_DATA: Record<string, any[]> = {
  Delhi: [
    { month: 'Jan', avg: 14, max: 24, min: 8, variance: 8 },
    { month: 'Feb', avg: 17, max: 27, min: 11, variance: 8 },
    { month: 'Mar', avg: 23, max: 33, min: 15, variance: 9 },
    { month: 'Apr', avg: 29, max: 39, min: 20, variance: 10 },
    { month: 'May', avg: 33, max: 43, min: 24, variance: 10 },
    { month: 'Jun', avg: 31, max: 40, min: 26, variance: 7 },
    { month: 'Jul', avg: 29, max: 37, min: 25, variance: 6 },
    { month: 'Aug', avg: 28, max: 36, min: 24, variance: 6 },
    { month: 'Sep', avg: 26, max: 35, min: 21, variance: 7 },
    { month: 'Oct', avg: 22, max: 32, min: 16, variance: 8 },
    { month: 'Nov', avg: 17, max: 28, min: 12, variance: 8 },
    { month: 'Dec', avg: 12, max: 22, min: 6, variance: 8 },
  ],
  Mumbai: [
    { month: 'Jan', avg: 25, max: 32, min: 18, variance: 7 },
    { month: 'Feb', avg: 26, max: 33, min: 19, variance: 7 },
    { month: 'Mar', avg: 28, max: 35, min: 21, variance: 7 },
    { month: 'Apr', avg: 30, max: 37, min: 24, variance: 7 },
    { month: 'May', avg: 31, max: 38, min: 26, variance: 6 },
    { month: 'Jun', avg: 28, max: 34, min: 24, variance: 5 },
    { month: 'Jul', avg: 26, max: 31, min: 23, variance: 4 },
    { month: 'Aug', avg: 26, max: 31, min: 23, variance: 4 },
    { month: 'Sep', avg: 27, max: 32, min: 24, variance: 4 },
    { month: 'Oct', avg: 29, max: 34, min: 25, variance: 5 },
    { month: 'Nov', avg: 29, max: 34, min: 24, variance: 5 },
    { month: 'Dec', avg: 27, max: 33, min: 21, variance: 6 },
  ],
  Bangalore: [
    { month: 'Jan', avg: 22, max: 30, min: 15, variance: 8 },
    { month: 'Feb', avg: 23, max: 31, min: 16, variance: 8 },
    { month: 'Mar', avg: 25, max: 33, min: 18, variance: 8 },
    { month: 'Apr', avg: 26, max: 34, min: 20, variance: 7 },
    { month: 'May', avg: 25, max: 32, min: 20, variance: 6 },
    { month: 'Jun', avg: 22, max: 28, min: 18, variance: 5 },
    { month: 'Jul', avg: 21, max: 27, min: 17, variance: 5 },
    { month: 'Aug', avg: 21, max: 27, min: 17, variance: 5 },
    { month: 'Sep', avg: 21, max: 28, min: 17, variance: 6 },
    { month: 'Oct', avg: 23, max: 30, min: 18, variance: 7 },
    { month: 'Nov', avg: 23, max: 30, min: 17, variance: 7 },
    { month: 'Dec', avg: 22, max: 29, min: 16, variance: 8 },
  ],
  Hyderabad: [
    { month: 'Jan', avg: 20, max: 30, min: 13, variance: 9 },
    { month: 'Feb', avg: 23, max: 33, min: 16, variance: 9 },
    { month: 'Mar', avg: 28, max: 38, min: 20, variance: 9 },
    { month: 'Apr', avg: 31, max: 41, min: 23, variance: 9 },
    { month: 'May', avg: 32, max: 42, min: 24, variance: 9 },
    { month: 'Jun', avg: 28, max: 37, min: 22, variance: 8 },
    { month: 'Jul', avg: 26, max: 34, min: 21, variance: 6 },
    { month: 'Aug', avg: 26, max: 34, min: 20, variance: 7 },
    { month: 'Sep', avg: 25, max: 34, min: 19, variance: 8 },
    { month: 'Oct', avg: 24, max: 33, min: 17, variance: 8 },
    { month: 'Nov', avg: 21, max: 30, min: 14, variance: 8 },
    { month: 'Dec', avg: 18, max: 27, min: 11, variance: 8 },
  ],
}

export default function SeasonalPatternChart({
  city,
  metricType,
}: SeasonalPatternChartProps) {
  const data = useMemo(() => {
    const cityData = SEASONAL_DATA[city.name] || SEASONAL_DATA['Delhi']

    if (metricType === 'temperature') {
      return cityData.map(d => ({
        month: d.month,
        avg: d.avg,
        max: d.max,
        min: d.min,
      }))
    } else if (metricType === 'aqi') {
      // Sample AQI seasonal data
      return cityData.map((d, idx) => ({
        month: d.month,
        // Higher in winter (Oct-Dec, Jan), lower in monsoon
        aqi: idx >= 9 || idx <= 1 ? 80 + Math.random() * 40 : 50 + Math.random() * 30,
      }))
    } else {
      // Humidity pattern
      return cityData.map((d, idx) => ({
        month: d.month,
        // Higher in monsoon (Jun-Sep), lower in winter
        humidity: idx >= 5 && idx <= 8 ? 70 + Math.random() * 20 : 40 + Math.random() * 25,
      }))
    }
  }, [city.name, metricType])

  const chartHeight = 280
  const unit = metricType === 'temperature' ? '°C' : metricType === 'aqi' ? 'AQI' : '%'

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {metricType === 'temperature'
            ? 'Temperature Seasonality'
            : metricType === 'aqi'
            ? 'AQI Seasonal Pattern'
            : 'Humidity Seasonal Pattern'}{' '}
          - {city.name}
        </h3>

        {metricType === 'temperature' ? (
          // Temperature: Show min/avg/max
          <ResponsiveContainer width="100%" height={chartHeight}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="month" tick={{ fill: '#718096', fontSize: 11 }} />
              <YAxis tick={{ fill: '#718096', fontSize: 11 }} unit="°C" />
              <Tooltip content={<ChartTooltip unit={unit} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
              <Bar
                dataKey="min"
                name="Min Temperature"
                fill="#93c5fd"
                opacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="avg"
                name="Avg Temperature"
                stroke="#f87171"
                strokeWidth={2}
              />
              <Bar
                dataKey="max"
                name="Max Temperature"
                fill="#fca5a5"
                opacity={0.4}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          // AQI or Humidity: Show as line chart
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="month" tick={{ fill: '#718096', fontSize: 11 }} />
              <YAxis
                tick={{ fill: '#718096', fontSize: 11 }}
                unit={unit}
                domain={[0, metricType === 'aqi' ? 200 : 100]}
              />
              <Tooltip content={<ChartTooltip unit={unit} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
              <Line
                type="monotone"
                dataKey={metricType === 'aqi' ? 'aqi' : 'humidity'}
                name={
                  metricType === 'aqi' ? 'Average AQI' : 'Average Humidity'
                }
                stroke={metricType === 'aqi' ? '#f59e0b' : '#06b6d4'}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Seasonal Insight */}
      <div className="card p-4 bg-primary-900/20 border border-primary-700/30">
        <p className="text-sm text-primary-300">
          💡 <span className="font-medium">Pattern:</span> {' '}
          {city.name === 'Delhi' &&
            metricType === 'temperature' &&
            'Delhi experiences extreme temperature variations - scorching summers (May-Jun, 40°C+) and cold winters (Dec-Jan, 6-10°C).'}
          {city.name === 'Mumbai' &&
            metricType === 'temperature' &&
            'Mumbai maintains relatively stable temperatures year-round (25-31°C) due to coastal influence.'}
          {city.name === 'Bangalore' &&
            metricType === 'temperature' &&
            'Bangalore enjoys pleasant year-round weather (21-26°C) due to its elevation and climate.'}
          {metricType === 'aqi' &&
            'Air quality typically worsens in winter months (Oct-Jan) and improves during monsoon season.'}
          {metricType === 'humidity' &&
            'Humidity spikes during monsoon months (Jun-Sep) and decreases in winter season.'}
        </p>
      </div>
    </div>
  )
}
