import { createContext, useContext, useEffect, useState } from 'react'
import { saveToken, saveUser, getToken, getUser, clearAuth, refreshTokenIfNeeded } from '@/utils/token'
import { getUserProfile } from '@/services/auth'
import { getUserIdFromToken, isTokenExpired } from '@/utils/jwt'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionWarning, setSessionWarning] = useState(false)
  const [timeLeftInSeconds] = useState(0)

  useEffect(() => {
    const token = getToken()
    const savedUser = getUser()

    if (token) {
      const expired = isTokenExpired(token)
      if (expired) {
        clearAuth()
        setUser(null)
        setIsLoggedIn(false)
        setSessionWarning(false)
      } else {
        if (savedUser) {
          setUser(savedUser)
          setIsLoggedIn(true)
        }
      }
    } else {
      clearAuth()
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    const interval = setInterval(async () => {
      const token = getToken()
      if (token) {
        await refreshTokenIfNeeded()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isLoggedIn])

  const login = async (loginResponse, usernameFromForm = null) => {
    try {
      clearAuth()

      const token = loginResponse.data.access_token
      const tokenSaved = saveToken(token)
      if (!tokenSaved) throw new Error('Failed to save token')

      const userIdFromToken = getUserIdFromToken(token)
      if (!userIdFromToken) throw new Error('JWT_DECODE_FAILED')

      let profile = null
      try {
        profile = await getUserProfile()
      } catch (error) {
        console.error('getUserProfile error:', error.message)
      }

      if (!profile) {
        profile = {
          id_user: userIdFromToken,
          username: usernameFromForm || 'User',
          role: 'user',
          id_line: null,
        }
      }

      const normalizeRole = (rawRole, id_user, username) => {
        if (!rawRole) return 'user'

        const roleStr = String(rawRole).toLowerCase().trim()

        if (roleStr.includes('superadmin') || roleStr === '1') {
          return 'superadmin'
        }

        if (roleStr.includes('admin') || roleStr === '2') {
          return 'admin'
        }

        if (roleStr.includes('supervisor') || roleStr === '3' || roleStr === '4') {
          return 'supervisor'
        }

        if (id_user === 1 || id_user === '1' || id_user === 2 || id_user === '2') {
          return 'superadmin'
        }

        if (id_user === 3 || id_user === '3') {
          return 'admin'
        }

        if (id_user === 4 || id_user === '4') {
          return 'supervisor'
        }

        if (username) {
          const usernameLower = username.toLowerCase()
          if (usernameLower.includes('supervisor') || usernameLower.includes('spv')) {
            return 'supervisor'
          }
          if (usernameLower.includes('admin')) {
            return 'admin'
          }
        }

        return 'user'
      }

      const normalizedRole = normalizeRole(profile.role, userIdFromToken, profile.username)
      if (!normalizedRole) throw new Error('ROLE_NORMALIZE_FAILED')

      const finalUserId = userIdFromToken || profile.id_user
      const finalUsername = usernameFromForm || profile.username

      const userData = {
        id_user: finalUserId,
        username: finalUsername,
        role: normalizedRole,
        id_line: profile.id_line || null,
        token,
      }

      const userSaved = saveUser(userData)
      if (!userSaved) throw new Error('Failed to save user')

      setUser(userData)
      setIsLoggedIn(true)
      setSessionWarning(false)

      return userData
    } catch (error) {
      console.error('Login error:', error.message)
      clearAuth()
      setUser(null)
      setIsLoggedIn(false)
      setSessionWarning(false)
      throw error
    }
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    setIsLoggedIn(false)
    setSessionWarning(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, sessionWarning, timeLeftInSeconds, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}