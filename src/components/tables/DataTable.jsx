// src/components/tables/DataTable.jsx
import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

export default function DataTable({ 
  columns = [],
  data = [],
  striped = false,
  hover = false,
  loading = false,
  emptyMessage = "No data available",
  sortable = true,
  searchable = false,
  onRowClick = null,
  rowClassName = null
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')

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
      
      // Handle null/undefined
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return sortConfig.direction === 'asc' ? 1 : -1
      if (bVal == null) return sortConfig.direction === 'asc' ? -1 : 1
      
      // Compare values
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    
    return sorted
  }, [filteredData, sortConfig, sortable])

  // =============================
  // HANDLE SORT
  // =============================
  const handleSort = (key) => {
    if (!sortable || columns.find(col => col.key === key)?.key === 'action') return
    
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
      return 'bg-green-100 text-green-800'
    }
    if (['pending', 'warning', 'standby'].includes(statusLower)) {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (['failed', 'cancelled', 'error', 'danger', 'maintenance', 'inactive'].includes(statusLower)) {
      return 'bg-red-100 text-red-800'
    }
    
    return 'bg-gray-100 text-gray-800'
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
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(value)}`}>
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
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* SEARCH BAR */}
      {searchable && (
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all duration-200">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
          />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {sortedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* TABLE HEADER */}
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-b-2 border-blue-500">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`px-6 py-5 text-xs font-bold text-white uppercase tracking-widest ${
                        col.key !== 'action' && sortable ? 'cursor-pointer hover:bg-blue-700 transition-colors' : ''
                      } ${col.key === 'action' ? 'text-center' : 'text-left'}`}
                      style={col.width ? { width: col.width } : {}}
                    >
                      <div className={`flex items-center gap-2 ${col.key === 'action' ? 'justify-center' : ''}`}>
                        <span>{col.label}</span>
                        {col.key !== 'action' && sortable && sortConfig.key === col.key && (
                          <span className="text-blue-200">
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
              <tbody>
                {sortedData.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`border-b border-gray-100 transition-all duration-200 ${
                      striped && idx % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-transparent' : 'bg-white'
                    } ${
                      hover ? 'hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 hover:shadow-md' : ''
                    } ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${
                      rowClassName ? rowClassName(row) : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={`${idx}-${col.key}`}
                        className="px-6 py-5 text-sm font-medium text-gray-800"
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
          <div className="p-16 text-center">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="font-semibold text-gray-600 text-lg mt-4">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}