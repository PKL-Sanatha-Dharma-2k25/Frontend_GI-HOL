import { useState, useEffect } from 'react'
import { Search, Plus, ChevronRight, AlertCircle, CheckCircle2, Eye } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/hooks/useAuth'
import { getOrcSewing, getHourlyOutputHeader, getDetailOutputByStyle, storeHourlyOutput } from '@/services/apiService'
import BreadCrumb from '@/components/common/BreadCrumb'
import DataTable from '@/components/tables/DataTable'
import Pagination from '@/components/common/Pagination'

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}`)

export default function HourlyOutput() {
  const { sidebarHovered } = useSidebar()
  const { user } = useAuth()

  // =============================
  // STATE MANAGEMENT
  // =============================
  const [outputs, setOutputs] = useState([])
  const [orcList, setOrcList] = useState([])
  const [filteredOrcList, setFilteredOrcList] = useState([])
  const [loading, setLoading] = useState(false)

  // Form State
  const [showForm, setShowForm] = useState(true)
  const [formData, setFormData] = useState(() => {
    const { date, hour } = getJakartaTime()
    return { date, time: hour }
  })

  // ORC Selection State
  const [showOrcDropdown, setShowOrcDropdown] = useState(false)
  const [selectedOrc, setSelectedOrc] = useState(null)
  const [orcSearchTerm, setOrcSearchTerm] = useState('')

  // Detail Modal State
  const [showDetail, setShowDetail] = useState(false)
  const [selectedOutput, setSelectedOutput] = useState(null)
  const [detailData, setDetailData] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Alert State
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

  // =============================
  // UTILITY FUNCTIONS
  // =============================
  function getJakartaTime() {
    const jakartaTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    return {
      date: jakartaTime.toISOString().split('T')[0],
      hour: String(jakartaTime.getHours())
    }
  }

  // =============================
  // EFFECTS
  // =============================
  useEffect(() => {
    if (user?.username) {
      loadInitialData()
    }
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      const { date, hour } = getJakartaTime()
      setFormData(prev => ({ ...prev, date, time: hour }))
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (orcSearchTerm.trim() === '') {
      setFilteredOrcList(orcList)
    } else {
      const filtered = orcList.filter(orc =>
        orc.orc.toLowerCase().includes(orcSearchTerm.toLowerCase()) ||
        orc.style.toLowerCase().includes(orcSearchTerm.toLowerCase()) ||
        orc.buyer.toLowerCase().includes(orcSearchTerm.toLowerCase())
      )
      setFilteredOrcList(filtered)
    }
  }, [orcSearchTerm, orcList])

  // =============================
  // API CALLS
  // =============================
  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load ORC list
      const orcData = await getOrcSewing()
      setOrcList(orcData.data || orcData || [])
      setFilteredOrcList(orcData.data || orcData || [])

      // ✅ Load hourly output header
      const outputData = await getHourlyOutputHeader()
      setOutputs(outputData.data || outputData || [])

      showAlertMessage('success', 'Data berhasil dimuat')
    } catch (error) {
      console.error('Error loading data:', error)
      showAlertMessage('error', 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async () => {
    if (!formData.date || !formData.time || !selectedOrc) {
      showAlertMessage('error', 'Lengkapi semua field yang diperlukan')
      return
    }

    setLoading(true)
    try {
      const payload = {
        date: formData.date,
        hour: formData.time,
        lane: user?.username,
        orc: selectedOrc.orc,
        style: selectedOrc.style,
        buyer: selectedOrc.buyer
      }

      // ✅ Simpan ke database
      await storeHourlyOutput(payload)

      showAlertMessage('success', 'Output berhasil disimpan')
      resetForm()

      // ✅ KUNCI: Reload data dari API setelah save
      await loadInitialData()
      
    } catch (error) {
      console.error('Error saving:', error)
      showAlertMessage('error', 'Gagal menyimpan output')
    } finally {
      setLoading(false)
    }
  }

  // =============================
  // HANDLER FUNCTIONS
  // =============================
  const showAlertMessage = (type, message) => {
    setAlertType(type)
    setAlertMessage(message)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleOrcSelect = (orc) => {
    setSelectedOrc(orc)
    setOrcSearchTerm(orc.orc)
    setShowOrcDropdown(false)
  }

  const handleClearOrc = () => {
    setSelectedOrc(null)
    setOrcSearchTerm('')
  }

  const resetForm = () => {
    const { hour } = getJakartaTime()
    setFormData(prev => ({ ...prev, time: hour }))
    setSelectedOrc(null)
    setOrcSearchTerm('')
  }

  const closeForm = () => {
    setShowForm(false)
    handleClearOrc()
    const { date, hour } = getJakartaTime()
    setFormData({ date, time: hour })
  }

  const handleViewDetail = (output) => {
    setSelectedOutput(output)
    setShowDetail(true)
    loadDetailData(output)
  }

  const loadDetailData = async (output) => {
    setLoadingDetail(true)
    try {
      // Gunakan style dari output dan line_id
      const idLine = output.idLine || output.id_line || user?.line_id || '59'
      
      console.log('📊 Fetching detail with:', { style: output.style, idLine })
      const detail = await getDetailOutputByStyle(output.style, idLine)
      setDetailData(detail.data || detail || [])
    } catch (error) {
      console.error('Error loading detail:', error)
      showAlertMessage('error', 'Gagal memuat detail data')
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedOutput(null)
    setDetailData(null)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // =============================
  // DATA PROCESSING
  // =============================
  const filteredOutputs = outputs
    .filter(output =>
      (output.style?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (output.buyer?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (output.date?.includes(searchTerm)) ||
      (output.orc?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

  const totalPages = Math.ceil(filteredOutputs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOutputs = filteredOutputs.slice(startIndex, startIndex + itemsPerPage)

  // =============================
  // TABLE COLUMNS
  // =============================
  const tableColumns = [
    { key: 'date', label: 'Tanggal', width: '15%' },
    { key: 'hour', label: 'Jam', width: '8%' },
    {
      key: 'orc',
      label: 'ORC',
      width: '15%',
      render: (value) => <span className="badge badge-primary font-semibold">{value}</span>
    },
    { key: 'style', label: 'Style', width: '25%' },
    { key: 'buyer', label: 'Buyer', width: '27%' },
    {
      key: 'action',
      label: 'Aksi',
      width: '10%',
      render: (value, row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleViewDetail(row)}
            className="inline-flex items-center justify-center w-9 h-9 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Lihat detail"
          >
            <Eye size={18} />
          </button>
        </div>
      )
    }
  ]

  // =============================
  // COMPONENTS
  // =============================
  const AlertComponent = () => (
    <div className={`p-4 rounded-lg border-l-4 flex items-start gap-3 animate-slideDown ${
      alertType === 'success'
        ? 'bg-green-50 border-green-500 text-green-800'
        : 'bg-red-50 border-red-500 text-red-800'
    }`}>
      {alertType === 'success' ? (
        <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
      )}
      <div>
        <p className="font-semibold text-sm">{alertType === 'success' ? 'Sukses' : 'Error'}</p>
        <p className="text-sm mt-1">{alertMessage}</p>
      </div>
    </div>
  )

  const FormCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Plus size={20} className="text-blue-600" />
          <span className="font-semibold text-gray-900">Tambah Output Baru</span>
        </div>
        <ChevronRight
          size={20}
          className={`text-gray-400 transition-transform duration-300 ${showForm ? 'rotate-90' : ''}`}
        />
      </button>

      {showForm && (
        <div className="p-6 border-t border-gray-200 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Line Field */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Line
              </label>
              <div className="px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm font-medium text-gray-900 h-10 flex items-center">
                {user?.username || '-'}
              </div>
            </div>

            {/* ORC Selection */}
            <div className="sm:col-span-1 lg:col-span-2 relative z-30">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                ORC <span className="text-red-500">*</span>
              </label>
              <div onBlur={() => setTimeout(() => setShowOrcDropdown(false), 200)}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Cari ORC..."
                    value={orcSearchTerm}
                    onChange={(e) => {
                      setOrcSearchTerm(e.target.value)
                      setShowOrcDropdown(true)
                    }}
                    onFocus={() => setShowOrcDropdown(true)}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                  />
                  {selectedOrc && (
                    <button
                      onClick={handleClearOrc}
                      className="text-gray-400 hover:text-gray-600 font-bold transition-colors"
                      title="Hapus"
                    >
                      ×
                    </button>
                  )}
                </div>

                {showOrcDropdown && filteredOrcList.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto">
                    {filteredOrcList.map((orc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOrcSelect(orc)}
                        className="w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="font-medium text-gray-900 text-sm">{orc.orc}</div>
                        <div className="text-xs text-gray-500">{orc.style} • {orc.buyer}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Style */}
            <div className="sm:col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Style
              </label>
              <div className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 h-10 flex items-center truncate">
                {selectedOrc?.style || '-'}
              </div>
            </div>

            {/* Buyer */}
            <div className="sm:col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Buyer
              </label>
              <div className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 h-10 flex items-center truncate">
                {selectedOrc?.buyer || '-'}
              </div>
            </div>

            {/* Date */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 h-10"
              />
            </div>

            {/* Hour */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Jam <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 h-10"
              >
                <option value="">Pilih</option>
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={closeForm}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              onClick={handleFormSubmit}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const DetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detail Output</h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedOutput?.orc} • {selectedOutput?.date} Jam {selectedOutput?.hour}:00
            </p>
          </div>
          <button
            onClick={handleCloseDetail}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Memuat detail...</span>
            </div>
          ) : detailData && detailData.length > 0 ? (
            <>
              {/* Summary Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Tanggal</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedOutput?.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Jam</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedOutput?.hour}:00</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">ORC</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedOutput?.orc}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Style</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedOutput?.style}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Buyer</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedOutput?.buyer}</p>
                </div>
              </div>

              {/* Details Table */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Detail Operasi</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase">Kode Op</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase">Nama Operasi</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase">Operator</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700 text-xs uppercase">Target</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase">Workgroup</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {detailData.map((detail, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">{detail.op_code}</td>
                          <td className="px-4 py-3 text-gray-700">{detail.op_name}</td>
                          <td className="px-4 py-3 text-gray-600">{detail.nama}</td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-900">{detail.target_per_day}</td>
                          <td className="px-4 py-3 text-gray-600">{detail.Workgroup}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Tidak ada data detail</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCloseDetail}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )

  // =============================
  // RENDER
  // =============================
  return (
    <div className="space-y-6 px-6 py-8 bg-gray-50 min-h-screen">
      {/* Alert */}
      {showAlert && <AlertComponent />}

      <FormCard />

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={tableColumns}
          data={paginatedOutputs}
          striped={true}
          hover={true}
          bordered={false}
          loading={loading}
          emptyMessage="Tidak ada data output"
          searchable={false}
          sortable={true}
          pagination={false}
          density="md"
        />
      </div>

      {/* Pagination */}
      {!loading && filteredOutputs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showInfo={true}
          itemsPerPage={itemsPerPage}
          totalItems={filteredOutputs.length}
        />
      )}

      {/* Detail Modal */}
      {showDetail && selectedOutput && <DetailModal />}
    </div>
  )
}