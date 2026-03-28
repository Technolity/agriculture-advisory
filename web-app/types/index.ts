export interface User {
  id: string
  name: string
  email: string
  phone: string
  region: string
  language: string
}

export interface Crop {
  id: string
  name: string
  name_urdu: string
  region: string
  season: string
  planting_month: string
  harvest_month: string
  water_requirement?: string
}

export interface Disease {
  id: string
  name: string
  symptoms: string[]
  treatment: string[]
  severity_level: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface DetectionResult {
  disease: string
  confidence: number
  treatment: string
  severity?: 'LOW' | 'MEDIUM' | 'HIGH'
  symptoms?: string[]
  treatment_steps?: string[]
}

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  wind_speed: number
  rain_risk: string
  location: string
  forecast: ForecastDay[]
}

export interface ForecastDay {
  day: string
  icon: string
  temp: number
}

export interface MarketPrice {
  id: string
  crop_name: string
  market_name: string
  market_region: string
  price_per_unit: number
  unit: string
  change?: number
}
