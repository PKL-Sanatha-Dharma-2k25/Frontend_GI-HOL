import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AlertComponent({ type, message, details }) {
  return (
    <div className={`p-4 rounded-lg border-l-4 flex items-start gap-3 animate-slideDown ${
      type === 'success'
        ? 'bg-green-50 border-green-500 text-green-800'
        : 'bg-red-50 border-red-500 text-red-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className="font-semibold text-sm">{type === 'success' ? 'Success' : 'Validation Error'}</p>
        <p className="text-sm mt-1">{message}</p>
        {details.length > 0 && (
          <ul className="mt-2 ml-4 text-sm space-y-1">
            {details.map((detail, idx) => (
              <li key={idx} className="list-disc">
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}