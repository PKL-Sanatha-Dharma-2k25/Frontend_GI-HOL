
export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  icon: Icon = null,
  loading = false,
  className = '',
  ...props 
}) {
  const baseStyles = 'font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center gap-2 justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-500 disabled:opacity-50',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500 disabled:opacity-50',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg focus:ring-red-500 disabled:opacity-50',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg focus:ring-green-500 disabled:opacity-50',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-md hover:shadow-lg focus:ring-yellow-500 disabled:opacity-50',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:opacity-50',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {Icon && !loading && <Icon size={20} />}
      {children}
    </button>
  );
}