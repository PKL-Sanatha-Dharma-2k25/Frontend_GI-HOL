import { useAuth } from '@/hooks/useAuth'
import Dashboard from '@/pages/Dashboard'
import HourlyOutput from '@/pages/HourlyOutput'

export default function DashboardRouter() {
  const { user, loading } = useAuth()

  if (loading || !user) return null

  if (user.role === 'supervisor' || user.role === 3) {
    return <HourlyOutput />
  }

  return <Dashboard />
}
