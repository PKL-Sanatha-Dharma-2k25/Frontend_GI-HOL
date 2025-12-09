export default function UserTable({ 
  users = [],
  onEdit = () => {},
  onDelete = () => {}
}) {
  const columns = [
    { key: 'id', label: 'ID', width: '10%' },
    { key: 'name', label: 'Name', width: '25%' },
    { key: 'email', label: 'Email', width: '30%' },
    { key: 'role', label: 'Role', width: '15%' },
    { key: 'status', label: 'Status', width: '12%' },
    { key: 'action', label: 'Action', width: '8%' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-700" style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <button onClick={() => onEdit(user.id)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">Edit</button>
                <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}