'use client'
import { RefreshCw } from 'lucide-react'

interface SyncProgressProps {
  itemCount?: number
  progress?: number
  onCancel?: () => void
}

export default function SyncProgress({ itemCount = 3, progress = 60, onCancel }: SyncProgressProps) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 h-[60px] gap-3"
      style={{ backgroundColor: 'var(--color-accent-light)' }}
    >
      {/* Left */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <RefreshCw size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} className="animate-spin" />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>
            Syncing {itemCount} items...
          </span>
          <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'var(--color-neutral-200)' }}>
            <div
              className="h-1 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: 'var(--color-accent)' }}
            />
          </div>
        </div>
      </div>

      {/* Right */}
      <button
        onClick={onCancel}
        className="text-xs font-medium flex-shrink-0"
        style={{ color: 'var(--color-accent)' }}
      >
        Cancel
      </button>
    </div>
  )
}
