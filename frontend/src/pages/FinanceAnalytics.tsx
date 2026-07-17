/**
 * Financial Analytics Page
 * Advanced financial data science with market trends, correlation analysis,
 * volatility metrics, risk scoring, pattern recognition, and ML predictions.
 */

import { useState } from 'react'
import { BarChart3, TrendingUp, AlertTriangle, Zap, Radar, Zap as Spark } from 'lucide-react'

export default function FinanceAnalytics() {
  const [activeTab, setActiveTab] = useState<'trends' | 'correlation' | 'volatility' | 'risk' | 'patterns' | 'predictions'>('trends')
  const [selectedSector, setSelectedSector] = useState<'all' | 'tech' | 'finance' | 'energy' | 'healthcare'>('all')
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m' | '3m' | '6m' | '1y'>('1m')

  // Mock sectors data
  const sectors = [
    { id: 'all', name: 'All Markets', performance: 1.2, volatility: 14.5 },
    { id: 'tech', name: 'Technology', performance: 2.5, volatility: 18.3 },
    { id: 'finance', name: 'Financial', performance: 0.8, volatility: 12.1 },
    { id: 'energy', name: 'Energy', performance: 3.2, volatility: 22.5 },
    { id: 'healthcare', name: 'Healthcare', performance: -0.5, volatility: 10.2 },
  ]

  // Mock market trends data
  const marketTrends = [
    { metric: 'Global Indices', trend: 'up', change: 1.2, value: '+1.2%' },
    { metric: 'Emerging Markets', trend: 'up', change: 2.8, value: '+2.8%' },
    { metric: 'Commodities', trend: 'up', change: 1.5, value: '+1.5%' },
    { metric: 'Bonds', trend: 'down', change: -0.8, value: '-0.8%' },
  ]

  // Mock correlation matrix
  const correlationData = [
    ['1.00', '0.85', '0.62', '-0.45', '0.38'],
    ['0.85', '1.00', '0.58', '-0.52', '0.42'],
    ['0.62', '0.58', '1.00', '-0.28', '0.65'],
    ['-0.45', '-0.52', '-0.28', '1.00', '-0.35'],
    ['0.38', '0.42', '0.65', '-0.35', '1.00'],
  ]

  const correlationLabels = ['Stocks', 'Bonds', 'Commodities', 'USD', 'Crypto']

  // Mock volatility data
  const volatilityMetrics = [
    { asset: 'S&P 500', vix: 18.5, trend: 'up', change: 2.3 },
    { asset: 'Nasdaq', vix: 22.3, trend: 'up', change: 3.1 },
    { asset: 'Crypto', vix: 48.5, trend: 'down', change: -2.5 },
    { asset: 'Bonds', vix: 12.1, trend: 'neutral', change: 0.2 },
  ]

  // Mock risk scores
  const riskScores = [
    { category: 'Market Risk', score: 65, level: 'High' },
    { category: 'Credit Risk', score: 42, level: 'Medium' },
    { category: 'Liquidity Risk', score: 38, level: 'Medium' },
    { category: 'Geopolitical Risk', score: 58, level: 'High' },
    { category: 'Inflation Risk', score: 45, level: 'Medium' },
  ]

  // Mock pattern recognition
  const patterns = [
    { name: 'Golden Cross (Tech)', confidence: 87, signal: 'BUY', date: '2 days ago' },
    { name: 'Death Cross (Energy)', confidence: 92, signal: 'SELL', date: 'Today' },
    { name: 'Fibonacci Bounce (Commodities)', confidence: 78, signal: 'BUY', date: '1 day ago' },
    { name: 'Head & Shoulders (Bonds)', confidence: 81, signal: 'SELL', date: '3 days ago' },
  ]

  // Mock ML predictions
  const predictions = [
    { asset: 'S&P 500', predicted7d: 5480, confidence: 72, trend: 'up' },
    { asset: 'Gold', predicted7d: 2125, confidence: 65, trend: 'up' },
    { asset: 'Crude Oil', predicted7d: 78.50, confidence: 58, trend: 'neutral' },
    { asset: 'USD Index', predicted7d: 104.25, confidence: 61, trend: 'up' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Financial Analytics</h1>
          <p className="text-gray-400">
            Advanced market analysis, risk metrics, and AI/ML predictions
          </p>
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sector Selector */}
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-300 mb-3">Sector</label>
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id as any)}
                className={`px-3 py-2 rounded text-sm transition-all ${
                  selectedSector === sector.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-600'
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-300 mb-3">Timeframe</label>
          <div className="flex flex-wrap gap-2">
            {['1d', '1w', '1m', '3m', '6m', '1y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-3 py-2 rounded text-sm transition-all ${
                  timeframe === tf
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-dark-600 overflow-x-auto">
        {[
          { id: 'trends', label: 'Market Trends', icon: TrendingUp },
          { id: 'correlation', label: 'Correlation', icon: Radar },
          { id: 'volatility', label: 'Volatility', icon: Zap },
          { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
          { id: 'patterns', label: 'Patterns', icon: Spark },
          { id: 'predictions', label: 'ML Predictions', icon: BarChart3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === id
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* ── MARKET TRENDS TAB ────────────────────────────────────────────── */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Cards */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Market Trends</h2>
            <div className="space-y-3">
              {marketTrends.map((trend) => (
                <div key={trend.metric} className="bg-dark-700 border border-dark-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{trend.metric}</span>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${trend.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.trend === 'up' ? '↑' : '↓'} {trend.value}
                      </p>
                      <p className="text-xs text-gray-500">24h change</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Performance */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Sector Performance</h2>
            <div className="space-y-3">
              {sectors.map((sector) => (
                <div key={sector.id} className="bg-dark-700 border border-dark-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{sector.name}</span>
                    <span className={sector.performance >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Volatility: {sector.volatility}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CORRELATION TAB ─────────────────────────────────────────────── */}
      {activeTab === 'correlation' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Asset Correlation Matrix</h2>
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gray-400 p-2">Asset</th>
                  {correlationLabels.map((label) => (
                    <th key={label} className="text-center text-gray-400 p-2">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlationData.map((row, idx) => (
                  <tr key={idx} className="border-t border-dark-600">
                    <td className="text-left text-white font-semibold p-2">{correlationLabels[idx]}</td>
                    {row.map((value, cidx) => {
                      const numValue = parseFloat(value)
                      let bgColor = 'bg-dark-800'
                      if (numValue > 0.7) bgColor = 'bg-green-500/30'
                      else if (numValue > 0.4) bgColor = 'bg-blue-500/30'
                      else if (numValue < -0.4) bgColor = 'bg-red-500/30'

                      return (
                        <td key={cidx} className={`text-center p-2 ${bgColor} rounded`}>
                          <span className="text-white font-semibold">{value}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Correlation Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-400 mb-4">Positive Correlations</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-300">• Stocks & Bonds: 0.85</li>
                <li className="text-gray-300">• Stocks & Commodities: 0.62</li>
                <li className="text-gray-300">• Commodities & Crypto: 0.65</li>
              </ul>
            </div>

            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-400 mb-4">Negative Correlations</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-300">• Stocks & USD: -0.45</li>
                <li className="text-gray-300">• Bonds & USD: -0.52</li>
                <li className="text-gray-300">• Crypto & USD: -0.35</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── VOLATILITY TAB ──────────────────────────────────────────────── */}
      {activeTab === 'volatility' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Volatility Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volatilityMetrics.map((metric) => (
              <div key={metric.asset} className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{metric.asset}</h3>
                    <p className="text-2xl font-bold text-primary-400 mt-2">{metric.vix}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      metric.trend === 'up'
                        ? 'text-red-400'
                        : metric.trend === 'down'
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.change)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {metric.trend === 'up' ? 'Increasing volatility' : metric.trend === 'down' ? 'Decreasing volatility' : 'Stable'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RISK ANALYSIS TAB ───────────────────────────────────────────── */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Risk Assessment</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {riskScores.map((risk) => (
                <div key={risk.category} className="bg-dark-700 border border-dark-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{risk.category}</span>
                    <span
                      className={`text-sm font-bold ${
                        risk.level === 'High'
                          ? 'text-red-400'
                          : risk.level === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {risk.level}
                    </span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        risk.level === 'High'
                          ? 'bg-red-500'
                          : risk.level === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${risk.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Risk Score: {risk.score}/100</p>
                </div>
              ))}
            </div>

            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Risk Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Overall Risk Level</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">MEDIUM-HIGH</p>
                </div>
                <div className="bg-dark-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Primary Concerns</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Market volatility elevated</li>
                    <li>• Geopolitical tensions rising</li>
                    <li>• Inflation pressures persist</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PATTERN RECOGNITION TAB ─────────────────────────────────────── */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">Detected Trading Patterns</h2>
          <div className="grid grid-cols-1 gap-4">
            {patterns.map((pattern, idx) => (
              <div key={idx} className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{pattern.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{pattern.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      pattern.signal === 'BUY'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {pattern.signal}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Confidence</p>
                    <div className="w-full bg-dark-800 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${pattern.confidence}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white font-semibold">{pattern.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ML PREDICTIONS TAB ──────────────────────────────────────────── */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4">AI/ML Price Predictions (7 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((pred) => (
              <div key={pred.asset} className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">{pred.asset}</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Predicted Price</p>
                    <p className="text-2xl font-bold text-primary-400 mt-1">${pred.predicted7d}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Model Confidence</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">{pred.confidence}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-dark-800 rounded">
                  <span
                    className={`text-sm font-semibold ${
                      pred.trend === 'up'
                        ? 'text-green-400'
                        : pred.trend === 'down'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {pred.trend === 'up' ? '↑ Bullish' : pred.trend === 'down' ? '↓ Bearish' : '→ Neutral'}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Based on historical patterns, technical analysis, and market sentiment
                </p>
              </div>
            ))}
          </div>

          {/* ML Model Info */}
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Model Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400">Algorithm</p>
                <p className="text-white font-semibold mt-2">LSTM Neural Network</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Accuracy</p>
                <p className="text-white font-semibold mt-2">78.5%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Data Sources</p>
                <p className="text-white font-semibold mt-2">15+ APIs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
