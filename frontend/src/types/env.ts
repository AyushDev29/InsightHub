/**
 * Environment Variables Type Definition
 * Ensures type-safe access to environment variables
 */

export interface EnvConfig {
  API_BASE_URL: string
  API_V1_PREFIX: string
}

export const envConfig: EnvConfig = {
  API_BASE_URL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000',
  API_V1_PREFIX: (import.meta as any).env.VITE_API_V1_PREFIX || '/api/v1',
}

export const API_ENDPOINTS = {
  HEALTH: '/health',
  WEATHER: {
    CURRENT: '/weather/current',
    HOURLY: '/weather/hourly',
    DAILY: '/weather/daily',
    HISTORY: '/weather/history',
    AIR_QUALITY: '/weather/air-quality',
    SEARCH: '/weather/search',
  },
} as const
