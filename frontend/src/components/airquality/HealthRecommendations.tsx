/**
 * HealthRecommendations Component
 * Provides actionable health advice based on current AQI
 */

import { useQuery } from '@tanstack/react-query'
import { Heart, AlertTriangle, Activity, Shield, Users } from 'lucide-react'
import { apiService } from '../../services/api'

interface HealthRecommendationsProps {
  latitude: number
  longitude: number
}

function getRecommendations(aqi: number | null) {
  if (aqi === null) return null

  // Activity Recommendations
  let activityLevel: string
  let activityColor: string
  let activityAdvice: string[]

  if (aqi <= 20) {
    activityLevel = 'Safe'
    activityColor = 'text-green-400'
    activityAdvice = [
      'All outdoor activities are safe',
      'Great day for outdoor exercise',
      'No need for protective equipment',
      'Open windows for fresh air',
    ]
  } else if (aqi <= 40) {
    activityLevel = 'Generally Safe'
    activityColor = 'text-lime-400'
    activityAdvice = [
      'Most people can enjoy outdoor activities',
      'Sensitive groups should limit intense exercise',
      'Outdoor activities safe for general population',
      'Children and elderly should be cautious',
    ]
  } else if (aqi <= 60) {
    activityLevel = 'Moderate'
    activityColor = 'text-yellow-400'
    activityAdvice = [
      'Reduce strenuous outdoor activities',
      'Sensitive groups should avoid intense exercise',
      'Limit outdoor time for children and elderly',
      'Take breaks during physical activities',
    ]
  } else if (aqi <= 80) {
    activityLevel = 'Poor'
    activityColor = 'text-orange-400'
    activityAdvice = [
      'Avoid strenuous outdoor activities',
      'Minimize outdoor exposure',
      'Stay indoors if possible',
      'Keep children and elderly indoors',
    ]
  } else if (aqi <= 100) {
    activityLevel = 'Very Poor'
    activityColor = 'text-red-400'
    activityAdvice = [
      'Avoid all outdoor activities',
      'Stay indoors as much as possible',
      'Keep all windows closed',
      'Use air purifiers if available',
    ]
  } else {
    activityLevel = 'Hazardous'
    activityColor = 'text-red-600'
    activityAdvice = [
      'Do NOT go outside unnecessarily',
      'Stay indoors with windows/doors closed',
      'Wear N95/P100 mask if you must go out',
      'Use air purifier on maximum setting',
    ]
  }

  // Mask Recommendations
  let maskType: string
  let maskAdvice: string[]

  if (aqi <= 20) {
    maskType = 'No mask needed'
    maskAdvice = ['Air quality is good', 'No protection required']
  } else if (aqi <= 40) {
    maskType = 'Optional - Cloth mask'
    maskAdvice = ['Basic protection for sensitive groups', 'Children/elderly optional mask']
  } else if (aqi <= 60) {
    maskType = 'Recommended - N95 mask'
    maskAdvice = ['Sensitive groups should wear N95', 'Protects against PM2.5']
  } else if (aqi <= 80) {
    maskType = 'Required - N95 mask'
    maskAdvice = ['Everyone should wear N95', 'Replace masks regularly']
  } else {
    maskType = 'Required - N95/P100 mask'
    maskAdvice = ['Use N95 or P100 respirator', 'Double masking recommended']
  }

  // Precautions
  const precautions: string[] = [
    'Check AQI before planning outdoor activities',
    'Keep windows and doors closed',
    'Use air purifier if available',
    'Avoid outdoor exercise during peak pollution hours (6-10 AM, 6-10 PM)',
    'Stay hydrated to help clear respiratory system',
    'Avoid smoking and secondhand smoke',
    'Use AC with air filter on recirculation mode',
    'Monitor your symptoms (cough, breathing difficulty)',
  ]

  // Vulnerable Groups
  const vulnerableGroups = [
    {
      group: 'Children (< 14 years)',
      reason: 'Developing lungs, higher breathing rate',
      advice: 'Limit outdoor time, monitor symptoms closely',
    },
    {
      group: 'Elderly (> 65 years)',
      reason: 'Weaker immune system, existing conditions',
      advice: 'Stay indoors on poor air days',
    },
    {
      group: 'Asthma/Respiratory patients',
      reason: 'Sensitive airways, more susceptible',
      advice: 'Carry rescue inhaler, limit outdoor time',
    },
    {
      group: 'Heart disease patients',
      reason: 'Air pollution strains cardiovascular system',
      advice: 'Avoid strenuous activity, stay indoors',
    },
    {
      group: 'Pregnant women',
      reason: 'Fetus susceptible to pollution effects',
      advice: 'Minimize outdoor exposure',
    },
  ]

  return {
    activityLevel,
    activityColor,
    activityAdvice,
    maskType,
    maskAdvice,
    precautions,
    vulnerableGroups,
  }
}

export default function HealthRecommendations({
  latitude,
  longitude,
}: HealthRecommendationsProps) {
  const { data: aqRes, isLoading, isError } = useQuery({
    queryKey: ['health-recommendations', latitude, longitude],
    queryFn: async () => {
      return apiService.getAirQuality(latitude, longitude)
    },
    refetchInterval: 15 * 60 * 1000,
    staleTime: 14 * 60 * 1000,
  })

  const aqi = aqRes?.data?.aqi as number | undefined
  const recommendations = getRecommendations(aqi || null)

  if (isLoading) {
    return (
      <div className="card p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading recommendations...</div>
      </div>
    )
  }

  if (isError || !recommendations) {
    return (
      <div className="card p-8 bg-red-900/20 border border-red-700">
        <p className="text-red-400">Failed to load recommendations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Activity Level */}
      <div className={`card p-6 border-l-4 border-primary-500`}>
        <div className="flex items-start gap-4">
          <Activity className={`${recommendations.activityColor} flex-shrink-0`} size={32} />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Outdoor Activity Level</h3>
            <p className={`text-2xl font-bold ${recommendations.activityColor} mb-3`}>
              {recommendations.activityLevel}
            </p>
            <ul className="space-y-1">
              {recommendations.activityAdvice.map((advice, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mask Recommendation */}
      <div className="card p-6 border-l-4 border-amber-500">
        <div className="flex items-start gap-4">
          <Shield className="text-amber-400 flex-shrink-0" size={32} />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Mask Recommendation</h3>
            <p className="text-xl font-bold text-amber-400 mb-3">{recommendations.maskType}</p>
            <ul className="space-y-1">
              {recommendations.maskAdvice.map((advice, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Precautions */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="text-yellow-400" size={24} />
          General Precautions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.precautions.map((precaution, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 bg-dark-700/50 rounded">
              <span className="text-yellow-400 mt-1 text-xs">✓</span>
              <p className="text-sm text-gray-300">{precaution}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerable Groups */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="text-red-400" size={24} />
          Vulnerable Groups
        </h3>
        <div className="space-y-3">
          {recommendations.vulnerableGroups.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-red-900/20 border border-red-700 rounded-lg"
            >
              <p className="font-semibold text-red-300 mb-1">{item.group}</p>
              <p className="text-xs text-gray-400 mb-2">
                <span className="text-gray-500">Why: </span>
                {item.reason}
              </p>
              <p className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">→</span>
                <span>{item.advice}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Health Resources */}
      <div className="card p-6 bg-dark-700/50">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Heart className="text-pink-400" size={24} />
          Health Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">WHO Air Quality Guidelines:</span> Established safe exposure limits
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">EPA Standards:</span> US Environmental Protection Agency safety standards
            </p>
          </div>
          <div>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Indoor Air Quality:</span> Use HEPA filters and air purifiers
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Symptoms to Watch:</span> Shortness of breath, persistent cough, fatigue
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
