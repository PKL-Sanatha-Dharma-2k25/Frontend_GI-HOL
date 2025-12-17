export default function DataTable({ 
  columns = [],
  data = [],
  striped = false,
  hover = false,
  bordered = false,
  loading = false,
  emptyMessage = "No data available"
}) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'active':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
      case 'error':
      case 'danger':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCell = (row, col) => {
    const value = row[col.key];

    // Custom render function jika ada
    if (col.render) {
      return col.render(value, row);
    }

    // Status badge
    if (col.key === 'status') {
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(value)}`}>
          {value}
        </span>
      );
    }

    // Action column - render JSX directly
    if (col.key === 'action' && typeof value === 'object' && value !== null) {
      return value;
    }

    // Default text rendering
    return value || '-';
  };

  if (loading) {
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
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${bordered ? 'border-l border-r border-gray-200' : 'divide-gray-200'}`}>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr 
                key={idx}
                className={`${
                  striped && idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } ${hover ? 'hover:bg-blue-50' : ''} transition-colors duration-200`}
              >
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className="px-6 py-4 text-sm text-gray-900"
                    style={{ width: col.width }}
                  >
                    {renderCell(row, col)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}