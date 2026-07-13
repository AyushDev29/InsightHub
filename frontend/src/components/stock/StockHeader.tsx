/**
 * Professional Stock Header Component
 * Premium financial analytics header inspired by TradingView/Yahoo Finance
 */

import { Star, Share2, MoreVertical, TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'
import { useState } from 'react'

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

interface StockHeaderProps {
  stock: Stock
  watchlist: boolean
  onWatchlistToggle: () => void
  onRefresh: () => void
}

export default function StockHeader({ stock, watchlist, onWatchlistToggle, onRefresh }: StockHeaderProps) {
  const isPositive = stock.changePercent >= 0
  const [showMenu, setShowMenu] = useState(false)
  
  const getCurrency = (exchange: string) => exchange === 'NSE' ? '₹' : '$'
  const currency = getCurrency(stock.exchange)

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">{stock.symbol[0]}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{stock.symbol}</h1>
            <p className="text-sm text-gray-400">{stock.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={onRefresh} className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
            <Target size={20} className="text-primary-400" />
          </button>
          <button onClick={onWatchlistToggle} className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
            <Star size={20} className={watchlist ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
          </button>
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-dark-700 rounded-lg transition-colors relative">
            <MoreVertical size={20} className="text-gray-400" />
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-600 flex items-center gap-2">
                  <Share2 size={16} /> Share
                </button>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Price Hero Section */}
      <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Price */}
          <div>
            <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Current Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">{currency}{stock.price.toFixed(2)}</span>
              <span className="text-sm text-gray-400">{stock.exchange}</span>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              <div className={`flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                <div>
                  <p className="text-2xl font-bold">{isPositive ? '+' : ''}{stock.change.toFixed(2)}</p>
                  <p className="text-sm">{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}% Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-600">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Market Cap</p>
              <p className="text-xl font-bold text-white">{stock.marketCap}</p>
            </div>
            <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-600">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Volume (M)</p>
              <p className="text-xl font-bold text-white">{(stock.volume / 1000000).toFixed(1)}</p>
            </div>
            <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-600">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">P/E Ratio</p>
              <p className="text-xl font-bold text-white">{stock.pe.toFixed(1)}</p>
            </div>
            <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-600">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Sector</p>
              <p className="text-xl font-bold text-white">{stock.sector}</p>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="mt-6 pt-6 border-t border-dark-600 flex items-center gap-2 text-sm text-gray-400">
          <AlertCircle size={16} className="text-primary-400" />
          <span>Data updates automatically every 60 seconds</span>
        </div>
      </div>
    </div>
  )
}
