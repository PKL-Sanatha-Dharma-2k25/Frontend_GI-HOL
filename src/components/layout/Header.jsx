import { useAuth } from '@/hooks/useAuth'
import { LogOut, ChevronDown, Clock } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import icon from '@/assets/icons/icon.png'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
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

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

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
    <>
      <style>{`
        @keyframes scrollRight {
          0% {
            left: 100%;
          }
          100% {
            left: -100%;
          }
        }

        .marquee-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 20px;
          white-space: nowrap;
          animation: scrollRight 40s linear infinite;
          font-weight: 500;
          letter-spacing: 0.05em;
          background: linear-gradient(90deg, #1e293b 0%, #475569 50%, #1e293b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }

        .marquee-container:hover .marquee-text {
          animation-play-state: paused;
        }
      `}</style>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200/60 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sm:justify-end h-16 sm:h-[88px] relative overflow-hidden marquee-container">
        
        {/* Mobile Only - Show Username */}
        <div className="sm:hidden text-left z-10 relative">
          <p className="text-sm font-semibold text-slate-900 truncate">{user?.username}</p>
          <p className="text-xs text-slate-500 -mt-0.5">Active</p>
        </div>

        {/* Marquee - Hidden on Mobile, Show on Desktop */}
        <div className="hidden sm:block absolute left-0 right-0 top-0 bottom-0 overflow-hidden" style={{ width: 'calc(100% - 320px)' }}>
          <div className="marquee-text">
            <img src={icon} alt="icon" className="w-5 h-5 flex-shrink-0" />
            Quality In Every Single Stitch
          </div>
          <div className="marquee-text" style={{ animation: 'scrollRight 40s linear infinite 0s' }}>
            <img src={icon} alt="icon" className="w-5 h-5 flex-shrink-0" />
            Quality In Every Single Stitch
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 relative z-10">
          
          {/* Quick Status - Hidden on Mobile */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 bg-slate-50/60 rounded-lg border border-slate-200/60 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-medium whitespace-nowrap">Active</span>
            </div>
            <div className="w-px h-4 bg-slate-200/50"></div>
            <div className="hidden lg:flex items-center gap-1.5">
              <Clock size={14} className="text-slate-500 flex-shrink-0" />
              <span className="text-slate-600 whitespace-nowrap">{currentTime}</span>
            </div>
          </div>

          {/* User Menu Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 pl-2.5 sm:pl-3 lg:pl-4 pr-1 sm:pr-2 py-1.5 border-l border-slate-200 hover:bg-slate-50 rounded-lg transition-all duration-300"
            >
              {/* Desktop Only - User Details */}
              <div className="hidden sm:flex flex-col items-end text-xs sm:text-sm">
                <p className="font-semibold text-slate-900 leading-tight">{user?.username}</p>
                <p className="text-slate-500 leading-tight">Active</p>
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0 shadow-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown Icon */}
              <ChevronDown 
                size={16} 
                className={`hidden sm:block text-slate-600 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/80 rounded-xl shadow-lg z-50 overflow-hidden">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                  <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">Logged in as</p>
                  <p className="text-sm font-bold text-slate-900 mt-1 truncate">{user?.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-slate-600">
                      {role === 'superadmin'
                        ? 'Superadmin'
                        : role === 'admin'
                        ? 'Admin'
                        : role === 'supervisor'
                        ? 'Supervisor'
                        : 'User'}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 transition text-left text-sm font-medium border-t border-slate-200/50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}