/**
 * GeoMap Component
 * Leaflet map wrapper for geographic visualization
 */

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CityMarker, getTemperatureColor, getAQIColor } from '../../types/geo'
import { generateTemperatureHeatmap, generateAQIHeatmap, convertToLeafletHeatFormat } from '../../utils/heatmapGenerator'

interface GeoMapProps {
  cities: CityMarker[]
  activeLayer: 'temperature' | 'aqi'
  showHeatmap: boolean
  showMarkers: boolean
  selectedCity: CityMarker | null
  onMarkerClick: (city: CityMarker) => void
}

export const GeoMap: React.FC<GeoMapProps> = ({
  cities,
  activeLayer,
  showHeatmap,
  showMarkers,
  selectedCity,
  onMarkerClick,
}) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.CircleMarker[]>([])
  const heatmapLayerRef = useRef<L.Layer | null>(null)

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map('geo-map').setView([20, 78], 5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 12,
      minZoom: 3,
    }).addTo(map)

    // Add attribution control
    L.control.attribution({ position: 'bottomright' }).addTo(map)

    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map)

    // Prevent default Leaflet icon issues
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })

    mapRef.current = map

    // Cleanup on unmount
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    if (!showMarkers) return

    // Add markers for each city
    cities.forEach(city => {
      const color = activeLayer === 'temperature' 
        ? getTemperatureColor(city.temperature)
        : getAQIColor(city.aqi)

      const isSelected = selectedCity?.id === city.id
      const radius = isSelected ? 12 : 10
      const opacity = isSelected ? 1 : 0.8
      const weight = isSelected ? 3 : 2

      const marker = L.circleMarker([city.latitude, city.longitude], {
        radius,
        fillColor: color,
        color: isSelected ? '#fff' : color,
        weight,
        opacity,
        fillOpacity: opacity,
      })
        .bindPopup(
          `<div class="popup-content">
            <div class="font-bold text-lg">${city.name}</div>
            <div class="text-sm text-gray-600 mt-1">
              ${activeLayer === 'temperature' ? 
                `<div>🌡️ Temp: ${city.temperature.toFixed(1)}°C</div>` :
                `<div>📊 AQI: ${city.aqi}</div>`
              }
              <div>💨 Wind: ${city.windSpeed.toFixed(1)} km/h</div>
              <div>💧 Humidity: ${city.humidity.toFixed(0)}%</div>
            </div>
          </div>`,
          { className: 'custom-popup' }
        )
        .addTo(mapRef.current!)
        .on('click', () => onMarkerClick(city))

      markersRef.current.push(marker)
    })
  }, [cities, activeLayer, showMarkers, selectedCity, onMarkerClick])

  // Update heatmap
  useEffect(() => {
    if (!mapRef.current) return

    // Remove existing heatmap
    if (heatmapLayerRef.current) {
      mapRef.current.removeLayer(heatmapLayerRef.current)
      heatmapLayerRef.current = null
    }

    if (!showHeatmap || cities.length === 0) return

    try {
      // Generate heatmap data
      const heatmapPoints = activeLayer === 'temperature'
        ? generateTemperatureHeatmap(cities)
        : generateAQIHeatmap(cities)

      const leafletHeatFormat = convertToLeafletHeatFormat(heatmapPoints)

      // Dynamically import heat package
      import('heat').then((HeatModule: any) => {
        if (mapRef.current && leafletHeatFormat.length > 0) {
          const Heat = HeatModule.default || HeatModule.heat || HeatModule
          const heatmap = Heat(leafletHeatFormat, {
            radius: 35,
            blur: 25,
            maxZoom: 12,
            gradient: activeLayer === 'temperature'
              ? {
                  0.0: '#3b82f6', // Blue
                  0.3: '#10b981', // Green
                  0.6: '#eab308', // Yellow
                  1.0: '#ef4444', // Red
                }
              : {
                  0.0: '#10b981', // Green
                  0.2: '#eab308', // Yellow
                  0.4: '#f97316', // Orange
                  0.6: '#ef4444', // Red
                  0.8: '#a855f7', // Purple
                  1.0: '#7f1d1d', // Dark Red
                },
          }).addTo(mapRef.current)
          heatmapLayerRef.current = heatmap
        }
      }).catch(err => {
        console.error('Failed to load heat package:', err)
      })
    } catch (error) {
      console.error('Error generating heatmap:', error)
    }
  }, [cities, activeLayer, showHeatmap])

  return (
    <div
      id="geo-map"
      className="w-full h-full bg-gray-100 rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  )
}

export default GeoMap
