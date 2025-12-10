// src/pages/auth/Login.jsx
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { Mail, Lock } from 'lucide-react';
import logo from '@/assets/logo/logo.png';
import templateIcon from '@/assets/icons/icon.png';
import bacorunSVG from '@/assets/images/auth/modern.svg';
import Lottie from 'lottie-react';
import monitoringAnimation from '@/assets/animations/monitoring.json';

export default function Login({ onLogin }) {
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
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoginSuccess(false);
    
    setTimeout(() => {
      try {
        const userData = {
          token: 'mock-jwt-token-' + Date.now(),
          id: 1,
          username: formData.username,
          email: formData.username,
          role: 'admin',
          name: 'Admin User'
        };

        if (rememberMe) {
          localStorage.setItem('rememberedUsername', btoa(formData.username));
        }

        setIsLoading(false);
        setLoginSuccess(true);
        setShowAlert(true);
        setAlertType('success');
        setAlertMessage('Login successful! Redirecting to dashboard...');
        
        onLogin(userData);

        setTimeout(() => {
          setFormData({ username: '', password: '' });
          setLoginSuccess(false);
        }, 1500);

      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setIsLoading(false);
        setShowAlert(true);
        setAlertType('error');
        setAlertMessage('Login failed. Please try again.');
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-6 overflow-y-auto relative">
        {/* Bacorun SVG Background Left */}
        <div className="absolute inset-0 opacity-15">
          <img 
            src={bacorunSVG}
            alt="Bacorun Background"
            className="w-full h-full object-cover"
          />
        </div>
        <Card shadow="2xl" padding="lg" rounded="2xl" className="w-full max-w-md">
          {/* Alert */}
          {showAlert && (
            <div className="mb-6 slide-in-down">
              <Alert
                type={alertType}
                message={alertMessage}
                dismissible={true}
                onClose={() => setShowAlert(false)}
              />
            </div>
          )}

          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-20 w-auto object-contain drop-shadow-lg animate-bounce"
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-200 mb-6"></div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-600 text-xs">Enter your credentials to access the system</p>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            {/* Username Input */}
            <Input
              label="Email or Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username or email"
              error={errors.username}
              icon={Mail}
              required={true}
            />

            {/* Password Input */}
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
              showPasswordToggle={true}
              required={true}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded accent-blue-600 cursor-pointer"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              loading={isLoading}
              disabled={loginSuccess}
              onClick={handleSubmit}
              loadingText="Signing in..."
            >
              {loginSuccess ? 'Welcome!' : 'Sign In'}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-xs mb-1">
              © 2025 MIS Team
            </p>
            <p className="text-gray-500 text-xs">
              All Rights Reserved
            </p>
          </div>
        </Card>
      </div>

      {/* Right Side - Illustration & Info */}
      <div className="w-1/2 hidden lg:flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Bacorun SVG Background Right */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src={bacorunSVG}
            alt="Bacorun Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full animate-in fade-in duration-700">
          
          {/* Icon with Animation */}
          <div className="mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
            <img 
              src={templateIcon}
              alt="Template Icon"
              className="h-20 w-20 object-contain drop-shadow-lg"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-2">React Template 19</h2>
            <p className="text-blue-100 text-lg">Management Information System</p>
          </div>

          {/* Illustration Card */}
          <Card 
            shadow="xl" 
            padding="lg" 
            rounded="2xl" 
            className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 w-full max-w-sm mb-8 hover:bg-opacity-20 transition-all duration-300"
          >
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-6 flex items-center justify-center h-56">
              {/* Lottie Animation */}
              <div className="w-full h-full flex items-center justify-center">
                <Lottie 
                  animationData={monitoringAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 border border-white border-opacity-20 text-center hover:bg-opacity-20 transition-all duration-300">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-blue-100 text-xs font-medium">Dashboard</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 border border-white border-opacity-20 text-center hover:bg-opacity-20 transition-all duration-300">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-blue-100 text-xs font-medium">Users</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 border border-white border-opacity-20 text-center hover:bg-opacity-20 transition-all duration-300">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="text-blue-100 text-xs font-medium">Settings</p>
            </div>
          </div>

          {/* Info Badge */}
          <div className="flex items-center justify-center gap-3 text-blue-100 w-full max-w-sm animate-in fade-in duration-700" style={{ animationDelay: '0.3s' }}>
            <div className="w-8 h-8 border-2 border-blue-200 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              ℹ️
            </div>
            <span className="text-xs text-center">Login with a registered account to access the system</span>
          </div>
        </div>
      </div>
    </div>
  );
}