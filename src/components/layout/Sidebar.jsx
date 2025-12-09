// src/components/layout/Sidebar.jsx
import { LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ 
  open = true,
  menuItems = [],
  activeMenu = '',
  onMenuClick = () => {},
  onLogout = () => {},
  logo = { text: 'MIS', icon: '📊' }
}) {
  const [expandedItems, setExpandedItems] = useState({});

  const getIcon = (iconName) => {
    const icons = {
      'BarChart3': '📊',
      'Users': '👥',
      'FileText': '📄',
      'TrendingUp': '📈',
      'Settings': '⚙️',
      'Home': '🏠',
      'Dashboard': '📊',
      'Reports': '📊',
      'Analytics': '📈',
    };
    return icons[iconName] || '•';
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div
      className={`${
        open ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 fixed h-full z-40 flex flex-col shadow-lg`}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-gray-700">
        <div className={`flex items-center gap-3 ${!open && 'justify-center w-full'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-xl font-bold">
            {logo.icon || 'MIS'}
          </div>
          {open && <span className="font-bold text-lg">{logo.text || 'Dashboard'}</span>}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isExpanded = expandedItems[item.id];
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isActive = activeMenu === item.id || item.submenu?.some(sub => sub.id === activeMenu);

          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              <button
                onClick={() => {
                  onMenuClick(item);
                  if (hasSubmenu) {
                    toggleExpanded(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                title={!open ? item.label : ''}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl flex-shrink-0">{getIcon(item.icon)}</span>
                  {open && <span className="font-medium text-left">{item.label}</span>}
                </div>
                {open && hasSubmenu && (
                  <ChevronDown 
                    size={18} 
                    className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {/* Submenu Items */}
              {open && hasSubmenu && isExpanded && (
                <div className="ml-4 mt-2 space-y-1 border-l border-gray-600 pl-2">
                  {item.submenu.map((subitem) => (
                    <button
                      key={subitem.id}
                      onClick={() => onMenuClick(subitem)}
                      className={`w-full text-left px-4 py-2 rounded text-sm transition-all ${
                        activeMenu === subitem.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      }`}
                    >
                      {subitem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
          title="Logout"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {open && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
