import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { useState, useRef } from 'react';

export default function BreadCrumb({ 
  items = [],
  showHome = true,
  homeHref = '/GI-HOL/dashboard'
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Mobile: jika items lebih dari 2, tampilkan menu collapsed
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldCollapse = isMobile && items.length > 2;
  const visibleItems = shouldCollapse ? items.slice(-1) : items;
  const hiddenItems = shouldCollapse ? items.slice(0, -1) : [];

  return (
    <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto" role="navigation" aria-label="Breadcrumb">
      {/* Home Icon */}
      {showHome && (
        <>
          <a 
            href={homeHref}
            className="text-gray-600 hover:text-blue-600 transition-colors flex-shrink-0"
            title="Home"
            aria-label="Go to home"
          >
            <Home size={18} />
          </a>
          {items.length > 0 && (
            <ChevronRight 
              size={16} 
              className="text-gray-300 flex-shrink-0" 
            />
          )}
        </>
      )}

      {/* Collapsed Menu - Mobile Only */}
      {shouldCollapse && hiddenItems.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-600 hover:text-blue-600 transition-colors flex-shrink-0 p-1"
            aria-label="Show more breadcrumbs"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 min-w-max"
            >
              {hiddenItems.map((item, index) => (
                <div key={index}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="block px-3 py-2 text-sm text-gray-600">
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <ChevronRight 
            size={16} 
            className="text-gray-300 flex-shrink-0" 
          />
        </div>
      )}

      {/* Breadcrumb Items */}
      {visibleItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* Item Content */}
          {item.href ? (
            <a 
              href={item.href}
              className="text-xs md:text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors truncate"
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </a>
          ) : (
            <span className="text-xs md:text-sm font-medium text-gray-600 truncate">
              {item.label}
            </span>
          )}

          {/* Separator */}
          {index < visibleItems.length - 1 && (
            <ChevronRight 
              size={16} 
              className="text-gray-300 flex-shrink-0" 
            />
          )}
        </div>
      ))}
    </nav>
  );
}