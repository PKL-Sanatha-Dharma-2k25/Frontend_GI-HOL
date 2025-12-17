import { 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Map,
  ShoppingBag,
  Clock,
  Users,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/context/SidebarContext'

export default function Sidebar({ 
  logoUrl = '/src/assets/logo/logo.png',
  iconUrl = '/icon.PNG'
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { sidebarHovered, setSidebarHovered } = useSidebar()

  const rawRole = user?.role

  const role = (() => {
    if (!rawRole) return null
    const r = rawRole.toString().toLowerCase().trim()
    if (r === '3' || r === 'supervisor') return 'supervisor'
    if (r === '2' || r === 'admin') return 'admin'
    if (r === '1' || r === 'superadmin' || r === 'role_superadmin') return 'superadmin'
    return null
  })()

  const [expandedItems, setExpandedItems] = useState({})
  const [activeMenu, setActiveMenu] = useState('dashboard')

  useEffect(() => {
    const pathMenuMap = {
      '/': 'dashboard',
      '/dashboard': 'dashboard',
      '/line': 'line',
      '/operation-breakdown': 'operation-breakdown',
      '/hourly-output': 'hourly-output',
      '/users': 'users'
    }
    setActiveMenu(pathMenuMap[location.pathname] || 'dashboard')
  }, [location.pathname])

  const getMenuItems = () => {
    const menus = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/',
        submenu: []
      }
    ]

    if (role === 'superadmin') {
      menus.push(
        { id: 'line', label: 'Line', icon: 'line', path: '/line', submenu: [] },
        { id: 'operation-breakdown', label: 'Operation Breakdown', icon: 'operation-breakdown', path: '/operation-breakdown', submenu: [] },
        { id: 'hourly-output', label: 'Hourly Output', icon: 'hourly-output', path: '/hourly-output', submenu: [] },
        {
          id: 'users',
          label: 'User Management',
          icon: 'users',
          path: '/users',
          submenu: [
            { id: 'users', label: 'All Users', path: '/users' },
            { id: 'add-user', label: 'Add User', path: '/users?action=add' }
          ]
        }
      )
    }

    if (role === 'admin') {
      menus.push(
        { id: 'line', label: 'Line', icon: 'line', path: '/line', submenu: [] },
        { id: 'operation-breakdown', label: 'Operation Breakdown', icon: 'operation-breakdown', path: '/operation-breakdown', submenu: [] },
        { id: 'hourly-output', label: 'Hourly Output', icon: 'hourly-output', path: '/hourly-output', submenu: [] }
      )
    }

    if (role === 'supervisor') {
      menus.push(
        { id: 'hourly-output', label: 'Hourly Output', icon: 'hourly-output', path: '/hourly-output', submenu: [] }
      )
    }

    return menus
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
    if (item.path) navigate(item.path)
  }

  const handleSubMenuClick = (sub) => {
    if (sub.path) navigate(sub.path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Hover Trigger Area - untuk trigger sidebar saat cursor di edge kiri */}
      <div
        className="hidden md:block fixed left-0 top-0 h-full w-1 z-20 hover:w-20 transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      />

      {/* Sidebar */}
      <div
        className={`
          hidden md:flex
          fixed top-0 left-0 h-full z-40 
          bg-white transition-all duration-300
          flex-col shadow-xl border-r border-gray-100
          ${sidebarHovered ? 'w-72 translate-x-0' : 'w-20 translate-x-0'}
        `}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Logo */}
        <div className="px-4 py-6 flex items-center justify-center border-b h-[88px]">
          <div className="w-full h-full flex items-center justify-center">
            {sidebarHovered ? (
              // Logo Penuh saat expanded
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-16 w-auto object-contain"
              />
            ) : (
              // Icon saja saat collapsed
              <img 
                src={iconUrl} 
                alt="Icon" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  // Fallback ke LayoutDashboard jika icon tidak ada
                  e.target.style.display = 'none'
                }}
              />
            )}
          </div>
        </div>

        {/* Menu */}
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
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={!sidebarHovered ? item.label : ''}
                >
                  <span className="flex-shrink-0">{getIcon(item.icon)}</span>
                  {sidebarHovered && (
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

                {item.submenu?.length > 0 && expanded && sidebarHovered && (
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

        {/* User Info */}
        {user && sidebarHovered && (
          <div className="px-4 py-3 border-t bg-blue-50">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-semibold truncate">{user.username}</p>
            <p className="text-xs text-gray-500">
              {role === 'superadmin'
                ? 'Superadmin'
                : role === 'admin'
                ? 'Admin'
                : 'Supervisor'}
            </p>
          </div>
        )}

        {/* Logout */}
        {sidebarHovered && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-4 text-gray-600 hover:text-red-600 border-t hover:bg-gray-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        )}
      </div>

      {/* Content spacing adjustment */}
      <div 
        className={`hidden md:block transition-all duration-300 ${sidebarHovered ? 'w-72' : 'w-20'}`}
      />
    </>
  )
}