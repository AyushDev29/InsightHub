/**
 * Weather Utilities
 * Helper functions for weather data formatting and calculations
 */

/**
 * Get weather icon based on weather code and time of day
 */
export const getWeatherIcon = (code: number, isDay: boolean = true): string => {
  // WMO Weather codes
  if (code === 0 || code === 1) return isDay ? '☀️' : '🌙'
  if (code === 2) return isDay ? '🌤️' : '🌥️'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (code === 51 || code === 53 || code === 55) return '🌧️'
  if (code === 61 || code === 63 || code === 65) return '🌧️'
  if (code === 71 || code === 73 || code === 75) return '❄️'
  if (code === 77) return '❄️'
  if (code === 80 || code === 81 || code === 82) return '🌧️'
  if (code === 85 || code === 86) return '❄️'
  if (code === 95 || code === 96 || code === 99) return '⛈️'
  return '❓'
}

/**
 * Format temperature with unit
 */
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  return `${Math.round(temp)}°${unit}`
}

/**
 * Convert wind speed from m/s to km/h or mph
 */
export const convertWindSpeed = (
  speedMs: number,
  to: 'kmh' | 'mph' = 'kmh'
): number => {
  if (to === 'kmh') return Math.round(speedMs * 3.6)
  return Math.round(speedMs * 2.237)
}

/**
 * Get wind direction label from degrees
 */
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16
  return directions[index]
}

/**
 * Get AQI status and color
 */
export const getAQIStatus = (aqi: number): {
  label: string
  color: string
  bgColor: string
  severity: 'good' | 'fair' | 'moderate' | 'poor' | 'veryPoor' | 'extreme'
} => {
  if (aqi <= 20) {
    return {
      label: 'Good',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      severity: 'good',
    }
  }
  if (aqi <= 40) {
    return {
      label: 'Fair',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      severity: 'fair',
    }
  }
  if (aqi <= 60) {
    return {
      label: 'Moderate',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      severity: 'moderate',
    }
  }
  if (aqi <= 80) {
    return {
      label: 'Poor',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      severity: 'poor',
    }
  }
  if (aqi <= 100) {
    return {
      label: 'Very Poor',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      severity: 'veryPoor',
    }
  }
  return {
    label: 'Extreme',
    color: 'text-red-600',
    bgColor: 'bg-red-600/20',
    severity: 'extreme',
  }
}

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string, format: 'short' | 'long' = 'short'): string => {
  const date = new Date(dateString)
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

/**
 * Format time from ISO string
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Calculate average from array
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length)
}

/**
 * Get temperature trend (up, down, stable)
 */
export const getTempTrend = (
  current: number,
  previous: number
): { direction: 'up' | 'down' | 'stable'; icon: string; change: number } => {
  const change = Math.round((current - previous) * 10) / 10
  if (change > 0.5) return { direction: 'up', icon: '📈', change }
  if (change < -0.5) return { direction: 'down', icon: '📉', change }
  return { direction: 'stable', icon: '➡️', change }
}
