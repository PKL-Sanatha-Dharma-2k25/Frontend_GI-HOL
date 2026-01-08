// ============================================
// /components/dashboard/DailySummaryPerformance.jsx
// ============================================
import { Activity, RefreshCw } from 'lucide-react'
import Card from '@/components/ui/Card'

function DailySummaryPerformance({
  processChartData,
  allHoursData,
  viewAllHours,
  chartLoading
}) {
  const renderChart = () => {
    const operationSummary = {}

    if (viewAllHours) {
      Object.values(allHoursData).forEach(hourData => {
        if (Array.isArray(hourData)) {
          hourData.forEach(item => {
            const operationCode = item.operation_code || 'Unknown'
            if (!operationSummary[operationCode]) {
              operationSummary[operationCode] = {
                code: operationCode,
                name: item.operation_name || operationCode,
                totalOutput: 0,
                totalTarget: 0
              }
            }
            operationSummary[operationCode].totalOutput += parseInt(item.output) || 0
            operationSummary[operationCode].totalTarget += parseInt(item.target) || 0
          })
        }
      })
    } else {
      processChartData.forEach(item => {
        const operationCode = item.operation_code || 'Unknown'
        if (!operationSummary[operationCode]) {
          operationSummary[operationCode] = {
            code: operationCode,
            name: item.operation_name || operationCode,
            totalOutput: 0,
            totalTarget: 0
          }
        }
        operationSummary[operationCode].totalOutput += parseInt(item.output) || 0
        operationSummary[operationCode].totalTarget += parseInt(item.target) || 0
      })
    }

    const summaryData = Object.values(operationSummary)

    if (summaryData.length === 0) {
      return <div className="text-center py-8 text-gray-500">No operator data available</div>
    }

    // Cari MAX TARGET sebagai patokan
    const maxTarget = Math.max(...summaryData.map(op => 
      Math.max(0, op.totalTarget)
    ))
    
    const containerWidth = 900
    const pixelsPerUnit = containerWidth / maxTarget

    return (
      <div className="space-y-4 w-full">
        {/* Legend - Responsive */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Output</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Target</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {summaryData.map((operator, idx) => {
            const output = Math.max(0, operator.totalOutput)
            const target = Math.max(0, operator.totalTarget)
            
            // Panjang bar total berdasarkan target
            const totalBarWidth = target > 0 ? target * pixelsPerUnit : 0
            
            // Output ngisi dari kiri
            const outputFillWidth = target > 0 ? (output / target) * totalBarWidth : 0
            
            // Sisa/remaining background
            const remainingWidth = totalBarWidth - outputFillWidth
            
            const percentage = target > 0 ? Math.round((output / target) * 100) : 0

            return (
              <div key={idx} className="group">
                <div className="flex items-start gap-2 sm:gap-3 flex-col sm:flex-row">
                  {/* Label - Responsive */}
                  <div className="w-full sm:w-24 md:w-32 flex-shrink-0 mb-2 sm:mb-0">
                    <span className="text-xs sm:text-sm font-bold text-blue-600 block">
                      {operator.code}
                    </span>
                    <span className="text-xs text-gray-500">
                      {operator.name}
                    </span>
                  </div>

                  {/* Chart Section */}
                  <div className="flex-1 w-full relative">
                    {/* Tooltip - Responsive */}
                    <div className="absolute -top-20 sm:-top-24 left-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 p-2 sm:p-3 min-w-max border border-gray-700 hidden group-hover:block whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="font-bold text-blue-300 text-xs">{operator.code} - {operator.name}</div>
                        <div className="h-px bg-gray-600 my-1"></div>
                        <div className="flex items-center justify-between gap-4 sm:gap-6 text-xs">
                          <div>
                            <div className="text-gray-400">Total Output</div>
                            <div className="font-bold text-blue-400">{output}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Total Target</div>
                            <div className="font-bold text-purple-400">{target}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Performance</div>
                            <div className={`font-bold ${percentage >= 100 ? 'text-green-400' : percentage >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {percentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-center gap-0 relative w-full">
                      {/* UNIFIED BAR CONTAINER */}
                      {target > 0 ? (
                        <div className="flex items-center gap-0 flex-1 min-w-0">
                          {/* Output Part - BLUE (dari kiri) */}
                          {output > 0 && (
                            <div
                              className="bg-blue-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-blue-600 flex items-center justify-center relative rounded-l"
                              style={{ 
                                width: Math.max(outputFillWidth, 12) + 'px',
                                minWidth: outputFillWidth > 0 ? '12px' : '0px'
                              }}
                            >
                              {outputFillWidth >= 40 ? (
                                <span className="text-white text-xs sm:text-sm font-bold truncate px-1">
                                  {output}
                                </span>
                              ) : outputFillWidth >= 20 ? (
                                <span className="text-white text-xs font-bold px-0.5">
                                  {output}
                                </span>
                              ) : outputFillWidth > 0 ? (
                                <span className="absolute left-full ml-1 sm:ml-2 text-xs font-bold text-blue-600 whitespace-nowrap">
                                  {output}
                                </span>
                              ) : null}
                            </div>
                          )}

                          {/* Remaining Part - PURPLE (background, sisa) */}
                          {remainingWidth > 0 ? (
                            <div
                              className="bg-purple-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-purple-600 flex items-center justify-end pr-1 sm:pr-2 relative rounded-r"
                              style={{ 
                                width: Math.max(remainingWidth, 12) + 'px',
                                minWidth: '12px'
                              }}
                            >
                              {remainingWidth >= 50 ? (
                                <span className="text-white text-xs sm:text-sm font-bold truncate px-1">
                                  {target - output}
                                </span>
                              ) : remainingWidth >= 25 ? (
                                <span className="text-white text-xs font-bold px-0.5">
                                  {target - output}
                                </span>
                              ) : (
                                <span className="absolute left-full ml-1 sm:ml-2 text-xs font-bold text-purple-600 whitespace-nowrap">
                                  {target - output}
                                </span>
                              )}
                            </div>
                          ) : (
                            // Jika output >= target, jadi biru semua
                            <div
                              className="bg-blue-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-blue-600 flex items-center justify-end pr-1 sm:pr-2 relative rounded-r"
                              style={{ 
                                width: Math.max(outputFillWidth - totalBarWidth, 12) + 'px',
                                minWidth: outputFillWidth > totalBarWidth ? '12px' : '0px'
                              }}
                            >
                              {(outputFillWidth - totalBarWidth) >= 30 ? (
                                <span className="text-white text-xs sm:text-sm font-bold truncate px-1">
                                  +{output - target}
                                </span>
                              ) : null}
                            </div>
                          )}

                          {/* Percentage Badge - Direct Behind Bar */}
                          {target > 0 && (
                            <span className={`text-xs sm:text-sm font-bold whitespace-nowrap flex-shrink-0 ml-1.5 sm:ml-2 ${percentage >= 100 ? 'text-green-600' : percentage >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {percentage}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 font-medium">No target</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card shadow="md" padding="lg" rounded="lg" className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-display">Daily Summary Performance</h3>
          <p className="text-xs text-gray-500 mt-1">Operator performance across all hours</p>
        </div>
        <Activity size={20} className="text-purple-600" />
      </div>

      {!chartLoading ? (
        <div className="overflow-x-auto pb-4">
          {renderChart()}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <RefreshCw size={20} className="animate-spin text-blue-600" />
            <span className="text-gray-600">Loading chart...</span>
          </div>
        </div>
      )}
    </Card>
  )
}

export default DailySummaryPerformance