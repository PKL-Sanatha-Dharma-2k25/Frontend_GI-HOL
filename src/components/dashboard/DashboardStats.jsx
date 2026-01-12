import { TrendingUp, Activity, Zap, BarChart3 } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'

export default function DashboardStats({ 
  processChartData, 
  allHoursData, 
  viewAllHours, 
  selectedHour,
  user 
}) {
  const getStatsData = () => {
    let totalOutput = 0
    let totalTarget = 0

    if (viewAllHours) {
      Object.values(allHoursData).forEach(data => {
        if (Array.isArray(data)) {
          totalOutput += data.reduce((sum, item) => sum + (parseInt(item.output) || 0), 0)
          totalTarget += data.reduce((sum, item) => sum + (parseInt(item.target) || 0), 0)
        }
      })
    } else {
      totalOutput = processChartData.reduce((sum, item) => sum + (parseInt(item.output) || 0), 0)
      totalTarget = processChartData.reduce((sum, item) => sum + (parseInt(item.target) || 0), 0)
    }

    const efficiency = totalTarget > 0 ? Math.round((totalOutput / totalTarget) * 100) : 0

    return [
      {
        label: viewAllHours ? 'Total Output (All Hours)' : 'Total Output (Hour ' + selectedHour + ')',
        value: totalOutput.toLocaleString(),
        icon: <TrendingUp size={24} className="text-blue-600" />,
        color: 'blue',
        trend: 12
      },
      {
        label: viewAllHours ? 'Total Target (All Hours)' : 'Total Target (Hour ' + selectedHour + ')',
        value: totalTarget.toLocaleString(),
        icon: <Activity size={24} className="text-green-600" />,
        color: 'green',
        trend: 0
      },
      {
        label: 'Efficiency Rate',
        value: `${efficiency}%`,
        icon: <Zap size={24} className="text-orange-600" />,
        color: 'orange',
        trend: 5
      },
      {
        label: 'Current Line',
        value: user?.username || '-',
        icon: <BarChart3 size={24} className="text-indigo-600" />,
        color: 'indigo',
        trend: 0
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

        /* Mobile - 1 column */
        @media (max-width: 640px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
        }

        /* Tablet - 2 columns */
        @media (min-width: 641px) and (max-width: 1024px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Desktop - 4 columns, dengan fallback ke 2 jika terlalu zoom */
        @media (min-width: 1025px) {
          .stats-container {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
        }

        .stat-card-wrapper {
          animation: fadeIn 0.5s ease-out forwards;
          min-width: 0;
          overflow: hidden;
        }

        /* Responsive typography dengan clamp */
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

        /* Prevent text overflow di card */
        .stat-card-wrapper :global(.stat-card) {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: clamp(1rem, 2vw, 1.5rem);
        }

        /* Typography styling untuk konten dalam card */
        .stat-card-wrapper :global(.stat-card) p {
          margin: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        /* Label text */
        .stat-card-wrapper :global(.stat-card) .label {
          font-size: clamp(0.625rem, 1.3vw, 0.8rem);
          color: #64748b;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
          line-height: 1.3;
          text-transform: uppercase;
        }

        /* Value text */
        .stat-card-wrapper :global(.stat-card) .value {
          font-size: clamp(1.5rem, 5vw, 2.8rem);
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
          margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
        }

        /* Trend/subtext */
        .stat-card-wrapper :global(.stat-card) .trend {
          font-size: clamp(0.6rem, 1vw, 0.75rem);
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>

      <div className="stats-container">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="stat-card-wrapper"
            style={{
              opacity: 0,
              animationDelay: `${idx * 100}ms`,
              animation: `fadeIn 0.5s ease-out forwards`
            }}
          >
            <StatCard
              label={stat.label}
              value={stat.value}
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