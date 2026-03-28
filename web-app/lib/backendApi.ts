import type { AxiosRequestConfig } from 'axios'
import api from '@/lib/axios'
import type {
  Crop,
  DetectionHistoryItem,
  DetectionResult,
  MarketPrice,
  WeatherData,
} from '@/types'

type ApiSuccessResponse<T> = {
  success: true
  data: T
  meta?: unknown
}

type AuthResult = {
  user: {
    id: string
    email: string
    name: string
    language: string
    region?: string | null
    createdAt?: string
  }
  token: string
}

type RegisterPayload = {
  email: string
  password: string
  name: string
  phone?: string
  region?: string
}

type LoginPayload = {
  email: string
  password: string
}

type BackendWeatherResponse = {
  temperature?: number
  condition?: string
  humidity?: number
  rainfall?: number
  windSpeed?: number
  forecastDate?: string
  message?: string
}

type BackendCrop = {
  id: string
  name: string
  nameUrdu?: string | null
  region: string
  season: string
  plantingMonth: number
  harvestMonth: number
  waterNeeds?: string | null
}

type BackendMarketPrice = {
  id: string
  marketName: string
  marketRegion: string
  pricePerUnit: number
  unit: string
  crop?: {
    id: string
    name: string
  } | null
}

type BackendDetectionResult = {
  diseaseId?: string
  diseaseName?: string
  plantIdentified?: string
  isHealthy?: boolean
  confidence?: number
  severity?: string
  urgency?: string
  symptoms?: string[]
  treatmentSteps?: string[]
  preventionTips?: string[]
  additionalNotes?: string
  treatment?: string
  treatmentUrdu?: string | null
  message?: string
}

async function getApiData<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.get<ApiSuccessResponse<T>>(url, config)
  return response.data.data
}

async function postApiData<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post<ApiSuccessResponse<T>>(url, body, config)
  return response.data.data
}

function normalizeSeverity(
  severity?: string
): DetectionResult['severity'] {
  const value = severity?.toUpperCase()
  if (value === 'LOW' || value === 'MEDIUM' || value === 'HIGH' || value === 'NONE') return value
  return undefined
}

function normalizeUrgency(
  urgency?: string
): DetectionResult['urgency'] {
  if (urgency === 'immediate' || urgency === 'within_week' || urgency === 'routine' || urgency === 'none') return urgency
  return undefined
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResult> {
  return postApiData<AuthResult>('/api/auth/register', payload)
}

export async function loginUser(payload: LoginPayload): Promise<AuthResult> {
  return postApiData<AuthResult>('/api/auth/login', payload)
}

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  })

  const data = await getApiData<BackendWeatherResponse>(`/api/weather?${params.toString()}`)

  if (data.message) {
    return {
      temperature: 0,
      condition: 'Unavailable',
      humidity: 0,
      windSpeed: 0,
      rainRisk: 'Unavailable',
      location: '',
      forecast: [],
    }
  }

  return {
    temperature: data.temperature ?? 0,
    condition: data.condition ?? 'Unknown',
    humidity: data.humidity ?? 0,
    windSpeed: data.windSpeed ?? 0,
    rainRisk: (data.rainfall ?? 0) > 0 ? 'Rain expected' : 'Low Risk',
    location: '',
    forecast: [],
  }
}

export async function fetchCrops(season?: string): Promise<Crop[]> {
  const normalizedSeason =
    season && season !== 'All' ? season.toLowerCase() : undefined
  const query = normalizedSeason
    ? `?season=${encodeURIComponent(normalizedSeason)}`
    : ''

  const data = await getApiData<BackendCrop[]>(`/api/crops${query}`)

  return data.map((crop) => ({
    id: crop.id,
    name: crop.name,
    name_urdu: crop.nameUrdu ?? '',
    region: crop.region,
    season: crop.season,
    planting_month: String(crop.plantingMonth),
    harvest_month: String(crop.harvestMonth),
    water_requirement: crop.waterNeeds ?? undefined,
  }))
}

export async function fetchMarketPrices(region: string): Promise<MarketPrice[]> {
  const query = new URLSearchParams({ region }).toString()
  const data = await getApiData<BackendMarketPrice[]>(`/api/prices?${query}`)

  return data.map((price) => ({
    id: price.id,
    crop_name: price.crop?.name ?? 'Unknown crop',
    market_name: price.marketName,
    market_region: price.marketRegion,
    price_per_unit: price.pricePerUnit,
    unit: price.unit,
  }))
}

export async function fetchDetectionHistory(): Promise<DetectionHistoryItem[]> {
  return getApiData<DetectionHistoryItem[]>('/api/diseases/history')
}

export async function analyzeDisease(formData: FormData): Promise<DetectionResult> {
  const data = await postApiData<BackendDetectionResult>('/api/diseases/detect', formData)

  if (data.message) {
    return {
      disease: 'Analysis unavailable',
      plant_identified: 'Unknown',
      is_healthy: false,
      confidence: 0,
      severity: undefined,
      urgency: undefined,
      symptoms: [],
      treatment_steps: [data.message],
      prevention_tips: [],
      additional_notes: data.message,
      treatment: data.message,
    }
  }

  return {
    disease: data.diseaseName ?? 'Unknown',
    plant_identified: data.plantIdentified ?? 'Unknown plant',
    is_healthy: data.isHealthy ?? false,
    confidence: data.confidence ?? 0,
    severity: normalizeSeverity(data.severity),
    urgency: normalizeUrgency(data.urgency),
    symptoms: data.symptoms ?? [],
    treatment_steps: data.treatmentSteps ?? (data.treatment ? [data.treatment] : []),
    prevention_tips: data.preventionTips ?? [],
    additional_notes: data.additionalNotes ?? '',
    treatment: data.treatment ?? data.treatmentSteps?.[0] ?? 'Consult a local agronomist',
  }
}
