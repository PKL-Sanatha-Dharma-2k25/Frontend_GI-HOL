import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

export default function AlertComponent({
  type = 'success',
  message = '',
  details = [],
  onClose = () => { },
  autoClose = true,
  autoCloseDuration = 5000,
  isOpen = true
}) {
  const [isVisible, setIsVisible] = useState(isOpen)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (!autoClose || !isVisible) return
    const timer = setTimeout(() => handleClose(), autoCloseDuration)
    return () => clearTimeout(timer)
  }, [isVisible, autoClose, autoCloseDuration, handleClose])

  if (!isVisible) return null
  const isSuccess = type === 'success'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={handleClose} />

      <div className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full border-2 animate-slideUp ${isSuccess ? 'border-emerald-200' : 'border-rose-200'}`}>
        <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${isSuccess ? 'bg-emerald-100' : 'bg-rose-100'}`}>
            {isSuccess ? <CheckCircle2 size={32} className="text-emerald-600" /> : <AlertCircle size={32} className="text-rose-600" />}
          </div>

          <h2 className={`text-2xl font-bold mb-3 ${isSuccess ? 'text-emerald-900' : 'text-rose-900'}`}>{isSuccess ? 'Success!' : 'Validation Error'}</h2>
          <p className={`text-sm leading-relaxed mb-6 ${isSuccess ? 'text-emerald-800' : 'text-rose-800'}`}>{message}</p>

          {details && details.length > 0 && (
            <div className={`rounded-lg p-4 mb-6 border ${isSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <p className={`text-[10px] font-bold mb-3 uppercase tracking-wider opacity-70 ${isSuccess ? 'text-emerald-900' : 'text-rose-900'}`}>Details</p>
              <ul className={`space-y-2 text-sm ${isSuccess ? 'text-emerald-800' : 'text-rose-800'}`}>
                {details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black flex-shrink-0 mt-0.5 ${isSuccess ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>{idx + 1}</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {autoClose && (
            <div className={`h-1.5 rounded-full overflow-hidden mb-6 ${isSuccess ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              <div className={`h-full ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ animation: `closeProgress ${autoCloseDuration}ms linear forwards` }} />
            </div>
          )}
        </div>

        <div className={`border-t-2 px-8 py-4 flex gap-3 ${isSuccess ? 'border-emerald-200' : 'border-rose-200'}`}>
          <button onClick={handleClose} className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all text-white ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95' : 'bg-rose-600 hover:bg-rose-700 active:scale-95'}`}>
            {isSuccess ? 'Continue' : 'Try Again'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes closeProgress { from { width: 100%; } to { width: 0%; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  )
}