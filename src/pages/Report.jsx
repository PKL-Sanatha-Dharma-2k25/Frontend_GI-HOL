import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import BreadCrumb from '@/components/common/BreadCrumb'
import ProcessPerformanceChart from '@/components/dashboard/ProcessPerformanceChart'
import DailySummaryPerformance from '@/components/dashboard/DailySummaryPerformance'
import ProcessDetailsTable from '@/components/dashboard/ProcessDetailsTable'
import BottleneckDetector from '@/components/dashboard/BottleneckDetector'
import OrcProcessLineChart from '@/components/dashboard/OrcProcessLineChart'
import { FullscreenLayout } from '@/components/fullscreen/FullscreenMode'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useOrcLineChartData } from '@/hooks/useOrcLineChartData'
import BgHero from '@/assets/images/Picture1.png'
import { Download, FileText, Calendar, Filter, TrendingUp, Zap, AlertOctagon, Loader, X, BarChart2, CheckCircle2, Briefcase } from 'lucide-react'

function DashboardReport() {
  const { user, loading } = useAuth()
  const [showBottleneck, setShowBottleneck] = useState(false)
  const [reportDateRange, setReportDateRange] = useState('today')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState('performance')

  const {
    selectedHour,
    setSelectedHour,
    viewAllHours,
    setViewAllHours,
    processChartData,
    allHoursData,
    chartLoading,
    orcData,
    styleData
  } = useDashboardData(user?.id_line)

  const { chartData: orcLineChartData, lineChartLoading } = useOrcLineChartData(orcData)

  // ✅ EXPORT FUNCTIONALITY
  const handleExport = async (format) => {
    setExporting(true)
    try {
      if (format === 'pdf') {
        await exportToPDF()
      } else if (format === 'excel') {
        await exportToExcel()
      } else if (format === 'csv') {
        await exportToCSV()
      }
      setShowExportMenu(false)
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ Gagal export file. Silakan coba lagi.')
    } finally {
      setExporting(false)
    }
  }

  const exportToPDF = async () => {
    try {
      if (!window.html2pdf) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
        document.head.appendChild(script)
        await new Promise(resolve => { script.onload = resolve })
      }

      const element = document.querySelector('[data-report-content]')
      if (!element) throw new Error('Report content not found')
      
      const opt = {
        margin: 10,
        filename: `Production_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      }

      window.html2pdf().set(opt).from(element).save()
      alert('✅ PDF berhasil diunduh!')
    } catch (error) {
      console.error('PDF export error:', error)
      window.print()
    }
  }

  const exportToExcel = async () => {
    try {
      if (!window.XLSX) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js'
        document.head.appendChild(script)
        await new Promise(resolve => { script.onload = resolve })
      }

      const data = processChartData.map(item => ({
        'Process': item.process || '-',
        'Output': item.output || 0,
        'Target': item.target || 0,
        'Status': item.status || '-',
        'Time': item.time || '-'
      }))

      const ws = window.XLSX.utils.json_to_sheet(data)
      const wb = window.XLSX.utils.book_new()
      window.XLSX.utils.book_append_sheet(wb, ws, 'Production Data')
      window.XLSX.writeFile(wb, `Production_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
      alert('✅ Excel berhasil diunduh!')
    } catch (error) {
      console.error('Excel export error:', error)
      alert('❌ Gagal export Excel.')
    }
  }

  const exportToCSV = () => {
    try {
      const headers = ['Process', 'Output', 'Target', 'Status', 'Time']
      const csvContent = [
        headers.join(','),
        ...processChartData.map(item => [
          item.process || '-',
          item.output || 0,
          item.target || 0,
          item.status || '-',
          item.time || '-'
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.setAttribute('href', URL.createObjectURL(blob))
      link.setAttribute('download', `Production_Report_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      alert('✅ CSV berhasil diunduh!')
    } catch (error) {
      console.error('CSV export error:', error)
      alert('❌ Gagal export CSV')
    }
  }

  const getDateRangeLabel = () => {
    const today = new Date()
    switch (reportDateRange) {
      case 'today':
        return today.toLocaleDateString('id-ID', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      case 'week':
        const weekAgo = new Date(today.getTime() - 7*24*60*60*1000)
        return `${weekAgo.toLocaleDateString('id-ID', {month: 'short', day: 'numeric'})} - ${today.toLocaleDateString('id-ID', {month: 'short', day: 'numeric'})}`
      case 'month':
        const monthAgo = new Date(today.getTime() - 30*24*60*60*1000)
        return `${monthAgo.toLocaleDateString('id-ID', {month: 'short', day: 'numeric'})} - ${today.toLocaleDateString('id-ID', {month: 'short', day: 'numeric'})}`
      default:
        return 'Custom Range'
    }
  }

  const tabs = [
    { id: 'performance', label: 'Performance', icon: BarChart2 },
    ...((!viewAllHours && orcData !== '-') ? [{ id: 'orc', label: 'Operation', icon: TrendingUp }] : []),
    ...(showBottleneck && !viewAllHours && processChartData.length > 0 ? [{ id: 'bottleneck', label: 'Bottleneck', icon: AlertOctagon }] : []),
    { id: 'daily', label: 'Summary', icon: Calendar },
    ...(!viewAllHours ? [{ id: 'details', label: 'Details', icon: Briefcase }] : []),
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 font-semibold">Loading report...</p>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/', active: false },
    { label: 'Report', href: '/report', active: true },
  ]

  return (
    <FullscreenLayout>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen pb-20 md:pb-28">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="space-y-4 sm:space-y-6" data-report-content>
            
            {/* Breadcrumb */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <BreadCrumb items={breadcrumbItems} />
            </div>

            {/* REPORT HEADER - Premium Design */}
            <div 
              className="relative overflow-hidden rounded-3xl shadow-2xl group"
              style={{
                backgroundImage: `url(${BgHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-blue-950/70" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/30" />
              
              <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                <div className="space-y-6">
                  {/* Title Section */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 sm:p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                      <FileText className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Production Report</h1>
                      <p className="text-blue-100 text-sm sm:text-base mt-2">Real-time performance insights & analysis</p>
                    </div>
                  </div>

                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { icon: Calendar, label: 'Period', value: getDateRangeLabel() },
                      { icon: TrendingUp, label: 'ORC / Line', value: orcData !== '-' ? orcData : 'All ORC' },
                      { icon: Zap, label: 'Operator', value: user?.username || 'N/A' }
                    ].map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div key={i} className="group/card bg-white/[0.08] backdrop-blur-xl rounded-xl px-4 sm:px-5 py-4 border border-white/20 hover:bg-white/[0.12] hover:border-white/30 transition-all duration-300 cursor-default">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className="text-blue-200 group-hover/card:text-blue-100 transition-colors" />
                            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">{item.label}</p>
                          </div>
                          <p className="text-white font-bold text-sm sm:text-base truncate">{item.value}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* FILTER & EXPORT SECTION */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Filter */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Filter size={18} className="text-slate-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-700 whitespace-nowrap">Filter:</span>
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    {['today', 'week', 'month'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setReportDateRange(range)}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm uppercase whitespace-nowrap ${
                          reportDateRange === range
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {range === 'today' && 'Today'}
                        {range === 'week' && 'Week'}
                        {range === 'month' && 'Month'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Button */}
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={exporting}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 font-bold px-4 sm:px-6 py-2.5 rounded-xl transition-all duration-300 text-white whitespace-nowrap ${
                      exporting 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    {exporting ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span className="text-sm">Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span className="text-sm">Export</span>
                      </>
                    )}
                  </button>

                  {/* Export Menu Dropdown */}
                  {showExportMenu && !exporting && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-800">Export Format</p>
                        <button onClick={() => setShowExportMenu(false)} className="text-slate-500 hover:text-slate-700">
                          <X size={18} />
                        </button>
                      </div>
                      
                      {[
                        { format: 'pdf', label: 'Export as PDF', desc: 'Professional document', icon: '📄' },
                        { format: 'excel', label: 'Export as Excel', desc: 'Editable spreadsheet', icon: '📈' },
                        { format: 'csv', label: 'Export as CSV', desc: 'Data format', icon: '📊' }
                      ].map((item, idx) => (
                        <button
                          key={item.format}
                          onClick={() => handleExport(item.format)}
                          className={`w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-blue-50 transition-colors duration-200 group ${idx !== 2 ? 'border-b border-slate-100' : ''}`}
                        >
                          <div className="text-3xl flex-shrink-0 transition-transform group-hover:scale-110 duration-300">{item.icon}</div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 text-sm group-hover:text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                          </div>
                          <Download size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION - Modern Sliding Underline */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-semibold text-sm transition-all duration-300 whitespace-nowrap relative ${
                        isActive
                          ? 'text-blue-600'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* TAB CONTENT */}
              <div className="p-4 sm:p-6 min-h-96 animate-in fade-in duration-300">
                {activeTab === 'performance' && (
                  <ProcessPerformanceChart
                    selectedHour={selectedHour}
                    setSelectedHour={setSelectedHour}
                    viewAllHours={viewAllHours}
                    setViewAllHours={setViewAllHours}
                    processChartData={processChartData}
                    allHoursData={allHoursData}
                    chartLoading={chartLoading}
                    user={user}
                    showBottleneck={showBottleneck}
                    setShowBottleneck={setShowBottleneck}
                    orcData={orcData}
                    styleData={styleData}
                  />
                )}
                {activeTab === 'orc' && (
                  <OrcProcessLineChart
                    chartData={orcLineChartData}
                    loading={lineChartLoading}
                    orc={orcData}
                  />
                )}
                {activeTab === 'bottleneck' && (
                  <BottleneckDetector data={processChartData} />
                )}
                {activeTab === 'daily' && (
                  <DailySummaryPerformance
                    processChartData={processChartData}
                    allHoursData={allHoursData}
                    viewAllHours={viewAllHours}
                    chartLoading={chartLoading}
                  />
                )}
                {activeTab === 'details' && (
                  <ProcessDetailsTable
                    data={processChartData}
                    loading={chartLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - Premium Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-t border-slate-700 shadow-2xl z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: 'Generated', value: new Date().toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), icon: Calendar },
                { label: 'Operations', value: processChartData.length || 0, icon: TrendingUp },
                { label: 'Status', value: '✅ Complete', icon: CheckCircle2 }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="text-center group">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon size={16} className="text-blue-300 group-hover:text-blue-200 transition-colors" />
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{item.label}</p>
                    </div>
                    <p className={`font-bold text-sm sm:text-base ${i === 2 ? 'text-emerald-400' : 'text-white'} group-hover:scale-110 transition-transform origin-center`}>{item.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </FullscreenLayout>
  )
}

export default DashboardReport