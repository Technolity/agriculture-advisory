'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Bell, User, ScanLine, CloudSun, BookOpen, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import WeatherWidget from '@/components/WeatherWidget'
import api from '@/lib/axios'

const quickActions = [
  { label: 'Disease Detection', icon: ScanLine, href: '/detect', bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  { label: 'Weather', icon: CloudSun, href: '#', bg: '#DBEAFE', color: '#1E88E5' },
  { label: 'Crop Guide', icon: BookOpen, href: '/guide', bg: 'var(--color-primary-pale)', color: 'var(--color-primary)' },
  { label: 'Prices', icon: BarChart2, href: '/prices', bg: 'var(--color-accent-light)', color: 'var(--color-accent)' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  const { data: weather } = useQuery({
    queryKey: ['weather'],
    queryFn: () => api.get('/api/weather?latitude=34.08&longitude=74.79').then(r => r.data),
    enabled: isAuthenticated,
  })

  const { data: detections } = useQuery({
    queryKey: ['detections'],
    queryFn: () => api.get('/api/diseases/history').then(r => r.data),
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) return null

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      {/* Greeting row */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{getGreeting()}</p>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>
            {user?.name || 'Farmer'} 👋
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
            <Bell size={18} style={{ color: 'var(--color-neutral-700)' }} />
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-pale)' }}>
            <User size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <WeatherWidget
        temperature={weather?.temperature ?? 18}
        condition={weather?.condition ?? 'Partly Cloudy'}
        humidity={weather?.humidity ?? 72}
        windSpeed={weather?.wind_speed ?? 12}
        location={user?.region ? `${user.region}` : 'Srinagar, Kashmir'}
      />

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-neutral-700)' }}>Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, href, bg, color }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl"
              style={{ backgroundColor: 'var(--color-white)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-[10px] font-medium text-center" style={{ color: 'var(--color-neutral-700)' }}>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="rounded-xl p-4 flex flex-col gap-1" style={{ backgroundColor: 'var(--color-primary)' }}>
        <span className="text-xs font-semibold text-white opacity-75">TIP OF THE DAY</span>
        <p className="text-sm font-medium text-white">
          Water your wheat in the early morning to reduce evaporation and prevent fungal diseases.
        </p>
      </div>

      {/* Recent Detections */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-neutral-700)' }}>Recent Detections</h2>
        {detections?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {detections.slice(0, 3).map((d: { id: string; disease_name: string; confidence: number; crop_name: string; created_at: string }) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--color-white)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>{d.disease_name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{d.crop_name}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}>
                  {Math.round(d.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--color-white)' }}>
            <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>No detections yet.</p>
            <Link href="/detect" className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              Analyze your first crop →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
