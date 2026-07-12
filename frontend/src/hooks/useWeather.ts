/**
 * useWeather Hook
 * Provides type-safe weather data fetching with caching
 */

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { WeatherData } from '../types/api'

export const useWeather = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ['weather', 'current', latitude, longitude],
    queryFn: async () => {
      const response = await apiService.getCurrentWeather(latitude, longitude)
      return response.data as WeatherData
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export const useHourlyForecast = (latitude: number, longitude: number, hours: number = 48) => {
  return useQuery({
    queryKey: ['weather', 'hourly', latitude, longitude, hours],
    queryFn: async () => {
      const response = await apiService.getHourlyForecast(latitude, longitude, hours)
      return response.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 1 * 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

export const useDailyForecast = (latitude: number, longitude: number, days: number = 16) => {
  return useQuery({
    queryKey: ['weather', 'daily', latitude, longitude, days],
    queryFn: async () => {
      const response = await apiService.getDailyForecast(latitude, longitude, days)
      return response.data
    },
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 3 * 60 * 60 * 1000, // 3 hours
    retry: 2,
  })
}

export const useAirQuality = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ['weather', 'aqi', latitude, longitude],
    queryFn: async () => {
      const response = await apiService.getAirQuality(latitude, longitude)
      return response.data
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

export const useLocationSearch = (query: string, count: number = 10) => {
  return useQuery({
    queryKey: ['locations', 'search', query, count],
    queryFn: async () => {
      const response = await apiService.searchLocations(query, count)
      return response.data
    },
    staleTime: 1 * 60 * 60 * 1000, // 1 hour (locations rarely change)
    gcTime: 3 * 60 * 60 * 1000, // 3 hours
    retry: 2,
    enabled: query.length >= 2, // Only fetch if query is at least 2 characters
  })
}
