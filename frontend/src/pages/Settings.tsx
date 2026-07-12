import { Settings as SettingsIcon } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C')
  const [windUnit, setWindUnit] = useState<'ms' | 'mph'>('ms')
  const [timeFormat, setTimeFormat] = useState<'24h' | '12h'>('24h')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [defaultCountry, setDefaultCountry] = useState('India')
  const [refreshInterval, setRefreshInterval] = useState('5')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="text-primary-500" size={32} />
        <div>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Customize your InsightHub experience</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6">
        {/* Preferences */}
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Units & Format</h2>
          
          <div className="space-y-4">
            {/* Temperature Unit */}
            <div className="flex items-center justify-between pb-4 border-b border-dark-600">
              <div>
                <p className="text-white font-medium">Temperature Unit</p>
                <p className="text-sm text-gray-400">Choose Celsius or Fahrenheit</p>
              </div>
              <select
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value as 'C' | 'F')}
                className="bg-dark-600 text-white rounded px-3 py-2 border border-dark-500 hover:border-primary-500 transition-colors"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
              </select>
            </div>

            {/* Wind Speed Unit */}
            <div className="flex items-center justify-between pb-4 border-b border-dark-600">
              <div>
                <p className="text-white font-medium">Wind Speed Unit</p>
                <p className="text-sm text-gray-400">Choose m/s or mph</p>
              </div>
              <select
                value={windUnit}
                onChange={(e) => setWindUnit(e.target.value as 'ms' | 'mph')}
                className="bg-dark-600 text-white rounded px-3 py-2 border border-dark-500 hover:border-primary-500 transition-colors"
              >
                <option value="ms">Meters/Second (m/s)</option>
                <option value="mph">Miles/Hour (mph)</option>
              </select>
            </div>

            {/* Time Format */}
            <div className="flex items-center justify-between pb-4 border-b border-dark-600">
              <div>
                <p className="text-white font-medium">Time Format</p>
                <p className="text-sm text-gray-400">Choose 12-hour or 24-hour format</p>
              </div>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value as '24h' | '12h')}
                className="bg-dark-600 text-white rounded px-3 py-2 border border-dark-500 hover:border-primary-500 transition-colors"
              >
                <option value="24h">24-Hour Format</option>
                <option value="12h">12-Hour Format</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Display</h2>
          
          <div className="space-y-4">
            {/* Theme */}
            <div className="flex items-center justify-between pb-4 border-b border-dark-600">
              <div>
                <p className="text-white font-medium">Theme</p>
                <p className="text-sm text-gray-400">Choose your preferred theme</p>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                className="bg-dark-600 text-white rounded px-3 py-2 border border-dark-500 hover:border-primary-500 transition-colors"
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Dashboard</h2>
          
          <div className="space-y-4">
            {/* Default Country */}
            <div className="flex items-center justify-between pb-4 border-b border-dark-600">
              <div>
                <p className="text-white font-medium">Default Country</p>
                <p className="text-sm text-gray-400">Country shown on dashboard load</p>
              </div>
              <select
                value={defaultCountry}
                onChange={(e) => setDefaultCountry(e.target.value)}
                className="bg-dark-600 text-white rounded px-3 py-2 border border-dark-500 hover:border-primary-500 transition-colors"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Germany">Germany</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* Refresh Interval */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Data Refresh Interval</p>
                <p className="text-sm text-gray-400">How often to update data (minutes)</p>
              </div>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="bg-dark-600 text-white rounded px-3 py-2 border border-dark-500 hover:border-primary-500 transition-colors"
              >
                <option value="1">Every Minute</option>
                <option value="5">Every 5 Minutes</option>
                <option value="15">Every 15 Minutes</option>
                <option value="30">Every 30 Minutes</option>
                <option value="60">Every Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button className="px-6 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors font-medium">
            Cancel
          </button>
          <button className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
