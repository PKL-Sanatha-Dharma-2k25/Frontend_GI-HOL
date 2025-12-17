// src/pages/Dashboard.jsx
import { TrendingUp, Activity, Zap, Users, BarChart3, LineChart as LineChartIcon, AlertCircle } from 'lucide-react'
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

  return (
    <div className="space-y-6">
      <BreadCrumb items={breadcrumbItems} />

      {/* Welcome Card */}
      <Card shadow="md" padding="lg" rounded="lg" className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.username}! 👋
            </h2>
            <p className="text-blue-100">
              You are logged in as:{' '}
              <span className="font-semibold">{getRoleLabel()}</span>
            </p>
          </div>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-white border-opacity-30">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <StatCard 
            key={idx} 
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card shadow="md" padding="lg" rounded="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Output Trend</h3>
            <LineChartIcon size={20} className="text-blue-600" />
          </div>
          <Chart 
            title="" 
            data={[100, 120, 115, 130, 125, 140]} 
            type="line" 
            color="blue" 
          />
        </Card>

        <Card shadow="md" padding="lg" rounded="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Line Performance</h3>
            <BarChart3 size={20} className="text-green-600" />
          </div>
          <Chart 
            title="" 
            data={[88, 82, 79]} 
            type="bar" 
            color="green" 
          />
        </Card>
      </div>

      {/* Role-Specific Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SUPERADMIN Card */}
        {user?.role === 'superadmin' && (
          <Card shadow="md" padding="lg" rounded="lg" className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-200 rounded-lg">
                <Users size={24} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-purple-900 mb-2">Superadmin Access</h3>
                <p className="text-purple-700 text-sm leading-relaxed">
                  Anda memiliki akses penuh ke sistem termasuk User Management, konfigurasi sistem, dan laporan lengkap.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* ADMIN Card */}
        {user?.role === 'admin' && (
          <Card shadow="md" padding="lg" rounded="lg" className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-200 rounded-lg">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Admin Access</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Anda dapat mengelola line, style master, dan memantau line balancing di semua lini produksi.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* SUPERVISOR Card */}
        {user?.role === 'supervisor' && (
          <Card shadow="md" padding="lg" rounded="lg" className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-200 rounded-lg">
                <Activity size={24} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-900 mb-2">Supervisor Access</h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  Anda dapat memantau dan mengelola output dari line yang Anda supervisi serta membuat header output per jam.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Stats Card */}
        <Card shadow="md" padding="lg" rounded="lg" className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-200 rounded-lg">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm text-yellow-700">
                <p>• Total Output: <span className="font-bold">1,250 pcs</span></p>
                <p>• Target Output: <span className="font-bold">1,200 pcs</span></p>
                <p>• Achievement: <span className="font-bold">104.2%</span></p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts/Notices */}
      <Card shadow="md" padding="lg" rounded="lg" className="border-l-4 border-yellow-400 bg-yellow-50">
        <div className="flex items-start gap-4">
          <AlertCircle size={24} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-1">⚠️ Notice</h3>
            <p className="text-yellow-700 text-sm">
              Sistem sedang dalam tahap pengembangan. Beberapa fitur mungkin masih dalam proses atau belum tersedia sepenuhnya.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}