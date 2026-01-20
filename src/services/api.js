import axios from 'axios'
import { getToken, clearAuth } from '@/utils/token'
import { isTokenExpired } from '@/utils/jwt'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use(
  (config) => {
    const token = getToken()

    // ⭐ NEW: Check token expiry before request
    if (token && isTokenExpired(token)) {
      console.warn('⚠️ [Axios] Token expired before request, clearing auth')
      clearAuth()
      window.location.href = '/GI-HOL/login'
      return Promise.reject(new Error('Token expired'))
    }

    if (token) {
      console.log('📤 [API Request]', config.method.toUpperCase(), config.url)
      console.log('   Attaching token...')
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.log('📤 [API Request]', config.method.toUpperCase(), config.url)
      console.log('   No token to attach')
    }

    return config
  },
  (error) => {
    console.error('❌ [API Request Error]', error.message)
    return Promise.reject(error)
  }
)

// ===== RESPONSE INTERCEPTOR =====
api.interceptors.response.use(
  (response) => {
    console.log('📥 [API Response]', response.status, response.config.url)
    console.log('   Response data:', response.data)
    return response
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message
    const currentPath = window.location.pathname

    console.group('❌ [API Error]')
    console.error('Status:', status)
    console.error('Message:', message)
    console.error('URL:', error.config?.url)
    console.error('Current path:', currentPath)
    console.error('Full error response:', error.response?.data)

    // ⭐ HANDLE 401 UNAUTHORIZED - JANGAN REDIRECT JIKA DI LOGIN PAGE
    if (status === 401) {
      // Jangan redirect jika sudah di halaman login
      if (!currentPath.includes('/login')) {
        console.error('🚨 Token expired/invalid - redirecting to login')
        clearAuth()
        window.location.href = '/GI-HOL/login'  // ✅ DENGAN PREFIX /GI-HOL/
      } else {
        // Sedang di login page, biarkan error ditangani oleh Login.jsx component
        console.warn('⚠️ 401 error at login page - let component handle it')
      }
    }

    // ⭐ HANDLE 500 SERVER ERROR
    if (status === 500) {
      console.error('🚨 Server error (500)')
    }

    // ⭐ HANDLE NETWORK ERROR
    if (!error.response) {
      console.error('🚨 Network error - no response')
    }

    console.groupEnd()

    return Promise.reject(error)
  }
)

export default api