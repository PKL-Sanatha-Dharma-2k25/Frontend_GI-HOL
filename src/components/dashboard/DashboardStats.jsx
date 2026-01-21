import { TrendingUp, Activity, Zap, BarChart3, HelpCircle } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import { useState } from 'react'

export default function DashboardStats({ 
  statsData,
  statsLoading,
  processChartData, 
  allHoursData, 
  viewAllHours, 
  selectedHour,
  user 
}) {
  const [activeTooltip, setActiveTooltip] = useState(null)

  const getStatsData = () => {
    const totalOutput = statsData?.totalOutput || 0
    const totalTarget = statsData?.totalTarget || 0
    const efficiency = statsData?.efficiency || 0

    return [
      {
        label: 'Total Output (All-Time)',
        value: totalOutput.toLocaleString(),
        icon: <TrendingUp size={24} className="text-blue-600" />,
        color: 'blue',
        trend: 12,
        title: 'Production Output',
        tooltip: 'Cumulative production output from the start of the project until now. This includes all units produced across all shifts and time periods.'
      },
      {
        label: 'Total Target (All-Time)',
        value: totalTarget.toLocaleString(),
        icon: <Activity size={24} className="text-green-600" />,
        color: 'green',
        trend: 0,
        title: 'Production Target',
        tooltip: 'Overall production target set from the beginning of the project. This represents the planned goal for total units to be manufactured.'
      },
      {
        label: 'Efficiency Rate',
        value: `${efficiency}%`,
        icon: <Zap size={24} className="text-orange-600" />,
        color: 'orange',
        trend: 5,
        title: 'Performance Metric',
        tooltip: 'Performance ratio calculated as (Total Output ÷ Total Target) × 100%. Higher percentage indicates better production efficiency and target achievement.'
      },
      {
        label: 'Current Line',
        value: user?.username || '-',
        icon: <BarChart3 size={24} className="text-indigo-600" />,
        color: 'indigo',
        trend: 0,
        title: 'Active Operator',
        tooltip: 'Name of the production line or operator currently logged in. This identifies which line or supervisor is viewing the dashboard.'
      }
    ]
  }

  const stats = getStatsData()

  return (
    <>
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

        .stats-container {
          display: grid;
          grid-auto-rows: 1fr;
          gap: clamp(0.75rem, 2vw, 1.5rem);
          width: 100%;
        }

        @media (max-width: 640px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1025px) {
          .stats-container {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
        }

        .stat-card-wrapper {
          animation: fadeIn 0.5s ease-out forwards;
          min-width: 0;
          overflow: visible;
        }

        .stat-card-wrapper.loading {
          opacity: 0.6;
          pointer-events: none;
        }

        .stat-card-wrapper :global(.stat-label) {
          font-size: clamp(0.625rem, 1.5vw, 0.85rem);
          letter-spacing: 0.3px;
          font-weight: 500;
          line-height: 1.2;
        }

        .stat-card-wrapper :global(.stat-value) {
          font-size: clamp(1.25rem, 4vw, 2.5rem);
          font-weight: 700;
          line-height: 1.1;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .stat-card-wrapper :global(.stat-trend) {
          font-size: clamp(0.625rem, 1.2vw, 0.75rem);
        }

        .stat-card-wrapper :global(.stat-card) {
          overflow: visible;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: clamp(1rem, 2vw, 1.5rem);
        }

        .stat-card-wrapper :global(.stat-card) p {
          margin: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .stat-card-wrapper :global(.stat-card) .label {
          font-size: clamp(0.625rem, 1.3vw, 0.8rem);
          color: #64748b;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
          line-height: 1.3;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          position: relative;
        }

        .stat-card-wrapper :global(.stat-card) .value {
          font-size: clamp(1.5rem, 5vw, 2.8rem);
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
          margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
        }

        .stat-card-wrapper :global(.stat-card) .trend {
          font-size: clamp(0.6rem, 1vw, 0.75rem);
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .help-icon-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: help;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          line-height: 1;
        }

        .help-icon-btn:hover svg {
          color: #0ea5e9;
          stroke-width: 2.5;
        }

        .help-icon-btn svg {
          width: 18px;
          height: 18px;
          color: #94a3b8;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .tooltip-bubble {
          position: fixed;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #f1f5f9;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          max-width: 280px;
          z-index: 9999;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(148, 163, 184, 0.3) inset;
          border: 1px solid rgba(148, 163, 184, 0.2);
          pointer-events: none;
          word-wrap: break-word;
          white-space: normal;
          line-height: 1.6;
          animation: tooltipShow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
          background-clip: padding-box;
        }

        .tooltip-bubble::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-right: 1px solid rgba(148, 163, 184, 0.2);
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 0 2px 0 0;
          transform: translateX(-50%) rotate(45deg);
        }

        .tooltip-title {
          font-weight: 600;
          color: #0ea5e9;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tooltip-content {
          color: #cbd5e1;
          font-weight: 400;
          line-height: 1.6;
        }

        .tooltip-icon {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #0ea5e9;
          border-radius: 50%;
          margin-right: 0.5rem;
          vertical-align: middle;
        }

        @keyframes tooltipShow {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      {/* Tooltip Portal */}
      {activeTooltip && (
        <div
          className="tooltip-bubble"
          style={{
            left: `${activeTooltip.x}px`,
            top: `${activeTooltip.y}px`,
            transform: 'translate(-50%, calc(-100% - 16px))'
          }}
        >
          <div className="tooltip-title">
            {activeTooltip.title}
          </div>
          <div className="tooltip-content">
            <span className="tooltip-icon"></span>
            {activeTooltip.text}
          </div>
        </div>
      )}

      <div className="stats-container">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`stat-card-wrapper ${statsLoading ? 'loading' : ''}`}
            style={{
              opacity: 0,
              animationDelay: `${idx * 100}ms`,
              animation: `fadeIn 0.5s ease-out forwards`
            }}
          >
            <StatCard
              label={stat.label}
              value={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{statsLoading ? '...' : stat.value}</span>
                  <button
                    className="help-icon-btn"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setActiveTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        title: stat.title,
                        text: stat.tooltip
                      })
                    }}
                    onMouseLeave={() => setActiveTooltip(null)}
                    type="button"
                  >
                    <HelpCircle size={18} />
                  </button>
                </div>
              }
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          </div>
        ))}
      </div>
    </>
  )
}