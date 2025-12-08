import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({
  trigger,
  items = [],
  align = 'left',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignStyles = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
      >
        {trigger}
        <ChevronDown size={16} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`
            absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50
            ${alignStyles[align]}
          `}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
