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
  setShowBottleneck,
  orcData = '-',
  styleData = '-'
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
      <style>{`
        /* ===== FULLSCREEN RESPONSIVE FIX ===== */
        .filter-container {
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 3vw, 1.5rem);
        }

        .filter-top-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: clamp(0.75rem, 2vw, 1.5rem);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: clamp(0.5rem, 1vw, 0.75rem);
          min-width: 0;
        }

        .filter-label {
          font-size: clamp(0.65rem, 1.2vw, 0.8rem);
          font-weight: 600;
          color: #475569;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: clamp(0.4rem, 1vw, 0.5rem);
        }

        .filter-label svg {
          width: clamp(16px, 2vw, 18px);
          height: clamp(16px, 2vw, 18px);
          flex-shrink: 0;
        }

        /* Select Input */
        .filter-select {
          width: 100%;
          padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem);
          border-radius: 0.5rem;
          border: 2px solid #a7f3d0;
          background-color: white;
          font-size: clamp(0.7rem, 1.1vw, 0.875rem);
          font-weight: 600;
          color: #0f172a;
          transition: all 0.2s ease;
          min-height: clamp(2.5rem, 5vh, 2.75rem);
        }

        .filter-select:hover:not(:disabled) {
          border-color: #6ee7b7;
          background-color: #f0fdf4;
        }

        .filter-select:focus {
          outline: none;
          ring: 2px;
          ring-color: #10b981;
          border-color: transparent;
        }

        .filter-select:disabled {
          background-color: #f1f5f9;
          color: #64748b;
          cursor: not-allowed;
          border-color: #cbd5e1;
        }

        /* Filter Button */
        .filter-button {
          width: 100%;
          padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem);
          border-radius: 0.5rem;
          font-size: clamp(0.7rem, 1.1vw, 0.875rem);
          font-weight: 600;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.4rem, 1vw, 0.5rem);
          border: 2px solid;
          cursor: pointer;
          min-height: clamp(2.5rem, 5vh, 2.75rem);
          flex-shrink: 0;
          white-space: nowrap;
        }

        .filter-button svg {
          width: clamp(14px, 1.5vw, 16px);
          height: clamp(14px, 1.5vw, 16px);
          flex-shrink: 0;
        }

        .filter-button.toggle-all {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-color: #059669;
        }

        .filter-button.toggle-all:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
        }

        .filter-button.toggle-single {
          background: white;
          color: #475569;
          border-color: #cbd5e1;
        }

        .filter-button.toggle-single:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #9ca3af;
        }

        .filter-button.bottleneck {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border-color: #dc2626;
        }

        .filter-button.bottleneck:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
        }

        .filter-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Info Cards Row */
        .filter-bottom-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: clamp(0.75rem, 2vw, 1rem);
          border-top: 1px solid #a7f3d0;
          padding-top: clamp(0.75rem, 2vw, 1rem);
        }

        .info-card {
          position: relative;
          overflow: hidden;
          padding: clamp(0.75rem, 2vw, 1rem);
          border-radius: 0.5rem;
          border: 2px solid;
          background: white;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: clamp(0.4rem, 1vw, 0.6rem);
        }

        .info-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: clamp(0.5rem, 1.5vw, 0.75rem);
        }

        .info-card-icon {
          padding: clamp(0.4rem, 1vw, 0.6rem);
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .info-card:hover .info-card-icon {
          transform: scale(1.15);
        }

        .info-card-label {
          font-size: clamp(0.6rem, 1vw, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 0;
        }

        .info-card-value {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          font-weight: 700;
          margin: 0;
          word-break: break-word;
          padding-left: clamp(0.4rem, 1vw, 0.6rem);
        }

        /* Card Variants */
        .info-card.orc {
          border-color: #e9d5ff;
        }

        .info-card.orc .info-card-icon {
          background-color: #ede9fe;
        }

        .info-card.orc .info-card-icon svg {
          color: #a855f7;
        }

        .info-card.orc .info-card-label {
          color: #64748b;
        }

        .info-card.orc .info-card-value {
          color: #a855f7;
        }

        .info-card.style {
          border-color: #fed7aa;
        }

        .info-card.style .info-card-icon {
          background-color: #fef3c7;
        }

        .info-card.style .info-card-icon svg {
          color: #d97706;
        }

        .info-card.style .info-card-label {
          color: #64748b;
        }

        .info-card.style .info-card-value {
          color: #d97706;
        }

        /* ===== FULLSCREEN ADJUSTMENTS ===== */
        .fullscreen-content-wrapper .filter-container {
          gap: 1.5rem;
        }

        .fullscreen-content-wrapper .filter-select,
        .fullscreen-content-wrapper .filter-button {
          font-size: 1rem;
          min-height: 3rem;
          padding: 0.875rem 1.25rem;
        }

        .fullscreen-content-wrapper .filter-label {
          font-size: 0.9rem;
        }

        .fullscreen-content-wrapper .info-card {
          padding: 1.25rem;
          gap: 0.75rem;
        }

        .fullscreen-content-wrapper .info-card-value {
          font-size: 1.5rem;
        }

        .fullscreen-content-wrapper .info-card-label {
          font-size: 0.85rem;
        }
      `}</style>

      <div className="filter-container">
        
        {/* Top Row - Controls */}
        <div className="filter-top-row">
          
          {/* Hour Selector */}
          <div className="filter-group">
            <label className="filter-label">
              <Clock size={16} strokeWidth={2.5} />
              Select Hour
            </label>
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              disabled={viewAllHours || chartLoading}
              className="filter-select"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((hour) => (
                <option key={hour} value={hour.toString()}>
                  Hour {hour}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle Button */}
          <div className="filter-group">
            <label className="filter-label">
              <Filter size={16} strokeWidth={2.5} />
              View Type
            </label>
            <button
              onClick={() => setViewAllHours(!viewAllHours)}
              disabled={chartLoading}
              className={`filter-button ${viewAllHours ? 'toggle-all' : 'toggle-single'}`}
            >
              {chartLoading && <RefreshCw size={16} className="animate-spin" strokeWidth={2.5} />}
              {!chartLoading && <TrendingUp size={16} strokeWidth={2.5} />}
              <span>{viewAllHours ? 'All Hours' : 'Single Hour'}</span>
            </button>
          </div>

          {/* Bottleneck Detector Button */}
          {!viewAllHours && processChartData.length > 0 && (
            <div className="filter-group">
              <label className="filter-label opacity-0">Bottleneck</label>
              <button
                onClick={() => {
                  setShowBottleneck(!showBottleneck)
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
                className="filter-button bottleneck"
              >
                <AlertTriangle size={16} strokeWidth={2.5} />
                <span>{showBottleneck ? 'Hide Bottlenecks' : 'View Bottlenecks'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Row - Info Cards */}
        {!viewAllHours && processChartData.length > 0 && (
          <div className="filter-bottom-row">
            
            {/* ORC Card */}
            <div className="info-card orc">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <Filter size={18} strokeWidth={2.5} />
                </div>
                <p className="info-card-label">ORC</p>
              </div>
              <p className="info-card-value">{orcData}</p>
            </div>

            {/* Style Card */}
            <div className="info-card style">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <p className="info-card-label">Style</p>
              </div>
              <p className="info-card-value">{styleData}</p>
            </div>
          </div>
        )}
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