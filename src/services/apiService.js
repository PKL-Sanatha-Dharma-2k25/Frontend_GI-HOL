import api from './api' // Import axios instance

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

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

// Get Current User Profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.post('/auth/me')
    return response.data
  } catch (error) {
    console.error('Get user profile error:', error)
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

// ========================================
// DATA MASTER FUNCTIONS
// ========================================

// Get ORC Sewing
export const getOrcSewing = async () => {
  try {
    const response = await api.get('/auth/getorcsewing')
    return response.data
  } catch (error) {
    console.error('Get ORC sewing error:', error)
    throw error
  }
}

// Get Style ORC
export const getStyleOrc = async () => {
  try {
    const response = await api.get('/auth/getstyleorc')
    return response.data
  } catch (error) {
    console.error('Get style ORC error:', error)
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

// Get All User
export const getAllUser = async () => {
  try {
    const response = await api.get('/auth/getallusers')
    return response.data
  } catch (error) {
    console.error('Get all user error:', error)
    throw error
  }
}

// ========================================
// HOURLY OUTPUT FUNCTIONS (FIXED)
// ========================================

// Get Hourly Output (dengan filter style atau id_line)
export const getHourlyOutput = async (style = null, idLine = null) => {
  try {
    const params = {}
    
    console.log('📊 [getHourlyOutput] Parameters:', { style, idLine })
    
    if (idLine) {
      params.id_line = idLine
      console.log('📊 Using id_line:', idLine)
    } else if (style && style.trim() !== '') {
      params.style = style
      console.log('📊 Using style:', style)
    } else {
      params.style = ''
      console.log('📊 Using empty style as fallback')
    }
    
    console.log('📊 [getHourlyOutput] Final params sent:', params)
    const response = await api.get('/auth/getopthourlyoutput', { params })
    console.log('✅ [getHourlyOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Get hourly output error:', error)
    throw error
  }
}

// ✅ Get Hourly Output Header (endpoint: /api/auth/getouputheader)
export const getHourlyOutputHeader = async () => {
  try {
    console.log('📊 [getHourlyOutputHeader] Fetching data from /auth/getouputheader...')
    const response = await api.get('/auth/getouputheader')
    console.log('✅ [getHourlyOutputHeader] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Get hourly output header error:', error)
    throw error
  }
}

// ✅ Get Detail Output (endpoint: /api/auth/getdetailoptob?style=...&id_line=...)
export const getDetailOutputByStyle = async (style, idLine) => {
  try {
    console.log('📊 [getDetailOutputByStyle] Fetching detail...', { style, idLine })
    const params = { style, id_line: idLine }
    console.log('📊 Calling endpoint: /auth/getdetailoptob with params:', params)
    const response = await api.get('/auth/getdetailoptob', { params })
    console.log('✅ [getDetailOutputByStyle] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Get detail output error:', error)
    console.error('❌ Requested URL:', error.config?.url)
    throw error
  }
}

// Store Hourly Output
export const storeHourlyOutput = async (data) => {
  try {
    console.log('💾 [storeHourlyOutput] Saving data:', data)
    const response = await api.post('/auth/store', data)
    console.log('✅ [storeHourlyOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Store data error:', error)
    throw error
  }
}

// ========================================
// IGNITION FUNCTIONS
// ========================================

// Execute Solution
export const executeSolution = async (payload) => {
  try {
    const response = await api.post('/ignition/execute-solution', payload)
    return response.data
  } catch (error) {
    console.error('Execute solution error:', error)
    throw error
  }
}

// Update Config
export const updateConfig = async (payload) => {
  try {
    const response = await api.post('/ignition/update-config', payload)
    return response.data
  } catch (error) {
    console.error('Update config error:', error)
    throw error
  }
}

// ========================================
// HEALTH CHECK FUNCTIONS
// ========================================

// Health Check
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