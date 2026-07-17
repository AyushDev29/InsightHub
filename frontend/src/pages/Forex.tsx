/**
 * Forex Intelligence Page
 * Currency market analytics with live rates, converter, trends,
 * and currency strength analysis.
 */

import { useState } from 'react'
import { ArrowRightLeft, TrendingUp, BarChart3, Zap } from 'lucide-react'
import ForexCard from '../components/financial/ForexCard'
import { useForexRates } from '../hooks/useFinancialData'

export default function Forex() {
  const [activeTab, setActiveTab] = useState<'rates' | 'converter' | 'analysis'>('rates')
  const [convertFrom, setConvertFrom] = useState('USD')
  const [convertTo, setConvertTo] = useState('INR')
  const [convertAmount, setConvertAmount] = useState(1)

  // API Hooks
  const forexRates = useForexRates('USD', 'INR,EUR,GBP,JPY,AUD,CAD,CHF,CNY')

  // Currency list for converter
  const currencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY']

  // Mock currency strength data
  const currencyStrength = [
    { symbol: 'EUR/USD', strength: 72, trend: 'up', change: 1.5 },
    { symbol: 'GBP/USD', strength: 68, trend: 'up', change: 0.8 },
    { symbol: 'USD/JPY', strength: 65, trend: 'down', change: -0.5 },
    { symbol: 'USD/INR', strength: 58, trend: 'down', change: -1.2 },
    { symbol: 'USD/CAD', strength: 55, trend: 'neutral', change: 0.1 },
  ]

  // Major currency pairs
  const majorPairs = [
    { pair: 'EUR/USD', bid: 1.0850, ask: 1.0852, change: 0.45, spread: 2 },
    { pair: 'GBP/USD', bid: 1.2680, ask: 1.2682, change: -0.25, spread: 2 },
    { pair: 'USD/JPY', bid: 149.85, ask: 149.87, change: 0.85, spread: 2 },
    { pair: 'USD/CHF', bid: 0.8945, ask: 0.8947, change: -0.15, spread: 2 },
    { pair: 'USD/CAD', bid: 1.3625, ask: 1.3627, change: 0.35, spread: 2 },
  ]

  // Calculate conversion
  const convertedAmount = convertAmount * (forexRates.data?.rates?.[convertTo] || 0)

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Forex Intelligence</h1>
          <p className="text-gray-400">Real-time currency market analysis and insights</p>
        </div>
      </div>

      {/* ── Tab Navigation ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-dark-600 overflow-x-auto">
        {[
          { id: 'rates', label: 'Live Rates', icon: TrendingUp },
          { id: 'converter', label: 'Currency Converter', icon: ArrowRightLeft },
          { id: 'analysis', label: 'Market Analysis', icon: BarChart3 },
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

      {/* ── LIVE RATES TAB ──────────────────────────────────────────────── */}
      {activeTab === 'rates' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Major Currency Pairs</h2>
            <div className="grid grid-cols-1 gap-4">
              {majorPairs.map((pair) => (
                <div
                  key={pair.pair}
                  className="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-primary-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{pair.pair}</h3>
                      <p className="text-sm text-gray-500">Bid: {pair.bid.toFixed(4)} | Ask: {pair.ask.toFixed(4)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                      </p>
                      <p className="text-xs text-gray-400">Spread: {pair.spread} pips</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Exchange Rates (USD Base)</h2>
            {forexRates.isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : forexRates.error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400">
                Failed to load exchange rates
              </div>
            ) : forexRates.data?.rates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(forexRates.data.rates).map(([currency, rate]) => (
                  <ForexCard
                    key={currency}
                    baseSymbol="USD"
                    targetSymbol={currency}
                    rate={rate as number}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ── CONVERTER TAB ────────────────────────────────────────────────── */}
      {activeTab === 'converter' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Currency Converter</h2>

            <div className="space-y-6">
              {/* From Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">From</label>
                <div className="flex gap-3">
                  <select
                    value={convertFrom}
                    onChange={(e) => setConvertFrom(e.target.value)}
                    className="flex-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-semibold hover:border-primary-500 transition-colors focus:outline-none focus:border-primary-400"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(parseFloat(e.target.value) || 0)}
                    className="flex-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white text-right font-semibold hover:border-primary-500 transition-colors focus:outline-none focus:border-primary-400"
                  />
                </div>
              </div>

              {/* Conversion Arrow */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setConvertFrom(convertTo)
                    setConvertTo(convertFrom)
                  }}
                  className="p-3 bg-dark-800 border border-dark-600 rounded-lg hover:border-primary-500 transition-colors"
                >
                  <ArrowRightLeft className="text-primary-400" size={24} />
                </button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">To</label>
                <div className="flex gap-3">
                  <select
                    value={convertTo}
                    onChange={(e) => setConvertTo(e.target.value)}
                    className="flex-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-semibold hover:border-primary-500 transition-colors focus:outline-none focus:border-primary-400"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={convertedAmount.toFixed(2)}
                    disabled
                    className="flex-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white text-right font-semibold cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              {/* Result */}
              <div className="bg-dark-800 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Exchange Rate</p>
                <p className="text-2xl font-bold text-primary-400">
                  1 {convertFrom} = {(forexRates.data?.rates?.[convertTo] || 0).toFixed(4)} {convertTo}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ANALYSIS TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Currency Strength Heatmap */}
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Currency Strength Meter</h2>
              <div className="space-y-4">
                {currencyStrength.map((item) => (
                  <div key={item.symbol}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-semibold">{item.symbol}</h3>
                      <span
                        className={`text-sm font-bold ${
                          item.trend === 'up'
                            ? 'text-green-400'
                            : item.trend === 'down'
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} {Math.abs(item.change)}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                        style={{ width: `${item.strength}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Weak</span>
                      <span className="text-white font-semibold">{item.strength}/100</span>
                      <span>Strong</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="space-y-4">
              <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Market Insights</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">USD Index</p>
                    <p className="text-2xl font-bold text-white mt-1">103.45</p>
                    <p className="text-xs text-green-400 mt-1">↑ 0.35% (1W)</p>
                  </div>
                </div>
              </div>

              <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Historical Trends</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-400">
                    <span className="text-white font-semibold">1D Change:</span> +0.45%
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-semibold">1W Change:</span> +1.25%
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-semibold">1M Change:</span> -0.85%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Chart Placeholder */}
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Historical Charts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-800 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-gray-500">Daily Trends Chart</p>
              </div>
              <div className="bg-dark-800 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-gray-500">Weekly Trends Chart</p>
              </div>
              <div className="bg-dark-800 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-gray-500">Monthly Trends Chart</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
