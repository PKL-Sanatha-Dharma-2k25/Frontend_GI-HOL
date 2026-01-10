import { BarChart3, RefreshCw, Clock, TrendingUp, Activity, Filter, AlertTriangle } from 'lucide-react'
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
  user,
  showBottleneck,
  setShowBottleneck
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

  // Enhanced Filter Section
  const FilterSection = () => (
    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-slate-50 via-emerald-50 to-slate-50 rounded-xl border border-emerald-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        
        {/* Left Section - Controls */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          
          {/* Hour Selector */}
          <div className="w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-2 uppercase tracking-wider">
              <Clock size={16} className="text-emerald-600" strokeWidth={2.5} />
              Select Hour
            </label>
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              disabled={viewAllHours || chartLoading}
              className="w-full sm:w-48 px-4 py-2.5 bg-white border-2 border-emerald-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-300 transition-all hover:border-emerald-400"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((hour) => (
                <option key={hour} value={hour.toString()}>
                  Hour {hour}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle Button */}
          <div className="w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-2 uppercase tracking-wider">
              <Filter size={16} className="text-emerald-600" strokeWidth={2.5} />
              View Type
            </label>
            <button
              onClick={() => setViewAllHours(!viewAllHours)}
              disabled={chartLoading}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                viewAllHours
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 border-2 border-emerald-600'
                  : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {chartLoading && <RefreshCw size={16} className="animate-spin" strokeWidth={2.5} />}
              {!chartLoading && <TrendingUp size={16} strokeWidth={2.5} />}
              <span>{viewAllHours ? 'All Hours' : 'Single Hour'}</span>
            </button>
          </div>

          {/* Bottleneck Detector Button - Show only in single hour view */}
          {!viewAllHours && processChartData.length > 0 && (
            <div className="w-full sm:w-auto">
              <label className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-2 uppercase tracking-wider opacity-0">
                Bottleneck
              </label>
              <button
                onClick={() => {
                  setShowBottleneck(!showBottleneck)
                  // Smooth scroll ke bottleneck section setelah state update
                  setTimeout(() => {
                    if (!showBottleneck) {
                      document.getElementById('bottleneck-section')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }
                  }, 100)
                }}
                disabled={chartLoading}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md border-2 border-red-600"
              >
                <AlertTriangle size={16} strokeWidth={2.5} />
                <span>{showBottleneck ? 'Hide Bottlenecks' : 'View Bottlenecks'}</span>
              </button>
            </div>
          )}
        
        </div>

        {/* Right Section - Info Cards */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          
          {/* Line Info Card */}
          <div className="flex-1 sm:flex-none px-4 py-2.5 bg-white rounded-lg border-2 border-emerald-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Activity size={16} className="text-emerald-600" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-xs text-slate-600 font-medium block">Current Line</span>
                <span className="text-base font-bold text-emerald-600">{user?.id_line || '-'}</span>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {chartLoading && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-lg border-2 border-emerald-200">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs text-slate-600 font-medium">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card shadow="md" padding="lg" rounded="lg" className="fade-in bg-white">
      
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6 sm:mb-8 pb-4 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <BarChart3 size={22} className="text-emerald-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Process Performance</h3>
          </div>
          {viewAllHours && (
            <p className="text-sm text-slate-600 ml-11 mt-1">
              Comparing output across all 10 hours of production
            </p>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection />

      {/* Chart Section */}
      <div className="relative min-h-96 mt-8">
        {!chartLoading ? (
          <div className="overflow-x-auto pb-4">
            {viewAllHours ? (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  All Hours View
                </div>
                <AllHoursChart data={allHoursData} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Hour {selectedHour} Details
                </div>
                <StackedBarChart data={processChartData} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="flex justify-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-sm text-slate-600 font-semibold">
                  {viewAllHours ? 'Loading all hours data...' : 'Loading chart data...'}
                </p>
              </div>
            </div>
            <SkeletonBar />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Card>
  )
}

export default ProcessPerformanceChart