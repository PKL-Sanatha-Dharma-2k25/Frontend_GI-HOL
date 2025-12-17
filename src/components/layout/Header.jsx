// src/components/layout/Header.jsx
import { useAuth } from '@/hooks/useAuth'
import { Bell } from 'lucide-react'

export default function Header() {
  const { user } = useAuth()
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end" style={{ height: '88px' }}>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}