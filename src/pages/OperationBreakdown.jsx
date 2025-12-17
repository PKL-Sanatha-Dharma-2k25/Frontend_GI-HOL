// src/pages/OperationBreakdown.jsx
import { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, Eye, Edit2, Trash2 } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import Card from '@/components/ui/Card';
import BreadCrumb from '@/components/common/BreadCrumb';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import api from '@/services/api';

export default function OperationBreakdown() {
  const { sidebarHovered } = useSidebar();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'style', direction: 'asc' });
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Operation Breakdown', href: '#', active: true }
  ];

  // Fetch data dari API
  useEffect(() => {
    const fetchOperations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/getoperationbreakdown');
        
        console.log('Operation Breakdown API Response:', response.data);
        
        // Map response ke format yang sesuai
        if (response.data.data && Array.isArray(response.data.data)) {
          const mappedOperations = response.data.data.map(op => ({
            id: op.id,
            style: op.style || 'N/A',
            date: op.date || '-',
            user: generateRandomUser(), // Mock data
            buyer: op.buyer_name || '-',
            line: generateRandomLine(), // Mock data
            sam: op.sam || '-',
            manpower: op.manpower || '-',
            frontPic: op.front_pic || 'no-image-icon-23494.png',
            backPic: op.back_pic || 'no-image-icon-23494.png'
          }));
          setOperations(mappedOperations);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching operations:', error);
        setShowAlert(true);
        setAlertType('error');
        setAlertMessage('Failed to load operation breakdown data');
        setLoading(false);
      }
    };
    
    fetchOperations();
  }, []);

  // Mock data helper
  const generateRandomUser = () => {
    const users = ['Hasna', 'Adhit', 'Indra', 'Afif', 'Iva', 'Rini', 'Budi'];
    return users[Math.floor(Math.random() * users.length)];
  };

  const generateRandomLine = () => {
    const lines = [
      'SHIFT 1 LINE TELAGA SARANGAN',
      'SHIFT 1 LINE RAJA AMPAT',
      'SHIFT 1 LINE ULU WATU',
      'SHIFT 1 LINE AYANA',
      'SHIFT 1 LINE BESAKIH',
      'SHIFT 1 LINE PULAU SAMOSIR',
      'SHIFT 1 LINE BROMO'
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  };

  // Filter & Sort
  const filteredOperations = operations
    .filter(op => 
      op.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.line.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOperations = filteredOperations.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleViewDetail = (operation) => {
    setSelectedOperation(operation);
    setShowDetail(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure want to delete this operation breakdown?')) {
      setOperations(operations.filter(op => op.id !== id));
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage('Operation deleted successfully');
    }
  };

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
  );

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Breadcrumb */}
      <BreadCrumb items={breadcrumbItems} />

      {/* Alert */}
      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          dismissible={true}
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operation Breakdown</h1>
          <p className="text-gray-600 mt-1">Daftar Breakdown Operasi</p>
        </div>
      </div>

      {/* Search */}
      <Card shadow="md" padding="lg" rounded="lg">
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search style, buyer, user, or line..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Table */}
      <Card shadow="md" padding="0" rounded="lg" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Style" sortKey="style" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Date Created" sortKey="date" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="User" sortKey="user" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Buyer" sortKey="buyer" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Line" sortKey="line" />
                </th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOperations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No operations found
                  </td>
                </tr>
              ) : (
                paginatedOperations.map((operation) => (
                  <tr key={operation.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{operation.style}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{operation.date}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {operation.user}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                        {operation.buyer}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{operation.line}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(operation)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(operation.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total: {filteredOperations.length} operations
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ◀
              </button>
              
              <div className="text-xs text-gray-600">
                {currentPage} / {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetail && selectedOperation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card shadow="2xl" padding="lg" rounded="lg" className="w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Operation Detail: {selectedOperation.style}
              </h2>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Detail Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Style Code</label>
                  <p className="text-gray-900">{selectedOperation.style}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date Created</label>
                  <p className="text-gray-900">{selectedOperation.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">User</label>
                  <p className="text-gray-900">{selectedOperation.user}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Buyer</label>
                  <p className="text-gray-900">{selectedOperation.buyer}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Line</label>
                  <p className="text-gray-900">{selectedOperation.line}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">SAM</label>
                  <p className="text-gray-900">
                    {typeof selectedOperation.sam === 'number' ? selectedOperation.sam.toFixed(2) : selectedOperation.sam}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Manpower</label>
                  <p className="text-gray-900">{selectedOperation.manpower}</p>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Front Picture</label>
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                    <img 
                      src={`/api/images/${selectedOperation.frontPic}`}
                      alt="Front"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Back Picture</label>
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                    <img 
                      src={`/api/images/${selectedOperation.backPic}`}
                      alt="Back"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setShowDetail(false)}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}