// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-opacity-30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  )
}