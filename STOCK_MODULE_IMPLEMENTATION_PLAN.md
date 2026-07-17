# Stock Intelligence Module - Implementation Plan

**Phase**: Foundation & Core Features
**Timeline**: Week 1-2
**Priority**: Building professional platform from scratch

---

## 🎯 Immediate Priorities (Next 48 Hours)

### Priority 1: Dynamic Stock Search (MUST HAVE)
**Goal**: Remove hardcoded list, implement real search

#### Frontend Changes Required:
1. Create new `/finance/stocks/search` page
2. Implement search input with autocomplete
3. Show stock cards dynamically (no fixed list)
4. Support both Indian (NSE/BSE) and Global (NASDAQ/NYSE) stocks

#### Backend Changes Required:
1. Create `/api/v1/financial/search` endpoint
   - Parameter: `query` (symbol or name)
   - Parameter: `type` (stock, crypto, etc.)
   - Parameter: `exchange` (filter by NSE/NASDAQ/etc.)
   - Returns: List of matching stocks with basic info

2. Create `/api/v1/financial/market/movers` endpoint
   - Returns: Top gainers, losers, most active, highest volume
   - Used for market dashboard

#### Sample Implementation:
```python
GET /api/v1/financial/search?q=reliance&limit=10
Response:
{
  "results": [
    {
      "symbol": "RELIANCE",
      "name": "Reliance Industries Ltd",
      "exchange": "NSE",
      "price": 2845.50,
      "change": 2.35,
      "marketCap": "24.5T",
      "sector": "Energy"
    }
  ]
}
```

---

### Priority 2: Stock Detail Page - Architecture
**Goal**: Create full-featured analytics page

#### Page Structure:
```
/finance/stock/:symbol

Main Layout:
- Header (stock info, controls)
- Sidebar (key metrics, alerts)
- Main content (tabs for different analyses)
  - Chart Tab (candlestick, volume, indicators)
  - Technical Analysis Tab (indicators, signals)
  - Fundamental Analysis Tab (ratios, metrics)
  - Financial Statements Tab (income, balance, cash)
  - Company Info Tab (profile, competitors)
  - News Tab (company news)
  - AI Insights Tab (predictions, recommendations)
```

#### Components Needed:
```typescript
// Pages
/finance/stock/[symbol].tsx

// Components
/components/stock/
├── StockHeader.tsx
├── StockMetrics.tsx
├── PriceChart.tsx
├── TechnicalAnalysisTab.tsx
├── FundamentalAnalysisTab.tsx
├── FinancialStatementsTab.tsx
├── CompanyProfileTab.tsx
├── NewsTab.tsx
└── AIInsightsTab.tsx
```

---

### Priority 3: Market Movers Dashboard
**Goal**: Show gainers, losers, trending, active on /finance/stocks page

#### Components:
```
Market Movers Section
├─ Top Gainers (5 cards)
├─ Top Losers (5 cards)
├─ Most Active (5 cards)
├─ Trending Stocks (5 cards)
└─ Load More button
```

---

## 📋 Week 1 Deliverables

### Day 1-2: Backend Setup

**Endpoints to Create**:
1. ✅ `/stock/quote` (already exists)
2. ✅ `/stock/timeseries` (already exists)
3. 🆕 `/search` - Stock search with autocomplete
4. 🆕 `/market/movers` - Gainers/losers/active
5. 🆕 `/market/trending` - Trending stocks
6. 🆕 `/stock/{symbol}/fundamentals` - Financial ratios
7. 🆕 `/stock/{symbol}/company` - Company profile (can be mock initially)
8. 🆕 `/stock/{symbol}/news` - Stock-specific news

**Mock Data Strategy**:
- Create comprehensive stock database (~50 stocks)
- Generate realistic prices based on market data
- Create trending/movers algorithms
- Cache for performance

### Day 3-4: Frontend - Search & Discovery

**New Components**:
1. StockSearch page (`/finance/stocks/search`)
2. StockCard component (enhanced)
3. MarketMovers component
4. Watchlist section

**Features**:
- Real-time search
- Autocomplete suggestions
- Market movers display
- Watchlist integration
- Recently viewed tracking

### Day 5: Frontend - Detail Page Skeleton

**New Components**:
1. StockDetail page (`/finance/stock/:symbol`)
2. StockHeader component
3. StockMetrics sidebar
4. Tab navigation system
5. Placeholder tabs for each analysis type

**Not Yet Implemented**:
- Charts (placeholder)
- Indicators (placeholder)
- News (placeholder)

---

## 📋 Week 2 Deliverables

### Day 1-2: Charts & Visualization

**Implement**:
1. Candlestick chart (Recharts)
2. Line chart
3. Area chart
4. Volume chart (bar chart below price)
5. Chart controls (timeframes: 1D, 5D, 1M, 3M, 6M, 1Y, 5Y, MAX)
6. Crosshair and tooltip

**Components**:
- `PriceChart.tsx` - Main chart
- `VolumeChart.tsx` - Volume analysis
- `ChartControls.tsx` - UI controls

### Day 3-4: Technical Indicators

**Implement**:
1. RSI (Relative Strength Index)
2. MACD (Moving Average Convergence Divergence)
3. SMA (Simple Moving Average)
4. EMA (Exponential Moving Average)
5. Bollinger Bands
6. Stochastic RSI
7. VWAP
8. ATR
9. DX

**Features**:
- Automatic signal generation (Strong Buy/Buy/Neutral/Sell/Strong Sell)
- Indicator overlay on charts
- Customizable indicator parameters
- Save favorite combinations

**Component**:
- `IndicatorPanel.tsx`
- `TechnicalAnalysisTab.tsx`

### Day 5: Fundamental Analysis & Company Info

**Implement**:
1. Financial ratios display (P/E, PB, EPS, ROE, ROA, Debt, etc.)
2. Company profile (logo, name, sector, industry, employees, etc.)
3. Competitor comparison
4. Market position analysis

**Components**:
- `FundamentalAnalysisTab.tsx`
- `CompanyProfileTab.tsx`

---

## 🔌 API Endpoints - Priority Order

### TIER 1 (MUST HAVE - Week 1)
```
1. POST /api/v1/financial/search
   Search stocks by symbol or name
   
2. GET /api/v1/financial/market/movers
   Top gainers, losers, active, volume
   
3. GET /api/v1/financial/market/trending
   Trending stocks
   
4. GET /api/v1/financial/stock/{symbol}/fundamentals
   Financial ratios and metrics
   
5. GET /api/v1/financial/stock/{symbol}/company
   Company profile information
```

### TIER 2 (IMPORTANT - Week 2)
```
6. GET /api/v1/financial/stock/{symbol}/technical-analysis
   Pre-calculated technical indicators and signals
   
7. GET /api/v1/financial/stock/{symbol}/financial-statements
   Income statement, balance sheet, cash flow (multi-year)
   
8. GET /api/v1/financial/stock/{symbol}/news
   Company-specific news articles
   
9. GET /api/v1/financial/stock/{symbol}/competitors
   List of competitors
   
10. GET /api/v1/financial/stock/batch?symbols=A,B,C
    Get quotes for multiple stocks at once
```

### TIER 3 (NICE TO HAVE - Later)
```
11. GET /api/v1/financial/stock/{symbol}/alerts
    User's price and technical alerts
    
12. POST /api/v1/financial/stock/{symbol}/alerts
    Create new alert
    
13. GET /api/v1/financial/portfolio
    User's portfolio (requires auth)
    
14. GET /api/v1/financial/screener
    Stock screener with filters
    
15. GET /api/v1/financial/ai/predict/{symbol}
    AI price prediction (Ollama integration)
```

---

## 🗂️ Project Structure

### Backend
```
/backend/app/
├── api/v1/endpoints/
│   ├── financial.py          (add new endpoints here)
│   └── stock.py              (NEW - stock-specific endpoints)
│
├── services/
│   ├── financial_service.py
│   └── stock_service.py      (NEW - stock data logic)
│
├── schemas/
│   ├── financial.py
│   └── stock.py              (NEW - stock data models)
│
└── models/
    └── stock.py              (NEW - database models if needed)
```

### Frontend
```
/frontend/src/
├── pages/
│   ├── Stocks.tsx            (Main search/discovery page)
│   ├── stock/
│   │   └── [symbol].tsx      (Detail page - NEW)
│   └── StockDetail.tsx        (Alternative structure)
│
├── components/stock/         (NEW FOLDER)
│   ├── StockHeader.tsx
│   ├── StockMetrics.tsx
│   ├── PriceChart.tsx
│   ├── VolumeChart.tsx
│   ├── IndicatorPanel.tsx
│   ├── TechnicalAnalysisTab.tsx
│   ├── FundamentalAnalysisTab.tsx
│   ├── FinancialStatementsTab.tsx
│   ├── CompanyProfileTab.tsx
│   ├── NewsTab.tsx
│   ├── AIInsightsTab.tsx
│   ├── StockComparison.tsx
│   └── MarketMovers.tsx
│
├── hooks/
│   ├── useFinancialData.ts   (add stock hooks)
│   └── useStockData.ts       (NEW - stock-specific hooks)
│
└── types/
    ├── financial.ts
    └── stock.ts              (NEW - stock types)
```

---

## 🔄 Data Flow Example: Search for Stock

### User Action
```
User types "reliance" in search box
```

### Frontend:
```typescript
// Hooks/useStockData.ts
export function useStockSearch(query: string) {
  return useQuery({
    queryKey: ['stock', 'search', query],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/financial/search?q=${query}&limit=20`
      )
      return response.json()
    },
    enabled: query.length >= 1,
    debounceTime: 300,
  })
}

// Pages/Stocks.tsx
const { data: searchResults } = useStockSearch(searchQuery)
// Display results as cards
```

### Backend:
```python
# endpoints/stock.py
@router.get("/search")
async def search_stocks(q: str, limit: int = 20):
    # Search in stock database
    results = await stock_service.search(q, limit)
    return {"results": results}

# services/stock_service.py
async def search(query: str, limit: int):
    # Query Twelve Data or local database
    # Return matching stocks with basic info
```

### Response:
```json
{
  "results": [
    {
      "symbol": "RELIANCE",
      "name": "Reliance Industries",
      "exchange": "NSE",
      "price": 2845.50,
      "change": 2.35,
      "sector": "Energy"
    },
    // More results...
  ]
}
```

### Frontend Displays:
```
Stock cards with search results
- Click a card → Navigate to detail page
- Star icon → Add to watchlist
- Pin icon → Pin to favorites
```

---

## 📦 Mock Data Strategy

### Stock Database
```python
STOCKS_DATABASE = {
    "RELIANCE": {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd",
        "exchange": "NSE",
        "sector": "Energy",
        "industry": "Oil & Gas",
        "market_cap": 24500000000000,  # ₹24.5T
        # ... more data
    },
    # 50+ more stocks
}
```

### Realistic Data Generation
- Prices: Use recent historical prices
- Changes: Generate realistic daily movements
- Movers: Calculate top gainers/losers
- Trends: Analyze price patterns
- News: Use mock articles with sentiment

---

## ✅ Checklist

### Week 1
- [ ] Backend search endpoint
- [ ] Backend market movers endpoint
- [ ] Backend stock fundamentals endpoint
- [ ] Frontend search page (dynamic list)
- [ ] Frontend market movers display
- [ ] Stock cards with live data
- [ ] Watchlist integration
- [ ] Route to detail page

### Week 2
- [ ] Detail page skeleton with tabs
- [ ] Candlestick and volume charts
- [ ] Technical indicators implementation
- [ ] Fundamental analysis tab
- [ ] Company profile tab
- [ ] News section
- [ ] AI Insights placeholder
- [ ] Responsive design

---

## 🎯 Success Criteria

By end of Week 1:
- ✅ Can search any stock
- ✅ See market movers
- ✅ Add/remove from watchlist
- ✅ Click stock to view details (basic)

By end of Week 2:
- ✅ Full detail page with all tabs
- ✅ Interactive charts
- ✅ Technical indicators
- ✅ Company information
- ✅ Responsive mobile/tablet/desktop
- ✅ Professional-grade analytics

---

## 🚀 Quick Start Commands

### Run Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Run Frontend
```bash
cd frontend
npm run dev
```

### Build Charts
```bash
cd frontend
npm install recharts recharts-legend
```

---

**Version**: 1.0
**Status**: Ready for Implementation
**Next Review**: End of Week 1

