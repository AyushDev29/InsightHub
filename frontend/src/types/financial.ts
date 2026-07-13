/**
 * Financial Intelligence Types
 * TypeScript definitions for all financial data structures
 */

// ─── Market Data ────────────────────────────────────────────────────────────

export interface MarketIndex {
  symbol: string
  name: string
  current_price: number
  change_1h?: number
  change_24h?: number
  change_7d?: number
  timestamp: string
  sparkline?: number[]
}

export interface MarketStatus {
  status: 'OPEN' | 'CLOSED' | 'HOLIDAY'
  next_event: string
  current_time: string
}

// ─── Cryptocurrency ─────────────────────────────────────────────────────────

export interface CryptoData {
  id: string
  symbol: string
  name: string
  image?: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency: number
  price_change_percentage_1h_in_currency: number
  circulating_supply: number
  ath: number
  atl: number
  sparkline_in_7d?: {
    price: number[]
  }
  last_updated: string
}

export interface TrendingCrypto {
  item: {
    id: string
    name: string
    symbol: string
    thumb: string
  }
  market_cap_rank: number
  score: number
}

// ─── Forex ──────────────────────────────────────────────────────────────────

export interface ForexRate {
  base: string
  date: string
  rates: Record<string, number>
}

export interface ForexHistoricalData {
  base: string
  start_date: string
  end_date: string
  rates: Record<string, Record<string, number>>
}

// ─── Commodities ────────────────────────────────────────────────────────────

export interface CommodityPrice {
  name: string
  price: number
  currency: string
  timestamp: string
  change_24h?: number
  change_percentage?: number
}

// ─── Market Sentiment ───────────────────────────────────────────────────────

export interface FearGreedValue {
  value: string
  value_classification: string
  timestamp: string
  time_until_update?: string
}

export interface FearGreedIndex {
  name: string
  data: FearGreedValue[]
  metadata: {
    error?: string
  }
}

// ─── Financial News ─────────────────────────────────────────────────────────

export interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author?: string
  title: string
  description?: string
  url: string
  urlToImage?: string
  publishedAt: string
  content?: string
}

export interface FinancialNewsResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

// ─── Market Overview ────────────────────────────────────────────────────────

export interface MarketOverview {
  indices: Record<string, MarketIndex>
  market_status: MarketStatus
  top_crypto: CryptoData[]
  forex: ForexRate
  fear_greed: FearGreedIndex
  commodities: Record<string, CommodityPrice>
  timestamp: string
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  count: number
  total?: number
  page?: number
  pages?: number
}

// ─── Dashboard State ────────────────────────────────────────────────────────

export interface DashboardState {
  overview: MarketOverview | null
  loading: boolean
  error: string | null
  lastUpdated: string | null
}

// ─── Component Props ────────────────────────────────────────────────────────

export interface MarketCardProps {
  index: MarketIndex
  onClick?: () => void
}

export interface CryptoCardProps {
  crypto: CryptoData
  onClick?: () => void
}

export interface NewsCardProps {
  article: NewsArticle
  onClick?: () => void
}

export interface FearGreedGaugeProps {
  value: number
  label?: string
  size?: 'small' | 'medium' | 'large'
}

// ─── Search & Filter ────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string
  category?: string
  sortBy?: 'name' | 'price' | 'change' | 'volume'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchResult {
  type: 'crypto' | 'stock' | 'forex' | 'commodity'
  data: any
}
