import { TrendingUp, Activity, Zap, BarChart3, HelpCircle } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import { useState } from 'react'

export default function DashboardStats({
  statsData,
  statsLoading,
  processChartData = [],
  allHoursData = {},
  viewAllHours = false
}) {
  const [activeTooltip, setActiveTooltip] = useState(null)

  const getStatsData = () => {
    const totalOutput = statsData?.totalOutput || 0
    const totalTarget = statsData?.totalTarget || 0
    const efficiency = statsData?.efficiency || 0

    let topStation = null

    if (viewAllHours) {
      const cumulativeData = {}
      Object.values(allHoursData).forEach(hourArray => {
        if (!Array.isArray(hourArray)) return
        hourArray.forEach(item => {
          const code = item.operation_code
          if (!cumulativeData[code]) {
            cumulativeData[code] = { ...item, output: 0, target: 0 }
          }
          cumulativeData[code].output += (parseInt(item.output) || 0)
          cumulativeData[code].target += (parseInt(item.target) || 0)
        })
      })
      topStation = Object.values(cumulativeData).sort((a, b) => b.output - a.output)[0]
    } else {
      topStation = [...processChartData].sort((a, b) => b.output - a.output)[0]
    }

    const stats = [
      {
        label: 'Total Output (All-Time)',
        value: totalOutput.toLocaleString(),
        icon: <TrendingUp size={24} className="text-blue-600" />,
        color: 'blue',
        trend: 12,
        title: 'Production Output',
        tooltip: 'Cumulative production output from the start of the project until now.'
      },
      {
        label: 'Total Target (All-Time)',
        value: totalTarget.toLocaleString(),
        icon: <Activity size={24} className="text-green-600" />,
        color: 'green',
        trend: 0,
        title: 'Production Target',
        tooltip: 'Overall production target set from the beginning of the project.'
      },
      {
        label: 'Efficiency Rate',
        value: (
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" strokeWidth="6" stroke="#f1f5f9" fill="transparent" />
                <circle
                  cx="32" cy="32" r="28"
                  strokeWidth="6" stroke="#f97316"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * Math.min(efficiency, 100)) / 100}
                  strokeLinecap="round" fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-800">{efficiency}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-800 leading-none">{efficiency}%</span>
              <span className="text-[10px] text-orange-600 font-bold uppercase mt-1">Efficiency</span>
            </div>
          </div>
        ),
        icon: <Zap size={24} className="text-orange-600" />,
        color: 'orange',
        trend: 5,
        title: 'Performance Metric',
        tooltip: 'Performance ratio (Total Output ÷ Total Target) × 100%.'
      }
    ]

    const displayStation = topStation || { operation_code: '-', output: 0, target: 1, operation_name: '-' }

    stats.push({
      label: 'Top Station',
      value: displayStation.operation_code,
      icon: <BarChart3 size={24} className="text-indigo-600" />,
      color: 'indigo',
      trend: Math.round((displayStation.output / (displayStation.target || 1)) * 100) || 0,
      title: 'Best Performer',
      tooltip: topStation
        ? `Current top performing station is ${displayStation.operation_name} with ${displayStation.output} output.`
        : 'Belum ada data output'
    })

    return stats
  }

  return (
    <div className="space-y-4">
      {statsLoading && (
        <div className="flex justify-start px-2">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsData().map((stat, idx) => (
          <div key={idx} className="relative group transition-all duration-300">
            <StatCard
              {...stat}
              loading={statsLoading}
            />
            {!statsLoading && (
              <button
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-all opacity-0 group-hover:opacity-100"
                onMouseEnter={() => setActiveTooltip(idx)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <HelpCircle size={16} />
              </button>
            )}

            {activeTooltip === idx && (
              <div className="absolute top-12 right-4 z-50 w-48 bg-slate-800 text-white text-[11px] p-3 rounded-xl shadow-xl animate-fadeIn border border-slate-700 pointer-events-none">
                <div className="font-bold mb-1 text-orange-400 uppercase tracking-wider">{stat.title}</div>
                {stat.tooltip}
                <div className="absolute -top-1 right-2 w-2 h-2 bg-slate-800 rotate-45 border-t border-l border-slate-700"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  )
}