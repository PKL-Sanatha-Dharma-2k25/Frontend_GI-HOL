// src/pages/UserManagement.jsx
import { useState } from 'react';
import { Search, ChevronUp, ChevronDown, Edit2, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BreadCrumb from '@/components/common/BreadCrumb';
import Alert from '@/components/ui/Alert';
import Input from '@/components/ui/Input';

export default function UserManagement() {
  const { sidebarHovered } = useSidebar();
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'coba',
      email: 'coba@example.com',
      role: '1',
      line_id: 1,
      line_name: 'SHIFT 1 LINE TELAGA',
      status: 'Active',
      created_at: '2025-12-10'
    },
    {
      id: 2,
      username: 'admin_user',
      email: 'admin@example.com',
      role: '2',
      line_id: null,
      line_name: '-',
      status: 'Active',
      created_at: '2025-12-09'
    },
    {
      id: 3,
      username: 'supervisor_user',
      email: 'supervisor@example.com',
      role: '3',
      line_id: 2,
      line_name: 'SHIFT 1 LINE RAJA AMPAT',
      status: 'Active',
      created_at: '2025-12-08'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '2',
    line_id: '',
    status: 'Active'
  });

  const breadcrumbItems = [
    { label: 'User Management', href: '#', active: true }
  ];

  const roleMap = {
    '1': 'Superadmin',
    '2': 'Admin',
    '3': 'Supervisor'
  };

  const lineOptions = [
    { id: 1, name: 'SHIFT 1 LINE TELAGA' },
    { id: 2, name: 'SHIFT 1 LINE RAJA AMPAT' },
    { id: 3, name: 'SHIFT 1 LINE ULU WATU' },
    { id: 4, name: 'SHIFT 1 LINE BROMO' }
  ];

  // Filter & Sort
  const filteredUsers = users
    .filter(u => 
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: '2',
      line_id: '',
      status: 'Active'
    });
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      line_id: user.line_id || '',
      status: user.status
    });
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.role) {
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage('Please fill all required fields');
      return;
    }

    if (!editingId && !formData.password) {
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage('Password is required for new user');
      return;
    }

    if (editingId) {
      // Update
      setUsers(users.map(u => 
        u.id === editingId 
          ? {
              ...u,
              username: formData.username,
              email: formData.email,
              role: formData.role,
              line_id: formData.line_id ? parseInt(formData.line_id) : null,
              line_name: formData.line_id ? lineOptions.find(l => l.id === parseInt(formData.line_id))?.name : '-',
              status: formData.status
            }
          : u
      ));
      setAlertMessage('User updated successfully');
    } else {
      // Create
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        line_id: formData.line_id ? parseInt(formData.line_id) : null,
        line_name: formData.line_id ? lineOptions.find(l => l.id === parseInt(formData.line_id))?.name : '-',
        status: formData.status,
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      setAlertMessage('User created successfully');
    }

    setShowAlert(true);
    setAlertType('success');
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage('User deleted successfully');
    }
  };

  const SortHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
    >
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
      )}
    </button>
  );

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Breadcrumb */}
      <BreadCrumb items={breadcrumbItems} />

      {/* Alert */}
      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          dismissible={true}
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Kelola pengguna sistem</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddNew}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card shadow="md" padding="lg" rounded="lg">
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Table */}
      <Card shadow="md" padding="0" rounded="lg" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Username" sortKey="username" />
                </th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Role" sortKey="role" />
                </th>
                <th className="px-6 py-4 text-left">Line</th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Status" sortKey="status" />
                </th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {roleMap[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{user.line_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Total: {filteredUsers.length} users
        </div>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card shadow="2xl" padding="lg" rounded="lg" className="w-full max-w-md my-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit User' : 'Add New User'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <Input
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g., supervisor_user"
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., user@example.com"
                required
              />

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="1">Superadmin</option>
                  <option value="2">Admin</option>
                  <option value="3">Supervisor</option>
                </select>
              </div>

              {formData.role === '3' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Line</label>
                  <select
                    value={formData.line_id}
                    onChange={(e) => setFormData({ ...formData, line_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Line</option>
                    {lineOptions.map(line => (
                      <option key={line.id} value={line.id}>
                        {line.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}