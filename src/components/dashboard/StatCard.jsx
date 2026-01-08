import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StatCard({ 
  label = '', 
  value = '', 
  icon = '', 
  color = 'blue',
  trend = null,
  showChart = false,
  duration = 2000 // Duration of counter animation in ms
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Extract numeric value
  const numericValue = parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
  const prefix = value.toString().match(/^[^\d]*/)?.[0] || ''; // $, #, etc
  const suffix = value.toString().match(/[^\d]*$/)?.[0] || ''; // K, M, etc

  useEffect(() => {
    let animationFrame;
    let startTime;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuad)
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      
      setDisplayValue(Math.floor(easeProgress * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
        setIsAnimating(false);
      }
    };

    if (numericValue > 0) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-gradient-to-br from-blue-400 to-blue-600',
      trend: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700',
      line: 'bg-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-gradient-to-br from-green-400 to-green-600',
      trend: 'text-green-600',
      badge: 'bg-green-100 text-green-700',
      line: 'bg-green-500'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-gradient-to-br from-purple-400 to-purple-600',
      trend: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700',
      line: 'bg-purple-500'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-gradient-to-br from-orange-400 to-orange-600',
      trend: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-700',
      line: 'bg-orange-500'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-gradient-to-br from-red-400 to-red-600',
      trend: 'text-red-600',
      badge: 'bg-red-100 text-red-700',
      line: 'bg-red-500'
    },
    cyan: {
      bg: 'bg-cyan-50',
      icon: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
      trend: 'text-cyan-600',
      badge: 'bg-cyan-100 text-cyan-700',
      line: 'bg-cyan-500'
    },
  };

  const colors = colorMap[color] || colorMap.blue;
  const isTrendPositive = trend > 0;

  return (
    <div className={`${colors.bg} rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300 group cursor-default relative overflow-hidden`}>
      
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Label Section */}
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
            
            {/* Animated Counter Display */}
            <div className="relative">
              <p className="text-4xl font-bold text-gray-900 tracking-tight transition-all duration-300">
                <span className="text-sm text-gray-600">{prefix}</span>
                {displayValue.toLocaleString()}
                <span className="text-sm text-gray-600">{suffix}</span>
              </p>
              
              {/* Animated pulse on render */}
              {isAnimating && (
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Icon Section */}
          <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center text-2xl shadow-md transition-all duration-300 group-hover:scale-110 transform flex-shrink-0 ml-4`}>
            {icon}
          </div>
        </div>

        {/* Trend Section */}
        {trend !== null && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200/50">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${colors.badge} font-semibold text-xs transition-all duration-300 group-hover:scale-105`}>
              {isTrendPositive ? (
                <TrendingUp size={14} className="transition-transform group-hover:rotate-12" />
              ) : (
                <TrendingDown size={14} className="transition-transform group-hover:-rotate-12" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {isTrendPositive ? 'increase' : 'decrease'} from last month
            </span>
          </div>
        )}

        {/* Mini Chart - Optional visualization */}
        {showChart && (
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <div className="flex items-end justify-between gap-1 h-10">
              {[65, 78, 45, 82, 56, 90, 72].map((val, idx) => (
                <div
                  key={idx}
                  className={`${colors.line} rounded-t opacity-60 hover:opacity-100 transition-all duration-300 flex-1`}
                  style={{ 
                    height: `${(val / 100) * 100}%`,
                    animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`
                  }}
                  title={`${val}%`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Weekly trend</p>
          </div>
        )}
      </div>

      {/* Accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.line} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}