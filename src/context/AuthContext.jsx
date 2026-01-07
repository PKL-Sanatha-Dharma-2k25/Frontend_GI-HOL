import { createContext, useContext, useEffect, useState } from 'react'
import {
  saveToken,
  saveUser,
  getToken,
  getUser,
  clearAuth
} from '@/utils/token'
import { getUserProfile } from '@/services/auth'
import { getUserIdFromToken } from '@/utils/jwt'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const savedUser = getUser()

    if (token && savedUser) {
      setUser(savedUser)
      setIsLoggedIn(true)
    } else {
      clearAuth()
    }

    setLoading(false)
  }, [])

  // 🔥 LOGIN FINAL (ROLE AMAN & KONSISTEN)
  const login = async (loginResponse, usernameFromForm = null) => {
    try {
      console.group('🔐 [AuthContext.login] FULL LOGIN PROCESS')
      
      clearAuth()
      console.log('✅ Auth cleared')

      // ⭐ STEP 1: SAVE TOKEN
      console.log('\n📍 STEP 1: Save token')
      const token = loginResponse.data.access_token
      console.log('Token from response:', token?.substring(0, 20) + '...')
      
      const tokenSaved = saveToken(token)
      console.log('✅ Token saved?', tokenSaved)

      // ⭐ STEP 2: DECODE JWT
      console.log('\n📍 STEP 2: Decode JWT')
      const userIdFromToken = getUserIdFromToken(token)
      console.log('✅ User ID from token:', userIdFromToken)

      if (!userIdFromToken) {
        console.error('❌ Cannot extract user ID from token!')
        throw new Error('JWT_DECODE_FAILED')
      }

      // ⭐ STEP 3: GET PROFILE (WITH FALLBACK)
      console.log('\n📍 STEP 3: Get user profile')
      let profile = null
      
      try {
        profile = await getUserProfile()
        
        if (!profile) {
          console.warn('⚠️ Profile returned null, using fallback')
          profile = null
        } else {
          console.log('✅ Profile received from API')
        }
      } catch (error) {
        console.error('❌ getUserProfile() error:', error.message)
        console.warn('⚠️ FALLBACK: Will use JWT data as profile')
        profile = null
      }

      // ⭐ FALLBACK PROFILE JIKA API GAGAL
      if (!profile) {
        console.log('\n📍 STEP 3B: Using fallback profile from JWT')
        profile = {
          id_user: userIdFromToken,
          username: usernameFromForm || 'User',
          role: 'user', // Default role
          id_line: null
        }
        console.log('✅ Fallback profile created:')
        console.log('  - id_user:', profile.id_user)
        console.log('  - username:', profile.username)
        console.log('  - role:', profile.role)
      } else {
        console.log('✅ Profile from API:')
        console.log('  - id_user:', profile.id_user)
        console.log('  - username:', profile.username)
        console.log('  - role:', profile.role)
        console.log('  - role type:', typeof profile.role)
      }

      // ⭐ STEP 4: NORMALIZE ROLE (FIXED - SUPERADMIN CHECK FIRST)
      console.log('\n📍 STEP 4: Normalize role')
      const normalizeRole = (rawRole, id_user, username) => {
        if (!rawRole) {
          console.warn('⚠️ rawRole is empty/null, defaulting to user')
          return 'user'
        }

        // ⭐ FORCE STRING CONVERSION (important untuk consistency)
        const roleStr = String(rawRole).toLowerCase().trim()
        console.log('Input role:', rawRole, '| String:', roleStr, '| Type:', typeof rawRole)

        // ⭐ PRIORITY 1: CEK SUPERADMIN DULU (most specific - this is the fix!)
        console.log('→ Checking role string...')
        
        if (roleStr.includes('superadmin') || roleStr === '1') {
          console.log('✓ Found superadmin in role string')
          return 'superadmin'
        }

        // ⭐ PRIORITY 2: CEK ADMIN
        if (roleStr.includes('admin') || roleStr === '2') {
          console.log('✓ Found admin in role string')
          return 'admin'
        }

        // ⭐ PRIORITY 3: CEK SUPERVISOR
        if (roleStr.includes('supervisor') || roleStr === '3' || roleStr === '4') {
          console.log('✓ Found supervisor in role string')
          return 'supervisor'
        }

        // ⭐ PRIORITY 2: FALLBACK - CEK BERDASARKAN ID_USER
        console.log('→ Role string tidak jelas, checking id_user...')
        
        if (id_user === 1 || id_user === '1') {
          console.log('✓ Detected id_user 1 → role = superadmin')
          return 'superadmin'
        }

        if (id_user === 2 || id_user === '2') {
          console.log('✓ Detected id_user 2 → role = superadmin')
          return 'superadmin'
        }

        if (id_user === 3 || id_user === '3') {
          console.log('✓ Detected id_user 3 → role = admin')
          return 'admin'
        }

        if (id_user === 4 || id_user === '4') {
          console.log('✓ Detected id_user 4 → role = supervisor')
          return 'supervisor'
        }

        // ⭐ PRIORITY 3: FALLBACK TERAKHIR - CEK USERNAME
        console.log('→ id_user tidak match, checking username...')
        
        if (username && (username.toLowerCase().includes('supervisor') || username.toLowerCase().includes('spv'))) {
          console.log('✓ Detected supervisor in username → role = supervisor')
          return 'supervisor'
        }

        if (username && username.toLowerCase().includes('admin')) {
          console.log('✓ Detected admin in username → role = admin')
          return 'admin'
        }

        console.warn('⚠️ Unknown role format:', rawRole, '→ defaulting to user')
        return 'user'
      }

      const normalizedRole = normalizeRole(profile.role, userIdFromToken, profile.username)
      console.log('✅ Final normalized role:', normalizedRole)

      if (!normalizedRole) {
        console.error('❌ Role normalization returned empty!')
        throw new Error('ROLE_NORMALIZE_FAILED')
      }

      // ⭐ STEP 5: PREPARE USER DATA
      console.log('\n📍 STEP 5: Prepare user data')
      const finalUserId = userIdFromToken || profile.id_user
      const finalUsername = usernameFromForm || profile.username

      const userData = {
        id_user: finalUserId,
        username: finalUsername,
        role: normalizedRole,
        id_line: profile.id_line || null,
        token,
      }

      console.log('✅ User data prepared:')
      console.log('  - id_user:', userData.id_user)
      console.log('  - username:', userData.username)
      console.log('  - role:', userData.role)
      console.log('  - id_line:', userData.id_line)

      // ⭐ STEP 6: SAVE USER
      console.log('\n📍 STEP 6: Save user data to localStorage')
      const userSaved = saveUser(userData)
      console.log('✅ User saved?', userSaved)

      // ⭐ STEP 7: UPDATE STATE
      console.log('\n📍 STEP 7: Update React state')
      setUser(userData)
      setIsLoggedIn(true)
      console.log('✅ State updated')

      console.log('\n✅✅✅ LOGIN SUCCESSFUL ✅✅✅')
      console.log('Final user:', userData)
      console.groupEnd()

      return userData

    } catch (error) {
      console.group('❌ [AuthContext.login] ERROR')
      console.error('Error at:', error.message)
      console.error('Error stack:', error.stack)
      console.groupEnd()
      
      clearAuth()
      setUser(null)
      setIsLoggedIn(false)
      
      throw error
    }
  }

  const logout = () => {
    console.log('🚪 [AuthContext.logout] Logging out...')
    clearAuth()
    setUser(null)
    setIsLoggedIn(false)
    console.log('✅ Logout completed')
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}