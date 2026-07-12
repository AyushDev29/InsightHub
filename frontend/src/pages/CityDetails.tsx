/**
 * City Details Page
 * Deep-dive for a single city: current conditions, 48-hour forecast,
 * 16-day forecast, AQI breakdown, and historical weekly data.
 */

import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { ArrowLeft, Thermometer, Wind, Droplets, Eye } from 'lucide-react'
import { getWeatherIcon, formatTemperature } from '../utils/weather'

// ─── City list (must stay in sync with Dashboard) ───────────────────────────

const CITIES = [
  { id: 'mumbai',    name: 'Mumbai',    lat: 19.0760, lng: 72.8777 },
  { id: 'delhi',     name: 'Delhi',     lat: 28.7041, lng: 77.1025 },
  { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 'chennai',   name: 'Chennai',   lat: 13.0827, lng: 80.2707 },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { id: 'kolkata',   name: 'Kolkata',   lat: 22.5726, lng: 88.3639 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function aqiColor(aqi: number) {
  if (aqi <= 20)  return 'text-green-400'
  if (aqi <= 40)  return 'text-lime-400'
  if (aqi <= 60)  return 'text-yellow-400'
  if (aqi <= 80)  return 'text-orange-400'
  if (aqi <= 100) return 'text-red-400'
  return 'text-red-600'
}

function aqiBadgeBg(aqi: number) {
  if (aqi <= 20)  return 'bg-green-500/20 text-green-400'
  if (aqi <= 40)  return 'bg-lime-500/20 text-lime-400'
  if (aqi <= 60)  return 'bg-yellow-500/20 text-yellow-400'
  if (aqi <= 80)  return 'bg-orange-500/20 text-orange-400'
  return 'bg-red-500/20 text-red-400'
}

// ─── Stat Tile ────────────────────────────────────────────────────────────────

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="text-primary-400">{icon}</div>
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
        <p className="text-white font-bold text-base">{value}</p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CityDetails() {
  const { cityId } = useParams<{ cityId: string }>()
  const navigate   = useNavigate()
  const location   = useLocation()

  // Prefer state passed by the city card; fall back to lookup
  const cityFromState = location.state?.city as { id: string; name: string; lat: number; lng: number } | undefined
  const city = cityFromState ?? CITIES.find((c) => c.id === cityId)

  if (!city) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg">City not found.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Back to Dashboard</button>
      </div>
    )
  }

  // ── Data fetching ─────────────────────────────────────────────────────────

  const { data: current } = useQuery({
    queryKey: ['weather', 'current', city.lat, city.lng],
    queryFn: () => apiService.getCurrentWeather(city.lat, city.lng).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const { data: aqi } = useQuery({
    queryKey: ['weather', 'aqi', city.lat, city.lng],
    queryFn: () => apiService.getAirQuality(city.lat, city.lng).then((r) => r.data),
    staleTime: 15 * 60 * 1000,
  })

  const { data: hourly, isLoading: hourlyLoading } = useQuery({
    queryKey: ['weather', 'hourly', city.lat, city.lng],
    queryFn: () => apiService.getHourlyForecast(city.lat, city.lng, 48).then((r) => r.data),
    staleTime: 30 * 60 * 1000,
  })

  const { data: daily, isLoading: dailyLoading } = useQuery({
    queryKey: ['weather', 'daily', city.lat, city.lng],
    queryFn: () => apiService.getDailyForecast(city.lat, city.lng, 16).then((r) => r.data),
    staleTime: 60 * 60 * 1000,
  })

  // ── Chart data ────────────────────────────────────────────────────────────

  const hourlyChart = (hourly?.forecasts ?? []).slice(0, 48).map((h) => ({
    time:     new Date(h.forecast_time).getHours() + ':00',
    temp:     h.temperature     != null ? +h.temperature.toFixed(1)           : null,
    humidity: h.humidity        != null ? +h.humidity.toFixed(0)              : null,
    wind:     h.wind_speed      != null ? +(h.wind_speed * 3.6).toFixed(1)    : null,
    rain:     h.precipitation_probability                                      ?? null,
  }))

  const dailyChart = (daily?.forecasts ?? []).map((d) => ({
    date:  d.forecast_date.slice(5),      // MM-DD
    max:   d.temperature_max != null ? +d.temperature_max.toFixed(1) : null,
    min:   d.temperature_min != null ? +d.temperature_min.toFixed(1) : null,
    rain:  d.precipitation_probability   ?? null,
    wind:  d.wind_speed_max != null ? +(d.wind_speed_max * 3.6).toFixed(0) : null,
  }))

  // ── Derived current values ────────────────────────────────────────────────

  const feelsLike = current?.feels_like && current.feels_like > 0
    ? formatTemperature(current.feels_like)
    : formatTemperature(current?.temperature ?? 0)

  const windKmh = current?.wind_speed ? Math.round(current.wind_speed * 3.6) : 0
  const visKm   = current?.visibility ? (current.visibility / 1000).toFixed(1) : '—'

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-8">

      {/* ── Back Button + Title ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">{city.name}</h1>
          <p className="text-gray-400 text-sm">
            {current?.weather_description ?? 'Loading…'} · {city.lat.toFixed(2)}°N, {city.lng.toFixed(2)}°E
          </p>
        </div>
        {current && (
          <span className="ml-auto text-5xl">{getWeatherIcon(current.weather_code, current.is_day)}</span>
        )}
      </div>

      {/* ── Current Conditions ─────────────────────────────────────────── */}
      {current && (
        <div className="card p-6">
          <div className="flex flex-wrap items-center gap-8 mb-6">
            <div>
              <p className="text-6xl font-extrabold text-white">{formatTemperature(current.temperature)}</p>
              <p className="text-gray-400 mt-1">Feels like {feelsLike}</p>
            </div>
            {aqi && (
              <div className={`px-5 py-3 rounded-xl ${aqiBadgeBg(aqi.aqi)}`}>
                <p className="text-xs uppercase tracking-wide mb-1">Air Quality</p>
                <p className="text-2xl font-bold">AQI {aqi.aqi}</p>
                <p className="text-sm">{aqi.aqi_category}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatTile icon={<Droplets size={20} />}    label="Humidity"    value={`${current.humidity ?? '—'}%`} />
            <StatTile icon={<Wind size={20} />}         label="Wind"        value={`${windKmh} km/h ${current.wind_direction_label ?? ''}`} />
            <StatTile icon={<Eye size={20} />}          label="Visibility"  value={`${visKm} km`} />
            <StatTile icon={<Thermometer size={20} />}  label="Pressure"    value={current.pressure ? `${current.pressure} hPa` : '—'} />
          </div>
        </div>
      )}

      {/* ── AQI Breakdown ─────────────────────────────────────────────── */}
      {aqi && (
        <div className="card p-6">
          <h3 className="text-base font-semibold text-white mb-4">💨 Pollutant Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'PM2.5', value: aqi.pm2_5,  unit: 'µg/m³' },
              { label: 'PM10',  value: aqi.pm10,   unit: 'µg/m³' },
              { label: 'O₃',    value: aqi.o3,     unit: 'µg/m³' },
              { label: 'NO₂',   value: aqi.no2,    unit: 'µg/m³' },
              { label: 'SO₂',   value: aqi.so2,    unit: 'µg/m³' },
              { label: 'CO',    value: aqi.co,     unit: 'µg/m³' },
            ].map((p) => (
              <div key={p.label} className="bg-dark-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">{p.label}</p>
                <p className={`text-xl font-bold ${aqiColor(aqi.aqi)}`}>
                  {p.value != null ? p.value.toFixed(1) : '—'}
                </p>
                <p className="text-gray-500 text-xs">{p.unit}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4 border-t border-dark-700 pt-4">
            {aqi.health_recommendation}
          </p>
        </div>
      )}

      {/* ── 48-hour Forecast Charts ─────────────────────────────────────── */}
      {!hourlyLoading && hourlyChart.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-base font-semibold text-white mb-1">Temperature & Humidity (48 h)</h3>
            <p className="text-gray-500 text-xs mb-4">Hour-by-hour forecast</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={hourlyChart} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="time" tick={{ fill: '#718096', fontSize: 10 }} interval={5} />
                <YAxis yAxisId="t" tick={{ fill: '#718096', fontSize: 10 }} unit="°" />
                <YAxis yAxisId="h" orientation="right" tick={{ fill: '#718096', fontSize: 10 }} unit="%" />
                <Tooltip contentStyle={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 6 }} labelStyle={{ color: '#a0aec0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                <Line yAxisId="t" type="monotone" dataKey="temp"     name="Temp °C"    stroke="#f56565" strokeWidth={2} dot={false} />
                <Line yAxisId="h" type="monotone" dataKey="humidity" name="Humidity %" stroke="#63b3ed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold text-white mb-1">Wind & Rain Probability (48 h)</h3>
            <p className="text-gray-500 text-xs mb-4">Hour-by-hour forecast</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={hourlyChart} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="time" tick={{ fill: '#718096', fontSize: 10 }} interval={5} />
                <YAxis yAxisId="w" tick={{ fill: '#718096', fontSize: 10 }} unit=" km/h" />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: '#718096', fontSize: 10 }} unit="%" />
                <Tooltip contentStyle={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 6 }} labelStyle={{ color: '#a0aec0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                <Line yAxisId="w" type="monotone" dataKey="wind" name="Wind km/h"    stroke="#68d391" strokeWidth={2} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="rain" name="Rain chance %" stroke="#76e4f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── 16-day Daily Forecast Charts ────────────────────────────────── */}
      {!dailyLoading && dailyChart.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-base font-semibold text-white mb-1">Temperature Range (16 days)</h3>
            <p className="text-gray-500 text-xs mb-4">Daily high and low</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyChart} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="date" tick={{ fill: '#718096', fontSize: 10 }} interval={2} />
                <YAxis tick={{ fill: '#718096', fontSize: 10 }} unit="°" />
                <Tooltip contentStyle={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 6 }} labelStyle={{ color: '#a0aec0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                <Line type="monotone" dataKey="max" name="High °C" stroke="#f56565" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="min" name="Low °C"  stroke="#63b3ed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold text-white mb-1">Rain & Wind (16 days)</h3>
            <p className="text-gray-500 text-xs mb-4">Daily max wind and precipitation chance</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyChart} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="date" tick={{ fill: '#718096', fontSize: 10 }} interval={2} />
                <YAxis yAxisId="r" tick={{ fill: '#718096', fontSize: 10 }} unit="%" />
                <YAxis yAxisId="w" orientation="right" tick={{ fill: '#718096', fontSize: 10 }} unit=" km/h" />
                <Tooltip contentStyle={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 6 }} labelStyle={{ color: '#a0aec0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#a0aec0' }} />
                <Bar  yAxisId="r" dataKey="rain" name="Rain %"      fill="#76e4f7" opacity={0.7} />
                <Line yAxisId="w" type="monotone" dataKey="wind" name="Wind km/h" stroke="#68d391" strokeWidth={2} dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── 16-day Daily Card List ────────────────────────────────────────── */}
      {!dailyLoading && daily?.forecasts && daily.forecasts.length > 0 && (
        <div className="card p-6">
          <h3 className="text-base font-semibold text-white mb-4">📅 16-Day Daily Forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {daily.forecasts.map((d) => (
              <div key={d.forecast_date} className="bg-dark-800 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-xs mb-2">
                  {new Date(d.forecast_date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-2xl mb-1">{getWeatherIcon(d.weather_code, true)}</p>
                <p className="text-red-400 text-sm font-bold">{d.temperature_max?.toFixed(0)}°</p>
                <p className="text-blue-400 text-sm">{d.temperature_min?.toFixed(0)}°</p>
                {d.precipitation_probability != null && (
                  <p className="text-cyan-400 text-xs mt-1">💧 {d.precipitation_probability}%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
