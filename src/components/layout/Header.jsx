// src/components/layout/Header.jsx
import { Menu, X, Bell, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header({
  title = 'Dashboard',
  onToggleSidebar = () => {},
  sidebarOpen = true,
  user = {},
  onLogout = () => {},
  notificationCount = 0
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="bg-white shadow-md sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Notifications">
            <Bell size={24} className="text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
            </div>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transition-shadow"
            >
              {user?.name?.charAt(0) || 'A'}
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute top-14 right-0 bg-white rounded-lg shadow-lg border border-gray-200 w-48 z-50">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg">
                  Profile
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  Settings
                </a>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg border-t border-gray-200 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
