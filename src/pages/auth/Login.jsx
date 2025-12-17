import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Alert from '@/components/ui/Alert'
import { User, Lock } from 'lucide-react'
import logo from '@/assets/logo/logo.png'
import templateIcon from '@/assets/icons/icon.png'
import bacorunSVG from '@/assets/images/auth/modern.svg'
import Lottie from 'lottie-react'
import monitoringAnimation from '@/assets/animations/monitoring.json'
import { loginUser } from '@/services/auth'

export default function Login() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('error')
  const [alertMessage, setAlertMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // 🔥 AUTO CLEAR SESSION SAAT MASUK LOGIN
  useEffect(() => {
    logout()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setShowAlert(false)

    try {
      console.group('🔐 [Login.handleSubmit] START LOGIN')
      console.log('Username:', formData.username)
      
      // ⭐ STEP 1: LOGIN API CALL
      console.log('STEP 1: Calling loginUser API...')
      const response = await loginUser(formData.username, formData.password)
      
      console.log('STEP 2: Check response format')
      console.log('Response:', response)
      console.log('response.code:', response.code)
      console.log('response.data:', response.data)
      console.log('access_token:', response.data?.access_token)

      // ⭐ STEP 2: VALIDASI RESPONSE
      if (response.code !== 200) {
        console.error('❌ Response code bukan 200:', response.code)
        console.error('Message:', response.message)
        throw new Error(response.message || 'LOGIN_FAILED')
      }

      if (!response.data?.access_token) {
        console.error('❌ No access_token in response')
        throw new Error('NO_TOKEN_IN_RESPONSE')
      }

      console.log('✅ Response valid')

      // ⭐ STEP 3: CALL LOGIN CONTEXT
      console.log('STEP 3: Calling login context...')
      const userData = await login(response, formData.username)
      
      console.log('STEP 4: Login context returned')
      console.log('User data:', userData)
      console.log('User role:', userData.role)

      if (!userData) {
        console.error('❌ login() returned null')
        throw new Error('LOGIN_CONTEXT_FAILED')
      }

      console.log('✅ LOGIN SUCCESS')
      console.groupEnd()

      setAlertType('success')
      setAlertMessage('Login successful!')
      setShowAlert(true)
      setLoginSuccess(true)

      // 🔥 REDIRECT BERDASARKAN ROLE
      console.log('🔄 Redirecting based on role:', userData.role)
      setTimeout(() => {
        if (userData.role === 'supervisor') {
          console.log('→ Redirect to /hourly-output')
          navigate('/hourly-output', { replace: true })
        } else if (userData.role === 'admin' || userData.role === 'superadmin') {
          console.log('→ Redirect to /dashboard')
          navigate('/dashboard', { replace: true })
        } else {
          console.log('→ Redirect to /dashboard (default)')
          navigate('/dashboard', { replace: true })
        }
      }, 500)

    } catch (error) {
      console.group('❌ [Login.handleSubmit] ERROR')
      console.error('Error message:', error.message)
      console.error('Full error:', error)
      console.groupEnd()

      setAlertType('error')
      
      // ⭐ TAMPILKAN ERROR YANG LEBIH DETAIL
      if (error.response?.status === 401) {
        setAlertMessage('❌ Username atau password salah')
      } else if (error.response?.status === 500) {
        setAlertMessage('❌ Server error - coba lagi nanti')
      } else if (error.message === 'NO_TOKEN_IN_RESPONSE') {
        setAlertMessage('❌ Server tidak mengirim token - hubungi admin')
      } else if (error.message === 'LOGIN_CONTEXT_FAILED') {
        setAlertMessage('❌ Login context error - cek console')
      } else {
        setAlertMessage('❌ ' + (error.message || 'Login failed'))
      }
      
      setShowAlert(true)
      setLoginSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-responsive py-responsive overflow-y-auto relative">
        <div className="absolute inset-0 opacity-15">
          <img 
            src={bacorunSVG}
            alt="Bacorun Background"
            className="w-full h-full object-cover"
          />
        </div>

        <Card shadow="2xl" padding="lg" rounded="2xl" className="w-full max-w-md">
          {showAlert && (
            <div className="mb-6 slide-in-down">
              <Alert
                type={alertType}
                message={alertMessage}
                dismissible
                onClose={() => setShowAlert(false)}
              />
            </div>
          )}

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-16 md:h-20 w-auto object-contain drop-shadow-lg animate-bounce"
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6"></div>

          <div className="text-center mb-6">
            <p className="text-gray-700 text-responsive font-medium leading-relaxed">
              Jl. Jombor - Pokak 01/01, Ceper, Klaten<br />
              Jawa Tengah - Indonesia
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username"
              error={errors.username}
              icon={User}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              error={errors.password}
              icon={Lock}
              showPasswordToggle
              required
              disabled={isLoading}
            />

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
              disabled={loginSuccess}
              onClick={handleSubmit}
              loadingText="Signing in..."
            >
              {loginSuccess ? 'Welcome!' : 'Sign In'}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-xs mb-1">© 2025 MIS Team</p>
            <p className="text-gray-500 text-xs">All Rights Reserved</p>
          </div>
        </Card>
      </div>

      {/* Right Side - Hidden on Mobile */}
      <div className="hidden-xs hidden-sm w-1/2 hidden lg:flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={bacorunSVG}
            alt="Bacorun Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full animate-in fade-in duration-700">
          <div className="mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
            <img 
              src={templateIcon}
              alt="Template Icon"
              className="h-20 w-20 object-contain drop-shadow-lg"
            />
          </div>

          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-2">React Template 19</h2>
            <p className="text-blue-100 text-lg">Management Information System</p>
          </div>

          <Card 
            shadow="xl" 
            padding="lg" 
            rounded="2xl" 
            className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 w-full max-w-sm mb-8 hover:bg-opacity-20 transition-all duration-300"
          >
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-6 flex items-center justify-center h-56">
              <div className="w-full h-full flex items-center justify-center">
                <Lottie 
                  animationData={monitoringAnimation}
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 border border-white border-opacity-20 text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-blue-100 text-xs font-medium">Dashboard</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 border border-white border-opacity-20 text-center">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-blue-100 text-xs font-medium">Users</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 border border-white border-opacity-20 text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="text-blue-100 text-xs font-medium">Settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}