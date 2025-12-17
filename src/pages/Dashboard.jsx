// src/pages/Dashboard.jsx
import { TrendingUp, Activity, Zap, Users, BarChart3, LineChart as LineChartIcon, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/context/SidebarContext'
import Card from '@/components/ui/Card'
import StatCard from '@/components/dashboard/StatCard'
import Chart from '@/components/dashboard/Chart'
import BreadCrumb from '@/components/common/BreadCrumb'

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
  // TABLE DATA - DENGAN STATUS
  // =============================
  const tableData = [
    { id: 1, line: 'Line A', status: 'Active', output: '320 pcs', efficiency: '89%' },
    { id: 2, line: 'Line B', status: 'Active', output: '315 pcs', efficiency: '87%' },
    { id: 3, line: 'Line C', status: 'Maintenance', output: '0 pcs', efficiency: '0%' },
    { id: 4, line: 'Line D', status: 'Active', output: '325 pcs', efficiency: '91%' },
    { id: 5, line: 'Line E', status: 'Standby', output: '0 pcs', efficiency: '0%' },
  ]

  // =============================
  // ACTIVITY DATA
  // =============================
  const activityData = [
    { id: 1, action: 'Production Started', time: '08:00 AM', status: 'success' },
    { id: 2, action: 'Line A Efficiency Alert', time: '09:15 AM', status: 'warning' },
    { id: 3, action: 'Output Target Reached 50%', time: '11:30 AM', status: 'info' },
    { id: 4, action: 'Lunch Break', time: '12:00 PM', status: 'neutral' },
  ]

  // =============================
  // GET BADGE STATUS
  // =============================
  const getBadgeClass = (status) => {
    const statusMap = {
      'Active': 'badge badge-success',
      'Maintenance': 'badge badge-danger',
      'Standby': 'badge badge-warning',
      'success': 'badge badge-success',
      'warning': 'badge badge-warning',
      'info': 'badge badge-info',
      'neutral': 'badge badge-primary',
    }
    return statusMap[status] || 'badge badge-primary'
  }

  return (
    <div className="space-y-6 px-responsive py-responsive">
      {/* BREADCRUMB - Dengan animasi slideInDown */}
      <div className="slide-in-down">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Welcome Card - Font Display, Animasi, Typography Lengkap */}
      <Card 
        shadow="lg" 
        padding="lg" 
        rounded="lg" 
        className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white slide-in-up transition-shadow duration-300"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            {/* ✅ Font-display, leading-tight, tracking-tight */}
            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-display leading-tight tracking-tight">
              Welcome back, {user?.username}! 👋
            </h2>
            {/* ✅ Font-sans, line-height relaxed, tracking normal */}
            <p className="text-blue-100 text-base font-normal leading-relaxed tracking-normal">
              You are logged in as:{' '}
              <span className="font-semibold text-white">{getRoleLabel()}</span>
            </p>
          </div>
          {/* ✅ Animasi pulse-animate */}
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-extrabold text-white border-2 border-white border-opacity-30 flex-shrink-0 pulse-animate">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </Card>

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
      {/* TABLE SECTION - NEW */}
      {/* ===================================== */}
      <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 font-display leading-normal">
            Production Lines Status
          </h3>
          <Clock size={20} className="text-blue-600" />
        </div>

        {/* ✅ TABLE dengan styling lengkap */}
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Line</th>
                <th>Status</th>
                <th>Output</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="font-medium text-gray-900">{row.line}</td>
                  <td>
                    {/* ✅ Badge Status dengan class yang sesuai */}
                    <span className={getBadgeClass(row.status)}>
                      {row.status}
                    </span>
                  </td>
                  <td className="text-gray-700">{row.output}</td>
                  <td className="font-semibold text-gray-900">{row.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ===================================== */}
      {/* ACTIVITY TIMELINE - NEW */}
      {/* ===================================== */}
      <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
        <h3 className="text-lg font-bold text-gray-900 mb-6 font-display leading-normal">
          Activity Timeline
        </h3>

        <div className="space-y-4">
          {activityData.map((activity, idx) => (
            <div 
              key={activity.id}
              style={{
                animation: `slideInLeft 0.5s ease-out forwards`,
                opacity: 0,
                animationDelay: `${idx * 150}ms`
              }}
              className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0"
            >
              {/* ✅ Icon dengan styling */}
              <div className="flex-shrink-0 mt-1">
                {activity.status === 'success' && (
                  <CheckCircle2 size={20} className="text-green-600" />
                )}
                {activity.status === 'warning' && (
                  <AlertCircle size={20} className="text-yellow-600" />
                )}
                {activity.status === 'info' && (
                  <Clock size={20} className="text-blue-600" />
                )}
                {activity.status === 'neutral' && (
                  <Activity size={20} className="text-gray-600" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 leading-normal">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 font-normal tracking-normal">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Role-Specific Info Cards - Dengan animasi dan spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SUPERADMIN Card - Animasi slideInDown */}
        {user?.role === 'superadmin' && (
          <Card 
            shadow="md" 
            padding="lg" 
            rounded="lg" 
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 slide-in-down transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-200 rounded-lg flex-shrink-0">
                <Users size={24} className="text-purple-600" />
              </div>
              <div className="flex-1">
                {/* ✅ Font-display untuk title */}
                <h3 className="text-lg font-bold text-purple-900 mb-2 font-display leading-normal">
                  Superadmin Access
                </h3>
                {/* ✅ Font-sans dengan line-height relaxed */}
                <p className="text-purple-700 text-sm leading-relaxed font-normal tracking-normal">
                  Anda memiliki akses penuh ke sistem termasuk User Management, konfigurasi sistem, dan laporan lengkap.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* ADMIN Card - Animasi slideInDown */}
        {user?.role === 'admin' && (
          <Card 
            shadow="md" 
            padding="lg" 
            rounded="lg" 
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 slide-in-down transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-200 rounded-lg flex-shrink-0">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2 font-display leading-normal">
                  Admin Access
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed font-normal tracking-normal">
                  Anda dapat mengelola line, style master, dan memantau line balancing di semua lini produksi.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* SUPERVISOR Card - Animasi slideInDown */}
        {user?.role === 'supervisor' && (
          <Card 
            shadow="md" 
            padding="lg" 
            rounded="lg" 
            className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 slide-in-down transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-200 rounded-lg flex-shrink-0">
                <Activity size={24} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-900 mb-2 font-display leading-normal">
                  Supervisor Access
                </h3>
                <p className="text-green-700 text-sm leading-relaxed font-normal tracking-normal">
                  Anda dapat memantau dan mengelola output dari line yang Anda supervisi serta membuat header output per jam.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Stats Card - Animasi slideInUp */}
        <Card 
          shadow="md" 
          padding="lg" 
          rounded="lg" 
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 slide-in-up transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-200 rounded-lg flex-shrink-0">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              {/* ✅ Font-display untuk title */}
              <h3 className="text-lg font-bold text-yellow-900 mb-3 font-display leading-normal">
                Quick Stats
              </h3>
              {/* ✅ Font-sans dengan line-height relaxed */}
              <div className="space-y-2 text-sm text-yellow-700 leading-relaxed">
                <p className="font-normal">
                  • Total Output: <span className="font-bold text-yellow-900">1,250 pcs</span>
                </p>
                <p className="font-normal">
                  • Target Output: <span className="font-bold text-yellow-900">1,200 pcs</span>
                </p>
                <p className="font-normal">
                  • Achievement: <span className="font-bold text-yellow-900">104.2%</span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ===================================== */}
      {/* DIVIDER - NEW */}
      {/* ===================================== */}
      <div className="divider"></div>

      {/* Alerts/Notices - Animasi fadeIn + pulse pada icon */}
      <Card 
        shadow="md" 
        padding="lg" 
        rounded="lg" 
        className="border-l-4 border-yellow-400 bg-yellow-50 fade-in transition-all duration-300"
      >
        <div className="flex items-start gap-4">
          {/* ✅ Animasi pulse-animate pada icon */}
          <AlertCircle 
            size={24} 
            className="text-yellow-600 flex-shrink-0 mt-0.5 pulse-animate" 
          />
          <div>
            {/* ✅ Font-display untuk notice title */}
            <h3 className="font-bold text-yellow-900 mb-1 font-display leading-normal">
              ⚠️ Notice
            </h3>
            {/* ✅ Font-sans dengan line-height relaxed */}
            <p className="text-yellow-700 text-sm leading-relaxed font-normal tracking-normal">
              Sistem sedang dalam tahap pengembangan. Beberapa fitur mungkin masih dalam proses atau belum tersedia sepenuhnya.
            </p>
          </div>
        </div>
      </Card>

    </div>
  )
}