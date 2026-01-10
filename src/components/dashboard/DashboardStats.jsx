
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
      // Hitung total dari semua jam
      Object.values(allHoursData).forEach(data => {
        if (Array.isArray(data)) {
          totalOutput += data.reduce((sum, item) => sum + (parseInt(item.output) || 0), 0)
          totalTarget += data.reduce((sum, item) => sum + (parseInt(item.target) || 0), 0)
        }
      })
    } else {
      // Hitung total dari hour terpilih
      totalOutput = processChartData.reduce((sum, item) => sum + (parseInt(item.output) || 0), 0)
      totalTarget = processChartData.reduce((sum, item) => sum + (parseInt(item.target) || 0), 0)
    }

    const efficiency = totalTarget > 0 ? Math.round((totalOutput / totalTarget) * 100) : 0

    return [
      {
        label: viewAllHours ? 'Total Output (All Hours)' : 'Total Output (Hour ' + selectedHour + ')',
        value: totalOutput.toLocaleString(),
        icon: <TrendingUp size={28} className="text-blue-600" />,
        color: 'blue',
        trend: 12
      },
      {
        label: viewAllHours ? 'Total Target (All Hours)' : 'Total Target (Hour ' + selectedHour + ')',
        value: totalTarget.toLocaleString(),
        icon: <Activity size={28} className="text-green-600" />,
        color: 'green',
        trend: 0
      },
      {
        label: 'Efficiency Rate',
        value: `${efficiency}%`,
        icon: <Zap size={28} className="text-orange-600" />,
        color: 'orange',
        trend: 5
      },
      {
        label: 'Current Line',
        value: user?.username || '-',
        icon: <BarChart3 size={28} className="text-indigo-600" />,
        color: 'indigo',
        trend: 0
      }
    ]
  }

  const stats = getStatsData()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          style={{
            animation: `fadeIn 0.5s ease-out forwards`,
            opacity: 0,
            animationDelay: `${idx * 100}ms`
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
  )
}