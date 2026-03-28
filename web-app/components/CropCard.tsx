'use client'
import { Sprout, Calendar, Wheat, Droplets } from 'lucide-react'
import { Crop } from '@/types'

interface CropCardProps {
  crop: Crop
  onClick?: () => void
}

export default function CropCard({ crop, onClick }: CropCardProps) {
  return (
    <div
      className="rounded-xl flex flex-col cursor-pointer"
      style={{
        backgroundColor: 'var(--color-white)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        width: '170px',
      }}
      onClick={onClick}
    >
      {/* Image area */}
      <div
        className="flex items-center justify-center rounded-t-xl"
        style={{ backgroundColor: 'var(--color-primary-pale)', height: '100px' }}
      >
        <Sprout size={36} style={{ color: 'var(--color-primary)' }} />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3">
        {/* Name */}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>{crop.name}</span>
          <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{crop.name_urdu}</span>
        </div>

        {/* Season badge */}
        <div
          className="self-start flex items-center px-2 h-[22px] rounded-full text-xs font-medium"
          style={{ backgroundColor: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}
        >
          {crop.season}
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} style={{ color: 'var(--color-neutral-500)' }} />
            <span className="text-xs" style={{ color: 'var(--color-neutral-700)' }}>Sow: {crop.planting_month}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wheat size={12} style={{ color: 'var(--color-neutral-500)' }} />
            <span className="text-xs" style={{ color: 'var(--color-neutral-700)' }}>Harvest: {crop.harvest_month}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets size={12} style={{ color: 'var(--color-neutral-500)' }} />
            <span className="text-xs" style={{ color: 'var(--color-neutral-700)' }}>{crop.water_requirement || 'Low water'}</span>
          </div>
        </div>

        {/* View Guide button */}
        <button
          className="w-full h-8 rounded-lg text-xs font-medium transition-colors hover:bg-green-50"
          style={{
            border: '1px solid var(--color-primary)',
            color: 'var(--color-primary)',
            backgroundColor: 'transparent',
          }}
        >
          View Guide
        </button>
      </div>
    </div>
  )
}
