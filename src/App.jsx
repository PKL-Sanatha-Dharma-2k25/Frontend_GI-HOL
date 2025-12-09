import { useState, useEffect } from 'react';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import './styles/index.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userData, setUserData] = useState({
    token: 'mock-jwt-token',
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    name: 'Admin User'
  });
  
  // Theme state - baca dari localStorage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme');
    return saved || 'light';
  });

  // Language state - baca dari localStorage
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('appLanguage');
    return saved || 'en';
  });

  // Update className di html element saat theme berubah
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Simpan ke localStorage
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  // Update language di html element
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.lang = language;
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const handleLogin = (data) => {
    console.log('Login successful with data:', data);
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('User logged out');
    setUserData(null);
    setIsLoggedIn(false);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="bg-bg-secondary dark:bg-bg-secondary text-text-primary dark:text-text-primary transition-colors duration-300">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Dashboard 
            user={userData} 
            onLogout={handleLogout}
            theme={theme}
            onThemeChange={handleThemeChange}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        )}
      </div>
    </div>
  );
}