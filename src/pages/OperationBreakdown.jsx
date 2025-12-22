// src/pages/OperationBreakdown.jsx
import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import Card from '@/components/ui/Card'
import BreadCrumb from '@/components/common/BreadCrumb'
import Alert from '@/components/ui/Alert'
import DataTable from '@/components/tables/DataTable'
import Pagination from '@/components/common/Pagination'
import api from '@/services/api'

export default function OperationBreakdown() {
  const { sidebarHovered } = useSidebar()
  const [operations, setOperations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  // =============================
  // PAGINATION & FILTER STATES
  // =============================
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'style', direction: 'asc' })

  const breadcrumbItems = [
    { label: 'Operation Breakdown', href: '#', active: true }
  ]

  // Fetch data dari API
  useEffect(() => {
    const fetchOperations = async () => {
      try {
        setLoading(true)
        const response = await api.get('/auth/getoperationbreakdown')
        
        console.log('Operation Breakdown API Response:', response.data)
        
        if (response.data.data && Array.isArray(response.data.data)) {
          const mappedOperations = response.data.data.map(op => ({
            id: op.id,
            style: op.style || 'N/A',
            date: op.date || '-',
            user: generateRandomUser(),
            buyer: op.buyer_name || '-',
            line: generateRandomLine(),
            sam: op.sam || '-',
            manpower: op.manpower || '-',
            frontPic: op.front_pic || 'no-image-icon-23494.png',
            backPic: op.back_pic || 'no-image-icon-23494.png'
          }))
          setOperations(mappedOperations)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching operations:', error)
        setShowAlert(true)
        setAlertType('error')
        setAlertMessage('Failed to load operation breakdown data')
        setLoading(false)
      }
    }
    
    fetchOperations()
  }, [])

  const generateRandomUser = () => {
    const users = ['Hasna', 'Adhit', 'Indra', 'Afif', 'Iva', 'Rini', 'Budi']
    return users[Math.floor(Math.random() * users.length)]
  }

  const generateRandomLine = () => {
    const lines = [
      'SHIFT 1 LINE TELAGA SARANGAN',
      'SHIFT 1 LINE RAJA AMPAT',
      'SHIFT 1 LINE ULU WATU',
      'SHIFT 1 LINE AYANA',
      'SHIFT 1 LINE BESAKIH',
      'SHIFT 1 LINE PULAU SAMOSIR',
      'SHIFT 1 LINE BROMO'
    ]
    return lines[Math.floor(Math.random() * lines.length)]
  }

  // =============================
  // FILTER & SORT LOGIC
  // =============================
  const filteredOperations = operations
    .filter(op => 
      op.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.line.toLowerCase().includes(searchTerm.toLowerCase())
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
  const totalPages = Math.ceil(filteredOperations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOperations = filteredOperations.slice(startIndex, startIndex + itemsPerPage)

  // =============================
  // TABLE COLUMNS DEFINITION
  // =============================
  const tableColumns = [
    {
      key: 'style',
      label: 'Style',
      width: '15%'
    },
    {
      key: 'date',
      label: 'Date Created',
      width: '15%'
    },
    {
      key: 'user',
      label: 'User',
      width: '12%',
      render: (value) => (
        <span className="badge badge-primary">{value}</span>
      )
    },
    {
      key: 'buyer',
      label: 'Buyer',
      width: '15%',
      render: (value) => (
        <span className="badge badge-info">{value}</span>
      )
    },
    {
      key: 'line',
      label: 'Line',
      width: '28%'
    },
    {
      key: 'action',
      label: 'Actions',
      width: '15%',
      render: (value, row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleViewDetail(row)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
            title="View operation details"
          >
            <Eye size={18} />
          </button>
        </div>
      )
    }
  ]

  const handleViewDetail = (operation) => {
    setSelectedOperation(operation)
    setShowDetail(true)
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedOperation(null)
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

  // Detail Modal
  const DetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 fade-in">
      <Card shadow="2xl" padding="lg" rounded="lg" className="w-full max-w-3xl my-8 scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200 slide-in-down">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 font-display leading-tight tracking-tight">
              Operation Detail
            </h2>
            <p className="text-sm text-gray-600 font-normal mt-1">
              Style: <span className="font-semibold text-gray-900">{selectedOperation?.style}</span>
            </p>
          </div>
          <button
            onClick={handleCloseDetail}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200 text-2xl font-bold ml-4"
            title="Close modal"
          >
            ×
          </button>
        </div>

        <div className="slide-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Detail Info */}
            <div className="space-y-4">
              <div className="form-group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Style Code</label>
                <p className="mt-2 text-lg font-medium text-gray-900 leading-normal">
                  {selectedOperation?.style}
                </p>
              </div>

              <div className="divider"></div>

              <div className="form-group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date Created</label>
                <p className="mt-2 text-base font-normal text-gray-700 leading-normal">
                  {selectedOperation?.date}
                </p>
              </div>

              <div className="divider"></div>

              <div className="form-group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">User</label>
                <p className="mt-2">
                  <span className="badge badge-primary">
                    {selectedOperation?.user}
                  </span>
                </p>
              </div>

              <div className="divider"></div>

              <div className="form-group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Buyer</label>
                <p className="mt-2">
                  <span className="badge badge-info">
                    {selectedOperation?.buyer}
                  </span>
                </p>
              </div>

              <div className="divider"></div>

              <div className="form-group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Line</label>
                <p className="mt-2 text-base font-normal text-gray-700 leading-relaxed">
                  {selectedOperation?.line}
                </p>
              </div>

              <div className="divider"></div>

              <div className="form-group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">SAM</label>
                <p className="mt-2 text-base font-medium text-gray-900 leading-normal">
                  {typeof selectedOperation?.sam === 'number' ? selectedOperation.sam.toFixed(2) : selectedOperation?.sam}
                </p>
              </div>

              <div className="divider"></div>

              <div className="form-group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Manpower</label>
                <p className="mt-2 text-base font-medium text-gray-900 leading-normal">
                  {selectedOperation?.manpower}
                </p>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Front Picture
                </label>
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src={`/api/images/${selectedOperation?.frontPic}`}
                    alt="Front"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
              </div>

              <div className="divider"></div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Back Picture
                </label>
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src={`/api/images/${selectedOperation?.backPic}`}
                    alt="Back"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex justify-end gap-3 slide-in-up">
            <button
              onClick={handleCloseDetail}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-all duration-200 tracking-normal leading-normal"
            >
              Close
            </button>
          </div>
        </div>
      </Card>
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
          data={paginatedOperations}
          striped={true}
          hover={true}
          bordered={false}
          loading={loading}
          emptyMessage="No operation breakdowns available"
          searchable={true}
          sortable={true}
          pagination={false}
          density="md"
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </Card>

      {/* Pagination Component */}
      {!loading && filteredOperations.length > 0 && (
        <div className="slide-in-up">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showInfo={true}
            itemsPerPage={itemsPerPage}
            totalItems={filteredOperations.length}
          />
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedOperation && <DetailModal />}
    </div>
  )
}