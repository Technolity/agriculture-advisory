'use client'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

interface DecodedToken {
  id: string
  name: string
  email: string
  phone: string
  region: string
  language: string
}

export function useAuth() {
  const token = Cookies.get('token')

  if (!token) return { user: null, token: null, isAuthenticated: false }

  try {
    const user = jwtDecode<DecodedToken>(token)
    return { user, token, isAuthenticated: true }
  } catch {
    return { user: null, token: null, isAuthenticated: false }
  }
}

export function logout() {
  Cookies.remove('token')
}
