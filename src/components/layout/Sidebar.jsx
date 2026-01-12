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
  Lock,
  LockOpen
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
  const [expandedItems, setExpandedItems] = useState({})
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const rawRole = user?.role
  const role = (() => {
    if (!rawRole) return null
    const r = String(rawRole).toLowerCase().trim()
    if (r.includes('superadmin') || r === '1') return 'superadmin'
    if (r.includes('admin') || r === '2') return 'admin'
    if (r.includes('supervisor') || r === '3' || r === '4') return 'supervisor'
    return null
  })()

  console.log('🎯 [Sidebar] Role detected:', role, '(raw:', rawRole, ')')

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

  const getMenuItems = () => {
    if (role === 'supervisor') {
      console.log('📌 Building SUPERVISOR menu')
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          path: '/dashboard',
          submenu: [],
          section: 'main'
        },
        {
          id: 'hourly-output',
          label: 'Hourly Output',
          icon: 'hourly-output',
          path: '/hourly-output',
          submenu: [],
          section: 'production'
        }
      ]
    }

    if (role === 'admin') {
      console.log('📌 Building ADMIN menu')
      return [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', submenu: [], section: 'main' },
        { id: 'line', label: 'Line', icon: 'line', path: '/line', submenu: [], section: 'production' },
        { id: 'operation-breakdown', label: 'Operation Breakdown', icon: 'operation-breakdown', path: '/operation-breakdown', submenu: [], section: 'production' },
        { id: 'hourly-output', label: 'Hourly Output', icon: 'hourly-output', path: '/hourly-output', submenu: [], section: 'production' },
        {
          id: 'users',
          label: 'User Management',
          icon: 'users',
          path: '/users',
          submenu: [
            { id: 'users-list', label: 'All Users', path: '/users' },
            { id: 'users-add', label: 'Add User', path: '/users?action=add' }
          ],
          section: 'admin'
        }
      ]
    }

    if (role === 'superadmin') {
      console.log('📌 Building SUPERADMIN menu')
      return [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', submenu: [], section: 'main' },
        { id: 'line', label: 'Line', icon: 'line', path: '/line', submenu: [], section: 'production' },
        { id: 'operation-breakdown', label: 'Operation Breakdown', icon: 'operation-breakdown', path: '/operation-breakdown', submenu: [], section: 'production' },
        { id: 'hourly-output', label: 'Hourly Output', icon: 'hourly-output', path: '/hourly-output', submenu: [], section: 'production' },
        {
          id: 'users',
          label: 'User Management',
          icon: 'users',
          path: '/users',
          submenu: [
            { id: 'users-list', label: 'All Users', path: '/users' },
            { id: 'users-add', label: 'Add User', path: '/users?action=add' }
          ],
          section: 'admin'
        }
      ]
    }

    console.log('📌 Building DEFAULT menu')
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/dashboard',
        submenu: [],
        section: 'main'
      }
    ]
  }

  const menuItems = getMenuItems()

  const groupedMenu = menuItems.reduce((acc, item) => {
    const section = item.section || 'main'
    if (!acc[section]) acc[section] = []
    acc[section].push(item)
    return acc
  }, {})

  const sectionLabels = {
    main: 'Main',
    production: 'Production',
    admin: 'Administration'
  }

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

  const getIconColor = (iconName) => {
    const colors = {
      dashboard: 'from-blue-400 to-blue-600',
      line: 'from-green-400 to-green-600',
      'operation-breakdown': 'from-purple-400 to-purple-600',
      'hourly-output': 'from-orange-400 to-orange-600',
      users: 'from-pink-400 to-pink-600'
    }
    return colors[iconName] || 'from-blue-400 to-blue-600'
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

  const isSidebarExpanded = sidebarPinned || sidebarHovered

  const MenuItem = ({ item, isSidebarExpanded }) => {
    const isActive = activeMenu === item.id
    const expanded = expandedItems[item.id]

    return (
      <div key={item.id}>
        <button
          onClick={() => handleMenuClick(item)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative group ${
            isActive 
              ? 'bg-blue-50 text-blue-600 font-semibold' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          title={!isSidebarExpanded ? item.label : ''}
        >
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-lg" />
          )}
          
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getIconColor(item.icon)} text-white flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
            {getIcon(item.icon)}
          </div>
          
          {isSidebarExpanded && (
            <>
              <span className="text-sm font-medium flex-1 text-left transition-opacity duration-300">{item.label}</span>
              {item.submenu?.length > 0 && (
                <ChevronDown 
                  size={16} 
                  className={`flex-shrink-0 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
                />
              )}
            </>
          )}
        </button>

        {item.submenu?.length > 0 && expanded && isSidebarExpanded && (
          <div className="ml-4 mt-2 space-y-1 animate-fadeIn">
            {item.submenu.map(sub => (
              <button
                key={sub.id}
                onClick={() => handleSubMenuClick(sub)}
                className="w-full text-left px-3 py-2 text-xs rounded-md text-gray-500 hover:text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* 🖥️ DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <div
          className="fixed left-0 top-0 h-full w-1 z-20 hover:w-20 transition-all duration-300 cursor-pointer"
          onMouseEnter={() => !sidebarPinned && setSidebarHovered(true)}
          onMouseLeave={() => !sidebarPinned && setSidebarHovered(false)}
        />

        <div
          className={`
            fixed top-0 left-0 h-full z-40 
            bg-gradient-to-b from-white to-gray-50 transition-all duration-300
            flex-col shadow-xl border-r border-gray-100
            ${isSidebarExpanded ? 'w-72 translate-x-0' : 'w-20 translate-x-0'}
            flex
          `}
          onMouseEnter={() => !sidebarPinned && setSidebarHovered(true)}
          onMouseLeave={() => !sidebarPinned && setSidebarHovered(false)}
        >
          <div className="px-4 py-6 flex items-center justify-between border-b h-[88px] bg-gradient-to-r from-blue-50 to-transparent">
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
                className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0 group"
                title={sidebarPinned ? 'Unlock Sidebar' : 'Lock Sidebar'}
              >
                {sidebarPinned ? (
                  <Lock 
                    size={18} 
                    className="text-gray-600 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <LockOpen 
                    size={18} 
                    className="text-gray-400 transition-transform duration-300 group-hover:scale-110"
                  />
                )}
              </button>
            )}
          </div>

          {isSidebarExpanded && (
            <div className="px-4 py-4 animate-fadeIn">
              <input
                type="text"
                placeholder="Search menu..."
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}

          <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
            {Object.entries(groupedMenu).map(([section, items]) => (
              <div key={section}>
                {isSidebarExpanded && (
                  <div className="flex items-center justify-between px-4 mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {sectionLabels[section] || section}
                    </p>
                    {section !== 'main' && (
                      <button
                        onClick={() => {
                          items.forEach(item => {
                            if (item.submenu?.length > 0) {
                              setExpandedItems(prev => ({ ...prev, [item.id]: false }))
                            }
                          })
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 transition"
                        title="Collapse all"
                      >
                        ↕
                      </button>
                    )}
                  </div>
                )}
                
                <div className="space-y-1">
                  {items.map(item => (
                    <MenuItem key={item.id} item={item} isSidebarExpanded={isSidebarExpanded} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="px-3 py-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition duration-300 group"
              title={!isSidebarExpanded ? 'Logout' : ''}
            >
              <LogOut size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              {isSidebarExpanded && <span className="text-sm font-medium transition-opacity duration-300">Logout</span>}
            </button>
          </div>
        </div>

        <div className={`transition-all duration-300 ${isSidebarExpanded ? 'w-72' : 'w-20'}`} />
      </div>

      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 shadow-sm z-50 flex items-center justify-between px-4">
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
          onClick={() => {
            console.log('📱 Mobile menu button clicked, mobileMenuOpen:', !mobileMenuOpen)
            setMobileMenuOpen(!mobileMenuOpen)
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={28} className="text-gray-700" strokeWidth={2} />
          ) : (
            <Menu size={28} className="text-gray-700" strokeWidth={2} />
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
        className={`md:hidden fixed top-16 left-0 h-[calc(100vh-64px)] w-72 max-w-[90vw] bg-white shadow-lg z-30 transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-4 border-b sticky top-0 bg-white">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <nav className="px-3 py-4 space-y-4">
          {Object.entries(groupedMenu).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                {sectionLabels[section] || section}
              </p>
              <div className="space-y-1">
                {items.map(item => {
                  const isActive = activeMenu === item.id
                  const expanded = expandedItems[item.id]

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => handleMenuClick(item)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative ${
                          isActive 
                            ? 'bg-blue-50 text-blue-600 font-semibold' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-lg" />
                        )}
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${getIconColor(item.icon)} text-white flex-shrink-0`}>
                          {getIcon(item.icon)}
                        </div>
                        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        {item.submenu?.length > 0 && (
                          <ChevronDown 
                            size={16} 
                            className={`flex-shrink-0 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
                          />
                        )}
                      </button>

                      {item.submenu?.length > 0 && expanded && (
                        <div className="ml-4 mt-2 space-y-1 animate-fadeIn">
                          {item.submenu.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => handleSubMenuClick(sub)}
                              className="w-full text-left px-3 py-2 text-xs rounded-md text-gray-500 hover:text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t sticky bottom-0 bg-white">
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}