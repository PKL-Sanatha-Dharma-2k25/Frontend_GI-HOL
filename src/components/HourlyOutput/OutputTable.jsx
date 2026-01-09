import { Eye, Edit } from 'lucide-react'
import DataTable from '@/components/tables/DataTable'
import { getDetailOutputByStyle } from '@/services/apiService'

export default function OutputTable({
  data,
  loading,
  onDetailClick,
  onUpdateClick,
  userIdLine  // 🆕 ADD THIS - dari user login
}) {
  console.log('📊 [OutputTable] Received data:', data)
  console.log('📊 [OutputTable] User ID Line:', userIdLine)  // 🆕 Log user lane

  // ⭐ HELPER FUNCTION: Fetch id_output dari detail
  const getIdOutputFromDetail = async (style) => {
    try {
      console.log(`🔍 [getIdOutputFromDetail] Fetching for style: ${style}, idLine: ${userIdLine}`)
      const detailResponse = await getDetailOutputByStyle(style, userIdLine)  // 🆕 Pakai userIdLine
      const details = detailResponse.data || detailResponse
      
      console.log(`📥 [getIdOutputFromDetail] Detail response:`, details)
      
      if (Array.isArray(details) && details.length > 0) {
        const idOutput = details[0].id_output
        console.log(`✅ [getIdOutputFromDetail] Found id_output: ${idOutput}`)
        return idOutput
      } else {
        console.error('❌ [getIdOutputFromDetail] No detail data found')
        return null
      }
    } catch (error) {
      console.error('❌ [getIdOutputFromDetail] Error:', error)
      return null
    }
  }

  // ⭐ HANDLER: Detail Click
  const handleDetailClick = async (row) => {
    console.log('👁️ [handleDetailClick] Clicked row:', row)
    
    let idOutput = row.id_output
    console.log('   Current id_output from row:', idOutput)
    
    if (!idOutput) {
      console.log('   id_output not in row, fetching from detail...')
      idOutput = await getIdOutputFromDetail(row.style)  // 🆕 Hapus hardcoded 59
      
      if (!idOutput) {
        console.error('❌ Cannot find id_output')
        alert('❌ Error: Cannot load detail. Missing ID.')
        return
      }
    }
    
    console.log(`✅ [handleDetailClick] Calling onDetailClick with id: ${idOutput}`)
    onDetailClick(idOutput)
  }

  // ⭐ HANDLER: Update Click
  const handleUpdateClick = async (row) => {
    console.log('✏️ [handleUpdateClick] Clicked row:', row)
    
    let idOutput = row.id_output
    console.log('   Current id_output from row:', idOutput)
    
    if (!idOutput) {
      console.log('   id_output not in row, fetching from detail...')
      idOutput = await getIdOutputFromDetail(row.style)  // 🆕 Hapus hardcoded 59
      
      if (!idOutput) {
        console.error('❌ Cannot find id_output')
        alert('❌ Error: Cannot update. Missing ID.')
        return
      }
    }
    
    console.log(`✅ [handleUpdateClick] Calling onUpdateClick with id: ${idOutput}`)
    onUpdateClick(idOutput)
  }

  // ⭐ TABLE COLUMNS CONFIG
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
        console.log(`🔘 [Action Button] Row:`, {
          date: row.date,
          hour: row.hour,
          style: row.style,
          id_output: row.id_output,
          id_line: row.id_line
        })
        
        return (
          <div className="flex justify-center gap-2">
            {/* Detail Button */}
            <button
              onClick={() => handleDetailClick(row)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-xs font-medium"
              title="View detail"
            >
              <Eye size={16} />
              Detail
            </button>
            
            {/* Update Button */}
            <button
              onClick={() => handleUpdateClick(row)}
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