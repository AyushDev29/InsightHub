# InsightHub AI - Architecture Strategy & Future Scaling

**Document Purpose:** This outlines the long-term architecture principles for InsightHub AI to ensure scalability, data integrity, and proper analytics as the project grows through multiple phases.

**Last Updated:** July 11, 2026  
**Author:** Development Team  
**Status:** Reference Document (Keep in mind for all future upgrades)

---

## Core Principle: Separate Monitoring from Analysis

### The Key Insight

```
MISTAKE ❌
Analytics = Dashboard Cities
If user removes Delhi → Delhi removed from all analytics
Bad data → Wrong insights

CORRECT ✅
Monitoring Dashboard = User's 6 selected cities
Analysis Engine = ALL collected cities in country
User removes Delhi from dashboard → Delhi still in analytics
Complete dataset → Accurate insights
```

---

## Architecture Overview

### Layer 1: Live Monitoring Dashboard (User Customizable)

**What users see:**
- Country selector (Global context)
- Max 6 cities (customizable)
- Recent trends
- User preferences saved

**Example:**
```
🇮🇳 India ▼

Dashboard Cities:
[Mumbai ✕] [Delhi ✕] [Pune ✕] [Bangalore ✕] [Hyderabad ✕] [Chennai ✕]

+ Add City  Search... Nagpur  Nashik  Surat  Ahmedabad  Kochi
```

**Rules:**
- Minimum: 1 city
- Maximum: 6 cities
- User can reorder
- User can delete
- Preferences saved (database + local storage)

---

### Layer 2: Analytics Engine (Complete Dataset)

**What analytics use:**
- ALL cities collected for that country
- Historical aggregations
- Statistical calculations
- ML training data

**Example:**
```
User's Dashboard: 6 Cities
  ↓
Analytics Uses: 150 Indian Cities (all collected)
  ↓
Accurate Results:
  - Average temperature (from 150 cities, not 6)
  - AQI heatmaps (entire country)
  - Rankings (top 10 hottest, coldest, best AQI)
  - ML predictions (trained on complete dataset)
```

**Key Point:** If user removes Delhi from dashboard, Delhi data is STILL used in:
- Average calculations
- Heatmaps
- Rankings
- ML models
- Historical analysis

---

### Layer 3: Data Collection Strategy (Progressive Expansion)

#### Tier 1: Core Cities (Always Collected - Hourly)

**India (~20-30 cities)**
- Mumbai, Delhi, Bangalore, Chennai, Hyderabad
- Kolkata, Pune, Ahmedabad, Jaipur, Lucknow
- Nagpur, Surat, Kochi, Indore, Chandigarh
- Bhopal, Patna, Guwahati, Srinagar, Bhubaneswar
- Plus 5-10 more for coverage

**USA (~20-30 cities)**
- New York, Los Angeles, Chicago, Houston
- Miami, Seattle, Boston, San Francisco
- Denver, Dallas, Austin, Phoenix
- Plus 10-15 more

**Other countries:** Similar approach (20-30 cities each)

**Why?** Covers ~80% of population & gives nationwide analytics without massive data volume.

#### Tier 2: On-Demand Collection

**When a user searches/adds a city:**
```
User: "Search for Mysore"
  ↓
Backend: Fetch live data from API
  ↓
Save to database
  ↓
Now Mysore becomes part of historical dataset
  ↓
Next hourly scheduler run: Include Mysore
```

**Key:** No need to collect it forever. Collected when accessed, then kept for analysis.

#### Tier 3: Favorite Cities (Scheduler Priority)

**When a user pins a city to dashboard:**
```
User: Pins "Nagpur" to dashboard
  ↓
Scheduler: Add Nagpur to hourly fetch list
  ↓
Fetches Nagpur every hour (high priority)
  ↓
If all users unpin Nagpur: Eventually deprioritize
```

---

## Database Design

### Current (Phase A)
```
locations (7 hardcoded cities)
  ├─ id
  ├─ name
  ├─ country
  ├─ latitude
  └─ longitude

WeatherCurrent
  ├─ location_id
  ├─ temperature
  └─ timestamp

WeatherHourly (2-day forecast)
WeatherDaily (16-day forecast)
AirQuality
APILog
SchedulerLog
```

### Future (Phase C+): Add These Tables

```
-- Countries & cities hierarchy
countries
  ├─ id
  ├─ name (India, USA, UK, etc.)
  ├─ code (IN, US, UK)
  └─ metadata

cities (expanded to 200+ per country)
  ├─ id
  ├─ name
  ├─ country_id
  ├─ latitude
  ├─ longitude
  ├─ is_tier_1 (bool - always collect?)
  ├─ population
  └─ region

-- User preferences (personalization)
user_preferences
  ├─ user_id
  ├─ country_selected
  ├─ cities_in_dashboard (array, max 6)
  ├─ default_country
  ├─ theme
  ├─ units (C/F, m/s/mph)
  └─ updated_at

-- Aggregated data (for efficient queries + storage)
weather_daily_summary
  ├─ city_id
  ├─ date
  ├─ avg_temperature
  ├─ max_temperature
  ├─ min_temperature
  ├─ avg_humidity
  └─ avg_aqi

weather_monthly_summary
  ├─ city_id
  ├─ month
  ├─ year
  ├─ avg_temperature
  ├─ avg_aqi
  └─ precipitation_total

-- ML models & metadata
ml_models
  ├─ id
  ├─ name (weather_v1, weather_v2)
  ├─ version
  ├─ model_path (s3://... or local)
  ├─ trained_on (date range)
  ├─ accuracy
  ├─ created_at
  └─ status (active, archived)
```

---

## Data Lifecycle Strategy

### Hourly Data (High Resolution)

```
Days 0-90: Keep hourly data
│
├─ Used for: Dashboard, real-time trends, ML training
├─ Retention: 90 days (3 months)
│
Day 91: Before deletion → Aggregate to daily summary
│
├─ INSERT INTO weather_daily_summary
│   SELECT city_id, DATE(timestamp), AVG(temp), MAX(temp), ...
│   FROM weather_current
│   WHERE timestamp < NOW() - INTERVAL '90 days'
│
├─ DELETE FROM weather_current WHERE timestamp < NOW() - INTERVAL '90 days'
└─ Storage freed, but daily summary kept forever
```

### Daily Summaries (Eternal)

```
Keep forever (or very long term)
│
├─ Used for: Monthly analytics, annual reports, seasonal analysis
├─ ML training: Use daily summaries for long-term patterns
├─ Storage: Minimal (1 row per city per day vs 24 rows per city)
│
└─ Example: 150 cities × 365 days = 54,750 rows/year
              vs 1.31M rows if keeping hourly
```

### Monthly Summaries (Optional Archive)

```
Computed from daily summaries
│
├─ Further compression for very old data
├─ Used for year-over-year comparisons
└─ Keep indefinitely
```

### ML Models (Version Control)

```
Every retraining cycle:
│
├─ Create new model version
├─ Test on validation set
├─ Compare with current production model
├─ If better: Deploy as new model_v{n}
├─ If worse: Keep current model, archive new version
│
└─ Keep all versions (you may need them for A/B testing)

Example timeline:
─────────────────────
v1: Trained on Jan-Jun 2026, Accuracy 91%
v2: Trained on Feb-Jul 2026, Accuracy 92.5%
v3: Trained on Mar-Aug 2026, Accuracy 93%
v4: Trained on Apr-Sep 2026, Accuracy 92.8% (worse, archived)
v5: Trained on May-Oct 2026, Accuracy 94.2% (latest, in production)
```

---

## Scheduler Architecture (Future)

### Current (Phase A)
```
Scheduler
  └─ Fixed 7 Indian cities
     ├─ Fetch every hour at :00
     ├─ Fetch AQI every hour at :05
     └─ Store to database
```

### Future (Phase C+)

```
Scheduler (Smart)
  │
  ├─ Tier 1 Cities (20-30): Fetch hourly @ :00
  │
  ├─ Tier 2 Cities (on-demand): Fetch when requested
  │
  ├─ Tier 3 Cities (pinned by users): Fetch on priority schedule
  │
  └─ Aggregation Job: Daily @ 02:00 (off-peak)
     ├─ Aggregate hourly → daily summaries
     ├─ Delete old hourly rows
     ├─ Compute global statistics
     └─ Trigger ML retraining if monthly
```

---

## ML Training & Data Management

### The Problem You Identified

```
❌ WRONG APPROACH:
Train model on 60 days → Delete those 60 days → Train next model
Result: Models can't learn seasonal patterns (winter vs summer)

✅ CORRECT APPROACH:
Train on rolling window → Keep summaries → Archive details
```

### Recommended ML Lifecycle

```
Timeline:
───────────────────────────────────────────────

Month 1 (Jan-Mar 2026)
  ├─ Collect: Hourly data (90 days)
  ├─ Train: ML Model v1 using full Jan-Mar
  ├─ Test: Accuracy 88%
  ├─ Deploy: Model v1 to production
  └─ Archive: Convert hourly → daily summaries (keep forever)

Month 2 (Feb-Apr 2026)
  ├─ Collect: New Feb-Apr data (90 days rolling)
  ├─ Train: ML Model v2 using:
  │   ├─ Recent 90-day hourly
  │   └─ 365-day daily summaries (seasonality context)
  ├─ Test: Accuracy 91%
  ├─ Deploy: Model v2 (better, replace v1)
  └─ Archive: Old hourly → daily summaries

Month 3 (Mar-May 2026)
  ├─ Collect: New Mar-May data (90 days rolling)
  ├─ Train: ML Model v3 using:
  │   ├─ Recent 90-day hourly
  │   └─ 365-day daily summaries
  │   └─ Plus 365-day from previous year (if available)
  ├─ Test: Accuracy 93% (learning seasonal patterns!)
  ├─ Deploy: Model v3
  └─ Archive: Old hourly → daily summaries
```

### What You Keep

```
Hourly Data: 90 days (always delete old to save space)
  ↓
Daily Summaries: Forever (minimal space)
  ↓
Monthly Summaries: Forever (even smaller)
  ↓
ML Models: All versions (for comparison + debugging)
  ↓
Training Logs: Metadata about each model
```

---

## Ranking & Analytics (Using Complete Dataset)

### Rankings Should Use All Cities

```
❌ WRONG:
Top 10 Hottest = User's 6 dashboard cities, sorted

✅ CORRECT:
Top 10 Hottest = All 150 collected Indian cities, sorted
```

### Example

```
User's Dashboard Cities: Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune
User's Dashboard Avg Temp: 32.5°C

But Analytics Shows:
Top 10 Hottest Cities (from all 150 collected):
1. Delhi: 36°C
2. Jaipur: 35.8°C
3. Nagpur: 35.2°C
4. Lucknow: 34.9°C
5. Mumbai: 33.2°C
...
10. Kochi: 31.5°C

User's Insight: "My dashboard avg (32.5°C) is higher than national avg (31.2°C)"
This is only possible if analytics use COMPLETE dataset, not just 6 cities.
```

---

## Scaling Plan

### Phase A (Current) ✅
- 7 hardcoded Indian cities
- Hourly collection
- Real-time dashboard

### Phase B (Tomorrow)
- Weather page (same 7 cities)
- Air Quality page (same 7 cities)
- No changes to data collection

### Phase C (Future - Country Selector)
- Expand to 20-30 cities per country
- Add user preferences table
- Implement city picker (max 6)
- Analytics use ALL collected cities
- Implement daily summary aggregation

### Phase D (Future - ML Models)
- Train weather prediction models
- Use rolling window (90 days + daily summaries)
- Keep model versions
- Implement monthly retraining

### Phase E (Future - Multiple Data Types)
- Add cryptocurrency data
- Add exchange rates
- Add earthquake data
- Add economic indicators
- SAME architecture applies to each:
  - Collect complete dataset
  - Analytics use everything
  - Dashboard shows user's selection
  - Hourly → Daily summaries → Archive

---

## Database Cost Implications

### Supabase Free Plan Limits

```
Current (Phase A): 7 cities, hourly
├─ 400 rows/hour (weather + AQI)
├─ 9,600 rows/day
├─ 288,000 rows/month
└─ 3.4M rows/year = ~50 MB (manageable)

Phase C (150 cities): Would be
├─ 8,500 rows/hour
├─ 204,000 rows/day
├─ 6.1M rows/month
└─ 73.5M rows/year = ~1 GB (free plan: 500 MB limit)

Solution: Implement daily summaries
├─ Keep hourly 90 days only: 73.5M / 4 = ~18M rows = 300 MB
├─ Convert rest to daily (minimal): +4.5 MB
├─ Total: ~310 MB (still fits free tier!)
```

### When to Upgrade

```
Free Plan: 500 MB Database
  ├─ Sufficient for: Phase A + B + early Phase C
  └─ Duration: ~6 months

Pro Plan: 100 GB Database
  ├─ Sufficient for: Multiple countries, years of data
  └─ Cost: ~$15/month
```

---

## Implementation Checklist for Future Phases

### When Starting Phase C (Country Selector)

- [ ] Add `countries` table
- [ ] Expand `cities` table (200+ rows per country)
- [ ] Create `user_preferences` table
- [ ] Implement city search endpoint
- [ ] Implement dashboard update endpoint (save user's 6 cities)
- [ ] Create country selector UI component
- [ ] Test analytics with all collected cities (not just dashboard)

### When Starting Phase D (ML Models)

- [ ] Create `weather_daily_summary` table
- [ ] Create daily aggregation job in scheduler
- [ ] Create old-hourly-data cleanup job
- [ ] Create ML training pipeline
- [ ] Create `ml_models` table (version control)
- [ ] Test model training on rolling window
- [ ] Implement model versioning & A/B testing

### Before Each Retraining Cycle

- [ ] Check daily summaries exist (for seasonality context)
- [ ] Verify hourly data is recent (last 90 days)
- [ ] Run data quality checks
- [ ] Train new model version
- [ ] Compare accuracy with current model
- [ ] Archive old version
- [ ] Deploy to production

---

## Key Principles to Remember

### 1. Separate Monitoring from Analysis

**Monitoring:** User's 6 selected cities on dashboard  
**Analysis:** ALL collected cities (complete dataset)

### 2. Never Delete Training Data

Before deleting hourly data, convert to daily summaries.  
Keep summaries forever for historical context.

### 3. Use Rolling Windows for ML

Train on:
- Last 90 days (hourly) for recent patterns
- Last 365+ days (daily summaries) for seasonal patterns

### 4. Keep Model Versions

Every retraining creates a new version.  
Keep all versions for:
- A/B testing
- Rollback if needed
- Comparison analysis

### 5. Progressive Data Collection

Don't collect everything forever.
- Tier 1: Always (20-30 core cities)
- Tier 2: On-demand (when user requests)
- Tier 3: Favorites (when user pins to dashboard)

### 6. Aggregate Before Deleting

```
Hourly (90 days) → Daily summary (forever)
Daily (5 years) → Monthly summary (forever)
Monthly (10 years) → Annual summary (forever)

Never delete without aggregating first.
```

---

## Example: How This Works in Practice

### Scenario: August 2026 (2 months into Phase C)

**User A's Dashboard:**
```
Country: India
Cities: Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune
```

**User A's Analytics:**
```
Average Temperature: 28.5°C
    ← Calculated from ALL 150 Indian cities in DB
    ← NOT just the 6 dashboard cities
    ← User can't change this by removing cities from dashboard
```

**Behind the Scenes:**
```
User A removes Delhi from dashboard
    ↓
Dashboard shows: Mumbai, Bangalore, Chennai, Hyderabad, Pune, + New 6th city
    ↓
But Analytics STILL uses: All 150 cities (including Delhi)
    ↓
User A's insight: "National average is 28.5°C, my 6 cities avg is 29.1°C"
    ↓
This is ACCURATE because analytics used complete dataset
```

---

## When to Revisit This Document

- Before starting Phase C
- Before implementing ML models
- Before scaling to new data types (crypto, earthquakes, etc.)
- When database size approaches Supabase limits
- When considering switching hosting platforms

---

**Remember:** The separation of monitoring (dashboard) from analysis (complete data) is what makes professional analytics platforms powerful.

