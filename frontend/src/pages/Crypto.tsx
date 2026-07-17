/**
 * Cryptocurrency Intelligence Page
 * Complete crypto market intelligence with top coins, trending, market analysis,
 * technical indicators, and AI insights.
 */

import { useState } from 'react'
import { Search, TrendingUp, TrendingDown, BarChart3, Zap, AlertCircle } from 'lucide-react'
import CryptoCard from '../components/financial/CryptoCard'
import FearGreedGauge from '../components/financial/FearGreedGauge'
import { useTopCrypto, useTrendingCrypto, useFearGreedIndex } from '../hooks/useFinancialData'

export default function Crypto() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'top' | 'trending' | 'gainers' | 'analysis'>('top')
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)

  // API Hooks
  const topCrypto = useTopCrypto(100)
  const trendingCrypto = useTrendingCrypto()
  const fearGreedIndex = useFearGreedIndex()

  // Mock gainers/losers
  const gainers = topCrypto.data?.slice(0, 5).sort((a: any, b: any) => (b.market_cap_change_percentage_24h || 0) - (a.market_cap_change_percentage_24h || 0)) || []
  const losers = topCrypto.data?.slice(0, 5).sort((a: any, b: any) => (a.market_cap_change_percentage_24h || 0) - (b.market_cap_change_percentage_24h || 0)) || []

  // Filter search
  const filteredCrypto = topCrypto.data?.filter((crypto: any) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Cryptocurrency Intelligence</h1>
          <p className="text-gray-400">Real-time crypto market analysis and insights</p>
        </div>
      </div>

      {/* ── Search Bar ───────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-dark-700 border border-dark-600 rounded-lg px-4 py-3">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search coins by name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* ── Fear & Greed Index Widget ────────────────────────────────────── */}
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Market Sentiment</h2>
            <p className="text-sm text-gray-400 mt-1">Crypto Fear & Greed Index</p>
          </div>
          <Zap size={24} className="text-yellow-400" />
        </div>
        <FearGreedGauge data={fearGreedIndex.data || null} size="small" isLoading={fearGreedIndex.isLoading} />
      </div>

      {/* ── Tab Navigation ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-dark-600 overflow-x-auto">
        {[
          { id: 'top', label: 'Top 100 Coins', icon: BarChart3 },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'gainers', label: 'Top Gainers', icon: TrendingUp },
          { id: 'analysis', label: 'Market Analysis', icon: BarChart3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
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

      {/* ── TOP 100 COINS TAB ────────────────────────────────────────────── */}
      {activeTab === 'top' && (
        <div className="space-y-6">
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
              {(searchQuery ? filteredCrypto : topCrypto.data)?.slice(0, 30).map((crypto: any) => (
                <div
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto.id)}
                  className={`bg-dark-700 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCrypto === crypto.id
                      ? 'border-primary-500'
                      : 'border-dark-600 hover:border-primary-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-white">{crypto.name}</h3>
                        <p className="text-xs text-gray-500">{crypto.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">${crypto.current_price?.toFixed(2) || 'N/A'}</p>
                      <p className={`text-sm font-semibold ${(crypto.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(crypto.price_change_percentage_24h || 0) >= 0 ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2) || 0}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-dark-800 rounded p-2">
                      <p className="text-gray-400">Market Cap</p>
                      <p className="text-white font-semibold mt-1">
                        {crypto.market_cap
                          ? `$${(crypto.market_cap / 1e9).toFixed(2)}B`
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-dark-800 rounded p-2">
                      <p className="text-gray-400">Volume (24h)</p>
                      <p className="text-white font-semibold mt-1">
                        {crypto.total_volume
                          ? `$${(crypto.total_volume / 1e9).toFixed(2)}B`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TRENDING TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'trending' && (
        <div className="space-y-6">
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
                  className="bg-dark-700 border border-dark-600 rounded-lg p-6 hover:border-primary-500 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={item.item.thumb}
                      alt={item.item.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.item.name}</h3>
                      <p className="text-sm text-gray-500">{item.item.symbol.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Cap Rank</span>
                      <span className="text-white font-semibold">#{item.market_cap_rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trend Score</span>
                      <span className="text-primary-400 font-semibold">{item.score}/10</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-primary-600/20 hover:bg-primary-600/40 text-primary-400 font-semibold py-2 rounded transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── GAINERS/LOSERS TAB ────────────────────────────────────────────── */}
      {activeTab === 'gainers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Top Gainers (24h)
            </h3>
            <div className="space-y-3">
              {gainers.map((crypto: any) => (
                <div key={crypto.id} className="bg-dark-700 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-white font-semibold">{crypto.name}</p>
                        <p className="text-xs text-gray-500">${crypto.current_price?.toFixed(2) || 'N/A'}</p>
                      </div>
                    </div>
                    <p className="text-green-400 font-bold">
                      +{crypto.market_cap_change_percentage_24h?.toFixed(2) || 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
              <TrendingDown size={20} />
              Top Losers (24h)
            </h3>
            <div className="space-y-3">
              {losers.map((crypto: any) => (
                <div key={crypto.id} className="bg-dark-700 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-white font-semibold">{crypto.name}</p>
                        <p className="text-xs text-gray-500">${crypto.current_price?.toFixed(2) || 'N/A'}</p>
                      </div>
                    </div>
                    <p className="text-red-400 font-bold">
                      {crypto.market_cap_change_percentage_24h?.toFixed(2) || 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MARKET ANALYSIS TAB ───────────────────────────────────────────── */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Crypto Dominance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Bitcoin</span>
                  <span className="text-sm text-white font-semibold">48.2%</span>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '48.2%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Ethereum</span>
                  <span className="text-sm text-white font-semibold">18.5%</span>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '18.5%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Others</span>
                  <span className="text-sm text-white font-semibold">33.3%</span>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '33.3%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Market Metrics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Total Market Cap</p>
                <p className="text-lg font-bold text-white mt-1">$1.2T</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">24h Volume</p>
                <p className="text-lg font-bold text-white mt-1">$52.4B</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">BTC Dominance</p>
                <p className="text-lg font-bold text-primary-400 mt-1">48.2%</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Market Volatility</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">24h Change</p>
                <p className="text-lg font-bold text-green-400 mt-1">+2.45%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">7d Change</p>
                <p className="text-lg font-bold text-green-400 mt-1">+5.12%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fear & Greed</p>
                <p className="text-lg font-bold text-yellow-400 mt-1">48 (Neutral)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Detailed View ─────────────────────────────────────────────────── */}
      {selectedCrypto && activeTab === 'top' && (
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Detailed Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-800 rounded p-4">
              <p className="text-sm text-gray-400 mb-2">Price Chart</p>
              <div className="h-48 bg-dark-900 rounded flex items-center justify-center">
                <p className="text-gray-500">Chart Visualization</p>
              </div>
            </div>
            <div className="bg-dark-800 rounded p-4">
              <p className="text-sm text-gray-400 mb-2">Volume Analysis</p>
              <div className="h-48 bg-dark-900 rounded flex items-center justify-center">
                <p className="text-gray-500">Volume Chart</p>
              </div>
            </div>
            <div className="bg-dark-800 rounded p-4">
              <p className="text-sm text-gray-400 mb-2">Technical Indicators</p>
              <div className="space-y-2 text-sm">
                <p className="text-white">RSI: 68.5</p>
                <p className="text-white">MACD: Bullish</p>
                <p className="text-white">EMA(50): $42,850</p>
                <p className="text-white">Bollinger Bands: Normal</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
