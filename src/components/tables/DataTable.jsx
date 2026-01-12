import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search, X } from 'lucide-react'

export default function DataTable({ 
  columns = [],
  data = [],
  striped = false,
  hover = true,
  loading = false,
  emptyMessage = "No data available",
  sortable = true,
  searchable = true,
  onRowClick = null,
  rowClassName = null,
  itemsPerPage = 10
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // =============================
  // SEARCH & FILTER
  // =============================
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data
    
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm, searchable])

  // =============================
  // SORTING
  // =============================
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return filteredData
    
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return sortConfig.direction === 'asc' ? 1 : -1
      if (bVal == null) return sortConfig.direction === 'asc' ? -1 : 1
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    
    return sorted
  }, [filteredData, sortConfig, sortable])

  // =============================
  // PAGINATION
  // =============================
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedData.slice(start, start + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  // =============================
  // HANDLE SORT
  // =============================
  const handleSort = (key) => {
    if (!sortable || columns.find(col => col.key === key)?.key === 'action') return
    setCurrentPage(1)
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // =============================
  // GET STATUS COLOR
  // =============================
  const getStatusColor = (status) => {
    const statusLower = String(status).toLowerCase()
    
    if (['completed', 'active', 'success'].includes(statusLower)) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    }
    if (['pending', 'warning', 'standby'].includes(statusLower)) {
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    }
    if (['failed', 'cancelled', 'error', 'danger', 'maintenance', 'inactive'].includes(statusLower)) {
      return 'bg-rose-50 text-rose-700 border border-rose-200'
    }
    
    return 'bg-slate-50 text-slate-700 border border-slate-200'
  }

  // =============================
  // RENDER CELL
  // =============================
  const renderCell = (row, col) => {
    const value = row[col.key]

    if (col.render) {
      return col.render(value, row)
    }

    if (col.key === 'status') {
      return (
        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    }

    if (col.key === 'action' && typeof value === 'object' && value !== null) {
      return value
    }

    return (
      <span className="block truncate" title={value || '-'}>
        {value || '-'}
      </span>
    )
  }

  // =============================
  // LOADING STATE
  // =============================
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* SEARCH BAR */}
      {searchable && (
        <div className="relative">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-gray-500 mt-1">
              Menampilkan {filteredData.length} dari {data.length} hasil
            </p>
          )}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {paginatedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* TABLE HEADER */}
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`px-4 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                        col.key !== 'action' && sortable ? 'cursor-pointer hover:bg-slate-200 transition-colors' : ''
                      } ${col.key === 'action' ? 'text-center' : 'text-left'}`}
                      style={col.width ? { width: col.width } : {}}
                    >
                      <div className={`flex items-center gap-2 ${col.key === 'action' ? 'justify-center' : ''}`}>
                        <span>{col.label}</span>
                        {col.key !== 'action' && sortable && sortConfig.key === col.key && (
                          <span className="text-blue-600 flex-shrink-0">
                            {sortConfig.direction === 'asc' ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-all duration-200 ${
                      striped && idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                    } ${
                      hover ? 'hover:bg-blue-50 hover:shadow-sm' : ''
                    } ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${
                      rowClassName ? rowClassName(row) : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={`${idx}-${col.key}`}
                        className="px-4 py-3.5 text-sm text-gray-800 font-medium"
                        style={col.width ? { width: col.width } : {}}
                      >
                        {renderCell(row, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium text-gray-600">{emptyMessage}</p>
            <p className="text-xs text-gray-400 mt-1">Coba ubah pencarian atau filter Anda</p>
          </div>
        )}
      </div>

      {/* PAGINATION & INFO */}
      {paginatedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div>
            Menampilkan <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> hingga{' '}
            <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> dari{' '}
            <span className="font-semibold text-gray-900">{sortedData.length}</span> data
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}