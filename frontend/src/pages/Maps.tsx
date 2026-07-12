import { Map as MapIcon } from 'lucide-react'

export default function Maps() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <MapIcon className="text-primary-500" size={32} />
        <div>
          <h1 className="text-4xl font-bold text-white">Maps</h1>
          <p className="text-gray-400">Spatial visualization of weather, air quality, and environmental data</p>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-8 text-center">
        <div className="mb-4">
          <div className="inline-block p-3 bg-primary-500/20 rounded-lg mb-4">
            <MapIcon className="text-primary-500" size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Maps Coming Soon</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          We're building interactive maps to visualize weather patterns, air quality indices, and environmental data across regions.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-left">
            <p className="text-sm font-medium text-primary-400 mb-1">🌡️ Weather</p>
            <p className="text-xs text-gray-500">Temperature heatmaps</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-primary-400 mb-1">💨 AQI</p>
            <p className="text-xs text-gray-500">Air quality layers</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-primary-400 mb-1">🌍 Earthquakes</p>
            <p className="text-xs text-gray-500">Seismic activity</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-primary-400 mb-1">🔥 Hazards</p>
            <p className="text-xs text-gray-500">Wildfires & floods</p>
          </div>
        </div>
      </div>
    </div>
  )
}
