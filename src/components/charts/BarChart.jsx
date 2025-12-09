export default function BarChart({ data = [], title = 'Bar Chart' }) {
  const maxValue = Math.max(...data);
  
  return (
    <div className="w-full h-80 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-end justify-around p-6">
        {data.map((value, i) => (
          <div
            key={i}
            className="flex-1 mx-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:shadow-lg transition-shadow"
            style={{ height: `${(value / maxValue) * 240}px` }}
            title={`Value: ${value}`}
          />
        ))}
      </div>
    </div>
  );
}
