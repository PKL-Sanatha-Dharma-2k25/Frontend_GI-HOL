import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import BreadCrumb from '@/components/common/BreadCrumb'
import DashboardStats from '@/components/dashboard/DashboardStats'
import ProcessPerformanceChart from '@/components/dashboard/ProcessPerformanceChart'
import DailySummaryPerformance from '@/components/dashboard/DailySummaryPerformance'
import ProcessDetailsTable from '@/components/dashboard/ProcessDetailsTable'
import BottleneckDetector from '@/components/dashboard/BottleneckDetector'
import OrcProcessLineChart from '@/components/dashboard/OrcProcessLineChart'
import { FullscreenLayout, FullscreenToggleButton } from '@/components/fullscreen/FullscreenMode'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useOrcLineChartData } from '@/hooks/useOrcLineChartData'
import BgHero from '@/assets/images/Picture1.png'

function Dashboard() {
  const { user, loading } = useAuth()
  const [showBottleneck, setShowBottleneck] = useState(false)
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

  // NEW: Hook untuk line chart
  const { chartData: orcLineChartData, lineChartLoading } = useOrcLineChartData(orcData)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/', active: true },
  ]

  const dashboardContent = (
    <div className="space-y-6 relative z-0">
      {/* Breadcrumb */}
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Dashboard Header with Fullscreen Toggle - INSIDE Stats Card Now */}
      {/* ⭐ Dashboard Stats - With Real Background Image */}
      <div 
        className="relative overflow-hidden rounded-2xl shadow-xl"
        style={{
          backgroundImage: `url(${BgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark Overlay - Untuk readability */}
        <div className="absolute inset-0 bg-black/35" />
        
        {/* Color Gradient Overlay - Green & Blue tone */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-blue-900/30 to-teal-900/40" />
        
        {/* Header dengan Fullscreen Button */}
        <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
          <FullscreenToggleButton />
        </div>
        
        {/* Content - Stats Cards */}
        <div className="relative z-10 p-10 sm:p-12">
          <DashboardStats
            processChartData={processChartData}
            allHoursData={allHoursData}
            viewAllHours={viewAllHours}
            selectedHour={selectedHour}
            user={user}
          />
        </div>
      </div>

      {/* ⭐ BOTTLENECK DETECTOR */}
      {showBottleneck && !viewAllHours && processChartData.length > 0 && (
        <div id="bottleneck-section" className="relative z-0">
          <BottleneckDetector data={processChartData} />
        </div>
      )}

      {/* Process Performance Chart - Main chart view */}
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

      {/* ⭐ ORC PROCESS LINE CHART - NEW */}
      {!viewAllHours && orcData !== '-' && (
        <div id="orc-line-chart-section" className="relative z-0">
          <OrcProcessLineChart
            chartData={orcLineChartData}
            loading={lineChartLoading}
            orc={orcData}
          />
        </div>
      )}

      {/* Daily Summary Performance */}
      <DailySummaryPerformance
        processChartData={processChartData}
        allHoursData={allHoursData}
        viewAllHours={viewAllHours}
        chartLoading={chartLoading}
      />

      {/* Process Details Table */}
      {!viewAllHours && (
        <ProcessDetailsTable
          data={processChartData}
          loading={chartLoading}
        />
      )}
    </div>
  )

  return (
    <FullscreenLayout>
      <div className="px-responsive py-responsive relative z-0">
        {dashboardContent}
      </div>
    </FullscreenLayout>
  )
}

export default Dashboard