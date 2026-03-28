'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import CropCard from '@/components/CropCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import api from '@/lib/axios'
import { Crop } from '@/types'

const seasons = ['All', 'Rabi', 'Kharif', 'Zaid']

export default function GuidePage() {
  const [season, setSeason] = useState('All')
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)

  const { data: crops, isLoading } = useQuery<Crop[]>({
    queryKey: ['crops', season],
    queryFn: () =>
      api.get(`/api/crops${season !== 'All' ? `?season=${season}` : ''}`).then(r => r.data.crops || r.data),
  })

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold pt-2" style={{ color: 'var(--color-neutral-900)' }}>Planting Guide</h1>

      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {seasons.map((s) => (
          <button
            key={s}
            onClick={() => setSeason(s)}
            className="flex-shrink-0 h-8 px-4 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: season === s ? 'var(--color-primary)' : 'var(--color-white)',
              color: season === s ? 'white' : 'var(--color-neutral-700)',
              border: season === s ? 'none' : '1px solid var(--color-neutral-200)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <div className="flex flex-wrap gap-4">
          {(crops || []).map((crop) => (
            <CropCard key={crop.id} crop={crop} onClick={() => setSelectedCrop(crop)} />
          ))}
          {!crops?.length && (
            <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>No crops found for this season.</p>
          )}
        </div>
      )}

      {/* Drawer */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setSelectedCrop(null)}>
          <div
            className="w-full rounded-t-2xl p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--color-white)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-neutral-900)' }}>{selectedCrop.name}</h2>
                <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>{selectedCrop.name_urdu}</p>
              </div>
              <button onClick={() => setSelectedCrop(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
                <X size={16} style={{ color: 'var(--color-neutral-700)' }} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Season', value: selectedCrop.season },
                { label: 'Region', value: selectedCrop.region },
                { label: 'Planting', value: selectedCrop.planting_month },
                { label: 'Harvest', value: selectedCrop.harvest_month },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
                  <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
