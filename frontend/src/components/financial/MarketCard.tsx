/**
 * Market Card Component
 * Displays market index with price, change percentage, and sparkline
 */

import { TrendingUp, TrendingDown } from 'lucide-react'
import { MarketIndex } from '../../types/financial'

interface MarketCardProps {
  index: MarketIndex
  onClick?: () => void
}

export default function MarketCard({ index, onClick }: MarketCardProps) {
  const isPositive = (index.change_24h ?? 0) >= 0
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400'
  const changeBgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10'

  return (
    <div
      onClick={onClick}
      className="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-primary-500 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">{index.name}</h3>
          <p className="text-xs text-gray-500">{index.symbol}</p>
        </div>
        {isPositive ? (
          <TrendingUp size={18} className="text-green-400" />
        ) : (
          <TrendingDown size={18} className="text-red-400" />
        )}
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-white">
          {typeof index.current_price === 'number'
            ? index.current_price.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 'N/A'}
        </div>
      </div>

      {/* Changes */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: '1H', value: index.change_1h },
          { label: '24H', value: index.change_24h },
          { label: '7D', value: index.change_7d },
        ].map((change) => (
          <div
            key={change.label}
            className={`text-center p-1.5 rounded ${changeBgColor}`}
          >
            <p className="text-xs text-gray-400 mb-0.5">{change.label}</p>
            <p className={`text-sm font-semibold ${changeColor}`}>
              {change.value !== undefined ? `${change.value > 0 ? '+' : ''}${change.value.toFixed(2)}%` : 'N/A'}
            </p>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      {index.sparkline && index.sparkline.length > 0 && (
        <div className="h-8 opacity-60 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              points={index.sparkline
                .map((v, i) => `${(i / (index.sparkline.length - 1)) * 100},${20 - (v / Math.max(...index.sparkline)) * 20}`)
                .join(' ')}
              fill="none"
              stroke={isPositive ? '#22c55e' : '#ef4444'}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
