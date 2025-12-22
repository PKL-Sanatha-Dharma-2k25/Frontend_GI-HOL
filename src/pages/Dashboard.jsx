// src/pages/Dashboard.jsx
import { TrendingUp, Activity, Zap, Users, BarChart3, LineChart as LineChartIcon, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/context/SidebarContext'
import Card from '@/components/ui/Card'
import StatCard from '@/components/dashboard/StatCard'
import Chart from '@/components/dashboard/Chart'
import BreadCrumb from '@/components/common/BreadCrumb'
import DataTable from '@/components/tables/DataTable'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { sidebarHovered } = useSidebar()

  console.log('📊 [Dashboard] Component mounted')
  console.log('📊 [Dashboard] loading:', loading)
  console.log('📊 [Dashboard] user:', user)
  console.log('📊 [Dashboard] user?.role:', user?.role)
  console.log('📊 [Dashboard] sidebarHovered:', sidebarHovered)

  if (loading) {
    console.log('⏳ [Dashboard] Still loading, returning null')
    return null
  }

  console.log('📊 [Dashboard] User role:', user?.role)
  console.log('✅ [Dashboard] Rendering dashboard for:', user?.role)

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/', active: true },
  ]

  // =========================
  // ROLE LABEL (STRING BASED)
  // =========================
  const getRoleLabel = () => {
    const roleMap = {
      superadmin: 'Superadmin',
      admin: 'Admin',
      supervisor: 'Supervisor',
    }
    const label = roleMap[user?.role] || 'User'
    console.log('📝 [getRoleLabel] Role:', user?.role, '→ Label:', label)
    return label
  }

  // =========================
  // STATS
  // =========================
  const getStatsData = () => {
    const baseStats = [
      { 
        label: 'Total Output', 
        value: '1,250', 
        icon: <TrendingUp size={28} className="text-blue-600" />,
        color: 'blue', 
        trend: 12 
      },
      { 
        label: 'Target Output', 
        value: '1,200', 
        icon: <Activity size={28} className="text-green-600" />,
        color: 'green', 
        trend: 8 
      },
      { 
        label: 'Efficiency Rate', 
        value: '85.5%', 
        icon: <Zap size={28} className="text-orange-600" />,
        color: 'orange', 
        trend: 5 
      },
    ]

    // 🔐 SUPERADMIN ONLY
    if (user?.role === 'superadmin') {
      console.log('📊 [getStatsData] Adding "Total Users" stat for superadmin')
      baseStats.push({
        label: 'Total Users',
        value: '24',
        icon: <Users size={28} className="text-purple-600" />,
        color: 'purple',
        trend: 3
      })
    }

    // 👔 ADMIN & SUPERVISOR - Tambah Line Management stat
    if (user?.role === 'admin' || user?.role === 'supervisor') {
      baseStats.push({
        label: 'Active Lines',
        value: '12',
        icon: <BarChart3 size={28} className="text-indigo-600" />,
        color: 'indigo',
        trend: 2
      })
    }

    console.log('📊 [getStatsData] Returning', baseStats.length, 'stat cards')
    return baseStats
  }

  const stats = getStatsData()

  // =============================
  // TABLE COLUMNS DEFINITION
  // =============================
  const tableColumns = [
    {
      key: 'line',
      label: 'Production Line',
      width: '20%'
    },
    {
      key: 'status',
      label: 'Status',
      width: '20%'
      // Status auto-detect dengan getStatusColor()
    },
    {
      key: 'output',
      label: 'Output',
      width: '25%'
    },
    {
      key: 'efficiency',
      label: 'Efficiency',
      width: '25%',
      render: (value) => (
        <span className="font-semibold text-gray-900">{value}</span>
      )
    }
  ]

  // =============================
  // TABLE DATA - PRODUCTION LINES
  // =============================
  const tableData = [
    { id: 1, line: 'Line A', status: 'Active', output: '320 pcs', efficiency: '89%' },
    { id: 2, line: 'Line B', status: 'Active', output: '315 pcs', efficiency: '87%' },
    { id: 3, line: 'Line C', status: 'Maintenance', output: '0 pcs', efficiency: '0%' },
    { id: 4, line: 'Line D', status: 'Active', output: '325 pcs', efficiency: '91%' },
    { id: 5, line: 'Line E', status: 'Standby', output: '0 pcs', efficiency: '0%' },
  ]

  return (
    <div className="space-y-6 px-responsive py-responsive">
      {/* BREADCRUMB - Dengan animasi slideInDown */}
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Stats Grid - Responsive dengan spacing variables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            // ✅ Animasi fadeIn dengan delay
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

      {/* Charts Grid - Responsive lg breakpoint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OUTPUT TREND CARD */}
        <Card shadow="md" padding="lg" rounded="lg" className="fade-in transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            {/* ✅ Font-display untuk chart title */}
            <h3 className="text-lg font-bold text-gray-900 font-display leading-normal">Output Trend</h3>
            <LineChartIcon size={20} className="text-blue-600" />
          </div>
          <Chart 
            title="" 
            data={[100, 120, 115, 130, 125, 140]} 
            type="line" 
            color="blue" 
          />
          {/* ✅ Small text dengan tracking-normal */}
          <p className="text-xs text-gray-500 mt-4 font-normal tracking-normal leading-tight">
            Last 6 days performance
          </p>
        </Card>

        {/* LINE PERFORMANCE CARD */}
        <Card shadow="md" padding="lg" rounded="lg" className="fade-in transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 font-display leading-normal">Line Performance</h3>
            <BarChart3 size={20} className="text-green-600" />
          </div>
          <Chart 
            title="" 
            data={[88, 82, 79]} 
            type="bar" 
            color="green" 
          />
          <p className="text-xs text-gray-500 mt-4 font-normal tracking-normal leading-tight">
            Performance by line
          </p>
        </Card>
      </div>

      {/* ===================================== */}
      {/* TABLE SECTION - MENGGUNAKAN DataTable */}
      {/* ===================================== */}
      <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 font-display leading-normal">
            Production Lines Status
          </h3>
          <Clock size={20} className="text-blue-600" />
        </div>

        {/* ✅ DataTable Component - Advanced Version */}
        <DataTable 
          columns={tableColumns}
          data={tableData}
          striped={true}
          hover={true}
          bordered={false}
          loading={false}
          emptyMessage="No production lines available"
          searchable={true}
          sortable={true}
          selectable={true}
          pagination={true}
          pageSize={5}
          density="md"
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </Card>
    </div>
  )
}