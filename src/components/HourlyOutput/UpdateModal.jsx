import { X, Save, AlertCircle, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function UpdateModal({
  isOpen,
  data,
  input,
  loading,
  onInputChange,
  onSave,
  onClose
}) {
  const [hoveredRow, setHoveredRow] = useState(null)
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  console.log('✏️ [UpdateModal] data:', data)
  console.log('✏️ [UpdateModal] input:', input)

 
  const validateInput = (opCode, value) => {
    if (value === '' || value === null) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[opCode]
        return newErrors
      })
      return true
    }

    const numValue = parseInt(value)
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, [opCode]: 'Invalid number' }))
      return false
    }

    if (numValue < 0) {
      setErrors(prev => ({ ...prev, [opCode]: 'Cannot be negative' }))
      return false
    }

    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[opCode]
      return newErrors
    })
    return true
  }

  const handleInputChange = (opCode, value) => {
    validateInput(opCode, value)
    onInputChange(opCode, value)
  }


  const stats = data?.reduce((acc, item) => {
    const opCode = item.operation_code || item.op_code
    const current = parseInt(input[opCode]) || 0
    const target = parseInt(item.target) || 0
    acc.totalOutput += current
    acc.totalTarget += target
    return acc
  }, { totalOutput: 0, totalTarget: 0 }) || { totalOutput: 0, totalTarget: 0 }

  const achievementPercentage = stats.totalTarget > 0 
    ? Math.round((stats.totalOutput / stats.totalTarget) * 100) 
    : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .modal-content {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col modal-content">
        
        {/* Header - Improved with gradient */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 border-b border-amber-600/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur">
              <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Production Output</h2>
              <p className="text-sm text-amber-50 mt-1">Edit and save your production data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={24} className="text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Stats Bar - NEW */}
        {data && data.length > 0 && !loading && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200 flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-amber-600">{data.length}</div>
              <div className="text-sm text-slate-600">Operations</div>
            </div>
            <div className="h-6 w-px bg-amber-300"></div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">{stats.totalOutput}</div>
              <div className="text-sm text-slate-600">Total Output</div>
            </div>
            <div className="h-6 w-px bg-amber-300"></div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">{stats.totalTarget}</div>
              <div className="text-sm text-slate-600">Total Target</div>
            </div>
            <div className="h-6 w-px bg-amber-300"></div>
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${achievementPercentage >= 100 ? 'text-emerald-600' : 'text-orange-600'}`}>
                {achievementPercentage}%
              </div>
              <div className="text-sm text-slate-600">Achievement</div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading update data...</p>
              <p className="text-sm text-gray-400 mt-2">Please wait</p>
            </div>
          ) : data && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-300">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Process Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Operator</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Target</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">New Output</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => {
                    const opCode = item.operation_code || item.op_code
                    const target = parseInt(item.target) || 0
                    const hasError = errors[opCode]

                    return (
                      <tr
                        key={idx}
                        onMouseEnter={() => setHoveredRow(idx)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={`border-b border-gray-200 transition-all duration-200 ${
                          hoveredRow === idx ? 'bg-amber-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                            {opCode || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.operation_name || item.op_name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.name || '-'}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-700">
                          {Math.round(target)}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <input
                              type="number"
                              min="0"
                              value={input[opCode] ?? ''}
                              onChange={(e) => handleInputChange(opCode, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg text-sm text-right font-semibold transition-all duration-200 ${
                                hasError
                                  ? 'border-2 border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500'
                                  : 'border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500'
                              }`}
                              placeholder="0"
                            />
                            {hasError && (
                              <p className="text-xs text-red-600 mt-1">{hasError}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <AlertCircle size={32} className="text-slate-400" />
              </div>
              <p className="text-gray-600 font-medium">No update data available</p>
              <p className="text-sm text-gray-400 mt-2">Data count: {data?.length || 0}</p>
            </div>
          )}
        </div>

        {/* Footer - Improved */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading || Object.keys(errors).length > 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} strokeWidth={2.5} />
            {loading ? 'Saving...' : 'Save Update'}
          </button>
        </div>
      </div>
    </div>
  )
}