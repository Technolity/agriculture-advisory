'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sprout } from 'lucide-react'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { loginUser } from '@/lib/backendApi'
import { getApiErrorMessage } from '@/lib/apiError'
import { saveAuthUser } from '@/hooks/useAuth'
import LanguageSelector from '@/components/LanguageSelector'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Minimum 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'ur' | 'pa'>('en')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }

      const auth = await loginUser(payload)
      Cookies.set('token', auth.token, { expires: 7 })
      saveAuthUser(auth.user)
      toast.success('Welcome back!')
      router.push('/')
    } catch (error) {
      console.error('[login] Submit failed', { message: error instanceof Error ? error.message : String(error) })
      toast.error(getApiErrorMessage(error, 'Invalid credentials. Please try again.'))
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
      {/* Green hero */}
      <div
        className="flex flex-col items-center justify-center gap-3 px-6 py-12"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <Sprout size={36} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-white">KisanAI</h1>
        <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.75)' }}>
          AI-powered crop disease detection for farmers
        </p>
      </div>

      {/* White card */}
      <div className="flex-1 flex flex-col mx-4 -mt-4 rounded-t-2xl p-6 gap-5" style={{ backgroundColor: 'var(--color-white)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>Sign In</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Email Address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="farmer@example.com"
              className="h-12 px-4 rounded-xl text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-neutral-100)',
                color: 'var(--color-neutral-900)',
                border: errors.email ? '1.5px solid var(--color-danger)' : '1.5px solid transparent',
              }}
            />
            {errors.email && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="h-12 px-4 rounded-xl text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-neutral-100)',
                color: 'var(--color-neutral-900)',
                border: errors.password ? '1.5px solid var(--color-danger)' : '1.5px solid transparent',
              }}
            />
            {errors.password && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
          <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-neutral-200)' }} />
        </div>

        <Link
          href="/register"
          className="h-12 rounded-xl text-sm font-semibold flex items-center justify-center border transition-colors hover:bg-gray-50"
          style={{ borderColor: 'var(--color-neutral-200)', color: 'var(--color-neutral-700)' }}
        >
          Create Account
        </Link>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-neutral-500)' }}>Select Language</span>
          <LanguageSelector selected={lang} onChange={setLang} />
        </div>
      </div>
    </div>
  )
}
