'use client'
import { WifiOff } from 'lucide-react'
import { useOffline } from '@/hooks/useOffline'

export default function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) return null

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700"
      style={{ backgroundColor: 'var(--color-danger-light)' }}>
      <WifiOff size={16} style={{ color: 'var(--color-danger)' }} />
      <span>You&apos;re offline — showing cached data</span>
    </div>
  )
}
