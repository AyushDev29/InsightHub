/**
 * ConfidenceGauge Component
 * Visual gauge showing prediction confidence levels
 */

interface ConfidenceGaugeProps {
  value: number // 0-100
  label?: string
  size?: 'small' | 'medium' | 'large'
}

export default function ConfidenceGauge({
  value,
  label = 'Confidence',
  size = 'medium',
}: ConfidenceGaugeProps) {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-40 h-40',
  }

  const textSizes = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-lg',
  }

  const labelSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }

  const getColor = () => {
    if (value >= 80) return '#10b981' // green
    if (value >= 60) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  const getGradientStop = (value / 100) * 100

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gauge Circle */}
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#374151"
            strokeWidth="8"
            opacity="0.3"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeDasharray={`${(getGradientStop / 100) * 251.2} 251.2`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className={`font-bold ${textSizes[size]}`} style={{ color: getColor() }}>
            {value}%
          </p>
          <p className={`text-gray-400 ${labelSizes[size]}`}>{label}</p>
        </div>
      </div>

      {/* Status label */}
      <div className="text-center">
        <p className="text-xs font-medium text-gray-400">
          {value >= 80 ? '✓ High Confidence' : value >= 60 ? '⚠ Medium Confidence' : '✗ Low Confidence'}
        </p>
      </div>
    </div>
  )
}
