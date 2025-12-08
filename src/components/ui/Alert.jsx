

import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function Alert({
  type = 'info',
  title,
  message,
  dismissible = true,
  onClose,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const styles = {
    info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
    success: 'bg-green-50 border-l-4 border-green-500 text-green-900',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900',
    error: 'bg-red-50 border-l-4 border-red-500 text-red-900',
  };

  const icons = {
    info: <Info size={20} className="text-blue-600" />,
    success: <CheckCircle size={20} className="text-green-600" />,
    warning: <AlertTriangle size={20} className="text-yellow-600" />,
    error: <AlertCircle size={20} className="text-red-600" />,
  };

  return (
    <div className={`${styles[type]} p-4 rounded-lg flex items-start gap-3 ${className}`}>
      {icons[type]}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      {dismissible && (
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
