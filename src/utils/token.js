const TOKEN_KEY = 'authToken'
const USER_KEY = 'userData'

// =====================================================
// TOKEN MANAGEMENT
// =====================================================

export const saveToken = (token) => {
  try {
    if (!token) {
      console.warn('⚠️ [saveToken] Token is empty/null')
      return false
    }

    console.log('💾 [saveToken] Saving token...')
    console.log('Token length:', token.length)
    console.log('Token preview:', token.substring(0, 30) + '...')

    localStorage.setItem(TOKEN_KEY, token)

    // ⭐ VERIFY TERSIMPAN
    const saved = localStorage.getItem(TOKEN_KEY)
    const verified = saved === token

    if (verified) {
      console.log('✅ [saveToken] Token saved & verified successfully')
    } else {
      console.error('❌ [saveToken] Token saved but verification failed!')
    }

    return verified

  } catch (error) {
    console.error('❌ [saveToken] Error:', error.message)
    return false
  }
}

export const getToken = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
      console.log('✅ [getToken] Token found (length:', token.length, ')')
      return token
    } else {
      console.log('❌ [getToken] No token found in localStorage')
      return null
    }

  } catch (error) {
    console.error('❌ [getToken] Error:', error.message)
    return null
  }
}

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
    console.log('🗑️ [removeToken] Token removed')
    return true
  } catch (error) {
    console.error('❌ [removeToken] Error:', error.message)
    return false
  }
}

// =====================================================
// USER MANAGEMENT
// =====================================================

export const saveUser = (user) => {
  try {
    if (!user) {
      console.warn('⚠️ [saveUser] User data is empty')
      return false
    }

    console.log('💾 [saveUser] Saving user data...')

    const userData = {
      id_user: user.id_user,
      username: user.username,
      role: user.role,
      id_line: user.id_line || null,
      token: user.token,
    }

    console.log('User to save:', {
      id_user: userData.id_user,
      username: userData.username,
      role: userData.role,
      id_line: userData.id_line,
    })

    const jsonStr = JSON.stringify(userData)
    localStorage.setItem(USER_KEY, jsonStr)

    // ⭐ VERIFY TERSIMPAN
    const saved = localStorage.getItem(USER_KEY)
    const verified = saved === jsonStr

    if (verified) {
      console.log('✅ [saveUser] User data saved & verified successfully')
    } else {
      console.error('❌ [saveUser] User data saved but verification failed!')
    }

    return verified

  } catch (error) {
    console.error('❌ [saveUser] Error:', error.message)
    return false
  }
}

export const getUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY)

    if (!userStr) {
      console.log('❌ [getUser] No user data found in localStorage')
      return null
    }

    console.log('📖 [getUser] User data found, parsing...')

    const user = JSON.parse(userStr)

    console.log('✅ [getUser] User retrieved:')
    console.log('  - id_user:', user.id_user)
    console.log('  - username:', user.username)
    console.log('  - role:', user.role)
    console.log('  - id_line:', user.id_line)

    return user

  } catch (error) {
    console.error('❌ [getUser] Error parsing user:', error.message)
    return null
  }
}

export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY)
    console.log('🗑️ [removeUser] User data removed')
    return true
  } catch (error) {
    console.error('❌ [removeUser] Error:', error.message)
    return false
  }
}

// =====================================================
// VALIDATION
// =====================================================

export const isTokenValid = () => {
  const token = getToken()
  const isValid = !!token

  console.log('🔍 [isTokenValid] Token valid?', isValid)

  return isValid
}

export const isUserValid = () => {
  const user = getUser()
  const isValid = !!user && !!user.role

  console.log('🔍 [isUserValid] User valid?', isValid)
  if (user) {
    console.log('  - id_user:', user.id_user)
    console.log('  - role:', user.role)
  }

  return isValid
}

// =====================================================
// CLEAR AUTH
// =====================================================

export const clearAuth = () => {
  try {
    console.group('🗑️ [clearAuth]')
    console.log('Clearing all auth data...')

    removeToken()
    removeUser()

    // Try to clear session storage
    try {
      sessionStorage.clear()
      console.log('Session storage cleared')
    } catch (e) {
      console.warn('⚠️ Could not clear session storage:', e.message)
    }

    console.log('✅ Auth data cleared successfully')
    console.groupEnd()

    return true

  } catch (error) {
    console.group('❌ [clearAuth] ERROR')
    console.error('Error:', error.message)
    console.groupEnd()
    return false
  }
}

// =====================================================
// DEBUG UTILITIES
// =====================================================

export const debugAuthState = () => {
  console.group('🔍 [DEBUG AUTH STATE]')

  try {
    const token = getToken()
    const user = getUser()

    console.log('=== TOKEN ===')
    console.log('Token exists:', !!token)
    if (token) {
      console.log('Token length:', token.length)
      console.log('Token preview:', token.substring(0, 50) + '...')
    }

    console.log('\n=== USER ===')
    console.log('User exists:', !!user)
    if (user) {
      console.log('User data:', {
        id_user: user.id_user,
        username: user.username,
        role: user.role,
        id_line: user.id_line,
      })
    }

    console.log('\n=== AUTH STATUS ===')
    console.log('Is authenticated:', !!token && !!user)
    console.log('Token valid:', isTokenValid())
    console.log('User valid:', isUserValid())

    console.log('\n=== LOCAL STORAGE ===')
    console.log('LocalStorage keys:', Object.keys(localStorage))
    console.log('AUTH_TOKEN_KEY:', TOKEN_KEY)
    console.log('USER_DATA_KEY:', USER_KEY)

  } catch (error) {
    console.error('Error in debugAuthState:', error)
  }

  console.groupEnd()
}

// =====================================================
// GET ALL AUTH DATA (untuk debugging)
// =====================================================

export const getAllAuthData = () => {
  return {
    token: getToken(),
    user: getUser(),
    tokenValid: isTokenValid(),
    userValid: isUserValid(),
    isAuthenticated: isTokenValid() && isUserValid(),
  }
}