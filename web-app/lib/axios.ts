import axios from 'axios'
import Cookies from 'js-cookie'

// Use an empty baseURL so requests go to the same origin (Next.js).
// next.config.ts rewrites /api/* → http://localhost:5000/api/* to avoid CORS.
// In production, set NEXT_PUBLIC_API_URL to the deployed backend origin if not
// using the rewrite proxy (e.g. when backend and frontend are on different domains).
const api = axios.create({
  baseURL: '',
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      serverMessage: error.response?.data?.error?.message,
      message: error.message,
    })
    return Promise.reject(error)
  }
)

export default api
