/**
 * MarkerPopup Component
 * Displays detailed city information on marker click
 */

import React from 'react'
import { CityMarker, getAQIColor } from '../../types/geo'
import { getTimeAgo } from '../../utils/geoHelpers'

interface MarkerPopupProps {
  city: CityMarker
  onClose: () => void
}

export const MarkerPopup: React.FC<MarkerPopupProps> = ({ city, onClose }) => {
  const aqiColor = getAQIColor(city.aqi)
  const aqiLabel =
    city.aqi <= 50
      ? 'Good'
      : city.aqi <= 100
        ? 'Moderate'
        : city.aqi <= 150
          ? 'Poor'
          : city.aqi <= 200
            ? 'Very Poor'
            : city.aqi <= 300
              ? 'Severe'
              : 'Hazardous'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{city.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{city.country}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 mb-3">
        {/* Temperature */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">🌡️ Temperature</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {city.temperature.toFixed(1)}°C
          </span>
        </div>

        {/* AQI */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">📊 Air Quality (AQI)</span>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: aqiColor }}
            />
            <span className="font-semibold text-gray-900 dark:text-white">
              {city.aqi}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({aqiLabel})</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">💧 Humidity</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {city.humidity.toFixed(0)}%
          </span>
        </div>

        {/* Wind */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">💨 Wind Speed</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {city.windSpeed.toFixed(1)} km/h
          </span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {getTimeAgo(city.lastUpdated)}
        </p>
      </div>
    </div>
  )
}

export default MarkerPopup
