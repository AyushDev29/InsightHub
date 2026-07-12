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
}

// Export singleton instance
export const apiService = new ApiService()

// Export for testing purposes
export default apiService
