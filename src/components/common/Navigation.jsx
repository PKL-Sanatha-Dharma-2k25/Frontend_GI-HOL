import { useState } from 'react';

export default function Navigation({
  items = [],
  active = null,
  onSelect = () => { },
  vertical = false
}) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <nav
      className={`flex gap-6 ${vertical ? 'flex-col' : 'flex-row'} border-b-2 border-gray-200 pb-0 relative animate-navSlideDown`}
      role="tablist"
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          className={`relative px-4 py-3 font-semibold transition-all duration-300 text-base whitespace-nowrap group ${active === item.id
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
            }`}
          role="tab"
          aria-selected={active === item.id}
          style={{
            animationDelay: `${index * 0.05}s`
          }}
        >
          {/* Animated Underline */}
          <span className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg transition-all duration-300 transform origin-left ${active === item.id
              ? 'scale-x-100 opacity-100'
              : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50'
            }`} />

          {/* Text with Smooth Color Transition */}
          <span className="relative z-10 flex items-center gap-2">
            {item.icon && (
              <span className={`transition-transform duration-300 ${active === item.id || hoveredId === item.id
                  ? 'scale-110'
                  : 'scale-100'
                }`}>
                {item.icon}
              </span>
            )}
            {item.label}
          </span>

          {/* Glow Effect on Hover */}
          {hoveredId === item.id && active !== item.id && (
            <span className="absolute inset-0 bg-blue-100 rounded-lg opacity-5 animate-pulse" />
          )}
        </button>
      ))}

      {/* Animated Background Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30" />

      <style>{`
        @keyframes navSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-navSlideDown {
          animation: navSlideDown 0.4s ease-out;
        }

        button {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}