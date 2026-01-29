import { useState } from 'react'

export default function StackedBarChart({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>
  }



  const maxTarget = Math.max(1, ...data.map(item => {
    return Math.max(0, parseInt(item.target) || 0)
  }))

  return (
    <div className="space-y-4 w-full">


      <div className="flex items-center gap-4 sm:gap-6 text-xs mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-700 font-medium text-xs sm:text-sm">Output</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-700 font-medium text-xs sm:text-sm">Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span className="text-gray-700 font-medium text-xs sm:text-sm">Repair</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-700 font-medium text-xs sm:text-sm">Reject</span>
        </div>
      </div>



      <div className="space-y-4 sm:space-y-5 md:space-y-6 relative">
        {data.map((item, idx) => {
          const output = Math.max(0, parseInt(item.output) || 0)
          const target = Math.max(0, parseInt(item.target) || 0)
          const repair = Math.max(0, parseInt(item.repair) || 0)
          const reject = Math.max(0, parseInt(item.reject) || 0)



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



          const totalBarWidth = target > 0 ? target * pixelsPerUnit : 0



          const outputFillWidth = target > 0 ? (output / target) * totalBarWidth : 0



          const remainingWidth = totalBarWidth - outputFillWidth

          const percentage = target > 0 ? Math.round((output / target) * 100) : 0
          const isHovered = hoveredIdx === idx

          return (
            <div key={idx} className="flex items-start gap-2 sm:gap-3 flex-col sm:flex-row">


              <div className="w-full sm:w-16 md:w-20 flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-blue-600 block">
                  {item.operation_code}
                </span>
                <span className="text-xs text-gray-500 block sm:hidden truncate">
                  {item.operation_name}
                </span>
              </div>



              <div className="flex-1 w-full relative">


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
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Output</div>
                          <div className="text-sm font-bold text-green-400 mt-1">{output}</div>
                        </div>
                        <div className="text-center border-l border-gray-700/30">
                          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Target</div>
                          <div className="text-sm font-bold text-blue-400 mt-1">{target}</div>
                        </div>
                        <div className="text-center mt-1 border-t border-gray-700/30 pt-1">
                          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Repair</div>
                          <div className="text-sm font-bold text-yellow-400 mt-1">{repair}</div>
                        </div>
                        <div className="text-center mt-1 border-l border-t border-gray-700/30 pt-1">
                          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Reject</div>
                          <div className="text-sm font-bold text-red-400 mt-1">{reject}</div>
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

                      <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Efficiency Rate</span>
                        <span className={`text-sm font-bold ${percentage >= 100 ? 'text-green-400' : percentage >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}



                <div className="flex items-center gap-0 relative w-full"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >


                  {target > 0 ? (
                    <div className="flex items-center gap-0 flex-1 min-w-0 cursor-pointer">


                      {output > 0 && (
                        <div
                          className="bg-green-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-green-600 flex items-center justify-center relative rounded-l"
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
                            <span className="absolute left-full ml-1 sm:ml-2 text-xs font-bold text-green-600 whitespace-nowrap">
                              {output}
                            </span>
                          ) : null}
                        </div>
                      )}



                      {repair > 0 && (
                        <div
                          className="bg-yellow-400 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-yellow-500 flex items-center justify-center relative border-l border-white/20"
                          style={{
                            width: Math.max((repair / (target || 1)) * totalBarWidth, 8) + 'px'
                          }}
                        >
                        </div>
                      )}

                      {reject > 0 && (
                        <div
                          className="bg-red-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-red-600 flex items-center justify-center relative border-l border-white/20"
                          style={{
                            width: Math.max((reject / (target || 1)) * totalBarWidth, 8) + 'px'
                          }}
                        >
                        </div>
                      )}

                      {remainingWidth - ((repair + reject) / (target || 1)) * totalBarWidth > 0 ? (
                        <div
                          className="bg-blue-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-blue-600 flex items-center justify-end pr-1 sm:pr-2 relative rounded-r border-l border-white/20"
                          style={{
                            width: Math.max(remainingWidth - ((repair + reject) / (target || 1)) * totalBarWidth, 12) + 'px',
                            minWidth: '12px'
                          }}
                        >
                          {target - output - repair - reject > 0 && remainingWidth > 40 && (
                            <span className="text-white text-[10px] font-bold truncate px-0.5">
                              {target - output - repair - reject}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div
                          className="bg-green-500 h-5 sm:h-6 md:h-7 transition-all duration-500 ease-out hover:bg-green-600 flex items-center justify-end pr-1 sm:pr-2 relative rounded-r"
                          style={{
                            width: Math.max(outputFillWidth - (containerWidth / maxTarget * target), 12) + 'px'
                          }}
                        >
                          {(outputFillWidth - (containerWidth / maxTarget * target)) >= 30 ? (
                            <span className="text-white text-xs sm:text-sm font-bold truncate px-1">
                              +{output - target}
                            </span>
                          ) : null}
                        </div>
                      )}



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