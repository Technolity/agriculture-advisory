'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, Wheat } from 'lucide-react'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { fetchMarketPrices } from '@/lib/backendApi'
import { MarketPrice } from '@/types'

const regions = ['Kashmir', 'Punjab', 'Sindh', 'KPK']

export default function PricesPage() {
  const [region, setRegion] = useState('Kashmir')

  const { data: prices, isLoading } = useQuery<MarketPrice[]>({
    queryKey: ['prices', region],
    queryFn: () => fetchMarketPrices(region),
  })

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold pt-2" style={{ color: 'var(--color-neutral-900)' }}>Market Prices</h1>

      {/* Region tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className="flex-shrink-0 h-8 px-4 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: region === r ? 'var(--color-primary)' : 'var(--color-white)',
              color: region === r ? 'white' : 'var(--color-neutral-700)',
              border: region === r ? 'none' : '1px solid var(--color-neutral-200)',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Summary cards (horizontal scroll) */}
      {!isLoading && prices && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {prices.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="flex-shrink-0 flex flex-col gap-1 p-3 rounded-xl"
              style={{ backgroundColor: 'var(--color-white)', minWidth: 110 }}
            >
              <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{p.crop_name}</span>
              <span className="text-sm font-bold" style={{ color: 'var(--color-neutral-900)' }}>
                ₨ {p.price_per_unit}
              </span>
              {p.change !== undefined && (
                <div className="flex items-center gap-1">
                  {p.change >= 0
                    ? <TrendingUp size={12} style={{ color: 'var(--color-primary-light)' }} />
                    : <TrendingDown size={12} style={{ color: 'var(--color-danger)' }} />}
                  <span className="text-xs font-medium" style={{ color: p.change >= 0 ? 'var(--color-primary-light)' : 'var(--color-danger)' }}>
                    {Math.abs(p.change)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Price list */}
      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : (
        <div className="flex flex-col gap-2">
          {(prices || []).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ backgroundColor: 'var(--color-white)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary-pale)' }}
              >
                <Wheat size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-neutral-900)' }}>{p.crop_name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--color-neutral-500)' }}>{p.market_name}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold" style={{ color: 'var(--color-neutral-900)' }}>
                  ₨ {p.price_per_unit}/{p.unit || 'kg'}
                </span>
                {p.change !== undefined && (
                  <div className="flex items-center gap-1">
                    {p.change >= 0
                      ? <TrendingUp size={12} style={{ color: 'var(--color-primary-light)' }} />
                      : <TrendingDown size={12} style={{ color: 'var(--color-danger)' }} />}
                    <span
                      className="text-xs font-medium"
                      style={{ color: p.change >= 0 ? 'var(--color-primary-light)' : 'var(--color-danger)' }}
                    >
                      {p.change >= 0 ? '+' : ''}{p.change}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!prices?.length && (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-neutral-500)' }}>
              No price data for {region}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
