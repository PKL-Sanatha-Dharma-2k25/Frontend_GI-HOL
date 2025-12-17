import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function DeleteModal({
  isOpen = false,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  onConfirm = () => {},
  onCancel = () => {},
  isLoading = false,
  danger = true,
}) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleCancel = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onCancel();
      setIsAnimatingOut(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black transition-all duration-300 flex items-center justify-center z-50 ${
      isAnimatingOut ? 'bg-opacity-0' : 'bg-opacity-50'
    }`}>
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transition-all duration-300 transform ${
        isAnimatingOut 
          ? 'opacity-0 scale-95 translate-y-4' 
          : 'opacity-100 scale-100 translate-y-0 animate-modalSlideIn'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Warning Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center animate-iconBounce">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-700 text-center mb-4 text-sm leading-relaxed font-medium">
            {message}
          </p>

          {/* Item Name */}
          {itemName && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 text-center mb-4 border border-red-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">Item to delete:</p>
              <p className="text-sm font-bold text-red-600 break-words">{itemName}</p>
            </div>
          )}

          {/* Warning Text */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded p-3 mb-6">
            <p className="text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertTriangle size={16} />
              This action cannot be undone!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              danger
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
            }`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isLoading ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.05);
          }
        }

        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-iconBounce {
          animation: iconBounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}