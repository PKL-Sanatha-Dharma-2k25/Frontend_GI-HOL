import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import { Mail, Lock } from 'lucide-react';
import logo from '../../assets/logo/logo.png';
import templateIcon from '../../assets/icons/icon.png'; 

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      newErrors.username = 'Username atau email harus diisi';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulasi API call
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage('Login berhasil! Redirect ke dashboard...');
      
      // Reset form
      setFormData({ username: '', password: '' });
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <Card shadow="2xl" padding="lg" rounded="xl" className="w-full max-w-2xl">
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

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-200 mb-8"></div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-600 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {/* Form Inputs */}
          <div className="space-y-5">
            {/* Username Input */}
            <Input
              label="Username atau Email"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan username atau email"
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
              placeholder="Masukkan password"
              error={errors.password}
              icon={Lock}
              showPasswordToggle={true}
              required={true}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded accent-blue-600 cursor-pointer"
                />
                <span className="text-gray-700">Ingat saya</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition">
                Lupa password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? 'Sedang login...' : 'Sign In'}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-xs mb-4">
              © 2025 MIS Team
            </p>
            <p className="text-center text-gray-500 text-xs">
              Hak Cipta Dilindungi | All Rights Reserved
            </p>
          </div>
        </Card>
      </div>

      {/* Right Side - Illustration & Info */}
      <div className="w-1/2 hidden lg:flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
        {/* Gradient Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          {/* Title dengan Icon */}
          <div className="mb-12">
            {/* Icon di atas judul */}
            <div className="flex justify-center mb-6">
              <img 
                src={templateIcon}
                alt="Template Icon"
                className="h-24 w-24 object-contain drop-shadow-lg"
              />
            </div>
            <h2 className="text-5xl font-bold mb-3">Template React 19</h2>
            <p className="text-blue-100 text-xl">Management Information System</p>
          </div>

          {/* Illustration Card */}
          <Card 
            shadow="xl" 
            padding="lg" 
            rounded="xl" 
            className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 mb-8"
          >
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-8 flex items-center justify-center min-h-72">
              {/* Placeholder untuk Illustration */}
              <div className="text-center">
                <div className="text-6xl mb-4">👔</div>
                <p className="text-gray-500 font-medium">Illustration</p>
                <p className="text-gray-400 text-sm mt-1">Management Dashboard</p>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-blue-100">Dashboard</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-blue-100">Users</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="text-blue-100">Settings</p>
            </div>
          </div>

          {/* Info Badge */}
          <div className="mt-8 flex items-center justify-center gap-3 text-blue-100">
            <div className="w-10 h-10 border-2 border-blue-200 rounded-full flex items-center justify-center text-lg font-bold">
              ℹ️
            </div>
            <span className="text-sm max-w-xs">Login dengan akun yang sudah terdaftar untuk mengakses sistem</span>
          </div>
        </div>
      </div>
    </div>
  );
}