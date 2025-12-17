import { useState, useEffect } from 'react'
import { Search, ChevronUp, ChevronDown, Eye, Trash2, Edit } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import Card from '@/components/ui/Card'
import BreadCrumb from '@/components/common/BreadCrumb'
import Alert from '@/components/ui/Alert'
import Pagination from '@/components/common/Pagination'
import api from '@/services/api'

export default function Line() {
  const { sidebarHovered } = useSidebar()
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedLine, setSelectedLine] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const breadcrumbItems = [
    { label: 'Line', href: '/line', active: true }
  ]

  // Fetch data dari API
  useEffect(() => {
    fetchLines()
  }, [])

  const fetchLines = async () => {
    try {
      setLoading(true)
      const response = await api.get('/auth/getline')
      
      console.log('📊 [Line] API Response:', response.data)
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response structure from API')
      }

      if (!Array.isArray(response.data.data)) {
        throw new Error('API response data is not an array')
      }

      const mappedLines = response.data.data.map((line) => ({
        id: line.id || line.line_id,
        name: line.name || 'N/A',
        description: line.description || '-',
        zone: line.Zone || line.zone || '-',
        created_at: line.created_at || new Date().toISOString().split('T')[0],
        updated_at: line.updated_at || new Date().toISOString().split('T')[0],
        status: line.status || 'active'
      }))

      setLines(mappedLines)
      console.log('✅ [Line] Lines loaded:', mappedLines.length)
      setLoading(false)
    } catch (error) {
      console.error('❌ [Line] Error fetching lines:', error)
      setShowAlert(true)
      setAlertType('error')
      setAlertMessage(error.message || 'Failed to load lines data')
      setLoading(false)
    }
  }

  // Filter & Sort
  const filteredLines = lines
    .filter(line => 
      line.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      line.zone.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredLines.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLines = filteredLines.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handleOpenViewModal = (line) => {
    setSelectedLine(line)
    setShowViewModal(true)
  }

  const handleCloseModal = () => {
    setShowViewModal(false)
    setSelectedLine(null)
  }

  // ✅ Sort Header dengan styling lengkap
  const SortHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 tracking-normal leading-normal"
    >
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === 'asc' ? 
          <ChevronUp size={16} className="animate-bounce-animate" /> : 
          <ChevronDown size={16} className="animate-bounce-animate" />
      )}
    </button>
  )

  // ✅ Modal Component - View dengan animasi
  const ViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      {/* ✅ Animasi scaleIn untuk modal */}
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scale-in">
        {/* Header dengan sticky positioning */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <div className="flex-1">
            {/* ✅ Font-display untuk modal title */}
            <h2 className="text-2xl font-bold text-gray-900 font-display leading-tight">
              {selectedLine?.name}
            </h2>
            {/* ✅ Font-sans dengan text-sm */}
            <p className="text-sm text-gray-600 font-normal tracking-normal mt-1">
              View line details and information
            </p>
          </div>
          {/* ✅ Close button dengan hover effect */}
          <button 
            onClick={handleCloseModal} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-4"
            title="Close modal"
          >
            <span className="text-2xl text-gray-600 font-bold">×</span>
          </button>
        </div>

        {selectedLine ? (
          <div className="p-6 space-y-6 slide-in-up">
            {/* ✅ Form group styling */}
            <div className="form-group">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Line Name
              </label>
              <p className="mt-2 text-lg font-medium text-gray-900 leading-relaxed">
                {selectedLine.name}
              </p>
            </div>

            <div className="divider"></div>

            {/* ✅ Description form-group */}
            <div className="form-group">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Description
              </label>
              <p className="mt-2 text-gray-700 leading-relaxed font-normal">
                {selectedLine.description}
              </p>
            </div>

            <div className="divider"></div>

            {/* ✅ Zone dengan badge styling */}
            <div className="form-group">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Zone
              </label>
              <p className="mt-2">
                <span className="badge badge-primary">
                  {selectedLine.zone}
                </span>
              </p>
            </div>

            {/* ✅ Status dengan badge styling dinamis */}
            <div className="form-group">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </label>
              <p className="mt-2">
                <span className={selectedLine.status === 'active' ? 'badge badge-success' : 'badge badge-danger'}>
                  {selectedLine.status}
                </span>
              </p>
            </div>

            {/* ✅ Divider sebelum timestamps */}
            <div className="divider"></div>

            {/* ✅ Timestamps grid dengan form-hint styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created At
                </p>
                <p className="mt-2 text-sm text-gray-700 font-normal leading-normal">
                  {selectedLine.created_at}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Updated
                </p>
                <p className="mt-2 text-sm text-gray-700 font-normal leading-normal">
                  {selectedLine.updated_at}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* ✅ Modal footer dengan styling */}
        {selectedLine && (
          <div className="flex gap-3 p-6 border-t-2 border-gray-200 bg-gray-50 rounded-b-lg slide-in-up">
            <button
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors duration-200 tracking-normal leading-normal"
            >
              Close
            </button>
            <button
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 tracking-normal leading-normal"
            >
              Edit Line
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 px-responsive py-responsive">
      {/* ✅ Breadcrumb dengan animasi slideInDown */}
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* ✅ Alert dengan animasi slideInUp */}
      {showAlert && (
        <div className="slide-in-up">
          <Alert
            type={alertType}
            message={alertMessage}
            dismissible={true}
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}

      {/* ✅ Page Header dengan font-display dan styling lengkap */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 slide-in-left">
        <div>
          {/* ✅ Font-display untuk heading utama */}
          <h1 className="text-4xl font-bold text-gray-900 font-display leading-tight tracking-tight">
            Line Management
          </h1>
          {/* ✅ Font-sans untuk subtitle */}
          <p className="text-gray-600 mt-2 font-normal leading-relaxed tracking-normal">
            Daftar Line Produksi - Kelola semua line produksi sistem
          </p>
        </div>
      </div>

      {/* ✅ Search Card dengan animasi fadeIn */}
      <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          {/* ✅ Input dengan focus styling lengkap */}
          <input
            type="text"
            placeholder="Search line name or zone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg font-normal text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </Card>

      {/* ✅ Table Card dengan animasi scaleIn */}
      <Card shadow="lg" padding="0" rounded="lg" className="overflow-hidden scal-in transition-shadow duration-300">
        <div className="overflow-x-auto">
          {/* ✅ Table dengan styling lengkap */}
          <table className="w-full font-sans">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Line Name" sortKey="name" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Description" sortKey="description" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Zone" sortKey="zone" />
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="font-semibold text-gray-700 uppercase tracking-wide text-sm">Status</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="font-semibold text-gray-700 uppercase tracking-wide text-sm">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    {/* ✅ Loading spinner dengan animasi spin */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-gray-300 border-t-blue-500 rounded-full spin-animate"></div>
                      <span className="text-gray-600 font-normal">Loading lines data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedLines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <p className="text-gray-500 font-normal leading-relaxed">
                      No lines found. Try adjusting your search.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedLines.map((line, idx) => (
                  <tr 
                    key={line.id} 
                    className="hover:bg-blue-50 transition-colors duration-200 fade-in"
                    style={{
                      animation: `fadeIn 0.3s ease-out forwards`,
                      opacity: 0,
                      animationDelay: `${idx * 50}ms`
                    }}
                  >
                    {/* ✅ Line Name dengan font-medium */}
                    <td className="px-6 py-4 font-medium text-gray-900 leading-normal">
                      {line.name}
                    </td>
                    {/* ✅ Description */}
                    <td className="px-6 py-4 text-gray-700 font-normal leading-relaxed">
                      {line.description}
                    </td>
                    {/* ✅ Zone dengan badge styling */}
                    <td className="px-6 py-4">
                      <span className="badge badge-primary">
                        {line.zone}
                      </span>
                    </td>
                    {/* ✅ Status dengan badge dinamis */}
                    <td className="px-6 py-4">
                      <span className={line.status === 'active' ? 'badge badge-success' : 'badge badge-danger'}>
                        {line.status || 'N/A'}
                      </span>
                    </td>
                    {/* ✅ Actions buttons dengan tooltip */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {/* ✅ View button */}
                        <button
                          onClick={() => handleOpenViewModal(line)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 tooltip"
                          data-tooltip="View details"
                          title="View line details"
                        >
                          <Eye size={16} />
                        </button>
                        {/* ✅ Edit button */}
                        <button
                          className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-200 tooltip"
                          data-tooltip="Edit line"
                          title="Edit line"
                        >
                          <Edit size={16} />
                        </button>
                        {/* ✅ Delete button */}
                        <button
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 tooltip"
                          data-tooltip="Delete line"
                          title="Delete line"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ✅ Pagination dengan animasi slideInUp */}
      {!loading && filteredLines.length > 0 && (
        <div className="slide-in-up">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showInfo={true}
            itemsPerPage={itemsPerPage}
            totalItems={filteredLines.length}
          />
        </div>
      )}

      {/* ✅ Render Modal dengan animasi */}
      {showViewModal && <ViewModal />}
    </div>
  )
}