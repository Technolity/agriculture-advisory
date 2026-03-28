'use client'
import Cookies from 'js-cookie'

export interface AuthUser {
  id: string
  email: string
  name: string
  phone?: string | null
  region?: string | null
  language?: string | null
}

const USER_KEY = 'auth_user'

export function useAuth() {
  const token = Cookies.get('token')
  if (!token) return { user: null, token: null, isAuthenticated: false }

  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null
    const user: AuthUser | null = raw ? (JSON.parse(raw) as AuthUser) : null
    return { user, token, isAuthenticated: true }
  } catch {
    return { user: null, token: null, isAuthenticated: false }
  }
}

export function saveAuthUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function logout(): void {
  Cookies.remove('token')
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY)
  }
}
