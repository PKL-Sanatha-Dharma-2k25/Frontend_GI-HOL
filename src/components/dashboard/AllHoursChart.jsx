// ============================================
// FILE 4: /components/dashboard/AllHoursChart.jsx
// ============================================

import { useState, useEffect } from 'react'

function AllHoursChart({ data = {} }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#6366f1']

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium text-lg">No data available</p>
        <p className="text-slate-400 text-sm mt-1">Charts will appear when data is loaded</p>
      </div>
    )
  }

  const allOperationCodes = new Set()
  Object.values(data).forEach(hourData => {
    if (Array.isArray(hourData)) {
      hourData.forEach(item => {
        allOperationCodes.add(item.operation_code)
      })
    }
  })

  const operationCodes = Array.from(allOperationCodes)

  let maxValue = 0
  operationCodes.forEach(code => {
    Object.values(data).forEach(hourData => {
      if (Array.isArray(hourData)) {
        const item = hourData.find(d => d.operation_code === code)
        if (item) {
          const out = Math.max(0, parseInt(item.output) || 0)
          const tar = Math.max(0, parseInt(item.target) || 0)
          maxValue = Math.max(maxValue, out + tar)
        }
      }
    })
  })

  const containerWidth = 750
  const pixelsPerUnit = maxValue > 0 ? containerWidth / maxValue : 1

  // Split operationCodes into 2 columns
  const mid = Math.ceil(operationCodes.length / 2)
  const leftOps = operationCodes.slice(0, mid)
  const rightOps = operationCodes.slice(mid)

  const renderOperationChart = (opCode, index) => {
    const hoursOutputData = []
    
    for (let hour = 1; hour <= 10; hour++) {
      const hourData = data[hour]
      if (Array.isArray(hourData)) {
        const item = hourData.find(d => d.operation_code === opCode)
        if (item) {
          hoursOutputData.push({
            hour,
            output: Math.max(0, parseInt(item.output) || 0),
            target: Math.max(0, parseInt(item.target) || 0),
            name: item.operation_name
          })
        }
      }
    }

    if (hoursOutputData.length === 0) return null

    return (
      <div 
        key={opCode} 
        className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl p-4 border border-slate-200/60 hover:border-blue-300/60 hover:shadow-lg transition-all duration-300"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: `all 0.4s ease-out ${index * 0.04}s`
        }}
      >
        <div className="mb-4">
          <span className="text-sm font-bold text-blue-600">{opCode}</span>
          <span className="text-xs text-slate-500 ml-2">{hoursOutputData[0]?.name || ''}</span>
        </div>
        
        <div className="space-y-2.5">
          {hoursOutputData.map((d, dataIdx) => {
            const outputWidth = d.output * pixelsPerUnit
            const percentage = d.target > 0 ? Math.round((d.output / d.target) * 100) : 0

            return (
              <div key={dataIdx} className="flex items-center gap-2.5">
                <div className="w-12 text-xs font-semibold text-slate-600 flex-shrink-0">
                  H{d.hour}
                </div>
                
                <div className="flex-1 relative group min-h-6 flex items-center">
                  {d.output > 0 && (
                    <div
                      className="h-5 rounded-lg flex items-center justify-center relative hover:shadow-md transition-all duration-300 cursor-pointer"
                      style={{ 
                        width: mounted ? Math.max(outputWidth, 20) + 'px' : '0px',
                        background: `linear-gradient(135deg, ${chartColors[d.hour - 1]}f0, ${chartColors[d.hour - 1]})`,
                        transitionDelay: `${index * 0.04 + dataIdx * 0.05}s`,
                        transitionProperty: 'width, box-shadow, transform'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1)'
                      }}
                    >
                      {outputWidth >= 35 && (
                        <span className="text-white text-xs font-bold px-1 truncate">
                          {d.output}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 p-2.5 whitespace-nowrap">
                    <div className="font-semibold mb-1 text-blue-300">Hour {d.hour}</div>
                    <div className="text-slate-200">Output: <span className="font-bold text-white">{d.output}</span></div>
                    <div className="text-slate-200">Target: <span className="font-bold text-white">{d.target}</span></div>
                    <div className={`font-semibold mt-1 ${percentage >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      Achievement: {percentage}%
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div className="w-2 h-2 bg-slate-900 transform rotate-45"></div>
                    </div>
                  </div>
                </div>

                <div className="w-10 text-right text-xs font-bold flex-shrink-0" style={{ color: chartColors[d.hour - 1] }}>
                  {d.output}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Legend */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-lg p-4 border border-slate-200/60 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Hour Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((hour, idx) => (
            <div 
              key={hour} 
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-white/70 transition-colors duration-200"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(0.9)',
                transition: `all 0.3s ease-out ${idx * 0.03}s`
              }}
            >
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0 shadow-sm" 
                style={{ backgroundColor: chartColors[hour - 1] }}
              ></div>
              <span className="text-xs text-slate-700 font-medium">H{hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {leftOps.map((opCode, idx) => renderOperationChart(opCode, idx))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {rightOps.map((opCode, idx) => renderOperationChart(opCode, idx + leftOps.length))}
        </div>
      </div>
    </div>
  )
}

export default AllHoursChart    