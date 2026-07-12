import { Cloud, Gauge, Map, BarChart3, Settings, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: Gauge, label: 'Dashboard', href: '/', end: true },
  { icon: Cloud, label: 'Weather', href: '/weather', end: false },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', end: false },
  { icon: Map, label: 'Maps', href: '/maps', end: false },
  { icon: Cloud, label: 'Data Explorer', href: '/data-explorer', end: false },
]

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/settings', end: false },
]

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()

  const isActive = (href: string, end: boolean) => {
    if (end) return location.pathname === href
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-64 h-screen bg-dark-800 border-r border-dark-700 flex flex-col transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close button (mobile only) */}
        <div className="lg:hidden p-4 flex justify-end">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden lg:flex items-center gap-2 px-6 py-6 border-b border-dark-700">
          <Cloud className="text-primary-500" size={32} />
          <div>
            <h2 className="text-xl font-bold text-white">InsightHub</h2>
            <p className="text-xs text-gray-400">v0.1.0</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.end)
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <nav className="px-4 py-4 border-t border-dark-700 space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.end)
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* API Status */}
        <div className="px-4 py-4 border-t border-dark-700">
          <div className="bg-dark-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">API Status</span>
            </div>
            <p className="text-xs text-gray-500">Connected</p>
          </div>
        </div>
      </aside>
    </>
  )
}
