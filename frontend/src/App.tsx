import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import Layout from './components/Layout'
import GlobalHub from './pages/GlobalHub'
import Dashboard from './pages/Dashboard'
import CityDetails from './pages/CityDetails'
import Weather from './pages/Weather'
import AirQuality from './pages/AirQuality'
import Analytics from './pages/Analytics'
import GeoIntelligence from './pages/GeoIntelligence'
import Finance from './pages/Finance'
import Stocks from './pages/Stocks'
import StockDetail from './pages/StockDetail'
import Crypto from './pages/Crypto'
import Forex from './pages/Forex'
import Commodities from './pages/Commodities'
import FinanceAnalytics from './pages/FinanceAnalytics'
import './styles/globals.css'

// Simple placeholder component for unimplemented pages
function ComingSoon() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Coming Soon</h1>
          <p className="text-gray-400">This page is under development</p>
        </div>
      </div>
      <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-8 text-center">
        <div className="mb-4">
          <div className="inline-block p-3 bg-primary-500/20 rounded-lg mb-4">
            <div className="animate-spin w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Page Under Construction</h2>
        <p className="text-gray-400">We're working on this feature. Check back soon!</p>
      </div>
    </div>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Global Intelligence Hub - Entry Point (no Layout) */}
          <Route path="/" element={<GlobalHub />} />
          
          {/* All other pages use Layout */}
          <Route element={<Layout />}>
            {/* Weather Module Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/city/:cityId" element={<CityDetails />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/air-quality" element={<AirQuality />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/geo-intelligence" element={<GeoIntelligence />} />
            <Route path="/maps" element={<GeoIntelligence />} />
            
              {/* Finance Module Routes */}
            <Route path="/finance" element={<Finance />} />
            <Route path="/finance/stocks" element={<Stocks />} />
            <Route path="/finance/stock/:symbol" element={<StockDetail />} />
            <Route path="/finance/crypto" element={<Crypto />} />
            <Route path="/finance/forex" element={<Forex />} />
            <Route path="/finance/commodities" element={<Commodities />} />
            <Route path="/finance/analytics" element={<FinanceAnalytics />} />
            
            {/* Future Module Routes */}
            <Route path="/earthquake" element={<ComingSoon />} />
            <Route path="/economy" element={<ComingSoon />} />
            <Route path="/traffic" element={<ComingSoon />} />
            <Route path="/energy" element={<ComingSoon />} />
            <Route path="/disaster" element={<ComingSoon />} />
            
            {/* Utility Routes */}
            <Route path="/data-explorer" element={<ComingSoon />} />
            <Route path="/settings" element={<ComingSoon />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
