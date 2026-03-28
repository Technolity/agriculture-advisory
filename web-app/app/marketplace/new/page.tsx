'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createListing } from '@/lib/marketplaceApi'
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

export default function NewListingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      currency: 'INR',
      unit: 'kg',
      region: 'Kashmir',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues): Promise<import('@/lib/marketplaceApi').Listing> =>
      createListing({
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
      toast.success('Listing posted successfully!')
      router.push('/marketplace')
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to post listing'))
    },
  })

  if (!isAuthenticated) return null

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/marketplace"
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-neutral-100)' }}
        >
          <ChevronLeft size={20} style={{ color: 'var(--color-neutral-700)' }} />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>Post a Listing</h1>
      </div>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v as FormValues))} className="flex flex-col gap-4">

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
            Title <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            {...register('title')}
            placeholder="e.g. Fresh Basmati Rice — 500 kg available"
            className="h-10 px-3 rounded-lg text-sm border outline-none"
            style={inputStyle(!!errors.title)}
          />
          <FieldError message={errors.title?.message} />
        </div>

        {/* Crop */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
            Crop <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            {...register('cropId')}
            placeholder="e.g. Wheat, Rice, Maize"
            className="h-10 px-3 rounded-lg text-sm border outline-none"
            style={inputStyle(!!errors.cropId)}
          />
          <FieldError message={errors.cropId?.message} />
        </div>

        {/* Quantity + Unit */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
              Quantity <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              {...register('quantity')}
              type="number"
              min="0"
              step="any"
              placeholder="500"
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
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price + Currency */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
              Price per {'{unit}'} <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              {...register('pricePerUnit')}
              type="number"
              min="0"
              step="any"
              placeholder="2500"
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.pricePerUnit)}
            />
            <FieldError message={errors.pricePerUnit?.message} />
          </div>
          <div className="flex flex-col gap-1 w-28">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Currency</label>
            <input
              {...register('currency')}
              placeholder="INR"
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.currency)}
            />
          </div>
        </div>

        {/* Region + City */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
              Region <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <select
              {...register('region')}
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.region)}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
              City <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              {...register('city')}
              placeholder="e.g. Srinagar"
              className="h-10 px-3 rounded-lg text-sm border outline-none"
              style={inputStyle(!!errors.city)}
            />
            <FieldError message={errors.city?.message} />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
            Description <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Describe the quality, variety, availability, and any other details..."
            className="px-3 py-2.5 rounded-lg text-sm border outline-none resize-none"
            style={inputStyle(!!errors.description)}
          />
          <FieldError message={errors.description?.message} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70 mt-2"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {mutation.isPending ? 'Posting...' : 'Post Listing'}
        </button>
      </form>
    </div>
  )
}
