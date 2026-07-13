/**
 * Professional Stock Detail & Analytics Page
 * Enterprise-grade financial intelligence platform
 * Inspired by TradingView, Yahoo Finance, Google Finance, Moneycontrol
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader } from 'lucide-react'
import {
  ComposedChart,
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  Line,
} from 'recharts'
import StockHeader from '../components/stock/StockHeader'

interface Stock {
  symbol: string
  name: string
  exchange: string
  sector: string
  price: number
  change: number
  changePercent: number
  marketCap: string
  volume: number
  pe: number
}

interface ChartData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Technicals {
  rsi: { value: number; signal: string }
  macd: { value: number; signal: string; histogram: number }
  sma20: number
  sma50: number
  ema12: number
  ema26: number
  bollingerBands: { upper: number; middle: number; lower: number }
}

interface Fundamentals {
  pe: number
  eps: number
  pb: number
  roe: number
  roa: number
  debtToEquity: number
  dividendYield: number
  beta: number
  price: number
}

const API_URL = 'http://localhost:8000/api/v1'

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>()
  const navigate = useNavigate()
  const [stock, setStock] = useState<Stock | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [technicals, setTechnicals] = useState<Technicals | null>(null)
  const [fundamentals, setFundamentals] = useState<Fundamentals | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'chart' | 'technicals' | 'fundamentals'>('chart')
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick')
  const [daysRange, setDaysRange] = useState(30)
  const [watchlist, setWatchlist] = useState<boolean>(false)

  useEffect(() => {
    if (symbol) loadStockData()
  }, [symbol])

  const loadStockData = async () => {
    try {
      setLoading(true)

      // Get stock quote
      const searchRes = await fetch(`${API_URL}/financial/stock/search?q=${symbol}&limit=1`)
      const searchData = await searchRes.json()
      const stockData = searchData.data[0]
      if (stockData) setStock(stockData)

      // Get chart data
      const chartRes = await fetch(`${API_URL}/financial/stock/${symbol}/ohlcv?days=${daysRange}`)
      const chartJson = await chartRes.json()
      setChartData(chartJson.data || [])

      // Get technicals
      const techRes = await fetch(`${API_URL}/financial/stock/${symbol}/technicals`)
      const techJson = await techRes.json()
      if (techJson.data?.indicators) {
        setTechnicals(techJson.data.indicators)
      }

      // Get fundamentals
      const fundRes = await fetch(`${API_URL}/financial/stock/${symbol}/fundamentals`)
      const fundJson = await fundRes.json()
      if (fundJson.data) {
        setFundamentals(fundJson.data)
      }
    } catch (error) {
      console.error('Error loading stock data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stock) {
    return (
      <div className="min-h-screen bg-dark-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-primary-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading {symbol}...</p>
        </div>
      </div>
    )
  }

  const isPositive = stock.changePercent >= 0
  const currency = stock.exchange === 'NSE' ? '₹' : '$'

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate('/finance/stocks')} className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <span className="text-gray-500 text-sm">Back to Stocks</span>
      </div>

      {/* Professional Header */}
      <StockHeader 
        stock={stock} 
        watchlist={watchlist} 
        onWatchlistToggle={() => setWatchlist(!watchlist)} 
        onRefresh={loadStockData}
      />

      {/* Tabs - Professional Style */}
      <div className="flex items-center gap-8 border-b border-dark-600 sticky top-0 bg-dark-900 z-10 -mx-6 px-6 py-4">
        {(['chart', 'technicals', 'fundamentals'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-1 py-2 border-b-2 font-semibold transition-colors text-sm whitespace-nowrap ${
              activeTab === tab
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab === 'chart' && '📊 Price Chart'}
            {tab === 'technicals' && '📈 Technical Analysis'}
            {tab === 'fundamentals' && '📋 Fundamentals'}
          </button>
        ))}
      </div>

      {/* Chart Tab */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          {/* Professional Chart Controls */}
          <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 backdrop-blur">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-300">Chart Type:</label>
                  <div className="flex gap-2">
                    {['candlestick', 'line', 'area'].map(type => (
                      <button
                        key={type}
                        onClick={() => setChartType(type as any)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                          chartType === type
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-300">Time Frame:</label>
                  <div className="flex gap-1.5">
                    {[
                      { label: '1W', days: 5 },
                      { label: '2W', days: 10 },
                      { label: '1M', days: 30 },
                      { label: '3M', days: 90 },
                      { label: '6M', days: 180 },
                      { label: '1Y', days: 365 },
                    ].map(period => (
                      <button
                        key={period.days}
                        onClick={() => setDaysRange(period.days)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                          daysRange === period.days
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Chart Card */}
          {chartData.length > 0 ? (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Price Movement</h3>
                  <p className="text-xs text-gray-400 mt-1">Last {daysRange} days • OHLCV Data</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{currency}{stock.price.toFixed(2)}</p>
                  <p className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                {chartType === 'line' ? (
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4299e1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4299e1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#718096" 
                      tick={{ fontSize: 12 }}
                      interval={Math.floor(chartData.length / 8)}
                    />
                    <YAxis 
                      stroke="#718096" 
                      tick={{ fontSize: 12 }}
                      domain={['dataMin - 50', 'dataMax + 50']}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#1a202c', 
                        border: '1px solid #4a5568', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                      }}
                      labelStyle={{ color: '#e2e8f0', fontSize: 12 }}
                      formatter={(value: any) => `${currency}${value.toFixed(2)}`}
                      cursor={{ stroke: '#4299e1', strokeOpacity: 0.5 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#4299e1" 
                      strokeWidth={2.5}
                      name="Close Price"
                      dot={false}
                      isAnimationActive={true}
                    />
                  </LineChart>
                ) : chartType === 'area' ? (
                  <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#48bb78" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#48bb78" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#718096" 
                      tick={{ fontSize: 12 }}
                      interval={Math.floor(chartData.length / 8)}
                    />
                    <YAxis stroke="#718096" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#1a202c', 
                        border: '1px solid #4a5568', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                      }}
                      labelStyle={{ color: '#e2e8f0', fontSize: 12 }}
                      formatter={(value: any) => value.toFixed ? `${currency}${value.toFixed(2)}` : value}
                      cursor={{ stroke: '#4299e1', strokeOpacity: 0.5 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                    <Bar dataKey="volume" fill="#48bb78" opacity={0.15} name="Volume" />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#4299e1" 
                      strokeWidth={2.5}
                      name="Close Price"
                      dot={false}
                      isAnimationActive={true}
                    />
                  </ComposedChart>
                ) : (
                  <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#718096" 
                      tick={{ fontSize: 12 }}
                      interval={Math.floor(chartData.length / 8)}
                    />
                    <YAxis stroke="#718096" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#1a202c', 
                        border: '1px solid #4a5568', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                      }}
                      labelStyle={{ color: '#e2e8f0', fontSize: 12 }}
                      formatter={(value: any) => value.toFixed ? `${currency}${value.toFixed(2)}` : value}
                      cursor={{ stroke: '#4299e1', strokeOpacity: 0.5 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                    <Bar dataKey="open" fill="#ed8936" name="Open" opacity={0.7} />
                    <Bar dataKey="high" fill="#48bb78" name="High" opacity={0.7} />
                    <Bar dataKey="low" fill="#f56565" name="Low" opacity={0.7} />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#4299e1" 
                      strokeWidth={2.5}
                      name="Close"
                      dot={false}
                      isAnimationActive={true}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-8">
              <div className="h-96 bg-dark-800 rounded flex items-center justify-center">
                <p className="text-gray-500">No chart data available for this period</p>
              </div>
            </div>
          )}

          {/* Volume Analysis Chart */}
          {chartData.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Trading Volume</h3>
                  <p className="text-xs text-gray-400 mt-1">Volume trends & spikes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Avg:</p>
                  <p className="text-lg font-bold text-blue-400">{(chartData.reduce((sum: number, d: ChartData) => sum + d.volume, 0) / chartData.length / 1000000).toFixed(1)}M</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolumeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4299e1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4299e1" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#718096" 
                    tick={{ fontSize: 12 }}
                    interval={Math.floor(chartData.length / 8)}
                  />
                  <YAxis 
                    stroke="#718096" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1a202c', 
                      border: '1px solid #4a5568', 
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}
                    labelStyle={{ color: '#e2e8f0', fontSize: 12 }}
                    formatter={(value: any) => `${(value / 1000000).toFixed(2)}M`}
                    cursor={{ fill: '#4299e1', fillOpacity: 0.1 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                  <Bar 
                    dataKey="volume" 
                    fill="url(#colorVolumeBar)" 
                    name="Volume"
                    isAnimationActive={true}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Technicals Tab */}
      {activeTab === 'technicals' && technicals && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* RSI - Relative Strength Index */}
            <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-primary-500/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">RSI</h4>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  technicals.rsi.value > 70 
                    ? 'bg-red-500/20 text-red-400' 
                    : technicals.rsi.value < 30 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {technicals.rsi.signal}
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{technicals.rsi.value.toFixed(1)}</p>
              <div className="w-full bg-dark-900 rounded-full h-2 mt-3">
                <div 
                  className={`h-full rounded-full ${
                    technicals.rsi.value > 70 ? 'bg-red-500' : technicals.rsi.value < 30 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${technicals.rsi.value}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Over: &gt;70 | Normal: 30-70 | Under: &lt;30</p>
            </div>

            {/* MACD */}
            <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-primary-500/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">MACD</h4>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  technicals.macd.signal === 'Bullish'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {technicals.macd.signal}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{technicals.macd.value.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-2">Signal: {technicals.macd.signal}</p>
              <p className="text-xs text-gray-500 mt-1">Histogram: {technicals.macd.histogram.toFixed(2)}</p>
            </div>

            {/* Moving Averages */}
            <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-primary-500/50 transition-all">
              <h4 className="font-semibold text-white mb-3">Moving Averages</h4>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">SMA 20</span>
                  <span className="text-gray-200 font-semibold">₹{technicals.sma20.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SMA 50</span>
                  <span className="text-gray-200 font-semibold">₹{technicals.sma50.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">EMA 12</span>
                  <span className="text-gray-200 font-semibold">₹{technicals.ema12.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bollinger Bands */}
            <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-primary-500/50 transition-all">
              <h4 className="font-semibold text-white mb-3">Bollinger Bands</h4>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-400">Upper</span>
                  <span className="text-red-300 font-semibold">₹{technicals.bollingerBands.upper.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">Middle</span>
                  <span className="text-yellow-300 font-semibold">₹{technicals.bollingerBands.middle.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">Lower</span>
                  <span className="text-green-300 font-semibold">₹{technicals.bollingerBands.lower.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fundamentals Tab */}
      {activeTab === 'fundamentals' && fundamentals && (
        <div className="space-y-6">
          {/* Grouped Fundamentals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Valuation Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white px-4 py-2 border-l-4 border-blue-500">Valuation Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-blue-500/50 transition-all">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">P/E Ratio</p>
                  <p className="text-2xl font-bold text-white">{fundamentals.pe.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Price to Earnings</p>
                </div>
                <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-blue-500/50 transition-all">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">P/B Ratio</p>
                  <p className="text-2xl font-bold text-white">{fundamentals.pb.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Price to Book</p>
                </div>
              </div>
            </div>

            {/* Profitability Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white px-4 py-2 border-l-4 border-green-500">Profitability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-green-500/50 transition-all">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">ROE</p>
                  <p className="text-2xl font-bold text-green-400">{fundamentals.roe.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Return on Equity</p>
                </div>
                <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-green-500/50 transition-all">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">ROA</p>
                  <p className="text-2xl font-bold text-green-400">{fundamentals.roa.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Return on Assets</p>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white px-4 py-2 border-l-4 border-red-500">Risk Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-red-500/50 transition-all">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Beta</p>
                  <p className="text-2xl font-bold text-white">{fundamentals.beta.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Market Volatility</p>
                </div>
                <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-red-500/50 transition-all">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Debt/Equity</p>
                  <p className="text-2xl font-bold text-white">{fundamentals.debtToEquity.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Leverage Ratio</p>
                </div>
              </div>
            </div>

            {/* Income Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white px-4 py-2 border-l-4 border-yellow-500">Income & Returns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-yellow-500/50 transition-all">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">EPS</p>
                  <p className="text-2xl font-bold text-white">₹{fundamentals.eps.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Earnings Per Share</p>
                </div>
                <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-lg p-4 hover:border-yellow-500/50 transition-all">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Dividend Yield</p>
                  <p className="text-2xl font-bold text-yellow-400">{fundamentals.dividendYield.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Annual Yield</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
