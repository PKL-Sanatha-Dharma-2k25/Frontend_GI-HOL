import api from './api'

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

export const getCSRFToken = async () => {
  try {
    const response = await api.get('/sanctum/csrf-cookie')
    return response.status === 200
  } catch (error) {
    console.error('Error getting CSRF token:', error)
    return false
  }
}

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

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout')
    return response.status === 200
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

export const getCurrentUserProfile = async () => {
  try {
    const response = await api.post('/auth/me')
    return response.data
  } catch (error) {
    console.error('Get user profile error:', error)
    throw error
  }
}

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

export const getOrcSewing = async () => {
  try {
    const response = await api.get('/auth/getorcsewing')
    return response.data
  } catch (error) {
    console.error('Get ORC sewing error:', error)
    throw error
  }
}

export const getStyleOrc = async () => {
  try {
    const response = await api.get('/auth/getstyleorc')
    return response.data
  } catch (error) {
    console.error('Get style ORC error:', error)
    throw error
  }
}

export const getLine = async () => {
  try {
    const response = await api.get('/auth/getline')
    return response.data
  } catch (error) {
    console.error('Get line error:', error)
    throw error
  }
}

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
// HOURLY OUTPUT FUNCTIONS
// ========================================

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

export const getDetailOutputByStyle = async (style, idLine) => {
  try {
    console.log('📊 [getDetailOutputByStyle] Fetching detail...', { style, idLine })
    const params = { style, id_lane: idLine }
    console.log('📊 [getDetailOutputByStyle] Calling endpoint: /auth/getdetailoptob')
    console.log('📊 [getDetailOutputByStyle] Params:', params)
    const response = await api.get('/auth/getdetailoptob', { params })
    console.log('✅ [getDetailOutputByStyle] Success response:', response.data)
    
    if (response.data?.data?.length === 0) {
      console.error('❌ [getDetailOutputByStyle] No detail data found!')
      console.error('   Style:', style)
      console.error('   ID Lane:', idLine)
      
      throw new Error(
        `ORC ini tidak punya data detail untuk style "${style}". ` +
        `Silakan hubungi admin untuk setup data.`
      )
    }
    
    return response.data
  } catch (error) {
    console.error('❌ Get detail output error:', error.message)
    console.error('❌ Requested URL:', error.config?.url)
    throw error
  }
}

export const storeHourlyOutput = async (data) => {
  try {
    console.log('💾 [storeHourlyOutput] Saving header data:', data)
    const response = await api.post('/auth/store', data)
    console.log('✅ [storeHourlyOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Store hourly output error:', error)
    throw error
  }
}

export const storeDetailOutput = async (data) => {
  try {
    console.log('💾 [storeDetailOutput] Saving detail output data:', data)
    const response = await api.post('/auth/insertdetailopt', data)
    console.log('✅ [storeDetailOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Store detail output error:', error)
    throw error
  }
}

// ========================================
// DETAIL & UPDATE VIEW FUNCTIONS ⭐ NEW
// ========================================

export const getDetailFromDetailOpt = async (idOutput) => {
  try {
    console.log('👁️ [getDetailFromDetailOpt] Fetching detail view data..., { idOutput }')
    const params = { id_output: idOutput }
    console.log('👁️ [getDetailFromDetailOpt] Calling endpoint: /auth/getdetailfromdetailopt')
    console.log('👁️ [getDetailFromDetailOpt] Params:', params)
    const response = await api.get('/auth/getdetailfromdetailopt', { params })
    console.log('✅ [getDetailFromDetailOpt] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Get detail from detail opt error:', error.message)
    console.error('❌ Requested URL:', error.config?.url)
    throw error
  }
}

export const getUpdateFromDetailOpt = async (idOutput) => {
  try {
    console.log('✏️ [getUpdateFromDetailOpt] Fetching update data..., { idOutput }')
    const params = { id_output: idOutput }
    console.log('✏️ [getUpdateFromDetailOpt] Calling endpoint: /auth/getupdatefromdetailopt')
    console.log('✏️ [getUpdateFromDetailOpt] Params:', params)
    const response = await api.get('/auth/getupdatefromdetailopt', { params })
    console.log('✅ [getUpdateFromDetailOpt] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Get update from detail opt error:', error.message)
    console.error('❌ Requested URL:', error.config?.url)
    throw error
  }
}

export const updateDetailOutput = async (data) => {
  try {
    console.log('🔄 [updateDetailOutput] Updating detail output data:', data)
    const response = await api.post('/auth/updatedetailopt', data)
    console.log('✅ [updateDetailOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Update detail output error:', error)
    throw error
  }
}

// ========================================
// IGNITION FUNCTIONS
// ========================================

export const executeSolution = async (payload) => {
  try {
    const response = await api.post('/ignition/execute-solution', payload)
    return response.data
  } catch (error) {
    console.error('Execute solution error:', error)
    throw error
  }
}

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

export const healthCheck = async () => {
  try {
    const response = await api.get('/ignition/health-check')
    return response.status === 200
  } catch (error) {
    console.error('Health check error:', error)
    return false
  }
}

export const checkAPIStatus = async () => {
  try {
    const response = await api.get('/up')
    return response.status === 200
  } catch (error) {
    console.error('API status error:', error)
    return false
  }
}