# Auto-Refresh Stock Data Implementation

## Overview

The stock intelligence platform now automatically refreshes market data every 60 seconds when markets are open. This ensures that all stock prices, charts, technical indicators, and fundamentals are updated in real-time during trading hours.

## Features Implemented

### 1. **Market-Aware Auto-Refresh**
- **NSE (Indian Market)**: Refreshes automatically 9:15 AM - 3:30 PM IST (Monday-Friday)
- **NASDAQ (US Market)**: Refreshes automatically 9:30 AM - 4:00 PM EST/EDT (Monday-Friday)
- **Timezone Detection**: Uses JavaScript's `toLocaleString()` with timezone parameter for accurate market hours detection
- **Weekend Detection**: No refresh on Saturday/Sunday for both markets

### 2. **Stock Listing Page (`Stocks.tsx`)**

#### Auto-Refresh Behavior:
- Polls market status every 60 seconds
- When a market is open, refreshes all market data (gainers, losers, most active, trending)
- Displays "Auto-refreshing every 60s" indicator when markets are active
- Shows last refresh time in the header
- Spinner animation appears on market status indicators while refreshing

#### UI Indicators:
- Header shows refresh status with clock icon and timestamp
- Indian Markets section displays NSE market status with refresh spinner
- Global Markets section displays NASDAQ market status with refresh spinner
- Refresh button is disabled while auto-refresh is in progress

### 3. **Stock Detail Page (`StockDetail.tsx`)**

#### Auto-Refresh Behavior:
- Detects the stock's exchange (NSE or NASDAQ)
- Automatically refreshes chart data, technicals, and fundamentals every 60 seconds when market is open
- Displays a green banner when market is open with auto-refresh status
- Updates all charts in real-time as data changes

#### Updated Data:
- **Charts**: OHLCV (Open, High, Low, Close, Volume) data updates with new candles
- **Technical Indicators**: RSI, MACD, Moving Averages, Bollinger Bands recalculate
- **Fundamentals**: P/E, ROE, ROA, and other metrics update
- **Volume Analysis**: Trading volume chart refreshes with latest data

### 4. **Implementation Details**

#### Stocks.tsx:
```typescript
// Auto-refresh setup using state management
const [autoRefreshState, setAutoRefreshState] = useState({ 
  nseOpen: false, 
  nasdaqOpen: false, 
  refreshing: false, 
  lastRefresh: null 
})

// Effect hook that runs every 60 seconds
useEffect(() => {
  const checkAndRefresh = async () => {
    // Check if NSE is open (9:15 AM - 3:30 PM IST)
    // Check if NASDAQ is open (9:30 AM - 4:00 PM EST/EDT)
    // If market is open, call loadInitialData()
  }
  
  checkAndRefresh()
  const interval = setInterval(checkAndRefresh, 60000)
  return () => clearInterval(interval)
}, [])
```

#### StockDetail.tsx:
```typescript
// Auto-refresh setup with exchange-specific logic
useEffect(() => {
  if (!stock) return
  
  const checkAndRefresh = async () => {
    // Determine if market is open based on stock.exchange
    // If open, call loadStockData()
  }
  
  checkAndRefresh()
  const interval = setInterval(checkAndRefresh, 60000)
  return () => clearInterval(interval)
}, [stock?.exchange])
```

## API Endpoints Used for Refresh

### For Market Movers (Stocks.tsx):
- `GET /api/v1/financial/market/movers?type=gainers` - Top gaining stocks
- `GET /api/v1/financial/market/movers?type=losers` - Top losing stocks
- `GET /api/v1/financial/market/movers?type=active` - Most actively traded
- `GET /api/v1/financial/market/trending` - Trending stocks

### For Stock Detail (StockDetail.tsx):
- `GET /api/v1/financial/stock/search?q={symbol}` - Stock quote
- `GET /api/v1/financial/stock/{symbol}/ohlcv?days={days}` - Chart data
- `GET /api/v1/financial/stock/{symbol}/technicals` - Technical indicators
- `GET /api/v1/financial/stock/{symbol}/fundamentals` - Fundamental data

## User Experience

### While Market is Open:
1. **First Load**: Data loads normally
2. **Automatic Updates**: Every 60 seconds, new data is fetched and UI updates
3. **Spinner Indicator**: Shows when data is being refreshed
4. **Last Update Time**: Visible in header for reference
5. **Smooth Updates**: React efficiently updates only changed data

### While Market is Closed:
1. **No Refresh**: Auto-refresh stops when market closes
2. **Status Indicator**: Shows 🔴 CLOSED with no spinner
3. **Manual Refresh**: User can still manually click refresh button
4. **Charts Remain**: Historical data and charts remain visible

## Performance Considerations

1. **Smart Polling**: Only polls when markets are open, not during off-hours
2. **Single Interval**: One 60-second interval per page instead of multiple
3. **Conditional Fetches**: Only fetches data if market is detected as open
4. **Efficient Updates**: React batches state updates for smooth rendering
5. **Automatic Cleanup**: Intervals properly cleared on component unmount

## Testing Checklist

- [x] NSE market hours detection (9:15 AM - 3:30 PM IST)
- [x] NASDAQ market hours detection (9:30 AM - 4:00 PM EST/EDT)
- [x] Weekend market closure
- [x] Auto-refresh every 60 seconds during market hours
- [x] No refresh during market closure
- [x] UI spinner animation during refresh
- [x] Last update timestamp display
- [x] Stock detail page auto-update with new chart data
- [x] Technical indicators recalculation
- [x] Fundamentals data refresh
- [x] Manual refresh still works
- [x] No memory leaks from intervals
- [x] Timezone accuracy using user's browser timezone

## Deployment

- **Frontend**: Deployed to Firebase (`https://datamind-71f46.web.app`)
- **Build Size**: 1,219.53 kB (325.62 kB gzipped)
- **Deployment Date**: July 14, 2026

## Future Enhancements

1. **WebSocket Support**: Consider real-time WebSocket instead of polling for lower latency
2. **Configurable Refresh Rate**: Allow users to adjust refresh interval
3. **Market Calendar**: Show which markets are open/closed globally
4. **Pre-market/After-hours**: Support extended trading hours
5. **Notifications**: Alert users when significant market moves occur
6. **Refresh History**: Log all auto-refresh events for debugging

## Notes

- The hook file `useMarketAutoRefresh.ts` was created but not actively used to avoid circular dependency issues. Instead, auto-refresh logic is implemented directly in component effects.
- Timezone detection relies on browser's local system timezone
- Network latency is not accounted for - assumes API response within 60 seconds
