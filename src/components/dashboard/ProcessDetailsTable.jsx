import { Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useState, useMemo } from 'react'
import Card from '@/components/ui/Card'
import DataTable from '@/components/tables/DataTable'

function ProcessDetailsTable({ data = [], loading = false }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, currentPage])

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const totalItems = data.length

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  const handleFirstPage = () => {
    setCurrentPage(1)
  }

  const handleLastPage = () => {
    setCurrentPage(totalPages)
  }

  // Reset to page 1 when data changes
  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum)
    }
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

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
        <>
          <div className="transition-opacity duration-300">
            <DataTable
              columns={processColumns}
              data={paginatedData}
              striped={true}
              hover={true}
              loading={loading}
              emptyMessage="No process data available"
              sortable={false}
              searchable={false}
            />
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
            {/* Info */}
            <div className="text-sm text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{startItem}</span> to{' '}
              <span className="font-bold text-slate-900">{endItem}</span> of{' '}
              <span className="font-bold text-slate-900">{totalItems}</span> entries
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* First Page Button */}
              <button
                onClick={handleFirstPage}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                title="First page"
              >
                <ChevronsLeft size={16} className="text-slate-600" strokeWidth={2.5} />
              </button>

              {/* Previous Page Button */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                title="Previous page"
              >
                <ChevronLeft size={16} className="text-slate-600" strokeWidth={2.5} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className={`w-8 h-8 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              {/* Next Page Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                title="Next page"
              >
                <ChevronRight size={16} className="text-slate-600" strokeWidth={2.5} />
              </button>

              {/* Last Page Button */}
              <button
                onClick={handleLastPage}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                title="Last page"
              >
                <ChevronsRight size={16} className="text-slate-600" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </>
      ) : !loading ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      ) : null}

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