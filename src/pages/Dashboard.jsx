import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import Tabs from '@/components/ui/Tabs';
import Drawer from '@/components/ui/Drawer';
import Dropdown from '@/components/ui/Dropdown';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import StatCard from '@/components/dashboard/StatCard';
import Chart from '@/components/dashboard/Chart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import Widget from '@/components/dashboard/Widget';

import DataTable from '@/components/tables/DataTable';
import UserTable from '@/components/tables/UserTable';

import BreadCrumb from '@/components/common/BreadCrumb';
import Pagination from '@/components/common/Pagination';

export default function Dashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'reports', label: 'Reports', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ];

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Dashboard', href: '#', active: true },
  ];

  // Stats
  const stats = [
    { label: 'Total Users', value: '1,234', icon: '👥', color: 'blue', trend: 12 },
    { label: 'Total Revenue', value: '$45,231', icon: '💰', color: 'green', trend: 8 },
    { label: 'Active Sessions', value: '342', icon: '🔌', color: 'purple', trend: -3 },
    { label: 'Pending Tasks', value: '28', icon: '✓', color: 'orange', trend: 5 },
  ];

  // Chart data
  const chartData = [65, 78, 45, 82, 56, 90, 72, 88, 65, 78, 85, 92];

  // Recent activities
  const activitiesData = [
    { id: 1, user: 'John Doe', action: 'Logged in', time: '2 minutes ago', status: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '15 minutes ago', status: 'success' },
    { id: 3, user: 'Mike Johnson', action: 'Downloaded report', time: '1 hour ago', status: 'success' },
    { id: 4, user: 'Sarah Williams', action: 'Password changed', time: '3 hours ago', status: 'warning' },
  ];

  // Table data
  const tableColumns = [
    { key: 'id', label: 'ID', width: '15%' },
    { key: 'user', label: 'User', width: '25%' },
    { key: 'action', label: 'Action', width: '25%' },
    { key: 'date', label: 'Date', width: '20%' },
    { key: 'status', label: 'Status', width: '15%' },
  ];

  const tableData = [
    { id: 'TRX-1001', user: 'User 1', action: 'Transaction', date: 'Dec 1, 2025', status: 'Completed' },
    { id: 'TRX-1002', user: 'User 2', action: 'Transaction', date: 'Dec 2, 2025', status: 'Completed' },
    { id: 'TRX-1003', user: 'User 3', action: 'Transaction', date: 'Dec 3, 2025', status: 'Pending' },
    { id: 'TRX-1004', user: 'User 4', action: 'Transaction', date: 'Dec 4, 2025', status: 'Completed' },
    { id: 'TRX-1005', user: 'User 5', action: 'Transaction', date: 'Dec 5, 2025', status: 'Completed' },
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive' },
  ];

  // Tabs
  const tabs = [
    { label: 'Overview', content: <div className="text-gray-600">Dashboard overview content</div> },
    { label: 'Analytics', content: <div className="text-gray-600">Analytics data</div> },
    { label: 'Reports', content: <div className="text-gray-600">Reports content</div> },
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const totalPages = Math.ceil(tableData.length / 5);
  const paginatedData = tableData.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        menuItems={menuItems}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        onLogout={handleLogoutClick}
      />

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col transition-all duration-300`}>
        
        {/* Header */}
        <Header
          title="Dashboard"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          user={user}
          onLogout={handleLogoutClick}
          notificationCount={3}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Alert */}
          {showAlert && (
            <div className="mb-6">
              <Alert
                type="success"
                message={`Welcome back, ${user?.name || 'Admin'}!`}
                dismissible={true}
                onClose={() => setShowAlert(false)}
              />
            </div>
          )}

          {/* Breadcrumb */}
          <div className="mb-6">
            <BreadCrumb items={breadcrumbItems} />
          </div>

          {/* Welcome Section */}
          <Card shadow="md" padding="lg" rounded="lg" className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}! 👋</h2>
                <p className="text-blue-100">Here's what's happening in your system today</p>
              </div>
              {/* FIXED: Avatar diganti dengan simple div */}
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-white border-opacity-30">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Charts & Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Chart title="Monthly Performance" data={chartData} type="bar" />
            </div>
            <RecentActivity title="Recent Activities" activities={activitiesData} />
          </div>

          {/* Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card shadow="md" padding="lg" rounded="lg">
              <Widget title="Quick Stats" content="View your quick statistics here" icon="📊" />
            </Card>
            <Card shadow="md" padding="lg" rounded="lg">
              <Widget title="Performance" content="Monitor your performance metrics" icon="⚡" />
            </Card>
            <Card shadow="md" padding="lg" rounded="lg">
              <Widget title="System Health" content="Check your system health status" icon="💚" />
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <Card shadow="md" padding="0" rounded="lg">
              <Tabs tabs={tabs} />
            </Card>
          </div>

          {/* Data Table */}
          <div className="mb-6">
            <Card shadow="md" padding="0" rounded="lg">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                <div className="flex gap-2">
                  <Dropdown 
                    label="Filter"
                    items={['All', 'Completed', 'Pending', 'Failed']}
                    onSelect={(item) => console.log('Filter:', item)}
                  />
                  <Button variant="primary" size="sm">
                    Export
                  </Button>
                </div>
              </div>
              <DataTable columns={tableColumns} data={paginatedData} striped={true} hover={true} />
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                <span className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, tableData.length)} of {tableData.length}
                </span>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </Card>
          </div>

          {/* User Table */}
          <div className="mb-6">
            <Card shadow="md" padding="lg" rounded="lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Users</h3>
              <UserTable users={users} />
            </Card>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card shadow="md" padding="lg" rounded="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Server Status</h3>
                <Badge variant="success" text="Active" />
              </div>
              <p className="text-gray-600 mb-4">All systems operational</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">95% System Health</p>
            </Card>

            <Card shadow="md" padding="lg" rounded="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Backup Status</h3>
                <Badge variant="info" text="In Progress" />
              </div>
              <p className="text-gray-600 mb-4">Last backup: 2 hours ago</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">65% Complete</p>
            </Card>
          </div>

          {/* Drawer Button */}
          <div className="mb-6">
            <Button variant="secondary" size="lg" onClick={() => setShowDrawer(true)}>
              Open Side Panel
            </Button>
          </div>

          {/* Drawer */}
          <Drawer
            isOpen={showDrawer}
            title="Dashboard Settings"
            position="right"
            onClose={() => setShowDrawer(false)}
            footer={
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowDrawer(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setShowDrawer(false)}>
                  Save
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
                <input type="checkbox" defaultChecked className="w-4 h-4" /> Enable notifications
              </div>
            </div>
          </Drawer>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}