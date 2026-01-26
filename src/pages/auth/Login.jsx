import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { User, Lock, Eye, EyeOff, Zap, Rocket, Shield, TrendingUp } from 'lucide-react';
import logo from '@/assets/logo/logo.png';
import hollowedBoxesSvg from '@/assets/hollowed-boxes.svg';
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
  const [focusedField, setFocusedField] = useState(null);

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
      console.group(' [Login.handleSubmit] START LOGIN');
      console.log('Username:', formData.username);
      
      console.log('STEP 1: Calling loginUser API...');
      const response = await loginUser(formData.username, formData.password);
      
      console.log('STEP 2: Check response format');
      console.log('Response:', response);
      console.log('response.code:', response.code);
      console.log('response.data:', response.data);
      console.log('access_token:', response.data?.access_token);

      if (response.code !== 200) {
        console.error(' Response code bukan 200:', response.code);
        console.error('Message:', response.message);
        throw new Error(response.message || 'LOGIN_FAILED');
      }

      if (!response.data?.access_token) {
        console.error(' No access_token in response');
        throw new Error('NO_TOKEN_IN_RESPONSE');
      }

      console.log(' Response valid');

      console.log('STEP 3: Calling login context...');
      const userData = await login(response, formData.username);
      
      console.log('STEP 4: Login context returned');
      console.log('User data:', userData);
      console.log('User role:', userData.role);

      if (!userData) {
        console.error(' login() returned null');
        throw new Error('LOGIN_CONTEXT_FAILED');
      }

      console.log(' LOGIN SUCCESS');
      console.groupEnd();

      setAlertType('success');
      setAlertMessage('Login successful!');
      setShowAlert(true);
      setLoginSuccess(true);

   
      console.log(' Redirecting to dashboard');
      setTimeout(() => {
        console.log('→ Redirect to /');
        navigate('/', { replace: true });
      }, 500);

    } catch (error) {
      console.group(' [Login.handleSubmit] ERROR');
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.groupEnd();

      setIsLoading(false);
      setLoginSuccess(false);
      setAlertType('error');
      
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error - please try again later';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request - check your input';
      } else if (error.message === 'NO_TOKEN_IN_RESPONSE') {
        errorMessage = 'Server did not send token - contact admin';
      } else if (error.message === 'LOGIN_CONTEXT_FAILED') {
        errorMessage = 'Login context error - check console';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Cannot connect to server - check connection';
      } else {
        errorMessage = error.message || 'Login failed';
      }
      
      setAlertMessage(errorMessage);
      setShowAlert(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* SVG Background - Left Side */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img 
          src={hollowedBoxesSvg}
          alt="Background Pattern"
          className="absolute inset-0 w-full h-full object-cover opacity-5 lg:opacity-10"
        />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-96 -left-96 w-screen h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-96 -right-96 w-screen h-screen bg-gradient-to-tl from-blue-200 via-purple-100 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 relative z-10 min-h-screen py-6 sm:py-8 md:py-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg shadow-blue-200/30 border border-blue-100/50 p-6 md:p-8 flex flex-col h-auto max-h-[90vh]">
          {/* Logo Section */}
          <div className="mb-5 group text-center flex-shrink-0">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-10 md:h-12 w-auto mb-2 group-hover:scale-110 transition-transform duration-500 mx-auto"
            />
            <p className="text-gray-600 text-xs md:text-sm font-medium leading-tight">
              Jl. Jombor - Pokak 01/01, Ceper, Klaten<br />
              Jawa Tengah - Indonesia
            </p>
          </div>

          {/* Alert Component */}
          {showAlert && (
            <div className="mb-3 animate-slide-down flex-shrink-0">
              <div className={`p-3 md:p-4 rounded-lg text-xs md:text-sm font-semibold backdrop-blur-xl border-2 ${alertType === 'success' ? 'bg-emerald-50/80 text-emerald-700 border-emerald-300 shadow-lg shadow-emerald-200/50' : 'bg-red-50/80 text-red-700 border-red-300 shadow-lg shadow-red-200/50'}`}>
                {alertMessage}
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="space-y-3 md:space-y-4 flex-grow">
            {/* Username Field */}
            <div 
              className="group"
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
            >
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 transition-all duration-300 ${
                    formData.username 
                      ? 'text-cyan-500 scale-125 animate-bounce' 
                      : focusedField === 'username' 
                      ? 'text-blue-600 scale-125' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${focusedField === 'username' ? 'bg-gradient-to-r from-blue-400/15 to-cyan-400/15 shadow-lg shadow-blue-300/40' : 'bg-transparent'}`}></div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your username"
                  className={`relative block w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border-2 text-xs md:text-sm rounded-lg bg-white/60 backdrop-blur-md transition-all duration-300 ${
                    errors.username 
                      ? 'border-red-400 text-red-700' 
                      : focusedField === 'username'
                      ? 'border-blue-500 text-blue-900 shadow-lg shadow-blue-200/50'
                      : 'border-gray-300 text-gray-900 hover:border-gray-400'
                  } placeholder-gray-500 focus:outline-none`}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600 font-semibold">{errors.username}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div 
              className="group"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            >
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-all duration-300 ${
                    formData.password 
                      ? 'text-cyan-500 scale-125 animate-bounce' 
                      : focusedField === 'password' 
                      ? 'text-blue-600 scale-125' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${focusedField === 'password' ? 'bg-gradient-to-r from-blue-400/15 to-cyan-400/15 shadow-lg shadow-blue-300/40' : 'bg-transparent'}`}></div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className={`relative block w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 border-2 text-xs md:text-sm rounded-lg bg-white/60 backdrop-blur-md transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-400 text-red-700' 
                      : focusedField === 'password'
                      ? 'border-blue-500 text-blue-900 shadow-lg shadow-blue-200/50'
                      : 'border-gray-300 text-gray-900 hover:border-gray-400'
                  } placeholder-gray-500 focus:outline-none`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 font-semibold">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || loginSuccess}
              className={`w-full mt-4 py-2.5 md:py-3 px-4 rounded-lg font-bold text-xs md:text-sm text-white transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 group relative overflow-hidden uppercase tracking-wider ${
                isLoading || loginSuccess 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-400/40 hover:shadow-xl hover:shadow-blue-400/60 hover:scale-105 active:scale-95'
              } focus:outline-none relative z-20`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs md:text-sm">Signing In...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 group-hover:animate-pulse" />
                  <span>Sign In</span>
                </>
              )}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3.5 border-t border-gray-200 text-center flex-shrink-0">
            <p className="text-gray-600 text-xs mb-0.5">© 2025 GI-HOL System</p>
            <p className="text-gray-500 text-xs">All Rights Reserved</p>
          </div>
        </div>
      </div>

      {/* Right Side - Premium Illustration (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-8 lg:p-12 relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.5) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-tr from-cyan-300 to-blue-300 rounded-full opacity-15 blur-3xl animate-float animation-delay-2000"></div>

        <div className="relative z-10 text-center max-w-2xl px-4 sm:px-6">
          {/* Illustration */}
          <div className="mb-6 lg:mb-8 perspective drop-shadow-lg">
            <div className="w-full h-56 sm:h-64 lg:h-72 flex items-center justify-center relative">
              <Lottie 
                animationData={monitoringAnimation}
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
              {/* Glow Effect Around Illustration */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-300/30 to-transparent rounded-full blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2 lg:space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 drop-shadow-lg">
              GI-HOL
              <div className="h-0.5 sm:h-1 w-20 sm:w-24 lg:w-32 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mt-2 lg:mt-4 rounded-full"></div>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-700 font-bold">Management Information System</p>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md mx-auto">
              Transform your business operations with our modern digital management platform designed for efficiency and real-time insights.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="mt-6 lg:mt-8 flex flex-wrap justify-center gap-2 lg:gap-3">
            {[
              { icon: Rocket, text: 'Lightning Fast' },
              { icon: Shield, text: 'Enterprise Grade' },
              { icon: TrendingUp, text: 'Real-time Data' }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-full bg-white/60 border-2 border-blue-300 text-blue-700 text-xs lg:text-sm font-bold backdrop-blur-md hover:border-blue-500 hover:bg-blue-50/80 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50 flex items-center gap-1.5 lg:gap-2"
                >
                  <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">{feature.text}</span>
                  <span className="sm:hidden">{feature.text.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .perspective {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}