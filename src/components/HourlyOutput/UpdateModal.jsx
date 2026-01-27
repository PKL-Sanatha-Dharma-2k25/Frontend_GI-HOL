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
    if (isNaN(numValue) || numValue < 0) {
      setErrors(prev => ({ ...prev, [opCode]: isNaN(numValue) ? 'Invalid' : 'Negative' }))
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
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-content { animation: slideDown 0.3s ease-out; }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col modal-content">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-5 border-b border-amber-600/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur">
              <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Update Production</h2>
              <p className="text-sm text-amber-50 mt-1">Adjust and save output data</p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 hover:bg-white/20 rounded-lg text-white disabled:opacity-50"><X size={24} strokeWidth={2.5} /></button>
        </div>

        {data && data.length > 0 && !loading && (
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex gap-6 flex-wrap items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-600">{data.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operations</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">{stats.totalOutput}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Output</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-600">{stats.totalTarget}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${achievementPercentage >= 100 ? 'text-emerald-600' : 'text-orange-600'}`}>{achievementPercentage}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rate</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium mt-4">Loading data...</p>
            </div>
          ) : data && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Process</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operator</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Input</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item, idx) => {
                    const opCode = item.operation_code || item.op_code
                    const target = parseInt(item.target) || 0
                    const hasError = errors[opCode]

                    return (
                      <tr key={idx} onMouseEnter={() => setHoveredRow(idx)} onMouseLeave={() => setHoveredRow(null)} className={`transition-colors ${hoveredRow === idx ? 'bg-amber-50/30' : ''}`}>
                        <td className="px-4 py-3"><span className="font-mono text-xs font-bold text-blue-600">{opCode || '-'}</span></td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">{item.operation_name || item.op_name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{item.name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-right font-medium text-slate-500">{Math.round(target)}</td>
                        <td className="px-4 py-3 w-32">
                          <input
                            type="number"
                            min="0"
                            value={input[opCode] ?? ''}
                            onChange={(e) => handleInputChange(opCode, e.target.value)}
                            className={`w-full px-3 py-1.5 rounded-lg text-sm text-right font-bold focus:outline-none transition-all ${hasError ? 'border-2 border-rose-500 bg-rose-50' : 'border border-slate-200 focus:border-amber-500 bg-white'
                              }`}
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">No data available</div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} disabled={loading} className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-white transition-all active:scale-95 shadow-sm">Cancel</button>
          <button
            onClick={onSave}
            disabled={loading || Object.keys(errors).length > 0}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold text-xs hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save size={16} strokeWidth={2.5} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}