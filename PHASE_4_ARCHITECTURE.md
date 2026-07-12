# Phase 4: Architecture & Sidebar Restructuring

**Date:** July 12, 2026  
**Status:** Planning  
**Impact:** Navigation refactor + Geo Intelligence implementation  

---

## 📋 Current Sidebar Structure

```
Dashboard
Weather
Air Quality
Analytics
Maps (Coming)
Data Explorer
Settings
```

**Problem:** Weather and Air Quality are redundant (data appears in Dashboard and Analytics too)

---

## ✨ Proposed New Sidebar Structure

```
📊 Dashboard
📈 Analytics
🗺️ Geo Intelligence
📂 Data Explorer (Future)
⚙️ Settings
```

### Why This Works Better

1. **Dashboard** - Overview of all data (single source of truth)
2. **Analytics** - Deep analysis (trends, patterns, predictions)
3. **Geo Intelligence** - Spatial visualization (maps, heatmaps, timelines)
4. **Data Explorer** - Raw data access (for power users)
5. **Settings** - User preferences

### Benefits

- ✅ Cleaner navigation (5 items vs 7)
- ✅ No redundancy (weather/AQI integrated into Dashboard)
- ✅ Feels cohesive (like a unified platform)
- ✅ Professional appearance
- ✅ Room for future features

---

## 🔄 Data Flow Architecture

```
Data Sources
├── Open-Meteo (Weather API)
├── Open-Meteo AQI (Pollution API)
└── Supabase (Historical data)
        ↓
        ↓ Hourly Collection
        ↓
    Database
        ↓
        ├─→ Dashboard (Real-time overview)
        ├─→ Analytics (Trends & patterns)
        └─→ Geo Intelligence (Maps & heatmaps)
```

---

## 📦 Phase 4 Component Structure

```
frontend/src/
├── pages/
│   ├── Dashboard.tsx (enhanced)
│   ├── Analytics.tsx (unchanged)
│   └── GeoIntelligence.tsx ⭐ NEW
│
├── components/
│   ├── geo/
│   │   ├── GeoMap.tsx (Leaflet wrapper)
│   │   ├── LayerControls.tsx (checkboxes)
│   │   ├── TimelineSlider.tsx (9-23:00)
│   │   ├── SearchBar.tsx (city search)
│   │   ├── CountrySelector.tsx (India/USA/etc)
│   │   ├── AnalyticsPanel.tsx (right sidebar)
│   │   ├── MapLegend.tsx (color reference)
│   │   └── MarkerPopup.tsx (city details)
│   │
│   └── geo/utils/ (Utilities)
│       ├── heatmapGenerator.ts
│       ├── geoHelpers.ts
│       └── timelineData.ts
│
└── types/
    └── geo.ts ⭐ NEW (Type definitions)
```

---

## 🗺️ Component Breakdown

### GeoIntelligence.tsx (Main Page)
- Page wrapper
- Layout: left controls + center map + right panel
- Coordinates state (layers, timeline, search)
- Responsive grid layout

### GeoMap.tsx (Leaflet Map)
- Leaflet map container
- Handles rendering markers
- Heatmap overlay
- Zoom/pan controls
- Layer switching

### LayerControls.tsx
- Checkbox list
- Available layers (Weather, AQI, Wind, Rain, Humidity, Cloud)
- Future layers (greyed out)
- Toggle callbacks

### TimelineSlider.tsx
- Time slider (09:00 to 23:00)
- Play/Pause/Reset buttons
- Speed controls (1x, 2x, 4x)
- Current time display
- Auto-advance animation

### SearchBar.tsx
- Text input
- City autocomplete
- Filter by country
- Click result → zoom to city

### CountrySelector.tsx
- Dropdown (India, USA, Japan, Australia, Germany)
- Only India selectable now
- Updates map bounds
- Updates city list

### AnalyticsPanel.tsx
- City multi-selector
- Hottest/Coldest cities
- Best/Worst AQI
- Highest Wind
- Highest Humidity
- Last updated timestamp

### MapLegend.tsx
- Color scale (temperature/AQI)
- Unit labels
- Visual reference
- Updates based on active layer

### MarkerPopup.tsx
- Shows on marker click
- City name
- Temperature
- AQI
- Humidity
- Wind
- Last updated
- Close button

---

## 🎨 Styling Approach

### Layout (Tailwind CSS)

```typescript
<div className="grid grid-cols-1 md:grid-cols-[250px_1fr_300px] h-screen gap-4 p-4">
  {/* Left Sidebar - Controls */}
  <div className="card overflow-y-auto">
    <LayerControls />
    <TimelineSlider />
    <SearchBar />
  </div>

  {/* Center - Map */}
  <div className="card p-0 rounded-lg overflow-hidden">
    <GeoMap />
  </div>

  {/* Right Sidebar - Analytics */}
  <div className="card overflow-y-auto">
    <AnalyticsPanel />
  </div>
</div>
```

### Responsive Design

```
Desktop (1440px+): Left | Center | Right
Tablet (768px):    Left/Center | Right (stack)
Mobile (375px):    Overlays (map full-width)
```

---

## 📊 Data Types (TypeScript)

```typescript
// types/geo.ts

interface CityMarker {
  id: string
  name: string
  country: string
  latitude: number
  longitude: number
  temperature: number
  aqi: number
  humidity: number
  windSpeed: number
  lastUpdated: Date
}

interface HourlyData {
  time: string // "09:00", "10:00", etc
  temperature: number
  aqi: number
  humidity: number
  windSpeed: number
  precipitationProbability: number
}

interface CountryConfig {
  code: string
  name: string
  bounds: [[number, number], [number, number]]
  cities: CityMarker[]
}

interface MapLayer {
  id: string
  name: string
  type: 'markers' | 'heatmap'
  enabled: boolean
  metric: 'temperature' | 'aqi' | 'wind' | 'rain' | 'humidity' | 'cloud'
  colors: Record<string, string>
}

interface TimelineState {
  currentTime: string // "13:00"
  isPlaying: boolean
  speed: 1 | 2 | 4
  data: Record<string, HourlyData[]>
}
```

---

## 🔌 API Endpoints Needed

### Current (Already working)
```
GET /api/v1/weather/current?latitude={lat}&longitude={lon}
GET /api/v1/weather/air-quality?latitude={lat}&longitude={lon}
```

### New (Need to implement)
```
GET /api/v1/geo/cities/{country}
  Returns: List of all cities in country with current data

GET /api/v1/geo/hourly/{city_id}
  Returns: 15 hourly data points (09:00-23:00)

GET /api/v1/geo/heatmap/{metric}/{time}
  Returns: Interpolated grid for heatmap rendering
```

### Implementation Notes

For Phase 4, can work with simulated data:
- Hourly data generated from patterns
- Heatmap interpolation done client-side
- No backend changes required initially

---

## 🛠️ Implementation Plan

### Week 1 (4-5 days)

**Day 1: Foundation**
- Create GeoIntelligence page
- Integrate Leaflet & React-Leaflet
- Display map with 7 markers
- Basic controls

**Day 2: Layers**
- Temperature layer with colors
- AQI layer switching
- Layer toggle functionality
- Marker popups

**Day 3: Heatmaps**
- Leaflet-heat integration
- Temperature heatmap
- AQI heatmap
- Smooth rendering

**Day 4: Timeline**
- Timeline slider component
- Play/Pause animation
- Speed controls
- Data interpolation

**Day 5: Polish**
- Search functionality
- Analytics panel
- Responsive design
- Performance optimization

---

## 📚 Documentation To Create

1. **PHASE_4_SPECIFICATION.md** (existing)
2. **PHASE_4_QUICKSTART.md** - User guide
3. **GEO_COMPONENT_GUIDE.md** - Component descriptions
4. **HEATMAP_GUIDE.md** - How heatmaps work
5. **TIMELINE_GUIDE.md** - Timeline feature guide

---

## 🎯 Success Criteria

### Functional
- [x] Map renders 7 cities correctly
- [x] All layers toggle on/off
- [x] Heatmaps render smoothly
- [x] Timeline scrubbing works
- [x] Search finds cities
- [x] Analytics panel updates

### Performance
- [x] Loads < 2 seconds
- [x] 60fps animations
- [x] Smooth heatmap rendering
- [x] No lag on slider drag

### UX
- [x] Intuitive controls
- [x] Professional appearance
- [x] Responsive on all devices
- [x] Clear visual feedback

### Code Quality
- [x] TypeScript strict mode
- [x] No console errors
- [x] Clean component structure
- [x] Proper error handling

---

## 🚀 Post-Phase 4

### Immediate Wins
- ✅ Professional GIS interface
- ✅ Interactive exploration
- ✅ Time-series animation
- ✅ Heatmap visualization

### Foundation for Phase 5
- Country selector ready for USA, Japan, Australia, Germany
- Layer structure ready for new metrics (earthquakes, wildfires, cyclones)
- Search scalable to hundreds of cities
- Timeline ready for full historical data

---

*Phase 4 will elevate InsightHub to a professional intelligence platform.* 🗺️

