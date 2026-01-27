import { Eye, Edit, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import DataTable from '@/components/tables/DataTable'
import { getDetailOutputByStyle } from '@/services/apiService'

export default function OutputTable({
  data,
  loading,
  onDetailClick,
  onUpdateClick,
  userIdLine
}) {
  const [idOutputCache, setIdOutputCache] = useState({})
  const [prefetchLoading, setPrefetchLoading] = useState(false)

  console.log('📊 [OutputTable] Received data:', data)
  console.log('📊 [OutputTable] User ID Line:', userIdLine)

  useEffect(() => {
    if (!data || data.length === 0 || !userIdLine) return

    let isMounted = true

    const prefetchAllIdOutputs = async () => {
      setPrefetchLoading(true)
      console.log('🚀 [Prefetch] Starting prefetch for all styles...')

      const newCache = { ...idOutputCache }
      const styles = [...new Set(data.filter(row => row.style).map(row => row.style))]

      if (styles.length === 0) {
        setPrefetchLoading(false)
        return
      }

      console.log(`📋 [Prefetch] Found ${styles.length} unique styles`)

      // Only fetch styles that aren't already in the cache
      const uniqueNewStyles = styles.filter(style => !newCache[style])

      if (uniqueNewStyles.length === 0) {
        setPrefetchLoading(false)
        return
      }

      const promises = uniqueNewStyles.map(style =>
        getDetailOutputByStyle(style, userIdLine)
          .then(response => {
            if (!isMounted) return
            const details = response.data || response
            if (Array.isArray(details) && details.length > 0) {
              newCache[style] = details[0].id_output
              console.log(`✅ [Prefetch] Cached style: ${style} -> id_output: ${details[0].id_output}`)
            }
          })
          .catch(error => {
            if (!isMounted) return
            console.warn(`⚠️ [Prefetch] Error fetching ${style}:`, error)
            newCache[style] = null
          })
      )

      await Promise.all(promises)

      if (isMounted) {
        setIdOutputCache(prev => ({ ...prev, ...newCache }))
        setPrefetchLoading(false)
        console.log('✅ [Prefetch] All styles prefetched!')
      }
    }

    prefetchAllIdOutputs()

    return () => {
      isMounted = false
    }
    // We want to run this when data changes or userIdLine changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, userIdLine])

  const getIdOutputFromCache = (style) => {
    if (idOutputCache[style]) {
      console.log(`⚡ [Cache Hit] Style ${style}: ${idOutputCache[style]}`)
      return idOutputCache[style]
    }
    console.log(`❌ [Cache Miss] Style ${style}`)
    return null
  }

  const handleDetailClick = (row) => {
    console.log('👁️ [handleDetailClick] Clicked row:', row)

    let idOutput = row.id_output || getIdOutputFromCache(row.style)

    if (!idOutput) {
      console.error('❌ Cannot find id_output')
      alert('❌ Error: Cannot load detail. Missing ID.')
      return
    }

    console.log(`✅ [handleDetailClick] Calling onDetailClick with id: ${idOutput}`)
    onDetailClick(idOutput)
  }

  const handleUpdateClick = (row) => {
    console.log('✏️ [handleUpdateClick] Clicked row:', row)

    let idOutput = row.id_output || getIdOutputFromCache(row.style)

    if (!idOutput) {
      console.error('❌ Cannot find id_output')
      alert('❌ Error: Cannot update. Missing ID.')
      return
    }

    console.log(`✅ [handleUpdateClick] Calling onUpdateClick with id: ${idOutput}`)
    onUpdateClick(idOutput)
  }

  // ✨ IMPROVED: Enhanced status badge
  const StatusBadge = ({ status }) => {
    const isPending = status === 1 || status === '1'
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isPending
          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
        }`}>
        {isPending ? (
          <CheckCircle2 size={14} className="text-emerald-600" />
        ) : (
          <AlertCircle size={14} className="text-amber-600" />
        )}
        {isPending ? 'Completed' : 'Pending'}
      </div>
    )
  }

  // ✨ IMPROVED: Better action buttons with smooth hover
  const ActionButtons = ({ row }) => {
    const hasIdOutput = row.id_output || idOutputCache[row.style]
    const isReady = !prefetchLoading && hasIdOutput

    return (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleDetailClick(row)}
          disabled={!isReady}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs transition-all duration-200 ${isReady
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-md active:scale-95 cursor-pointer border border-blue-200'
              : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60 border border-slate-200'
            }`}
          title={isReady ? 'View detail' : 'Loading...'}
        >
          <Eye size={16} strokeWidth={2.5} />
          <span>Detail</span>
        </button>

        <button
          onClick={() => handleUpdateClick(row)}
          disabled={!isReady}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs transition-all duration-200 ${isReady
              ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 hover:shadow-md active:scale-95 cursor-pointer border border-orange-200'
              : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60 border border-slate-200'
            }`}
          title={isReady ? 'Update' : 'Loading...'}
        >
          <Edit size={16} strokeWidth={2.5} />
          <span>Update</span>
        </button>
      </div>
    )
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
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'action',
      label: 'Action',
      width: '24%',
      render: (value, row) => <ActionButtons row={row} />
    }
  ]

  return (
    <div className="space-y-4">
      {/* ✨ IMPROVED: Better loading indicator */}
      {prefetchLoading && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-sm font-medium text-blue-700">
              Preparing data... <span className="font-bold">{Object.keys(idOutputCache).length}</span>/{data?.length || 0}
            </p>
          </div>
        </div>
      )}

      {/* ✨ IMPROVED: Table wrapper dengan shadow */}
      <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
      </div>

      {/* ✨ IMPROVED: Footer info */}
      {data && data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600">
          <span>Showing <strong>{data.length}</strong> records</span>
          <span>Last updated: <strong>{new Date().toLocaleTimeString()}</strong></span>
        </div>
      )}
    </div>
  )
}