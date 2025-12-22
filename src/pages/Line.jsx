// src/pages/Line.jsx
import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import Card from '@/components/ui/Card'
import BreadCrumb from '@/components/common/BreadCrumb'
import Alert from '@/components/ui/Alert'
import DataTable from '@/components/tables/DataTable'
import Pagination from '@/components/common/Pagination'
import api from '@/services/api'

export default function Line() {
  const { sidebarHovered } = useSidebar()
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [selectedLine, setSelectedLine] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  
  // =============================
  // PAGINATION & FILTER STATES
  // =============================
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

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

  // =============================
  // FILTER & SORT LOGIC
  // =============================
  const filteredLines = lines
    .filter(line => 
      line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  // =============================
  // PAGINATION LOGIC
  // =============================
  const totalPages = Math.ceil(filteredLines.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLines = filteredLines.slice(startIndex, startIndex + itemsPerPage)

  // =============================
  // TABLE COLUMNS DEFINITION
  // =============================
  const tableColumns = [
    {
      key: 'name',
      label: 'Line Name',
      width: '20%'
    },
    {
      key: 'description',
      label: 'Description',
      width: '25%'
    },
    {
      key: 'zone',
      label: 'Zone',
      width: '15%',
      render: (value) => (
        <span className="badge badge-primary">{value}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%'
    },
    {
      key: 'action',
      label: 'Actions',
      width: '25%',
      render: (value, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenViewModal(row)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            title="View line details"
          >
            <Eye size={16} />
          </button>
        </div>
      )
    }
  ]

  const handleOpenViewModal = (line) => {
    setSelectedLine(line)
    setShowViewModal(true)
  }

  const handleCloseModal = () => {
    setShowViewModal(false)
    setSelectedLine(null)
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

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
    setCurrentPage(1)
  }

  // ✅ Modal Component - View dengan animasi
  const ViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scale-in">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 font-display leading-tight">
              {selectedLine?.name}
            </h2>
            <p className="text-sm text-gray-600 font-normal tracking-normal mt-1">
              View line details and information
            </p>
          </div>
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
            <div className="form-group">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Line Name
              </label>
              <p className="mt-2 text-lg font-medium text-gray-900 leading-relaxed">
                {selectedLine.name}
              </p>
            </div>

            <div className="divider"></div>

            <div className="form-group">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Description
              </label>
              <p className="mt-2 text-gray-700 leading-relaxed font-normal">
                {selectedLine.description}
              </p>
            </div>

            <div className="divider"></div>

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

            <div className="divider"></div>

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

        {selectedLine && (
          <div className="flex gap-3 p-6 border-t-2 border-gray-200 bg-gray-50 rounded-b-lg slide-in-up">
            <button
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors duration-200 tracking-normal leading-normal"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 px-responsive py-responsive">
      {/* Breadcrumb */}
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Alert */}
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

      {/* DataTable Card */}
      <Card shadow="lg" padding="lg" rounded="lg" className="scal-in transition-shadow duration-300">
        <DataTable 
          columns={tableColumns}
          data={paginatedLines}
          striped={true}
          hover={true}
          bordered={false}
          loading={loading}
          emptyMessage="No production lines available"
          searchable={true}
          sortable={true}
          pagination={false}
          density="md"
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </Card>

      {/* Pagination Component */}
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

      {/* Modal */}
      {showViewModal && <ViewModal />}
    </div>
  )
}