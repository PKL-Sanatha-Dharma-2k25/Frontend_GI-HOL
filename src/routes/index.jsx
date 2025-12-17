import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Pages
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/Dashboard';
import Line from '@/pages/Line';
import StyleMaster from '@/pages/StyleMaster';
import OperationBreakdown from '@/pages/OperationBreakdown';
import LineBalancing from '@/pages/LineBalancing';
import HourlyOutput from '@/pages/HourlyOutput';
import UserManagement from '@/pages/UserManagement';

// Route Wrapper
import PrivateRoute from './PrivateRoute';

export function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-opacity-30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ReactRoutes>
      {/* Public Route */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/line" element={<Line />} />
        <Route path="/style" element={<StyleMaster />} />
        <Route path="/operation-breakdown" element={<OperationBreakdown />} />
        <Route path="/line-balancing" element={<LineBalancing />} />
        <Route path="/hourly-output" element={<HourlyOutput />} />
        <Route path="/users" element={<UserManagement />} />
      </Route>

      {/* Catch all */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </ReactRoutes>
  );
}