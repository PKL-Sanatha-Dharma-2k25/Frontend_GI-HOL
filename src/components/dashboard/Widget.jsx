import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Widget({ 
  title = '', 
  content = '', 
  icon = '',
  action = null,
  variant = 'default', // default, gradient, minimal, highlighted
  color = 'blue', // blue, green, purple, orange
  showBadge = true,
  badge = null,
  onClick = null,
  hoverable = true
}) {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    blue: {
      gradient: 'from-blue-50 to-blue-100/50',
      accent: 'bg-blue-100 text-blue-700',
      border: 'border-blue-200',
      button: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
      badge: 'bg-blue-100 text-blue-700',
      icon: 'text-blue-600'
    },
    green: {
      gradient: 'from-green-50 to-green-100/50',
      accent: 'bg-green-100 text-green-700',
      border: 'border-green-200',
      button: 'text-green-600 hover:text-green-700 hover:bg-green-50',
      badge: 'bg-green-100 text-green-700',
      icon: 'text-green-600'
    },
    purple: {
      gradient: 'from-purple-50 to-purple-100/50',
      accent: 'bg-purple-100 text-purple-700',
      border: 'border-purple-200',
      button: 'text-purple-600 hover:text-purple-700 hover:bg-purple-50',
      badge: 'bg-purple-100 text-purple-700',
      icon: 'text-purple-600'
    },
    orange: {
      gradient: 'from-orange-50 to-orange-100/50',
      accent: 'bg-orange-100 text-orange-700',
      border: 'border-orange-200',
      button: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50',
      badge: 'bg-orange-100 text-orange-700',
      icon: 'text-orange-600'
    }
  };

  const colors = colorMap[color] || colorMap.blue;

  const variantClass = {
    default: `bg-white border border-gray-200`,
    gradient: `bg-gradient-to-br ${colors.gradient} border ${colors.border}`,
    minimal: `bg-transparent border-b-2 border-gray-200`,
    highlighted: `bg-gradient-to-br from-yellow-50 to-orange-50/30 border border-yellow-200`
  }[variant];

  const baseClass = `h-full flex flex-col rounded-xl p-6 transition-all duration-300 ${variantClass} ${
    hoverable ? 'hover:shadow-lg' : ''
  } ${onClick ? 'cursor-pointer' : ''} ${isHovered ? 'shadow-lg' : 'shadow-sm'}`;

  return (
    <div
      className={baseClass}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => hoverable && setIsHovered(false)}
      onClick={onClick}
    >
      {/* Header Section */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          {/* Title & Badge */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {badge && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                {badge}
              </span>
            )}
          </div>

          {/* Icon Section */}
          {icon && (
            <div className={`text-4xl mt-3 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
              {icon}
            </div>
          )}
        </div>

        {/* Optional Icon Badge */}
        {showBadge && icon && (
          <div className={`w-12 h-12 ${colors.accent} rounded-lg flex items-center justify-center text-2xl transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Content Section */}
      <p className="text-gray-600 text-sm flex-1 leading-relaxed">{content}</p>

      {/* Action Section */}
      <div className="mt-6 pt-4 border-t border-gray-200/50">
        {action ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              action.onClick?.();
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${colors.button}`}
          >
            <span>{action.label}</span>
            <ArrowRight 
              size={16} 
              className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
            />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles size={14} className={colors.icon} />
            <span>Ready to use</span>
          </div>
        )}
      </div>

      {/* Hover Effect Line */}
      {hoverable && (
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} rounded-b-xl opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
      )}
    </div>
  );
}