import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import BreadCrumb from '@/components/common/BreadCrumb'
import DashboardStats from '@/components/dashboard/DashboardStats'
import ProcessPerformanceChart from '@/components/dashboard/ProcessPerformanceChart'
import DailySummaryPerformance from '@/components/dashboard/DailySummaryPerformance'
import ProcessDetailsTable from '@/components/dashboard/ProcessDetailsTable'
import BottleneckDetector from '@/components/dashboard/BottleneckDetector'
import { FullscreenLayout, FullscreenToggleButton } from '@/components/fullscreen/FullscreenMode'
import { useDashboardData } from '@/hooks/useDashboardData'

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
    orcData,      // ✅ TAMBAH INI
    styleData     // ✅ TAMBAH INI
  } = useDashboardData(user?.id_line)

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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Dashboard Header with Fullscreen Toggle */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900"></h1>
        <FullscreenToggleButton />
      </div>

      {/* Dashboard Stats - KPI Cards */}
      <DashboardStats
        processChartData={processChartData}
        allHoursData={allHoursData}
        viewAllHours={viewAllHours}
        selectedHour={selectedHour}
        user={user}
      />

      {/* ⭐ BOTTLENECK DETECTOR - Show only when button is clicked (jadi tampilan pertama) */}
      {showBottleneck && !viewAllHours && processChartData.length > 0 && (
        <div id="bottleneck-section">
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
        orcData={orcData}           // ✅ TAMBAH INI
        styleData={styleData}       // ✅ TAMBAH INI
      />

      {/* Daily Summary Performance - Operator aggregated view */}
      <DailySummaryPerformance
        processChartData={processChartData}
        allHoursData={allHoursData}
        viewAllHours={viewAllHours}
        chartLoading={chartLoading}
      />

      {/* Process Details Table - Detailed breakdown (only for single hour) */}
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
      <div className="px-responsive py-responsive">
        {dashboardContent}
      </div>
    </FullscreenLayout>
  )
}

export default Dashboard