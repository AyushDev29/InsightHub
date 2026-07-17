/**
 * Fear & Greed Gauge Component
 * Displays crypto market sentiment as a gauge/meter
 */

import { FearGreedIndex } from '../../types/financial'

interface FearGreedGaugeProps {
  data: FearGreedIndex | null
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
}

export default function FearGreedGauge({
  data,
  size = 'medium',
  isLoading,
}: FearGreedGaugeProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-dark-700 rounded-lg border border-dark-600">
        <div className="animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-dark-700 rounded-lg border border-dark-600">
        <p className="text-gray-400">No fear & greed data available</p>
      </div>
    )
  }

  const currentValue = data.data[0]
  const value = parseInt(currentValue.value)
  const classification = currentValue.value_classification

  // Determine gauge color and emotion
  let emotion = ''
  let color = ''
  let bgGradient = ''

  if (value <= 25) {
    emotion = '😨 Extreme Fear'
    color = '#8b0000' // Dark red
    bgGradient = 'from-red-900'
  } else if (value <= 45) {
    emotion = '😟 Fear'
    color = '#dc2626' // Red
    bgGradient = 'from-red-600'
  } else if (value <= 55) {
    emotion = '😐 Neutral'
    color = '#f59e0b' // Amber
    bgGradient = 'from-amber-500'
  } else if (value <= 75) {
    emotion = '😊 Greed'
    color = '#22c55e' // Green
    bgGradient = 'from-green-500'
  } else {
    emotion = '🤑 Extreme Greed'
    color = '#16a34a' // Dark green
    bgGradient = 'from-green-700'
  }

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  }

  const textSizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  }

  const gaugeSize = sizeClasses[size]
  const textSize = textSizeClasses[size]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className={`${gaugeSize} relative flex items-center justify-center`}>
          {/* Background circle */}
          <svg className="absolute inset-0" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />
            {/* Gauge arc segments */}
            {[
              { start: 0, end: 25, color: '#8b0000' },
              { start: 25, end: 45, color: '#dc2626' },
              { start: 45, end: 55, color: '#f59e0b' },
              { start: 55, end: 75, color: '#22c55e' },
              { start: 75, end: 100, color: '#16a34a' },
            ].map((segment, idx) => {
              const startAngle = (segment.start / 100) * 270 - 135
              const endAngle = (segment.end / 100) * 270 - 135
              const start = polarToCartesian(50, 50, 45, endAngle)
              const end = polarToCartesian(50, 50, 45, startAngle)
              const largeArc = segment.end - segment.start > 50 ? 1 : 0

              return (
                <path
                  key={idx}
                  d={`M ${start.x} ${start.y} A 45 45 0 ${largeArc} 0 ${end.x} ${end.y}`}
                  stroke={segment.color}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.6"
                />
              )
            })}
          </svg>

          {/* Needle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute w-1 origin-bottom transition-transform duration-500"
              style={{
                height: '35px',
                transform: `rotate(${(value / 100) * 270 - 135}deg)`,
                backgroundColor: color,
                bottom: '50%',
              }}
            />
          </div>

          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-dark-900 border-2 border-primary-500" />
          </div>

          {/* Value display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`${textSize} font-bold`} style={{ color }}>
                {value}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Fear & Greed Index</h3>
        <p className="text-lg" style={{ color }}>
          {emotion}
        </p>
        <p className="text-sm text-gray-400">
          {new Date(currentValue.timestamp).toLocaleString('en-IN')}
        </p>
      </div>

      {/* Historical trend */}
      {data.data.length > 1 && (
        <div className="bg-dark-700 rounded-lg p-3 border border-dark-600">
          <h4 className="text-sm font-semibold text-white mb-2">7-Day Trend</h4>
          <div className="flex items-end justify-between gap-1">
            {data.data.slice(0, 7).reverse().map((item, idx) => {
              const v = parseInt(item.value)
              const height = (v / 100) * 20
              let barColor = '#8b0000'
              if (v > 25 && v <= 45) barColor = '#dc2626'
              else if (v > 45 && v <= 55) barColor = '#f59e0b'
              else if (v > 55 && v <= 75) barColor = '#22c55e'
              else if (v > 75) barColor = '#16a34a'

              return (
                <div
                  key={idx}
                  className="flex-1 bg-dark-800 rounded-sm hover:bg-dark-600 transition-colors"
                  style={{
                    height: `${height}px`,
                    minHeight: '4px',
                    backgroundColor: barColor,
                    opacity: 0.7,
                  }}
                  title={`${v} - ${item.value_classification}`}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to convert polar coordinates to cartesian
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees + 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}
