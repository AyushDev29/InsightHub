# Design Document

## Overview

This design document provides the technical architecture and component structure for implementing Phase B requirements. It translates business requirements into concrete implementation details.

## Architecture

### Architecture Overview

This document defines the component architecture, data models, and integration patterns for Phase B.

### File Structure

```
frontend/src/
├── pages/
│   ├── Weather.tsx           (NEW - Weather page)
│   ├── AirQuality.tsx        (NEW - Air Quality page)
│   └── Dashboard.tsx         (existing)
├── components/
│   ├── weather/              (NEW - Weather sub-components)
│   │   ├── CurrentWeather.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── HistoricalChart.tsx
│   │   ├── ComparisonView.tsx
│   │   └── WeatherStats.tsx
│   ├── airquality/           (NEW - AQI sub-components)
│   │   ├── AQIOverview.tsx
│   │   ├── PollutantBreakdown.tsx
│   │   ├── HistoricalAQI.tsx
│   │   ├── AQITrends.tsx
│   │   ├── PollutantComparison.tsx
│   │   ├── HealthRecommendations.tsx
│   │   └── CityRanking.tsx
│   ├── shared/               (new shared components)
│   │   ├── DateRangePicker.tsx
│   │   ├── CitySelector.tsx
│   │   └── ChartTooltip.tsx
│   └── ...existing components
├── hooks/
│   ├── useWeather.ts         (existing - extend)
│   ├── useHistoricalWeather.ts (NEW)
│   ├── useAirQualityTrends.ts  (NEW)
│   └── ...existing hooks
├── services/
│   └── api.ts                (existing - already has all endpoints)
└── types/
    └── api.ts                (existing - may need extension)
```

## Components and Interfaces

All components are built using React 19 with TypeScript strict mode. The following interfaces define the contract for each component.

---

## Weather Page Design

### Page Structure

```
Weather Page (Weather.tsx)
├── Header
│   ├── Title: "Weather Analysis"
│   ├── City Selector (dropdown)
│   └── Date Range Picker (optional)
├── Current Weather Section (REQ-W-01)
│   └── CurrentWeather component
├── Hourly Forecast Section (REQ-W-02)
│   └── HourlyForecast component with 4 charts
├── Daily Forecast Section (REQ-W-03)
│   └── DailyForecast component with card grid
├── Historical Data Section (REQ-W-04)
│   ├── Date range picker
│   └── HistoricalChart component
├── Comparison Section (REQ-W-05)
│   └── ComparisonView component
└── Statistics Section (REQ-W-06)
    └── WeatherStats component
```

### Component Specifications

#### CurrentWeather Component (REQ-W-01)
**Props:**
```typescript
interface CurrentWeatherProps {
  latitude: number
  longitude: number
  cityName: string
}
```

**Renders:**
- Large temperature display (primary metric)
- Grid of 6 metrics: Feels Like, Humidity, Pressure, Visibility, UV Index, Cloud Cover
- Wind direction with cardinal label (N, NE, E, etc.)
- Sunrise/Sunset times
- Weather description with icon
- Last update timestamp

**Data Source:** `apiService.getCurrentWeather(lat, lng)`  
**Cache:** 5 minutes (React Query)

#### HourlyForecast Component (REQ-W-02)
**Props:**
```typescript
interface HourlyForecastProps {
  latitude: number
  longitude: number
  hours?: number  // default 48
}
```

**Charts:**
1. **Temperature Chart** - LineChart (Recharts)
   - X-axis: Hours (0:00 - 23:00, next day)
   - Y-axis: Temperature (°C or °F)
   - Dual line: Actual + Feels Like

2. **Humidity Chart** - LineChart (Recharts)
   - X-axis: Hours
   - Y-axis: Humidity (%)
   - Single line

3. **Wind Chart** - LineChart (Recharts)
   - X-axis: Hours
   - Y-axis: Wind Speed (km/h)
   - Single line (show gusts as bar overlay)

4. **Precipitation Chart** - BarChart + LineChart (Recharts)
   - X-axis: Hours
   - Y-axis Left: Precipitation Amount (mm)
   - Y-axis Right: Precipitation Probability (%)

**Data Source:** `apiService.getHourlyForecast(lat, lng, 48)`  
**Cache:** 30 minutes

#### DailyForecast Component (REQ-W-03)
**Props:**
```typescript
interface DailyForecastProps {
  latitude: number
  longitude: number
  days?: number  // default 16
}
```

**Renders:**
- Horizontal scroll card grid (one card per day)
- Each card contains:
  - Date
  - Weather icon (large)
  - Max/Min temperature
  - Precipitation chance & amount
  - Wind speed & direction
  - UV Index
  - Sunrise/Sunset times

**Data Source:** `apiService.getDailyForecast(lat, lng, 16)`  
**Cache:** 1 hour

#### HistoricalChart Component (REQ-W-04)
**Props:**
```typescript
interface HistoricalChartProps {
  latitude: number
  longitude: number
  startDate: date
  endDate: date
}
```

**Renders:**
- Date range picker (controls)
- Two charts:
  1. Temperature trend (max/min/mean as filled area)
  2. Precipitation trend (bars)
- Data table (optional: expandable)
- CSV export button

**Data Source:** `apiService.get_weather_history(lat, lng, start, end)`  
**Cache:** 24 hours

#### ComparisonView Component (REQ-W-05)
**Props:**
```typescript
interface ComparisonViewProps {
  cityIds: string[]  // 2-3 cities
}
```

**Renders:**
- Multi-city selector (can add/remove cities)
- Metrics comparison table
- Temperature overlay chart (all cities on same chart)
- Comparison statistics (differences, extremes)

#### WeatherStats Component (REQ-W-06)
**Props:**
```typescript
interface WeatherStatsProps {
  latitude: number
  longitude: number
  startDate: date
  endDate: date
}
```

**Renders:**
- 6 statistics cards:
  1. Average Temperature
  2. Temperature Range
  3. Most Common Wind Direction
  4. Total Precipitation
  5. Consecutive Dry Days
  6. Weather Pattern Summary

---

## Air Quality Page Design

### Page Structure

```
Air Quality Page (AirQuality.tsx)
├── Header
│   ├── Title: "Air Quality Analysis"
│   ├── City Selector (dropdown)
│   └── Date Range Picker (optional)
├── AQI Overview Section (REQ-A-01)
│   └── AQIOverview component
├── Pollutant Breakdown Section (REQ-A-02)
│   └── PollutantBreakdown component
├── Historical AQI Section (REQ-A-03)
│   ├── Date range picker
│   └── HistoricalAQI component
├── Trends Section (REQ-A-04)
│   └── AQITrends component
├── Guideline Comparison Section (REQ-A-05)
│   └── PollutantComparison component
├── Health Recommendations Section (REQ-A-06)
│   └── HealthRecommendations component
└── City Ranking Section (REQ-A-07)
    └── CityRanking component
```

### Component Specifications

#### AQIOverview Component (REQ-A-01)
**Props:**
```typescript
interface AQIOverviewProps {
  latitude: number
  longitude: number
  cityName: string
}
```

**Renders:**
- Large AQI score (center, prominent)
- AQI category badge with color coding
- European + US AQI side-by-side
- Health recommendation box (colored by severity)
- Last measurement time
- Affected population (if available)
- "What's in the air" summary text

**Data Source:** `apiService.getAirQuality(lat, lng)`  
**Cache:** 15 minutes

#### PollutantBreakdown Component (REQ-A-02)
**Props:**
```typescript
interface PollutantBreakdownProps {
  latitude: number
  longitude: number
}
```

**Renders:**
- 6 pollutant cards (PM2.5, PM10, NO₂, SO₂, CO, O₃):
  - Each card shows:
    - Pollutant name
    - Current concentration (µg/m³)
    - WHO guideline indicator (% of guideline)
    - Health impact category
    - 24h sparkline trend
    - Color coding: green (safe) → red (dangerous)

**Data Source:** `apiService.getAirQuality(lat, lng)`  
**Cache:** 15 minutes

#### HistoricalAQI Component (REQ-A-03)
**Props:**
```typescript
interface HistoricalAQIProps {
  latitude: number
  longitude: number
  startDate: date
  endDate: date
}
```

**Renders:**
- Date range picker
- AQI trend line chart (last 30 days or selected range)
- Data table (date, AQI, dominant pollutant)
- CSV export button
- Seasonal pattern analysis (if enough data)

**Data Source:** Supabase query (query AQI table)  
**Cache:** 24 hours

#### AQITrends Component (REQ-A-04)
**Props:**
```typescript
interface AQITrendsProps {
  latitude: number
  longitude: number
}
```

**Renders:**
- Two trend charts (tabs or side-by-side):
  1. 7-day trend with moving average
  2. 30-day trend with moving average
- Trend statistics:
  - Change percentage (↑ ↓ →)
  - Highest/lowest recorded
  - Current vs historical average
  - Prediction (if available)

**Data Source:** Supabase (historical AQI data)  
**Cache:** 24 hours

#### PollutantComparison Component (REQ-A-05)
**Props:**
```typescript
interface PollutantComparisonProps {
  latitude: number
  longitude: number
}
```

**Renders:**
- 3 comparison sections:
  1. PM2.5 vs WHO (24h + annual)
  2. PM10 vs WHO (24h)
  3. Other pollutants vs limits
- Each shows:
  - Current value vs guideline
  - Percentage exceeded (if applicable)
  - Color indicator (green if safe, red if exceeded)
  - Warning message if guidelines exceeded

**Data Source:** `apiService.getAirQuality(lat, lng)`  
**Cache:** 15 minutes

#### HealthRecommendations Component (REQ-A-06)
**Props:**
```typescript
interface HealthRecommendationsProps {
  aqi: number
  pollutants: Pollutants
}
```

**Renders:**
- Activity recommendations (outdoor/indoor)
- Mask type recommendations by pollutant
- Vulnerable group warnings
- Specific precautions checklist
- Symptom indicators
- Links to health resources

#### CityRanking Component (REQ-A-07)
**Props:**
```typescript
interface CityRankingProps {
  sortBy?: 'aqi' | 'pm25' | 'pm10'  // default 'aqi'
}
```

**Renders:**
- Ranked list of all 7 cities:
  - Rank badge (🥇 🥈 🥉 or #4-7)
  - City name
  - AQI value with category badge
  - Trend arrow (↑ ↓ →)
  - Color coding
- Sorting dropdown
- Real-time updates

**Data Source:** `apiService.getAirQuality()` for all cities  
**Cache:** 15 minutes

---

## Shared Components

### DateRangePicker Component
**Props:**
```typescript
interface DateRangePickerProps {
  minDate?: date
  maxDate?: date
  onSelect: (start: date, end: date) => void
  maxRangeDays?: number
}
```

**Features:**
- Calendar UI
- Preset options (Last 7 days, Last 30 days, Last 90 days)
- Manual range selection
- Validation (no future dates, max range enforcement)

### CitySelector Component
**Props:**
```typescript
interface CitySelectorProps {
  selectedCity: string
  onSelect: (cityId: string) => void
  multiSelect?: boolean
  maxSelections?: number
}
```

**Features:**
- Dropdown showing all 7 cities
- Current city highlighted
- Search/filter capability
- Visual indicator for current location

### ChartTooltip Component
**Props:**
```typescript
interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  unit?: string
}
```

**Features:**
- Custom Recharts tooltip
- Consistent styling with dashboard
- Shows multiple series values
- Includes unit display

---

## Data Models

### Weather Data Model
```typescript
interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  pressure: number
  visibility: number
  uvIndex: number
  cloudCover: number
  windSpeed: number
  windDirection: number
  windGust: number
  precipitation: number
  description: string
  timestamp: Date
}
```

### AQI Data Model
```typescript
interface AQIData {
  aqi: number
  pm25: number
  pm10: number
  no2: number
  so2: number
  co: number
  o3: number
  category: 'good' | 'fair' | 'moderate' | 'poor' | 'very_poor' | 'extremely_poor'
  timestamp: Date
}
```

### Historical Data Model
```typescript
interface HistoricalRecord {
  date: Date
  temperature: {min: number, max: number, mean: number}
  precipitation: number
  windDirection: string
  aqi?: number
}
```

---

## Data Flow

### Weather Page Data Flow

```
Weather.tsx (page)
├── useWeather(lat, lng) → CurrentWeather.tsx
├── useHourlyForecast(lat, lng, 48) → HourlyForecast.tsx
├── useDailyForecast(lat, lng, 16) → DailyForecast.tsx
├── useHistoricalWeather(lat, lng, start, end) → HistoricalChart.tsx
├── useWeatherComparison(cityIds[]) → ComparisonView.tsx
└── useWeatherStats(lat, lng, start, end) → WeatherStats.tsx
```

### Air Quality Page Data Flow

```
AirQuality.tsx (page)
├── useAirQuality(lat, lng) → AQIOverview.tsx
├── useAirQuality(lat, lng) → PollutantBreakdown.tsx
├── useAQIHistory(lat, lng, start, end) → HistoricalAQI.tsx
├── useAQITrends(lat, lng) → AQITrends.tsx
├── useAirQuality(lat, lng) → PollutantComparison.tsx
├── useAirQuality(lat, lng) → HealthRecommendations.tsx
└── useAQIRanking() → CityRanking.tsx
```

---

## Component Hierarchy

### Weather Page Tree
```
<Weather>
  <Header>
    <CitySelector />
    <DateRangePicker />
  </Header>
  <CurrentWeather />
  <HourlyForecast>
    <LineChart /> (Temperature)
    <LineChart /> (Humidity)
    <LineChart /> (Wind)
    <BarChart /> (Precipitation)
  </HourlyForecast>
  <DailyForecast>
    {CardGrid of 16 days}
  </DailyForecast>
  <HistoricalChart>
    <DateRangePicker />
    <LineChart /> (Temperature)
    <BarChart /> (Precipitation)
    <DataTable />
    <ExportButton />
  </HistoricalChart>
  <ComparisonView>
    <CitySelectorMulti />
    <MetricsTable />
    <LineChart /> (overlaid)
  </ComparisonView>
  <WeatherStats>
    {6 statistic cards}
  </WeatherStats>
</Weather>
```

### Air Quality Page Tree
```
<AirQuality>
  <Header>
    <CitySelector />
    <DateRangePicker />
  </Header>
  <AQIOverview />
  <PollutantBreakdown>
    {6 pollutant cards with sparklines}
  </PollutantBreakdown>
  <HistoricalAQI>
    <DateRangePicker />
    <LineChart />
    <DataTable />
  </HistoricalAQI>
  <AQITrends>
    <LineChart /> (7-day)
    <LineChart /> (30-day)
  </AQITrends>
  <PollutantComparison>
    {Comparison cards}
  </PollutantComparison>
  <HealthRecommendations>
    {Activity recommendations}
    {Mask recommendations}
    {Precautions}
  </HealthRecommendations>
  <CityRanking>
    {Ranked list of 7 cities}
  </CityRanking>
</AirQuality>
```

---

## Styling & Theme

### Colors (Tailwind)
```
Background: bg-dark-900, bg-dark-800
Text: text-white, text-gray-400, text-gray-500
Charts: Custom color palettes per chart type
AQI Categories:
  - Good: text-green-400, bg-green-500/20
  - Fair: text-lime-400, bg-lime-500/20
  - Moderate: text-yellow-400, bg-yellow-500/20
  - Poor: text-orange-400, bg-orange-500/20
  - Very Poor: text-red-400, bg-red-500/20
  - Extremely Poor: text-red-600, bg-red-600/20
```

### Breakpoints (Mobile Responsive)
- `sm`: 640px (tablets)
- `md`: 768px (small desktops)
- `lg`: 1024px (full desktops)
- Charts: responsive (ResponsiveContainer from Recharts)

---

## API Integration Summary

### Existing Endpoints Used
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/weather/current` | GET | Current conditions |
| `/weather/hourly` | GET | 48-hour forecast |
| `/weather/daily` | GET | 16-day forecast |
| `/weather/history` | GET | Historical data |
| `/weather/air-quality` | GET | Current AQI |

### New Queries Needed
- Historical AQI: Query Supabase AQI table for trends
- City comparison: Multiple concurrent `/weather/current` calls

---

## Correctness Properties

### Property 1: Data Validation Rules
**Validates: REQ-T-01, REQ-T-02**

- All temperature values must be within -50°C to 60°C range
- Humidity values must be 0-100%
- Pressure values must be 900-1100 hPa
- Wind speeds must be >= 0 m/s
- AQI values must be 0-500
- All timestamps must be valid ISO 8601 format

### Property 2: Component Rendering Rules
**Validates: REQ-W-01, REQ-W-02, REQ-W-03, REQ-A-01, REQ-A-02**

- All chart data must be sorted chronologically
- Missing data points must be marked or interpolated
- Unit conversions must be consistent (°C/°F, m/s/mph)
- Color coding must be accessible (sufficient contrast ratio)

---

## Error Handling

### API Error Handling
- Network timeouts: Display retry button, use cached data if available
- Invalid responses: Log error, show generic "data unavailable" message
- Rate limiting (429): Implement exponential backoff, queue requests
- Server errors (5xx): Retry after 30 seconds, max 3 attempts

### Data Error Handling
- Missing required fields: Use sensible defaults or omit section
- Invalid dates: Validate and skip malformed records
- Extreme outliers: Flag with warning but display value
- Stale data: Show timestamp, add "data not updated" indicator

### Component Error Boundaries
- Wrap each major section with React Error Boundary
- Display fallback UI on component crash
- Log errors to console and analytics

---

## Testing Strategy

### Unit Tests
- Component props validation
- Data transformation functions
- Utility functions (calculations, formatting)
- Hook logic (useWeather, useAQITrends, etc.)

### Integration Tests
- Page load sequence
- Data fetching and rendering
- Component interactions (city selector, date picker)
- Chart interactivity (hover, tooltips)

### E2E Tests
- Full user workflows
- Page navigation and routing
- Real API calls (staging environment)

### Performance Tests
- Page load time < 2 seconds
- Chart render time < 500ms
- No memory leaks on component unmount
- Battery impact on mobile (lower priority)

### Accessibility Tests
- WCAG AA color contrast (4.5:1 text, 3:1 large text)
- Keyboard navigation through all components
- Screen reader compatibility
- Focus management

### Mobile Tests
- Responsive layout on 375px (iPhone SE)
- Responsive layout on 768px (iPad)
- Touch interactions work correctly
- Performance on 4G network simulation

---

**Design Document Version:** 1.0  
**Created:** 2026-07-11  
**Status:** Ready for Implementation
