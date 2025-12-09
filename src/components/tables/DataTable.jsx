export default function DataTable({ 
  columns = [],
  data = [],
  striped = false,
  hover = false,
  bordered = false
}) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
      case 'Active':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'Pending':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
      case 'Cancelled':
      case 'error':
      case 'danger':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${bordered ? 'border-l border-r border-gray-200' : 'divide-gray-200'}`}>
          {data.map((row, idx) => (
            <tr 
              key={idx}
              className={`${
                striped && idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } ${hover ? 'hover:bg-blue-50' : ''} transition-colors`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                  {col.key === 'status' ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row[col.key])}`}>
                      {row[col.key]}
                    </span>
                  ) : col.key === 'action' ? (
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">Edit</button>
                      <button className="text-red-600 hover:text-red-700 text-xs font-medium">Delete</button>
                    </div>
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}