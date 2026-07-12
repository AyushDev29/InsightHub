/**
 * TrendAnalysis Component
 * Main component for TASK-C2: Trend Analysis
 * Shows multi-city trends, seasonal patterns, and correlations
 */

import { useState } from 'react'
import MultiCityTrendChart from './MultiCityTrendChart'
import SeasonalPatternChart from './SeasonalPatternChart'
import CorrelationMatrix from './CorrelationMatrix'

interface TrendAnalysisProps {
  cities: Array<{ id: string; name: string; lat: number; lon: number }>
  startDate: Date
  endDate: Date
}

type TrendView = 'multi-city' | 'seasonal' | 'correlation'

export default function TrendAnalysis({
  cities,
  startDate,
  endDate,
}: TrendAnalysisProps) {
  const [trendView, setTrendView] = useState<TrendView>('multi-city')
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'aqi'>('temperature')
  const [selectedCity, setSelectedCity] = useState(cities[0])

  if (cities.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-400">Please select at least one city to view trends</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* View Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Analysis Type
            </label>
            <div className="space-y-2">
              {[
                { id: 'multi-city', label: 'Multi-City Trends' },
                { id: 'seasonal', label: 'Seasonal Patterns' },
                { id: 'correlation', label: 'Correlations' },
              ].map(view => (
                <button
                  key={view.id}
                  onClick={() => setTrendView(view.id as TrendView)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                    trendView === view.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Selector (Multi-City view) */}
          {trendView === 'multi-city' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Metric
              </label>
              <div className="space-y-2">
                {[
                  { id: 'temperature', label: 'Temperature' },
                  { id: 'aqi', label: 'Air Quality (AQI)' },
                ].map(metric => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id as 'temperature' | 'aqi')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                      selectedMetric === metric.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metric Selector (Seasonal view) */}
          {trendView === 'seasonal' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Metric
              </label>
              <div className="space-y-2">
                {[
                  { id: 'temperature', label: 'Temperature' },
                  { id: 'aqi', label: 'Air Quality' },
                  { id: 'humidity', label: 'Humidity' },
                ].map(metric => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id as 'temperature' | 'aqi')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                      selectedMetric === metric.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* City Selector (Seasonal & Correlation) */}
          {(trendView === 'seasonal' || trendView === 'correlation') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {trendView === 'seasonal' ? 'City' : 'Analyze City'}
              </label>
              <div className="space-y-2">
                {cities.map(city => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                      selectedCity.id === city.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {trendView === 'multi-city' && (
        <MultiCityTrendChart
          cities={cities}
          metricType={selectedMetric}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {trendView === 'seasonal' && (
        <SeasonalPatternChart
          city={selectedCity}
          metricType={selectedMetric}
        />
      )}

      {trendView === 'correlation' && (
        <CorrelationMatrix city={selectedCity} />
      )}
    </div>
  )
}
