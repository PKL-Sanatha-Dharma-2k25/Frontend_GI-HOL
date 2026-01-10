import { useAuth } from '@/hooks/useAuth'
import Dashboard from '@/pages/Dashboard'
import HourlyOutput from '@/pages/HourlyOutput'

export default function DashboardRouter() {
  const { user, loading } = useAuth()

 
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  console.log('🎯 [DashboardRouter] User role:', user.role, '→ Render Dashboard')
  return <Dashboard />
}