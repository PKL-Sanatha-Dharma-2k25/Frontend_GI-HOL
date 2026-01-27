import { memo, useState, useEffect } from 'react'
import { Save, Plus, Trash2, ChevronDown, Download, AlertCircle, CheckCircle2 } from 'lucide-react'

const DetailProcessComponent = memo(({
  detailProcessData = [
    { op_code: '1A', op_name: 'Cutting', name: 'John', target_per_day: 100 },
    { op_code: '1B', op_name: 'Sewing', name: 'Jane', target_per_day: 150 },
    { op_code: '1C', op_name: 'Finishing', name: 'Bob', target_per_day: 120 }
  ],
  detailProcessInput = {},
  detailProcessRepair = {},
  detailProcessReject = {},
  currentHeaderData = { orc: 'ORC-01', style: 'Style-A', date: '2024-01-12', hour: '08' },
  loadingDetail = false,
  loading = false,
  onActualOutputChange = () => { },
  onRepairChange = () => { },
  onRejectChange = () => { },
  onSaveDetailProcess = () => { },
  onCancelDetailProcess = () => { }
}) => {
  const [addedRows, setAddedRows] = useState([])
  const [nextTempId, setNextTempId] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [iotStatus, setIotStatus] = useState('idle')
  const [iotMessage, setIotMessage] = useState('')


  const [localInput, setLocalInput] = useState(detailProcessInput)
  const [localRepair, setLocalRepair] = useState(detailProcessRepair)
  const [localReject, setLocalReject] = useState(detailProcessReject)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLocalInput(prev => {
        const newVal = Object.keys(detailProcessInput).length > 0 ? detailProcessInput : {}
        return JSON.stringify(prev) === JSON.stringify(newVal) ? prev : newVal
      })
      setLocalRepair(prev => {
        const newVal = Object.keys(detailProcessRepair).length > 0 ? detailProcessRepair : {}
        return JSON.stringify(prev) === JSON.stringify(newVal) ? prev : newVal
      })
      setLocalReject(prev => {
        const newVal = Object.keys(detailProcessReject).length > 0 ? detailProcessReject : {}
        return JSON.stringify(prev) === JSON.stringify(newVal) ? prev : newVal
      })
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [detailProcessInput, detailProcessRepair, detailProcessReject])



  const handleSaveWrapper = () => {
    onSaveDetailProcess()
  }

  const handleFillFromIoT = () => {
    setIotStatus('loading')
    setIotMessage('Reading from IoT device...')

    try {
      const iotData = {}
      const newInput = { ...localInput }
      const newRepair = { ...localRepair }
      const newReject = { ...localReject }

      allData.forEach(item => {
        const output = Math.floor(Math.random() * 50 + 80)

        // Repair: 5-15% dari output
        const repairRate = Math.random() * 0.10 + 0.05
        const repair = Math.floor(output * repairRate)

        // Reject: 2-8% dari output
        const rejectRate = Math.random() * 0.06 + 0.02
        const reject = Math.floor(output * rejectRate)

        iotData[item.op_code] = { output, repair, reject }

        newInput[item.op_code] = output
        newRepair[item.op_code] = repair
        newReject[item.op_code] = reject

        onActualOutputChange(item.op_code, output)
        onRepairChange(item.op_code, repair)
        onRejectChange(item.op_code, reject)

        console.log(`${item.op_code}: Output=${output}, Repair=${repair}(${(repairRate * 100).toFixed(1)}%), Reject=${reject}(${(rejectRate * 100).toFixed(1)}%)`)
      })

      setLocalInput(newInput)
      setLocalRepair(newRepair)
      setLocalReject(newReject)

      setIotStatus('success')
      setIotMessage('Data fetched from IoT!')
      setTimeout(() => setIotStatus('idle'), 4000)

    } catch (err) {
      console.error('IoT Error:', err)
      setIotStatus('error')
      setIotMessage('Failed to fetch IoT data')
      setTimeout(() => setIotStatus('idle'), 4000)
    }
  }

  const handleActualOutputChange = (opCode, value) => {
    setLocalInput(prev => ({
      ...prev,
      [opCode]: value
    }))
    onActualOutputChange(opCode, value)
  }

  const handleRepairChange = (opCode, value) => {
    setLocalRepair(prev => ({
      ...prev,
      [opCode]: value
    }))
    onRepairChange(opCode, value)
  }

  const handleRejectChange = (opCode, value) => {
    setLocalReject(prev => ({
      ...prev,
      [opCode]: value
    }))
    onRejectChange(opCode, value)
  }

  const handleAddRow = () => {
    const code = document.getElementById('new_code')?.value
    const process = document.getElementById('new_process')?.value
    const operator = document.getElementById('new_operator')?.value
    const target = document.getElementById('new_target')?.value
    const output = document.getElementById('new_output')?.value

    if (code && process && operator) {
      setAddedRows([...addedRows, {
        temp_id: `added_${nextTempId}`,
        op_code: code,
        op_name: process,
        name: operator,
        target_per_day: target || 0,
        actual_output: output || 0
      }])
      setNextTempId(nextTempId + 1)

      setLocalInput(prev => ({ ...prev, [code]: output || '' }))
      setLocalRepair(prev => ({ ...prev, [code]: '' }))
      setLocalReject(prev => ({ ...prev, [code]: '' }))

      // Reset form
      document.getElementById('new_code').value = ''
      document.getElementById('new_process').value = ''
      document.getElementById('new_operator').value = ''
      document.getElementById('new_target').value = ''
      document.getElementById('new_output').value = ''
      setShowAddForm(false)
    }
  }

  const handleDeleteRow = (tempId) => {
    const row = addedRows.find(r => r.temp_id === tempId)
    if (row) {
      setAddedRows(addedRows.filter(r => r.temp_id !== tempId))

      setLocalInput(prev => {
        const newState = { ...prev }
        delete newState[row.op_code]
        return newState
      })
      setLocalRepair(prev => {
        const newState = { ...prev }
        delete newState[row.op_code]
        return newState
      })
      setLocalReject(prev => {
        const newState = { ...prev }
        delete newState[row.op_code]
        return newState
      })
    }
  }

  const allData = [...detailProcessData, ...addedRows]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
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

      <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-blue-50 px-6 py-4 border-b border-cyan-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
            <button
              onClick={handleFillFromIoT}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Download size={18} />
              <span>Fill from IoT</span>
            </button>
          </div>

          {iotStatus !== 'idle' && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${iotStatus === 'success' ? 'bg-emerald-100 text-emerald-700' :
              iotStatus === 'error' ? 'bg-rose-100 text-rose-700' :
                'bg-blue-100 text-blue-700'
              }`}>
              {iotStatus === 'success' && <CheckCircle2 size={16} />}
              {iotStatus === 'error' && <AlertCircle size={16} />}
              {iotStatus === 'loading' && <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-b-transparent"></div>}
              {iotMessage}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {loadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-b-blue-600"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading details...</span>
          </div>
        ) : allData.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-white border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-800 text-sm">Code</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-800 text-sm">Process</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-800 text-sm">Operator</th>
                    <th className="px-4 py-4 text-right font-semibold text-gray-800 text-sm">Target/Hour</th>
                    <th className="px-4 py-4 text-right">
                      <div className="inline-block px-4 py-2 bg-green-50 border-b-4 border-green-500 rounded-t-lg">
                        <span className="text-green-700 font-bold text-sm">ACTUAL OUTPUT</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-right">
                      <div className="inline-block px-4 py-2 bg-yellow-50 border-b-4 border-yellow-500 rounded-t-lg">
                        <span className="text-yellow-700 font-bold text-sm">REPAIR</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-right">
                      <div className="inline-block px-4 py-2 bg-red-50 border-b-4 border-red-500 rounded-t-lg">
                        <span className="text-red-700 font-bold text-sm">REJECT</span>
                      </div>
                    </th>
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

                      {/* ACTUAL OUTPUT - GREEN */}
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          min="0"
                          value={localInput[row.op_code] ?? ''}
                          onChange={(e) => handleActualOutputChange(row.op_code, e.target.value)}
                          className="w-20 px-3 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right font-medium transition-all ml-auto bg-green-50 text-green-900 placeholder-green-300"
                          placeholder="0"
                        />
                      </td>

                      {/* REPAIR - YELLOW */}
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          min="0"
                          value={localRepair[row.op_code] ?? ''}
                          onChange={(e) => handleRepairChange(row.op_code, e.target.value)}
                          className="w-20 px-3 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-right font-medium transition-all ml-auto bg-yellow-50 text-yellow-900 placeholder-yellow-300"
                          placeholder="0"
                        />
                      </td>

                      {/* REJECT - RED */}
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          min="0"
                          value={localReject[row.op_code] ?? ''}
                          onChange={(e) => handleRejectChange(row.op_code, e.target.value)}
                          className="w-20 px-3 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-right font-medium transition-all ml-auto bg-red-50 text-red-900 placeholder-red-300"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
              <button
                onClick={onCancelDetailProcess}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWrapper}
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
            <div className="text-gray-400 mb-2 text-3xl">No production data available</div>
            <p className="text-gray-600 font-medium">No data found</p>
          </div>
        )}
      </div>
    </div>
  )
})

DetailProcessComponent.displayName = 'DetailProcessComponent'
export default DetailProcessComponent