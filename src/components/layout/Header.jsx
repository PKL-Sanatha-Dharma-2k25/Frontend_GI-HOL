import { Bell, LogOut, Settings, User, Search, ChevronDown, Moon, Sun, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EnhancedHeader({
  title = 'Dashboard',
  user = {},
  onLogout = () => {},
  notificationCount = 3
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, message: 'New user registered', time: '2 minutes ago', icon: '👤', type: 'user' },
    { id: 2, message: 'Payment received', time: '15 minutes ago', icon: '💰', type: 'payment' },
    { id: 3, message: 'System update completed', time: '1 hour ago', icon: '⚙️', type: 'system' },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Toggle class pada html element
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div 
      className="border-b sticky top-0 z-30 shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4 gap-4">
        
        {/* Left Section - Title & Search */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="hidden sm:block">
            <h1 
              className="text-xl md:text-2xl font-bold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h1>
          </div>

          {/* Enhanced Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="w-full relative group">
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover:text-blue-500"
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                type="text"
                placeholder="Search users, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Date & Time Display */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2">
            <Clock size={18} style={{ color: 'var(--text-secondary)' }} />
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {currentTime.toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 md:gap-3 ml-auto">
          
          {/* Mobile Search */}
          <button 
            className="md:hidden p-2.5 rounded-lg transition-all"
            style={{ 
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent'
            }}
          >
            <Search size={20} />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: isDarkMode ? '#fbbf24' : '#f59e0b'
            }}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg transition-all duration-300 group"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)'
              }}
              title="Notifications"
            >
              <Bell size={20} className="transition-transform group-hover:scale-110" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-white text-xs font-bold shadow-lg animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div 
                className="absolute top-14 right-0 w-80 rounded-xl shadow-2xl border z-50 animate-in fade-in slide-in-from-top-2 duration-300 max-h-96 overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div 
                  className="px-4 py-4 border-b flex items-center justify-between flex-shrink-0"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <h3 
                    className="font-semibold text-base"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Notifications
                  </h3>
                  <span 
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
                      color: isDarkMode ? '#fca5a5' : '#dc2626'
                    }}
                  >
                    {notificationCount} New
                  </span>
                </div>
                
                <div className="overflow-y-auto max-h-80">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="px-4 py-3.5 border-b last:border-b-0 transition-colors cursor-pointer group"
                      style={{
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="text-lg p-2 rounded-lg"
                          style={{
                            backgroundColor: notif.type === 'user' 
                              ? (isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe')
                              : notif.type === 'payment' 
                              ? (isDarkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7')
                              : (isDarkMode ? 'rgba(147, 51, 234, 0.2)' : '#f3e8ff')
                          }}
                        >
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p 
                            className="text-sm font-medium group-hover:text-blue-500 transition-colors line-clamp-2"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {notif.message}
                          </p>
                          <p 
                            className="text-xs mt-1"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div 
                  className="px-4 py-3 text-center flex-shrink-0 border-t"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <button className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
                    View all →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 group border"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'transparent'
              }}
            >
              <div className="text-right hidden sm:block">
                <p 
                  className="text-sm font-semibold truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {user?.name || 'Admin'}
                </p>
                <p 
                  className="text-xs hidden md:block"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {user?.role || 'Administrator'}
                </p>
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 flex-shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>

              <ChevronDown 
                size={18} 
                className="hidden md:block transition-transform duration-300"
                style={{
                  color: 'var(--text-secondary)',
                  transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </button>

            {showUserMenu && (
              <div 
                className="absolute top-14 right-0 rounded-xl shadow-2xl border w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                
                <div 
                  className="px-4 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#f3e8ff'
                  }}
                >
                  <p 
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {user?.name || 'Admin User'}
                  </p>
                  <p 
                    className="text-xs mt-1 truncate"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>

                <div className="py-2">
                  <a 
                    href="#" 
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 group"
                    style={{
                      color: 'var(--text-primary)'
                    }}
                  >
                    <User 
                      size={18} 
                      className="flex-shrink-0 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                    <span className="text-sm font-medium">My Profile</span>
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 group"
                    style={{
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Settings 
                      size={18} 
                      className="flex-shrink-0 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                    <span className="text-sm font-medium">Settings</span>
                  </a>
                </div>

                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-medium transition-colors duration-200 group border-t"
                  style={{
                    color: '#dc2626',
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'transparent'
                  }}
                >
                  <LogOut size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}