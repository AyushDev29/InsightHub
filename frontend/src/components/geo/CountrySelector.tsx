/**
 * CountrySelector Component
 * Allows users to select different countries (currently only India available)
 */

import { COUNTRIES, CountryCode } from '../../utils/geoHelpers'

interface CountrySelectorProps {
  selectedCountry: CountryCode
  onCountryChange: (country: CountryCode) => void
}

export default function CountrySelector({
  selectedCountry,
  onCountryChange,
}: CountrySelectorProps) {
  const countryEntries = Object.entries(COUNTRIES) as Array<[CountryCode, (typeof COUNTRIES)[CountryCode]]>

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 uppercase">Country</label>
      <div className="space-y-2">
        {countryEntries.map(([code, country]) => (
          <button
            key={code}
            onClick={() => onCountryChange(code)}
            disabled={code !== 'IN'}
            className={`w-full text-left px-3 py-2 rounded transition-all ${
              selectedCountry === code
                ? 'bg-primary-600 text-white'
                : code === 'IN'
                ? 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                : 'bg-dark-700 text-gray-500 cursor-not-allowed opacity-50'
            }`}
            title={code !== 'IN' ? 'Coming in Phase 5' : ''}
          >
            <div className="flex items-center justify-between">
              <span>{country.name}</span>
              {code !== 'IN' && <span className="text-xs text-gray-500">Soon</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-500 pt-2">
        <p>🌍 Phase 4: India</p>
        <p>🌍 Phase 5: USA, Japan, Australia, Germany</p>
      </div>
    </div>
  )
}
