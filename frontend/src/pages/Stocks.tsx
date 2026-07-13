/**
 * Stock Intelligence Platform
 * Professional stock market analysis with search, discovery, and analytics
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, TrendingDown, Star, RefreshCw, X, Loader } from 'lucide-react'

interface Stock {
  symbol: string
  name: string
  exchange: string
  sector: string
  price: number
  change: number
  changePercent: number
  marketCap: string
  volume: number
  pe: number
}

const API_URL = 'http://localhost:8000/api/v1'

export default function Stocks() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [gainers, setGainers] = useState<Stock[]>([])
  const [losers, setLosers] = useState<Stock[]>([])
  const [active, setActive] = useState<Stock[]>([])
  const [trending, setTrending] = useState<Stock[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [marketFilter, setMarketFilter] = useState<'all' | 'india' | 'global'>('all')
  const [activeTab, setActiveTab] = useState<'discover' | 'gainers' | 'losers' | 'active' | 'trending'>('discover')

  // Load market movers on mount
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setInitialLoad(true)
      const [gainersRes, losersRes, activeRes, trendingRes] = await Promise.all([
        fetch(`${API_URL}/financial/market/movers?type=gainers`),
        fetch(`${API_URL}/financial/market/movers?type=losers`),
        fetch(`${API_URL}/financial/market/movers?type=active`),
        fetch(`${API_URL}/financial/market/trending`),
      ])

      const gainersData = await gainersRes.json()
      const losersData = await losersRes.json()
      const activeData = await activeRes.json()
      const trendingData = await trendingRes.json()

      setGainers(gainersData.data || [])
      setLosers(losersData.data || [])
      setActive(activeData.data || [])
      setTrending(trendingData.data || [])
    } catch (error) {
      console.error('Error loading market data:', error)
    } finally {
      setInitialLoad(false)
    }
  }

  // Search stocks
  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/financial/stock/search?q=${encodeURIComponent(query)}&limit=20`)
      const data = await response.json()
      setSearchResults(data.data || [])
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  // Toggle watchlist
  const toggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter(s => s !== symbol))
    } else {
      setWatchlist([...watchlist, symbol])
    }
  }

  // Filter stocks by market
  const filterByMarket = (stocks: Stock[]) => {
    if (marketFilter === 'india') {
      return stocks.filter(s => s.exchange === 'NSE')
    }
    if (marketFilter === 'global') {
      return stocks.filter(s => s.exchange !== 'NSE')
    }
    return stocks
  }

  // Get currency symbol based on exchange
  const getCurrency = (exchange: string) => {
    return exchange === 'NSE' ? '₹' : '$'
  }

  // Stock card component
  const StockCard = ({ stock, compact = false }: { stock: Stock; compact?: boolean }) => {
    const isPositive = stock.changePercent >= 0
    const isWatchlisted = watchlist.includes(stock.symbol)

    return (
      <div 
        onClick={() => navigate(`/finance/stock/${stock.symbol}`)}
        className={`bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-primary-500 transition-all cursor-pointer group ${compact ? 'md:p-3' : ''}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-primary-400">{stock.symbol}</h3>
            <p className="text-xs text-gray-500">{stock.exchange} • {stock.sector}</p>
          </div>
          <button onClick={() => toggleWatchlist(stock.symbol)} className="p-1 hover:bg-dark-600 rounded">
            <Star size={18} className={isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{getCurrency(stock.exchange)}{stock.price.toFixed(2)}</p>
            </div>
            <div className={`text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </div>
          </div>

          {!compact && (
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-dark-600">
              <div>
                <p className="text-gray-400">Vol</p>
                <p className="text-white font-semibold">{(stock.volume / 1000000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-gray-400">P/E</p>
                <p className="text-white font-semibold">{stock.pe}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Stock Intelligence</h1>
          <p className="text-gray-400 mt-2">Professional stock market analysis & discovery</p>
        </div>
        <button onClick={loadInitialData} className="p-2 rounded hover:bg-dark-700 transition-colors">
          <RefreshCw size={24} className="text-primary-400" />
        </button>
      </div>

      {/* Market Filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-400 text-sm">Filter by:</span>
        {['all', 'india', 'global'].map(filter => (
          <button
            key={filter}
            onClick={() => setMarketFilter(filter as any)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              marketFilter === filter
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
            }`}
          >
            {filter === 'all' && '🌍 All Markets'}
            {filter === 'india' && '🇮🇳 Indian (NSE)'}
            {filter === 'global' && '🌎 Global (NASDAQ)'}
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 focus-within:border-primary-400">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search stock by symbol or name... (e.g., RELIANCE, Apple)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="p-1 hover:bg-dark-600 rounded">
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Search Results</h2>
            {loading && <Loader size={20} className="animate-spin text-primary-400" />}
          </div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(stock => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          ) : (
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-8 text-center text-gray-400">
              {loading ? 'Searching...' : `No stocks found for "${searchQuery}"`}
            </div>
          )}
        </div>
      )}

      {/* Market Movers */}
      {!searchQuery && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-dark-600 overflow-x-auto pb-3">
            {['discover', 'gainers', 'losers', 'active', 'trending'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 whitespace-nowrap text-sm md:text-base font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'discover' && '📊 Discover'}
                {tab === 'gainers' && '📈 Top Gainers'}
                {tab === 'losers' && '📉 Top Losers'}
                {tab === 'active' && '🔥 Most Active'}
                {tab === 'trending' && '⭐ Trending'}
              </button>
            ))}
          </div>

          {initialLoad ? (
            <div className="flex justify-center py-12">
              <Loader size={40} className="animate-spin text-primary-400" />
            </div>
          ) : (
            <>
              {/* Discover Tab */}
              {activeTab === 'discover' && (
                <div className="space-y-8">
                  {/* INDIAN STOCKS SECTION */}
                  {(marketFilter === 'all' || marketFilter === 'india') && (
                    <div className="border-t border-dark-600 pt-6">
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span>🇮🇳 Indian Markets (NSE)</span>
                        <span className="text-sm text-gray-400 font-normal">Rupee (₹)</span>
                      </h2>

                      <div>
                        <h3 className="text-lg font-bold text-white mb-4">🏆 Top Gainers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {filterByMarket(gainers).slice(0, 5).map(stock => (
                            <StockCard key={stock.symbol} stock={stock} compact />
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-bold text-white mb-4">📉 Top Losers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {filterByMarket(losers).slice(0, 5).map(stock => (
                            <StockCard key={stock.symbol} stock={stock} compact />
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-bold text-white mb-4">🔥 Most Active</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {filterByMarket(active).slice(0, 5).map(stock => (
                            <StockCard key={stock.symbol} stock={stock} compact />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GLOBAL STOCKS SECTION */}
                  {(marketFilter === 'all' || marketFilter === 'global') && (
                    <div className="border-t border-dark-600 pt-6">
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span>🌎 Global Markets (NASDAQ)</span>
                        <span className="text-sm text-gray-400 font-normal">Dollar ($)</span>
                      </h2>

                      <div>
                        <h3 className="text-lg font-bold text-white mb-4">📈 Top Gainers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {filterByMarket(gainers).slice(0, 5).map(stock => (
                            <StockCard key={stock.symbol} stock={stock} compact />
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-bold text-white mb-4">📉 Top Losers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {filterByMarket(losers).slice(0, 5).map(stock => (
                            <StockCard key={stock.symbol} stock={stock} compact />
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-bold text-white mb-4">🔥 Most Active</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {filterByMarket(active).slice(0, 5).map(stock => (
                            <StockCard key={stock.symbol} stock={stock} compact />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Gainers Tab */}
              {activeTab === 'gainers' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>📈 Top Gainers</span>
                    {marketFilter === 'india' && <span className="text-sm text-gray-400 font-normal">🇮🇳 Indian (NSE)</span>}
                    {marketFilter === 'global' && <span className="text-sm text-gray-400 font-normal">🌎 Global (NASDAQ)</span>}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterByMarket(gainers).map(stock => (
                      <StockCard key={stock.symbol} stock={stock} />
                    ))}
                  </div>
                </div>
              )}

              {/* Losers Tab */}
              {activeTab === 'losers' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>📉 Top Losers</span>
                    {marketFilter === 'india' && <span className="text-sm text-gray-400 font-normal">🇮🇳 Indian (NSE)</span>}
                    {marketFilter === 'global' && <span className="text-sm text-gray-400 font-normal">🌎 Global (NASDAQ)</span>}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterByMarket(losers).map(stock => (
                      <StockCard key={stock.symbol} stock={stock} />
                    ))}
                  </div>
                </div>
              )}

              {/* Active Tab */}
              {activeTab === 'active' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>🔥 Most Active</span>
                    {marketFilter === 'india' && <span className="text-sm text-gray-400 font-normal">🇮🇳 Indian (NSE)</span>}
                    {marketFilter === 'global' && <span className="text-sm text-gray-400 font-normal">🌎 Global (NASDAQ)</span>}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterByMarket(active).map(stock => (
                      <StockCard key={stock.symbol} stock={stock} />
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Tab */}
              {activeTab === 'trending' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>⭐ Trending</span>
                    {marketFilter === 'india' && <span className="text-sm text-gray-400 font-normal">🇮🇳 Indian (NSE)</span>}
                    {marketFilter === 'global' && <span className="text-sm text-gray-400 font-normal">🌎 Global (NASDAQ)</span>}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterByMarket(trending).map(stock => (
                      <StockCard key={stock.symbol} stock={stock} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Watchlist Section */}
          {watchlist.length > 0 && (
            <div className="bg-dark-700/50 border border-primary-500/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">⭐ Watchlist ({watchlist.length})</h3>
              <p className="text-sm text-gray-400 mb-3">Your favorited stocks (stored locally)</p>
              <div className="space-y-6">
                {/* Indian Watchlist */}
                {filterByMarket([...gainers, ...losers, ...active].filter(s => watchlist.includes(s.symbol))).some(s => s.exchange === 'NSE') && (
                  <div>
                    <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                      <span>🇮🇳 Indian Stocks</span>
                      <span className="text-sm text-gray-400">₹</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filterByMarket([...gainers, ...losers, ...active].filter(s => watchlist.includes(s.symbol))).filter(s => s.exchange === 'NSE').map(stock => (
                        <StockCard key={stock.symbol} stock={stock} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Global Watchlist */}
                {filterByMarket([...gainers, ...losers, ...active].filter(s => watchlist.includes(s.symbol))).some(s => s.exchange !== 'NSE') && (
                  <div>
                    <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                      <span>🌎 Global Stocks</span>
                      <span className="text-sm text-gray-400">$</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filterByMarket([...gainers, ...losers, ...active].filter(s => watchlist.includes(s.symbol))).filter(s => s.exchange !== 'NSE').map(stock => (
                        <StockCard key={stock.symbol} stock={stock} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
