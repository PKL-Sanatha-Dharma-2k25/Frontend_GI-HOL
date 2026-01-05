// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { TrendingUp, Activity, Zap, Users, BarChart3, LineChart as LineChartIcon, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/context/SidebarContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import Card from '@/components/ui/Card'
import StatCard from '@/components/dashboard/StatCard'
import BreadCrumb from '@/components/common/BreadCrumb'
import DataTable from '@/components/tables/DataTable'

// ⭐ Mock API - Replace dengan real API call
const getDashboardData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: 200,
        data: {
          totalOutput: 4250,
          targetDaily: 5000,
          efficiency: 85,
          activeLines: 4,
          processChart: [
            {
              process: '1A',
              actual: 145,
              target: 143,
              processName: 'JOIN BOTTOM CENTER'
            },
            {
              process: '1B',
              actual: 148,
              target: 150,
              processName: 'TOP STITCH BOTTOM'
            },
            {
              process: '1C',
              actual: 120,
              target: 125,
              processName: 'JOIN TOP CENTER'
            },
            {
              process: '2A',
              actual: 118,
              target: 120,
              processName: 'JOIN BACK LINING'
            },
            {
              process: '2B',
              actual: 122,
              target: 125,
              processName: 'ATTACH DN TAPE'
            },
            {
              process: '2C',
              actual: 155,
              target: 158,
              processName: 'INSERT BOND'
            }
          ],
          trendChart: [
            { hour: '1', output: 450, target: 500 },
            { hour: '2', output: 480, target: 500 },
            { hour: '3', output: 420, target: 500 },
            { hour: '4', output: 500, target: 500 },
            { hour: '5', output: 490, target: 500 },
            { hour: '6', output: 510, target: 500 },
            { hour: '7', output: 400, target: 500 }
          ]
        }
      })
    }, 1000)
  })
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { sidebarHovered } = useSidebar()
  const [dashboardData, setDashboardData] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  // =========================
  // COLOR SCHEME - CONSISTENT
  // =========================
  const colors = {
    actual: '#d946ef',      // MAGENTA - Actual Output
    target: '#f59e0b',      // AMBER - Target
    trend: '#3b82f6',       // BLUE - Trend line
    success: '#10b981',     // GREEN - Success
    warning: '#f59e0b',     // AMBER - Warning
    danger: '#ef4444'       // RED - Danger
  }

  // ⭐ Fetch dashboard data saat component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('📊 [Dashboard] Fetching dashboard data...')
        const response = await getDashboardData()
        setDashboardData(response.data)
        console.log('✅ [Dashboard] Data fetched:', response.data)
      } catch (error) {
        console.error('❌ [Dashboard] Error fetching data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()

    // ⭐ Refresh setiap 5 menit
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  // ⭐ Loading State
  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/', active: true },
  ]

  // =========================
  // STATS CARDS
  // =========================
  const getStatsData = () => {
    const baseStats = [
      {
        label: 'Today\'s Output',
        value: dashboardData.totalOutput.toLocaleString(),
        icon: <TrendingUp size={28} className="text-blue-600" />,
        color: 'blue',
        trend: 12
      },
      {
        label: 'Daily Target',
        value: dashboardData.targetDaily.toLocaleString(),
        icon: <Activity size={28} className="text-green-600" />,
        color: 'green',
        trend: 0
      },
      {
        label: 'Efficiency Rate',
        value: `${dashboardData.efficiency}%`,
        icon: <Zap size={28} className="text-orange-600" />,
        color: 'orange',
        trend: 5
      },
      {
        label: 'Active Lines',
        value: dashboardData.activeLines.toString(),
        icon: <BarChart3 size={28} className="text-indigo-600" />,
        color: 'indigo',
        trend: 2
      }
    ]

    return baseStats
  }

  const stats = getStatsData()

  // =============================
  // TABLE COLUMNS
  // =============================
  const processColumns = [
    {
      key: 'process',
      label: 'Process',
      width: '12%',
      render: (value) => <span className="font-bold text-blue-600">{value}</span>
    },
    {
      key: 'processName',
      label: 'Operation Name',
      width: '45%'
    },
    {
      key: 'target',
      label: 'Target',
      width: '13%',
      render: (value) => <span className="font-semibold">{value}</span>
    },
    {
      key: 'actual',
      label: 'Actual Output',
      width: '13%',
      render: (value) => <span className="font-semibold text-blue-600">{value}</span>
    },
    {
      key: 'actual',
      label: 'Achievement',
      width: '17%',
      render: (value, row) => {
        const percentage = Math.round((value / row.target) * 100)
        const status = percentage >= 100 ? 'bg-green-100 text-green-800' : 
                       percentage >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                       'bg-red-100 text-red-800'
        return (
          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${status}`}>
            {percentage}%
          </span>
        )
      }
    }
  ]

  // =============================
  // RENDER
  // =============================
  return (
    <div className="space-y-6 px-responsive py-responsive">
      {/* BREADCRUMB */}
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Stats Grid */}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Trend Chart */}
        <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 font-display">Hourly Production Trend</h3>
              <p className="text-xs text-gray-500 mt-1">Real-time production vs target</p>
            </div>
            <LineChartIcon size={20} className="text-blue-600" />
          </div>
          <div className="bg-gradient-to-br from-blue-50/50 to-white p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={dashboardData.trendChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.trend} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.trend} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '15px' }} iconType="line" />
                <Line 
                  type="natural" 
                  dataKey="output" 
                  stroke={colors.trend}
                  name="Actual Output"
                  strokeWidth={3}
                  dot={{ fill: colors.trend, r: 4 }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorOutput)"
                />
                <Line 
                  type="natural" 
                  dataKey="target" 
                  stroke={colors.target}
                  name="Target"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: colors.target, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Process Performance Chart */}
        <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 font-display">Process Performance</h3>
              <p className="text-xs text-gray-500 mt-1">Actual vs Target per operation</p>
            </div>
            <BarChart3 size={20} className="text-green-600" />
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart 
                data={dashboardData.processChart} 
                layout="vertical" 
                margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <YAxis 
                  type="category" 
                  dataKey="process" 
                  tick={{ fontSize: 13, fill: '#1f2937', fontWeight: 600 }}
                  stroke="#e5e7eb"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [value, '']}
                  labelFormatter={(label) => `Process ${label}`}
                />
                <Legend wrapperStyle={{ paddingTop: '15px' }} iconType="square" />
                <Bar 
                  dataKey="actual" 
                  fill={colors.actual}
                  name="Actual Output"
                  stackId="stack"
                  radius={[0, 6, 6, 0]}
                  barSize={35}
                />
                <Bar 
                  dataKey="target" 
                  fill={colors.target}
                  name="Target"
                  stackId="stack"
                  radius={[0, 6, 6, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Process Details Table */}
      <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-display">Process Details</h3>
            <p className="text-xs text-gray-500 mt-1">Achievement percentage for each operation</p>
          </div>
          <Clock size={20} className="text-blue-600" />
        </div>

        <DataTable
          columns={processColumns}
          data={dashboardData.processChart.map(item => ({
            ...item,
            achievement: Math.round((item.actual / item.target) * 100)
          }))}
          striped={true}
          hover={true}
          loading={false}
          emptyMessage="No process data available"
          sortable={true}
          searchable={true}
        />
      </Card>
    </div>
  )
}