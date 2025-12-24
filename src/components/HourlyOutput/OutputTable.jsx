

import { Eye, Edit } from 'lucide-react'
import DataTable from '@/components/tables/DataTable'

export default function OutputTable({
  data,
  loading,
  onDetailClick,
  onUpdateClick
}) {
  console.log('📊 [OutputTable] Received data:', data)

  // Debug: Log setiap item untuk cek id_output
  data.forEach((item, idx) => {
    console.log(`📊 [OutputTable] Item ${idx}:`, {
      id_output: item.id_output,
      id: item.id,
      idOutput: item.idOutput,
      date: item.date,
      hour: item.hour,
      style: item.style,
      orc: item.orc,
      status: item.status
    })
  })

  // Warning jika tidak ada id
  const missingIds = data.filter(item => !item.id_output && !item.id && !item.idOutput)
  if (missingIds.length > 0) {
    console.warn(`⚠️ [OutputTable] ${missingIds.length} items tidak punya id_output!`)
  }

  const tableColumns = [
    { key: 'date', label: 'Date', width: '12%' },
    { key: 'hour', label: 'Hour', width: '8%' },
    {
      key: 'orc',
      label: 'ORC',
      width: '16%',
      render: (value) => <span className="font-semibold text-blue-600">{value}</span>
    },
    { key: 'style', label: 'Style', width: '28%' },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (value) => (
        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
          value === 1 || value === '1'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${
            value === 1 || value === '1' ? 'bg-green-600' : 'bg-red-600'
          }`}></span>
          {value === 1 || value === '1' ? 'Completed' : 'Pending'}
        </span>
      )
    },
    {
      key: 'action',
      label: 'Action',
      width: '24%',
      render: (value, row) => {
        console.log('🔘 [Action Button] row data:', row)
        console.log('🔘 [Action Button] id_output value:', row.id_output)
        
        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                console.log('👁️ [DETAIL BUTTON CLICKED] id_output:', row.id_output)
                onDetailClick(row.id_output)
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-xs font-medium"
              title="View detail"
            >
              <Eye size={16} />
              Detail
            </button>
            <button
              onClick={() => {
                console.log('✏️ [UPDATE BUTTON CLICKED] id_output:', row.id_output)
                onUpdateClick(row.id_output)
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors text-xs font-medium"
              title="Update"
            >
              <Edit size={16} />
              Update
            </button>
          </div>
        )
      }
    }
  ]

  return (
    <DataTable
      columns={tableColumns}
      data={data}
      striped={true}
      hover={true}
      loading={loading}
      emptyMessage="No output data"
      sortable={true}
      searchable={false}
    />
  )
}
