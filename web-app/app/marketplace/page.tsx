'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ShoppingBag, Plus, MapPin, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { fetchListings } from '@/lib/marketplaceApi'
import { getApiErrorMessage } from '@/lib/apiError'
import type { Listing } from '@/lib/marketplaceApi'

const REGIONS = ['All', 'Kashmir', 'Punjab', 'Sindh', 'KPK']
const LIMIT = 10

function ListingCard({ listing }: { listing: Listing }) {
  const date = new Date(listing.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link
      href={`/marketplace/${listing.id}`}
      className="flex flex-col gap-3 p-4 rounded-xl transition-shadow hover:shadow-md"
      style={{ backgroundColor: 'var(--color-white)' }}
    >
      {/* Title + status badge */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-neutral-900)' }}>
          {listing.title}
        </p>
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
          style={{
            backgroundColor: listing.status === 'active' ? 'var(--color-primary-pale)' : 'var(--color-neutral-100)',
            color: listing.status === 'active' ? 'var(--color-primary)' : 'var(--color-neutral-500)',
          }}
        >
          {listing.status}
        </span>
      </div>

      {/* Crop + quantity row */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-primary-pale)' }}
        >
          <Package size={18} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--color-neutral-700)' }}>
            {listing.cropName}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>
            {listing.quantity} {listing.unit}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold" style={{ color: 'var(--color-neutral-900)' }}>
            {listing.currency} {listing.pricePerUnit.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--color-neutral-500)' }}>per {listing.unit}</p>
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MapPin size={12} style={{ color: 'var(--color-neutral-400)' }} />
          <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>
            {listing.city}, {listing.region}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>
            {listing.sellerName}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--color-neutral-300)' }}>·</span>
          <span className="text-[10px]" style={{ color: 'var(--color-neutral-400)' }}>{date}</span>
        </div>
      </div>
    </Link>
  )
}

function ListingCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-white)' }}>
      <div className="flex justify-between gap-2">
        <div className="h-4 rounded-full w-2/3" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
        <div className="h-4 rounded-full w-14" style={{ backgroundColor: 'var(--color-neutral-100)' }} />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ backgroundColor: 'var(--color-neutral-100)' }} />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
          <div className="h-3 rounded-full w-1/3" style={{ backgroundColor: 'var(--color-neutral-100)' }} />
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <div className="h-4 rounded-full w-16" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
          <div className="h-3 rounded-full w-10" style={{ backgroundColor: 'var(--color-neutral-100)' }} />
        </div>
      </div>
      <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: 'var(--color-neutral-100)' }} />
    </div>
  )
}

export default function MarketplacePage() {
  const { isAuthenticated } = useAuth()
  const [region, setRegion] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['marketplace', region, minPrice, maxPrice, page],
    queryFn: () =>
      fetchListings({
        region: region === 'All' ? undefined : region,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page,
        limit: LIMIT,
      }),
  })

  const listings = data?.listings ?? []
  const meta = data?.meta
  const totalPages = meta?.totalPages ?? 1

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <ShoppingBag size={22} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>Marketplace</h1>
        </div>
        {isAuthenticated && (
          <Link
            href="/marketplace/new"
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus size={16} />
            Post Listing
          </Link>
        )}
      </div>

      {/* Region filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => { setRegion(r); setPage(1) }}
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

      {/* Price filters */}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => { setMinPrice(e.target.value); setPage(1) }}
          className="flex-1 h-9 px-3 rounded-lg text-sm border outline-none"
          style={{
            backgroundColor: 'var(--color-white)',
            borderColor: 'var(--color-neutral-200)',
            color: 'var(--color-neutral-900)',
          }}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
          className="flex-1 h-9 px-3 rounded-lg text-sm border outline-none"
          style={{
            backgroundColor: 'var(--color-white)',
            borderColor: 'var(--color-neutral-200)',
            color: 'var(--color-neutral-900)',
          }}
        />
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--color-white)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>
            {getApiErrorMessage(error, 'Failed to load listings')}
          </p>
        </div>
      ) : listings.length === 0 ? (
        <div className="p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-white)' }}>
          <ShoppingBag size={36} className="mx-auto mb-3" style={{ color: 'var(--color-neutral-300)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-neutral-500)' }}>No listings found</p>
          {isAuthenticated && (
            <Link
              href="/marketplace/new"
              className="inline-block mt-3 text-sm font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              Post the first listing →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 h-9 px-4 rounded-lg text-sm font-medium disabled:opacity-40 transition-opacity"
            style={{
              backgroundColor: 'var(--color-white)',
              color: 'var(--color-neutral-700)',
              border: '1px solid var(--color-neutral-200)',
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 h-9 px-4 rounded-lg text-sm font-medium disabled:opacity-40 transition-opacity"
            style={{
              backgroundColor: 'var(--color-white)',
              color: 'var(--color-neutral-700)',
              border: '1px solid var(--color-neutral-200)',
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Result count */}
      {!isLoading && meta && (
        <p className="text-xs text-center pb-2" style={{ color: 'var(--color-neutral-400)' }}>
          {meta.total} listing{meta.total !== 1 ? 's' : ''} found
        </p>
      )}
    </div>
  )
}
