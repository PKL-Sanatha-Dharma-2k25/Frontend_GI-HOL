export default function OrderTable({ 
  orders = [],
  onEdit = () => {},
  onDelete = () => {}
}) {
  const columns = [
    { key: 'id', label: 'Order ID', width: '15%' },
    { key: 'customer', label: 'Customer', width: '25%' },
    { key: 'total', label: 'Total', width: '15%' },
    { key: 'date', label: 'Date', width: '20%' },
    { key: 'status', label: 'Status', width: '15%' },
    { key: 'action', label: 'Action', width: '10%' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
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
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.id}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.total}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <button onClick={() => onEdit(order.id)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">Edit</button>
                <button onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
