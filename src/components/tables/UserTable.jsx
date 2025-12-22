// src/components/tables/UserTable.jsx
import { ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function UserTable({
  users = [],
  loading = false,
  searchQuery = '',
  sortConfig = { key: 'username', direction: 'asc' },
  onSort = () => {},
  onEdit = () => {},
  onDelete = () => {},
  roleMap = {}
}) {
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

  const SortHeader = ({ label, sortKey }) => (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 tracking-normal leading-normal uppercase text-xs"
    >
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === 'asc' ? 
          <ChevronUp size={16} className="animate-bounce-animate" /> : 
          <ChevronDown size={16} className="animate-bounce-animate" />
      )}
    </button>
  );

  return (
    <Card shadow="lg" padding="0" rounded="lg" className="overflow-hidden scale-in transition-shadow duration-300">
      <div className="overflow-x-auto">
        <table className="w-full font-sans">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <th className="px-6 py-4 text-left">
                <SortHeader label="Username" sortKey="username" />
              </th>
              <th className="px-6 py-4 text-left">
                <span className="font-semibold text-gray-700 uppercase tracking-wide text-xs">Email</span>
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader label="Role" sortKey="role" />
              </th>
              <th className="px-6 py-4 text-left">
                <span className="font-semibold text-gray-700 uppercase tracking-wide text-xs">Line</span>
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader label="Status" sortKey="status" />
              </th>
              <th className="px-6 py-4 text-center">
                <span className="font-semibold text-gray-700 uppercase tracking-wide text-xs">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-gray-300 border-t-blue-500 rounded-full spin-animate"></div>
                    <span className="text-gray-600 font-normal">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <p className="text-gray-500 font-normal leading-relaxed">
                    No users found. Try adjusting your search.
                  </p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-blue-50 transition-colors duration-200 fade-in"
                  style={{
                    animation: `fadeIn 0.3s ease-out forwards`,
                    opacity: 0,
                    animationDelay: `${idx * 50}ms`
                  }}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 leading-normal">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm font-normal leading-normal">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge badge-primary">
                      {roleMap[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm font-normal leading-normal">
                    {user.line_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={user.status === 'Active' ? 'badge badge-success' : 'badge badge-danger'}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-all duration-200 tooltip"
                        data-tooltip="Edit user"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 tooltip"
                        data-tooltip="Delete user"
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

      <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 text-sm text-gray-600 font-normal leading-normal">
        Total: <span className="font-semibold text-gray-900">{filteredUsers.length}</span> users
      </div>
    </Card>
  );
}