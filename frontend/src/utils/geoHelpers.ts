/**
 * Geographic Helper Utilities
 * Functions for map operations, bounds, and geographic calculations
 */

import { CityMarker, HourlyData } from '../types/geo'

/**
 * Define country configurations
 */
export const COUNTRIES = {
  IN: {
    code: 'IN',
    name: 'India',
    bounds: [[8, 68], [35, 97]] as [[number, number], [number, number]],
    center: [20, 78] as [number, number],
    zoom: 5,
  },
  US: {
    code: 'US',
    name: 'USA',
    bounds: [[25, -125], [48, -66]] as [[number, number], [number, number]],
    center: [38, -95] as [number, number],
    zoom: 4,
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    bounds: [[30, 130], [45, 145]] as [[number, number], [number, number]],
    center: [36.5, 138] as [number, number],
    zoom: 6,
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    bounds: [[-44, 113], [-10, 154]] as [[number, number], [number, number]],
    center: [-27, 133] as [number, number],
    zoom: 4,
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    bounds: [[47, 6], [55, 15]] as [[number, number], [number, number]],
    center: [51, 10] as [number, number],
    zoom: 6,
  },
}

export type CountryCode = keyof typeof COUNTRIES

/**
 * Get country configuration
 */
export function getCountryConfig(code: CountryCode) {
  return COUNTRIES[code]
}

/**
 * Format latitude for display
 */
export function formatLatitude(lat: number): string {
  const direction = lat >= 0 ? 'N' : 'S'
  return `${Math.abs(lat).toFixed(2)}°${direction}`
}

/**
 * Format longitude for display
 */
export function formatLongitude(lon: number): string {
  const direction = lon >= 0 ? 'E' : 'W'
  return `${Math.abs(lon).toFixed(2)}°${direction}`
}

/**
 * Calculate distance between two points (haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Find nearest city to coordinates
 */
export function findNearestCity(
  lat: number,
  lon: number,
  cities: CityMarker[]
): CityMarker | null {
  if (cities.length === 0) return null

  let nearest = cities[0]
  let minDistance = calculateDistance(lat, lon, nearest.latitude, nearest.longitude)

  for (const city of cities.slice(1)) {
    const dist = calculateDistance(lat, lon, city.latitude, city.longitude)
    if (dist < minDistance) {
      minDistance = dist
      nearest = city
    }
  }

  return nearest
}

/**
 * Filter cities by search query
 */
export function filterCities(cities: CityMarker[], query: string): CityMarker[] {
  const lowerQuery = query.toLowerCase()
  return cities.filter(
    city =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Sort cities by metric
 */
export function sortCities(
  cities: CityMarker[],
  metric: 'temperature' | 'aqi' | 'humidity' | 'windSpeed' | 'name',
  ascending: boolean = true
): CityMarker[] {
  const sorted = [...cities]

  sorted.sort((a, b) => {
    let aValue: number | string = 0
    let bValue: number | string = 0

    if (metric === 'temperature') {
      aValue = a.temperature
      bValue = b.temperature
    } else if (metric === 'aqi') {
      aValue = a.aqi
      bValue = b.aqi
    } else if (metric === 'humidity') {
      aValue = a.humidity
      bValue = b.humidity
    } else if (metric === 'windSpeed') {
      aValue = a.windSpeed
      bValue = b.windSpeed
    } else if (metric === 'name') {
      aValue = a.name
      bValue = b.name
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return ascending ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  return sorted
}

/**
 * Generate hourly time labels
 */
export function generateTimeLabels(): string[] {
  const times: string[] = []
  for (let hour = 9; hour <= 23; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`)
  }
  return times
}

/**
 * Parse time string to hour
 */
export function parseTimeToHour(timeStr: string): number {
  const [hour] = timeStr.split(':')
  return parseInt(hour, 10)
}

export function generateMockHourlyData(city: CityMarker): HourlyData[] {
  const times = generateTimeLabels()
  const data: HourlyData[] = []

  for (let i = 0; i < times.length; i++) {
    // Simulate temperature rising then falling
    const tempVariation = Math.sin((i / times.length) * Math.PI) * 6
    const temperature = city.temperature + tempVariation

    // Simulate AQI: morning peak, afternoon drop, evening rise
    let aqiVariation = 0
    if (i < 3) aqiVariation = 15 // Morning peak
    else if (i < 6) aqiVariation = -10 // Afternoon drop
    else aqiVariation = 8 // Evening rise
    const aqi = Math.max(0, city.aqi + aqiVariation)

    // Humidity: inverse of temperature (roughly)
    const humidity = Math.max(20, city.humidity - tempVariation * 1.5)

    // Wind: random variation
    const windVariation = (Math.random() - 0.5) * 10
    const windSpeed = Math.max(0, city.windSpeed + windVariation)

    // Precipitation: morning and evening chances
    const precipitationProbability =
      i < 3 || i > 9 ? Math.random() * 30 : Math.random() * 10

    data.push({
      time: times[i],
      temperature: Math.round(temperature * 10) / 10,
      aqi: Math.round(aqi),
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed * 10) / 10,
      precipitationProbability: Math.round(precipitationProbability),
    })
  }

  return data
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Get time ago string
 */
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
