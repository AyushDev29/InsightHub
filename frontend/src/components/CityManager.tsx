/**
 * City Manager Modal/Panel
 * Allows users to manage their favorite cities
 */

import { useState, useMemo } from 'react'
import { X, Heart, MapPin, Users, Search } from 'lucide-react'
import { City } from '../services/api'

interface CityManagerProps {
  cities: City[]
  favorites: City[]
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onToggleFavorite: (cityId: string, isFavorite: boolean) => void
}

export default function CityManager({
  cities,
  favorites,
  isOpen,
  isLoading,
  onClose,
  onToggleFavorite,
}: CityManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCities = useMemo(() => {
    return cities.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [cities, searchQuery])

  const isFavorite = (cityId: string) =>
    favorites.some((fav) => fav.id === cityId)

  const maxFavorites = 6

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      {/* Modal */}
      <div className="
        w-full md:w-2xl max-h-screen md:max-h-[80vh]
        bg-dark-800 rounded-t-2xl md:rounded-2xl
        flex flex-col
        shadow-2xl
      ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">
            🏙️ Manage Cities
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Bar */}
          <div className="sticky top-0 p-4 bg-dark-800 border-b border-dark-700">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2
                  bg-dark-700 hover:bg-dark-600
                  border border-dark-600
                  rounded-lg text-white
                  placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-primary-500/50
                  transition-colors
                "
              />
            </div>
          </div>

          {/* Favorites Section */}
          <div className="p-4 border-b border-dark-700">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-red-400 fill-red-400" />
              <h3 className="text-sm font-semibold text-white">
                Favorites ({favorites.length}/{maxFavorites})
              </h3>
            </div>

            {favorites.length === 0 ? (
              <p className="text-gray-500 text-xs">No favorites yet. Add some cities!</p>
            ) : (
              <div className="space-y-2">
                {favorites.map((city) => (
                  <CityRow
                    key={city.id}
                    city={city}
                    isFavorite={true}
                    onToggle={() => onToggleFavorite(city.id, true)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </div>

          {/* All Cities Section */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-blue-400" />
              <h3 className="text-sm font-semibold text-white">
                All Cities ({filteredCities.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-dark-700 rounded animate-pulse" />
                ))}
              </div>
            ) : filteredCities.length === 0 ? (
              <p className="text-gray-500 text-xs">No cities found</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCities.map((city) => (
                  <CityRow
                    key={city.id}
                    city={city}
                    isFavorite={isFavorite(city.id)}
                    onToggle={() => onToggleFavorite(city.id, isFavorite(city.id))}
                    isLoading={isLoading}
                    isMaxedOut={favorites.length >= maxFavorites && !isFavorite(city.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700 bg-dark-900">
          <p className="text-xs text-gray-500 text-center">
            📍 Add/remove up to {maxFavorites} favorite cities. They'll appear on your dashboard.
          </p>
          <button
            onClick={onClose}
            className="
              w-full mt-3 px-4 py-2
              bg-primary-600 hover:bg-primary-700
              rounded-lg text-white font-medium
              transition-colors
            "
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── City Row Component ──────────────────────────────────────────────────

interface CityRowProps {
  city: City
  isFavorite: boolean
  onToggle: () => void
  isLoading: boolean
  isMaxedOut?: boolean
}

function CityRow({ city, isFavorite, onToggle, isLoading, isMaxedOut }: CityRowProps) {
  return (
    <div className="
      flex items-center justify-between px-3 py-2.5
      bg-dark-700 hover:bg-dark-600
      rounded-lg transition-colors
    ">
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{city.name}</p>
        {city.state && (
          <p className="text-gray-500 text-xs">{city.state}</p>
        )}
        {city.population && (
          <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
            <Users size={12} />
            {(city.population / 1000000).toFixed(1)}M
          </p>
        )}
      </div>

      <button
        onClick={onToggle}
        disabled={isLoading || isMaxedOut}
        className={`
          ml-2 p-1.5 rounded transition-colors flex-shrink-0
          ${isFavorite
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'bg-dark-500 text-gray-400 hover:bg-dark-400'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={isMaxedOut ? `Max ${6} favorites reached` : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          size={16}
          className={isFavorite ? 'fill-current' : ''}
        />
      </button>
    </div>
  )
}
