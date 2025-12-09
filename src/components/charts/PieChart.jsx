export default function PieChart({ data = [], labels = [], title = 'Pie Chart' }) {
  const total = data.reduce((a, b) => a + b, 1);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  let currentAngle = 0;
  const slices = data.map((value, i) => {
    const sliceAngle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    const largeArc = sliceAngle > 180 ? 1 : 0;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);
    
    const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    currentAngle = endAngle;
    
    return { path, color: colors[i % colors.length], label: labels[i] || `Item ${i + 1}` };
  });
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {slices.map((slice, i) => (
            <path key={i} d={slice.path} fill={slice.color} className="hover:opacity-80 transition-opacity" />
          ))}
        </svg>
        <div className="space-y-2">
          {slices.map((slice, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: slice.color }}></div>
              <span className="text-sm text-gray-600">{slice.label} ({data[i]}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}