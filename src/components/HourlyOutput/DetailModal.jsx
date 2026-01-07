import { X } from 'lucide-react'

export default function UpdateModal({ isOpen, data, updateInput, loading, onInputChange, onSave, onClose }) {
  if (!isOpen) return null

  console.log('✏️ [UpdateModal] data:', data)
  console.log('✏️ [UpdateModal] updateInput:', updateInput)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Update Production Output</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-200 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Loading update data...</span>
            </div>
          ) : data && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50 border-b-2 border-green-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Process</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Operator</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Target/Hour</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Output</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => {
                    const opCode = item.operation_code || item.op_code
                    const inputValue = updateInput[opCode] ?? ''
                    
                    return (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-green-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{opCode || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.operation_name || item.op_name || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.name || '-'}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">{Math.round(item.target || 0)}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <input
                            type="number"
                            min="0"
                            value={inputValue}
                            onChange={(e) => onInputChange(opCode, e.target.value)}
                            placeholder="0"
                            disabled={loading}
                            className="w-20 px-3 py-2 border border-green-300 rounded-lg text-right font-semibold text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No data available</p>
              <p className="text-sm text-gray-400 mt-2">Data count: {data?.length || 0}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}