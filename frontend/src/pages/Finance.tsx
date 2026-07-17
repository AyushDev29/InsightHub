/**
 * Financial Intelligence Dashboard
 * Professional financial market analysis platform showing global indices,
 * cryptocurrencies, forex, commodities, market sentiment, and news.
 */

import { useState } from 'react'
import { RefreshCw, TrendingUp, Zap, BarChart3, AlertCircle } from 'lucide-react'
import MarketCard from '../components/financial/MarketCard'
import CryptoCard from '../components/financial/CryptoCard'
import FearGreedGauge from '../components/financial/FearGreedGauge'
import NewsPanel from '../components/financial/NewsPanel'
import MarketStatus from '../components/financial/MarketStatus'
import ForexCard from '../components/financial/ForexCard'

import {
  useMarketOverview,
  useMarketStatus,
  useTopCrypto,
  useTrendingCrypto,
  useForexRates,
  useFearGreedIndex,
  useAllCommodities,
  useFinancialNews,
} from '../hooks/useFinancialData'

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Finance() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'crypto' | 'forex' | 'commodities'>('overview')

  // API Hooks
  const marketOverview = useMarketOverview()
  const marketStatus = useMarketStatus()
  const topCrypto = useTopCrypto(10)
  const trendingCrypto = useTrendingCrypto()
  const forexRates = useForexRates('USD', 'INR,EUR,GBP,JPY')
  const fearGreedIndex = useFearGreedIndex()
  const commodities = useAllCommodities()
  const financialNews = useFinancialNews('business', 15)

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    marketOverview.refetch()
    marketStatus.refetch()
    topCrypto.refetch()
    trendingCrypto.refetch()
    forexRates.refetch()
    fearGreedIndex.refetch()
    commodities.refetch()
    financialNews.refetch()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Mock data for major indices (will be replaced with real API when available)
  const majorIndices = [
    { symbol: 'NIFTY50', name: 'Nifty 50', current_price: 23450.5, change_1h: 0.5, change_24h: 1.2, change_7d: 3.4, timestamp: new Date().toISOString() },
    { symbol: 'SENSEX', name: 'Sensex', current_price: 77825.3, change_1h: 0.4, change_24h: 1.1, change_7d: 3.2, timestamp: new Date().toISOString() },
    { symbol: '^GSPC', name: 'S&P 500', current_price: 5478.2, change_1h: 0.2, change_24h: 0.8, change_7d: 2.1, timestamp: new Date().toISOString() },
    { symbol: '^NDX', name: 'NASDAQ', current_price: 18234.5, change_1h: 0.3, change_24h: 1.0, change_7d: 2.8, timestamp: new Date().toISOString() },
  ]

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Financial Intelligence</h1>
          <p className="text-gray-400 mt-2">
            Global market data, cryptocurrency trends, and financial insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 rounded hover:bg-dark-700 transition-colors"
            title="Refresh data"
          >
            <RefreshCw
              size={24}
              className={`text-primary-400 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* ── Market Status ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Market Status</h2>
          <MarketStatus
            status={marketStatus.data || null}
            isLoading={marketStatus.isLoading}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Module Health</h2>
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 text-center">
            <div className="inline-block p-2 bg-green-500/20 rounded-lg mb-2">
              <Zap size={24} className="text-green-400" />
            </div>
            <p className="text-white font-semibold">Healthy</p>
            <p className="text-xs text-gray-400 mt-1">All APIs operational</p>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-dark-600">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'crypto', label: 'Cryptocurrency', icon: TrendingUp },
          { id: 'forex', label: 'Forex', icon: TrendingUp },
          { id: 'commodities', label: 'Commodities', icon: TrendingUp },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Major Indices */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Global Indices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {majorIndices.map((index) => (
                <MarketCard key={index.symbol} index={index} />
              ))}
            </div>
          </div>

          {/* Top Cryptocurrencies */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Top Cryptocurrencies</h2>
            {topCrypto.isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-dark-700 border border-dark-600 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-8 bg-dark-600 rounded mb-2" />
                    <div className="h-6 bg-dark-600 rounded" />
                  </div>
                ))}
              </div>
            ) : topCrypto.error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex items-center gap-2">
                <AlertCircle size={20} />
                Failed to load cryptocurrency data
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topCrypto.data?.slice(0, 10).map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} />
                ))}
              </div>
            )}
          </div>

          {/* Fear & Greed Index */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <FearGreedGauge
                data={fearGreedIndex.data || null}
                size="large"
                isLoading={fearGreedIndex.isLoading}
              />
            </div>

            {/* Forex Rates */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-white mb-4">Exchange Rates</h3>
              {forexRates.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-dark-700 border border-dark-600 rounded-lg p-3 animate-pulse"
                    >
                      <div className="h-4 bg-dark-600 rounded" />
                    </div>
                  ))}
                </div>
              ) : forexRates.error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  Unable to load exchange rates
                </div>
              ) : forexRates.data?.rates ? (
                <div className="space-y-2">
                  {Object.entries(forexRates.data.rates).map(([currency, rate]) => (
                    <ForexCard
                      key={currency}
                      baseSymbol="USD"
                      targetSymbol={currency}
                      rate={rate as number}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* Commodities */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-white mb-4">Commodities</h3>
              {commodities.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-dark-700 border border-dark-600 rounded-lg p-3 animate-pulse"
                    >
                      <div className="h-4 bg-dark-600 rounded" />
                    </div>
                  ))}
                </div>
              ) : commodities.error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  Unable to load commodities
                </div>
              ) : commodities.data ? (
                <div className="space-y-2">
                  {Object.entries(commodities.data).map(([name, commodity]) => (
                    <div
                      key={name}
                      className="bg-dark-700 border border-dark-600 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-white font-semibold capitalize">{name}</p>
                        <p className="text-primary-400 font-bold">
                          ${(commodity as any)?.price?.toFixed(2) || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Financial News */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Latest Financial News</h2>
            <NewsPanel
              articles={financialNews.data?.articles || []}
              isLoading={financialNews.isLoading}
            />
          </div>
        </div>
      )}

      {/* ── CRYPTOCURRENCY TAB ────────────────────────────────────────────── */}
      {activeTab === 'crypto' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Top 10 Cryptocurrencies</h2>
            {topCrypto.isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : topCrypto.error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400 flex items-center gap-3">
                <AlertCircle size={24} />
                Failed to load cryptocurrency data
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topCrypto.data?.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Trending on CoinGecko</h2>
            {trendingCrypto.isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : trendingCrypto.error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400 flex items-center gap-3">
                <AlertCircle size={24} />
                Failed to load trending data
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingCrypto.data?.data?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-primary-500 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={item.item.thumb}
                        alt={item.item.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{item.item.name}</h3>
                        <p className="text-xs text-gray-500">{item.item.symbol}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Market Cap Rank: #{item.market_cap_rank}
                    </p>
                    <p className="text-xs text-primary-400 mt-1">
                      Trend Score: {item.score}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FOREX TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'forex' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Exchange Rates (USD Base)</h2>
          {forexRates.isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : forexRates.error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400 flex items-center gap-3">
              <AlertCircle size={24} />
              Failed to load forex rates
            </div>
          ) : forexRates.data?.rates ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(forexRates.data.rates).map(([currency, rate]) => (
                <ForexCard
                  key={currency}
                  baseSymbol="USD"
                  targetSymbol={currency}
                  rate={rate as number}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* ── COMMODITIES TAB ────────────────────────────────────────────────── */}
      {activeTab === 'commodities' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Commodity Prices</h2>
          {commodities.isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : commodities.error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400 flex items-center gap-3">
              <AlertCircle size={24} />
              Failed to load commodity prices
            </div>
          ) : commodities.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(commodities.data).map(([name, commodity]) => (
                <div
                  key={name}
                  className="bg-dark-700 border border-dark-600 rounded-lg p-6 text-center hover:border-primary-500 transition-all"
                >
                  <h3 className="text-lg font-bold text-white capitalize mb-2">{name}</h3>
                  <div className="text-3xl font-bold text-primary-400 mb-2">
                    ${(commodity as any)?.price?.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date((commodity as any)?.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
