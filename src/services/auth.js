import api from './api'

export const loginUser = async (username, password) => {
  try {
    console.group(' [loginUser] LOGIN REQUEST')
    console.log('Username:', username)
    console.log('Password:', '***')
    
    const res = await api.post('/auth/login', {
      username,
      password
    })
    
    console.log(' Response received')
    console.log('Status:', res.status)
    console.log('Full response:', res.data)
    console.log('Response code:', res.data?.code)
    console.log('Access token exists?', !!res.data?.data?.access_token)
    
    if (res.data?.data?.access_token) {
      console.log(' TOKEN FOUND:', res.data.data.access_token.substring(0, 20) + '...')
    }
    
    console.groupEnd()
    return res.data
    
  } catch (error) {
    console.group(' [loginUser] ERROR')
    console.error('Error status:', error.response?.status)
    console.error('Error message:', error.response?.data?.message)
    console.error('Full error response:', error.response?.data)
    console.error('Error:', error.message)
    console.groupEnd()
    throw error
  }
}


export const getUserProfile = async () => {
  try {
    console.group(' [getUserProfile] FETCH PROFILE')
    
    
    const res = await api.post('/auth/me')
    
    console.log(' Response received')
    console.log('Status:', res.status)
    console.log('Full response:', res.data)
    
    
    let profile = null
    
   
    if (res.data?.data && typeof res.data.data === 'object' && !Array.isArray(res.data.data)) {
      profile = res.data.data
      console.log(' Profile format: res.data.data (object)')
    }
  
    else if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      profile = res.data.data[0]
      console.log(' Profile format: res.data.data[0] (array)')
    }
  
    else if (res.data && typeof res.data === 'object') {
      profile = res.data
      console.log(' Profile format: res.data (direct)')
    }
    
    if (!profile) {
      console.error(' No profile data in response!')
      console.groupEnd()
      return null
    }
    
    console.log(' Profile found:')
    console.log('  - id_user:', profile.id_user || profile.id)
    console.log('  - username:', profile.username)
    console.log('  - role:', profile.role)
    console.log('  - id_role:', profile.id_role)
    console.log('  - id_line:', profile.id_line)
    
    
    const normalizedProfile = {
      id_user: profile.id_user || profile.id,
      username: profile.username,
      role: profile.role || profile.id_role,  
      id_line: profile.id_line  
    }
    
    
    if (!normalizedProfile.id_line) {
      console.error(' CRITICAL: id_line is missing from API response!')
      console.error('   User:', normalizedProfile.username)
      console.error('   id_user:', normalizedProfile.id_user)
      console.error('   Message: Contact admin to set id_line for this user')
      console.groupEnd()
      throw new Error('id_line is required but missing from user profile. Contact your administrator.')
    }
    
    console.log(' id_line validation passed:', normalizedProfile.id_line)
    console.log(' Profile is valid and ready to use')
    console.groupEnd()
    return normalizedProfile
    
  } catch (error) {
    console.group(' [getUserProfile] ERROR')
    console.error('Error status:', error.response?.status)
    console.error('Error message:', error.response?.data?.message)
    console.error('Full error:', error.message)
    console.error('Full error response:', error.response?.data)
    console.groupEnd()
    throw error
  }
}


export const getUserProfileAlternative = async () => {
  try {
    console.group('[getUserProfileAlternative] TRY ALTERNATIVE')
    
    const endpoints = [
      '/auth/profile',
      '/auth/user-profile',
      '/user/profile',
      '/api/user/me'
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying endpoint:', endpoint)
        const res = await api.get(endpoint)
        console.log(' Found! Response:', res.data)
        
       
        const data = res.data.data ? res.data.data[0] || res.data.data : res.data
    
        if (!data.id_line) {
          console.warn(' Alternative endpoint returned data without id_line')
          continue
        }
        
        const normalizedProfile = {
          id_user: data.id_user || data.id,
          username: data.username,
          role: data.role,
          id_line: data.id_line 
        }
        
        console.groupEnd()
        return normalizedProfile
      } catch (e) {
        console.log('Failed:', endpoint)
        continue
      }
    }
    console.error('All alternative endpoints failed')
    console.groupEnd()
    return null
    
  } catch (error) {
    console.error('Error in alternative:', error.message)
    return null
  }
}