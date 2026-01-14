import { useState, useEffect } from 'react'
import { Download, Filter, Search, Calendar, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Report() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedReport, setSelectedReport] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' atau 'grid'
  const [stats, setStats] = useState({
    total: 0,
    production: 0,
    operational: 0,
    quality: 0
  })

  // 📊 FETCH DATA REPORTS
  useEffect(() => {
    fetchReports()
  }, [dateRange])

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)

      // ⭐ API CALL - sesuaikan dengan endpoint Anda
      const response = await fetch(
        `/api/reports?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // ⭐ SAMPLE DATA (gunakan ini jika API belum siap)
      const sampleReports = [
        {
          id: 1,
          title: 'Daily Production Report',
          type: 'production',
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
          description: 'Daily production metrics and KPI analysis',
          metrics: {
            totalProduced: 1250,
            target: 1200,
            efficiency: 98.5
          },
          downloadUrl: '/reports/daily-production.pdf',
          createdBy: 'System',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Weekly Operation Breakdown',
          type: 'operational',
          date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
          status: 'completed',
          description: 'Weekly operational efficiency analysis',
          metrics: {
            downtime: 45,
            efficiency: 95.2,
            issues: 3
          },
          downloadUrl: '/reports/weekly-operation.pdf',
          createdBy: 'Admin User',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
        },
        {
          id: 3,
          title: 'Quality Control Report',
          type: 'quality',
          date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
          status: 'pending',
          description: 'Quality metrics and defect analysis',
          metrics: {
            passRate: 99.2,
            defects: 8,
            costOfQuality: 4500
          },
          downloadUrl: '/reports/quality-control.pdf',
          createdBy: 'Quality Team',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
        },
        {
          id: 4,
          title: 'Hourly Output Summary',
          type: 'production',
          date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
          status: 'completed',
          description: 'Hourly production output tracking',
          metrics: {
            totalHours: 24,
            avgHourlyOutput: 52.1,
            peakHour: '10:00-11:00'
          },
          downloadUrl: '/reports/hourly-output.pdf',
          createdBy: 'System',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
        }
      ]

      setReports(data?.reports || sampleReports)
      updateStats(data?.reports || sampleReports)
    } catch (err) {
      console.error('❌ Error fetching reports:', err)
      // Fallback ke sample data
      const sampleReports = [
        {
          id: 1,
          title: 'Daily Production Report',
          type: 'production',
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
          description: 'Daily production metrics and KPI analysis',
          metrics: { totalProduced: 1250, target: 1200, efficiency: 98.5 },
          downloadUrl: '#'
        },
        {
          id: 2,
          title: 'Weekly Operation Breakdown',
          type: 'operational',
          date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
          status: 'completed',
          description: 'Weekly operational efficiency analysis',
          metrics: { downtime: 45, efficiency: 95.2, issues: 3 },
          downloadUrl: '#'
        },
        {
          id: 3,
          title: 'Quality Control Report',
          type: 'quality',
          date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
          status: 'pending',
          description: 'Quality metrics and defect analysis',
          metrics: { passRate: 99.2, defects: 8, costOfQuality: 4500 },
          downloadUrl: '#'
        }
      ]
      setReports(sampleReports)
      updateStats(sampleReports)
      setError('Failed to fetch reports. Showing sample data.')
    } finally {
      setLoading(false)
    }
  }

  // 📈 UPDATE STATISTICS
  const updateStats = (reportList) => {
    const typeCount = {
      production: reportList.filter(r => r.type === 'production').length,
      operational: reportList.filter(r => r.type === 'operational').length,
      quality: reportList.filter(r => r.type === 'quality').length
    }

    setStats({
      total: reportList.length,
      production: typeCount.production,
      operational: typeCount.operational,
      quality: typeCount.quality
    })
  }

  // 🔍 FILTER & SEARCH
  useEffect(() => {
    let filtered = reports

    // Filter berdasarkan type
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType)
    }

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredReports(filtered)
  }, [searchTerm, filterType, reports])

  // 💾 DOWNLOAD REPORT
  const handleDownload = (report) => {
    console.log('📥 Downloading report:', report.title)
    // Implementasi download logic
    alert(`Downloading: ${report.title}`)
  }

  // 📋 VIEW REPORT DETAILS
  const handleViewDetails = (report) => {
    setSelectedReport(report)
  }

  const getTypeColor = (type) => {
    const colors = {
      production: 'bg-blue-100 text-blue-800',
      operational: 'bg-green-100 text-green-800',
      quality: 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <div className="text-sm text-gray-500">
              User: <span className="font-semibold">{user?.username}</span> | Role: <span className="font-semibold uppercase">{user?.role}</span>
            </div>
          </div>
          <p className="text-gray-600">Generate and manage production, operational, and quality reports</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            ℹ️ {error}
          </div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Reports" 
            value={stats.total} 
            icon="📊"
            color="blue"
          />
          <StatCard 
            title="Production" 
            value={stats.production} 
            icon="🏭"
            color="green"
          />
          <StatCard 
            title="Operational" 
            value={stats.operational} 
            icon="⚙️"
            color="orange"
          />
          <StatCard 
            title="Quality" 
            value={stats.quality} 
            icon="✓"
            color="purple"
          />
        </div>

        {/* FILTERS & SEARCH */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="production">Production</option>
                <option value="operational">Operational</option>
                <option value="quality">Quality</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredReports.length}</span> of <span className="font-semibold">{reports.length}</span> reports
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grid View
              </button>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Loading reports...</p>
            </div>
          </div>
        )}

        {/* NO DATA STATE */}
        {!loading && filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Filter size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">No reports found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or date range</p>
          </div>
        )}

        {/* LIST VIEW */}
        {!loading && viewMode === 'list' && filteredReports.length > 0 && (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(report.date)}
                      </span>
                      <span>Created by: {report.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(report)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600 hover:text-blue-700"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleDownload(report)}
                      className="p-2 hover:bg-green-50 rounded-lg transition text-green-600 hover:text-green-700"
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && viewMode === 'grid' && filteredReports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">{report.title}</h3>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{report.description}</p>

                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(report.date)}
                    </div>
                    <div className="text-xs">By: {report.createdBy}</div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleViewDetails(report)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(report)}
                      className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedReport.title}</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Report Type</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedReport.type)}`}>
                    {selectedReport.type}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Report Date</p>
                  <p className="text-gray-900">{formatDate(selectedReport.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created By</p>
                  <p className="text-gray-900">{selectedReport.createdBy}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{selectedReport.description}</p>
              </div>

              {selectedReport.metrics && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Key Metrics</p>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedReport.metrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {typeof value === 'number' && value > 100 ? `${value}${key.includes('Efficiency') || key.includes('Rate') ? '%' : ''}` : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t flex gap-3">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedReport)
                    setSelectedReport(null)
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// STAT CARD COMPONENT
function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: 'from-blue-50 to-blue-100 text-blue-600',
    green: 'from-green-50 to-green-100 text-green-600',
    orange: 'from-orange-50 to-orange-100 text-orange-600',
    purple: 'from-purple-50 to-purple-100 text-purple-600'
  }

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} rounded-lg p-6 border border-opacity-20`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm opacity-70">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}