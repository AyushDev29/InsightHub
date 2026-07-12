/**
 * ChartTooltip Component
 * Custom tooltip for Recharts visualizations
 * Provides consistent styling across all charts
 */

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    dataKey: string
    stroke: string
    color: string
  }>
  label?: string
  unit?: string
}

export default function ChartTooltip({
  active,
  payload,
  label,
  unit = '',
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-xl">
      {label && (
        <p className="text-gray-300 text-sm font-medium mb-2">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.stroke || entry.color }}
            />
            <span className="text-gray-400 text-xs">{entry.name}:</span>
            <span className="text-white text-xs font-semibold">
              {typeof entry.value === 'number'
                ? entry.value.toFixed(1)
                : entry.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
