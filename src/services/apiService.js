import api from './api'


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
// HOUR MASTER FUNCTIONS 
// ========================================

export const getHour = async () => {
  try {
    console.log(' [getHour] Fetching hour master data...')
    const response = await api.get('/auth/gethour')
    console.log(' [getHour] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error(' Get hour error:', error)
    throw error
  }
}

// ========================================
// HOURLY OUTPUT FUNCTIONS
// ========================================

export const getHourlyOutput = async (style = null, idLine = null) => {
  try {
    const params = {}

    console.log(' [getHourlyOutput] Parameters:', { style, idLine })

    if (idLine) {
      params.id_line = idLine
      console.log(' Using id_line:', idLine)
    } else if (style && style.trim() !== '') {
      params.style = style
      console.log(' Using style:', style)
    } else {
      params.style = ''
      console.log(' Using empty style as fallback')
    }

    console.log(' [getHourlyOutput] Final params sent:', params)
    const response = await api.get('/auth/getopthourlyoutput', { params })
    console.log(' [getHourlyOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error(' Get hourly output error:', error)
    throw error
  }
}

export const getHourlyOutputHeader = async () => {
  try {
    console.log(' [getHourlyOutputHeader] Fetching data from /auth/getouputheader...')
    const response = await api.get('/auth/getouputheader')
    console.log(' [getHourlyOutputHeader] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error(' Get hourly output header error:', error)
    throw error
  }
}

export const getDetailOutputByStyle = async (style, idLine) => {
  try {
    console.log(' [getDetailOutputByStyle] Fetching detail...', { style, idLine })
    const params = { style, id_line: idLine }
    console.log(' [getDetailOutputByStyle] Calling endpoint: /auth/getdetailoptob')
    console.log(' [getDetailOutputByStyle] Params:', params)
    const response = await api.get('/auth/getdetailoptob', { params })
    console.log(' [getDetailOutputByStyle] Success response:', response.data)

    if (response.data?.data?.length === 0) {
      console.error(' [getDetailOutputByStyle] No detail data found!')
      console.error('   Style:', style)
      console.error('   ID Lane:', idLine)

      throw new Error(
        `ORC ini tidak punya data detail untuk style "${style}". ` +
        `Silakan hubungi admin untuk setup data.`
      )
    }

    return response.data
  } catch (error) {
    console.error(' Get detail output error:', error.message)
    console.error(' Requested URL:', error.config?.url)
    throw error
  }
}

export const storeHourlyOutput = async (data) => {
  try {
    console.log(' [storeHourlyOutput] Saving header data:', data)
    const response = await api.post('/auth/store', data)
    console.log(' [storeHourlyOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error(' Store hourly output error:', error)
    throw error
  }
}

export const storeDetailOutput = async (data) => {
  try {
    console.log('💾 [storeDetailOutput] Saving detail output data...')
    console.log('💾 Payload:', JSON.stringify(data, null, 2))
    console.log('💾 Details count:', data.details?.length)

    // Validate payload before sending
    if (!data.id_output) {
      console.error('❌ Missing id_output in payload')
    }
    if (!data.id_operation_breakdown) {
      console.error('❌ Missing id_operation_breakdown in payload')
    }
    if (!data.details || data.details.length === 0) {
      console.error('❌ Missing or empty details array')
    }

    const response = await api.post('/auth/insertdetailopt', data)
    console.log('✅ [storeDetailOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Store detail output error:', error)
    console.error('❌ Error response:', error.response?.data)
    console.error('❌ Error status:', error.response?.status)
    console.error('❌ Error message:', error.message)

    // Log validation errors if available
    if (error.response?.data?.errors) {
      console.error('❌ Validation errors:', error.response.data.errors)
    }
    if (error.response?.data?.message) {
      console.error('❌ Backend message:', error.response.data.message)
    }

    throw error
  }
}

// ========================================
// DETAIL & UPDATE VIEW FUNCTIONS
// ========================================

export const getDetailFromDetailOpt = async (idOutput) => {
  try {
    console.log(' [getDetailFromDetailOpt] Fetching detail view data..., { idOutput }')
    const params = { id_output: idOutput }
    console.log(' [getDetailFromDetailOpt] Calling endpoint: /auth/getdetailfromdetailopt')
    console.log(' [getDetailFromDetailOpt] Params:', params)
    const response = await api.get('/auth/getdetailfromdetailopt', { params })
    console.log(' [getDetailFromDetailOpt] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error(' Get detail from detail opt error:', error.message)
    console.error(' Requested URL:', error.config?.url)
    throw error
  }
}

export const getUpdateFromDetailOpt = async (idOutput) => {
  try {
    console.log(' [getUpdateFromDetailOpt] Fetching update data..., { idOutput }')
    const params = { id_output: idOutput }
    console.log(' [getUpdateFromDetailOpt] Calling endpoint: /auth/getupdatefromdetailopt')
    console.log('[getUpdateFromDetailOpt] Params:', params)
    const response = await api.get('/auth/getupdatefromdetailopt', { params })
    console.log(' [getUpdateFromDetailOpt] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error(' Get update from detail opt error:', error.message)
    console.error(' Requested URL:', error.config?.url)
    throw error
  }
}

export const updateDetailOutput = async (data) => {
  try {
    console.log(' [updateDetailOutput] Updating detail output data:', data)
    const response = await api.put('/auth/updatedetailbatch', data)
    console.log(' [updateDetailOutput] Success response:', response.data)
    return response.data
  } catch (error) {
    console.error(' Update detail output error:', error)
    throw error
  }
}

// ========================================
// DASHBOARD CHART FUNCTIONS
// ========================================

export const getBarChartDash = async (idLine, hour) => {
  try {
    console.log(' [getBarChartDash] Fetching bar chart data...', { idLine, hour })

    // Validasi input
    if (!idLine || !hour) {
      throw new Error('id_line dan hour harus diisi')
    }

    const params = {
      hour: parseInt(hour)
    }


    const response = await api.get('/auth/getbarchartdash', { params })

    let orcValue = '-'
    let styleValue = '-'

    if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const firstItem = response.data.data[0]
      orcValue = firstItem.orc || firstItem.orc_sewing || '-'
      styleValue = firstItem.style || firstItem.style_orc || '-'
    }

    if (response.data?.data && Array.isArray(response.data.data)) {
      const grouped = {}

      response.data.data.forEach(item => {
        const key = `${item.operation_code}|${item.operation_name}`

        if (!grouped[key]) {
          grouped[key] = {
            operation_code: item.operation_code,
            operation_name: item.operation_name,
            output: 0,
            repair: 0,
            reject: 0,
            target: 0,
            orc: orcValue,
            style: styleValue
          }
        }

        grouped[key].output += parseInt(item.output || item.total_output || 0) || 0
        grouped[key].repair += parseInt(item.repair || item.qty_repair || 0) || 0
        grouped[key].reject += parseInt(item.reject || item.qty_reject || 0) || 0
        grouped[key].target += parseInt(
          item.total_target ??
          item.target ??
          item.target_output ??
          item.target_per_day ??
          item.jumlah_target ??
          item.qty_target ??
          0
        ) || 0
      })

      const transformedData = Object.values(grouped)


      return {
        success: true,
        data: transformedData,
        orc: orcValue,
        style: styleValue
      }
    }

    return {
      success: true,
      data: response.data?.data || [],
      orc: orcValue,
      style: styleValue
    }
  } catch (error) {
    console.error(' Get bar chart dash error:', error)
    throw error
  }
}

// ========================================
// DASHBOARD STATS FUNCTIONS
// ========================================

export const getOutputAllDash = async (idLine) => {
  try {

    if (!idLine) {
      throw new Error('id_line harus diisi')
    }

    const params = {
      id_line: idLine
    }

    const response = await api.get('/auth/getoutputalldash', { params })


    if (response.data?.data && Array.isArray(response.data.data)) {
      let totalOutput = 0
      let totalTarget = 0
      let totalRepair = 0
      let totalReject = 0

      response.data.data.forEach((item) => {
        const output = parseInt(
          item.total_output ??
          item.output ??
          item.jumlah_output ??
          item.qty_output ??
          0
        ) || 0

        const target = parseInt(
          item.total_target ??
          item.target ??
          item.target_output ??
          item.target_per_day ??
          item.jumlah_target ??
          item.qty_target ??
          0
        ) || 0

        const repair = parseInt(item.repair || item.qty_repair || item.total_repair || 0) || 0
        const reject = parseInt(item.reject || item.qty_reject || item.total_reject || 0) || 0

        totalOutput += output
        totalTarget += target
        totalRepair += repair
        totalReject += reject
      })

      const efficiency = totalTarget > 0 ? Math.round((totalOutput / totalTarget) * 100) : 0

      return {
        success: true,
        totalOutput,
        totalTarget,
        totalRepair,
        totalReject,
        efficiency,
        rawData: response.data.data
      }
    }

    return {
      success: true,
      totalOutput: 0,
      totalTarget: 0,
      efficiency: 0,
      rawData: []
    }
  } catch (error) {
    console.error(' Get output all dash error:', error)
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

export const getOrcProcessAllReports = async (orc) => {
  try {

    if (!orc) {
      throw new Error('ORC parameter is required')
    }

    const params = { orc }

    const response = await api.get('/auth/getOrcProcessAllReports', { params })

    return response.data
  } catch (error) {
    console.error(' Get ORC process reports error:', error)
    throw error
  }
}

// ========================================
// IOT SYNCHRONIZATION FUNCTIONS
// ========================================

export const getSyncIoTData = async (style, idLine) => {
  try {

    if (!style || !idLine) {
      throw new Error('Style and id_line are required')
    }

    const params = {
      style,
      id_line: idLine
    }


    const response = await api.get('/auth/singkronisasiiot', { params })

    return response.data
  } catch (error) {
    console.error('❌ Get IoT sync data error:', error)
    throw error
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