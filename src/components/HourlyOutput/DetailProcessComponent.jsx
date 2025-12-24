import { memo } from 'react'
import { Save } from 'lucide-react'
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
}) => (
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
      ) : detailProcessData.length > 0 ? (
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
                    value={detailProcessInput[row.op_code] ?? 0}
                    onChange={(e) => onActualOutputChange(row.op_code, e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-right"
                    placeholder="0"
                  />
                )
              }
            ]}
            data={detailProcessData}
            striped={true}
            hover={true}
            loading={loadingDetail}
            emptyMessage="No detail process data"
            sortable={true}
            searchable={false}
          />

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
))

DetailProcessComponent.displayName = 'DetailProcessComponent'
export default DetailProcessComponent