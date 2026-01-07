import { BarChart3, RefreshCw, Clock, TrendingUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import StackedBarChart from './StackedBarChart'
import AllHoursChart from './AllHoursChart'

function ProcessPerformanceChart({
  selectedHour,
  setSelectedHour,
  viewAllHours,
  setViewAllHours,
  processChartData,
  allHoursData,
  chartLoading,
  user
}) {
  // Skeleton Loading Component
  const SkeletonBar = () => (
    <div className="space-y-3 px-2 sm:px-0">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-14 h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg animate-pulse"></div>
          <div className="flex-1 h-7 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse"></div>
          <div className="w-12 h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg animate-pulse"></div>
        </div>
      ))}
    </div>
  )

  // Filter Section
  const FilterSection = () => (
    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 rounded-xl border border-slate-200/70 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Section - Hour Selector & Button */}
        <div className="flex items-end gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Hour Selector */}
          <div className="flex-1 sm:flex-none sm:w-56">
            <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Clock size={16} className="text-emerald-600" />
              {viewAllHours ? 'All Hours' : 'Select Hour'}
            </label>
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              disabled={viewAllHours || chartLoading}
              className="w-full px-3 sm:px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed transition-all hover:border-slate-400"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((hour) => (
                <option key={hour} value={hour.toString()}>
                  Hour {hour}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setViewAllHours(!viewAllHours)}
            disabled={chartLoading}
            className={`px-4 sm:px-5 py-2.5 rounded-lg font-semibold transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-10 ${
              viewAllHours
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-sm'
            }`}
          >
            {chartLoading && <RefreshCw size={14} className="animate-spin" />}
            <TrendingUp size={16} />
            {viewAllHours ? 'All Hours' : 'View All'}
          </button>
        </div>

        {/* Right Section - Line Info & Loading */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto w-full sm:w-auto justify-end">
          {/* Line Info */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-600 font-medium">Line:</span>
            <span className="text-sm sm:text-base font-bold text-emerald-600">{user?.id_line || '-'}</span>
          </div>

          {/* Loading Indicator */}
          {chartLoading && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-xs text-slate-600 ml-2 hidden sm:inline font-medium">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card shadow="md" padding="lg" rounded="lg" className="fade-in bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Process Performance</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {viewAllHours ? 'Comparing output across all 10 hours' : 'Actual vs Target per operation'}
          </p>
        </div>
        <div className="p-2 bg-emerald-100 rounded-lg">
          <BarChart3 size={20} className="text-emerald-600" />
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection />

      {/* Chart Section */}
      <div className="relative min-h-96">
        {!chartLoading ? (
          <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0 px-4 sm:px-0">
            {viewAllHours ? (
              <AllHoursChart data={allHoursData} />
            ) : (
              <StackedBarChart data={processChartData} />
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  {viewAllHours ? 'Loading all hours data...' : 'Loading chart data...'}
                </p>
              </div>
            </div>
            <SkeletonBar />
          </div>
        )}
      </div>


    </Card>
  )
}

export default ProcessPerformanceChart