/**
 * TimelineSlider Component
 * Allows scrubbing through hourly data with play/pause animation
 */

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { generateTimeLabels } from '../../utils/geoHelpers'

interface TimelineSliderProps {
  onTimeChange: (time: string) => void
  currentTime?: string
}

export default function TimelineSlider({ onTimeChange, currentTime = '12:00' }: TimelineSliderProps) {
  const times = generateTimeLabels()
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const idx = times.findIndex(t => t === currentTime)
    return idx >= 0 ? idx : Math.floor(times.length / 2)
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<1 | 2 | 4>(1)

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setSelectedIndex(prev => {
        if (prev >= times.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1000 / speed)

    return () => clearInterval(interval)
  }, [isPlaying, speed, times.length])

  // Notify parent of time change
  useEffect(() => {
    onTimeChange(times[selectedIndex])
  }, [selectedIndex, times, onTimeChange])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIndex(parseInt(e.target.value, 10))
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    if (selectedIndex >= times.length - 1) {
      setSelectedIndex(0) // Reset to start
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setSelectedIndex(0)
    setIsPlaying(false)
  }

  return (
    <div className="space-y-4">
      {/* Time Display */}
      <div className="text-center">
        <p className="text-2xl font-bold text-white">{times[selectedIndex]} IST</p>
        <p className="text-sm text-gray-400">
          {isPlaying ? '▶ Playing' : 'Paused'} • Speed: {speed}x
        </p>
      </div>

      {/* Timeline Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={times.length - 1}
          value={selectedIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>{times[0]}</span>
          <span>{times[Math.floor(times.length / 2)]}</span>
          <span>{times[times.length - 1]}</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="h-1 bg-dark-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-200"
          style={{ width: `${(selectedIndex / (times.length - 1)) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handlePlayPause}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause size={18} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
          title="Reset to start"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Speed Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 uppercase">Speed:</span>
        <div className="flex gap-1">
          {([1, 2, 4] as const).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                speed === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>Drag slider or click Play to watch data evolve throughout the day</p>
      </div>
    </div>
  )
}
