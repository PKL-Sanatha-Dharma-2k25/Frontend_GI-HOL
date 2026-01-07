// ============================================
// FILE 3: /components/dashboard/StackedBarChart.jsx (RESPONSIVE FIX)
// ============================================
import { useState } from 'react'

export default function StackedBarChart({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>
  }

  // Cari MAX TARGET sebagai patokan panjang bar
  const maxTarget = Math.max(...data.map(item => {
    return Math.max(0, parseInt(item.target) || 0)
  }))

  return (
    <div className="space-y-4 w-full">
      {/* Legend - Responsive */}
      <div className="flex items-center gap-4 sm:gap-6 text-xs mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-700 font-medium text-xs sm:text-sm">Output</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-700 font-medium text-xs sm:text-sm">Target</span>
        </div>
      </div>

      {/* Bars Container */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6 relative">
        {data.map((item, idx) => {
          const output = Math.max(0, parseInt(item.output) || 0)
          const target = Math.max(0, parseInt(item.target) || 0)
          
          // Responsive width calculation
          const getBarWidth = () => {
            if (typeof window !== 'undefined') {
              const width = window.innerWidth
              if (width < 640) return width - 140 // Mobile
              if (width < 1024) return width - 200 // Tablet
              return 800 // Desktop
            }
            return 800
          }

          const containerWidth = getBarWidth()
          const pixelsPerUnit = containerWidth / maxTarget
          
          // Panjang bar total berdasarkan target
          const totalBarWidth = target > 0 ? target * pixelsPerUnit : 0
          
          // Output ngisi dari kiri berdasarkan output value
          const outputFillWidth = target > 0 ? (output / target) * totalBarWidth : 0
          
          // Sisa/remaining adalah background merah
          const remainingWidth = totalBarWidth - outputFillWidth
          
          const percentage = target > 0 ? Math.round((output / target) * 100) : 0
          const isHovered = hoveredIdx === idx

          return (
            <div key={idx} className="flex items-start gap-2 sm:gap-3 flex-col sm:flex-row">
              {/* Label - Responsive */}
              <div className="w-full sm:w-16 md:w-20 flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-blue-600 block">
                  {item.operation_code}
                </span>
                <span className="text-xs text-gray-500 block sm:hidden truncate">
                  {item.operation_name}
                </span>
              </div>

              {/* Chart Section */}
              <div className="flex-1 w-full relative">
                {/* Tooltip - Float above page */}
                {isHovered && (
                  <div className="fixed bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-2xl z-50 p-3 sm:p-4 border border-gray-700/50 backdrop-blur-sm"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -110%)',
                      minWidth: '280px'
                    }}
                  >
                    <div className="space-y-3">
                      {/* Title */}
                      <div>
                        <div className="font-bold text-blue-300 text-sm">{item.operation_code}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.operation_name}</div>
                      </div>
                      
                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-400 font-medium">Output</div>
                          <div className="text-sm font-bold text-blue-400 mt-1">{output}</div>
                        </div>
                        <div className="text-center border-l border-r border-gray-700/30">
                          <div className="text-xs text-gray-400 font-medium">Target</div>
                          <div className="text-sm font-bold text-red-400 mt-1">{target}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400 font-medium">Rate</div>
                          <div className={`text-sm font-bold mt-1 ${percentage >= 100 ? 'text-green-400' : percentage >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bar Chart */}
                <div className="flex items-center gap-0 relative w-full"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* UNIFIED BAR CONTAINER */}
                  {target > 0 ? (
                    <div className="flex items-center gap-0 flex-1 min-w-0 cursor-pointer">
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

                      {/* Remaining Part - RED (background, sisa) */}
                      {remainingWidth > 0 ? (
                        <div
                          className="bg-red-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-red-600 flex items-center justify-end pr-1 sm:pr-2 relative rounded-r"
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
                            <span className="absolute left-full ml-1 sm:ml-2 text-xs font-bold text-red-600 whitespace-nowrap">
                              {target - output}
                            </span>
                          )}
                        </div>
                      ) : (
                        // Jika output >= target, jadi biru semua
                        <div
                          className="bg-blue-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-blue-600 flex items-center justify-end pr-1 sm:pr-2 relative rounded-r"
                          style={{ 
                            width: Math.max(outputFillWidth - (containerWidth / maxTarget * target), 12) + 'px',
                            minWidth: outputFillWidth > (containerWidth / maxTarget * target) ? '12px' : '0px'
                          }}
                        >
                          {(outputFillWidth - (containerWidth / maxTarget * target)) >= 30 ? (
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
          )
        })}
      </div>
    </div>
  )
}