import { useEffect, useRef, useState } from 'react'

interface UseMarketAutoRefreshProps {
  exchange: string
  onRefresh: () => Promise<void>
  refreshInterval?: number // in milliseconds, default 60000 (60 seconds)
}

/**
 * Custom hook for auto-refreshing market data when markets are open
 * Automatically polls data at specified intervals when the market is active
 * Stops polling when market is closed
 */
export const useMarketAutoRefresh = ({
  exchange,
  onRefresh,
  refreshInterval = 60000, // 60 seconds default
}: UseMarketAutoRefreshProps) => {
  const intervalRef = useRef<number | null>(null)
  const [isMarketOpen, setIsMarketOpen] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check if market is open
  const checkMarketStatus = (exchange: string): boolean => {
    const now = new Date()

    if (exchange === 'NSE') {
      // India: 09:15 - 15:30 IST (Mon-Fri)
      const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      const hours = istTime.getHours()
      const minutes = istTime.getMinutes()
      const day = istTime.getDay()

      const isWeekday = day !== 0 && day !== 6
      const isOpenHours = hours >= 9 && (hours < 15 || (hours === 15 && minutes < 30))

      return isWeekday && isOpenHours
    } else if (exchange === 'NASDAQ') {
      // US: 09:30 - 16:00 EST/EDT (Mon-Fri)
      const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
      const hours = estTime.getHours()
      const minutes = estTime.getMinutes()
      const day = estTime.getDay()

      const isWeekday = day !== 0 && day !== 6
      const isOpenHours = hours >= 9 && (hours < 16 || (hours === 9 && minutes < 30))

      return isWeekday && isOpenHours
    }

    return false
  }

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await onRefresh()
      setLastRefreshTime(new Date())
    } catch (error) {
      console.error('Auto-refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Setup auto-refresh interval
  useEffect(() => {
    // Initial check
    const initialMarketStatus = checkMarketStatus(exchange)
    setIsMarketOpen(initialMarketStatus)

    // Perform initial refresh if market is open
    if (initialMarketStatus) {
      handleRefresh()
    }

    // Set up interval
    const interval = setInterval(() => {
      const marketOpen = checkMarketStatus(exchange)
      setIsMarketOpen(marketOpen)

      if (marketOpen) {
        handleRefresh()
      }
    }, refreshInterval)

    intervalRef.current = interval

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [exchange, refreshInterval])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    isMarketOpen,
    isRefreshing,
    lastRefreshTime,
    manualRefresh: handleRefresh,
  }
}
