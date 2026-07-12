import { Menu, Cloud } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Cloud className="text-primary-500" size={28} />
          <h1 className="text-2xl font-bold text-white">InsightHub</h1>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
    </header>
  )
}
