

export const decodeJWT = (token) => {
  try {
    if (!token) {
      console.error('❌ [decodeJWT] Token is null/empty')
      return null
    }

    console.log('🔍 [decodeJWT] Starting decode...')
    console.log('Token length:', token.length)
    console.log('Token preview:', token.substring(0, 50) + '...')

    const parts = token.split('.')
    console.log('Token parts count:', parts.length)

    if (parts.length !== 3) {
      console.error('❌ [decodeJWT] Invalid token format (not 3 parts)')
      return null
    }

    const base64Url = parts[1]
    console.log('Payload (base64Url):', base64Url.substring(0, 30) + '...')

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    console.log('Payload (base64):', base64.substring(0, 30) + '...')

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    console.log('Payload (JSON):', jsonPayload)

    const decoded = JSON.parse(jsonPayload)
    console.log('✅ Decoded successfully')
    console.log('Decoded payload:', decoded)

    return decoded

  } catch (error) {
    console.group('❌ [decodeJWT] ERROR')
    console.error('Error:', error.message)
    console.error('Error stack:', error.stack)
    console.groupEnd()
    return null
  }
}

export const getUserIdFromToken = (token) => {
  try {
    console.group('🔓 [getUserIdFromToken]')
    
    if (!token) {
      console.error('❌ Token is null/empty')
      console.groupEnd()
      return null
    }

    console.log('Input token:', token.substring(0, 30) + '...')

    const decoded = decodeJWT(token)
    
    if (!decoded) {
      console.error('❌ Failed to decode token')
      console.groupEnd()
      return null
    }

    console.log('Decoded:', decoded)

    // ⭐ Cek berbagai kemungkinan field nama
    const userId = decoded.sub || decoded.id || decoded.user_id || decoded.id_user
    
    console.log('Looking for user ID in decoded token:')
    console.log('  - decoded.sub:', decoded.sub)
    console.log('  - decoded.id:', decoded.id)
    console.log('  - decoded.user_id:', decoded.user_id)
    console.log('  - decoded.id_user:', decoded.id_user)
    console.log('Found user ID:', userId)

    if (!userId) {
      console.warn('⚠️ No user ID found in token')
    }

    console.groupEnd()
    return userId

  } catch (error) {
    console.group('❌ [getUserIdFromToken] ERROR')
    console.error('Error:', error.message)
    console.groupEnd()
    return null
  }
}

// ⭐ UTILITY: Check token expiration
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeJWT(token)
    
    if (!decoded || !decoded.exp) {
      console.warn('⚠️ No exp field in token')
      return true
    }

    const now = Math.floor(Date.now() / 1000)
    const isExpired = decoded.exp < now

    console.log('Token expiration check:')
    console.log('  - Token exp:', decoded.exp)
    console.log('  - Current time:', now)
    console.log('  - Is expired?', isExpired)

    return isExpired

  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

// ⭐ UTILITY: Get all token info
export const getTokenInfo = (token) => {
  const decoded = decodeJWT(token)
  const expired = isTokenExpired(token)

  return {
    decoded,
    expired,
    userId: decoded?.sub || decoded?.id,
  }
}