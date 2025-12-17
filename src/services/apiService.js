import api from './api' // Import axios instance Anda

// Get CSRF Token
export const getCSRFToken = async () => {
  try {
    const response = await api.get('/sanctum/csrf-cookie')
    return response.status === 200
  } catch (error) {
    console.error('Error getting CSRF token:', error)
    return false
  }
}

// Login
export const login = async (username, password) => {
  try {
    await getCSRFToken()
    const response = await api.post('/auth/login', { 
      username, 
      password 
    })
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// Logout
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout')
    return response.status === 200
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

// Get Current User
export const getCurrentUser = async () => {
  try {
    const response = await api.post('/auth/me')
    return response.data
  } catch (error) {
    console.error('Get user error:', error)
    throw error
  }
}

// Refresh Token
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh')
    return response.data
  } catch (error) {
    console.error('Token refresh error:', error)
    throw error
  }
}

// Get ORC Sewing (untuk ambil ORC)
export const getOrcSewing = async () => {
  try {
    const response = await api.get('/auth/getorcsewing')
    return response.data
  } catch (error) {
    console.error('Get ORC sewing error:', error)
    throw error
  }
}

// Get Style ORC (untuk ambil style berdasarkan ORC)
export const getStyleOrc = async () => {
  try {
    const response = await api.get('/auth/getstyleorc')
    return response.data
  } catch (error) {
    console.error('Get style ORC error:', error)
    throw error
  }
}

// Get Hourly Output
// ⭐ FIXED: Backend requires style parameter
// If no style provided, get all available styles from backend or use id_line
export const getHourlyOutput = async (style = null, idLine = null) => {
  try {
    const params = {}
    
    // ⭐ Try different approaches based on what backend accepts
    if (style && style.trim() !== '') {
      params.style = style
    } else if (idLine) {
      // If no style, try using id_line instead
      params.id_line = idLine
    } else {
      // Last resort: try getting all without strict filtering
      // Let backend decide what to return
      params.style = '%'  // Wildcard to get all
    }
    
    const response = await api.get('/auth/getopthourlyoutput', { params })
    return response.data
  } catch (error) {
    console.error('Get hourly output error:', error)
    throw error
  }
}

// Get All Users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/auth/getallusers')
    return response.data
  } catch (error) {
    console.error('Get users error:', error)
    throw error
  }
}

// Get Line
export const getLine = async () => {
  try {
    const response = await api.get('/auth/getline')
    return response.data
  } catch (error) {
    console.error('Get line error:', error)
    throw error
  }
}

// Store/Save Data (Hourly Output)
export const storeHourlyOutput = async (data) => {
  try {
    const response = await api.post('/auth/store', data)
    return response.data
  } catch (error) {
    console.error('Store data error:', error)
    throw error
  }
}

// Execute Solution (Ignition)
export const executeSolution = async (payload) => {
  try {
    const response = await api.post('/ignition/execute-solution', payload)
    return response.data
  } catch (error) {
    console.error('Execute solution error:', error)
    throw error
  }
}

// Update Config (Ignition)
export const updateConfig = async (payload) => {
  try {
    const response = await api.post('/ignition/update-config', payload)
    return response.data
  } catch (error) {
    console.error('Update config error:', error)
    throw error
  }
}

// Health Check (Ignition)
export const healthCheck = async () => {
  try {
    const response = await api.get('/ignition/health-check')
    return response.status === 200
  } catch (error) {
    console.error('Health check error:', error)
    return false
  }
}

// API Status
export const checkAPIStatus = async () => {
  try {
    const response = await api.get('/up')
    return response.status === 200
  } catch (error) {
    console.error('API status error:', error)
    return false
  }
}