import { 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Map,
  ShoppingBag,
  Clock,
  Users,
  Menu,
  X,
  Pin
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/context/SidebarContext'

import logo from '@/assets/logo/logo.png'
import icon from '@/assets/icons/icon.png'

export default function Sidebar({ 
  logoUrl = logo,
  iconUrl = icon
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { sidebarHovered, setSidebarHovered } = useSidebar()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarPinned, setSidebarPinned] = useState(false)

  // ⭐ NORMALIZE ROLE - FIXED PRIORITY ORDER (SUPERADMIN CHECK FIRST)
  const rawRole = user?.role
  const role = (() => {
    if (!rawRole) return null
    const r = String(rawRole).toLowerCase().trim()
    
    // ⭐ PRIORITY 1: Check SUPERADMIN DULU (most specific)
    if (r.includes('superadmin') || r === '1') return 'superadmin'
    
    // ⭐ PRIORITY 2: Then check ADMIN
    if (r.includes('admin') || r === '2') return 'admin'
    
    // ⭐ PRIORITY 3: Then check SUPERVISOR
    if (r.includes('supervisor') || r === '3' || r === '4') return 'supervisor'
    
    return null
  })()

  console.log('🎯 [Sidebar] Role detected:', role, '(raw:', rawRole, ')')

  const [expandedItems, setExpandedItems] = useState({})
  const [activeMenu, setActiveMenu] = useState('dashboard')

  // ⭐ DETERMINE ACTIVE MENU BASED ON CURRENT PATH
  useEffect(() => {
    const pathMenuMap = {
      '/': 'dashboard',
      '/dashboard': 'dashboard',
      '/hourly-output': 'hourly-output',
      '/line': 'line',
      '/operation-breakdown': 'operation-breakdown',
      '/users': 'users'
    }
    setActiveMenu(pathMenuMap[location.pathname] || 'dashboard')
  }, [location.pathname])

  // ⭐ BUILD MENU BASED ON ROLE
  const getMenuItems = () => {
    const baseMenu = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/dashboard',
        submenu: []
      }
    ]

    // ⭐ SUPERVISOR MENU
    if (role === 'supervisor') {
      console.log('📌 Building SUPERVISOR menu')
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          path: '/dashboard',
          submenu: []
        },
        {
          id: 'hourly-output',
          label: 'Hourly Output',
          icon: 'hourly-output',
          path: '/hourly-output',
          submenu: []
        }
      ]
    }

    // ⭐ ADMIN MENU (WITH USER MANAGEMENT)
    if (role === 'admin') {
      console.log('📌 Building ADMIN menu')
      return [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', submenu: [] },
        { id: 'line', label: 'Line', icon: 'line', path: '/line', submenu: [] },
        { id: 'operation-breakdown', label: 'Operation Breakdown', icon: 'operation-breakdown', path: '/operation-breakdown', submenu: [] },
        { id: 'hourly-output', label: 'Hourly Output', icon: 'hourly-output', path: '/hourly-output', submenu: [] },
        {
          id: 'users',
          label: 'User Management',
          icon: 'users',
          path: '/users',
          submenu: [
            { id: 'users-list', label: 'All Users', path: '/users' },
            { id: 'users-add', label: 'Add User', path: '/users?action=add' }
          ]
        }
      ]
    }

    // ⭐ SUPERADMIN MENU (FULL)
    if (role === 'superadmin') {
      console.log('📌 Building SUPERADMIN menu')
      return [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', submenu: [] },
        { id: 'line', label: 'Line', icon: 'line', path: '/line', submenu: [] },
        { id: 'operation-breakdown', label: 'Operation Breakdown', icon: 'operation-breakdown', path: '/operation-breakdown', submenu: [] },
        { id: 'hourly-output', label: 'Hourly Output', icon: 'hourly-output', path: '/hourly-output', submenu: [] },
        {
          id: 'users',
          label: 'User Management',
          icon: 'users',
          path: '/users',
          submenu: [
            { id: 'users-list', label: 'All Users', path: '/users' },
            { id: 'users-add', label: 'Add User', path: '/users?action=add' }
          ]
        }
      ]
    }

    // ⭐ DEFAULT MENU
    console.log('📌 Building DEFAULT menu')
    return baseMenu
  }

  const menuItems = getMenuItems()

  const getIcon = (iconName) => {
    const icons = {
      dashboard: <LayoutDashboard size={20} />,
      line: <Map size={20} />,
      'operation-breakdown': <ShoppingBag size={20} />,
      'hourly-output': <Clock size={20} />,
      users: <Users size={20} />
    }
    return icons[iconName] || <LayoutDashboard size={20} />
  }

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleMenuClick = (item) => {
    if (item.submenu?.length) toggleExpanded(item.id)
    if (item.path) {
      navigate(item.path)
      setMobileMenuOpen(false)
    }
  }

  const handleSubMenuClick = (sub) => {
    if (sub.path) navigate(sub.path)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    console.log('🚪 [Sidebar] Logout clicked')
    logout()
    navigate('/login', { replace: true })
  }

  // ⭐ DETERMINE IF SIDEBAR SHOULD BE EXPANDED
  const isSidebarExpanded = sidebarPinned || sidebarHovered

  return (
    <>
      {/* 🖥️ DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        {/* Hover Trigger Area */}
        <div
          className="fixed left-0 top-0 h-full w-1 z-20 hover:w-20 transition-all duration-300 cursor-pointer"
          onMouseEnter={() => !sidebarPinned && setSidebarHovered(true)}
          onMouseLeave={() => !sidebarPinned && setSidebarHovered(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={`
            fixed top-0 left-0 h-full z-40 
            bg-white transition-all duration-300
            flex-col shadow-xl border-r border-gray-100
            ${isSidebarExpanded ? 'w-72 translate-x-0' : 'w-20 translate-x-0'}
            flex
          `}
          onMouseEnter={() => !sidebarPinned && setSidebarHovered(true)}
          onMouseLeave={() => !sidebarPinned && setSidebarHovered(false)}
        >
          {/* Logo & Pin Button */}
          <div className="px-4 py-6 flex items-center justify-between border-b h-[88px]">
            <div className="flex-1 h-full flex items-center justify-center">
              {isSidebarExpanded ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load:', logoUrl)
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <img 
                  src={iconUrl} 
                  alt="Icon" 
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    console.error('Icon failed to load:', iconUrl)
                    e.target.style.display = 'none'
                  }}
                />
              )}
            </div>

            {isSidebarExpanded && (
              <button
                onClick={() => setSidebarPinned(!sidebarPinned)}
                className="p-1 hover:bg-gray-100 rounded transition flex-shrink-0"
                title={sidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
              >
                <Pin 
                  size={18} 
                  className={`text-gray-600 transition-transform ${sidebarPinned ? 'rotate-45' : ''}`}
                />
              </button>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {menuItems.map(item => {
              const isActive = activeMenu === item.id
              const expanded = expandedItems[item.id]

              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={!isSidebarExpanded ? item.label : ''}
                  >
                    <span className="flex-shrink-0">{getIcon(item.icon)}</span>
                    {isSidebarExpanded && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        {item.submenu?.length > 0 && (
                          <ChevronDown 
                            size={16} 
                            className={`flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </>
                    )}
                  </button>

                  {/* Submenu */}
                  {item.submenu?.length > 0 && expanded && isSidebarExpanded && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.submenu.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubMenuClick(sub)}
                          className="w-full text-left px-3 py-2 text-xs rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-3 py-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
              title={!isSidebarExpanded ? 'Logout' : ''}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isSidebarExpanded && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>

        {/* Content Spacing */}
        <div className={`transition-all duration-300 ${isSidebarExpanded ? 'w-72' : 'w-20'}`} />
      </div>

      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 shadow-sm z-40 flex items-center justify-between px-4">
        <img 
          src={iconUrl} 
          alt="Logo" 
          className="h-8 w-8 object-contain"
          onError={(e) => {
            console.error('Mobile logo failed:', iconUrl)
            e.target.style.display = 'none'
          }}
        />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {mobileMenuOpen ? (
            <X size={24} className="text-gray-600" />
          ) : (
            <Menu size={24} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* 📱 MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 top-16"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 📱 MOBILE SIDEBAR */}
      <div 
        className={`md:hidden fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-white shadow-lg z-30 transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="px-3 py-6 space-y-1">
          {menuItems.map(item => {
            const isActive = activeMenu === item.id
            const expanded = expandedItems[item.id]

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex-shrink-0">{getIcon(item.icon)}</span>
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  {item.submenu?.length > 0 && (
                    <ChevronDown 
                      size={16} 
                      className={`flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                    />
                  )}
                </button>

                {item.submenu?.length > 0 && expanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.submenu.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubMenuClick(sub)}
                        className="w-full text-left px-3 py-2 text-xs rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="px-3 py-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Spacing */}
      <div className="md:hidden h-16" />
    </>
  )
}