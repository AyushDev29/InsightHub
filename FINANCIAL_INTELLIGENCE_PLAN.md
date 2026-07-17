# Financial Intelligence Module - Implementation Plan

## Overview
Build a professional Financial Intelligence platform following the same architecture as Weather Intelligence.
- Not a trading platform
- Analytics & Decision Intelligence focused
- Multi-asset coverage: Stocks, Crypto, Forex, Commodities
- Bloomberg-style professional UI

---

## PHASE A: Dashboard & Data Collection

### 1. API Setup & Configuration

**Backend Changes**

Create `backend/app/services/financial_service.py`:
```python
# Financial API integrations
- CoinGecko (Crypto) - FREE
- Twelve Data (Stocks) - FREE tier available
- Frankfurter API (Forex) - FREE
- GoldAPI (Commodities) - FREE
- Fear & Greed Index API - FREE
- NewsAPI (Financial News) - FREE tier
```

Create `backend/.env` additions:
```
COINGECKO_API_URL=https://api.coingecko.com/api/v3
TWELVEDATA_API_KEY=your_key_here
FRANKFURTER_API_URL=https://api.frankfurter.app
GOLDAPI_API_KEY=your_key_here
FEARGREED_API_URL=https://api.alternative.me/fng
NEWSAPI_KEY=your_key_here
```

### 2. Database Schema

Create `backend/alembic/versions/004_add_financial_tables.py`:

Tables needed:
```sql
- financial_current (live market data)
- financial_history (historical records)
- stock_current (live stock prices)
- stock_history (historical prices)
- crypto_current (live crypto data)
- crypto_history (historical crypto)
- forex_current (live rates)
- commodity_current (gold, silver, oil)
- market_sentiment (fear & greed index)
- market_news (financial news)
- prediction_logs (ML model outputs)
- model_metrics (model performance)
- alerts (user-defined rules)
- watchlist (user's tracked assets)
```

### 3. Backend API Endpoints

Create `backend/app/api/v1/endpoints/financial.py`:

**Market Overview**
```
GET /api/v1/financial/overview
  Returns: Nifty, Sensex, NASDAQ, S&P500, Dow, BTC, ETH, Gold, Silver, USD/INR, EUR/INR
  Fields: current_price, daily_change%, weekly_change%, sparkline (7 days), status

GET /api/v1/financial/market-status
  Returns: Markets Open/Closed, Holiday Calendar, Countdown to next open

GET /api/v1/financial/top-gainers
  Returns: Top 10 gainers with prices, % change, volume

GET /api/v1/financial/top-losers
  Returns: Top 10 losers with prices, % change, volume

GET /api/v1/financial/trending-crypto
  Returns: Top 10 trending cryptocurrencies with data
```

**Stock Intelligence**
```
GET /api/v1/financial/stocks/search?symbol=RELIANCE
  Returns: Company overview, current price, market cap, P/E, dividend, revenue, profit

GET /api/v1/financial/stocks/{symbol}/chart
  Params: interval (1m, 5m, 15m, 1h, 1d), period (7d, 1m, 3m, 6m, 1y)
  Returns: OHLCV candlestick data

GET /api/v1/financial/stocks/{symbol}/indicators
  Returns: MA, EMA, RSI, MACD, ATR

GET /api/v1/financial/stocks/compare
  Params: symbols=RELIANCE,TCS,INFY
  Returns: Comparison chart and metrics
```

**Crypto Intelligence**
```
GET /api/v1/financial/crypto/{symbol}
  Returns: Live price, market cap, volume, dominance, 24h change

GET /api/v1/financial/crypto/sentiment
  Returns: Fear & Greed Index with historical trend

GET /api/v1/financial/crypto/correlation
  Returns: BTC vs Gold, BTC vs NASDAQ, etc.
```

**Forex & Commodities**
```
GET /api/v1/financial/forex/rates
  Returns: USD/INR, EUR/INR, GBP/INR, JPY/INR, historical charts

GET /api/v1/financial/commodities/{commodity}
  Params: commodity = gold, silver, oil, natural_gas
  Returns: Current price, historical prices, trend
```

**News**
```
GET /api/v1/financial/news
  Params: category (stocks, crypto, forex, general), limit=10
  Returns: Latest headlines with source, publish time, URL
```

### 4. Scheduler Job

Create `backend/app/scheduler/financial_jobs.py`:

```python
# Run every 5-15 minutes depending on API limits
- Fetch live market prices
- Update top gainers/losers
- Collect fear & greed index
- Fetch latest news
- Cache results for 5 minutes to respect API rate limits

# Run daily (after market close)
- Calculate daily technical indicators
- Archive old data
- Update prediction models
```

---

## PHASE B: Frontend Dashboard

### 1. Page Structure

Create `frontend/src/pages/Finance.tsx` with sections:

**Market Overview Cards** (Responsive Grid)
```
Nifty 50          NASDAQ            Bitcoin
30,456            15,234            45,678
+1.23% ↑          -0.45% ↓          +3.21% ↑
Sparkline         Sparkline         Sparkline

Sensex            S&P 500           Ethereum
[Similar]         [Similar]         [Similar]
```

**Market Status Bar**
```
Markets Open | Next Close 15:30 | No Holiday
or
Markets Closed | Opens Tomorrow 09:15 | Holiday Calendar
```

**Top Gainers & Losers Grid**
```
Top 10 Gainers          Top 10 Losers           Most Active (Volume)
1. TCS +5.23%           1. Bank Name -3.45%     1. Company +2.3B Volume
2. Wipro +4.12%         2. Stock -2.89%         2. Stock +1.8B Volume
...
```

**Trending Crypto**
```
Bitcoin              Ethereum            Cardano
Price: $45,678       Price: $2,345       Price: $0.45
24h: +3.21%          24h: +2.15%         24h: +1.05%
Market Cap Rank: 1   Market Cap Rank: 2  Market Cap Rank: 5
```

**Fear & Greed Index**
```
Large Gauge showing: Extreme Fear (12) | Fear (25) | Neutral (50) | Greed (75) | Extreme Greed (88)
Weekly historical chart below
```

**Gold & Forex Cards**
```
Gold (₹)            USD/INR             EUR/INR
₹6,234/g            ₹82.45              ₹89.23
+0.45% ↑            +0.12% ↑            -0.08% ↓
Sparkline           Sparkline           Sparkline

Silver (₹)          GBP/INR             JPY/INR
₹78,234/kg          ₹103.45             ₹0.56
+0.23% ↑            +0.18% ↑            +0.05% ↑
```

**Breaking News**
```
Latest Financial News Headlines
[Headline 1] - Source | 5 min ago
[Headline 2] - Source | 12 min ago
[Headline 3] - Source | 23 min ago
Load More...
```

### 2. Component Structure

```
Finance/
├── components/
│   ├── MarketCard.tsx (reusable index card)
│   ├── MarketStatus.tsx (open/close countdown)
│   ├── TopMovers.tsx (gainers & losers table)
│   ├── TrendingCrypto.tsx (crypto grid)
│   ├── FearGreedGauge.tsx (custom gauge chart)
│   ├── CommodityCard.tsx (gold, silver cards)
│   ├── NewsPanel.tsx (news feed)
│   └── MarketOverviewGrid.tsx (main layout)
├── hooks/
│   ├── useFinancialData.ts (API calls)
│   ├── useMarketStatus.ts (market open/close logic)
│   └── useCryptoData.ts (crypto-specific data)
└── types/
    ├── financial.ts (TypeScript types)
    └── market.ts (market-related types)
```

### 3. Types File

Create `frontend/src/types/financial.ts`:

```typescript
interface MarketIndex {
  symbol: string
  name: string
  current_price: number
  daily_change_percent: number
  weekly_change_percent: number
  sparkline: number[] // 7 days
  status: 'open' | 'closed' | 'holiday'
  last_updated: string
}

interface StockData {
  symbol: string
  name: string
  current_price: number
  daily_change: number
  volume: number
  market_cap: number
  pe_ratio: number
  dividend: number
}

interface CryptoData {
  symbol: string
  name: string
  current_price: number
  market_cap: number
  volume_24h: number
  circulating_supply: number
  price_change_24h: number
  ath: number
  atl: number
}

interface ForexRate {
  pair: string // "USD/INR"
  rate: number
  change_percent: number
  timestamp: string
}

interface MarketSentiment {
  fear_greed_score: number // 0-100
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed'
  history: Array<{ date: string; score: number }>
}

interface FinancialNews {
  headline: string
  category: string
  source: string
  published_at: string
  url: string
}
```

---

## PHASE C: Stock & Crypto Analysis Pages

### 1. Stock Analysis Page

Create `frontend/src/pages/Finance/StockAnalysis.tsx`:

**Search & Company Overview**
```
Search Bar → Company dropdown
Company Info Card:
  - Name, Symbol
  - Current Price
  - 52 Week High/Low
  - Market Cap
  - P/E Ratio
  - Dividend Yield
  - Revenue
  - Profit/Loss
```

**Historical Charts**
```
Tabs: Candlestick | Volume | Moving Avg | EMA | RSI | MACD

Chart Controls:
  - Interval: 1m, 5m, 15m, 1h, 1d
  - Period: 7d, 1m, 3m, 6m, 1y
  - Compare: Add up to 5 companies
  - Export: CSV download
```

### 2. Crypto Analysis Page

Create `frontend/src/pages/Finance/CryptoAnalysis.tsx`:

**Crypto Data Grid**
```
Coin Name      Price       Market Cap    Volume      24h Change   Dominance
Bitcoin        $45,678     $890B         $45B        +3.21%       42.5%
Ethereum       $2,345      $280B         $18B        +2.15%       18.2%
...
```

**Crypto Details**
```
Live price chart with:
  - Dominance % trend
  - Volume 24h
  - Top gainers/losers
  - Whale activity (if available)
  - Fear & Greed Index relation
```

**Correlation Analysis**
```
BTC vs Gold correlation chart
BTC vs NASDAQ correlation chart
ETH vs BTC correlation chart
```

### 3. Forex & Commodities Page

Create `frontend/src/pages/Finance/ForexCommodities.tsx`:

**Currency Dashboard**
```
USD/INR    EUR/INR    GBP/INR    JPY/INR
82.45      89.23      103.45     0.56
+0.12% ↑   -0.08% ↓   +0.18% ↑   +0.05% ↑
30-day chart below each
```

**Commodities**
```
Gold        Silver      Oil         Natural Gas
₹6,234/g    ₹78,234/kg  $89.23/bbl  $3.45/mmbtu
+0.45% ↑    +0.23% ↑    +1.23% ↑    -0.45% ↓
```

---

## PHASE D: Market Analytics Page

Create `frontend/src/pages/Finance/MarketAnalytics.tsx`:

**Advanced Analytics Tabs**

### 1. Trend Analysis
```
Component: TrendAnalyzer
Displays:
  - Bullish Trend (uptrend with support/resistance)
  - Bearish Trend (downtrend with resistance/support)
  - Sideways (consolidation range)
  - Momentum indicator
  - Volatility bands
```

### 2. Volatility Analysis
```
Component: VolatilityDashboard
Shows:
  - Daily volatility %
  - Weekly volatility %
  - Monthly volatility %
  - Historical volatility chart
  - IV (Implied Volatility) for options
```

### 3. Correlation Matrix
```
Component: CorrelationMatrix
Heatmap showing correlation between:
  - BTC vs Gold
  - Gold vs USD/INR
  - Nifty vs Sensex
  - BTC vs NASDAQ
  - ETH vs BTC
  - Stocks vs Sectors
```

### 4. Pattern Recognition
```
Component: PatternDetector
Identifies:
  - Support & Resistance levels
  - Breakout signals
  - Reversal patterns
  - Accumulation zones
  - Distribution zones
```

### 5. Market Breadth
```
Component: MarketBreadth
Shows:
  - Advance/Decline ratio
  - Volume leaders
  - Sector strength
  - Market sentiment gauge
  - Participation rate
```

### 6. Sector Performance
```
Component: SectorPerformance
Table showing:
  Sector        Performance   Change    Leaders
  Technology    +2.34%        +234 pts  TCS, Wipro
  Banking       +1.23%        +156 pts  HDFC, ICICI
  ...
```

### 7. Anomaly Detection
```
Component: AnomalyDetector
Alerts on:
  - Stocks moving unusually (e.g., gap up/down >5%)
  - Crypto spikes (volume >200% normal)
  - Sudden crashes
  - Volume explosions
  - Technical breakouts
```

### 8. Risk Analysis
```
Component: RiskAssessment
Shows:
  - Risk Level: Low | Medium | High
  - Confidence Score: 0-100%
  - Forecast Accuracy: Compare predictions vs reality
  - Model Performance tracking
```

---

## PHASE E: Decision Center (Later Phase)

### Features (Placeholder for now)
```
1. AI Insights (via Ollama)
   - Pattern analysis
   - Sentiment interpretation
   - Risk warnings

2. ML Predictions
   - 1-day, 1-week forecast
   - Confidence scores
   - Model performance metrics

3. Alert Engine
   - User-defined rules
   - Real-time notifications
   - Historical alert tracking

4. Portfolio Risk Score
   - Overall portfolio health
   - Sector exposure
   - Concentration risk
```

---

## Implementation Order

### Week 1: Backend Foundation
- [ ] API integrations (CoinGecko, Twelve Data, etc.)
- [ ] Database schema & migrations
- [ ] Backend endpoints (Phase A)
- [ ] Scheduler jobs

### Week 2: Frontend Dashboard
- [ ] Market Overview cards & layout
- [ ] API integration in frontend
- [ ] Market Status component
- [ ] Top Gainers/Losers, Trending Crypto
- [ ] Fear & Greed gauge
- [ ] News panel

### Week 3: Analysis Pages
- [ ] Stock Analysis page
- [ ] Crypto Analysis page
- [ ] Forex & Commodities page

### Week 4: Advanced Analytics
- [ ] Market Analytics page
- [ ] Trend, Volatility, Correlation components
- [ ] Pattern Recognition
- [ ] Anomaly Detection
- [ ] Risk Analysis

### Week 5: Polish & Optimization
- [ ] Performance optimization
- [ ] Responsive design improvements
- [ ] Error handling & loading states
- [ ] Caching strategy
- [ ] Testing

### Week 6+: Decision Center
- [ ] Ollama integration
- [ ] ML models training
- [ ] Alert engine
- [ ] Predictions system

---

## Technology Stack

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- Async HTTP requests (httpx)
- APScheduler
- Pandas (data processing)

**Frontend:**
- React 19
- TypeScript
- Recharts (financial charts)
- TradingView Lightweight Charts (advanced candlesticks)
- Tailwind CSS
- Framer Motion

**Database:**
- PostgreSQL (Supabase)

**APIs:**
- CoinGecko (Crypto) - FREE
- Twelve Data (Stocks) - FREE tier
- Frankfurter (Forex) - FREE
- GoldAPI (Commodities) - FREE
- Alternative.me (Fear & Greed) - FREE
- NewsAPI (Financial News) - FREE tier

---

## Success Criteria

✅ Professional Bloomberg-style dashboard
✅ Multi-asset analysis (stocks, crypto, forex, commodities)
✅ Live data from multiple APIs
✅ Advanced analytics (not just charts)
✅ AI-generated insights via Ollama
✅ ML predictions with confidence scores
✅ Intelligent alert engine
✅ Fully responsive UI
✅ Consistent architecture with Weather module
✅ Easily extensible for future modules

---

## Notes

- This follows the same architecture as Weather Intelligence
- Data collection happens automatically every 5-15 minutes
- Historical data is stored for analytics & ML training
- APIs are free (no paid subscriptions required)
- UI is professional, not gamified
- Focus is on Analytics & Intelligence, not trading signals
