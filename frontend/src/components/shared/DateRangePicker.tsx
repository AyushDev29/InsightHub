/**
 * DateRangePicker Component
 * Reusable date range picker with calendar UI and preset shortcuts
 */

import { useState, useMemo } from 'react'
import { Calendar, X } from 'lucide-react'

interface DateRangePickerProps {
  onSelect: (start: Date, end: Date) => void
  minDate?: Date
  maxDate?: Date
  maxRangeDays?: number
}

type Preset = 'today' | 'last7' | 'last30' | 'last90'

export default function DateRangePicker({
  onSelect,
  minDate,
  maxDate = new Date(),
  maxRangeDays = 30,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Generate preset dates
  const presets: Record<Preset, { label: string; getDate: () => [Date, Date] }> = {
    today: {
      label: 'Today',
      getDate: () => {
        const today = new Date()
        return [today, today]
      },
    },
    last7: {
      label: 'Last 7 Days',
      getDate: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - 7)
        return [start, end]
      },
    },
    last30: {
      label: 'Last 30 Days',
      getDate: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - 30)
        return [start, end]
      },
    },
    last90: {
      label: 'Last 90 Days',
      getDate: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - 90)
        return [start, end]
      },
    },
  }

  // Handle preset selection
  const handlePreset = (preset: Preset) => {
    const [start, end] = presets[preset].getDate()
    setStartDate(start)
    setEndDate(end)
    onSelect(start, end)
    setIsOpen(false)
  }

  // Handle manual date selection
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value)
    if (type === 'start') {
      setStartDate(date)
    } else {
      setEndDate(date)
    }

    // Auto-submit if both dates are selected
    if (type === 'start' && endDate) {
      onSelect(date, endDate)
      setIsOpen(false)
    } else if (type === 'end' && startDate) {
      onSelect(startDate, date)
      setIsOpen(false)
    }
  }

  // Format display label
  const displayLabel = useMemo(() => {
    if (!startDate || !endDate) return 'Select date range'
    if (startDate.toDateString() === endDate.toDateString()) {
      return startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }
    return `${startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} – ${endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`
  }, [startDate, endDate])

  // Format date for input
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded text-white text-sm hover:border-primary-500 transition-colors focus:outline-none focus:border-primary-400"
      >
        <Calendar size={16} />
        <span>{displayLabel}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 p-4 w-80 space-y-4">
          {/* Presets */}
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Presets</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(presets) as Array<[Preset, typeof presets['today']]>).map(
                ([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handlePreset(key)}
                    className="px-3 py-2 rounded text-xs font-medium text-gray-300 bg-dark-700 hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    {preset.label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dark-600" />

          {/* Custom Range */}
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Custom Range</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={formatDateForInput(startDate)}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  max={formatDateForInput(maxDate)}
                  className="w-full px-2 py-2 bg-dark-700 border border-dark-600 rounded text-white text-sm focus:outline-none focus:border-primary-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">End Date</label>
                <input
                  type="date"
                  value={formatDateForInput(endDate)}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  max={formatDateForInput(maxDate)}
                  className="w-full px-2 py-2 bg-dark-700 border border-dark-600 rounded text-white text-sm focus:outline-none focus:border-primary-400"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          {startDate && endDate && (
            <div className="text-xs text-gray-500 text-center pt-2">
              {Math.floor(
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
              )}{' '}
              days selected
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1 hover:bg-dark-700 rounded transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
      )}

      {/* Close on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
