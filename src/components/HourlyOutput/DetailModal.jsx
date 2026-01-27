import { X, Eye, TrendingUp, BarChart3, Users } from 'lucide-react'
import { useState } from 'react'

export default function DetailModal({ isOpen, data, loading, onClose }) {
  const [hoveredRow, setHoveredRow] = useState(null)

  if (!isOpen) return null

  const stats = data?.reduce((acc, item) => {
    acc.totalOutput += parseInt(item.output) || 0
    acc.totalTarget += parseInt(item.target) || 0
    acc.totalOperations += 1
    return acc
  }, { totalOutput: 0, totalTarget: 0, totalOperations: 0 }) || { totalOutput: 0, totalTarget: 0, totalOperations: 0 }

  const achievementPercentage = stats.totalTarget > 0
    ? Math.round((stats.totalOutput / stats.totalTarget) * 100)
    : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-content { animation: slideDown 0.3s ease-out; }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col modal-content">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 border-b border-blue-600/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur">
              <Eye size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Production Details</h2>
              <p className="text-sm text-blue-50 mt-1">Complete production summary</p>
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

        {data && data.length > 0 && !loading && (
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operations</p>
                <p className="text-lg font-bold text-slate-700">{stats.totalOperations}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Output</p>
                <p className="text-lg font-bold text-emerald-600">{stats.totalOutput}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target</p>
                <p className="text-lg font-bold text-amber-600">{stats.totalTarget}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <div className={`p-2.5 rounded-lg ${achievementPercentage >= 100 ? 'bg-emerald-50 text-emerald-600' : achievementPercentage >= 80 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rate</p>
                <p className={`text-lg font-bold ${achievementPercentage >= 100 ? 'text-emerald-600' : achievementPercentage >= 80 ? 'text-amber-600' : 'text-rose-600'}`}>{achievementPercentage}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium mt-4">Loading details...</p>
            </div>
          ) : data && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Process</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operator</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Output</th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Var</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item, idx) => {
                    const target = parseInt(item.target) || 0
                    const output = parseInt(item.output) || 0
                    const variance = output - target
                    const variancePercentage = target > 0 ? Math.round((variance / target) * 100) : 0

                    return (
                      <tr
                        key={idx}
                        onMouseEnter={() => setHoveredRow(idx)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={`transition-colors ${hoveredRow === idx ? 'bg-slate-50' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-blue-600">{item.operation_code || item.op_code || '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">{item.operation_name || item.op_name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{item.name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-right font-medium text-slate-500">{Math.round(target)}</td>
                        <td className="px-4 py-3 text-xs text-right font-bold text-emerald-600">{output}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${variance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {variance >= 0 ? '+' : ''}{variance} ({variancePercentage}%)
                          </span>
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

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}