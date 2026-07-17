/**
 * Crypto Card Component
 * Displays cryptocurrency with price, market cap, volume, and change
 */

import { TrendingUp, TrendingDown } from 'lucide-react'
import { CryptoData } from '../../types/financial'

interface CryptoCardProps {
  crypto: CryptoData
  onClick?: () => void
}

function formatNumber(value: number | undefined, notation: 'compact' | 'standard' = 'compact'): string {
  if (!value) return 'N/A'
  return new Intl.NumberFormat('en-IN', {
    notation,
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(value)
}

export default function CryptoCard({ crypto, onClick }: CryptoCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400'
  const changeBgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10'

  return (
    <div
      onClick={onClick}
      className="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-primary-500 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {crypto.image && (
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h3 className="text-white font-semibold">{crypto.name}</h3>
            <p className="text-xs text-gray-500 uppercase">{crypto.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">#{crypto.market_cap_rank}</p>
        </div>
      </div>

      {/* Price and Change */}
      <div className="mb-3">
        <div className="flex items-end justify-between mb-1">
          <div className="text-2xl font-bold text-white">
            ${crypto.current_price?.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || 'N/A'}
          </div>
          <div className={`flex items-center gap-1 ${changeColor}`}>
            {isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span className="text-sm font-semibold">
              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
              {crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%
            </span>
          </div>
        </div>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-dark-800 rounded p-2">
          <p className="text-gray-400">Market Cap</p>
          <p className="text-white font-semibold">${formatNumber(crypto.market_cap)}</p>
        </div>
        <div className="bg-dark-800 rounded p-2">
          <p className="text-gray-400">Volume</p>
          <p className="text-white font-semibold">${formatNumber(crypto.total_volume)}</p>
        </div>
        <div className="bg-dark-800 rounded p-2">
          <p className="text-gray-400">24H Range</p>
          <p className="text-white font-semibold">
            ${crypto.low_24h?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || 'N/A'} - ${crypto.high_24h?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || 'N/A'}
          </p>
        </div>
        <div className="bg-dark-800 rounded p-2">
          <p className="text-gray-400">ATH</p>
          <p className="text-white font-semibold">${crypto.ath?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || 'N/A'}</p>
        </div>
      </div>

      {/* Supply */}
      <div className="text-xs text-gray-400">
        <p>Supply: {formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}</p>
      </div>
    </div>
  )
}
