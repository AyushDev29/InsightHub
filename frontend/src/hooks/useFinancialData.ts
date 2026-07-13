/**
 * Financial Data Hook
 * Custom hook for fetching and managing financial data from the backend API
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
  MarketOverview,
  MarketStatus,
  CryptoData,
  ForexRate,
  FearGreedIndex,
  FinancialNewsResponse,
  CommodityPrice,
} from '../types/financial'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// ─── Market Overview ────────────────────────────────────────────────────────

export function useMarketOverview(): UseQueryResult<MarketOverview, Error> {
  return useQuery({
    queryKey: ['financial', 'overview'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/financial/overview`)
      if (!response.ok) throw new Error('Failed to fetch market overview')
      const data = await response.json()
      return data.data
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Data fresh for 30 seconds
  })
}

// ─── Market Status ──────────────────────────────────────────────────────────

export function useMarketStatus(): UseQueryResult<MarketStatus, Error> {
  return useQuery({
    queryKey: ['financial', 'market-status'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/financial/market-status`)
      if (!response.ok) throw new Error('Failed to fetch market status')
      const data = await response.json()
      return data
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

// ─── Top Cryptocurrencies ───────────────────────────────────────────────────

export function useTopCrypto(limit: number = 10): UseQueryResult<CryptoData[], Error> {
  return useQuery({
    queryKey: ['financial', 'crypto', 'top', limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/crypto/top?limit=${limit}`
      )
      if (!response.ok) throw new Error('Failed to fetch top cryptos')
      const data = await response.json()
      return data.data
    },
    refetchInterval: 60000, // Refresh every minute
  })
}

// ─── Specific Cryptocurrency ────────────────────────────────────────────────

export function useCryptoDetail(cryptoId: string): UseQueryResult<CryptoData, Error> {
  return useQuery({
    queryKey: ['financial', 'crypto', cryptoId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/crypto/${cryptoId}`
      )
      if (!response.ok) throw new Error(`Failed to fetch ${cryptoId}`)
      const data = await response.json()
      return data.data
    },
    refetchInterval: 60000,
    enabled: !!cryptoId,
  })
}

// ─── Trending Cryptocurrencies ──────────────────────────────────────────────

export function useTrendingCrypto(): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['financial', 'crypto', 'trending'],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/crypto/trending`
      )
      if (!response.ok) throw new Error('Failed to fetch trending cryptos')
      const data = await response.json()
      return data.data
    },
    refetchInterval: 120000, // Refresh every 2 minutes
  })
}

// ─── Forex Rates ────────────────────────────────────────────────────────────

export function useForexRates(
  base: string = 'USD',
  symbols: string = 'INR,EUR,GBP,JPY'
): UseQueryResult<ForexRate, Error> {
  return useQuery({
    queryKey: ['financial', 'forex', base, symbols],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/forex/rates?base=${base}&symbols=${symbols}`
      )
      if (!response.ok) throw new Error('Failed to fetch forex rates')
      const data = await response.json()
      return data.data
    },
    refetchInterval: 60000,
  })
}

// ─── Historical Forex Data ──────────────────────────────────────────────────

export function useForexHistorical(
  base: string = 'USD',
  symbols: string = 'INR',
  days: number = 30
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['financial', 'forex', 'historical', base, symbols, days],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/forex/historical?base=${base}&symbols=${symbols}&days=${days}`
      )
      if (!response.ok) throw new Error('Failed to fetch forex history')
      const data = await response.json()
      return data.data
    },
    staleTime: 300000, // Historical data fresh for 5 minutes
  })
}

// ─── Commodities ────────────────────────────────────────────────────────────

export function useCommodityPrice(
  commodity: string
): UseQueryResult<CommodityPrice, Error> {
  return useQuery({
    queryKey: ['financial', 'commodities', commodity],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/commodities/${commodity}`
      )
      if (!response.ok) throw new Error(`Failed to fetch ${commodity} price`)
      const data = await response.json()
      return data.data
    },
    refetchInterval: 60000,
    enabled: !!commodity,
  })
}

// ─── All Commodities ────────────────────────────────────────────────────────

export function useAllCommodities(): UseQueryResult<Record<string, CommodityPrice>, Error> {
  return useQuery({
    queryKey: ['financial', 'commodities'],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/commodities`
      )
      if (!response.ok) throw new Error('Failed to fetch commodities')
      const data = await response.json()
      return data.data
    },
    refetchInterval: 60000,
  })
}

// ─── Fear & Greed Index ─────────────────────────────────────────────────────

export function useFearGreedIndex(): UseQueryResult<FearGreedIndex, Error> {
  return useQuery({
    queryKey: ['financial', 'sentiment', 'fear-greed'],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/sentiment/fear-greed`
      )
      if (!response.ok) throw new Error('Failed to fetch Fear & Greed Index')
      const data = await response.json()
      return data.data
    },
    refetchInterval: 300000, // Refresh every 5 minutes (daily update)
  })
}

// ─── Financial News ─────────────────────────────────────────────────────────

export function useFinancialNews(
  category: string = 'business',
  limit: number = 20
): UseQueryResult<FinancialNewsResponse, Error> {
  return useQuery({
    queryKey: ['financial', 'news', category, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/news?category=${category}&limit=${limit}`
      )
      if (!response.ok) throw new Error('Failed to fetch financial news')
      const data = await response.json()
      return data.data
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  })
}

// ─── Search Financial News ──────────────────────────────────────────────────

export function useNewsSearch(
  query: string,
  limit: number = 20
): UseQueryResult<FinancialNewsResponse, Error> {
  return useQuery({
    queryKey: ['financial', 'news', 'search', query, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/news/search?query=${encodeURIComponent(query)}&limit=${limit}`
      )
      if (!response.ok) throw new Error('Failed to search news')
      const data = await response.json()
      return data.data
    },
    staleTime: 600000, // Search results fresh for 10 minutes
    enabled: !!query && query.length >= 2,
  })
}

// ─── Stocks ─────────────────────────────────────────────────────────────────

export function useStockQuote(symbol: string): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['financial', 'stock', 'quote', symbol],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/stock/quote/${symbol}`
      )
      if (!response.ok) throw new Error(`Failed to fetch ${symbol} quote`)
      const data = await response.json()
      return data.data
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: !!symbol,
  })
}

// ─── Stock Timeseries ───────────────────────────────────────────────────────

export function useStockTimeseries(
  symbol: string,
  interval: string = '1day',
  days: number = 30
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['financial', 'stock', 'timeseries', symbol, interval, days],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/stock/timeseries/${symbol}?interval=${interval}&days=${days}`
      )
      if (!response.ok) throw new Error(`Failed to fetch ${symbol} timeseries`)
      const data = await response.json()
      return data.data
    },
    staleTime: 60000, // Data fresh for 1 minute
    enabled: !!symbol,
  })
}

// ─── Stock Technical Indicators ─────────────────────────────────────────────

export function useStockTechnicalIndicators(
  symbol: string,
  indicator: string = 'rsi'
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['financial', 'stock', 'indicators', symbol, indicator],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/stock/indicators/${symbol}?indicator=${indicator}`
      )
      if (!response.ok) throw new Error(`Failed to fetch ${indicator} for ${symbol}`)
      const data = await response.json()
      return data.data
    },
    staleTime: 300000, // Data fresh for 5 minutes
    enabled: !!symbol,
  })
}

// ─── Stock News ─────────────────────────────────────────────────────────────

export function useStockNews(symbol: string, limit: number = 10): UseQueryResult<FinancialNewsResponse, Error> {
  return useQuery({
    queryKey: ['financial', 'stock', 'news', symbol, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/stock/news/${symbol}?limit=${limit}`
      )
      if (!response.ok) throw new Error(`Failed to fetch news for ${symbol}`)
      const data = await response.json()
      return data.data
    },
    refetchInterval: 600000, // Refresh every 10 minutes
    enabled: !!symbol,
  })
}

// ─── Stock Company Details ──────────────────────────────────────────────────

export function useStockCompanyDetails(symbol: string): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['financial', 'stock', 'company', symbol],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/stock/company/${symbol}`
      )
      if (!response.ok) throw new Error(`Failed to fetch company details for ${symbol}`)
      const data = await response.json()
      return data.data
    },
    staleTime: 3600000, // Company data fresh for 1 hour
    enabled: !!symbol,
  })
}

// ─── Module Health ──────────────────────────────────────────────────────────

export function useFinancialHealth(): UseQueryResult<{ status: string }, Error> {
  return useQuery({
    queryKey: ['financial', 'health'],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/health`
      )
      if (!response.ok) throw new Error('Financial module unhealthy')
      return response.json()
    },
    refetchInterval: 600000, // Check every 10 minutes
  })
}
