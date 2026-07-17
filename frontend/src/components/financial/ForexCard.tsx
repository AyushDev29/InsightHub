/**
 * Forex Card Component
 * Displays exchange rates between currency pairs
 */

import { ArrowRightLeft } from 'lucide-react'

interface ForexCardProps {
  baseSymbol: string
  targetSymbol: string
  rate: number
  onClick?: () => void
  isLoading?: boolean
}

export default function ForexCard({
  baseSymbol,
  targetSymbol,
  rate,
  onClick,
  isLoading,
}: ForexCardProps) {
  if (isLoading) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-dark-600 rounded w-20" />
          <div className="h-6 bg-dark-600 rounded w-24" />
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-primary-500 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-white">{baseSymbol}</div>
          <ArrowRightLeft size={16} className="text-gray-500" />
          <div className="font-semibold text-white">{targetSymbol}</div>
        </div>
        <div className="text-xs text-gray-500">Live</div>
      </div>

      <div className="text-2xl font-bold text-white">
        {rate?.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || 'N/A'}
      </div>

      <div className="text-xs text-gray-400 mt-2">
        1 {baseSymbol} = {rate?.toFixed(2)} {targetSymbol}
      </div>
    </div>
  )
}
