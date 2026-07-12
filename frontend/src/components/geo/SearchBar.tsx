/**
 * SearchBar Component
 * Search for cities and zoom to their location
 */

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { CityMarker } from '../../types/geo'
import { filterCities } from '../../utils/geoHelpers'

interface SearchBarProps {
  cities: CityMarker[]
  onCitySelect: (city: CityMarker) => void
}

export default function SearchBar({ cities, onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CityMarker[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Filter cities as user types
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      setIsOpen(false)
    } else {
      const filtered = filterCities(cities, query)
      setResults(filtered)
      setIsOpen(true)
    }
  }, [query, cities])

  const handleCityClick = (city: CityMarker) => {
    onCitySelect(city)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search cities..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {results.map(city => (
            <button
              key={city.id}
              onClick={() => handleCityClick(city)}
              className="w-full text-left px-4 py-3 hover:bg-dark-600 border-b border-dark-600 last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{city.name}</p>
                  <p className="text-xs text-gray-400">
                    {city.temperature}°C • AQI {city.aqi}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{city.latitude.toFixed(2)}°N</p>
                  <p>{city.longitude.toFixed(2)}°E</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-600 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400">No cities found matching "{query}"</p>
        </div>
      )}
    </div>
  )
}
