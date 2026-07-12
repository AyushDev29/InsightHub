/**
 * Country Selector Component
 * Dropdown for selecting which country to view
 */

import { ChevronDown, Globe } from 'lucide-react'
import { Country } from '../services/api'

interface CountrySelectorProps {
  countries: Country[]
  selectedCountry: Country | null
  isLoading: boolean
  onSelectCountry: (isoCode: string) => void
}

export default function CountrySelector({
  countries,
  selectedCountry,
  isLoading,
  onSelectCountry,
}: CountrySelectorProps) {
  return (
    <div className="relative inline-block w-full max-w-xs">
      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
        <Globe size={14} className="inline mr-1" />
        Country
      </label>

      <div className="relative">
        <select
          value={selectedCountry?.iso_code || ''}
          onChange={(e) => onSelectCountry(e.target.value)}
          disabled={isLoading || countries.length === 0}
          className="
            w-full px-4 py-2.5 pr-10
            bg-dark-800 hover:bg-dark-700
            border border-dark-600 hover:border-primary-500/50
            rounded-lg
            text-white font-medium
            appearance-none cursor-pointer
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-primary-500/50
          "
        >
          <option value="" disabled>
            Select a country...
          </option>
          {countries.map((country) => (
            <option key={country.iso_code} value={country.iso_code}>
              {country.name} ({country.iso_code})
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="
            absolute right-3 top-1/2 transform -translate-y-1/2
            text-gray-400 pointer-events-none
          "
        />
      </div>

      {selectedCountry && (
        <div className="mt-2 text-xs text-gray-500">
          📍 {selectedCountry.continent} • {selectedCountry.timezone}
        </div>
      )}
    </div>
  )
}
