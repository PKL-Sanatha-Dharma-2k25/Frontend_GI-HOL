import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, LogOut } from 'lucide-react'

export default function SessionWarningModal() {
  const { sessionWarning, timeLeftInSeconds, logout } = useAuth()
  const [displayTime, setDisplayTime] = useState(0)

  useEffect(() => {
    setDisplayTime(timeLeftInSeconds)
  }, [timeLeftInSeconds])

  if (!sessionWarning) return null

  const minutes = Math.floor(displayTime / 60)
  const seconds = displayTime % 60

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 max-w-md w-full mx-4">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Session Expiring Soon
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 text-sm md:text-base mb-6">
          Your session will expire due to inactivity. Please save your work.
        </p>

        {/* Timer */}
        <div className="flex items-center justify-center gap-3 bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200">
          <Clock className="w-5 h-5 text-orange-600" />
          <span className="text-lg font-bold text-orange-600">
            {minutes}:{seconds.toString().padStart(2, '0')} remaining
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={logout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout Now
          </button>
          <button
            onClick={() => {
              console.log('User chose to stay in session')
              // Token akan di-refresh otomatis
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Stay in Session
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Your session is being refreshed...
        </p>
      </div>
    </div>
  )
}

