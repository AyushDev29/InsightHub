import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Cloud,
  Zap,
  TrendingUp,
  AlertTriangle,
  Cpu,
  BarChart3,
  Activity,
  Globe,
  CheckCircle2,
  Lock,
  Rocket,
  ArrowRight,
  Server,
  Brain,
  Bell,
  Microscope,
} from 'lucide-react'

interface ModuleConfig {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'ACTIVE' | 'COMING_NEXT' | 'PLANNED' | 'FUTURE'
  metrics?: string[]
  dataSources?: string[]
  path: string
  color: string
  predictions?: boolean
  aiReady?: boolean
}

interface PlatformStat {
  label: string
  value: string | number
  unit?: string
}

interface ActivityItem {
  message: string
  time: string
  type: 'update' | 'alert' | 'success'
}

interface DataSourceItem {
  name: string
  status: 'active' | 'building' | 'planned'
}

interface PipelineStage {
  name: string
  status: 'complete' | 'building' | 'planned'
}

const modules: ModuleConfig[] = [
  {
    id: 'weather',
    title: 'Weather Intelligence',
    description: 'Monitor weather, air quality, forecast trends, and environmental conditions.',
    icon: <Cloud className="w-8 h-8" />,
    status: 'ACTIVE',
    metrics: ['7 Cities', 'Live Weather', 'AQI', 'Forecasts'],
    dataSources: ['Open-Meteo'],
    path: '/dashboard',
    color: 'from-blue-500 to-cyan-500',
    predictions: true,
    aiReady: true,
  },
  {
    id: 'finance',
    title: 'Global Finance Dashboard',
    description: 'Stocks, crypto, market analytics, forex trends, risk detection, portfolio insights, and trading signals.',
    icon: <TrendingUp className="w-8 h-8" />,
    status: 'COMING_NEXT',
    metrics: ['Stocks', 'Crypto', 'Forex', 'Portfolios'],
    dataSources: ['CoinGecko'],
    path: '/finance',
    color: 'from-emerald-500 to-teal-500',
    predictions: true,
    aiReady: false,
  },
  {
    id: 'economy',
    title: 'Indian Economy Intelligence',
    description: 'Government spending, budgets, infrastructure, GDP, economic indicators, policy analytics.',
    icon: <BarChart3 className="w-8 h-8" />,
    status: 'PLANNED',
    metrics: ['GDP', 'Budget Data', 'Spending', 'Indicators'],
    dataSources: ['RBI'],
    path: '/economy',
    color: 'from-amber-500 to-yellow-500',
    predictions: false,
    aiReady: false,
  },
  {
    id: 'earthquake',
    title: 'Earthquake Intelligence',
    description: 'Earthquake monitoring, seismic activity, risk zones, historical analysis, prediction research.',
    icon: <AlertTriangle className="w-8 h-8" />,
    status: 'FUTURE',
    metrics: ['Global Coverage', 'Real-time Alerts', 'Risk Maps', 'Historical Data'],
    dataSources: ['USGS'],
    path: '/earthquake',
    color: 'from-orange-500 to-red-500',
    predictions: true,
    aiReady: false,
  },
  {
    id: 'traffic',
    title: 'Traffic Intelligence',
    description: 'Congestion, travel time, road incidents, traffic forecasting.',
    icon: <Activity className="w-8 h-8" />,
    status: 'FUTURE',
    metrics: ['Traffic Flow', 'Travel Time', 'Incidents', 'Forecasts'],
    dataSources: ['Google Maps'],
    path: '/traffic',
    color: 'from-pink-500 to-rose-500',
    predictions: true,
    aiReady: false,
  },
  {
    id: 'energy',
    title: 'Energy Intelligence',
    description: 'Electricity demand, renewable generation, power consumption, grid analytics.',
    icon: <Zap className="w-8 h-8" />,
    status: 'FUTURE',
    metrics: ['Power Grid', 'Renewable', 'Consumption', 'Demand'],
    dataSources: ['Grid Operators'],
    path: '/energy',
    color: 'from-yellow-500 to-orange-500',
    predictions: true,
    aiReady: false,
  },
  {
    id: 'disaster',
    title: 'Disaster Intelligence',
    description: 'Floods, cyclones, wildfires, heatwaves, risk monitoring.',
    icon: <AlertTriangle className="w-8 h-8" />,
    status: 'FUTURE',
    metrics: ['Disaster Alerts', 'Risk Maps', 'Early Warning', 'Impact'],
    dataSources: ['NOAA', 'Satellites'],
    path: '/disaster',
    color: 'from-red-500 to-purple-500',
    predictions: true,
    aiReady: false,
  },
  {
    id: 'future',
    title: 'Future Modules',
    description: 'Healthcare, Supply Chain, Logistics, and more coming soon.',
    icon: <Rocket className="w-8 h-8" />,
    status: 'FUTURE',
    metrics: ['In Development', 'Multiple Domains'],
    dataSources: [],
    path: '#',
    color: 'from-violet-500 to-indigo-500',
    predictions: false,
    aiReady: false,
  },
]

const platformStats: PlatformStat[] = [
  { label: 'Modules Active', value: '1', unit: '/ 8' },
  { label: 'Countries', value: '1', unit: 'India' },
  { label: 'Cities Monitored', value: '7' },
  { label: 'Update Frequency', value: 'Hourly' },
  { label: 'Last Sync', value: '2 min', unit: 'ago' },
  { label: 'Active Data Sources', value: '2' },
]

const dataSources: DataSourceItem[] = [
  { name: 'Open-Meteo', status: 'active' },
  { name: 'RBI', status: 'planned' },
  { name: 'USGS', status: 'planned' },
  { name: 'CoinGecko', status: 'planned' },
  { name: 'Google Maps', status: 'planned' },
]

const intelligencePipeline: PipelineStage[] = [
  { name: 'Data Collection', status: 'complete' },
  { name: 'Analytics', status: 'complete' },
  { name: 'Visualization', status: 'complete' },
  { name: 'Machine Learning', status: 'planned' },
  { name: 'Decision Engine', status: 'planned' },
  { name: 'Local AI', status: 'planned' },
]

const techStack = ['React', 'FastAPI', 'Supabase', 'PostgreSQL', 'TypeScript', 'Python', 'Railway', 'Firebase']

const recentActivity: ActivityItem[] = [
  { message: 'Weather module updated', time: '2 minutes ago', type: 'update' },
  { message: 'AQI data collected', time: '5 minutes ago', type: 'success' },
  { message: 'Scheduler completed', time: '1 hour ago', type: 'success' },
  { message: 'Analytics refreshed', time: '1 hour ago', type: 'update' },
]

function StatusBadge({ status }: { status: ModuleConfig['status'] }) {
  const statusStyles = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    COMING_NEXT: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    PLANNED: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    FUTURE: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  }

  const statusText = {
    ACTIVE: '● LIVE',
    COMING_NEXT: '● COMING SOON',
    PLANNED: '● PLANNED',
    FUTURE: '● FUTURE',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  )
}

function StatCard({ label, value, unit }: PlatformStat) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gradient-to-br from-dark-700/50 to-dark-800/50 border border-dark-600 rounded-lg p-4 backdrop-blur-sm hover:border-primary-500/50 transition-colors"
    >
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </motion.div>
  )
}

function ModuleCard({ module }: { module: ModuleConfig }) {
  const navigate = useNavigate()

  const isDisabled = module.status === 'FUTURE' || module.status === 'PLANNED'

  return (
    <motion.div
      whileHover={!isDisabled ? { y: -4 } : undefined}
      onClick={() => !isDisabled && navigate(module.path)}
      className={`group relative overflow-hidden rounded-lg border transition-all duration-300 ${
        isDisabled
          ? 'bg-dark-700/30 border-dark-600/50 cursor-not-allowed'
          : 'bg-gradient-to-br from-dark-700/60 to-dark-800/60 border-dark-600 hover:border-primary-500/50 cursor-pointer hover:shadow-lg hover:shadow-primary-500/10'
      } backdrop-blur-sm p-6`}
    >
      {/* Background gradient effect */}
      {!isDisabled && (
        <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      )}

      <div className="relative z-10">
        {/* Header: Icon + Status */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${isDisabled ? 'bg-dark-600/50 text-gray-500' : `bg-gradient-to-br ${module.color} bg-opacity-20 text-white`}`}>
            {module.icon}
          </div>
          <StatusBadge status={module.status} />
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold mb-3 ${isDisabled ? 'text-gray-400' : 'text-white group-hover:text-primary-300 transition-colors'}`}>
          {module.title}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-4 line-clamp-2 ${isDisabled ? 'text-gray-500' : 'text-gray-400'}`}>
          {module.description}
        </p>

        {/* Coverage */}
        <div className="mb-4 pb-4 border-b border-dark-600/50">
          <div className={`text-xs ${isDisabled ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="font-semibold">Coverage</span>
            <div className="text-gray-400 mt-1">
              {module.id === 'weather' && 'India (7 Cities)'}
              {module.id === 'earthquake' && 'Global Coverage'}
              {module.id === 'finance' && 'Global Markets'}
              {module.id === 'economy' && 'India Focus'}
              {module.id === 'traffic' && 'Major Cities'}
              {module.id === 'energy' && 'Grid Level'}
              {module.id === 'disaster' && 'Multi-Region'}
              {module.id === 'future' && 'In Development'}
            </div>
          </div>
        </div>

        {/* Data Sources */}
        {module.dataSources && module.dataSources.length > 0 && (
          <div className="mb-4">
            <p className={`text-xs font-semibold mb-2 ${isDisabled ? 'text-gray-500' : 'text-gray-400'}`}>
              Data Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {module.dataSources.map((source, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded-md ${
                    isDisabled ? 'bg-dark-600/50 text-gray-500' : 'bg-dark-600 text-gray-300'
                  }`}
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Analytics/Capabilities */}
        {module.metrics && module.metrics.length > 0 && (
          <div className="mb-4">
            <p className={`text-xs font-semibold mb-2 ${isDisabled ? 'text-gray-500' : 'text-gray-400'}`}>
              Analytics
            </p>
            <div className="flex flex-wrap gap-2">
              {module.metrics.slice(0, 4).map((metric, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded-md ${
                    isDisabled ? 'bg-dark-600/50 text-gray-500' : 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  }`}
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Button */}
        {!isDisabled && (
          <motion.button
            whileHover={{ x: 4 }}
            className="inline-flex items-center gap-2 text-primary-300 text-sm font-medium group/btn hover:text-primary-200 transition-colors"
          >
            Open Module
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        )}
        {isDisabled && (
          <div className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Unavailable
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ActivityFeed() {
  return (
    <div className="space-y-4">
      {recentActivity.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-dark-700/30 border border-dark-600/50 hover:border-dark-500 transition-colors"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              item.type === 'success'
                ? 'bg-emerald-500'
                : item.type === 'alert'
                  ? 'bg-red-500'
                  : 'bg-blue-500'
            }`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300 truncate">{item.message}</p>
            <p className="text-xs text-gray-500">{item.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function IntelligenceEngine() {
  return (
    <div className="bg-gradient-to-br from-dark-700/40 to-dark-800/40 border border-dark-600 rounded-lg p-8 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-6">Intelligence Engine</h3>
      <div className="space-y-3">
        {intelligencePipeline.map((stage, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 2 }}
            className="flex items-center justify-between p-3 rounded-lg bg-dark-600/30 border border-dark-500/50 hover:border-primary-500/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              {stage.status === 'complete' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : stage.status === 'building' ? (
                <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-600" />
              )}
              <span className={`text-sm font-medium ${stage.status === 'complete' ? 'text-gray-300' : stage.status === 'building' ? 'text-blue-300' : 'text-gray-500'}`}>
                {stage.name}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${stage.status === 'complete' ? 'bg-emerald-500/20 text-emerald-300' : stage.status === 'building' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-400'}`}>
              {stage.status === 'complete' ? '✓ Done' : stage.status === 'building' ? 'Building' : 'Planned'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TechStackSection() {
  return (
    <div className="bg-gradient-to-br from-dark-700/40 to-dark-800/40 border border-dark-600 rounded-lg p-8 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4">Technology Stack</h3>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="px-3 py-2 rounded-lg bg-dark-600/50 border border-dark-500 text-sm text-gray-300 hover:border-primary-500/50 transition-colors"
          >
            {tech}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DataSourcesSection() {
  return (
    <div className="bg-gradient-to-br from-dark-700/40 to-dark-800/40 border border-dark-600 rounded-lg p-8 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-6">Data Sources</h3>
      <div className="space-y-3">
        {dataSources.map((source, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 2 }}
            className="flex items-center justify-between p-3 rounded-lg bg-dark-600/30 border border-dark-500/50"
          >
            <span className="text-sm font-medium text-gray-300">{source.name}</span>
            <span className={`text-xs px-2 py-1 rounded ${source.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>
              {source.status === 'active' ? '● Active' : '● Planned'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function GlobalHub() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 border-b border-dark-700/50 backdrop-blur-md bg-dark-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Global Intelligence Hub</h1>
              <p className="text-xs text-gray-400">Enterprise Platform</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-dark-700/50 border border-dark-600 hover:border-primary-500/50 transition-colors"
            >
              <Server className="w-5 h-5 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-dark-700/50 border border-dark-600 hover:border-primary-500/50 transition-colors"
            >
              <Lock className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Global Intelligence Hub
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl">
            A unified platform for real-time analytics, AI-powered insights, predictive intelligence, and decision support across multiple domains.
          </p>
        </motion.div>

        {/* Platform Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {platformStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Intelligence Modules - takes 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Intelligence Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - 3 sections */}
          <div className="space-y-6">
            {/* Intelligence Engine */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <IntelligenceEngine />
            </motion.div>

            {/* Data Sources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <DataSourcesSection />
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <TechStackSection />
            </motion.div>
          </div>
        </div>

        {/* Platform Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-dark-700/40 to-dark-800/40 border border-dark-600 rounded-lg p-8 backdrop-blur-sm mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Platform Roadmap</h3>
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4">
            {[
              { name: 'Weather', status: 'complete' },
              { name: 'Finance', status: 'next' },
              { name: 'Economy', status: 'planned' },
              { name: 'Earthquake', status: 'planned' },
              { name: 'Traffic', status: 'future' },
              { name: 'Energy', status: 'future' },
              { name: 'Healthcare', status: 'future' },
              { name: 'Supply Chain', status: 'future' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                  item.status === 'complete'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : item.status === 'next'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-dark-600/50 text-gray-400 border border-dark-500/50'
                }`}
              >
                {item.status === 'complete' && <CheckCircle2 className="w-4 h-4" />}
                {item.name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission + Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 border border-primary-500/30 rounded-lg p-8 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              Transform large-scale public datasets into actionable intelligence using analytics, machine learning, and local AI. 
              We believe intelligence should be accessible, transparent, and powered by open data.
            </p>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-dark-700/40 to-dark-800/40 border border-dark-600 rounded-lg p-6 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-400" />
              Recent Activity
            </h3>
            <ActivityFeed />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 pt-8 border-t border-dark-700/50"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Global Intelligence Hub • Enterprise Platform
            </p>
            <p className="text-sm text-gray-500">
              Last Updated July 2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
