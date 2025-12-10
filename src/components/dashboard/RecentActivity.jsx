import { CheckCircle, AlertCircle, Clock, Zap, User, LogIn, Lock, FileText } from 'lucide-react';
import { useState } from 'react';

export default function RecentActivity({ 
  title = 'Recent Activities',
  activities = [],
  showFilter = true,
  maxItems = 5
}) {
  const [filter, setFilter] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);

  // Map action types to icons
  const getActionIcon = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return <LogIn size={16} />;
    if (actionLower.includes('password') || actionLower.includes('security')) return <Lock size={16} />;
    if (actionLower.includes('profile')) return <User size={16} />;
    if (actionLower.includes('download') || actionLower.includes('export')) return <FileText size={16} />;
    if (actionLower.includes('update')) return <Zap size={16} />;
    return <Clock size={16} />;
  };

  // Status styling
  const getStatusConfig = (status) => {
    const configs = {
      success: {
        icon: <CheckCircle size={18} />,
        badge: 'bg-green-100 text-green-700',
        dot: 'bg-green-500',
        dotRing: 'ring-green-200'
      },
      warning: {
        icon: <AlertCircle size={18} />,
        badge: 'bg-yellow-100 text-yellow-700',
        dot: 'bg-yellow-500',
        dotRing: 'ring-yellow-200'
      },
      info: {
        icon: <Clock size={18} />,
        badge: 'bg-blue-100 text-blue-700',
        dot: 'bg-blue-500',
        dotRing: 'ring-blue-200'
      },
      error: {
        icon: <AlertCircle size={18} />,
        badge: 'bg-red-100 text-red-700',
        dot: 'bg-red-500',
        dotRing: 'ring-red-200'
      }
    };
    return configs[status] || configs.info;
  };

  // Filter activities
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.status === filter);

  const displayedActivities = filteredActivities.slice(0, maxItems);
  const statuses = ['all', ...new Set(activities.map(a => a.status || 'info'))];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500 mt-1">{displayedActivities.length} activities</p>
      </div>

      {/* Filter Tabs */}
      {showFilter && statuses.length > 1 && (
        <div className="flex gap-2 mb-6 pb-4 border-b border-gray-200 overflow-x-auto">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity, idx) => {
            const statusConfig = getStatusConfig(activity.status || 'info');
            const isHovered = hoveredId === activity.id;

            return (
              <div
                key={activity.id}
                onMouseEnter={() => setHoveredId(activity.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group p-3 rounded-lg border border-gray-200/50 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer relative overflow-hidden ${
                  isHovered ? 'shadow-md translate-x-1' : ''
                }`}
                style={{
                  animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`
                }}
              >
                {/* Left accent line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isHovered ? 'bg-blue-500' : 'bg-gray-200'} transition-all duration-300`}></div>

                <div className="flex gap-3 ml-1">
                  {/* Status Dot */}
                  <div className={`flex-shrink-0 mt-1`}>
                    <div className={`w-3 h-3 rounded-full ${statusConfig.dot} ring-4 ${statusConfig.dotRing} transition-all duration-300 ${isHovered ? 'scale-125' : ''}`}></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* User & Action */}
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{activity.user}</p>
                      <div className={`p-1 rounded-md transition-all duration-300 ${isHovered ? `${statusConfig.badge}` : 'bg-gray-100 text-gray-600'}`}>
                        {getActionIcon(activity.action)}
                      </div>
                    </div>

                    {/* Action Description */}
                    <p className="text-xs text-gray-600 mb-1.5">{activity.action}</p>

                    {/* Time */}
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      <p className="text-xs text-gray-400 font-medium">{activity.time}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`flex-shrink-0 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}>
                    {statusConfig.icon}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Clock size={32} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No activities found</p>
          </div>
        )}
      </div>

      {/* View All Link */}
      {activities.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300">
            View all activities →
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}