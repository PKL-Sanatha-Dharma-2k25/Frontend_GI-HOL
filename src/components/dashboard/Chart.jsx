import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

export default function Chart({ 
  title = 'Chart', 
  data = [],
  type = 'bar',
  height = '320px',
  color = 'blue',
  showLegend = true,
  showTooltip = true,
  animated = true,
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animatedData, setAnimatedData] = useState(animated ? Array(data.length).fill(0) : data);

  const maxValue = Math.max(...data, 1);

  // Animation effect
  useEffect(() => {
    if (!animated) return;

    let animationFrames = [];
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const newData = data.map(v => v * easeProgress);
      setAnimatedData(newData);

      if (progress < 1) {
        animationFrames.push(requestAnimationFrame(animate));
      }
    };

    animate();

    return () => animationFrames.forEach(f => cancelAnimationFrame(f));
  }, [data, animated]);

  const colorMap = {
    blue: {
      gradient: 'from-blue-500 to-blue-400',
      line: '#3b82f6',
      fill: '#3b82f6',
      hover: 'hover:shadow-blue-400/50',
      accent: 'text-blue-600'
    },
    green: {
      gradient: 'from-green-500 to-green-400',
      line: '#22c55e',
      fill: '#22c55e',
      hover: 'hover:shadow-green-400/50',
      accent: 'text-green-600'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-400',
      line: '#a855f7',
      fill: '#a855f7',
      hover: 'hover:shadow-purple-400/50',
      accent: 'text-purple-600'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-400',
      line: '#f97316',
      fill: '#f97316',
      hover: 'hover:shadow-orange-400/50',
      accent: 'text-orange-600'
    }
  };

  const colors = colorMap[color] || colorMap.blue;
  const displayData = animated ? animatedData : data;

  const renderBarChart = () => (
    <div className="flex items-end justify-around p-6 gap-2 h-full">
      {displayData.map((value, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div
            className={`w-full bg-gradient-to-t ${colors.gradient} rounded-t transition-all duration-300 ${colors.hover} hover:shadow-lg`}
            style={{ 
              height: `${(value / maxValue) * 240}px`,
              transition: 'all 0.3s ease'
            }}
            title={`${months[i]}: ${Math.round(value)}%`}
          />
          
          {/* Tooltip */}
          {showTooltip && hoveredIndex === i && (
            <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {months[i]}: <span className="font-bold">{Math.round(value)}%</span>
            </div>
          )}
          
          {/* Month label */}
          <span className="text-xs text-gray-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {months[i]}
          </span>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => {
    const normalized = displayData.map(v => ((v / maxValue) * 240));
    const points = normalized.map((y, i) => `${i * 40 + 20},${280 - y}`).join(' ');

    return (
      <svg width="100%" height="100%" style={{ padding: '24px' }} viewBox={`0 0 ${data.length * 40} 280`}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: colors.line, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.line, stopOpacity: 0.5 }} />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1="20"
            y1={280 - (i * 60)}
            x2={data.length * 40}
            y2={280 - (i * 60)}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={colors.line}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Dots */}
        {normalized.map((y, i) => (
          <g
            key={`dot-${i}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-pointer"
          >
            <circle
              cx={i * 40 + 20}
              cy={280 - y}
              r="5"
              fill="white"
              stroke={colors.line}
              strokeWidth="2"
              className="transition-all duration-300 hover:r-7"
            />

            {/* Tooltip */}
            {showTooltip && hoveredIndex === i && (
              <text
                x={i * 40 + 20}
                y={280 - y - 20}
                textAnchor="middle"
                fill="#1f2937"
                fontSize="12"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {Math.round(displayData[i])}%
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  };

  const renderAreaChart = () => {
    const normalized = displayData.map(v => ((v / maxValue) * 240));
    const points = normalized.map((y, i) => `${i * 40 + 20},${280 - y}`).join(' ');
    const polygonPoints = `0,280 ${points} ${data.length * 40},280`;

    return (
      <svg width="100%" height="100%" style={{ padding: '24px' }} viewBox={`0 0 ${data.length * 40} 280`}>
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.fill, stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: colors.fill, stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1="20"
            y1={280 - (i * 60)}
            x2={data.length * 40}
            y2={280 - (i * 60)}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {/* Area */}
        <polygon
          points={polygonPoints}
          fill="url(#areaGradient)"
          className="transition-all duration-300"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={colors.line}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {normalized.map((y, i) => (
          <circle
            key={`dot-${i}`}
            cx={i * 40 + 20}
            cy={280 - y}
            r="4"
            fill="white"
            stroke={colors.line}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:r-6"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </svg>
    );
  };

  const getChartIcon = () => {
    if (type === 'bar') return <BarChart3 size={18} />;
    if (type === 'line') return <TrendingUp size={18} />;
    return <PieChartIcon size={18} />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`p-2 bg-gray-100 rounded-lg ${colors.accent}`}>
            {getChartIcon()}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>

        {/* Chart Type Indicator */}
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg capitalize">
          {type}
        </span>
      </div>

      {/* Chart Container */}
      <div 
        className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 rounded-lg overflow-hidden relative border border-gray-100"
        style={{ height }}
      >
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'area' && renderAreaChart()}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`}></div>
            <span className="text-xs text-gray-600 font-medium">Data points</span>
          </div>
          <div className="text-xs text-gray-500">
            Max: <span className="font-semibold text-gray-700">{Math.round(Math.max(...data))}%</span>
          </div>
        </div>
      )}
    </div>
  );
}