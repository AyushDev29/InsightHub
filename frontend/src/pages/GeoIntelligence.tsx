/**
 * GeoIntelligence Page
 * Main page for geographic visualization and analysis
 * Features: Interactive map, heatmaps, timeline slider, layer controls
 */

import React, { useState, useEffect } from 'react'
import { CityMarker, HourlyData } from '../types/geo'
import GeoMap from '../components/geo/GeoMap'
import LayerControls from '../components/geo/LayerControls'
import TimelineSlider from '../components/geo/TimelineSlider'
import SearchBar from '../components/geo/SearchBar'
import CountrySelector from '../components/geo/CountrySelector'
import AnalyticsPanel from '../components/geo/AnalyticsPanel'
import MapLegend from '../components/geo/MapLegend'
import MarkerPopup from '../components/geo/MarkerPopup'
import { generateMockHourlyData, generateTimeLabels } from '../utils/geoHelpers'

// Mock city data for India (same as existing data)
const MOCK_CITIES: CityMarker[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    latitude: 28.7041,
    longitude: 77.1025,
    temperature: 38.2,
    aqi: 92,
    humidity: 45.2,
    windSpeed: 12.5,
    lastUpdated: new Date(Date.now() - 120000),
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    latitude: 19.076,
    longitude: 72.8776,
    temperature: 32.5,
    aqi: 78,
    humidity: 78.5,
    windSpeed: 18.2,
    lastUpdated: new Date(Date.now() - 90000),
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    temperature: 28.9,
    aqi: 64,
    humidity: 62.1,
    windSpeed: 8.3,
    lastUpdated: new Date(Date.now() - 150000),
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
    temperature: 35.1,
    aqi: 85,
    humidity: 79.2,
    windSpeed: 14.6,
    lastUpdated: new Date(Date.now() - 180000),
  },
  {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    latitude: 13.0827,
    longitude: 80.2707,
    temperature: 34.2,
    aqi: 72,
    humidity: 71.3,
    windSpeed: 9.5,
    lastUpdated: new Date(Date.now() - 60000),
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    latitude: 17.3709,
    longitude: 78.4738,
    temperature: 36.5,
    aqi: 88,
    humidity: 52.8,
    windSpeed: 11.2,
    lastUpdated: new Date(Date.now() - 120000),
  },
  {
    id: 'pune',
    name: 'Pune',
    country: 'India',
    latitude: 18.5204,
    longitude: 73.8567,
    temperature: 30.8,
    aqi: 71,
    humidity: 58.4,
    windSpeed: 10.8,
    lastUpdated: new Date(Date.now() - 140000),
  },
]

export const GeoIntelligence: React.FC = () => {
  const [country, setCountry] = useState<'IN' | 'US' | 'JP' | 'AU' | 'DE'>('IN')
  const [currentTime, setCurrentTime] = useState('13:00')
  const [isPlaying, setIsPlaying] = useState(false)

  // Layer visibility state
  const [layers, setLayers] = useState<Record<string, boolean>>({
    temperature: true,
    aqi: false,
    wind: false,
    rain: false,
    humidity: false,
    cloud: false,
  })

  // UI state
  const [selectedCity, setSelectedCity] = useState<CityMarker | null>(null)
  const [cities, setCities] = useState<CityMarker[]>(MOCK_CITIES)
  const [hourlyData, setHourlyData] = useState<Record<string, HourlyData[]>>({})

  // Initialize hourly data
  useEffect(() => {
    const data: Record<string, HourlyData[]> = {}
    cities.forEach(city => {
      data[city.id] = generateMockHourlyData(city)
    })
    setHourlyData(data)
  }, [cities])

  // Update map data based on timeline
  useEffect(() => {
    if (Object.keys(hourlyData).length === 0) return

    const updatedCities = cities.map(city => {
      const hourly = hourlyData[city.id]
      if (!hourly) return city

      const timeIndex = generateTimeLabels().indexOf(currentTime)
      const timeData = hourly[timeIndex] || hourly[0]

      return {
        ...city,
        temperature: timeData.temperature,
        aqi: Math.round(timeData.aqi),
        humidity: timeData.humidity,
        windSpeed: timeData.windSpeed,
      }
    })

    setCities(updatedCities)
  }, [currentTime, hourlyData])

  // Auto-advance timeline when playing
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const times = generateTimeLabels()
        const currentIndex = times.indexOf(prev)
        if (currentIndex === -1 || currentIndex === times.length - 1) {
          setIsPlaying(false)
          return times[0] // Reset to 09:00
        }
        return times[currentIndex + 1]
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Determine active layer and heatmap visibility
  const activeLayer: 'temperature' | 'aqi' = layers.aqi ? 'aqi' : 'temperature'
  const showHeatmap = Object.values(layers).some(v => v)
  const showMarkers = true

  // Handle layer toggle
  const handleLayerToggle = (layerId: string) => {
    setLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId],
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_320px] gap-4 h-[calc(100vh-120px)]">
      {/* LEFT SIDEBAR - CONTROLS */}
      <div className="flex flex-col gap-4 overflow-y-auto pb-4">
        {/* Country Selector */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
            Country
          </label>
          <CountrySelector
            selectedCountry={country}
            onCountryChange={setCountry}
          />
        </div>

        {/* Search Bar */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <SearchBar
            cities={cities}
            onCitySelect={city => {
              setSelectedCity(city)
              // Map zoom would be triggered here
            }}
          />
        </div>

        {/* Layer Controls */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">
            Layers
          </label>
          <LayerControls
            layers={layers}
            onLayerToggle={handleLayerToggle}
          />
        </div>

        {/* Timeline Slider */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">
            Timeline
          </label>
          <TimelineSlider
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
          />
        </div>

        {/* Legend */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">
            Legend
          </label>
          <MapLegend layer={activeLayer} />
        </div>
      </div>

      {/* CENTER - MAP */}
      <div className="bg-dark-800 border border-dark-600 rounded-lg overflow-hidden shadow-lg">
        <div className="w-full h-full">
        <GeoMap
            cities={cities}
            activeLayer={activeLayer}
            showHeatmap={showHeatmap}
            showMarkers={showMarkers}
            selectedCity={selectedCity}
            onMarkerClick={setSelectedCity}
          />
        </div>
      </div>

      {/* RIGHT SIDEBAR - ANALYTICS & DETAILS */}
      <div className="flex flex-col gap-4 overflow-y-auto pb-4">
      {/* Selected City Details */}
        {selectedCity && (
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white">City Details</h3>
              <button
                onClick={() => setSelectedCity(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            <MarkerPopup
              city={selectedCity}
              onClose={() => setSelectedCity(null)}
            />
          </div>
        )}

        {/* Analytics Panel */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 flex-1 overflow-y-auto">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">
            Analytics
          </label>
          <AnalyticsPanel cities={cities} />
        </div>

        {/* Time Display */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Time</p>
            <p className="text-2xl font-bold text-primary-400">{currentTime} IST</p>
            <p className="text-xs text-gray-500 mt-2">
              {currentTime === '13:00' ? 'Current' : 'Simulated'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeoIntelligence
