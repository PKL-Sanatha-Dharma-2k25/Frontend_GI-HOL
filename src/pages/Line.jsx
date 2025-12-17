import { useState, useEffect } from 'react'
import { Search, ChevronUp, ChevronDown, Eye } from 'lucide-react'
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
    { label: 'Dashboard', href: '/' },
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

  const SortHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
    >
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
      )}
    </button>
  )

  // Modal Component - View
  const ViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedLine?.name}</h2>
            <p className="text-sm text-gray-600">View line details</p>
          </div>
          <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded-lg">
            <span className="text-2xl text-gray-600">×</span>
          </button>
        </div>

        {selectedLine ? (
          <div className="p-6 space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">Line Name</label>
              <p className="mt-1 text-lg text-gray-900">{selectedLine.name}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <p className="mt-1 text-gray-600">{selectedLine.description}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Zone</label>
              <p className="mt-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {selectedLine.zone}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedLine.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedLine.status}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Created</p>
                <p className="mt-1 text-sm text-gray-700">{selectedLine.created_at}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Last Updated</p>
                <p className="mt-1 text-sm text-gray-700">{selectedLine.updated_at}</p>
              </div>
            </div>
          </div>
        ) : null}

        {selectedLine && (
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          dismissible={true}
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Line Management</h1>
          <p className="text-gray-600 mt-1">Daftar Line Produksi</p>
        </div>
      </div>

      <Card shadow="md" padding="lg" rounded="lg">
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search line name or zone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      <Card shadow="md" padding="0" rounded="lg" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Line Name" sortKey="name" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Description" sortKey="description" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Zone" sortKey="zone" />
                </th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedLines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No lines found
                  </td>
                </tr>
              ) : (
                paginatedLines.map((line) => (
                  <tr key={line.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{line.name}</td>
                    <td className="px-6 py-4 text-gray-600">{line.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {line.zone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        line.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {line.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenViewModal(line)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
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

      {/* Pagination */}
      {!loading && filteredLines.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showInfo={true}
          itemsPerPage={itemsPerPage}
          totalItems={filteredLines.length}
        />
      )}

      {/* Render Modal */}
      {showViewModal && <ViewModal />}
    </div>
  )
}