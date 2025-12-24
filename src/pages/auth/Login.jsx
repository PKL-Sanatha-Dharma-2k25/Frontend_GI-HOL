import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '@/assets/logo/logo.png';
import Lottie from 'lottie-react';
import monitoringAnimation from '@/assets/animations/monitoring.json';
import { loginUser } from '@/services/auth';

export default function Login() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 AUTO CLEAR SESSION SAAT MASUK LOGIN
  useEffect(() => {
    logout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setShowAlert(false);

    try {
      console.group('🔐 [Login.handleSubmit] START LOGIN');
      console.log('Username:', formData.username);
      
      // ⭐ STEP 1: LOGIN API CALL
      console.log('STEP 1: Calling loginUser API...');
      const response = await loginUser(formData.username, formData.password);
      
      console.log('STEP 2: Check response format');
      console.log('Response:', response);
      console.log('response.code:', response.code);
      console.log('response.data:', response.data);
      console.log('access_token:', response.data?.access_token);

      // ⭐ STEP 2: VALIDASI RESPONSE
      if (response.code !== 200) {
        console.error('❌ Response code bukan 200:', response.code);
        console.error('Message:', response.message);
        throw new Error(response.message || 'LOGIN_FAILED');
      }

      if (!response.data?.access_token) {
        console.error('❌ No access_token in response');
        throw new Error('NO_TOKEN_IN_RESPONSE');
      }

      console.log('✅ Response valid');

      // ⭐ STEP 3: CALL LOGIN CONTEXT
      console.log('STEP 3: Calling login context...');
      const userData = await login(response, formData.username);
      
      console.log('STEP 4: Login context returned');
      console.log('User data:', userData);
      console.log('User role:', userData.role);

      if (!userData) {
        console.error('❌ login() returned null');
        throw new Error('LOGIN_CONTEXT_FAILED');
      }

      console.log('✅ LOGIN SUCCESS');
      console.groupEnd();

      setAlertType('success');
      setAlertMessage('Login successful!');
      setShowAlert(true);
      setLoginSuccess(true);

      // 🔥 REDIRECT BERDASARKAN ROLE
      console.log('🔄 Redirecting based on role:', userData.role);
      setTimeout(() => {
        if (userData.role === 'supervisor') {
          console.log('→ Redirect to /hourly-output');
          navigate('/hourly-output', { replace: true });
        } else if (userData.role === 'admin' || userData.role === 'superadmin') {
          console.log('→ Redirect to /dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('→ Redirect to /dashboard (default)');
          navigate('/dashboard', { replace: true });
        }
      }, 500);

    } catch (error) {
      console.group('❌ [Login.handleSubmit] ERROR');
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      console.groupEnd();

      setAlertType('error');
      
      // ⭐ TAMPILKAN ERROR YANG LEBIH DETAIL
      if (error.response?.status === 401) {
        setAlertMessage('❌ Username atau password salah');
      } else if (error.response?.status === 500) {
        setAlertMessage('❌ Server error - coba lagi nanti');
      } else if (error.message === 'NO_TOKEN_IN_RESPONSE') {
        setAlertMessage('❌ Server tidak mengirim token - hubungi admin');
      } else if (error.message === 'LOGIN_CONTEXT_FAILED') {
        setAlertMessage('❌ Login context error - cek console');
      } else {
        setAlertMessage('❌ ' + (error.message || 'Login failed'));
      }
      
      setShowAlert(true);
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 sm:p-8 min-h-screen lg:min-h-auto">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Logo Section */}
          <div className="text-center mb-6">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-10 sm:h-12 w-auto mx-auto mb-4"
            />
          </div>

          {/* Address Section */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-xs sm:text-sm">
              Jl. Jombor - Pokak 01/01, Ceper, Klaten<br />
              Jawa Tengah - Indonesia
            </p>
          </div>

          {/* Alert Component */}
          {showAlert && (
            <div className="mb-6">
              <div className={`p-3 rounded-lg text-sm sm:text-base ${alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {alertMessage}
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your username"
                  className={`block w-full pl-10 pr-3 py-2 sm:py-3 border text-sm sm:text-base ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className={`block w-full pl-10 pr-10 py-2 sm:py-3 border text-sm sm:text-base ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || loginSuccess}
              className={`w-full py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white ${
                isLoading || loginSuccess 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-xs">© 2025 MIS Team</p>
            <p className="text-gray-400 text-xs">All Rights Reserved</p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration (Hidden on Mobile) */}
      <div className="hidden lg:flex w-3/5 items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-900 p-8">
        <div className="text-center max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-2">GI-HOL</h2>
          <p className="text-blue-200 text-lg mb-8">Management Information System</p>
          
          <div className="w-full h-96 flex items-center justify-center">
            <Lottie 
              animationData={monitoringAnimation}
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}