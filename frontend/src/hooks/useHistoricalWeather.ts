/**
 * useHistoricalWeather Hook
 * Fetches historical weather data for a given date range
 */

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'

export function useHistoricalWeather(
  latitude: number,
  longitude: number,
  startDate: Date | null,
  endDate: Date | null
) {
  const enabled = startDate !== null && endDate !== null

  return useQuery({
    queryKey: ['historical-weather', latitude, longitude, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!startDate || !endDate) throw new Error('Start and end dates required')
      
      // Format dates as YYYY-MM-DD
      const start = startDate.toISOString().split('T')[0]
      const end = endDate.toISOString().split('T')[0]

      // @ts-ignore - Accessing private client for historical data
      const response = await apiService.client.get('/weather/history', {
        params: { latitude, longitude, start_date: start, end_date: end },
      })
      return response.data
    },
    enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}
