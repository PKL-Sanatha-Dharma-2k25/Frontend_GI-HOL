
import { useAuth } from '@/hooks/useAuth'
import BreadCrumb from '@/components/common/BreadCrumb'
import DashboardStats from '@/components/dashboard/DashboardStats'
import ProcessPerformanceChart from '@/components/dashboard/ProcessPerformanceChart'
import DailySummaryPerformance from '@/components/dashboard/DailySummaryPerformance'
import ProcessDetailsTable from '@/components/dashboard/ProcessDetailsTable'
import { useDashboardData } from '@/hooks/useDashboardData'

function Dashboard() {
  const { user, loading } = useAuth()
  const {
    selectedHour,
    setSelectedHour,
    viewAllHours,
    setViewAllHours,
    processChartData,
    allHoursData,
    chartLoading
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

  return (
    <div className="space-y-6 px-responsive py-responsive">
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <DashboardStats
        processChartData={processChartData}
        allHoursData={allHoursData}
        viewAllHours={viewAllHours}
        selectedHour={selectedHour}
        user={user}
      />

      <ProcessPerformanceChart
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
        viewAllHours={viewAllHours}
        setViewAllHours={setViewAllHours}
        processChartData={processChartData}
        allHoursData={allHoursData}
        chartLoading={chartLoading}
        user={user}
      />

      <DailySummaryPerformance
        processChartData={processChartData}
        allHoursData={allHoursData}
        viewAllHours={viewAllHours}
        chartLoading={chartLoading}
      />

      {!viewAllHours && (
        <ProcessDetailsTable
          data={processChartData}
          loading={chartLoading}
        />
      )}
    </div>
  )
}

export default Dashboard