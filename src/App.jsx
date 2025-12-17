import { Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider } from '@/context/SidebarContext'
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/Dashboard'
import Line from '@/pages/Line'
import OperationBreakdown from '@/pages/OperationBreakdown'
import HourlyOutput from '@/pages/HourlyOutput'
import UserManagement from '@/pages/UserManagement'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardRouter from '@/pages/DashboardRouter'

export default function App() {
  return (
    <SidebarProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardRouter />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/line" element={<Line />} />
          <Route path="/operation-breakdown" element={<OperationBreakdown />} />
          <Route path="/hourly-output" element={<HourlyOutput />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SidebarProvider>
  )
}