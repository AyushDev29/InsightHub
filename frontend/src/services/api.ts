/**
 * API Service
 * Centralized HTTP client for all API calls
 * Handles authentication, error handling, and request/response transformation
 */

import axios, { AxiosInstance, AxiosError } from 'axios'
import { envConfig, API_ENDPOINTS } from '../types/env'
import {
  ApiResponse,
  WeatherData,
  HourlyForecast,
  DailyForecast,
  AirQualityData,
  LocationSearchResult,
  HealthCheckResponse,
} from '../types/api'

// ─── Phase 4B Types ──────────────────────────────────────────────────────
export interface Country {
  id: string
  name: string
  iso_code: string
  continent: string
  timezone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface City {
  id: string
  name: string
  state: string | null
  latitude: number
  longitude: number
  elevation: number | null
  population: number | null
  is_active: boolean
  is_favorite: boolean
  created_at: string
}

export interface CityDetail extends City {
  country_id: string
  timezone: string | null
  country: Country
}

export interface CurrentDataPoint {
  id: string
  city_id: string
  module: string
  data: Record<string, any>
  fetched_at: number | null
  created_at: string
  updated_at: string
}

export interface GlobalMetrics {
  avg_temperature: number
  avg_aqi: number
  avg_humidity: number
  highest_temperature: number
  lowest_temperature: number
  highest_aqi: number
  lowest_aqi: number
  highest_wind: number
}

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${envConfig.API_BASE_URL}${envConfig.API_V1_PREFIX}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  /**
   * Health check endpoint
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    const response = await this.client.get(API_ENDPOINTS.HEALTH)
    return response.data
  }

  /**
   * Get current weather for a location
   */
  async getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<ApiResponse<WeatherData>> {
    const response = await this.client.get(API_ENDPOINTS.WEATHER.CURRENT, {
      params: { latitude, longitude },
    })
    return response.data
  }

  /**
   * Get hourly forecast
   */
  async getHourlyForecast(
    latitude: number,
    longitude: number,
    hours: number = 48
  ): Promise<ApiResponse<{ forecasts: HourlyForecast[]; count: number }>> {
    const response = await this.client.get(API_ENDPOINTS.WEATHER.HOURLY, {
      params: { latitude, longitude, hours },
    })
    return response.data
  }

  /**
   * Get daily forecast
   */
  async getDailyForecast(
    latitude: number,
    longitude: number,
    days: number = 16
  ): Promise<ApiResponse<{ forecasts: DailyForecast[]; count: number }>> {
    const response = await this.client.get(API_ENDPOINTS.WEATHER.DAILY, {
      params: { latitude, longitude, days },
    })
    return response.data
  }

  /**
   * Get air quality data
   */
  async getAirQuality(
    latitude: number,
    longitude: number
  ): Promise<ApiResponse<AirQualityData>> {
    const response = await this.client.get(API_ENDPOINTS.WEATHER.AIR_QUALITY, {
      params: { latitude, longitude },
    })
    return response.data
  }

  /**
   * Search locations by name
   */
  async searchLocations(
    query: string,
    count: number = 10
  ): Promise<ApiResponse<{ results: LocationSearchResult[]; count: number }>> {
    const response = await this.client.get(API_ENDPOINTS.WEATHER.SEARCH, {
      params: { query, count },
    })
    return response.data
  }

  // ─── Phase 4B: Countries & Cities ──────────────────────────────────────

  /**
   * Get all supported countries
   */
  async getCountries(): Promise<Country[]> {
    const response = await this.client.get('/locations/countries')
    return response.data
  }

  /**
   * Get specific country by ISO code
   */
  async getCountry(isoCode: string): Promise<Country> {
    const response = await this.client.get(`/locations/countries/${isoCode}`)
    return response.data
  }

  /**
   * Get all cities in a country
   */
  async getCitiesByCountry(isoCode: string): Promise<City[]> {
    const response = await this.client.get(`/locations/countries/${isoCode}/cities`)
    return response.data
  }

  /**
   * Get all cities with optional filters
   */
  async getCities(
    countryIsoCode?: string,
    isActive?: boolean,
    isFavorite?: boolean
  ): Promise<City[]> {
    const response = await this.client.get('/locations/cities', {
      params: {
        country_iso_code: countryIsoCode,
        is_active: isActive,
        is_favorite: isFavorite,
      },
    })
    return response.data
  }

  /**
   * Get city details
   */
  async getCity(cityId: string): Promise<CityDetail> {
    const response = await this.client.get(`/locations/cities/${cityId}`)
    return response.data
  }

  /**
   * Toggle city favorite status
   */
  async toggleCityFavorite(cityId: string, isFavorite: boolean): Promise<City> {
    const response = await this.client.put(
      `/locations/cities/${cityId}/favorite`,
      {},
      { params: { is_favorite: isFavorite } }
    )
    return response.data
  }

  /**
   * Get favorite cities for current user
   */
  async getFavoriteCities(countryIsoCode?: string): Promise<City[]> {
    const response = await this.client.get('/locations/cities/favorites', {
      params: { country_iso_code: countryIsoCode },
    })
    return response.data
  }

  /**
   * Get current data for all modules in a city
   */
  async getCurrentDataForCity(cityId: string): Promise<Record<string, CurrentDataPoint>> {
    const response = await this.client.get(`/current/${cityId}`)
    return response.data
  }

  /**
   * Get current data for specific module in a city
   */
  async getCurrentDataForModule(
    cityId: string,
    module: string
  ): Promise<CurrentDataPoint> {
    const response = await this.client.get(`/current/${cityId}/${module}`)
    return response.data
  }

  /**
   * Get all current data for all cities in a country
   */
  async getCurrentDataForCountry(isoCode: string, module?: string): Promise<Record<string, Record<string, CurrentDataPoint>>> {
    const response = await this.client.get(`/current/country/${isoCode}`, {
      params: { module },
    })
    return response.data
  }

  /**
   * Calculate global metrics for a country
   */
  async calculateGlobalMetrics(
    countryData: Record<string, Record<string, CurrentDataPoint>>
  ): Promise<GlobalMetrics> {
    const temps: number[] = []
    const aqis: number[] = []
    const humidities: number[] = []
    const winds: number[] = []

    for (const cityId in countryData) {
      const cityModules = countryData[cityId]

      // Extract weather data
      if (cityModules.weather?.data) {
        const weatherData = cityModules.weather.data
        if (weatherData.temperature != null) temps.push(weatherData.temperature)
        if (weatherData.humidity != null) humidities.push(weatherData.humidity)
        if (weatherData.wind_speed != null) winds.push(weatherData.wind_speed)
      }

      // Extract AQI data
      if (cityModules.aqi?.data) {
        const aqiData = cityModules.aqi.data
        if (aqiData.aqi != null) aqis.push(aqiData.aqi)
      }
    }

    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
    const max = (arr: number[]) => arr.length > 0 ? Math.max(...arr) : 0
    const min = (arr: number[]) => arr.length > 0 ? Math.min(...arr) : 0

    return {
      avg_temperature: avg(temps),
      avg_aqi: avg(aqis),
      avg_humidity: avg(humidities),
      highest_temperature: max(temps),
      lowest_temperature: min(temps),
      highest_aqi: max(aqis),
      lowest_aqi: min(aqis),
      highest_wind: max(winds),
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export for testing purposes
export default apiService
