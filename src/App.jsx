import { Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider } from '@/context/SidebarContext'
import { FullscreenProvider } from '@/components/fullscreen/FullscreenMode'
import SessionWarningModal from '@/components/SessionWarningModal'  
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/Dashboard'
import Line from '@/pages/Line'
import OperationBreakdown from '@/pages/OperationBreakdown'
import HourlyOutput from '@/pages/HourlyOutput'
import Report from '@/pages/Report' 
import UserManagement from '@/pages/UserManagement'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardRouter from '@/pages/DashboardRouter'

const BASE = import.meta.env.VITE_BASE_URL
console.log('BASE URL:', BASE)

export default function App() {
  return (
    <FullscreenProvider>
      <SidebarProvider>
        <SessionWarningModal />  { }
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<DashboardRouter />} />
            
            {}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Admin/Superadmin routes */}
            <Route path="line" element={<Line />} />
            <Route path="operation-breakdown" element={<OperationBreakdown />} />
            
            {/* All roles can access */}
            <Route path="hourly-output" element={<HourlyOutput />} />
            
            {/* ⭐ REPORT ROUTE - All roles dapat akses */}
            <Route path="report" element={<Report />} />
            
            {/* Admin & Superadmin */}
            <Route path="users" element={<UserManagement />} />
          </Route>
          
          {/* Fallback - redirect ke home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SidebarProvider>
    </FullscreenProvider>
  )
}