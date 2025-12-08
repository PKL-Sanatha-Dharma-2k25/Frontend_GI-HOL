import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  error,
  disabled = false,
  icon: Icon = null,
  showPasswordToggle = false,
  hint,
  required = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition">
            <Icon size={20} />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition duration-200
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            placeholder:text-gray-400
            ${Icon ? 'pl-10' : ''}
            ${showPasswordToggle && type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'}
          `}
          {...props}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
          <AlertCircle size={16} />
          <p>{error}</p>
        </div>
      )}
      {hint && !error && (
        <p className="text-gray-500 text-sm mt-1">{hint}</p>
      )}
    </div>
  );
}