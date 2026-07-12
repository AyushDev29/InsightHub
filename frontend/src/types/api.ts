/**
 * API Response Types
 * Defines all API response structures for type safety
 */

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface WeatherData {
  id: string
  latitude: number
  longitude: number
  temperature: number
  feels_like: number
  humidity: number
  pressure: number
  wind_speed: number
  wind_direction_deg: number
  wind_direction_label: string
  wind_gust: number
  precipitation: number
  weather_code: number
  weather_description: string
  cloudiness: number
  observation_time: string
  is_day: boolean
  visibility: number
}

export interface HourlyForecast {
  forecast_time: string
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  wind_direction_deg: number
  wind_direction_label: string
  precipitation_probability: number
  precipitation: number
  cloudiness: number
  weather_code: number
  weather_description: string
}

export interface DailyForecast {
  forecast_date: string
  temperature_max: number
  temperature_min: number
  feels_like_max: number
  feels_like_min: number
  precipitation_sum: number
  precipitation_probability: number
  wind_speed_max: number
  wind_gust_max: number
  weather_code: number
  weather_description: string
  sunrise: string
  sunset: string
}

export interface AirQualityData {
  id: string
  latitude: number
  longitude: number
  aqi: number
  aqi_us: number
  aqi_category: string
  health_recommendation: string
  pm2_5: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
  measurement_time: string
}

export interface LocationSearchResult {
  name: string
  country: string
  country_code: string
  state: string
  latitude: number
  longitude: number
  elevation: number
  timezone: string
  population: number
}

export interface HealthCheckResponse {
  status: string
  environment: string
  version: string
}
