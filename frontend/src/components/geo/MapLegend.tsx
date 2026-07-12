/**
 * MapLegend Component
 * Shows color scale and reference for current layer
 */

import { TEMPERATURE_COLORS, AQI_COLORS, WIND_COLORS } from '../../types/geo'

interface MapLegendProps {
  layer: 'temperature' | 'aqi' | 'wind' | 'rain' | 'humidity' | 'cloud'
}

export default function MapLegend({ layer }: MapLegendProps) {
  let title = ''
  let items: Array<{ color: string; label: string }> = []

  if (layer === 'temperature') {
    title = 'Temperature (°C)'
    items = [
      { color: TEMPERATURE_COLORS.cold, label: '< 15° (Cold)' },
      { color: TEMPERATURE_COLORS.moderate, label: '15-25° (Moderate)' },
      { color: TEMPERATURE_COLORS.warm, label: '25-35° (Warm)' },
      { color: TEMPERATURE_COLORS.hot, label: '> 35° (Hot)' },
    ]
  } else if (layer === 'aqi') {
    title = 'Air Quality Index'
    items = [
      { color: AQI_COLORS.good, label: '0-50 (Good)' },
      { color: AQI_COLORS.moderate, label: '51-100 (Moderate)' },
      { color: AQI_COLORS.poor, label: '101-150 (Poor)' },
      { color: AQI_COLORS.veryPoor, label: '151-200 (Very Poor)' },
      { color: AQI_COLORS.severe, label: '201-300 (Severe)' },
      { color: AQI_COLORS.hazardous, label: '300+ (Hazardous)' },
    ]
  } else if (layer === 'wind') {
    title = 'Wind Speed (km/h)'
    items = [
      { color: WIND_COLORS.light, label: '< 10 (Light)' },
      { color: WIND_COLORS.moderate, label: '10-20 (Moderate)' },
      { color: WIND_COLORS.strong, label: '20-30 (Strong)' },
      { color: WIND_COLORS.veryStrong, label: '> 30 (Very Strong)' },
    ]
  } else if (layer === 'rain') {
    title = 'Precipitation (%)'
    items = [
      { color: '#10b981', label: '0-20% (Unlikely)' },
      { color: '#eab308', label: '20-50% (Possible)' },
      { color: '#f97316', label: '50-80% (Likely)' },
      { color: '#3b82f6', label: '80-100% (Very Likely)' },
    ]
  } else if (layer === 'humidity') {
    title = 'Humidity (%)'
    items = [
      { color: '#f97316', label: '< 30% (Dry)' },
      { color: '#eab308', label: '30-50% (Comfortable)' },
      { color: '#06b6d4', label: '50-70% (Moderate)' },
      { color: '#3b82f6', label: '> 70% (Humid)' },
    ]
  } else if (layer === 'cloud') {
    title = 'Cloud Cover (%)'
    items = [
      { color: '#fef08a', label: '0-25% (Clear)' },
      { color: '#e5e7eb', label: '25-50% (Partly Cloudy)' },
      { color: '#cbd5e1', label: '50-75% (Mostly Cloudy)' },
      { color: '#94a3b8', label: '75-100% (Overcast)' },
    ]
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white uppercase">{title}</h4>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded border border-gray-600"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
