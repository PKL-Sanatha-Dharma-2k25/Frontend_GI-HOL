import axios from 'axios'
import { getToken, clearAuth } from '@/utils/token'
import { isTokenExpired } from '@/utils/jwt'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token && isTokenExpired(token)) {
      clearAuth()
      window.location.href = '/GI-HOL/login'
      return Promise.reject(new Error('Token expired'))
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error('Request error:', error.message)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status
    const currentPath = window.location.pathname

    if (status === 401) {
      if (!currentPath.includes('/login')) {
        clearAuth()
        window.location.href = '/GI-HOL/login'
      }
    }

    if (status === 500) {
      console.error('Server error (500):', error.response?.data?.message)
    }

    if (!error.response) {
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api