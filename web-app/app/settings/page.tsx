'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Bell, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth, logout } from '@/hooks/useAuth'
import LanguageSelector from '@/components/LanguageSelector'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [lang, setLang] = useState<'en' | 'ur' | 'pa'>('en')
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold pt-2" style={{ color: 'var(--color-neutral-900)' }}>Settings</h1>

      {/* Profile */}
      <div className="rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--color-white)' }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {user?.name?.[0]?.toUpperCase() || <User size={24} color="white" />}
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-bold" style={{ color: 'var(--color-neutral-900)' }}>{user?.name || 'Farmer'}</p>
          <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>{user?.phone || '—'}</p>
          <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{user?.region || '—'}</p>
        </div>
      </div>

      {/* Language */}
      <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--color-white)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>Language</p>
        <LanguageSelector selected={lang} onChange={setLang} />
      </div>

      {/* Notifications */}
      <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--color-white)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>Preferences</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} style={{ color: 'var(--color-neutral-500)' }} />
            <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>Push Notifications</span>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className="w-11 h-6 rounded-full transition-all relative"
            style={{ backgroundColor: notifications ? 'var(--color-primary)' : 'var(--color-neutral-200)' }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
              style={{ left: notifications ? '22px' : '2px' }}
            />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Shield size={18} style={{ color: 'var(--color-neutral-500)' }} />
          <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>Disease Alerts</span>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  )
}
