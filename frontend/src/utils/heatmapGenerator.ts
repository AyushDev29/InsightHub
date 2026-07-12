/**
 * Heatmap Generator Utility
 * Interpolates weather data points to create smooth heatmap gradient
 */

import { CityMarker, MapPoint } from '../types/geo'

/**
 * Calculate distance between two geographic points (simple Euclidean)
 */
function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = lat2 - lat1
  const dLon = lon2 - lon1
  return Math.sqrt(dLat * dLat + dLon * dLon)
}

/**
 * Inverse distance weighting interpolation
 * Estimates value at any point based on nearby cities
 */
function inverseDistanceWeighting(
  lat: number,
  lon: number,
  cities: CityMarker[],
  values: number[],
  power: number = 2
): number {
  let totalWeight = 0
  let weightedSum = 0

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i]
    const dist = distance(lat, lon, city.latitude, city.longitude)

    if (dist === 0) return values[i] // Exact point match

    const weight = 1 / Math.pow(dist, power)
    weightedSum += weight * values[i]
    totalWeight += weight
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

/**
 * Normalize value to 0-1 range for heatmap intensity
 */
function normalizeValue(value: number, min: number, max: number): number {
  if (max === min) return 0.5
  return Math.max(0, Math.min(1, (value - min) / (max - min)))
}

/**
 * Generate heatmap points for temperature
 */
export function generateTemperatureHeatmap(cities: CityMarker[]): MapPoint[] {
  const temperatures = cities.map(c => c.temperature)
  const minTemp = Math.min(...temperatures)
  const maxTemp = Math.max(...temperatures)

  const points: MapPoint[] = []

  // India bounds (approximate)
  const latStep = 2
  const lonStep = 2
  const minLat = 8
  const maxLat = 35
  const minLon = 68
  const maxLon = 97

  for (let lat = minLat; lat <= maxLat; lat += latStep) {
    for (let lon = minLon; lon <= maxLon; lon += lonStep) {
      const interpolatedTemp = inverseDistanceWeighting(
        lat,
        lon,
        cities,
        temperatures,
        1.5
      )
      const intensity = normalizeValue(interpolatedTemp, minTemp, maxTemp)

      points.push({
        lat,
        lng: lon,
        intensity,
      })
    }
  }

  return points
}

/**
 * Generate heatmap points for AQI
 */
export function generateAQIHeatmap(cities: CityMarker[]): MapPoint[] {
  const aqis = cities.map(c => c.aqi)
  const minAQI = Math.min(...aqis)
  const maxAQI = Math.max(...aqis)

  const points: MapPoint[] = []

  const latStep = 2
  const lonStep = 2
  const minLat = 8
  const maxLat = 35
  const minLon = 68
  const maxLon = 97

  for (let lat = minLat; lat <= maxLat; lat += latStep) {
    for (let lon = minLon; lon <= maxLon; lon += lonStep) {
      const interpolatedAQI = inverseDistanceWeighting(
        lat,
        lon,
        cities,
        aqis,
        1.5
      )
      const intensity = normalizeValue(interpolatedAQI, minAQI, maxAQI)

      points.push({
        lat,
        lng: lon,
        intensity,
      })
    }
  }

  return points
}

/**
 * Generate heatmap points for wind speed
 */
export function generateWindSpeedHeatmap(cities: CityMarker[]): MapPoint[] {
  const windSpeeds = cities.map(c => c.windSpeed)
  const minWind = Math.min(...windSpeeds)
  const maxWind = Math.max(...windSpeeds)

  const points: MapPoint[] = []

  const latStep = 2
  const lonStep = 2
  const minLat = 8
  const maxLat = 35
  const minLon = 68
  const maxLon = 97

  for (let lat = minLat; lat <= maxLat; lat += latStep) {
    for (let lon = minLon; lon <= maxLon; lon += lonStep) {
      const interpolatedWind = inverseDistanceWeighting(
        lat,
        lon,
        cities,
        windSpeeds,
        1.5
      )
      const intensity = normalizeValue(interpolatedWind, minWind, maxWind)

      points.push({
        lat,
        lng: lon,
        intensity,
      })
    }
  }

  return points
}

/**
 * Generate heatmap points for humidity
 */
export function generateHumidityHeatmap(cities: CityMarker[]): MapPoint[] {
  const humidities = cities.map(c => c.humidity)
  const minHumidity = Math.min(...humidities)
  const maxHumidity = Math.max(...humidities)

  const points: MapPoint[] = []

  const latStep = 2
  const lonStep = 2
  const minLat = 8
  const maxLat = 35
  const minLon = 68
  const maxLon = 97

  for (let lat = minLat; lat <= maxLat; lat += latStep) {
    for (let lon = minLon; lon <= maxLon; lon += lonStep) {
      const interpolatedHumidity = inverseDistanceWeighting(
        lat,
        lon,
        cities,
        humidities,
        1.5
      )
      const intensity = normalizeValue(interpolatedHumidity, minHumidity, maxHumidity)

      points.push({
        lat,
        lng: lon,
        intensity,
      })
    }
  }

  return points
}

/**
 * Convert heatmap points to Leaflet.Heat format [lat, lng, intensity]
 */
export function convertToLeafletHeatFormat(points: MapPoint[]): [number, number, number][] {
  return points.map(p => [p.lat, p.lng, p.intensity])
}
