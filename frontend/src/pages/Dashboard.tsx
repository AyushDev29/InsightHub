/**
 * Analytics Dashboard
 * Calculates insights across all monitored cities — not just raw numbers.
 * Shows: smart insight cards, city leaderboards, temperature & AQI trend charts.
 */

import { Thermometer, Wind, Award, Droplets, Activity, RefreshCw } from 'lucide-react'
import CityWeatherGrid from '../components/CityWeatherGrid'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

// ─── Cities ─────────────────────────────────────────────────────────────────

const CITIES = [
  { id: 'mumbai',    name: 'Mumbai',    lat: 19.0760, lng: 72.8777 },
  { id: 'delhi',     name: 'Delhi',     lat: 28.7041, lng: 77.1025 },
  { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 'chennai',   name: 'Chennai',   lat: 13.0827, lng: 80.2707 },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { id: 'kolkata',   name: 'Kolkata',   lat: 22.5726, lng: 88.3639 },
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface CitySnapshot {
  name: string
  temperature: number     // °C
  feels_like: number      // °C
  humidity: number        // %
  wind_speed: number      // m/s
  precipitation_prob: number // %
  aqi: number
  aqi_category: string
  pm2_5: number
  pm10: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function aqiColor(aqi: number) {
  if (aqi <= 20)  return 'text-green-400'
  if (aqi <= 40)  return 'text-lime-400'
  if (aqi <= 60)  return 'text-yellow-400'
  if (aqi <= 80)  return 'text-orange-400'
  if (aqi <= 100) return 'text-red-400'
  return 'text-red-600'
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({
  emoji, label, city, value, sub, borderColor,
}: {
  emoji: string; label: string; city: string
  value: string; sub: string; borderColor: string
}) {
  return (
    <div className={`card p-5 border-l-4 ${borderColor}`}>
      <p className="text-gray-400 text-xs mb-2 font-medium tracking-wide uppercase">
        {emoji} {label}
      </p>
      <p className="text-xl font-bold text-white">{city}</p>
      <p className="text-2xl font-extrabold mt-1 text-white">{value}</p>
      <p className="text-gray-500 text-xs mt-2">{sub}</p>
    </div>
  )
}

// ─── Leaderboard Row ─────────────────────────────────────────────────────────

function LeaderRow({
  rank, name, value, valueClass,
}: {
  rank: number; name: string; value: string; valueClass: string
}) {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded bg-dark-800">
      <div className="flex items-center gap-3">
        <span className="w-7 text-center text-sm">{medal}</span>
        <span className="text-white text-sm">{name}</span>
      </div>
      <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  // Fetch current weather + AQI for every city
  const { data: snapshots, isLoading, isError, dataUpdatedAt, refetch } = useQuery<CitySnapshot[]>({
    queryKey: ['dashboard-snapshots'],
    queryFn: async () => {
      const results: CitySnapshot[] = []
      for (const city of CITIES) {
        try {
          const [wRes, aRes] = await Promise.all([
            apiService.getCurrentWeather(city.lat, city.lng),
            apiService.getAirQuality(city.lat, city.lng),
          ])
          const w = wRes.data
          const a = aRes.data
          results.push({
            name:             city.name,
            temperature:      w?.temperature      ?? 0,
            feels_like:       w?.feels_like        ?? 0,
            humidity:         w?.humidity         ?? 0,
            wind_speed:       w?.wind_speed        ?? 0,
            precipitation_prob: 0,
            aqi:              a?.aqi               ?? 0,
            aqi_category:     a?.aqi_category      ?? 'Unknown',
            pm2_5:            a?.pm2_5             ?? 0,
            pm10:             a?.pm10              ?? 0,
          })
        } catch {
          // city failed — skip
        }
      }
      return results
    },
    refetchInterval: 10 * 60 * 1000, // every 10 min
  })

  // Fetch 48-hour hourly forecast for Delhi (chart sample) 
  const { data: hourlyRaw } = useQuery({
    queryKey: ['dashboard-hourly-delhi'],
    queryFn: async () => {
      const res = await apiService.getHourlyForecast(28.7041, 77.1025, 24)
      return res.data
    },
    staleTime: 30 * 60 * 1000,
  })

  // ── Derived analytics ────────────────────────────────────────────────────

  const stats = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return null

    const byTemp = [...snapshots].sort((a, b) => b.temperature - a.temperature)
    const byAqi  = [...snapshots].sort((a, b) => b.aqi - a.aqi)
    const byWind = [...snapshots].sort((a, b) => b.wind_speed - a.wind_speed)
    const byHum  = [...snapshots].sort((a, b) => b.humidity - a.humidity)

    const avgTemp = snapshots.reduce((s, c) => s + c.temperature, 0) / snapshots.length
    const avgAqi  = snapshots.reduce((s, c) => s + c.aqi, 0)  / snapshots.length
    const avgHum  = snapshots.reduce((s, c) => s + c.humidity, 0) / snapshots.length

    return { byTemp, byAqi, byWind, byHum, avgTemp, avgAqi, avgHum }
  }, [snapshots])

  // ── Hourly chart data (temperature + humidity) ────────────────────────────

  const chartData = useMemo(() => {
    if (!hourlyRaw?.forecasts) return []
    return (hourlyRaw.forecasts as any[]).slice(0, 24).map((h: any) => ({
      time:        new Date(h.forecast_time).getHours() + ':00',
      temp:        h.temperature   != null ? +h.temperature.toFixed(1)   : null,
      humidity:    h.humidity      != null ? +h.humidity.toFixed(0)      : null,
      wind:        h.wind_speed    != null ? +(h.wind_speed * 3.6).toFixed(1) : null, // m/s → km/h
      rain_prob:   h.precipitation_probability ?? null,
    }))
  }, [hourlyRaw])

  // ── Last updated label ────────────────────────────────────────────────────

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—'

  // ── Loading / error states ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center gap-3">
        <RefreshCw className="text-primary-400 animate-spin" size={28} />
        <p className="text-white text-lg">Loading analytics…</p>
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-red-400 text-lg">Failed to load data. Is the backend running?</p>
      </div>
    )
  }

  const { byTemp, byAqi, byWind, byHum, avgTemp, avgAqi, avgHum } = stats
  const hottest  = byTemp[0]
  const coldest  = byTemp[byTemp.length - 1]
  const worstAqi = byAqi[0]
  const bestAqi  = byAqi[byAqi.length - 1]

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Real-time intelligence across {CITIES.length} Indian cities
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm pt-1">
          <Activity size={14} />
          <span>Updated {lastUpdated}</span>
          <button
            onClick={() => refetch()}
            className="ml-2 p-1.5 rounded hover:bg-dark-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className="text-primary-400" />
          </button>
        </div>
      </div>

      {/* ── Top Insight Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          emoji="🔥" label="Hottest City"
          city={hottest.name}
          value={`${hottest.temperature.toFixed(1)}°C`}
          sub={`Feels like ${hottest.feels_like > 0 ? hottest.feels_like.toFixed(1) + '°C' : hottest.temperature.toFixed(1) + '°C'} · ${hottest.humidity}% humidity`}
          borderColor="border-l-red-500"
        />
        <InsightCard
          emoji="❄️" label="Coolest City"
          city={coldest.name}
          value={`${coldest.temperature.toFixed(1)}°C`}
          sub={`Spread across cities: ${(hottest.temperature - coldest.temperature).toFixed(1)}°C`}
          borderColor="border-l-blue-500"
        />
        <InsightCard
          emoji="✨" label="Cleanest Air"
          city={bestAqi.name}
          value={`AQI ${bestAqi.aqi.toFixed(0)}`}
          sub={`${bestAqi.aqi_category} · PM2.5 ${bestAqi.pm2_5.toFixed(1)} µg/m³`}
          borderColor="border-l-green-500"
        />
        <InsightCard
          emoji="⚠️" label="Worst Air Quality"
          city={worstAqi.name}
          value={`AQI ${worstAqi.aqi.toFixed(0)}`}
          sub={`${worstAqi.aqi_category} · PM2.5 ${worstAqi.pm2_5.toFixed(1)} µg/m³`}
          borderColor="border-l-orange-500"
        />
      </div>

      {/* ── Summary Stats Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Thermometer size={18} className="text-red-400" />,   label: 'Avg Temperature', value: `${avgTemp.toFixed(1)}°C`,    sub: `${CITIES.length} cities` },
          { icon: <Award size={18} className="text-yellow-400" />,      label: 'Avg AQI',         value: avgAqi.toFixed(0),             sub: 'European scale' },
          { icon: <Droplets size={18} className="text-blue-400" />,     label: 'Avg Humidity',    value: `${avgHum > 0 ? avgHum.toFixed(0) + '%' : '—'}`, sub: 'Relative humidity' },
          { icon: <Wind size={18} className="text-primary-400" />,      label: 'Strongest Wind',  value: `${(byWind[0].wind_speed * 3.6).toFixed(0)} km/h`, sub: byWind[0].name },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              {s.icon}
              <p className="text-gray-400 text-xs uppercase tracking-wide">{s.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Trend Charts (Delhi 24-hour) ─────────────────────────────────── */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature & Humidity */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-white mb-1">
              Temperature & Humidity — Delhi (next 24 h)
            </h3>
            <p className="text-gray-500 text-xs mb-4">Hourly forecast trend</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="time" tick={{ fill: '#718096', fontSize: 11 }} interval={3} />
                <YAxis yAxisId="temp" tick={{ fill: '#718096', fontSize: 11 }} unit="°" />
                <YAxis yAxisId="hum"  orientation="right" tick={{ fill: '#718096', fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 6 }}
                  labelStyle={{ color: '#a0aec0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                <Line yAxisId="temp" type="monotone" dataKey="temp"     name="Temp °C"    stroke="#f56565" strokeWidth={2} dot={false} />
                <Line yAxisId="hum"  type="monotone" dataKey="humidity" name="Humidity %" stroke="#63b3ed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wind & Rain Probability */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-white mb-1">
              Wind & Rain Probability — Delhi (next 24 h)
            </h3>
            <p className="text-gray-500 text-xs mb-4">Hourly forecast trend</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="time" tick={{ fill: '#718096', fontSize: 11 }} interval={3} />
                <YAxis yAxisId="wind"   tick={{ fill: '#718096', fontSize: 11 }} unit=" km/h" />
                <YAxis yAxisId="rain"   orientation="right" tick={{ fill: '#718096', fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 6 }}
                  labelStyle={{ color: '#a0aec0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                <Line yAxisId="wind" type="monotone" dataKey="wind"      name="Wind km/h"    stroke="#68d391" strokeWidth={2} dot={false} />
                <Line yAxisId="rain" type="monotone" dataKey="rain_prob" name="Rain chance %" stroke="#76e4f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Leaderboards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-white mb-4">🌡️ Temperature Ranking</h3>
          <div className="space-y-2">
            {byTemp.map((c, i) => (
              <LeaderRow
                key={c.name}
                rank={i + 1}
                name={c.name}
                value={`${c.temperature.toFixed(1)}°C`}
                valueClass="text-red-400"
              />
            ))}
          </div>
        </div>

        {/* AQI worst-first */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-white mb-4">💨 Air Quality (Worst → Best)</h3>
          <div className="space-y-2">
            {byAqi.map((c, i) => (
              <LeaderRow
                key={c.name}
                rank={i + 1}
                name={c.name}
                value={`AQI ${c.aqi.toFixed(0)}`}
                valueClass={aqiColor(c.aqi)}
              />
            ))}
          </div>
        </div>

        {/* Wind */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-white mb-4">💨 Wind Speed Ranking</h3>
          <div className="space-y-2">
            {byWind.map((c, i) => (
              <LeaderRow
                key={c.name}
                rank={i + 1}
                name={c.name}
                value={`${(c.wind_speed * 3.6).toFixed(0)} km/h`}
                valueClass="text-teal-400"
              />
            ))}
          </div>
        </div>

        {/* Humidity */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-white mb-4">💧 Humidity Ranking</h3>
          <div className="space-y-2">
            {byHum.map((c, i) => (
              <LeaderRow
                key={c.name}
                rank={i + 1}
                name={c.name}
                value={`${c.humidity}%`}
                valueClass="text-blue-400"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── City Cards Grid ───────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">City Overview</h2>
          <p className="text-gray-500 text-sm">Click a city to drill in →</p>
        </div>
        <CityWeatherGrid cities={CITIES} />
      </div>

    </div>
  )
}
