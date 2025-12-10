import { 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Users,
  FileText,
  TrendingUp,
  Settings,
  BarChart3,
  Eye,
  PieChart,
  LineChart,
  UserPlus,
  Shield,
  Bell,
  Download,
  TrendingDown,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar({ 
  open = true,
  menuItems = [],
  activeMenu = '',
  onMenuClick = () => {},
  onLogout = () => {},
  logoUrl = '/src/assets/logo/logo.png'
}) {
  const [expandedItems, setExpandedItems] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      'dashboard': <LayoutDashboard size={20} />,
      'users': <Users size={20} />,
      'reports': <FileText size={20} />,
      'analytics': <TrendingUp size={20} />,
      'settings': <Settings size={20} />,
      'overview': <Eye size={20} />,
      'statistics': <PieChart size={20} />,
      'all-users': <Users size={20} />,
      'add-user': <UserPlus size={20} />,
      'roles': <Shield size={20} />,
      'sales-report': <BarChart3 size={20} />,
      'activity-report': <LineChart size={20} />,
      'export': <Download size={20} />,
      'performance': <TrendingUp size={20} />,
      'trends': <TrendingDown size={20} />,
      'conversion': <PieChart size={20} />,
      'general': <Settings size={20} />,
      'security': <Shield size={20} />,
      'notifications': <Bell size={20} />,
    };
    return icons[iconName] || <BarChart3 size={20} />;
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleMenuClick = (item) => {
    onMenuClick(item);
    // Auto close mobile sidebar after menu click
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Visible only on mobile */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 hover:bg-gray-100 rounded-lg transition-all md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile Overlay - Visible only on mobile */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed' : 'static'}
          ${isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          top-0 left-0 h-full z-40
          ${open ? 'w-72' : 'w-24'}
          bg-white text-gray-900
          transition-all duration-300
          flex flex-col shadow-xl border-r border-gray-100 overflow-hidden
        `}
      >
        {/* Accent Top Bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 shadow-md"></div>

        {/* Logo Section */}
        <div className="px-4 py-8 flex items-center justify-center border-b border-gray-100 flex-shrink-0 group hover:opacity-80 transition-opacity duration-300">
          <img 
            src={logoUrl} 
            alt="Logo" 
            className={`h-auto object-contain transition-all duration-300 transform group-hover:scale-105 ${open ? 'max-w-[240px]' : 'max-w-[60px]'}`}
          />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isExpanded = expandedItems[item.id];
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isActive = activeMenu === item.id || item.submenu?.some(sub => sub.id === activeMenu);
            const isHovered = hoveredItem === item.id;

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => {
                    handleMenuClick(item);
                    if (hasSubmenu) {
                      toggleExpanded(item.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-md'
                      : 'text-gray-600'
                  }`}
                  title={!open ? item.label : ''}
                >
                  {/* Left border accent untuk active state */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600"></div>
                  )}

                  {/* Animated background */}
                  {!isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-60' : ''}`}></div>
                  )}

                  <div className="flex items-center gap-3 flex-1 relative z-10">
                    <span className={`flex-shrink-0 transition-all duration-500 transform ${
                      isActive ? 'text-blue-600' : ''
                    } ${isHovered && !isActive ? 'scale-125 text-blue-500 rotate-12' : ''}`}>
                      {getIcon(item.id)}
                    </span>
                    {open && (
                      <span className={`font-medium text-sm transition-all duration-300 transform ${
                        isHovered && !isActive ? 'translate-x-1' : ''
                      } ${isActive ? 'text-blue-600 font-semibold' : ''}`}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {open && hasSubmenu && (
                    <ChevronDown 
                      size={16} 
                      className={`flex-shrink-0 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-blue-600' : ''} relative z-10`}
                    />
                  )}
                </button>

                {/* Submenu Items */}
                {open && hasSubmenu && isExpanded && (
                  <div className="ml-4 mt-2 space-y-1 border-l-2 border-blue-200 pl-3 animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.submenu.map((subitem, idx) => (
                      <button
                        key={subitem.id}
                        onClick={() => handleMenuClick(subitem)}
                        onMouseEnter={() => setHoveredItem(`sub-${subitem.id}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group overflow-hidden ${
                          activeMenu === subitem.id
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                        style={{
                          transitionDelay: `${idx * 30}ms`
                        }}
                      >
                        {/* Submenu background effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                        
                        <span className="relative z-10 flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                          <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            activeMenu === subitem.id ? 'bg-blue-600 scale-125' : 'bg-gray-300 group-hover:bg-blue-400'
                          }`}></span>
                          {subitem.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0">
          <button 
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 group relative overflow-hidden ${
              open
                ? 'text-gray-600'
                : 'justify-center text-gray-600'
            }`}
            title="Logout"
          >
            {/* Animated background for logout */}
            <div className={`absolute inset-0 bg-gradient-to-r from-red-50 via-red-100 to-transparent opacity-0 transition-opacity duration-300 ${hoveredItem === 'logout' ? 'opacity-60' : ''}`}></div>
            
            <LogOut size={18} className={`flex-shrink-0 transition-all duration-300 transform relative z-10 ${
              hoveredItem === 'logout' ? 'scale-125 text-red-600 rotate-12' : ''
            }`} />
            {open && (
              <span className={`transition-all duration-300 relative z-10 ${
                hoveredItem === 'logout' ? 'text-red-600 translate-x-1' : ''
              }`}>
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}