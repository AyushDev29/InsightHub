/**
 * Analytics Page
 * Advanced analytics hub showing trends, anomalies, predictions, and patterns
 * across multiple cities with system-wide insights.
 */

import { useState, useMemo } from 'react'
import { BarChart3, TrendingUp, AlertTriangle, Zap, Zap as Spark } from 'lucide-react'
import TrendAnalysis from '../components/analytics/TrendAnalysis'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

const TABS: Tab[] = [
  { id: 'trends', label: 'Trends', icon: <TrendingUp size={18} />, color: 'text-blue-400' },
  { id: 'anomalies', label: 'Anomalies', icon: <AlertTriangle size={18} />, color: 'text-orange-400' },
  { id: 'predictions', label: 'Predictions', icon: <Spark size={18} />, color: 'text-purple-400' },
  { id: 'patterns', label: 'Patterns', icon: <Zap size={18} />, color: 'text-green-400' },
]

// Default Indian cities coordinates
const DEFAULT_CITIES = [
  { id: '1', name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { id: '2', name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { id: '3', name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { id: '4', name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { id: '5', name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { id: '6', name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { id: '7', name: 'Pune', lat: 18.5204, lon: 73.8567 },
]

export default function Analytics() {
  const [selectedCities, setSelectedCities] = useState<typeof DEFAULT_CITIES>([
    DEFAULT_CITIES[0], // Start with Delhi
  ])
  const [activeTab, setActiveTab] = useState<string>('trends')
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 7) // Default to 7 days
    return { start, end }
  })

  // Calculate time range label
  const timeRangeLabel = useMemo(() => {
    const diffDays = Math.ceil(
      (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
    )
    return `${diffDays} days`
  }, [dateRange])

  const handleCitySelect = (cities: typeof DEFAULT_CITIES) => {
    setSelectedCities(cities.slice(0, 3)) // Max 3 cities for analytics
  }

  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end })
  }

  const renderTabContent = () => {
    const cities = selectedCities.map(c => c.name).join(', ')
    
    switch (activeTab) {
      case 'trends':
        return (
          <TrendAnalysis
            cities={selectedCities}
            startDate={dateRange.start}
            endDate={dateRange.end}
          />
        )

      case 'anomalies':
        return (
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-orange-400" size={20} />
                <h3 className="text-lg font-semibold text-white">Anomaly Detection</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Monitoring: <span className="text-primary-400 font-medium">{cities}</span>
              </p>
              <div className="bg-dark-700/50 rounded border border-dark-600 p-8 text-center">
                <p className="text-gray-500 mb-4">⚠️ Anomaly detection component loading...</p>
                <p className="text-xs text-gray-600">Detects extreme temperatures, AQI spikes, humidity anomalies, and wind changes</p>
              </div>
            </div>
          </div>
        )

      case 'predictions':
        return (
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Spark className="text-purple-400" size={20} />
                <h3 className="text-lg font-semibold text-white">Predictive Insights</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Forecasting for: <span className="text-primary-400 font-medium">{cities}</span>
              </p>
              <div className="bg-dark-700/50 rounded border border-dark-600 p-8 text-center">
                <p className="text-gray-500 mb-4">🔮 Prediction component loading...</p>
                <p className="text-xs text-gray-600">7-day temperature forecast, AQI trends, and activity recommendations</p>
              </div>
            </div>
          </div>
        )

      case 'patterns':
        return (
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-green-400" size={20} />
                <h3 className="text-lg font-semibold text-white">Pattern Recognition</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Analyzing patterns for: <span className="text-primary-400 font-medium">{cities}</span>
              </p>
              <div className="bg-dark-700/50 rounded border border-dark-600 p-8 text-center">
                <p className="text-gray-500 mb-4">🔄 Pattern analysis component loading...</p>
                <p className="text-xs text-gray-600">Identifies weekly/monthly patterns, seasonal shifts, and correlations</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="text-primary-500" size={32} />
        <div>
          <h1 className="text-4xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-gray-400">Trends, anomalies, predictions, and patterns</p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Compare Cities (up to 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    const isSelected = selectedCities.some(c => c.id === city.id)
                    if (isSelected) {
                      handleCitySelect(selectedCities.filter(c => c.id !== city.id))
                    } else if (selectedCities.length < 3) {
                      handleCitySelect([...selectedCities, city])
                    }
                  }}
                  className={`px-3 py-2 rounded text-sm transition-all ${
                    selectedCities.some(c => c.id === city.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Range
            </label>
            <div className="flex gap-2">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => {
                    const end = new Date()
                    const start = new Date()
                    start.setDate(start.getDate() - days)
                    handleDateRangeChange(start, end)
                  }}
                  className={`px-4 py-2 rounded text-sm transition-all ${
                    Math.ceil(
                      (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
                    ) === days
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-dark-600">
          <div className="text-sm text-gray-400">
            Analyzing <span className="text-primary-400 font-medium">{selectedCities.length}</span> city/cities over{' '}
            <span className="text-primary-400 font-medium">{timeRangeLabel}</span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-dark-600">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? `border-primary-500 ${tab.color}`
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {renderTabContent()}
      </div>

      {/* Info Box */}
      <div className="card p-4 bg-primary-900/20 border border-primary-700/30">
        <p className="text-sm text-primary-300">
          💡 <span className="font-medium">Tip:</span> Select 1-3 cities to compare their analytics, then choose a time range to analyze trends and patterns.
        </p>
      </div>
    </div>
  )
}
