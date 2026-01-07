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

const BASE = import.meta.env.VITE_BASE_URL
console.log('BASE URL:', BASE)

export default function App() {
  return (
    <SidebarProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* ⭐ Root route "/" - DashboardRouter decide berdasarkan role */}
          {/* Supervisor → Dashboard, Admin/Superadmin → Dashboard */}
          <Route index element={<DashboardRouter />} />
          
          {/* ⭐ Direct Dashboard access */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Admin/Superadmin routes */}
          <Route path="line" element={<Line />} />
          <Route path="operation-breakdown" element={<OperationBreakdown />} />
          
          {/* All roles can access */}
          <Route path="hourly-output" element={<HourlyOutput />} />
          
          {/* Admin & Superadmin */}
          <Route path="users" element={<UserManagement />} />
        </Route>
        
        {/* Fallback - redirect ke home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SidebarProvider>
  )
}