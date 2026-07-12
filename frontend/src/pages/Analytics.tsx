import { BarChart3 } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="text-primary-500" size={32} />
        <div>
          <h1 className="text-4xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">Correlations, trends, and data-driven insights</p>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-8 text-center">
        <div className="mb-4">
          <div className="inline-block p-3 bg-primary-500/20 rounded-lg mb-4">
            <BarChart3 className="text-primary-500" size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Analytics Coming Soon</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          We're building powerful analytics tools to help you understand correlations, trends, and patterns in your data.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="text-left">
            <p className="text-sm font-medium text-primary-400 mb-1">📊 Correlations</p>
            <p className="text-xs text-gray-500">Relationships between variables</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-primary-400 mb-1">📈 Trends</p>
            <p className="text-xs text-gray-500">Historical patterns and forecasts</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-primary-400 mb-1">🔄 Comparisons</p>
            <p className="text-xs text-gray-500">Cross-region analysis</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-primary-400 mb-1">📋 Reports</p>
            <p className="text-xs text-gray-500">Export and download data</p>
          </div>
        </div>
      </div>
    </div>
  )
}
