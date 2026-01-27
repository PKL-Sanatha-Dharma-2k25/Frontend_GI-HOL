import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import BreadCrumb from '@/components/common/BreadCrumb'
import DashboardStats from '@/components/dashboard/DashboardStats'
import ProcessPerformanceChart from '@/components/dashboard/ProcessPerformanceChart'
import ProcessDetailsTable from '@/components/dashboard/ProcessDetailsTable'
import BottleneckDetector from '@/components/dashboard/BottleneckDetector'
import OrcProcessLineChart from '@/components/dashboard/OrcProcessLineChart'
import OperatorLeaderboard from '@/components/dashboard/OperatorLeaderboard'
import { FullscreenLayout, FullscreenToggleButton } from '@/components/fullscreen/FullscreenMode'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useOrcLineChartData } from '@/hooks/useOrcLineChartData'
import BgHero from '@/assets/images/Picture1.png'

const Dashboard = () => {
  const { user, loading } = useAuth()
  const [showBottleneck, setShowBottleneck] = useState(false)
  const [showBalance, setShowBalance] = useState(false)

  const {
    selectedHour,
    setSelectedHour,
    viewAllHours,
    setViewAllHours,
    processChartData,
    allHoursData,
    chartLoading,
    orcData,
    styleData,
    statsData,
    statsLoading
  } = useDashboardData(user?.id_line)

  // NEW: Hook untuk line chart
  const { chartData: orcLineChartData, lineChartLoading } = useOrcLineChartData(orcData)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading production dashboard...</p>
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

      {/* Stats Summary section */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-xl"
        style={{
          backgroundImage: `url(${BgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-slate-900/30 to-teal-900/40" />

        <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white tracking-tight">Dashboard Overview</h2>
          <FullscreenToggleButton />
        </div>

        <div className="relative z-10 p-10 sm:p-12">
          <DashboardStats
            statsData={statsData}
            statsLoading={statsLoading}
            processChartData={processChartData}
            allHoursData={allHoursData}
            viewAllHours={viewAllHours}
            selectedHour={selectedHour}
          />
        </div>
      </div>

      {showBottleneck && !viewAllHours && processChartData.length > 0 && (
        <div id="bottleneck-section" className="relative z-0">
          <BottleneckDetector data={processChartData} />
        </div>
      )}

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
        showBalance={showBalance}
        setShowBalance={setShowBalance}
        orcData={orcData}
        styleData={styleData}
      />

      {!viewAllHours && orcData !== '-' && (
        <div id="orc-line-chart-section" className="relative z-0">
          <OrcProcessLineChart
            chartData={orcLineChartData}
            loading={lineChartLoading}
            orc={orcData}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {!viewAllHours && (
            <ProcessDetailsTable
              data={processChartData}
              loading={chartLoading}
            />
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <OperatorLeaderboard />
        </div>
      </div>
    </div>
  )

  return (
    <FullscreenLayout>
      <div className="px-responsive pt-responsive pb-24 relative z-0">
        {dashboardContent}
      </div>
    </FullscreenLayout>
  )
}

export default Dashboard