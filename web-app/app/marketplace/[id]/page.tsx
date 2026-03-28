'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import {
  ChevronLeft,
  MapPin,
  Package,
  Phone,
  Edit2,
  Trash2,
  X,
  ShoppingBag,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { fetchListing, deleteListing, contactSeller } from '@/lib/marketplaceApi'
import { getApiErrorMessage } from '@/lib/apiError'

// ─── Contact modal ─────────────────────────────────────────────────────────────

function ContactModal({
  phone,
  email,
  onClose,
}: {
  phone: string
  email: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--color-white)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: 'var(--color-neutral-900)' }}>
            Seller Contact
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-neutral-100)' }}
          >
            <X size={16} style={{ color: 'var(--color-neutral-600)' }} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: 'var(--color-primary-pale)' }}
          >
            <Phone size={18} style={{ color: 'var(--color-primary)' }} />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>Phone</p>
              <a
                href={`tel:${phone}`}
                className="text-sm font-bold"
                style={{ color: 'var(--color-neutral-900)' }}
              >
                {phone}
              </a>
            </div>
          </div>
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: 'var(--color-neutral-100)' }}
          >
            <span className="text-base">✉️</span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--color-neutral-500)' }}>Email</p>
              <a
                href={`mailto:${email}`}
                className="text-sm font-bold break-all"
                style={{ color: 'var(--color-neutral-900)' }}
              >
                {email}
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-10 rounded-xl text-sm font-semibold"
          style={{
            backgroundColor: 'var(--color-neutral-100)',
            color: 'var(--color-neutral-700)',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ─── Delete confirm modal ──────────────────────────────────────────────────────

function DeleteModal({
  onConfirm,
  onCancel,
  isPending,
}: {
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--color-white)' }}
      >
        <h2 className="text-base font-bold" style={{ color: 'var(--color-neutral-900)' }}>
          Delete Listing?
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-neutral-600)' }}>
          This action cannot be undone. The listing will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: 'var(--color-neutral-100)',
              color: 'var(--color-neutral-700)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70"
            style={{ backgroundColor: 'var(--color-danger)' }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Detail row helper ─────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--color-neutral-100)' }}>
      <span className="text-sm flex-shrink-0" style={{ color: 'var(--color-neutral-500)' }}>{label}</span>
      <span className="text-sm font-medium text-right" style={{ color: 'var(--color-neutral-900)' }}>{value}</span>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const id = params.id as string

  const [showContact, setShowContact] = useState(false)
  const [contactInfo, setContactInfo] = useState<{ phone: string; email: string } | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: listing, isLoading, isError, error } = useQuery({
    queryKey: ['marketplace', id],
    queryFn: () => fetchListing(id),
    enabled: !!id,
  })

  const contactMutation = useMutation({
    mutationFn: () => contactSeller(id),
    onSuccess: (data) => {
      setContactInfo(data)
      setShowContact(true)
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Could not retrieve contact info'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteListing(id),
    onSuccess: () => {
      toast.success('Listing deleted')
      router.push('/marketplace')
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete listing'))
    },
  })

  const isOwner = isAuthenticated && user?.id === listing?.sellerId

  if (isLoading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 pt-2 mb-4">
          <div className="w-9 h-9 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
          <div className="h-5 rounded-full w-32 animate-pulse" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
        </div>
        <LoadingSkeleton rows={6} />
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
        <Link
          href="/marketplace"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--color-neutral-600)' }}
        >
          <ChevronLeft size={16} />
          Back to Marketplace
        </Link>
        <div className="p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-white)' }}>
          <ShoppingBag size={36} className="mx-auto mb-3" style={{ color: 'var(--color-neutral-300)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>
            {getApiErrorMessage(error, 'Listing not found')}
          </p>
        </div>
      </div>
    )
  }

  const postedDate = new Date(listing.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
        {/* Back + action buttons */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/marketplace"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-neutral-100)' }}
          >
            <ChevronLeft size={20} style={{ color: 'var(--color-neutral-700)' }} />
          </Link>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                href={`/marketplace/${id}/edit`}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: 'var(--color-neutral-100)',
                  color: 'var(--color-neutral-700)',
                }}
              >
                <Edit2 size={15} />
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: '#FEE2E2',
                  color: 'var(--color-danger)',
                }}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Title + status */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-bold leading-snug" style={{ color: 'var(--color-neutral-900)' }}>
              {listing.title}
            </h1>
            <span
              className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize mt-0.5"
              style={{
                backgroundColor: listing.status === 'active' ? 'var(--color-primary-pale)' : 'var(--color-neutral-100)',
                color: listing.status === 'active' ? 'var(--color-primary)' : 'var(--color-neutral-500)',
              }}
            >
              {listing.status}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} style={{ color: 'var(--color-neutral-400)' }} />
            <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>
              {listing.city}, {listing.region}
            </span>
          </div>
        </div>

        {/* Price highlight */}
        <div
          className="flex items-center justify-between p-4 rounded-xl"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div>
            <p className="text-xs font-medium text-white opacity-75">Price per {listing.unit}</p>
            <p className="text-2xl font-bold text-white">
              {listing.currency} {listing.pricePerUnit.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-white opacity-75">Total quantity</p>
            <p className="text-base font-bold text-white">
              {listing.quantity} {listing.unit}
            </p>
          </div>
        </div>

        {/* Details table */}
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-white)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-neutral-700)' }}>Details</h2>
          </div>
          <DetailRow label="Crop" value={listing.cropName} />
          <DetailRow label="Quantity" value={`${listing.quantity} ${listing.unit}`} />
          <DetailRow label="Seller" value={listing.sellerName} />
          <DetailRow label="Location" value={`${listing.city}, ${listing.region}`} />
          <DetailRow label="Posted" value={postedDate} />
        </div>

        {/* Description */}
        {listing.description && (
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-white)' }}>
            <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-neutral-700)' }}>Description</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-neutral-600)' }}>
              {listing.description}
            </p>
          </div>
        )}

        {/* Contact CTA */}
        {isAuthenticated && !isOwner && (
          <button
            onClick={() => contactMutation.mutate()}
            disabled={contactMutation.isPending}
            className="w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-70"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Phone size={16} />
            {contactMutation.isPending ? 'Loading...' : 'Contact Seller'}
          </button>
        )}

        {!isAuthenticated && (
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
            <p className="text-sm" style={{ color: 'var(--color-neutral-600)' }}>
              <Link href="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                Log in
              </Link>{' '}
              to contact the seller
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showContact && contactInfo && (
        <ContactModal
          phone={contactInfo.phone}
          email={contactInfo.email}
          onClose={() => setShowContact(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setShowDeleteModal(false)}
          isPending={deleteMutation.isPending}
        />
      )}
    </>
  )
}
