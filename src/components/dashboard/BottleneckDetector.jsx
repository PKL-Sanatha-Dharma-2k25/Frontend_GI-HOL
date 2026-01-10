import { useState, useMemo } from 'react'
import { 
  AlertTriangle, 
  Zap, 
  Users, 
  Wrench, 
  Clock, 
  Award,
  TrendingDown,
  Target,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  MessageSquare,
  ArrowDown,
  Gauge
} from 'lucide-react'
import Card from '@/components/ui/Card'

export default function BottleneckDetector({ data = [] }) {
  const [expandedCode, setExpandedCode] = useState(null)

  // Analisis data untuk identifikasi bottleneck
  const analysis = useMemo(() => {
    if (!data || data.length === 0) {
      return { bottlenecks: [], average: 0, topPerformers: [], recommendations: [] }
    }

    // Calculate achievement % per operation
    const operations = data.map(item => {
      const achievement = item.target > 0 ? Math.round((item.output / item.target) * 100) : 0
      const gap = item.target - item.output
      return {
        ...item,
        achievement,
        gap,
        severity: gap > 0 ? 'negative' : 'positive'
      }
    })

    // Calculate line average
    const average = Math.round(
      operations.reduce((sum, op) => sum + op.achievement, 0) / operations.length
    )

    // Identify bottlenecks (achievement < line average - 10%)
    const bottlenecks = operations
      .filter(op => op.achievement < average - 10)
      .sort((a, b) => a.achievement - b.achievement)
      .slice(0, 5) // Top 5 bottlenecks

    // Top performers
    const topPerformers = operations
      .filter(op => op.achievement >= 100)
      .sort((a, b) => b.achievement - a.achievement)
      .slice(0, 3)

    // Generate recommendations
    const recommendations = bottlenecks.map(bottleneck => {
      const gapPercentage = ((bottleneck.gap / bottleneck.target) * 100).toFixed(0)
      
      // Severity level
      let severity = 'medium'
      let severity_label = 'Medium Priority'
      let severity_bg = 'bg-amber-50'
      let severity_border = 'border-amber-300'
      let severity_badge = 'bg-amber-100 text-amber-700'
      let severity_icon = AlertTriangle
      let severity_color = 'text-amber-600'
      let severity_bar = 'from-amber-500 to-amber-600'

      if (bottleneck.achievement < 70) {
        severity = 'critical'
        severity_label = 'CRITICAL'
        severity_bg = 'bg-red-50'
        severity_border = 'border-red-300'
        severity_badge = 'bg-red-100 text-red-700'
        severity_icon = AlertTriangle
        severity_color = 'text-red-600'
        severity_bar = 'from-red-500 to-red-600'
      } else if (bottleneck.achievement < 85) {
        severity = 'high'
        severity_label = 'High Priority'
        severity_bg = 'bg-orange-50'
        severity_border = 'border-orange-300'
        severity_badge = 'bg-orange-100 text-orange-700'
        severity_icon = TrendingDown
        severity_color = 'text-orange-600'
        severity_bar = 'from-orange-500 to-orange-600'
      }

      // Smart recommendations based on gap size
      const recommendations_list = []

      if (bottleneck.gap > 30) {
        recommendations_list.push({
          type: 'manpower',
          icon: Users,
          label: 'Tambah Operator',
          detail: `Perlu 1-2 operator tambahan untuk close gap ${bottleneck.gap} pcs`,
          color: 'bg-blue-50 text-blue-600 border-blue-200'
        })
      }

      if (bottleneck.gap > 20 && bottleneck.gap <= 30) {
        recommendations_list.push({
          type: 'efficiency',
          icon: Zap,
          label: 'Optimasi Waktu',
          detail: 'Kurangi idle time & improve cycle efficiency',
          color: 'bg-yellow-50 text-yellow-600 border-yellow-200'
        })
      }

      recommendations_list.push({
        type: 'quality',
        icon: BarChart3,
        label: 'Check Quality',
        detail: 'Verify kalau rework tidak menambah delay',
        color: 'bg-purple-50 text-purple-600 border-purple-200'
      })

      if (bottleneck.gap > 15) {
        recommendations_list.push({
          type: 'maintenance',
          icon: Wrench,
          label: 'Machine Check',
          detail: 'Inspect untuk memastikan tidak ada malfunction',
          color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
        })
      }

      return {
        operation_code: bottleneck.operation_code,
        operation_name: bottleneck.operation_name,
        achievement: bottleneck.achievement,
        gap: bottleneck.gap,
        target: bottleneck.target,
        output: bottleneck.output,
        gapPercentage,
        severity,
        severity_label,
        severity_bg,
        severity_border,
        severity_badge,
        severity_icon,
        severity_color,
        severity_bar,
        recommendations: recommendations_list
      }
    })

    return {
      bottlenecks,
      average,
      topPerformers,
      recommendations,
      totalBottlenecks: bottlenecks.length
    }
  }, [data])

  if (analysis.recommendations.length === 0) {
    return (
      <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-300 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle2 size={28} className="text-emerald-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-1">Semua Operasi On Target</h3>
              <p className="text-sm text-emerald-700">
                Tidak ada bottleneck terdeteksi. Semua operasi berjalan optimal dengan line average {analysis.average}%.
              </p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-300 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle size={24} className="text-red-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-red-900">
                  {analysis.totalBottlenecks} Bottleneck Detected
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/60 rounded-lg p-3 border border-red-200">
                  <div className="text-red-700 opacity-75 text-xs font-medium mb-1">Line Average</div>
                  <div className="text-2xl font-bold text-red-900">{analysis.average}%</div>
                </div>
                {analysis.topPerformers.length > 0 && (
                  <div className="bg-white/60 rounded-lg p-3 border border-red-200">
                    <div className="text-red-700 opacity-75 text-xs font-medium mb-1">Best Performer</div>
                    <div className="font-bold text-red-900">{analysis.topPerformers[0].operation_code}</div>
                    <div className="text-xs text-red-700 mt-0.5">{analysis.topPerformers[0].achievement}%</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 text-center">
              <div className="text-5xl font-bold text-red-600">{analysis.totalBottlenecks}</div>
              <div className="text-xs text-red-700 font-semibold mt-2 uppercase tracking-wide">Operations</div>
            </div>
          </div>
        </div>

        {/* Bottleneck List */}
        <div className="space-y-3">
          {analysis.recommendations.map((rec, idx) => {
            const isExpanded = expandedCode === rec.operation_code
            const SeverityIcon = rec.severity_icon

            return (
              <div
                key={idx}
                className={`${rec.severity_bg} rounded-xl border ${rec.severity_border} transition-all duration-300 overflow-hidden hover:shadow-md`}
              >
                {/* Main Header */}
                <div 
                  className="p-5 cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => setExpandedCode(isExpanded ? null : rec.operation_code)}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 flex items-start gap-4">
                      <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                        rec.severity === 'critical' ? 'bg-red-100' :
                        rec.severity === 'high' ? 'bg-orange-100' :
                        'bg-amber-100'
                      }`}>
                        <SeverityIcon size={20} className={rec.severity_color} strokeWidth={2.5} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Operation Info */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div>
                            <h4 className="text-base font-bold text-gray-900">{rec.operation_code}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{rec.operation_name}</p>
                          </div>
                          <span className={`${rec.severity_badge} px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 whitespace-nowrap`}>
                            {rec.severity_label}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">Target Achievement</span>
                            <span className="text-sm font-bold text-gray-900">{rec.achievement}%</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden shadow-sm">
                            <div
                              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${rec.severity_bar}`}
                              style={{ width: `${Math.min(rec.achievement, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <div className="bg-white/50 rounded-lg p-2.5 text-center border border-gray-200">
                            <div className="text-xs text-gray-600 font-medium">Output</div>
                            <div className="text-lg font-bold text-gray-900 mt-1">{rec.output}</div>
                          </div>
                          <div className="bg-white/50 rounded-lg p-2.5 text-center border border-gray-200">
                            <div className="text-xs text-gray-600 font-medium">Target</div>
                            <div className="text-lg font-bold text-gray-900 mt-1">{rec.target}</div>
                          </div>
                          <div className="bg-white/50 rounded-lg p-2.5 text-center border border-gray-200">
                            <div className="text-xs text-gray-600 font-medium">Gap</div>
                            <div className="text-lg font-bold text-red-600 mt-1">{rec.gap}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex-shrink-0 flex flex-col items-end justify-start pt-1">
                      <div className="text-right mb-4">
                        <div className="text-3xl font-bold text-red-600">{rec.gapPercentage}%</div>
                        <div className="text-xs text-gray-600 font-medium mt-1">Gap</div>
                      </div>
                      <div className="transition-transform duration-300">
                        {isExpanded ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Recommendations */}
                {isExpanded && (
                  <div className="border-t border-gray-300/50 bg-white/40 p-5 space-y-5 animate-slideDown">
                    {/* Recommendations Header */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Zap size={18} className="text-amber-600" strokeWidth={2.5} />
                        <h5 className="font-bold text-gray-900">Action Plan</h5>
                      </div>

                      {/* Recommendations List */}
                      <div className="space-y-3">
                        {rec.recommendations.map((recommendation, rIdx) => {
                          const RecIcon = recommendation.icon
                          return (
                            <div 
                              key={rIdx} 
                              className={`${recommendation.color} rounded-lg border p-4 transition-all hover:shadow-sm`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg flex-shrink-0 bg-white/60">
                                  <RecIcon size={18} strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h6 className="font-semibold text-sm text-gray-900">{recommendation.label}</h6>
                                  <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">{recommendation.detail}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-gray-200 flex gap-2">
                      <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <Clock size={16} strokeWidth={2} />
                        <span>Assign Operator</span>
                      </button>
                      <button className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <MessageSquare size={16} strokeWidth={2} />
                        <span>Notify Team</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Top Performers Section */}
        {analysis.topPerformers.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-300 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Award size={20} className="text-emerald-600" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Top Performers</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {analysis.topPerformers.map((performer, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-lg border border-emerald-200 p-4 hover:shadow-md transition-all"
                >
                  <div className="mb-4">
                    <h5 className="font-bold text-base text-gray-900">{performer.operation_code}</h5>
                    <p className="text-sm text-gray-600 mt-1">{performer.operation_name}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 font-medium">Achievement</span>
                      <span className="text-2xl font-bold text-emerald-600">{performer.achievement}%</span>
                    </div>
                  </div>

                  {/* Achievement Bar */}
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 1000px;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
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
      `}</style>
    </Card>
  )
}