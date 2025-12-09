export default function ProductTable({ 
  products = [],
  onEdit = () => {},
  onDelete = () => {}
}) {
  const columns = [
    { key: 'id', label: 'ID', width: '10%' },
    { key: 'name', label: 'Product Name', width: '30%' },
    { key: 'price', label: 'Price', width: '15%' },
    { key: 'stock', label: 'Stock', width: '15%' },
    { key: 'category', label: 'Category', width: '15%' },
    { key: 'action', label: 'Action', width: '15%' },
  ];

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
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.id}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.price}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <button onClick={() => onEdit(product.id)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">Edit</button>
                <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}