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
      key: 'achievement',
      label: 'Achievement',
      width: '20%',
      render: (value, row) => {

        const percentage = row.target > 0 ? Math.round((row.output / row.target) * 100) : 0
        
        const statusColor = 
          percentage >= 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
          percentage >= 80 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
          'bg-rose-50 text-rose-700 border border-rose-200'
        
        return (
          <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${statusColor}`}>
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
          <h3 className="text-lg font-bold text-gray-900 font-display">Process Details</h3>
          <p className="text-xs text-gray-500 mt-1">Complete process data with achievement metrics</p>
        </div>
        <Clock size={20} className="text-blue-600" />
      </div>

      {/* Use DataTable with built-in pagination */}
      <DataTable
        columns={processColumns}
        data={data}
        striped={true}
        hover={true}
        loading={loading}
        emptyMessage="No process data available"
        sortable={false}
        searchable={true}
        itemsPerPage={10}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Card>
  )
}
export default ProcessDetailsTable