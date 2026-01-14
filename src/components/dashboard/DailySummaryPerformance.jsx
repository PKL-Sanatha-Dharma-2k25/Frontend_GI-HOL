import { Activity, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import Card from '@/components/ui/Card'

function DailySummaryPerformance({
  processChartData,
  allHoursData,
  viewAllHours,
  chartLoading
}) {
  const [hoveredOperation, setHoveredOperation] = useState(null)



  const getOperationSummary = () => {
    const operationSummary = {}

    if (viewAllHours && allHoursData) {
      // Dari semua jam
      let dataArray = []
      if (Array.isArray(allHoursData)) {
        dataArray = allHoursData
      } else if (typeof allHoursData === 'object') {
        dataArray = Object.values(allHoursData).flat()
      }

      dataArray.forEach(item => {
        if (!item) return
        const opCode = item.operation_code || 'Unknown'
        
        if (!operationSummary[opCode]) {
          operationSummary[opCode] = {
            operation_code: opCode,
            operation_name: item.operation_name || opCode,
            totalOutput: 0,
            totalTarget: 0
          }
        }
        operationSummary[opCode].totalOutput += parseFloat(item.output) || 0
        operationSummary[opCode].totalTarget += parseFloat(item.target) || 0
      })
    } else {
      // Dari jam selected
      if (Array.isArray(processChartData) && processChartData.length > 0) {
        processChartData.forEach(item => {
          if (!item) return
          const opCode = item.operation_code || 'Unknown'
          
          if (!operationSummary[opCode]) {
            operationSummary[opCode] = {
              operation_code: opCode,
              operation_name: item.operation_name || opCode,
              totalOutput: 0,
              totalTarget: 0
            }
          }
          operationSummary[opCode].totalOutput += parseFloat(item.output) || 0
          operationSummary[opCode].totalTarget += parseFloat(item.target) || 0
        })
      }
    }

    // Return real data jika ada, jika kosong return array kosong (no mock)
    const realData = Object.values(operationSummary).sort((a, b) => b.totalOutput - a.totalOutput)
    return realData.length > 0 ? realData : []
  }

  const summaryData = getOperationSummary()

  const renderChart = () => {
    if (summaryData.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Activity size={32} className="mx-auto mb-2 opacity-50" />
          <p>No operation data available</p>
          <p className="text-sm text-gray-400 mt-2">
            {viewAllHours ? 'Waiting for all hours data...' : 'Waiting for selected hour data...'}
          </p>
        </div>
      )
    }

    // Cari max untuk scaling
    const maxTarget = Math.max(...summaryData.map(op => op.totalTarget || 0), 1)

    return (
      <div className="space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            <span className="text-gray-700 font-medium">Output</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-red-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Target Line</span>
          </div>
        </div>

        {/* Bars */}
        <div className="space-y-5">
          {summaryData.map((operation, idx) => {
            const output = operation.totalOutput
            const target = operation.totalTarget
            const percentage = target > 0 ? ((output / target) * 100) : 0
            const isAboveTarget = percentage >= 100
            const isBelowTarget = percentage < 80

            // Width calculation
            const barWidth = (output / maxTarget) * 100
            const targetWidth = (target / maxTarget) * 100

            return (
              <div
                key={idx}
                className="group"
                onMouseEnter={() => setHoveredOperation(idx)}
                onMouseLeave={() => setHoveredOperation(null)}
              >
                {/* Tooltip */}
                {hoveredOperation === idx && (
                  <div className="fixed z-50 pointer-events-none mb-2">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-2xl p-4 w-80 border border-slate-700">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
                        <div className="px-2.5 py-1 bg-blue-500 rounded text-sm font-bold">
                          {operation.operation_code}
                        </div>
                        <span className="text-sm text-slate-300">
                          {operation.operation_name}
                        </span>
                        {isAboveTarget && (
                          <CheckCircle size={16} className="text-emerald-400 ml-auto" strokeWidth={2.5} />
                        )}
                        {isBelowTarget && (
                          <TrendingDown size={16} className="text-red-400 ml-auto" strokeWidth={2.5} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">Total Output</span>
                          <span className="text-blue-300 font-bold text-lg">
                            {Math.round(output).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">Total Target</span>
                          <span className="text-slate-300 font-bold text-lg">
                            {Math.round(target).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                          <span className="text-slate-300 text-sm">Variance</span>
                          <div className="text-right">
                            <div className={`font-bold text-lg ${
                              isAboveTarget ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {isAboveTarget ? '+' : ''}{Math.round(output - target).toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">
                              {isAboveTarget ? '+' : ''}{percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-700">
                          <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${
                            percentage >= 100 ? 'bg-emerald-500/20 text-emerald-300' :
                            percentage >= 80 ? 'bg-blue-500/20 text-blue-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {percentage >= 100 ? '✓ Exceeding' :
                             percentage >= 80 ? '→ On Track' :
                             '⚠ Below Target'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Label */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded flex-shrink-0">
                      {operation.operation_code}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 truncate">
                      {operation.operation_name}
                    </span>
                  </div>
                  <span className={`text-sm font-bold flex-shrink-0 ml-2 ${
                    percentage >= 100 ? 'text-emerald-600' :
                    percentage >= 80 ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>

                {/* Bar Container */}
                <div
                  className="relative h-8 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: hoveredOperation === idx ? '#10b981' : '#e2e8f0',
                    boxShadow: hoveredOperation === idx ? '0 8px 16px rgba(16, 185, 129, 0.15)' : 'none'
                  }}
                >
                  {/* Output Bar */}
                  {output > 0 && (
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 flex items-center justify-end pr-3"
                      style={{
                        width: `${Math.min(barWidth, 100)}%`,
                        minWidth: barWidth > 8 ? 'auto' : '0'
                      }}
                    >
                      {barWidth > 15 && (
                        <span className="text-xs font-bold text-white drop-shadow-lg">
                          {Math.round(output)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Target Line */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-red-500 transition-all duration-300"
                    style={{ left: `${targetWidth}%` }}
                    title={`Target: ${Math.round(target)}`}
                  />

                  {/* Remaining text */}
                  {output < target && barWidth > 25 && (
                    <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-slate-700 pointer-events-none">
                      {Math.round(target - output)} remaining
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card shadow="md" padding="lg" rounded="lg" className="fade-in bg-white">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <Activity size={22} className="text-purple-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Daily Operation Performance</h3>
          </div>
          <p className="text-sm text-slate-600 ml-11 mt-1">
            {viewAllHours ? 'Operation productivity across all 10 hours' : 'Operation productivity for selected hour'}
          </p>
        </div>
      </div>

      {!chartLoading ? (
        <div className="overflow-x-auto pb-4">
          {renderChart()}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-sm text-slate-600 font-semibold">Loading operation data...</p>
          </div>
        </div>
      )}

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
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Card>
  )
}

export default DailySummaryPerformance