# Future Architecture: Hybrid API-First + Smart Caching

**Status:** Planning Document (Reference for Phase C+)  
**Created:** July 11, 2026  
**Apply After:** Weather module is fully complete (Phase B done)  
**Target Phases:** Phase C, D, E and beyond

---

## Executive Summary

Instead of storing everything, use **3-category API architecture**:

| Category | Strategy | Example | Store | Cache |
|----------|----------|---------|-------|-------|
| **A** | API has history | Weather, Crypto, Stocks, Earthquakes | Models only | 24-48h |
| **B** | API no history | Traffic, Real-time sensors | Everything | N/A |
| **C** | Derived analytics | Rankings, scores, trends | Calculations | N/A |

**Result:** Database shrinks from ~500GB to ~2-5GB

---

## Architecture Overview

### Current Approach (Phase A/B - Weather Only)

```
Open-Meteo API
      ↓
Your Database (store everything)
      ↓
Dashboard (visualize)
      ↓
ML (train on stored data)
```

**Problem:** Works for weather, but doesn't scale well for other modules.

### Future Approach (Phase C+ - Multi-Module)

```
┌─────────────────────────────────────────────────────────────┐
│                    API Warehouse                            │
│                                                              │
│  Category A          Category B          Category C          │
│  (History in API)    (Build History)     (Derived)           │
│  ✓ Weather          ✓ Traffic            ✓ Rankings         │
│  ✓ Crypto           ✓ Sensors            ✓ Scores           │
│  ✓ Stocks           ✓ Real-time Data     ✓ Trends           │
│  ✓ Earthquakes                          ✓ Predictions       │
│  ✓ Exchange Rates                       ✓ Alerts            │
│  ✓ Economic Data                                             │
└─────────────────────────────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │ Redis Cache  │ (24-48h recent data)
    │ (Optional)   │
    └──────────────┘
           ↓
    ┌──────────────┐
    │ Your DB      │ (User prefs, models, derived analytics)
    │ (Minimal)    │ ~2-5GB total
    └──────────────┘
           ↓
    ┌──────────────┐
    │  Dashboard   │
    └──────────────┘
```

---

## Category A: APIs That Provide History ⭐

### When to Use

APIs already have years of historical data. Don't duplicate.

### Examples

**1. Weather**
- Provider: Open-Meteo
- History: 1940 to today (via ERA5)
- What you store: Models, cached recent data, aggregations

**2. Cryptocurrency**
- Provider: CoinGecko, Binance
- History: Years of daily OHLCV data
- What you store: Models, predictions, user favorites

**3. Stocks**
- Provider: Yahoo Finance, Stooq, Alpha Vantage
- History: Years of daily prices
- What you store: Models, watch lists, alerts

**4. Exchange Rates**
- Provider: Frankfurter, OANDA
- History: Years of daily rates
- What you store: Models, user preferences

**5. Earthquakes**
- Provider: USGS Earthquake Hazards Program
- History: All recorded earthquakes (decades)
- What you store: Analysis results, predictions, user alerts

**6. Economic Data**
- Provider: FRED (Federal Reserve), World Bank, OECD
- History: Decades of economic indicators
- What you store: Custom calculated indices, alerts

### Data Flow for Category A

```
USER REQUEST
    ↓
Backend checks: Is recent data cached?
    ├─ YES → Return from cache (fast)
    ├─ NO → Query API for last 5 years
    │       ↓
    │       Cache it (Redis or DB)
    │       ↓
    │       Return to dashboard
    └─ For ML: Download dataset on demand
               Train model
               Save model.pkl
               Discard dataset
```

### Example: Bitcoin Price Prediction

```
SCENARIO: User requests Bitcoin prediction

Step 1: Fetch data
  Backend → CoinGecko API → Request last 5 years of BTC daily prices
         → Get: JSON with 1,825 rows (5 years × 365 days)

Step 2: Train model
  Load data → Feature engineering → Train RandomForest
           → Accuracy: 92%
           → Model size: 2.5 MB

Step 3: Save
  Save: bitcoin_model_v3.pkl (2.5 MB)
  Save: Metrics (accuracy, test loss)
  Save: Last known price (for next prediction)
  Delete: training_data.csv (no longer needed)

Step 4: Dashboard shows
  Current Price: $45,230
  7-day Prediction: $45,500 (±$1,200)
  Confidence: 92%

Step 5: Next week
  Fetch new data → Retrain → Update model
```

---

## Category B: APIs Without History

### When to Use

API only provides real-time data. You must build the history.

### Examples

**1. Traffic Data** (if using free real-time API)
- Current state only
- Must poll every 5 minutes
- Store to build history

**2. Sensor Networks** (IoT)
- Real-time temperature, humidity
- No API history
- Must aggregate yourself

**3. Custom Data Feeds**
- Your own data sources
- No built-in history
- You own the archival

### Data Flow for Category B

```
API (Real-time only)
    ↓ Every 5-15 minutes
Your Database (accumulate)
    ↓
Historical trends
    ↓
Analytics & ML
```

### Storage Strategy for Category B

```
Day 1-30: Keep hourly data
    ↓
Day 31: Aggregate to daily summaries
    ↓
Keep daily forever (minimal space)
    ↓
Delete old hourly (frees 80% of space)
```

---

## Category C: Derived Analytics

### What It Is

Data that doesn't exist in any API. You calculate it.

### Examples

**1. Rankings**
- Top 10 hottest cities today
- Top 10 worst AQI areas
- Highest price movers (crypto)

**2. Scores**
- Air quality score (custom formula)
- Climate risk index
- Economic health index

**3. Trends & Patterns**
- 7-day moving average
- Seasonal analysis
- Volatility measures

**4. Predictions**
- Weather forecast (from model)
- Stock price prediction
- Earthquake hotspots

**5. Alerts**
- Price threshold breached
- AQI above dangerous level
- Earthquake detected

### Storage Strategy for Category C

Only store the **result**, not the calculation.

```
Example: Top 10 Hottest Cities in India

Store this:
┌──────────────────────────────────┐
│ top_10_hottest                   │
├──────────────────────────────────┤
│ Rank | City        | Temp | Time │
├──────────────────────────────────┤
│ 1    | Delhi       | 42°C | 14:00│
│ 2    | Jaipur      | 41°C | 14:00│
│ 3    | Lucknow     | 40°C | 14:00│
│ ...  | ...         | ...  | ...  │
└──────────────────────────────────┘

NOT this (raw data):
```

---

## Hybrid Strategy for InsightHub AI

### Phase B (Current - Weather)

```
Keep current approach (all data stored):
  └─ Justifiable: Want long-term weather analysis
  └─ Keep: 90 days hourly + daily summaries forever
  └─ Use: For ML training with seasonal patterns
```

### Phase C (New Modules)

```
NEW: Cryptocurrency
  ├─ Category A (API has history)
  ├─ Cache last 48h
  ├─ Train on full CoinGecko history (on demand)
  ├─ Store: Models + predictions + user watchlists
  └─ Database impact: +50 MB

NEW: Stocks
  ├─ Category A (API has history)
  ├─ Cache last 48h
  ├─ Train on Yahoo Finance (on demand)
  ├─ Store: Models + user portfolios
  └─ Database impact: +100 MB

NEW: Earthquakes
  ├─ Category A (API has history - USGS)
  ├─ Query on demand
  ├─ Calculate: Frequency, hotspots, predictions
  ├─ Store: User alerts + analysis
  └─ Database impact: +25 MB
```

### Total Database Size

```
Phase A: Weather data
  └─ 300 MB (90-day hourly + summaries)

Phase B: Same
  └─ 300 MB

Phase C: Add Crypto + Stocks + Earthquakes
  └─ 300 MB (weather)
  + 50 MB (crypto)
  + 100 MB (stocks)
  + 25 MB (earthquakes)
  + 75 MB (user data + models)
  ─────────
  = 550 MB (still fits Supabase free tier!)
```

---

## Implementation Pattern

### For Each Category A Module

```
1. Setup API Client
   ├─ Create service/crypto_service.py
   ├─ Handle API auth
   ├─ Rate limiting
   └─ Error handling

2. Create On-Demand Fetcher
   ├─ GET /api/v1/crypto/historical?symbol=BTC&days=1825
   │   └─ Fetches 5 years from API
   ├─ Cache result (Redis optional)
   └─ Return to user

3. Create ML Pipeline
   ├─ Accepts cached data
   ├─ Trains model
   ├─ Saves model.pkl
   ├─ Discards training data
   └─ Returns predictions

4. User Dashboard
   ├─ Shows recent data (from cache)
   ├─ Shows predictions (from model)
   ├─ Shows analytics (from calculations)
   └─ NO raw historical data shown
```

### Database Schema (Minimal)

```sql
-- User data
users
user_preferences
watchlists
favorites
alerts

-- Models
ml_models
model_metrics

-- Cached data (recent only)
crypto_cache (last 48h)
stock_cache (last 48h)

-- Derived analytics
rankings
predictions
alerts_log

Total: ~20 tables, ~50 MB
(NOT storing raw historical data for Category A modules)
```

---

## Resilience: What If API Goes Down?

### Problem
```
CoinGecko down for 1 hour
  └─ Users can't see Bitcoin price
  └─ Dashboard breaks
```

### Solution: Multi-Layer Cache

```
Layer 1: Redis Cache (fastest)
  └─ Last 24h of prices
  └─ TTL: 24h
  └─ If available: return instantly

Layer 2: Database Cache (fallback)
  └─ Last 48h of prices
  └─ Compressed storage
  └─ If Redis empty: load from DB

Layer 3: API (fresh data)
  └─ Try to fetch new data
  └─ If API down: use Layer 2
  └─ Show "Data from 2h ago" indicator
```

### Implementation

```python
@app.get("/api/v1/crypto/bitcoin")
async def get_bitcoin_price():
    # Layer 1: Check Redis
    cached = await redis.get("BTC:price")
    if cached:
        return JSONResponse(cached, headers={"X-Cache": "redis"})
    
    # Layer 2: Check Database
    db_cache = await db.query(CryptoCache).filter(symbol="BTC").first()
    if db_cache:
        return JSONResponse(db_cache, headers={"X-Cache": "database"})
    
    # Layer 3: Try API
    try:
        price = await fetch_from_coingecko("bitcoin")
        await redis.set("BTC:price", price, ttl=3600)
        return JSONResponse(price, headers={"X-Cache": "api"})
    except APIError:
        # API down, return oldest cache + warning
        return JSONResponse(
            db_cache,
            headers={"X-Cache": "database-stale", "X-Warning": "API unavailable"}
        )
```

---

## ML Training Pattern for Category A

### Before (Current - Store Everything)

```
Step 1: Collect weather data for 1 year
Step 2: Store in database (~500 MB)
Step 3: Train model
Step 4: Keep database forever (~500 MB ongoing)
```

### After (New - On-Demand Training)

```
Step 1: User requests prediction
Step 2: Fetch last 5 years from API (on demand)
Step 3: Train model on downloaded data
Step 4: Save only model.pkl (~2 MB)
Step 5: Delete downloaded data
Step 6: Return prediction
```

### Result

```
Before: 500 MB database + ongoing storage costs
After:  2 MB model + cache (24-48h) = ~100 MB total
        
Savings: ~80% database reduction
```

---

## Rollout Plan

### Phase B (This Month) ✅
- Complete Weather module with current storage approach
- Keep all weather data (justified)

### Phase C (Months 2-3)
- Launch Cryptocurrency module
  - Use API history approach (CoinGecko)
  - Minimal storage (models + cache)
  
- Launch Stocks module
  - Use API history approach (Yahoo Finance)
  - Minimal storage

- Launch Earthquakes module
  - Use API history approach (USGS)
  - Minimal storage

### Phase D (Months 4-5)
- Launch Exchange Rates
- Launch Economic Data

### Phase E+ (Future)
- Any new modules follow same pattern
- Database stays under 2 GB (easily scalable)

---

## Comparison: Old vs New Approach

### Old Approach (Current Weather)

```
Data Volume:     500 GB+ (years of data)
Database Cost:   $500+/month (production tier)
Maintenance:     High (manage aggregation, cleanup)
API Dependency:  Don't need (have all data)
Resilience:      High (own the data)
Speed:           High (local database)
Scalability:     Poor (adds storage per module)
```

### New Approach (Future Hybrid)

```
Data Volume:     2-5 GB (models + cache + derived)
Database Cost:   $10-50/month (standard tier)
Maintenance:     Low (just cache management)
API Dependency:  High (need API up)
Resilience:      Medium (cache provides buffer)
Speed:           Medium (API latency)
Scalability:     Excellent (same ~5 GB for 50 modules)
```

---

## When to Apply This

### ✅ APPLY When:
- Adding crypto, stocks, earthquakes modules
- Building multi-source analytics platform
- Database getting too large (>1 GB)
- Want to scale to 10+ data sources
- Focus on derived analytics, not raw data

### ❌ DON'T APPLY When:
- Building proprietary historical archive (your unique value)
- API might disappear or change
- Need complete offline capability
- Building for disconnected/offline use

---

## Decision Matrix

| Module | Store History? | Reason |
|--------|----------------|--------|
| **Weather** | YES* | Need seasonal patterns for ML |
| **Crypto** | NO | CoinGecko has complete history |
| **Stocks** | NO | Yahoo Finance has complete history |
| **Earthquakes** | NO | USGS has complete history |
| **Exchange** | NO | Frankfurter has complete history |
| **Economics** | NO | FRED/World Bank have history |
| **Traffic** | YES | Only real-time available |
| **IoT Sensors** | YES | You own the data sources |
| **Rankings** | YES | Derived from other data |
| **Predictions** | YES | ML model outputs |

*Weather: Keep 90-day hourly + daily summaries forever (not raw years)

---

## Summary: Three Rules

### Rule 1: Know Your Category
```
Is this data available historically in an API?
  ├─ YES → Category A (Cache + API-first)
  └─ NO → Category B (Store everything) or C (Derived only)
```

### Rule 2: Cache is Your Buffer
```
Even for Category A:
  └─ Cache 24-48h of recent data
  └─ Protects against API downtime
  └─ Provides instant dashboard response
  └─ Store only models, not raw data
```

### Rule 3: Store Only Intelligence
```
Never store raw data if unnecessary.
  └─ Store calculated results (rankings, predictions)
  └─ Store user data (preferences, favorites, alerts)
  └─ Store models (trained ML)
  └─ Delete: raw data after processing
```

---

## Next Steps

- [x] Document strategy (this file)
- [ ] Complete Phase B (Weather module - current approach)
- [ ] Review this plan before starting Phase C
- [ ] Implement Category A pattern for Crypto
- [ ] Add Redis cache for resilience
- [ ] Monitor database size and adjust

---

**Keep this document in your project wiki. Reference it when adding new data sources.**

