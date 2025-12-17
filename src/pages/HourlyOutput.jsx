import { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, Eye, Edit2, Trash2, Plus, X, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/hooks/useAuth';
import { getOrcSewing, getStyleOrc, getHourlyOutput, storeHourlyOutput } from '@/services/apiService';

const HOURS = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

export default function HourlyOutput() {
  const { sidebarHovered } = useSidebar();
  const { user } = useAuth(); // ⭐ Get user data including id_line
  const [outputs, setOutputs] = useState([]);
  const [orcList, setOrcList] = useState([]);
  const [styleList, setStyleList] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedOrc, setSelectedOrc] = useState(null);
  const [selectedOrcIdx, setSelectedOrcIdx] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: ''
  });

  // Load data on mount
  useEffect(() => {
    if (user?.id_line) {
      loadInitialData()
    }
  }, [user])

  const loadInitialData = async () => {
    setLoading(true);
    try {
      console.group('🔴 [HourlyOutput] Loading data...');
      console.log('User id_line:', user?.id_line);
      
      // Load ORC data
      console.log('STEP 1: Fetching ORC data...');
      const orcData = await getOrcSewing();
      console.log('✅ ORC Data:', orcData);
      setOrcList(orcData.data || orcData || []);

      // ⭐ Load Hourly Output with id_line parameter
      console.log('STEP 2: Fetching Hourly Output with id_line:', user?.id_line);
      const outputData = await getHourlyOutput(null, user?.id_line);
      console.log('✅ Output Data:', outputData);
      setOutputs(outputData.data || outputData || []);

      setAlertType('success');
      setAlertMessage('Data loaded successfully');
      setShowAlert(true);
      console.log('✅ Data loaded successfully');
      console.groupEnd();
    } catch (error) {
      console.group('❌ [HourlyOutput] Error loading data');
      console.error('Error:', error);
      console.groupEnd();
      
      setAlertType('error');
      setAlertMessage('Failed to load data');
      setShowAlert(true);
    } finally {
      setLoading(false);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Get today's date realtime
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  // Handle ORC selection - auto-fill style dan buyer
  const handleOrcSelect = (orcIdx) => {
    if (orcIdx === '') {
      setSelectedOrc(null);
      setSelectedOrcIdx('');
      return;
    }
    const orc = orcList[parseInt(orcIdx)];
    if (orc) {
      setSelectedOrc(orc);
      setSelectedOrcIdx(orcIdx);
      console.log('Selected ORC:', orc);
    }
  };

  // Filter & Sort outputs
  const filteredOutputs = outputs
    .filter(output => 
      (output.style && output.style.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (output.buyer && output.buyer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (output.date && output.date.includes(searchQuery)) ||
      (output.orc && output.orc.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFormSubmit = async () => {
    if (!formData.date || !formData.time || !selectedOrc) {
      setAlertType('error');
      setAlertMessage('Please fill all fields');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        date: formData.date,
        hour: formData.time,
        orc: selectedOrc.orc,
        style: selectedOrc.style,
        buyer: selectedOrc.buyer
      };

      console.log('Sending payload:', payload);
      const response = await storeHourlyOutput(payload);
      console.log('Response from API:', response);
      
      // Add to local state
      const newOutput = {
        id: response.id || Math.max(...outputs.map(o => o.id || 0), 0) + 1,
        date: formData.date,
        time: formData.time,
        style: selectedOrc.style,
        orc: selectedOrc.orc,
        buyer: selectedOrc.buyer,
        target: 0,
        actual: 0,
        details: []
      };

      console.log('Adding new output:', newOutput);
      setOutputs([...outputs, newOutput]);
      setAlertType('success');
      setAlertMessage('Hourly output created successfully');
      setShowAlert(true);
      
      // Reset form
      closeForm();
    } catch (error) {
      console.error('Error saving:', error);
      setAlertType('error');
      setAlertMessage('Failed to save hourly output');
      setShowAlert(true);
    } finally {
      setLoading(false);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure want to delete this hourly output?')) {
      setOutputs(outputs.filter(o => o.id !== id));
      setAlertType('success');
      setAlertMessage('Hourly output deleted successfully');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedOrc(null);
    setSelectedOrcIdx('');
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: ''
    });
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
    <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Alert */}
      {showAlert && (
        <div className={`p-4 rounded-lg ${alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {alertMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hourly Output</h1>
        <p className="text-gray-600 mt-1">Manage your hourly production output</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by date, style, buyer, or ORC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Form Dropdown */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Plus size={20} className="text-blue-600" />
            <span className="font-semibold text-gray-900">Add New Output</span>
          </div>
          <ChevronRight size={20} className={`text-gray-400 transition-transform ${showForm ? 'rotate-90' : ''}`} />
        </button>

        {/* Form Content */}
        {showForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* ORC Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">ORC *</label>
                <select
                  value={selectedOrcIdx}
                  onChange={(e) => handleOrcSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Choose ORC</option>
                  {orcList.map((orc, idx) => (
                    <option key={idx} value={idx}>
                      {orc.orc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Style (Auto-filled) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Style</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-900">
                  {selectedOrc?.style || '-'}
                </div>
              </div>

              {/* Buyer (Auto-filled) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Buyer</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-900 truncate">
                  {selectedOrc?.buyer || '-'}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Hour */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Hour *</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select</option>
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Date" sortKey="date" />
                </th>
                <th className="px-6 py-4 text-left">
                  <SortHeader label="Time" sortKey="time" />
                </th>
                <th className="px-6 py-4 text-left">ORC</th>
                <th className="px-6 py-4 text-left">Style</th>
                <th className="px-6 py-4 text-left">Buyer</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredOutputs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No hourly outputs found
                  </td>
                </tr>
              ) : (
                filteredOutputs.map((output) => (
                  <tr key={output.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{output.date}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{output.time}</td>
                    <td className="px-6 py-4 font-medium text-blue-600">{output.orc}</td>
                    <td className="px-6 py-4 text-gray-600">{output.style}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{output.buyer}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOutput(output);
                            setShowDetail(true);
                          }}
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
                          onClick={() => handleDelete(output.id)}
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

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Total: {filteredOutputs.length} hourly outputs
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedOutput && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Output Detail: {selectedOutput.style}
                </h2>
                <p className="text-gray-600 mt-1">{selectedOutput.date} - {selectedOutput.time}</p>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">ORC</p>
                  <p className="font-semibold text-gray-900">{selectedOutput.orc}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Target</p>
                  <p className="font-semibold text-gray-900">{selectedOutput.target}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Actual</p>
                  <p className="font-semibold text-gray-900">{selectedOutput.actual}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Efficiency</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOutput.target > 0 ? ((selectedOutput.actual / selectedOutput.target) * 100).toFixed(1) : '0'}%
                  </p>
                </div>
              </div>

              {selectedOutput.details && selectedOutput.details.length > 0 && (
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left font-semibold">Process</th>
                        <th className="px-4 py-3 text-center font-semibold">Start Time</th>
                        <th className="px-4 py-3 text-center font-semibold">End Time</th>
                        <th className="px-4 py-3 text-center font-semibold">Qty</th>
                        <th className="px-4 py-3 text-center font-semibold">Target</th>
                        <th className="px-4 py-3 text-left font-semibold">Operator</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOutput.details.map((detail) => (
                        <tr key={detail.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{detail.process}</td>
                          <td className="px-4 py-3 text-center">{detail.startTime}</td>
                          <td className="px-4 py-3 text-center">{detail.endTime}</td>
                          <td className="px-4 py-3 text-center font-semibold">{detail.qty}</td>
                          <td className="px-4 py-3 text-center">{detail.target}</td>
                          <td className="px-4 py-3">{detail.operator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}