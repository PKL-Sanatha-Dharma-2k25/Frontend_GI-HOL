import { useAuth } from '@/hooks/useAuth'
import { Bell, LogOut, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const userDropdownRef = useRef(null)

  const rawRole = user?.role

  const role = (() => {
    if (!rawRole) return null
    const r = rawRole.toString().toLowerCase().trim()
    if (r === '3' || r === 'supervisor') return 'supervisor'
    if (r === '2' || r === 'admin') return 'admin'
    if (r === '1' || r === 'superadmin' || r === 'role_superadmin') return 'superadmin'
    return null
  })()

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setUserDropdownOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sm:justify-end h-16 sm:h-[88px]">
      {/* Mobile Only - Show Username */}
      <div className="sm:hidden text-left">
        <p className="text-sm font-semibold text-gray-900 truncate">{user?.username}</p>
      </div>

      {/* Notification & User Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Bell size={18} className="sm:w-5 sm:h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 pl-3 sm:pl-4 border-l border-gray-200 hover:opacity-80 transition"
          >
            {/* Desktop Only - User Details */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown Icon */}
            <ChevronDown 
              size={16} 
              className={`hidden sm:block text-gray-600 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b bg-blue-50">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.username}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {role === 'superadmin'
                    ? 'Superadmin'
                    : role === 'admin'
                    ? 'Admin'
                    : role === 'supervisor'
                    ? 'Supervisor'
                    : 'User'}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 transition text-left text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}