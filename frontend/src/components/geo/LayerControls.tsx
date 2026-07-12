/**
 * LayerControls Component
 * Toggle between different visualization layers
 */

interface LayerControlsProps {
  layers: Record<string, boolean>
  onLayerToggle: (layerId: string) => void
}

const AVAILABLE_LAYERS = [
  { id: 'temperature', name: 'Temperature', icon: '🌡️', available: true },
  { id: 'aqi', name: 'Air Quality (AQI)', icon: '💨', available: true },
  { id: 'wind', name: 'Wind Speed', icon: '💨', available: false },
  { id: 'rain', name: 'Precipitation', icon: '🌧️', available: false },
  { id: 'humidity', name: 'Humidity', icon: '💧', available: false },
  { id: 'cloud', name: 'Cloud Cover', icon: '☁️', available: false },
]

const FUTURE_LAYERS = [
  { id: 'earthquakes', name: 'Earthquakes', icon: '🌍' },
  { id: 'wildfires', name: 'Wildfires', icon: '🔥' },
  { id: 'cyclones', name: 'Cyclones', icon: '🌀' },
  { id: 'flood', name: 'Flood Risk', icon: '🌊' },
]

export default function LayerControls({ layers, onLayerToggle }: LayerControlsProps) {
  return (
    <div className="space-y-4">
      {/* Available Layers */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white uppercase">Active Layers</h4>
        <div className="space-y-2">
          {AVAILABLE_LAYERS.filter(l => l.available).map(layer => (
            <label
              key={layer.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={layers[layer.id] || false}
                onChange={() => onLayerToggle(layer.id)}
                className="w-4 h-4 rounded accent-primary-500 cursor-pointer"
              />
              <span className="text-sm">{layer.icon}</span>
              <span className="text-sm text-gray-300">{layer.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Heatmap Layers */}
      <div className="space-y-2 pt-4 border-t border-dark-600">
        <h4 className="text-sm font-semibold text-white uppercase">Heatmaps</h4>
        <div className="space-y-2">
          {AVAILABLE_LAYERS.filter(l => !l.available).map(layer => (
            <label
              key={layer.id}
              className="flex items-center gap-3 cursor-not-allowed opacity-50"
              title="Coming soon"
            >
              <input
                type="checkbox"
                disabled
                className="w-4 h-4 rounded accent-primary-500 cursor-not-allowed"
              />
              <span className="text-sm">{layer.icon}</span>
              <span className="text-sm text-gray-400">{layer.name}</span>
              <span className="text-xs text-gray-500 ml-auto">Soon</span>
            </label>
          ))}
        </div>
      </div>

      {/* Future Layers */}
      <div className="space-y-2 pt-4 border-t border-dark-600">
        <h4 className="text-sm font-semibold text-white uppercase">Coming Soon</h4>
        <div className="space-y-2">
          {FUTURE_LAYERS.map(layer => (
            <label
              key={layer.id}
              className="flex items-center gap-3 cursor-not-allowed opacity-40"
              title="Phase 5+"
            >
              <input
                type="checkbox"
                disabled
                className="w-4 h-4 rounded cursor-not-allowed"
              />
              <span className="text-sm">{layer.icon}</span>
              <span className="text-sm text-gray-500">{layer.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 pt-4 border-t border-dark-600">
        <p>📊 Professional GIS-style layer management</p>
        <p className="mt-1">Like ArcGIS / MapBox</p>
      </div>
    </div>
  )
}
