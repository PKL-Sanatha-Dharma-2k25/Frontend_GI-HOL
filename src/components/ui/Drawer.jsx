import { X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  overlay = true,
}) {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positions = {
    left: 'left-0',
    right: 'right-0',
  };

  const sizes = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    full: 'w-screen',
  };

  return (
    <>
      {overlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        ref={drawerRef}
        className={`
          fixed top-0 ${positions[position]} h-full ${sizes[size]} bg-white shadow-2xl z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : (position === 'left' ? '-translate-x-full' : 'translate-x-full')}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 70px)' }}>
          {children}
        </div>
      </div>
    </>
  );
}
