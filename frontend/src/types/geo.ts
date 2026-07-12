/**
 * Geographic Intelligence Types
 * Type definitions for map, heatmaps, and geospatial features
 */

export interface CityMarker {
  id: string
  name: string
  country: string
  latitude: number
  longitude: number
  temperature: number
  aqi: number
  humidity: number
  windSpeed: number
  lastUpdated: Date
}

export interface HourlyData {
  time: string // "09:00", "10:00", etc
  temperature: number
  aqi: number
  humidity: number
  windSpeed: number
  precipitationProbability: number
}

export interface CountryConfig {
  code: string
  name: string
  bounds: [[number, number], [number, number]]
  cities: CityMarker[]
}

export interface MapLayer {
  id: string
  name: string
  type: 'markers' | 'heatmap'
  enabled: boolean
  metric: 'temperature' | 'aqi' | 'wind' | 'rain' | 'humidity' | 'cloud'
  colors: Record<string, string>
}

export interface TimelineState {
  currentTime: string // "13:00"
  isPlaying: boolean
  speed: 1 | 2 | 4
  data: Record<string, HourlyData[]>
}

export interface MapPoint {
  lat: number
  lng: number
  intensity: number // 0-1 for heatmap
}

export interface HeatmapData {
  metric: 'temperature' | 'aqi' | 'wind' | 'rain' | 'humidity' | 'cloud'
  time: string
  points: MapPoint[]
}

export type TemperatureColor = 'cold' | 'moderate' | 'warm' | 'hot'
export type AQIColor = 'good' | 'moderate' | 'poor' | 'veryPoor' | 'severe' | 'hazardous'

export const TEMPERATURE_COLORS: Record<TemperatureColor, string> = {
  cold: '#3b82f6', // Blue
  moderate: '#10b981', // Green
  warm: '#eab308', // Yellow
  hot: '#ef4444', // Red
}

export const AQI_COLORS: Record<AQIColor, string> = {
  good: '#10b981', // Green
  moderate: '#eab308', // Yellow
  poor: '#f97316', // Orange
  veryPoor: '#ef4444', // Red
  severe: '#a855f7', // Purple
  hazardous: '#7f1d1d', // Dark Red
}

export const WIND_COLORS = {
  light: '#10b981', // Green
  moderate: '#eab308', // Yellow
  strong: '#f97316', // Orange
  veryStrong: '#ef4444', // Red
}

export function getTemperatureColor(temp: number): string {
  if (temp < 15) return TEMPERATURE_COLORS.cold
  if (temp < 25) return TEMPERATURE_COLORS.moderate
  if (temp < 35) return TEMPERATURE_COLORS.warm
  return TEMPERATURE_COLORS.hot
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return AQI_COLORS.good
  if (aqi <= 100) return AQI_COLORS.moderate
  if (aqi <= 150) return AQI_COLORS.poor
  if (aqi <= 200) return AQI_COLORS.veryPoor
  if (aqi <= 300) return AQI_COLORS.severe
  return AQI_COLORS.hazardous
}

export function getWindColor(windSpeed: number): string {
  if (windSpeed < 10) return WIND_COLORS.light
  if (windSpeed < 20) return WIND_COLORS.moderate
  if (windSpeed < 30) return WIND_COLORS.strong
  return WIND_COLORS.veryStrong
}
