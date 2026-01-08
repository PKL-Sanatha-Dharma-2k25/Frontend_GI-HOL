import { memo, useState } from 'react'
import { Save, Plus, Trash2, ChevronDown } from 'lucide-react'
import DataTable from '@/components/tables/DataTable'

const DetailProcessComponent = memo(({
  detailProcessData,
  detailProcessInput,
  currentHeaderData,
  loadingDetail,
  loading,
  onActualOutputChange,
  onSaveDetailProcess,
  onCancelDetailProcess
}) => {
  const [addedRows, setAddedRows] = useState([])
  const [nextTempId, setNextTempId] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)

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
    <div className="bg-white rounded-xl border-2 border-blue-200 shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <h2 className="text-lg font-bold text-gray-900">Detail Production Process</h2>
        <p className="text-sm text-gray-600 mt-1">
          {currentHeaderData?.orc} • {currentHeaderData?.style} • {currentHeaderData?.date} Hour {currentHeaderData?.hour}:00
        </p>
      </div>

      <div className="p-6">
        {loadingDetail ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading detail process...</span>
          </div>
        ) : allData.length > 0 ? (
          <>
            <DataTable
              columns={[
                { key: 'op_code', label: 'Code', width: '15%' },
                { key: 'op_name', label: 'Process', width: '35%' },
                { key: 'name', label: 'Operator', width: '20%' },
                {
                  key: 'target_per_day',
                  label: 'Target / Hour',
                  width: '15%',
                  render: (value) => <span className="text-right block">{Math.round(value) || 0}</span>
                },
                {
                  key: 'op_code',
                  label: 'Actual Output',
                  width: '15%',
                  render: (value, row) => (
                    <input
                      type="number"
                      min="0"
                      value={detailProcessInput[row.op_code] ?? ''}
                      onChange={(e) => onActualOutputChange(row.op_code, e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-right"
                      placeholder="0"
                    />
                  )
                }
              ]}
              data={allData}
              striped={true}
              hover={true}
              loading={loadingDetail}
              emptyMessage="No detail process data"
              sortable={true}
              searchable={false}
            />

            {/* Add Data Section */}
            <div className="mt-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
              >
                <Plus size={18} />
                Add Data
                <ChevronDown size={16} className={`transition-transform ${showAddForm ? 'rotate-180' : ''}`} />
              </button>

              {/* Form */}
              {showAddForm && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-4">Add New Entry</h3>
                  <div className="grid grid-cols-5 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Code</label>
                      <input
                        type="text"
                        id="new_code"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        placeholder="Operation code"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Process</label>
                      <input
                        type="text"
                        id="new_process"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        placeholder="Process name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
                      <input
                        type="text"
                        id="new_operator"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        placeholder="Operator name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Target/Hour</label>
                      <input
                        type="number"
                        id="new_target"
                        min="0"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Output</label>
                      <input
                        type="number"
                        id="new_output"
                        min="0"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddRow}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-3 py-2 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Display Added Rows */}
            {addedRows.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Added Entries</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {addedRows.map((row) => (
                    <div key={row.temp_id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 text-sm">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{row.op_code}</span>
                        <span className="text-gray-600 ml-3">{row.op_name}</span>
                        <span className="text-gray-500 ml-2">•</span>
                        <span className="text-gray-600 ml-2">{row.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteRow(row.temp_id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors ml-2"
                        title="Delete row"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onCancelDetailProcess}
                disabled={loading}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onSaveDetailProcess}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Detail'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No detail process data</p>
          </div>
        )}
      </div>
    </div>
  )
})

DetailProcessComponent.displayName = 'DetailProcessComponent'
export default DetailProcessComponent