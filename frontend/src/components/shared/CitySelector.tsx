/**
 * CitySelector Component
 * Reusable city selector dropdown with optional multi-select
 */

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

const CITIES = [
  { id: 'mumbai', name: 'Mumbai' },
  { id: 'delhi', name: 'Delhi' },
  { id: 'bangalore', name: 'Bangalore' },
  { id: 'chennai', name: 'Chennai' },
  { id: 'hyderabad', name: 'Hyderabad' },
  { id: 'kolkata', name: 'Kolkata' },
  { id: 'pune', name: 'Pune' },
]

interface CitySelectorProps {
  selectedCities: string[]
  onSelect: (cityId: string[]) => void
  multiSelect?: boolean
  maxSelections?: number
}

export default function CitySelector({
  selectedCities,
  onSelect,
  multiSelect = false,
  maxSelections = 3,
}: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCityClick = (cityId: string) => {
    if (multiSelect) {
      if (selectedCities.includes(cityId)) {
        onSelect(selectedCities.filter((c) => c !== cityId))
      } else if (selectedCities.length < maxSelections) {
        onSelect([...selectedCities, cityId])
      }
    } else {
      onSelect([cityId])
      setIsOpen(false)
    }
  }

  const displayText = selectedCities.length === 0
    ? 'Select cities'
    : selectedCities
        .map((id) => CITIES.find((c) => c.id === id)?.name)
        .join(', ')

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white text-sm hover:border-primary-500 transition-colors focus:outline-none focus:border-primary-400 w-full justify-between"
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 w-full max-h-64 overflow-y-auto">
          {CITIES.map((city) => {
            const isSelected = selectedCities.includes(city.id)
            return (
              <button
                key={city.id}
                onClick={() => handleCityClick(city.id)}
                className={`w-full text-left px-4 py-2.5 transition-colors hover:bg-dark-700 flex items-center justify-between border-b border-dark-700 last:border-0 ${
                  isSelected
                    ? 'bg-primary-600/20 text-primary-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>{city.name}</span>
                {isSelected && <span className="text-primary-400">✓</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* Close on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Selected badges (multi-select only) */}
      {multiSelect && selectedCities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCities.map((cityId) => {
            const city = CITIES.find((c) => c.id === cityId)
            return (
              <div
                key={cityId}
                className="inline-flex items-center gap-1 bg-primary-600/20 text-primary-300 px-3 py-1 rounded-full text-xs font-medium"
              >
                {city?.name}
                <button
                  onClick={() =>
                    onSelect(selectedCities.filter((c) => c !== cityId))
                  }
                  className="hover:text-primary-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
