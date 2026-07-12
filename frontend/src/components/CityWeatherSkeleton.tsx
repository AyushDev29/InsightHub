export default function CityWeatherSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-dark-700 rounded w-32 mb-2" />
          <div className="h-4 bg-dark-700 rounded w-24" />
        </div>
        <div className="h-12 w-12 bg-dark-700 rounded" />
      </div>

      {/* Temperature */}
      <div className="mb-4">
        <div className="h-8 bg-dark-700 rounded w-24 mb-2" />
        <div className="h-4 bg-dark-700 rounded w-32" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-dark-700">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-4 bg-dark-700 rounded w-16 mb-2" />
            <div className="h-5 bg-dark-700 rounded w-12" />
          </div>
        ))}
      </div>

      {/* AQI */}
      <div className="pt-4 border-t border-dark-700">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-dark-700 rounded w-24" />
          <div className="h-6 bg-dark-700 rounded w-20" />
        </div>
      </div>
    </div>
  )
}
