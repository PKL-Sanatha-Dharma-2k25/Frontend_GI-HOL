import { ChevronRight, Home } from 'lucide-react';

export default function BreadCrumb({ 
  items = [],
  showHome = true,
  homeHref = '#'
}) {
  return (
    <nav className="flex items-center gap-0.5">
      {/* Home Icon */}
      {showHome && (
        <>
          <a 
            href={homeHref}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 group"
            title="Home"
          >
            <Home size={18} className="transition-transform group-hover:scale-110" />
          </a>
          {items.length > 0 && <ChevronRight size={18} className="text-gray-300 mx-1" />}
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-0.5">
          {/* Item Content */}
          {item.href ? (
            <a 
              href={item.href}
              className={`px-3 py-1.5 rounded-lg transition-all duration-300 text-sm font-medium group ${
                item.active 
                  ? 'bg-blue-100 text-blue-700 cursor-default' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                {item.label}
              </span>
            </a>
          ) : (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              item.active 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600'
            }`}>
              <span className="flex items-center gap-1.5">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                {item.label}
              </span>
            </span>
          )}

          {/* Separator - Show if not last item */}
          {index < items.length - 1 && (
            <ChevronRight size={18} className="text-gray-300 mx-1 transition-all duration-300" />
          )}
        </div>
      ))}
    </nav>
  );
}