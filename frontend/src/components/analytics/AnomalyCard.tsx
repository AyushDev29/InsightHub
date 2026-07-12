/**
 * AnomalyCard Component
 * Individual anomaly alert card showing anomaly details and context
 */

import { AlertTriangle, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react'

interface AnomalyCardProps {
  city: string
  metric: string
  currentValue: number
  normalRange: { min: number; max: number }
  severity: 'warning' | 'critical'
  description: string
  suggestion: string
  timestamp: string
}

export default function AnomalyCard({
  city,
  metric,
  currentValue,
  normalRange,
  severity,
  description,
  suggestion,
  timestamp,
}: AnomalyCardProps) {
  const isAboveRange = currentValue > normalRange.max
  const deviation = isAboveRange
    ? currentValue - normalRange.max
    : normalRange.min - currentValue
  const deviationPercent = ((deviation / ((normalRange.max + normalRange.min) / 2)) * 100).toFixed(1)

  const bgColor = severity === 'critical' ? 'bg-red-900/20' : 'bg-orange-900/20'
  const borderColor = severity === 'critical' ? 'border-red-700' : 'border-orange-700'
  const headerColor = severity === 'critical' ? 'text-red-400' : 'text-orange-400'
  const badgeColor = severity === 'critical' ? 'bg-red-600' : 'bg-orange-600'

  const Icon = severity === 'critical' ? AlertTriangle : AlertCircle
  const TrendIcon = isAboveRange ? TrendingUp : TrendingDown

  return (
    <div className={`card ${bgColor} border ${borderColor} p-4 space-y-3`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={headerColor} size={20} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold ${headerColor}`}>{city} - {metric}</h4>
              <span
                className={`${badgeColor} text-white text-xs font-bold px-2 py-1 rounded`}
              >
                {severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-dark-600">
        <div>
          <p className="text-xs text-gray-500 uppercase">Current</p>
          <div className="flex items-center gap-1">
            <p className={`text-lg font-bold ${headerColor}`}>
              {currentValue.toFixed(1)}
            </p>
            <TrendIcon size={16} className={headerColor} />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Normal Range</p>
          <p className="text-sm text-gray-300">
            {normalRange.min.toFixed(0)} - {normalRange.max.toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Deviation</p>
          <p className={`text-lg font-bold ${headerColor}`}>
            +{deviationPercent}%
          </p>
        </div>
      </div>

      {/* Suggestion */}
      <div className="pt-2 border-t border-dark-600">
        <p className="text-xs text-gray-500 uppercase mb-1">💡 Suggestion</p>
        <p className="text-sm text-gray-300">{suggestion}</p>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-gray-500 pt-1">
        Detected: {timestamp}
      </div>
    </div>
  )
}
