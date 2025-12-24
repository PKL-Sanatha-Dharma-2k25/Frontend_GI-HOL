// src/components/layout/Header.jsx
import { useAuth } from '@/hooks/useAuth'
import { Bell } from 'lucide-react'

export default function Header() {
  const { user } = useAuth()
  
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

        {/* User Info */}
        <div className="flex items-center gap-2 pl-3 sm:pl-4 border-l border-gray-200">
          {/* Desktop Only - User Details */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}