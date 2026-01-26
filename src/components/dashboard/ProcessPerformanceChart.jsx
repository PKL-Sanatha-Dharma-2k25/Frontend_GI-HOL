import { BarChart3, RefreshCw, Clock, TrendingUp, Activity, Filter, AlertTriangle } from 'lucide-react'
import { useHour } from '@/hooks/useHour'
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
  const { hours, loading: hourLoading, getHourOptions, getHourName } = useHour()

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

  const FilterSection = () => (
    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-slate-50 via-emerald-50 to-slate-50 rounded-xl border border-emerald-200 shadow-sm">
      <style>{`
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

        .filter-bottom-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
          font-size: clamp(0.6rem, 0.9vw, 0.7rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 0;
        }

        .info-card-value {
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          font-weight: 700;
          margin: 0;
          word-break: break-word;
          padding-left: clamp(0.4rem, 1vw, 0.6rem);
        }

        .info-card.output {
          border-color: #86efac;
          background-color: #f0fdf4;
        }

        .info-card.output .info-card-icon {
          background-color: #dcfce7;
        }

        .info-card.output .info-card-icon svg {
          color: #16a34a;
        }

        .info-card.output .info-card-label {
          color: #16a34a;
        }

        .info-card.output .info-card-value {
          color: #15803d;
        }

        .info-card.target {
          border-color: #93c5fd;
          background-color: #f0f9ff;
        }

        .info-card.target .info-card-icon {
          background-color: #e0f2fe;
        }

        .info-card.target .info-card-icon svg {
          color: #0284c7;
        }

        .info-card.target .info-card-label {
          color: #0284c7;
        }

        .info-card.target .info-card-value {
          color: #075985;
        }

        .info-card.repair {
          border-color: #fcd34d;
          background-color: #fffbeb;
        }

        .info-card.repair .info-card-icon {
          background-color: #fef3c7;
        }

        .info-card.repair .info-card-icon svg {
          color: #ca8a04;
        }

        .info-card.repair .info-card-label {
          color: #ca8a04;
        }

        .info-card.repair .info-card-value {
          color: #b45309;
        }

        .info-card.reject {
          border-color: #fca5a5;
          background-color: #fef2f2;
        }

        .info-card.reject .info-card-icon {
          background-color: #fee2e2;
        }

        .info-card.reject .info-card-icon svg {
          color: #dc2626;
        }

        .info-card.reject .info-card-label {
          color: #dc2626;
        }

        .info-card.reject .info-card-value {
          color: #b91c1c;
        }

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
        
        <div className="filter-top-row">
          
          <div className="filter-group">
            <label className="filter-label">
              <Clock size={16} strokeWidth={2.5} />
              Select Hour
            </label>
            {hourLoading ? (
              <div className="filter-select flex items-center justify-center gap-2 text-slate-500">
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Loading hours...</span>
              </div>
            ) : hours.length === 0 ? (
              <div className="filter-select flex items-center text-slate-500">
                No hours available
              </div>
            ) : (
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                disabled={viewAllHours || chartLoading}
                className="filter-select"
              >
                {hours.map((hour) => (
                  <option key={hour.id_hour} value={hour.id_hour.toString()}>
                    {hour.name} ({hour.start_time} - {hour.end_time})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <Filter size={16} strokeWidth={2.5} />
              View Type
            </label>
            <button
              onClick={() => setViewAllHours(!viewAllHours)}
              disabled={chartLoading || hourLoading}
              className={`filter-button ${viewAllHours ? 'toggle-all' : 'toggle-single'}`}
            >
              {chartLoading && <RefreshCw size={16} className="animate-spin" strokeWidth={2.5} />}
              {!chartLoading && <TrendingUp size={16} strokeWidth={2.5} />}
              <span>{viewAllHours ? `All ${hours.length} Hours` : 'Single Hour'}</span>
            </button>
          </div>

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

        {!viewAllHours && processChartData.length > 0 && (
          <div className="filter-bottom-row">
            
            <div className="info-card output">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <p className="info-card-label">Output</p>
              </div>
              <p className="info-card-value">{processChartData.reduce((sum, item) => sum + (parseInt(item.output) || 0), 0)}</p>
            </div>

            <div className="info-card target">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <p className="info-card-label">Target</p>
              </div>
              <p className="info-card-value">{processChartData.reduce((sum, item) => sum + (Math.round(item.target) || 0), 0)}</p>
            </div>

            <div className="info-card repair">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p className="info-card-label">Repair</p>
              </div>
              <p className="info-card-value">{processChartData.reduce((sum, item) => sum + (parseInt(item.repair) || 0), 0)}</p>
            </div>

            <div className="info-card reject">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </div>
                <p className="info-card-label">Reject</p>
              </div>
              <p className="info-card-value">{processChartData.reduce((sum, item) => sum + (parseInt(item.reject) || 0), 0)}</p>
            </div>

            <div className="info-card" style={{ borderColor: '#c7d2fe', backgroundColor: '#f0f4ff' }}>
              <div className="info-card-header">
                <div className="info-card-icon" style={{ backgroundColor: '#e0e7ff' }}>
                  <Clock size={16} strokeWidth={2.5} style={{ color: '#4f46e5' }} />
                </div>
                <p className="info-card-label" style={{ color: '#4f46e5' }}>Hour</p>
              </div>
              <p className="info-card-value" style={{ color: '#4f46e5' }}>
                {getHourName(parseInt(selectedHour))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Card shadow="md" padding="lg" rounded="lg" className="fade-in bg-white">
      
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
              Comparing output across all {hours.length} hours of production
            </p>
          )}
        </div>
      </div>

      <FilterSection />

      <div className="relative min-h-96 mt-8">
        {!chartLoading ? (
          <div className="overflow-x-auto pb-4">
            {viewAllHours ? (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  All Hours View ({hours.length} Total)
                </div>
                <AllHoursChart data={allHoursData} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  {getHourName(parseInt(selectedHour))} Details
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
                  {viewAllHours ? `Loading all ${hours.length} hours data...` : `Loading ${getHourName(parseInt(selectedHour))} data...`}
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