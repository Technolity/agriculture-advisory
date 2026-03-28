'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { fetchListing, updateListing } from '@/lib/marketplaceApi'
import { getApiErrorMessage } from '@/lib/apiError'

const UNITS = ['kg', 'quintal', 'ton'] as const
const REGIONS = ['Kashmir', 'Punjab', 'Sindh', 'KPK'] as const

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title too long'),
  cropId: z.string().min(1, 'Crop name is required'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  unit: z.enum(UNITS),
  pricePerUnit: z.coerce.number().positive('Price must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  region: z.enum(REGIONS),
  city: z.string().min(1, 'City is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
})

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{message}</p>
}

function inputStyle(hasError?: boolean) {
  return {
    backgroundColor: 'var(--color-white)',
    borderColor: hasError ? 'var(--color-danger)' : 'var(--color-neutral-200)',
    color: 'var(--color-neutral-900)',
  }
}

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const id = params.id as string

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  const { data: listing, isLoading } = useQuery({
    queryKey: ['marketplace', id],
    queryFn: () => fetchListing(id),
    enabled: !!id && isAuthenticated,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) as Resolver<FormValues> })

  // Populate form when listing loads
  useEffect(() => {
    if (!listing) return
    reset({
      title: listing.title,
      cropId: listing.cropName,
      quantity: listing.quantity,
      unit: UNITS.includes(listing.unit as typeof UNITS[number]) ? (listing.unit as typeof UNITS[number]) : 'kg',
      pricePerUnit: listing.pricePerUnit,
      currency: listing.currency,
      region: REGIONS.includes(listing.region as typeof REGIONS[number]) ? (listing.region as typeof REGIONS[number]) : 'Kashmir',
      city: listing.city,
      description: listing.description,
    })
  }, [listing, reset])

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateListing(id, {
        title: values.title,
        description: values.description,
        cropId: values.cropId,
        quantity: values.quantity,
        unit: values.unit,
        pricePerUnit: values.pricePerUnit,
        currency: values.currency,
        region: values.region,
        city: values.city,
      }),
    onSuccess: () => {
      toast.success('Listing updated!')
      router.push(`/marketplace/${id}`)
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to update listing'))
    },
  })

  // Redirect non-owners
  useEffect(() => {
    if (listing && user && listing.sellerId !== user.id) {
      toast.error('You can only edit your own listings')
      router.push(`/marketplace/${id}`)
    }
  }, [listing, user, id, router])

  if (!isAuthenticated) return null

  if (isLoading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 pt-2 mb-4">
          <div className="w-9 h-9 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
          <div className="h-5 rounded-full w-40 animate-pulse" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
        </div>
        <LoadingSkeleton rows={8} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <Link
          href={`/marketplace/${id}`}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-neutral-100)' }}
        >
          <ChevronLeft size={20} style={{ color: 'var(--color-neutral-700)' }} />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>Edit Listing</h1>
      </div>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v as FormValues))} className="flex flex-col gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Title</label>
          <input
            {...register('title')}
            className="h-10 px-3 rounded-lg text-sm border outline-none"
            style={inputStyle(!!errors.title)}
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Crop</label>
          <input
            {...register('cropId')}
            className="h-10 px-3 rounded-lg text-sm border outline-none"
            style={inputStyle(!!errors.cropId)}
          />
          <FieldError message={errors.cropId?.message} />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Quantity</label>
            <input
              {...register('quantity')}
              type="number"
              min="0"
              step="any"
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.quantity)}
            />
            <FieldError message={errors.quantity?.message} />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Unit</label>
            <select
              {...register('unit')}
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.unit)}
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Price per unit</label>
            <input
              {...register('pricePerUnit')}
              type="number"
              min="0"
              step="any"
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.pricePerUnit)}
            />
            <FieldError message={errors.pricePerUnit?.message} />
          </div>
          <div className="flex flex-col gap-1 w-28">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Currency</label>
            <input
              {...register('currency')}
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.currency)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Region</label>
            <select
              {...register('region')}
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.region)}
            >
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>City</label>
            <input
              {...register('city')}
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.city)}
            />
            <FieldError message={errors.city?.message} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="px-3 py-2.5 rounded-lg text-sm border outline-none resize-none"
            style={inputStyle(!!errors.description)}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70 mt-2"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
