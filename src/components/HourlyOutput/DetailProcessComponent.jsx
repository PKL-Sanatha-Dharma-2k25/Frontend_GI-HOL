import { memo, useState } from 'react'
import { Save, Plus, Trash2, ChevronDown, Download, AlertCircle, CheckCircle2 } from 'lucide-react'

const DetailProcessComponent = memo(({
  detailProcessData = [
    { op_code: '1A', op_name: 'Cutting', name: 'John', target_per_day: 100 },
    { op_code: '1B', op_name: 'Sewing', name: 'Jane', target_per_day: 150 },
    { op_code: '1C', op_name: 'Finishing', name: 'Bob', target_per_day: 120 }
  ],
  detailProcessInput = { '1A': '', '1B': '', '1C': '' },
  currentHeaderData = { orc: 'ORC-01', style: 'Style-A', date: '2024-01-12', hour: '08' },
  loadingDetail = false,
  loading = false,
  onActualOutputChange = () => {},
  onSaveDetailProcess = () => {},
  onCancelDetailProcess = () => {}
}) => {
  const [addedRows, setAddedRows] = useState([])
  const [nextTempId, setNextTempId] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [iotStatus, setIotStatus] = useState('idle')
  const [iotMessage, setIotMessage] = useState('')
  const [showTestData, setShowTestData] = useState(false)

  const handleFillFromLocalStorage = () => {
    setIotStatus('loading')
    setIotMessage('Reading from IoT device...')
    
    try {
      const iotData = localStorage.getItem('iot_output_data')
      
      if (!iotData) {
        setIotStatus('error')
        setIotMessage('No IoT data found. Generate test data first!')
        setTimeout(() => setIotStatus('idle'), 4000)
        return
      }

      const data = JSON.parse(iotData)
      let outputMap = {}
      
      if (Array.isArray(data)) {
        data.forEach(item => {
          outputMap[item.op_code] = item.output || 0
        })
      } else if (typeof data === 'object') {
        outputMap = data
      }

      let filledCount = 0
      detailProcessData.forEach(item => {
        const opCode = item.op_code
        if (outputMap[opCode] !== undefined) {
          onActualOutputChange(opCode, outputMap[opCode])
          filledCount++
        }
      })

      setIotStatus('success')
      setIotMessage(`Successfully filled ${filledCount} outputs`)
      setTimeout(() => setIotStatus('idle'), 4000)

    } catch (error) {
      setIotStatus('error')
      setIotMessage(`Error: ${error.message}`)
      setTimeout(() => setIotStatus('idle'), 4000)
    }
  }

  const handleGenerateTestData = () => {
    try {
      const testData = {}
      detailProcessData.forEach(item => {
        testData[item.op_code] = Math.floor(Math.random() * 100 + 100)
      })
      localStorage.setItem('iot_output_data', JSON.stringify(testData))
      
      setIotStatus('success')
      setIotMessage(`Generated ${Object.keys(testData).length} test items`)
      setShowTestData(false)
      setTimeout(() => setIotStatus('idle'), 3000)
    } catch (error) {
      setIotStatus('error')
      setIotMessage(`Error: ${error.message}`)
      setTimeout(() => setIotStatus('idle'), 3000)
    }
  }

  const handleAddRow = () => {
    const code = document.getElementById('new_code').value
    const process = document.getElementById('new_process').value
    const operator = document.getElementById('new_operator').value
    const target = document.getElementById('new_target').value
    const output = document.getElementById('new_output').value

    if (code && process && operator) {
      setAddedRows([...addedRows, {
        temp_id: `added_${nextTempId}`,
        op_code: code,
        op_name: process,
        name: operator,
        target_per_day: target,
        actual_output: output
      }])
      setNextTempId(nextTempId + 1)
      document.getElementById('new_code').value = ''
      document.getElementById('new_process').value = ''
      document.getElementById('new_operator').value = ''
      document.getElementById('new_target').value = ''
      document.getElementById('new_output').value = ''
      setShowAddForm(false)
    }
  }

  const handleDeleteRow = (tempId) => {
    setAddedRows(addedRows.filter(row => row.temp_id !== tempId))
  }

  const allData = [...detailProcessData, ...addedRows]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
        <h2 className="text-xl font-bold text-white">Production Details</h2>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-blue-100">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            {currentHeaderData?.orc}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            {currentHeaderData?.style}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            {currentHeaderData?.date}
          </span>
          <span className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            {currentHeaderData?.hour}:00
          </span>
        </div>
      </div>

      {/* IoT Section */}
      <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-blue-50 px-6 py-4 border-b border-cyan-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
            <button
              onClick={handleFillFromLocalStorage}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Download size={18} />
              <span>Fill from IoT</span>
            </button>

            <button
              onClick={() => setShowTestData(!showTestData)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <span>🧪</span>
              <span>Test Data</span>
            </button>
          </div>

          {iotStatus !== 'idle' && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${
              iotStatus === 'success' ? 'bg-emerald-100 text-emerald-700' :
              iotStatus === 'error' ? 'bg-rose-100 text-rose-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {iotStatus === 'success' && <CheckCircle2 size={16} />}
              {iotStatus === 'error' && <AlertCircle size={16} />}
              {iotMessage}
            </div>
          )}
        </div>
      </div>

      {/* Test Data Modal */}
      {showTestData && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">Generate Test Data</h3>
              <p className="text-xs text-amber-700 mt-1">For testing when IoT device is not ready</p>
            </div>
            <button
              onClick={handleGenerateTestData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-semibold transition-all whitespace-nowrap"
            >
              ✅ Generate
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-b-blue-600"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading details...</span>
          </div>
        ) : allData.length > 0 ? (
          <>
            {/* Data Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Process</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Operator</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Target/Hour</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Actual Output</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allData.map((row, idx) => (
                    <tr key={row.temp_id || idx} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {row.op_code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{row.op_name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.name}</td>
                      <td className="px-4 py-3 text-right text-gray-700 font-medium">{Math.round(row.target_per_day) || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          min="0"
                          value={detailProcessInput[row.op_code] ?? ''}
                          onChange={(e) => onActualOutputChange(row.op_code, e.target.value)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right font-medium transition-all ml-auto"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Data Section */}
            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-blue-300 text-blue-700 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 transition-all"
              >
                <Plus size={18} />
                Add Entry
                <ChevronDown size={16} className={`transition-transform duration-300 ${showAddForm ? 'rotate-180' : ''}`} />
              </button>

              {showAddForm && (
                <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                  <h3 className="text-sm font-bold text-blue-900 mb-4">Add New Entry</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Code</label>
                      <input
                        type="text"
                        id="new_code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        placeholder="e.g. 2A"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Process</label>
                      <input
                        type="text"
                        id="new_process"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        placeholder="e.g. Packing"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Operator</label>
                      <input
                        type="text"
                        id="new_operator"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        placeholder="e.g. Ali"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Target</label>
                      <input
                        type="number"
                        id="new_target"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Output</label>
                      <input
                        type="number"
                        id="new_output"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddRow}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2.5 border-2 border-blue-300 text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Added Rows */}
            {addedRows.length > 0 && (
              <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                <h3 className="text-sm font-bold text-blue-900 mb-3">Added Entries ({addedRows.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {addedRows.map((row) => (
                    <div key={row.temp_id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">{row.op_code}</span>
                          <span className="text-gray-600">{row.op_name}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{row.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteRow(row.temp_id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all ml-2 flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
              <button
                onClick={onCancelDetailProcess}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onSaveDetailProcess}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2 text-3xl">📋</div>
            <p className="text-gray-600 font-medium">No production data available</p>
          </div>
        )}
      </div>
    </div>
  )
})

DetailProcessComponent.displayName = 'DetailProcessComponent'
export default DetailProcessComponent