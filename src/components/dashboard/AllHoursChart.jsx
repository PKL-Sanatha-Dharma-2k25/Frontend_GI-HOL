// ============================================
// FILE 4: /components/dashboard/AllHoursChart.jsx
// ============================================
function AllHoursChart({ data = {} }) {
  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>
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

  const containerWidth = 900
  const pixelsPerUnit = maxValue > 0 ? containerWidth / maxValue : 1

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-6 text-xs mb-6 flex-wrap">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(hour => (
          <div key={hour} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: chartColors[hour - 1] || '#999' }}
            ></div>
            <span className="text-gray-700 font-medium">Hour {hour}</span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {operationCodes.map((opCode, idx) => {
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
            <div key={opCode}>
              <div className="mb-3">
                <span className="text-sm font-bold text-blue-600">{opCode}</span>
                <span className="text-xs text-gray-500 ml-2">{hoursOutputData[0]?.name || ''}</span>
              </div>
              
              <div className="space-y-2">
                {hoursOutputData.map((d, dataIdx) => {
                  const outputWidth = d.output * pixelsPerUnit
                  const percentage = d.target > 0 ? Math.round((d.output / d.target) * 100) : 0

                  return (
                    <div key={dataIdx} className="flex items-center gap-3">
                      <div className="w-16 text-xs font-semibold text-gray-600">
                        Hour {d.hour}
                      </div>
                      
                      <div className="flex-1 relative group">
                        {d.output > 0 && (
                          <div
                            className="bg-blue-500 h-5 rounded flex items-center justify-center relative hover:bg-blue-600 transition-all"
                            style={{ width: Math.max(outputWidth, 15) + 'px', backgroundColor: chartColors[d.hour - 1] }}
                          >
                            {outputWidth >= 30 && (
                              <span className="text-white text-xs font-bold px-1">
                                {d.output}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="absolute -top-16 left-0 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 p-2 whitespace-nowrap hidden group-hover:block">
                          <div>Output: {d.output} | Target: {d.target}</div>
                          <div>Achievement: {percentage}%</div>
                        </div>
                      </div>

                      <div className="w-12 text-right text-xs font-bold" style={{ color: chartColors[d.hour - 1] }}>
                        {d.output}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllHoursChart
