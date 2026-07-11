# Requirements Document

## Introduction

This document defines the requirements for Phase B: Weather & Air Quality Pages. These two comprehensive pages will transform InsightHub from MVP (currently 60-65% complete) to a mature analytics platform (75-80% complete).

## Overview

Phase B consists of two major feature areas:

1. **Weather Page** - Professional weather analysis with current conditions, hourly forecasts, daily forecasts, historical data, and trend analysis
2. **Air Quality Page** - Detailed air pollution analysis with AQI tracking, pollutant breakdown, health recommendations, and city rankings

---

## Requirements

### Weather Page Requirements

#### REQ-W-01: Current Weather Analysis
**User Story:** As an analyst, I want to view comprehensive current weather conditions so that I understand the present state of a location.

**Acceptance Criteria:**
- Display current temperature, feels-like temperature, humidity, pressure, and visibility
- Show weather description with WMO code interpretation
- Display wind data including speed, direction (with cardinal label), and gust strength
- Show sunrise/sunset times and daylight duration
- Display cloudiness percentage and precipitation amount
- All values update when user selects a different city
- Data automatically refreshes every 5 minutes from backend
- Display timestamp of last update

#### REQ-W-02: Hourly Forecast (48-hour)
**User Story:** As a weather analyst, I want to see hour-by-hour forecasts so that I can identify short-term weather changes.

**Acceptance Criteria:**
- Display 48-hour hourly forecast data in chart format
- Render line charts for temperature, humidity, wind speed, and precipitation probability
- Charts must be interactive (hover to see exact values for each hour)
- Display weather icons/emojis for each hour
- Allow unit toggle between metric (°C, m/s) and imperial (°F, mph)
- Include grid lines and legend on all charts
- Highlight current hour with visual indicator
- Show both precipitation probability and amount values

#### REQ-W-03: Daily Forecast (16-day)
**User Story:** As a user, I want to see 16-day forecasts so that I can plan activities ahead.

**Acceptance Criteria:**
- Display 16-day daily forecast as interactive cards
- Show max/min temperatures with feels-like range
- Include weather condition description and icon
- Display precipitation chance and expected amount
- Show wind speed and direction information
- Include sunrise/sunset times for each day
- Display UV index for each day
- Cards must be clickable to show additional details
- Highlight extreme weather warnings if applicable

#### REQ-W-04: Historical Weather Data
**User Story:** As an analyst, I want to view past weather data so that I can analyze historical patterns and anomalies.

**Acceptance Criteria:**
- Allow user to select custom date range (up to 30 days in past)
- Display historical daily records: max/min temperature, precipitation, wind data
- Render historical trend charts for temperature and precipitation
- Provide option to compare historical data with current forecasts
- Include CSV export functionality for historical data
- Display data availability indicator for selected date range

#### REQ-W-05: Weather Comparison
**User Story:** As an analyst, I want to compare weather between multiple cities so that I can make location-based decisions.

**Acceptance Criteria:**
- Allow selecting 2-3 cities to compare simultaneously
- Display side-by-side current weather metrics for all selected cities
- Render overlaid temperature trend charts for comparison
- Highlight differences in precipitation, wind, and humidity
- Show comparison statistics (e.g., "City A is 5°C warmer than City B")
- Allow swapping or removing cities from comparison view

#### REQ-W-06: Weather Statistics & Insights
**User Story:** As an analyst, I want to see weather statistics so that I can understand patterns and anomalies.

**Acceptance Criteria:**
- Display average temperature, humidity, and precipitation for selected period
- Show temperature range (highest and lowest recorded)
- Display most common wind direction during period
- Show number of consecutive days with/without precipitation
- Highlight extreme weather records with warnings
- Provide weather pattern summary (e.g., "Warming trend" or "Stable conditions")

---

### Air Quality Page Requirements

#### REQ-A-01: AQI Overview
**User Story:** As a health-conscious user, I want to see current air quality with health recommendations so that I can make informed health decisions.

**Acceptance Criteria:**
- Display both European AQI and US AQI values prominently
- Show AQI category with consistent color coding (Good/Fair/Moderate/Poor/Very Poor/Extremely Poor)
- Display personalized health recommendation text specific to current AQI level
- Show estimated population affected (if data available)
- Display last update timestamp
- Include "What's in the air" brief summary

#### REQ-A-02: Pollutant Breakdown
**User Story:** As an analyst, I want to see individual pollutant concentrations so that I understand which pollutants are problematic.

**Acceptance Criteria:**
- Display PM2.5 concentration with WHO guideline comparison indicator
- Display PM10 concentration levels
- Display NO₂ (nitrogen dioxide) concentration levels
- Display SO₂ (sulfur dioxide) concentration levels
- Display CO (carbon monoxide) concentration levels
- Display O₃ (ozone) concentration levels
- Show health impact category for each pollutant
- Compare all values to WHO annual guidelines
- Show sparkline trend for each pollutant over last 24 hours

#### REQ-A-03: Historical AQI Data
**User Story:** As a researcher, I want to analyze historical AQI trends so that I can identify pollution patterns and seasonal changes.

**Acceptance Criteria:**
- Allow selecting custom date range for historical analysis
- Display historical AQI values in table and chart format
- Show which pollutants were dominant on specific dates
- Render day-by-day AQI trend line chart
- Highlight worst air quality days with warning indicators
- Display seasonal patterns if sufficient historical data available
- Include CSV export functionality for historical data

#### REQ-A-04: AQI Trends & Analysis
**User Story:** As an analyst, I want to see AQI trends so that I can identify if air quality is improving or worsening.

**Acceptance Criteria:**
- Display 7-day AQI trend line chart with data points
- Display 30-day AQI trend line chart with data points
- Calculate and show AQI change percentage (improving/worsening)
- Display trend direction indicators (↑ up / ↓ down / → stable)
- Include moving average overlay on trend charts
- Highlight significant AQI changes (> 10 point changes)
- Compare current trends to historical average for same period
- Show trend prediction if model available

#### REQ-A-05: Pollutant Comparison vs Guidelines
**User Story:** As a researcher, I want to compare pollutant levels to WHO guidelines so that I understand severity levels.

**Acceptance Criteria:**
- Display PM2.5 vs WHO 24-hour guideline (15 µg/m³)
- Display PM2.5 vs WHO annual guideline (5 µg/m³)
- Display PM10 vs WHO 24-hour guideline (45 µg/m³)
- Show percentage of guideline exceeded for each pollutant
- Highlight exceeded guidelines in red warning color
- Show safe levels in green confirmation color
- Display warning message when any guideline is exceeded

#### REQ-A-06: Health Recommendations
**User Story:** As a user, I want actionable health advice based on air quality so that I can protect my family's health.

**Acceptance Criteria:**
- Show outdoor activity recommendations (avoid/limit/safe)
- Display mask type recommendations based on pollutant types
- Show vulnerable group warnings (children, elderly, asthma patients)
- List specific precautions to take for current AQI level
- Include respiratory symptom indicators
- Link to WHO and EPA health resources
- Provide indoor air quality improvement tips

#### REQ-A-07: AQI Heatmap & City Ranking
**User Story:** As an analyst, I want to see which cities have worst air quality so that I can prioritize attention and resources.

**Acceptance Criteria:**
- Display all 7 monitored cities ranked by current AQI (worst to best)
- Use consistent color coding: green (good) to red (extremely poor)
- Show emoji indicators for quick visual scanning
- Display exact AQI values next to each ranking
- Allow sorting by AQI or by specific pollutant concentration
- Show trend arrow indicating improvement/worsening
- Highlight cities with extreme pollution in alert color
- Update rankings in real-time as new data arrives

---

### Technical Integration Requirements

#### REQ-T-01: API Integration
**User Story:** As a developer, I need robust API connections so that data is reliable and current.

**Acceptance Criteria:**
- All data sourced from existing backend API endpoints
- Hourly forecasts retrieved via GET `/api/v1/weather/hourly` endpoint
- Daily forecasts retrieved via GET `/api/v1/weather/daily` endpoint
- Historical weather data retrieved via GET `/api/v1/weather/history` endpoint
- Air quality data retrieved via GET `/api/v1/weather/air-quality` endpoint
- Comprehensive error handling for all API failures
- Loading states displayed during API calls
- React Query caching strategy implemented with appropriate stale times
- Real-time updates without requiring page refresh

#### REQ-T-02: Performance & User Experience
**User Story:** As a user, I want the pages to load quickly so that I can access information efficiently and without frustration.

**Acceptance Criteria:**
- Weather page loads in < 2 seconds on localhost
- Air quality page loads in < 2 seconds on localhost
- Charts render smoothly without lag or stuttering
- No unnecessary API calls or data fetching
- Lazy loading implemented for off-screen components
- Mobile responsive design (tested on mobile viewport)
- Accessibility compliance with WCAG AA standards
- No broken links, missing data, or console errors

#### REQ-T-03: Navigation & UI Consistency
**User Story:** As a user, I want consistent navigation so that I can easily move between pages and understand my location.

**Acceptance Criteria:**
- Weather page accessible via drill-down from dashboard city cards
- Air Quality page accessible via drill-down from dashboard city cards
- Back button returns user to dashboard view
- Breadcrumb navigation shows current page location
- City selector allows changing analyzed city without reloading page
- Date range pickers work consistently across all pages
- UI theme matches dashboard dark theme and styling
- Responsive design works on all screen sizes

---

## Success Criteria

### Phase B Completion Checklist
- ✅ All 13 requirements fully implemented and tested
- ✅ Zero broken links or missing data fields
- ✅ All pages load in < 2 seconds
- ✅ Mobile responsive (tested on multiple screen sizes)
- ✅ No console errors or warnings
- ✅ Real-time data updates functioning
- ✅ WCAG AA accessibility compliance verified
- ✅ No regressions in existing functionality
- ✅ Code reviewed and tested
- ✅ Documentation complete

### Project Completion Percentage
- **After Phase B:** 75-80% complete
- **Remaining Work:** 20-25% (Phase C Analytics + Phase D Maps)

---

## Data Requirements

### Data Sources
| Data Type | Source | Endpoint |
|-----------|--------|----------|
| Current Weather | Open-Meteo API | `/forecast` |
| Hourly Forecast | Open-Meteo API | `/forecast` (hourly) |
| Daily Forecast | Open-Meteo API | `/forecast` (daily) |
| Historical Weather | Open-Meteo Archive API | `/archive` |
| Air Quality (Current) | Open-Meteo AQI API | `/air-quality` |
| Air Quality (Historical) | Supabase PostgreSQL | AQI table |

### Data Freshness Requirements
| Data | Refresh Interval | Cache Duration |
|------|-----------------|-----------------|
| Current Conditions | 5 minutes | 5 minutes |
| Hourly Forecast | On demand | 30 minutes |
| Daily Forecast | On demand | 1 hour |
| Historical Data | On demand | 24 hours |
| AQI Current | 15 minutes | 15 minutes |

---

## Dependencies & Constraints

### Frontend Stack (No New Dependencies)
- React 19 (existing)
- TypeScript (existing)
- Recharts for visualizations (existing)
- React Query for data fetching (existing)
- React Router for navigation (existing)
- Tailwind CSS for styling (existing)
- lucide-react for icons (existing)

### Backend Requirements
- All existing API endpoints must be operational
- Supabase PostgreSQL database accessible
- Open-Meteo APIs must remain accessible

### Constraints
- ❌ No new npm packages
- ❌ No database schema changes
- ❌ No authentication changes
- ❌ No WebSocket connections

---

## Out of Scope (Phase B)

These features are intentionally excluded from Phase B and will be addressed in later phases:

- Machine learning predictions
- Custom user alerts and notifications
- User authentication and accounts
- Native mobile applications
- Real-time WebSocket connections
- Additional city monitoring beyond 7 cities
- Advanced data export formats (only CSV)

---

## Glossary

| Abbreviation | Full Name | Definition |
|--------------|-----------|-----------|
| AQI | Air Quality Index | 0-500 scale measuring air pollution level |
| PM2.5 | Particulate Matter 2.5 | Fine particles ≤ 2.5 micrometers in diameter |
| PM10 | Particulate Matter 10 | Coarse particles ≤ 10 micrometers in diameter |
| NO₂ | Nitrogen Dioxide | Toxic gas pollutant from vehicle emissions |
| SO₂ | Sulfur Dioxide | Air pollutant from industrial sources |
| CO | Carbon Monoxide | Toxic, colorless, odorless gas |
| O₃ | Ozone | Ground-level air pollutant |
| WMO | World Meteorological Organization | UN agency for weather standards |
| UV Index | Ultra Violet Index | Scale measuring sun radiation intensity |
| WHO | World Health Organization | UN agency for health standards |
| EPA | Environmental Protection Agency | US environmental regulator |
| WCAG | Web Content Accessibility Guidelines | Accessibility standards |

---

**Specification Version:** 1.0  
**Created:** 2026-07-11  
**Phase:** B - Weather & Air Quality Analysis  
**Completion Target:** 75-80% of project
