import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'

export default function StatCard({ 
  label, 
  value, 
  icon, 
  color = 'blue',
  trend = 0,
  trendUp = true 
}) {
  const colorConfig = {
    blue: {
      bgFrom: 'from-blue-600',
      bgTo: 'to-cyan-500',
      bgLight: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-600',
      gradientOverlay: 'from-blue-600/30 to-cyan-500/30',
      accentColor: 'text-blue-600',
      badgeBg: 'bg-blue-500/15',
      borderColor: 'border-blue-300/40'
    },
    green: {
      bgFrom: 'from-emerald-600',
      bgTo: 'to-teal-500',
      bgLight: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-600',
      gradientOverlay: 'from-emerald-600/30 to-teal-500/30',
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-500/15',
      borderColor: 'border-emerald-300/40'
    },
    orange: {
      bgFrom: 'from-orange-600',
      bgTo: 'to-amber-500',
      bgLight: 'from-orange-50 to-amber-50',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-600',
      gradientOverlay: 'from-orange-600/30 to-amber-500/30',
      accentColor: 'text-orange-600',
      badgeBg: 'bg-orange-500/15',
      borderColor: 'border-orange-300/40'
    },
    indigo: {
      bgFrom: 'from-indigo-600',
      bgTo: 'to-purple-500',
      bgLight: 'from-indigo-50 to-purple-50',
      iconBg: 'bg-indigo-500/20',
      iconColor: 'text-indigo-600',
      gradientOverlay: 'from-indigo-600/30 to-purple-500/30',
      accentColor: 'text-indigo-600',
      badgeBg: 'bg-indigo-500/15',
      borderColor: 'border-indigo-300/40'
    }
  }

  const config = colorConfig[color] || colorConfig.blue

  return (
    <div className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border ${config.borderColor} bg-gradient-to-br ${config.bgLight} p-5 sm:p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]`}>
      
      {/* Animated Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgFrom} ${config.bgTo} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      
      {/* Spotlight Effect */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700 group-hover:scale-150"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-700"></div>

      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1 pr-4">
            <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest letter-spacing group-hover:text-white transition-colors duration-500">{label}</p>
          </div>
          <div className={`flex-shrink-0 p-4 rounded-2xl ${config.iconBg} backdrop-blur-md border border-white/20 group-hover:${config.iconBg} group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
            <div className={`${config.iconColor} group-hover:text-white transition-colors duration-500`}>
              {icon}
            </div>
          </div>
        </div>

        {/* Main Value */}
        <div className="mb-8">
          <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight group-hover:text-white transition-colors duration-500 leading-none">
            {value}
          </p>
        </div>

        {/* Trend Badge */}
        {trend !== 0 && (
          <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full ${config.badgeBg} backdrop-blur-md border border-white/30 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500`}>
            <div className="flex items-center gap-1">
              {trendUp ? (
                <ArrowUpRight size={18} className={`${config.accentColor} group-hover:text-white transition-colors duration-500 font-bold`} />
              ) : (
                <ArrowDownRight size={18} className={`${config.accentColor} group-hover:text-white transition-colors duration-500`} />
              )}
            </div>
            <span className={`text-sm font-bold ${config.accentColor} group-hover:text-white transition-colors duration-500`}>
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-slate-500 group-hover:text-white/70 transition-colors duration-500 ml-1">vs last hour</span>
          </div>
        )}

        {/* Shine Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  )
}