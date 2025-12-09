export default function RecentActivity({ 
  title = 'Recent Activities',
  activities = []
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <div
              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{activity.user}</p>
              <p className="text-xs text-gray-600">{activity.action}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
