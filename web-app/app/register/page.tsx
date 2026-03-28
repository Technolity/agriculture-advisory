'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sprout } from 'lucide-react'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import api from '@/lib/axios'

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  password: z.string().min(8, 'Minimum 8 characters'),
  farm_name: z.string().optional(),
  region: z.string().min(1, 'Select your region'),
})
type FormData = z.infer<typeof schema>

const regions = ['Kashmir', 'Punjab', 'Sindh', 'KPK', 'Balochistan', 'Other']

export default function RegisterPage() {
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const password = watch('password', '')
  const strength = password.length < 6 ? 1 : password.length < 10 ? 2 : 3

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/api/auth/register', data)
      Cookies.set('token', res.data.token, { expires: 7 })
      toast.success('Account created!')
      router.push('/')
    } catch {
      toast.error('Registration failed. Try again.')
    }
  }

  const inputClass = "h-12 px-4 rounded-xl text-sm outline-none w-full"
  const inputStyle = (hasError: boolean) => ({
    backgroundColor: 'var(--color-neutral-100)',
    color: 'var(--color-neutral-900)',
    border: hasError ? '1.5px solid var(--color-danger)' : '1.5px solid transparent',
  })

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
      {/* Green header */}
      <div
        className="rounded-b-2xl px-6 py-10 flex flex-col gap-2"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="flex items-center gap-2">
          <Sprout size={24} color="white" />
          <span className="text-xl font-bold text-white">KisanAI</span>
        </div>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>Create your farmer account</p>
      </div>

      {/* Form */}
      <div className="flex-1 mx-4 -mt-4 rounded-t-2xl p-6 flex flex-col gap-4" style={{ backgroundColor: 'var(--color-white)' }}>
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-neutral-900)' }}>Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Full Name</label>
            <input {...register('name')} placeholder="Muhammad Ali" className={inputClass} style={inputStyle(!!errors.name)} />
            {errors.name && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Phone Number</label>
            <input {...register('phone')} type="tel" placeholder="+92 300 0000000" className={inputClass} style={inputStyle(!!errors.phone)} />
            {errors.phone && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.phone.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Password</label>
            <input {...register('password')} type="password" placeholder="••••••••" className={inputClass} style={inputStyle(!!errors.password)} />
            {password && (
              <div className="flex gap-1 mt-1">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      backgroundColor: n <= strength
                        ? strength === 1 ? 'var(--color-danger)' : strength === 2 ? 'var(--color-accent)' : 'var(--color-primary-light)'
                        : 'var(--color-neutral-200)',
                    }}
                  />
                ))}
              </div>
            )}
            {errors.password && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.password.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Farm Name (optional)</label>
            <input {...register('farm_name')} placeholder="Ali Farm" className={inputClass} style={inputStyle(false)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Region</label>
            <select {...register('region')} className={inputClass} style={inputStyle(!!errors.region)}>
              <option value="">Select region...</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.region && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.region.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70 mt-2"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm" style={{ color: 'var(--color-neutral-500)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
