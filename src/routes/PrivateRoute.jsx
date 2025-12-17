import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivateRoute() {
  const { isAuthenticated, user, logout, theme, setTheme, language, setLanguage } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={logout}
        logoUrl="/src/assets/logo/logo.png"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Header */}
        <Header
          user={user}
          onLogout={logout}
          notificationCount={3}
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />  {/* Child routes render di sini */}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}