import { Database } from 'lucide-react'

export default function DataExplorer() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Database className="text-primary-500" size={32} />
        <div>
          <h1 className="text-4xl font-bold text-white">Data Explorer</h1>
          <p className="text-gray-400">Access raw data, apply filters, and export for analysis</p>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-8 text-center">
        <div className="mb-4">
          <div className="inline-block p-3 bg-primary-500/20 rounded-lg mb-4">
            <Database className="text-primary-500" size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Data Explorer Coming Soon</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          Powerful data exploration tool for engineers and analysts. Choose any dataset, apply filters, and export in multiple formats.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          <div className="bg-dark-600/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-primary-400 mb-2">📦 Datasets</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Weather</li>
              <li>• Air Quality</li>
              <li>• Earthquakes</li>
              <li>• Crypto (Phase D)</li>
              <li>• Stocks (Phase D)</li>
            </ul>
          </div>
          <div className="bg-dark-600/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-primary-400 mb-2">📥 Export Formats</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• CSV</li>
              <li>• Excel</li>
              <li>• JSON</li>
              <li>• Power BI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
