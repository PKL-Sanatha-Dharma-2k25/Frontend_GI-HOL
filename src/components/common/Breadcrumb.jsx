import { ChevronRight, Home } from 'lucide-react';

export default function BreadCrumb({ 
  items = [],
  showHome = true,
  homeHref = '/GI-HOL/dashboard'
}) {
  return (
    <nav className="flex items-center gap-2" role="navigation" aria-label="Breadcrumb">
      {/* Home Icon */}
      {showHome && (
        <>
          <a 
            href={homeHref}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            title="Home"
            aria-label="Go to home"
          >
            <Home size={18} />
          </a>
          {items.length > 0 && (
            <ChevronRight 
              size={18} 
              className="text-gray-300" 
            />
          )}
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {/* Item Content */}
          {item.href ? (
            <a 
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {item.label}
            </span>
          )}

          {/* Separator */}
          {index < items.length - 1 && (
            <ChevronRight 
              size={18} 
              className="text-gray-300" 
            />
          )}
        </div>
      ))}
    </nav>
  );
}