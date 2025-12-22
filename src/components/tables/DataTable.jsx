// src/components/tables/DataTableCard.jsx
import { useState } from 'react'
import { ChevronUp, ChevronDown, Search, ChevronDown as ChevronDownIcon } from 'lucide-react'

export default function DataTableCard({ 
  columns = [],
  data = [],
  striped = false,
  hover = false,
  loading = false,
  emptyMessage = "No data available",
  selectable = false,
  sortable = true,
  searchable = false,
  onRowClick = null,
  rowClassName = null,
  density = 'md'
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRows, setExpandedRows] = useState(new Set())

  // =============================
  // SEARCH & FILTER
  // =============================
  const filteredData = searchable && searchTerm 
    ? data.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data

  // =============================
  // SORTING
  // =============================
  const sortedData = sortable && sortConfig.key
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    : filteredData

  // =============================
  // HANDLE SORT
  // =============================
  const handleSort = (key) => {
    if (!sortable) return
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // =============================
  // TOGGLE EXPAND ROW
  // =============================
  const toggleExpandRow = (rowId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }

  // =============================
  // GET STATUS COLOR
  // =============================
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'active':
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'warning':
      case 'standby':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
      case 'cancelled':
      case 'error':
      case 'danger':
      case 'maintenance':
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all duration-200">
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

      {/* CARD-BASED TABLE */}
      <div className="space-y-3">
        {sortedData.length > 0 ? (
          sortedData.map((row, idx) => (
            <div key={idx} className="fade-in" style={{
              animation: `fadeIn 0.3s ease-out forwards`,
              opacity: 0,
              animationDelay: `${idx * 50}ms`
            }}>
              {/* CARD HEADER */}
              <div 
                onClick={() => onRowClick && onRowClick(row)}
                className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${rowClassName ? rowClassName(row) : ''}`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* PRIMARY COLUMNS */}
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {columns.slice(0, 3).map((col) => (
                        col.key !== 'action' && (
                          <div key={col.key}>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              {col.label}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {renderCell(row, col)}
                            </p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {columns.find(col => col.key === 'action') && (
                      <div onClick={(e) => e.stopPropagation()}>
                        {renderCell(row, columns.find(col => col.key === 'action'))}
                      </div>
                    )}
                    {columns.length > 3 && (
                      <button
                        onClick={() => toggleExpandRow(idx)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title={expandedRows.has(idx) ? 'Collapse' : 'Expand'}
                      >
                        <ChevronDownIcon 
                          size={18} 
                          className={`text-gray-400 transition-transform duration-300 ${expandedRows.has(idx) ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* EXPANDED CONTENT */}
              {expandedRows.has(idx) && columns.length > 3 && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-lg border border-t-0 border-gray-200 p-4 space-y-3 slide-in-down">
                  {columns.slice(3).map((col) => (
                    col.key !== 'action' && (
                      <div key={col.key} className="flex items-start justify-between pb-3 border-b border-gray-200 last:border-b-0">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {col.label}
                        </p>
                        <p className="text-sm font-medium text-gray-900 text-right">
                          {renderCell(row, col)}
                        </p>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="font-semibold text-gray-600">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}