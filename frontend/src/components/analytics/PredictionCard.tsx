/**
 * PredictionCard Component
 * Individual prediction card showing forecast with confidence level
 */

import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface PredictionCardProps {
  city: string
  metric: string
  currentValue: number
  predictedValue: number
  confidence: number
  timeframe: string
  direction: 'up' | 'down' | 'stable'
  description: string
  recommendation: string
  uncertainty?: number
}

export default function PredictionCard({
  city,
  metric,
  currentValue,
  predictedValue,
  confidence,
  timeframe,
  direction,
  description,
  recommendation,
  uncertainty = 2,
}: PredictionCardProps) {
  const change = predictedValue - currentValue
  const changePercent = ((change / currentValue) * 100).toFixed(1)
  const isImprovement = (metric.includes('AQI') || metric.includes('Temp')) && change < 0 || !metric.includes('AQI') && change > 0

  const directionIcon = direction === 'up' ? '↗️' : direction === 'down' ? '↘️' : '→'
  const confidenceColor = confidence > 80 ? 'text-green-400' : confidence > 60 ? 'text-yellow-400' : 'text-orange-400'
  const confidenceBg = confidence > 80 ? 'bg-green-900/20' : confidence > 60 ? 'bg-yellow-900/20' : 'bg-orange-900/20'

  return (
    <div className="card p-4 space-y-3 border border-dark-600">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-white text-sm">{city} - {metric}</h4>
          <p className="text-xs text-gray-400 mt-1">{timeframe}</p>
        </div>
        <div className={`text-2xl ${confidenceColor} font-bold`}>
          {directionIcon}
        </div>
      </div>

      {/* Prediction Values */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-dark-600">
        <div>
          <p className="text-xs text-gray-500 uppercase">Current</p>
          <p className="text-lg font-bold text-white">{currentValue.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Predicted</p>
          <p className="text-lg font-bold text-primary-400">{predictedValue.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Change</p>
          <p className={`text-lg font-bold ${isImprovement ? 'text-green-400' : 'text-red-400'}`}>
            {changePercent > 0 ? '+' : ''}{changePercent}%
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300">{description}</p>

      {/* Confidence & Uncertainty */}
      <div className={`${confidenceBg} border border-opacity-50 rounded p-3 space-y-2`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-300">Prediction Confidence</p>
          <p className={`text-sm font-bold ${confidenceColor}`}>{confidence}%</p>
        </div>
        <div className="w-full bg-dark-700 rounded h-2 overflow-hidden">
          <div
            className={`h-full ${
              confidence > 80 ? 'bg-green-500' : confidence > 60 ? 'bg-yellow-500' : 'bg-orange-500'
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        {uncertainty && (
          <p className="text-xs text-gray-400">
            Uncertainty range: ±{uncertainty}
          </p>
        )}
      </div>

      {/* Recommendation */}
      <div className="pt-2 border-t border-dark-600">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-300 mb-1">Recommendation</p>
            <p className="text-sm text-gray-300">{recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
