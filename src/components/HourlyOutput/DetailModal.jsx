import { X, Eye, TrendingUp, BarChart3, Users } from 'lucide-react'
import { useState } from 'react'

export default function DetailModal({ isOpen, data, loading, onClose }) {
  const [hoveredRow, setHoveredRow] = useState(null)

  if (!isOpen) return null

  console.log('👁️ [DetailModal] data:', data)


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
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 px-6 py-5 border-b border-blue-600/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur">
              <Eye size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Detail Production Output</h2>
              <p className="text-sm text-blue-50 mt-1">View complete production data</p>
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
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-200 grid grid-cols-4 gap-4">

            {/* Operations Count */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200/50 hover:border-blue-400 transition-colors">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Operations</p>
                <p className="text-xl font-bold text-blue-600">{stats.totalOperations}</p>
              </div>
            </div>

            {/* Total Output */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200/50 hover:border-emerald-400 transition-colors">
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Total Output</p>
                <p className="text-xl font-bold text-emerald-600">{stats.totalOutput}</p>
              </div>
            </div>

            {/* Total Target */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200/50 hover:border-orange-400 transition-colors">
              <div className="p-2.5 bg-orange-100 rounded-lg">
                <Users size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Total Target</p>
                <p className="text-xl font-bold text-orange-600">{stats.totalTarget}</p>
              </div>
            </div>

            {/* Achievement */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200/50 hover:border-purple-400 transition-colors">
              <div className={`p-2.5 rounded-lg ${achievementPercentage >= 100
                ? 'bg-emerald-100'
                : achievementPercentage >= 80
                  ? 'bg-amber-100'
                  : 'bg-red-100'
                }`}>
                <BarChart3 size={20} className={
                  achievementPercentage >= 100
                    ? 'text-emerald-600'
                    : achievementPercentage >= 80
                      ? 'text-amber-600'
                      : 'text-red-600'
                } />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Achievement</p>
                <p className={`text-xl font-bold ${achievementPercentage >= 100
                  ? 'text-emerald-600'
                  : achievementPercentage >= 80
                    ? 'text-amber-600'
                    : 'text-red-600'
                  }`}>{achievementPercentage}%</p>
              </div>
            </div>

          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading detail data...</p>
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
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Target/Hour</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Output</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Variance</th>
                  </tr>
                </thead>
                <tbody>
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
                        className={`border-b border-gray-200 transition-all duration-200 ${hoveredRow === idx ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                      >
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                            {item.operation_code || item.op_code || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.operation_name || item.op_name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-700">
                          {Math.round(target)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className="inline-block px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                            {output}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${variance >= 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {variance >= 0 ? '+' : ''}{variance}
                            <span className="text-xs opacity-75">({variancePercentage > 0 ? '+' : ''}{variancePercentage}%)</span>
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
                <Eye size={32} className="text-slate-400" />
              </div>
              <p className="text-gray-600 font-medium">No detail data available</p>
              <p className="text-sm text-gray-400 mt-2">Data count: {data?.length || 0}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}