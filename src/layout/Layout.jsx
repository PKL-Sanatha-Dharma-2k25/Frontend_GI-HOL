import { useState } from 'react';
import { Menu, X, Home, BarChart3, Users, Settings, LogOut, Bell, Search } from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 1, label: 'Dashboard', icon: Home, path: '/' },
    { id: 2, label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 3, label: 'Users', icon: Users, path: '/users' },
    { id: 4, label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-screen z-40`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold">Dashboard</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-800 p-2 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors text-left">
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full cursor-pointer hover:opacity-80"></div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}