// ============================================
// FILE 7: /components/dashboard/ProcessDetailsTable.jsx
// ============================================
import { Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import DataTable from '@/components/tables/DataTable'

function ProcessDetailsTable({ data = [], loading = false }) {
  const processColumns = [
    {
      key: 'operation_code',
      label: 'Code',
      width: '10%',
      render: (value) => <span className="font-bold text-blue-600">{value}</span>
    },
    {
      key: 'operation_name',
      label: 'Operation Name',
      width: '40%',
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      key: 'output',
      label: 'Output',
      width: '15%',
      render: (value) => <span className="font-semibold text-blue-600">{value}</span>
    },
    {
      key: 'target',
      label: 'Target',
      width: '15%',
      render: (value) => <span className="font-semibold text-red-600">{value}</span>
    },
    {
      key: 'output',
      label: 'Achievement',
      width: '20%',
      render: (value, row) => {
        const percentage = row.target > 0 ? Math.round((value / row.target) * 100) : 0
        const status = percentage >= 100 ? 'bg-green-100 text-green-800' : 
                       percentage >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                       'bg-red-100 text-red-800'
        return (
          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${status}`}>
            {percentage}%
          </span>
        )
      }
    }
  ]

  return (
    <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-display">Detailed Summary</h3>
          <p className="text-xs text-gray-500 mt-1">Complete process data and achievement</p>
        </div>
        <Clock size={20} className="text-blue-600" />
      </div>

      {data && data.length > 0 ? (
        <DataTable
          columns={processColumns}
          data={data}
          striped={true}
          hover={true}
          loading={loading}
          emptyMessage="No process data available"
          sortable={false}
          searchable={false}
        />
      ) : !loading ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      ) : null}
    </Card>
  )
}

export default ProcessDetailsTable