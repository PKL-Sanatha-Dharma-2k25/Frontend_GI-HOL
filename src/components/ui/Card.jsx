export default function Card({
  children,
  className = '',
  shadow = 'md',
  padding = 'md',
  rounded = 'lg',
  border = false,
  borderColor = 'gray-200',
  hoverEffect = false,
  gradient = false,
  overlay = false,
  divider = false,
  header = null,
  footer = null,
  icon = null,
  badge = null,
  interactive = false,
  onClick = null,
  ...props
}) {
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const roundeds = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  const borderStyles = {
    'gray-200': 'border-gray-200',
    'blue-200': 'border-blue-200',
    'purple-200': 'border-purple-200',
    'red-200': 'border-red-200',
    'green-200': 'border-green-200',
  };

  const baseStyles = `
    bg-white 
    ${shadows[shadow] || shadows.md}
    ${paddings[padding] || paddings.md}
    ${roundeds[rounded] || roundeds.lg}
    ${border ? `border ${borderStyles[borderColor] || borderStyles['gray-200']}` : ''}
    transition-all duration-300
    relative
    overflow-hidden
    ${interactive ? 'cursor-pointer' : ''}
  `;

  const hoverStyles = hoverEffect || interactive ? `
    hover:shadow-2xl 
    hover:shadow-gray-300/50
    ${interactive ? 'hover:scale-105 hover:-translate-y-1' : ''}
  ` : '';

  const gradientStyle = gradient ? 'bg-gradient-to-br from-white via-white to-gray-50' : '';

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .card-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0)
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .card-container {
          animation: slideUp 0.4s ease-out;
        }

        .card-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          animation: slideUp 0.5s ease-out 0.2s backwards;
        }

        .card-icon {
          animation: slideUp 0.5s ease-out 0.1s backwards;
        }

        .card-divider {
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
          height: 1px;
          margin: 1rem 0;
        }
      `}</style>

      <div
        className={`${baseStyles} ${hoverStyles} ${gradientStyle} ${className}`}
        onClick={onClick}
        {...props}
      >
        {/* Overlay Effect */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
        )}

        {/* Badge */}
        {badge && (
          <div className="card-badge">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
              {badge}
            </span>
          </div>
        )}

        {/* Header */}
        {header && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              {icon && (
                <div className="card-icon flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-lg">
                    {icon}
                  </div>
                </div>
              )}
              <div className="flex-1">
                {typeof header === 'string' ? (
                  <h3 className="text-lg font-bold text-gray-900">{header}</h3>
                ) : (
                  header
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Divider */}
        {divider && (
          <div className="card-divider" />
        )}

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
            {typeof footer === 'string' ? (
              <p>{footer}</p>
            ) : (
              footer
            )}
          </div>
        )}

        {/* Shimmer Effect on Hover */}
        {hoverEffect && (
          <div className="card-shimmer absolute inset-0 pointer-events-none opacity-0 hover:opacity-100" />
        )}
      </div>
    </>
  );
}