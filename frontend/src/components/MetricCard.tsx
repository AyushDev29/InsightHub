import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ReactNode } from 'react'

interface MetricCardProps {
  icon: ReactNode
  label: string
  value: string
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  secondary?: boolean
}

export default function MetricCard({
  icon,
  label,
  value,
  unit = '',
  trend = 'stable',
  secondary = false,
}: MetricCardProps) {
  const bgColor = secondary ? 'bg-dark-700' : 'bg-dark-800'
  const borderColor = secondary ? 'border-dark-600' : 'border-dark-700'

  const trendIcon = {
    up: <TrendingUp size={16} className="text-green-400" />,
    down: <TrendingDown size={16} className="text-red-400" />,
    stable: <Minus size={16} className="text-gray-400" />,
  }

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-6 card`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
          {icon}
        </div>
        {trendIcon[trend]}
      </div>

      {/* Content */}
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-bold text-white">{value}</p>
          {unit && <p className="text-gray-500 text-sm">{unit}</p>}
        </div>
      </div>
    </div>
  )
}
