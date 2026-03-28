'use client'
import { MapPin, CloudSun, Cloud, CloudRain, Sun } from 'lucide-react'

interface WeatherWidgetProps {
  temperature?: number
  condition?: string
  humidity?: number
  windSpeed?: number
  rainRisk?: string
  location?: string
  forecast?: { day: string; temp: number; icon: string }[]
}

const forecastIconMap: Record<string, React.ReactNode> = {
  cloud: <Cloud size={18} color="white" />,
  sun: <Sun size={18} color="white" />,
  rain: <CloudRain size={18} color="white" />,
  'cloud-sun': <CloudSun size={18} color="white" />,
}

const defaultForecast = [
  { day: 'Mon', temp: 16, icon: 'cloud' },
  { day: 'Tue', temp: 18, icon: 'cloud-sun' },
  { day: 'Wed', temp: 14, icon: 'rain' },
  { day: 'Thu', temp: 17, icon: 'cloud' },
  { day: 'Fri', temp: 19, icon: 'sun' },
]

export default function WeatherWidget({
  temperature = 18,
  condition = 'Partly Cloudy',
  humidity = 72,
  windSpeed = 12,
  rainRisk = 'Low Risk',
  location = 'Srinagar, Kashmir',
  forecast = defaultForecast,
}: WeatherWidgetProps) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: 'linear-gradient(180deg, #1E88E5 0%, #0D47A1 100%)' }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} color="white" />
          <span className="text-sm font-medium text-white">{location}</span>
        </div>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.67)' }}>{condition}</span>
      </div>

      {/* Main temp row */}
      <div className="flex items-center gap-5">
        <span className="text-5xl font-bold text-white">{temperature}°C</span>
        <CloudSun size={52} color="white" />
      </div>

      {/* Stats pills */}
      <div className="flex gap-2">
        {[`💧 ${humidity}%`, `💨 ${windSpeed} km/h`, `🌧 ${rainRisk}`].map((stat) => (
          <div
            key={stat}
            className="flex items-center gap-1 px-3 h-7 rounded-full text-xs text-white"
            style={{ backgroundColor: 'rgba(255,255,255,0.13)' }}
          >
            {stat}
          </div>
        ))}
      </div>

      {/* Forecast row */}
      <div className="flex justify-between">
        {forecast.map((day) => (
          <div key={day.day} className="flex flex-col items-center gap-1 px-2 py-1.5">
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.67)' }}>{day.day}</span>
            {forecastIconMap[day.icon] || <Cloud size={18} color="white" />}
            <span className="text-xs font-semibold text-white">{day.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}
