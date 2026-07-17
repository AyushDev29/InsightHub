/**
 * Market Status Component
 * Displays if markets are open/closed with countdown
 */

import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { MarketStatus as MarketStatusType } from '../../types/financial'

interface MarketStatusProps {
  status: MarketStatusType | null
  isLoading?: boolean
}

export default function MarketStatus({ status, isLoading }: MarketStatusProps) {
  if (isLoading) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-4 h-4 bg-dark-600 rounded-full" />
          <div className="h-4 bg-dark-600 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Unable to fetch market status</p>
      </div>
    )
  }

  const isOpen = status.status === 'OPEN'
  const isHoliday = status.status === 'HOLIDAY'

  let bgColor = 'bg-red-500/10'
  let borderColor = 'border-red-500/30'
  let textColor = 'text-red-400'
  let statusText = 'Market Closed'
  let icon = <AlertCircle size={20} className="text-red-400" />

  if (isOpen) {
    bgColor = 'bg-green-500/10'
    borderColor = 'border-green-500/30'
    textColor = 'text-green-400'
    statusText = 'Market Open'
    icon = <CheckCircle2 size={20} className="text-green-400" />
  } else if (isHoliday) {
    bgColor = 'bg-amber-500/10'
    borderColor = 'border-amber-500/30'
    textColor = 'text-amber-400'
    statusText = 'Market Holiday'
    icon = <AlertCircle size={20} className="text-amber-400" />
  }

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <div>
          <h3 className={`font-semibold ${textColor}`}>{statusText}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Clock size={14} />
            {status.next_event}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-400 ml-8">
        Last updated: {new Date(status.current_time).toLocaleTimeString('en-IN')}
      </p>
    </div>
  )
}
