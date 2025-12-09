export default function Widget({ 
  title = '', 
  content = '', 
  icon = '',
  action = null
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {icon && <div className="text-3xl mt-2">{icon}</div>}
        </div>
      </div>
      <p className="text-gray-600 text-sm flex-1">{content}</p>
      {action && (
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4">
          {action.label}
        </button>
      )}
    </div>
  );
}