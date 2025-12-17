// src/pages/OperationBreakdown.jsx
import { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, Eye, Edit2, Trash2, AlertCircle } from 'lucide-react';
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

  // ✅ Sort Header dengan styling lengkap
  const SortHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 tracking-normal leading-normal uppercase text-xs"
    >
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === 'asc' ? 
          <ChevronUp size={16} className="animate-bounce-animate" /> : 
          <ChevronDown size={16} className="animate-bounce-animate" />
      )}
    </button>
  );

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
            Operation Breakdown
          </h1>
          {/* ✅ Font-sans untuk subtitle */}
          <p className="text-gray-600 mt-2 font-normal leading-relaxed tracking-normal">
            Daftar Breakdown Operasi - Kelola semua breakdown operasi produksi
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
            placeholder="Search style, buyer, user, or line..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg font-normal text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </Card>

      {/* ✅ Table Card dengan animasi scaleIn */}
      <Card shadow="lg" padding="0" rounded="lg" className="overflow-hidden scale-in transition-shadow duration-300">
        <div className="overflow-x-auto">
          {/* ✅ Table dengan styling lengkap */}
          <table className="w-full font-sans">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
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
                <th className="px-6 py-4 text-center">
                  <span className="font-semibold text-gray-700 uppercase tracking-wide text-xs">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    {/* ✅ Loading spinner dengan animasi spin */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-gray-300 border-t-blue-500 rounded-full spin-animate"></div>
                      <span className="text-gray-600 font-normal">Loading operation data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOperations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <p className="text-gray-500 font-normal leading-relaxed">
                      No operations found. Try adjusting your search.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedOperations.map((operation, idx) => (
                  <tr 
                    key={operation.id}
                    className="hover:bg-blue-50 transition-colors duration-200 fade-in"
                    style={{
                      animation: `fadeIn 0.3s ease-out forwards`,
                      opacity: 0,
                      animationDelay: `${idx * 50}ms`
                    }}
                  >
                    {/* ✅ Style dengan font-medium */}
                    <td className="px-6 py-4 font-medium text-gray-900 leading-normal">
                      {operation.style}
                    </td>
                    {/* ✅ Date */}
                    <td className="px-6 py-4 text-gray-700 text-sm font-normal leading-normal">
                      {operation.date}
                    </td>
                    {/* ✅ User dengan badge styling */}
                    <td className="px-6 py-4">
                      <span className="badge badge-primary">
                        {operation.user}
                      </span>
                    </td>
                    {/* ✅ Buyer dengan badge styling */}
                    <td className="px-6 py-4">
                      <span className="badge badge-info">
                        {operation.buyer}
                      </span>
                    </td>
                    {/* ✅ Line text */}
                    <td className="px-6 py-4 text-gray-700 text-sm font-normal leading-normal">
                      {operation.line}
                    </td>
                    {/* ✅ Actions buttons dengan tooltip */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* ✅ View button */}
                        <button
                          onClick={() => handleViewDetail(operation)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 tooltip"
                          data-tooltip="View details"
                          title="View Detail"
                        >
                          <Eye size={18} />
                        </button>
                        {/* ✅ Edit button */}
                        <button
                          className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-all duration-200 tooltip"
                          data-tooltip="Edit operation"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* ✅ Delete button */}
                        <button
                          onClick={() => handleDelete(operation.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 tooltip"
                          data-tooltip="Delete operation"
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

        {/* ✅ Table Footer dengan styling */}
        <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gray-600 font-normal leading-normal">
            Total: <span className="font-semibold text-gray-900">{filteredOperations.length}</span> operations
          </div>
          
          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex gap-2 items-center">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 leading-normal"
              >
                ◀ Previous
              </button>
              
              {/* Page Info */}
              <div className="text-xs text-gray-600 font-semibold px-3 py-1.5 bg-white border border-gray-200 rounded-lg leading-normal">
                Page {currentPage} / {totalPages}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 leading-normal"
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* ✅ Detail Modal dengan animasi penuh */}
      {showDetail && selectedOperation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 fade-in">
          {/* ✅ Modal dengan animasi scaleIn */}
          <Card shadow="2xl" padding="lg" rounded="lg" className="w-full max-w-3xl my-8 scale-in max-h-[90vh] overflow-y-auto">
            {/* ✅ Modal Header dengan font-display */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200 slide-in-down">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 font-display leading-tight tracking-tight">
                  Operation Detail
                </h2>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Style: <span className="font-semibold text-gray-900">{selectedOperation.style}</span>
                </p>
              </div>
              {/* ✅ Close button dengan hover effect */}
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200 text-2xl font-bold ml-4"
                title="Close modal"
              >
                ×
              </button>
            </div>

            {/* ✅ Modal Content dengan animasi slideInUp */}
            <div className="slide-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Detail Info */}
                <div className="space-y-4">
                  {/* ✅ Form-group styling */}
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Style Code</label>
                    <p className="mt-2 text-lg font-medium text-gray-900 leading-normal">
                      {selectedOperation.style}
                    </p>
                  </div>

                  <div className="divider"></div>

                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date Created</label>
                    <p className="mt-2 text-base font-normal text-gray-700 leading-normal">
                      {selectedOperation.date}
                    </p>
                  </div>

                  <div className="divider"></div>

                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">User</label>
                    <p className="mt-2">
                      <span className="badge badge-primary">
                        {selectedOperation.user}
                      </span>
                    </p>
                  </div>

                  <div className="divider"></div>

                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Buyer</label>
                    <p className="mt-2">
                      <span className="badge badge-info">
                        {selectedOperation.buyer}
                      </span>
                    </p>
                  </div>

                  <div className="divider"></div>

                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Line</label>
                    <p className="mt-2 text-base font-normal text-gray-700 leading-relaxed">
                      {selectedOperation.line}
                    </p>
                  </div>

                  <div className="divider"></div>

                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">SAM</label>
                    <p className="mt-2 text-base font-medium text-gray-900 leading-normal">
                      {typeof selectedOperation.sam === 'number' ? selectedOperation.sam.toFixed(2) : selectedOperation.sam}
                    </p>
                  </div>

                  <div className="divider"></div>

                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Manpower</label>
                    <p className="mt-2 text-base font-medium text-gray-900 leading-normal">
                      {selectedOperation.manpower}
                    </p>
                  </div>
                </div>

                {/* ✅ Images dengan styling dan animasi */}
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Front Picture
                    </label>
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300">
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

                  <div className="divider"></div>

                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Back Picture
                    </label>
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300">
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

              {/* ✅ Divider sebelum actions */}
              <div className="divider"></div>

              {/* ✅ Modal Footer dengan buttons */}
              <div className="flex justify-end gap-3 slide-in-up">
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-all duration-200 tracking-normal leading-normal"
                >
                  Close
                </button>
                <button
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 tracking-normal leading-normal"
                >
                  Edit Operation
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}