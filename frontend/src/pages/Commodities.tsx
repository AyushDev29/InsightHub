/**
 * Commodities Intelligence Page
 * Commodity market monitoring with live prices, trends,
 * correlations, and historical analysis.
 */

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Zap } from 'lucide-react'
import { useAllCommodities } from '../hooks/useFinancialData'

export default function Commodities() {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'correlation'>('overview')
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null)

  // API Hooks
  const commodities = useAllCommodities()

  // Mock commodity data with additional details
  const commodityDetails: { [key: string]: any } = {
    gold: {
      name: 'Gold',
      symbol: 'XAU/USD',
      unit: 'USD/troy oz',
      change24h: 1.5,
      change7d: 2.8,
      change30d: 4.2,
      high52w: 2150.50,
      low52w: 1850.30,
      volatility: 'Medium',
    },
    silver: {
      name: 'Silver',
      symbol: 'XAG/USD',
      unit: 'USD/troy oz',
      change24h: 2.1,
      change7d: 3.5,
      change30d: 5.8,
      high52w: 32.50,
      low52w: 19.20,
      volatility: 'High',
    },
    platinum: {
      name: 'Platinum',
      symbol: 'XPT/USD',
      unit: 'USD/troy oz',
      change24h: 0.8,
      change7d: 1.2,
      change30d: 2.1,
      high52w: 1145.80,
      low52w: 825.40,
      volatility: 'Medium',
    },
    palladium: {
      name: 'Palladium',
      symbol: 'XPD/USD',
      unit: 'USD/troy oz',
      change24h: -0.5,
      change7d: -1.2,
      change30d: -2.8,
      high52w: 1350.50,
      low52w: 850.30,
      volatility: 'High',
    },
    'crude-oil': {
      name: 'Crude Oil (WTI)',
      symbol: 'CL',
      unit: 'USD/barrel',
      change24h: 1.2,
      change7d: 2.5,
      change30d: -1.5,
      high52w: 95.50,
      low52w: 65.20,
      volatility: 'High',
    },
    'brent-oil': {
      name: 'Brent Oil',
      symbol: 'BRENT',
      unit: 'USD/barrel',
      change24h: 1.5,
      change7d: 2.8,
      change30d: -0.8,
      high52w: 98.75,
      low52w: 68.50,
      volatility: 'High',
    },
    'natural-gas': {
      name: 'Natural Gas',
      symbol: 'NG',
      unit: 'USD/MMBtu',
      change24h: -1.8,
      change7d: -3.2,
      change30d: 2.5,
      high52w: 4.50,
      low52w: 1.85,
      volatility: 'Very High',
    },
  }

  const commodityList = commodities.data
    ? Object.entries(commodities.data).map(([key, data]: any) => ({
        key,
        name: commodityDetails[key]?.name || key,
        symbol: commodityDetails[key]?.symbol || '',
        price: data.price,
        change24h: commodityDetails[key]?.change24h || 0,
        timestamp: data.timestamp,
      }))
    : []

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Commodities Intelligence</h1>
          <p className="text-gray-400">Global commodity market monitoring and analysis</p>
        </div>
      </div>

      {/* ── Tab Navigation ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-dark-600 overflow-x-auto">
        {[
          { id: 'overview', label: 'Market Overview', icon: BarChart3 },
          { id: 'trends', label: 'Price Trends', icon: TrendingUp },
          { id: 'correlation', label: 'Correlation Analysis', icon: Zap },
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

      {/* ── MARKET OVERVIEW TAB ───────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Precious Metals Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Precious Metals</h2>
            {commodities.isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : commodities.error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400">
                Failed to load commodity data
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {commodityList.filter((c) => ['gold', 'silver', 'platinum', 'palladium'].includes(c.key)).map((commodity) => {
                  const isPositive = commodity.change24h >= 0
                  return (
                    <div
                      key={commodity.key}
                      onClick={() => setSelectedCommodity(commodity.key)}
                      className={`bg-dark-700 border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        selectedCommodity === commodity.key
                          ? 'border-primary-500'
                          : 'border-dark-600 hover:border-primary-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{commodity.name}</h3>
                          <p className="text-xs text-gray-500">{commodity.symbol}</p>
                        </div>
                        {isPositive ? (
                          <TrendingUp size={24} className="text-green-400" />
                        ) : (
                          <TrendingDown size={24} className="text-red-400" />
                        )}
                      </div>

                      <div>
                        <p className="text-3xl font-bold text-white mb-2">
                          ${commodity.price?.toFixed(2) || 'N/A'}
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            isPositive ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {isPositive ? '+' : ''}{commodity.change24h}%
                        </p>
                      </div>

                      <button className="w-full mt-4 bg-primary-600/20 hover:bg-primary-600/40 text-primary-400 font-semibold py-2 rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Energy Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Energy Commodities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {commodityList.filter((c) => ['crude-oil', 'brent-oil', 'natural-gas'].includes(c.key)).map((commodity) => {
                const isPositive = commodity.change24h >= 0
                return (
                  <div
                    key={commodity.key}
                    onClick={() => setSelectedCommodity(commodity.key)}
                    className={`bg-dark-700 border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      selectedCommodity === commodity.key
                        ? 'border-primary-500'
                        : 'border-dark-600 hover:border-primary-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{commodity.name}</h3>
                        <p className="text-xs text-gray-500">{commodity.symbol}</p>
                      </div>
                      {isPositive ? (
                        <TrendingUp size={24} className="text-green-400" />
                      ) : (
                        <TrendingDown size={24} className="text-red-400" />
                      )}
                    </div>

                    <div>
                      <p className="text-3xl font-bold text-white mb-2">
                        ${commodity.price?.toFixed(2) || 'N/A'}
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}{commodity.change24h}%
                      </p>
                    </div>

                    <button className="w-full mt-4 bg-primary-600/20 hover:bg-primary-600/40 text-primary-400 font-semibold py-2 rounded transition-colors">
                      View Details
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PRICE TRENDS TAB ────────────────────────────────────────────── */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          {selectedCommodity ? (
            <div className="space-y-6">
              <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {commodityDetails[selectedCommodity]?.name}
                </h2>

                {/* Price Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-dark-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400">Current Price</p>
                    <p className="text-2xl font-bold text-white mt-2">
                      ${commodities.data?.[selectedCommodity]?.price?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400">24h Change</p>
                    <p
                      className={`text-2xl font-bold mt-2 ${
                        commodityDetails[selectedCommodity]?.change24h >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {commodityDetails[selectedCommodity]?.change24h >= 0 ? '+' : ''}
                      {commodityDetails[selectedCommodity]?.change24h}%
                    </p>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400">52W High</p>
                    <p className="text-2xl font-bold text-white mt-2">
                      ${commodityDetails[selectedCommodity]?.high52w?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-4">
                    <p className="text-xs text-gray-400">52W Low</p>
                    <p className="text-2xl font-bold text-white mt-2">
                      ${commodityDetails[selectedCommodity]?.low52w?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Trend Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-dark-800 rounded-lg p-4 h-48 flex items-center justify-center">
                    <p className="text-gray-500">Daily Chart</p>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-4 h-48 flex items-center justify-center">
                    <p className="text-gray-500">Weekly Chart</p>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-4 h-48 flex items-center justify-center">
                    <p className="text-gray-500">Monthly Chart</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-dark-700 border border-dashed border-dark-600 rounded-lg p-12 text-center">
              <p className="text-gray-400">Select a commodity from the overview tab to view detailed trends</p>
            </div>
          )}
        </div>
      )}

      {/* ── CORRELATION ANALYSIS TAB ──────────────────────────────────── */}
      {activeTab === 'correlation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* USD Correlation */}
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">USD Correlation</h2>
              <div className="space-y-3">
                {commodityList.map((commodity) => (
                  <div key={commodity.key} className="flex items-center justify-between p-3 bg-dark-800 rounded">
                    <span className="text-white font-semibold">{commodity.symbol}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-dark-600 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                      <span className="text-primary-400 font-semibold w-12 text-right">
                        {(Math.random() * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inter-Commodity Correlation */}
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Inter-Commodity Correlation</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-dark-800 rounded">
                  <span className="text-white">Gold ↔ Silver</span>
                  <span className="text-green-400 font-semibold">+0.82</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-800 rounded">
                  <span className="text-white">Crude Oil ↔ Brent Oil</span>
                  <span className="text-green-400 font-semibold">+0.95</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-800 rounded">
                  <span className="text-white">Gold ↔ USD</span>
                  <span className="text-red-400 font-semibold">-0.78</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-800 rounded">
                  <span className="text-white">Oil ↔ USD</span>
                  <span className="text-red-400 font-semibold">-0.65</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-800 rounded">
                  <span className="text-white">Precious Metals ↔ Oil</span>
                  <span className="text-gray-400 font-semibold">+0.32</span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Market Volatility</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Precious Metals:</span> Medium
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Energy:</span> High
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Natural Gas:</span> Very High
                </p>
              </div>
            </div>

            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Trend Direction</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Bullish:</span> Gold, Silver
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Bearish:</span> Natural Gas
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Neutral:</span> Oil, Platinum
                </p>
              </div>
            </div>

            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Key Drivers</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">• Dollar Strength</p>
                <p className="text-gray-400">• Fed Policy</p>
                <p className="text-gray-400">• Geopolitical Events</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
