// src/pages/UserManagement.jsx
import { useState, useEffect } from 'react'
import { Plus, Eye, EyeOff } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import BreadCrumb from '@/components/common/BreadCrumb'
import Alert from '@/components/ui/Alert'
import UserTable from '@/components/tables/UserTable'
import api from '@/services/api'

export default function UserManagement() {
  const { sidebarHovered } = useSidebar()
  const [users, setUsers] = useState([])
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    id_role: '4', // Default role ID
    id_line: '',
    status: 'Active'
  })

  const breadcrumbItems = [
    { label: 'User Management', href: '/user-management', active: true }
  ]

  // ⭐ ROLE MAPPING: id_role sebagai value
  const roleOptions = [
    { value: '1', label: 'Superadmin' },
    { value: '2', label: 'Admin' },
    { value: '3', label: 'Supervisor' },
    { value: '4', label: 'User' }
  ]

  // =============================
  // LOAD DATA ON MOUNT
  // =============================
  useEffect(() => {
    loadUsers()
    loadLines()
  }, [])

  const loadUsers = async () => {
    try {
      console.group('📥 [loadUsers] Fetching users')
      setLoading(true)

      const response = await api.get('/auth/getalluser')
      console.log('Response:', response.data)

      // Handle different response formats
      let usersData = []
      if (response.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data
      } else if (Array.isArray(response.data)) {
        usersData = response.data
      }

      // ⭐ NORMALIZE DATA - Gunakan id_role dari database
      const normalizedUsers = usersData.map(user => ({
        id_user: user.id_user || user.id,
        username: user.username || 'Unknown',
        email: user.email || '',
        id_role: user.id_role || '4', // Gunakan id_role dari database
        role: getRoleLabel(user.id_role), // Convert id_role ke label
        id_line: user.id_line || null,
        line_name: user.line_name || user.line?.line_name || '-',
        status: user.status || 'Active',
        created_at: user.created_at || new Date().toISOString().split('T')[0]
      }))

      console.log('Normalized users:', normalizedUsers)
      setUsers(normalizedUsers)
      setAlertMessage('')

      console.groupEnd()
    } catch (error) {
      console.group('❌ [loadUsers] Error')
      console.error('Error:', error.message)
      console.error('Error response:', error.response?.data)
      console.groupEnd()

      setShowAlert(true)
      setAlertType('error')
      
      // ⭐ BETTER ERROR MESSAGE
      const errorMsg = error.response?.data?.message || error.message
      setAlertMessage('Failed to load users: ' + errorMsg)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const loadLines = async () => {
    try {
      console.group('📥 [loadLines] Fetching lines')

      const response = await api.get('/auth/getline')
      console.log('Response:', response.data)

      let linesData = []
      if (response.data?.data && Array.isArray(response.data.data)) {
        linesData = response.data.data
      } else if (Array.isArray(response.data)) {
        linesData = response.data
      }

      console.log('Lines loaded:', linesData)
      setLines(linesData)

      console.groupEnd()
    } catch (error) {
      console.error('Failed to load lines:', error.message)
      setLines([])
    }
  }

  // ⭐ Helper function: Convert id_role ke label
  const getRoleLabel = (idRole) => {
    const role = roleOptions.find(r => r.value === String(idRole))
    return role ? role.label : 'Unknown'
  }

  // =============================
  // HANDLERS
  // =============================
  const handleAddNew = () => {
    setEditingId(null)
    setFormData({
      username: '',
      email: '',
      password: '',
      id_role: '4', // Default ke User
      id_line: '',
      status: 'Active'
    })
    setShowForm(true)
  }

  const handleEdit = (userId) => {
    const user = users.find(u => u.id_user === userId || u.id === userId)
    if (user) {
      setEditingId(user.id_user || user.id)
      setFormData({
        username: user.username,
        email: user.email || '',
        password: '',
        id_role: String(user.id_role) || '4', // Pastikan string
        id_line: user.id_line || '',
        status: user.status || 'Active'
      })
      setShowForm(true)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.username || !formData.email || !formData.id_role) {
      setShowAlert(true)
      setAlertType('error')
      setAlertMessage('Please fill all required fields')
      return
    }

    if (!editingId && !formData.password) {
      setShowAlert(true)
      setAlertType('error')
      setAlertMessage('Password is required for new user')
      return
    }

    try {
      setSubmitting(true)

      if (editingId) {
        // ⭐ UPDATE USER
        console.group('📤 [updateUser]')
        const payload = {
          username: formData.username,
          email: formData.email,
          id_role: parseInt(formData.id_role), // ⭐ Kirim sebagai number
          id_line: formData.id_line ? parseInt(formData.id_line) : null,
          status: formData.status
        }

        // Jika password diisi, tambahkan ke payload
        if (formData.password) {
          payload.password = formData.password
        }

        console.log('Payload:', payload)

        await api.post(`/auth/update-user/${editingId}`, payload)

        console.log('User updated successfully')
        console.groupEnd()

        setShowAlert(true)
        setAlertType('success')
        setAlertMessage('User updated successfully')

        // Reload users
        await loadUsers()
      } else {
        // ⭐ CREATE USER - Kirim id_role sebagai number
        console.group('📤 [createUser]')
        const payload = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          id_role: parseInt(formData.id_role), // ⭐ Kirim sebagai number
          id_line: formData.id_line ? parseInt(formData.id_line) : null,
          status: formData.status
        }

        console.log('Payload:', payload)

        await api.post('/auth/create-user', payload)

        console.log('User created successfully')
        console.groupEnd()

        setShowAlert(true)
        setAlertType('success')
        setAlertMessage('User created successfully')

        // Reload users
        await loadUsers()
      }

      setShowForm(false)
    } catch (error) {
      console.group('❌ [handleFormSubmit] Error')
      console.error('Error:', error.response?.data || error.message)
      console.groupEnd()

      setShowAlert(true)
      setAlertType('error')
      setAlertMessage(error.response?.data?.message || 'Failed to save user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure want to delete this user?')) {
      return
    }

    try {
      console.group('📤 [deleteUser]')
      console.log('Deleting user:', userId)

      await api.post(`/auth/delete-user/${userId}`)

      console.log('User deleted successfully')
      console.groupEnd()

      setShowAlert(true)
      setAlertType('success')
      setAlertMessage('User deleted successfully')

      // Reload users
      await loadUsers()
    } catch (error) {
      console.group('❌ [handleDelete] Error')
      console.error('Error:', error.response?.data || error.message)
      console.groupEnd()

      setShowAlert(true)
      setAlertType('error')
      setAlertMessage(error.response?.data?.message || 'Failed to delete user')
    }
  }

  return (
    <div className="space-y-6 px-responsive py-responsive bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* ✅ Breadcrumb */}
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* ✅ Alert */}
      {showAlert && (
        <div className="slide-in-up">
          <Alert
            type={alertType}
            message={alertMessage}
            dismissible={true}
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}

      {/* ✅ Add User Button */}
      <div className="flex justify-end scale-in">
        <Button
          onClick={handleAddNew}
          variant="primary"
          size="md"
          icon={Plus}
          disabled={loading}
        >
          Add User
        </Button>
      </div>

      {/* ✅ UserTable Card */}
      <Card shadow="lg" padding="lg" rounded="lg" className="scale-in transition-shadow duration-300">
        <UserTable 
          users={users}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={true}
          sortable={true}
        />
      </Card>

      {/* ✅ Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 fade-in overflow-y-auto">
          <Card shadow="2xl" padding="lg" rounded="lg" className="w-full max-w-md my-8 scale-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display leading-tight tracking-tight">
              {editingId ? 'Edit User' : 'Add New User'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 slide-in-up">
              {/* Username Input */}
              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g., supervisor_user"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-normal text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={submitting}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., user@example.com"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-normal text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={submitting}
                  required
                />
              </div>

              {/* Password Input */}
              {!editingId && (
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-normal text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      disabled={submitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      disabled={submitting}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Role Select */}
              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Role *
                </label>
                <select
                  value={formData.id_role}
                  onChange={(e) => setFormData({ ...formData, id_role: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-normal text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={submitting}
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Select (Supervisor only) */}
              {formData.id_role === '3' && (
                <div className="form-group slide-in-down">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Assign Line
                  </label>
                  <select
                    value={formData.id_line}
                    onChange={(e) => setFormData({ ...formData, id_line: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-normal text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    disabled={submitting}
                  >
                    <option value="">Select Line</option>
                    {lines.map(line => (
                      <option key={line.id_line || line.id} value={line.id_line || line.id}>
                        {line.line_name || line.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Select */}
              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg font-normal text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={submitting}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Divider */}
              <div className="divider"></div>

              {/* Form Actions */}
              <div className="flex gap-3 slide-in-up">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}