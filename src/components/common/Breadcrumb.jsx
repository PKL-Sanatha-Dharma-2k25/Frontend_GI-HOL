import { ChevronRight, Home } from 'lucide-react';

export default function BreadCrumb({ 
  items = [],
  showHome = true,
  homeHref = '/dashboard'
}) {
  return (
    <nav className="flex items-center gap-1 px-2 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm animate-slideDown" role="navigation" aria-label="Breadcrumb">
      {/* Home Icon */}
      {showHome && (
        <>
          <a 
            href={homeHref}
            className="p-2 hover:bg-white rounded-lg transition-all duration-300 text-gray-600 hover:text-blue-600 group hover:shadow-sm active:scale-95"
            title="Home"
            aria-label="Go to home"
          >
            <Home 
              size={18} 
              className="transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" 
            />
          </a>
          {items.length > 0 && (
            <ChevronRight 
              size={18} 
              className="text-gray-300 mx-0.5 animate-pulse" 
            />
          )}
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1 group">
          {/* Item Content */}
          {item.href ? (
            <a 
              href={item.href}
              className={`px-3 py-1.5 rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-2 group/link ${
                item.active 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm'
              } active:scale-95`}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.icon && (
                <span className="text-lg group-hover/link:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </a>
          ) : (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
              item.active 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600'
            }`}>
              {item.icon && (
                <span className="text-lg">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </span>
          )}

          {/* Separator */}
          {index < items.length - 1 && (
            <ChevronRight 
              size={18} 
              className="text-gray-300 mx-0.5 transition-all duration-300 group-hover:text-blue-300" 
            />
          )}
        </div>
      ))}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}