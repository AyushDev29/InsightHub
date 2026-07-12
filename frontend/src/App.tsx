import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CityDetails from './pages/CityDetails'
import Weather from './pages/Weather'
import AirQuality from './pages/AirQuality'
import Analytics from './pages/Analytics'
import GeoIntelligence from './pages/GeoIntelligence'
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
          <Route element={<Layout />}>
            {/* Main Dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* Other pages */}
            <Route path="/city/:cityId" element={<CityDetails />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/air-quality" element={<AirQuality />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/geo-intelligence" element={<GeoIntelligence />} />
            <Route path="/maps" element={<GeoIntelligence />} />
            <Route path="/data-explorer" element={<ComingSoon />} />
            <Route path="/settings" element={<ComingSoon />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
