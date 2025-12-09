export default function LineChart({ data = [], title = 'Line Chart' }) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const normalizedData = data.map(v => ((v - minValue) / range) * 200);
  
  return (
    <div className="w-full h-80 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 relative">
        <svg width="100%" height="100%" viewBox={`0 0 ${data.length * 40} 200`}>
          {/* Grid lines */}
          {[0, 50, 100, 150, 200].map((y) => (
            <line key={`grid-${y}`} x1="0" y1={y} x2={data.length * 40} y2={y} stroke="#e5e7eb" strokeDasharray="5" />
          ))}
          
          {/* Line path */}
          <polyline
            points={normalizedData.map((y, i) => `${i * 40 + 20},${200 - y}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {normalizedData.map((y, i) => (
            <circle
              key={i}
              cx={i * 40 + 20}
              cy={200 - y}
              r="3"
              fill="#3b82f6"
              className="hover:r-5 transition-all"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
