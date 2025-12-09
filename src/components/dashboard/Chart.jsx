export default function Chart({ 
  title = 'Chart', 
  data = [],
  type = 'bar',
  height = '320px'
}) {
  const maxValue = Math.max(...data, 1);

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <div className="flex items-end justify-around p-6 gap-2 h-full">
          {data.map((value, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:shadow-lg transition-shadow cursor-pointer"
              style={{ height: `${(value / maxValue) * 280}px` }}
              title={`Month ${i + 1}: ${value}%`}
            />
          ))}
        </div>
      );
    } else if (type === 'line') {
      const normalized = data.map(v => ((v / maxValue) * 240));
      return (
        <svg width="100%" height="100%" style={{ padding: '24px' }} viewBox={`0 0 ${data.length * 40} 280`}>
          {data.map((v, i) => (
            <circle key={i} cx={i * 40 + 20} cy={280 - normalized[i]} r="4" fill="#3b82f6" />
          ))}
          <polyline
            points={normalized.map((y, i) => `${i * 40 + 20},${280 - y}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        </svg>
      );
    } else if (type === 'area') {
      const normalized = data.map(v => ((v / maxValue) * 240));
      return (
        <svg width="100%" height="100%" style={{ padding: '24px' }} viewBox={`0 0 ${data.length * 40} 280`}>
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <polygon
            points={`0,280 ${normalized.map((y, i) => `${i * 40 + 20},${280 - y}`).join(' ')} ${data.length * 40},280`}
            fill="url(#areaGradient)"
          />
          <polyline
            points={normalized.map((y, i) => `${i * 40 + 20},${280 - y}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <div 
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden"
        style={{ height }}
      >
        {renderChart()}
      </div>
    </div>
  );
}
