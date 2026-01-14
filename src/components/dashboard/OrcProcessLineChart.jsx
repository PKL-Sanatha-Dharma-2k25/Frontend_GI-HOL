import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import Card from '@/components/ui/Card'
import { TrendingUp, Zap, Target, AlertCircle, ArrowUpDown, BarChart3 } from 'lucide-react'
import { useState } from 'react'

function OrcProcessLineChart({ chartData = [], loading = false, orc = '-' }) {
  const [chartType, setChartType] = useState('line') // 'line' atau 'bar'
  const [sortOrder, setSortOrder] = useState('original') // 'original', 'highest', 'lowest'

  // Sort data
  const getSortedData = () => {
    let sorted = [...chartData]
    if (sortOrder === 'highest') {
      sorted = sorted.sort((a, b) => b.output - a.output)
    } else if (sortOrder === 'lowest') {
      sorted = sorted.sort((a, b) => a.output - b.output)
    }
    return sorted
  }

  const displayData = getSortedData()

  const averageOutput = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, item) => sum + item.output, 0) / chartData.length)
    : 0

  const maxOutput = chartData.length > 0 ? Math.max(...chartData.map(item => item.output)) : 0
  const minOutput = chartData.length > 0 ? Math.min(...chartData.map(item => item.output)) : 0
  const variance = ((maxOutput - minOutput) / averageOutput * 100).toFixed(1)

  if (!chartData || chartData.length === 0) {
    return (
      <div className="fade-in">
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 min-h-96 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>

          <div className="relative text-center text-white">
            {loading ? (
              <>
                <div className="flex justify-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-lg font-bold">Loading performance data...</p>
              </>
            ) : (
              <>
                <TrendingUp size={60} className="mx-auto mb-4 text-blue-300" />
                <p className="text-2xl font-bold mb-2">No Data Available</p>
                <p className="text-slate-300">Select a valid ORC to view performance trends</p>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6">
      {/* Header Card */}
      <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-3xl p-8 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                <Zap size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white">Process Performance</h2>
                <p className="text-blue-100 text-lg mt-2">ORC: <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">{orc}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-6xl font-bold text-white drop-shadow-lg">{chartData.length}</p>
              <p className="text-blue-100 text-lg font-semibold">Operations</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Average</p>
              <p className="text-3xl font-bold text-white">{averageOutput.toLocaleString()}</p>
              <p className="text-blue-200 text-xs mt-1">Units</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Peak</p>
              <p className="text-3xl font-bold text-white">{maxOutput.toLocaleString()}</p>
              <p className="text-blue-200 text-xs mt-1">Highest</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Variance</p>
              <p className="text-3xl font-bold text-white">{variance}%</p>
              <p className="text-blue-200 text-xs mt-1">Difference</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider">Peak Output</p>
              <p className="text-4xl font-black mt-2">{maxOutput.toLocaleString()}</p>
            </div>
            <TrendingUp size={40} className="text-white/80 group-hover:text-white transition" />
          </div>
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full w-4/5 group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Average</p>
              <p className="text-4xl font-black mt-2">{averageOutput.toLocaleString()}</p>
            </div>
            <Target size={40} className="text-white/80 group-hover:text-white transition" />
          </div>
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full w-3/5 group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-orange-100 text-sm font-bold uppercase tracking-wider">Lowest</p>
              <p className="text-4xl font-black mt-2">{minOutput.toLocaleString()}</p>
            </div>
            <AlertCircle size={40} className="text-white/80 group-hover:text-white transition" />
          </div>
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full w-2/5 group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <Card shadow="2xl" padding="xl" rounded="2xl" className="bg-white relative overflow-hidden">
        {/* Controls Bar */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          {/* Chart Type Switcher */}
          <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5">
            <button
              onClick={() => setChartType('line')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm uppercase tracking-wider flex items-center gap-2 ${
                chartType === 'line'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={16} />
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm uppercase tracking-wider flex items-center gap-2 ${
                chartType === 'bar'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <BarChart3 size={16} />
              Bar Chart
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5">
            <button
              onClick={() => setSortOrder('original')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm uppercase tracking-wider flex items-center gap-2 ${
                sortOrder === 'original'
                  ? 'bg-slate-600 text-white shadow-lg'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <ArrowUpDown size={16} />
              Original
            </button>
            <button
              onClick={() => setSortOrder('highest')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm uppercase tracking-wider flex items-center gap-2 ${
                sortOrder === 'highest'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <TrendingUp size={16} />
              Highest
            </button>
            <button
              onClick={() => setSortOrder('lowest')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm uppercase tracking-wider flex items-center gap-2 ${
                sortOrder === 'lowest'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <AlertCircle size={16} />
              Lowest
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-6 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            <span className="text-sm font-bold text-slate-700">Output Trend</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-0.5" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f97316 0, #f97316 8px, transparent 8px, transparent 14px)' }}></div>
            <span className="text-sm font-bold text-slate-700">Average: {averageOutput.toLocaleString()}</span>
          </div>
        </div>

        {/* Chart Container */}
        {!loading ? (
          <div style={{ width: '100%', height: '520px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart
                  data={displayData}
                  margin={{ top: 40, right: 100, left: 70, bottom: 150 }}
                >
                  <defs>
                    <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid 
                    strokeDasharray="4 4" 
                    stroke="#e2e8f0" 
                    opacity={0.5}
                  />

                  <XAxis
                    dataKey="operation_code"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fontSize: 13, fill: '#475569', fontWeight: 700 }}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                    tickLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                  />

                  <YAxis
                    label={{ 
                      value: 'Output Units', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 13, fill: '#475569', fontWeight: 700 }
                    }}
                    tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                    tickLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    width={50}
                  />

                  <ReferenceLine
                    y={averageOutput}
                    stroke="#f97316"
                    strokeDasharray="8 4"
                    strokeWidth={2.5}
                    label={{
                      value: `AVG: ${averageOutput.toLocaleString()}`,
                      position: 'right',
                      fill: '#ea580c',
                      fontSize: 12,
                      fontWeight: 'bold',
                      offset: 20,
                      backgroundColor: '#fff7ed',
                      padding: [4, 8],
                      border: '2px solid #f97316',
                      borderRadius: 6
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '3px solid #3b82f6',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
                    }}
                    formatter={(value) => [
                      <span className="font-black text-blue-300 text-lg">{value.toLocaleString()}</span>,
                    ]}
                    labelFormatter={(label) => {
                      const item = displayData.find(d => d.operation_code === label)
                      if (item) {
                        return (
                          <div className="text-white mb-3">
                            <div className="text-base font-black">{item.operation_code}</div>
                            <div className="text-xs text-slate-300">{item.operation_name}</div>
                          </div>
                        )
                      }
                      return label
                    }}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 3, opacity: 0.4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="output"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ 
                      fill: '#3b82f6', 
                      r: 6, 
                      strokeWidth: 3, 
                      stroke: '#fff',
                      filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4))'
                    }}
                    activeDot={{ 
                      r: 10, 
                      fill: '#1e40af', 
                      strokeWidth: 3, 
                      stroke: '#fff',
                      filter: 'drop-shadow(0 8px 16px rgba(30, 64, 175, 0.6))'
                    }}
                    name="Output"
                    isAnimationActive={true}
                    animationDuration={1200}
                    label={{
                      position: 'top',
                      fill: '#1e3a8a',
                      fontSize: 12,
                      fontWeight: 'bold',
                      offset: 12,
                      formatter: (value) => value.toLocaleString()
                    }}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={displayData}
                  margin={{ top: 40, right: 100, left: 70, bottom: 150 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#1e40af" stopOpacity={0.9}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid 
                    strokeDasharray="4 4" 
                    stroke="#e2e8f0" 
                    opacity={0.5}
                  />

                  <XAxis
                    dataKey="operation_code"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fontSize: 13, fill: '#475569', fontWeight: 700 }}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                    tickLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                  />

                  <YAxis
                    label={{ 
                      value: 'Output Units', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 13, fill: '#475569', fontWeight: 700 }
                    }}
                    tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                    tickLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    width={50}
                  />

                  <ReferenceLine
                    y={averageOutput}
                    stroke="#f97316"
                    strokeDasharray="8 4"
                    strokeWidth={2.5}
                    label={{
                      value: `AVG: ${averageOutput.toLocaleString()}`,
                      position: 'right',
                      fill: '#ea580c',
                      fontSize: 12,
                      fontWeight: 'bold',
                      offset: 20
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '3px solid #3b82f6',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
                    }}
                    formatter={(value) => [
                      <span className="font-black text-blue-300 text-lg">{value.toLocaleString()}</span>,
                    ]}
                    labelFormatter={(label) => {
                      const item = displayData.find(d => d.operation_code === label)
                      if (item) {
                        return (
                          <div className="text-white mb-3">
                            <div className="text-base font-black">{item.operation_code}</div>
                            <div className="text-xs text-slate-300">{item.operation_name}</div>
                          </div>
                        )
                      }
                      return label
                    }}
                  />

                  <Bar
                    dataKey="output"
                    fill="url(#barGradient)"
                    radius={[12, 12, 0, 0]}
                    animationDuration={1200}
                    label={{
                      position: 'top',
                      fill: '#1e3a8a',
                      fontSize: 12,
                      fontWeight: 'bold',
                      formatter: (value) => value.toLocaleString()
                    }}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex gap-3 mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-lg font-bold text-slate-700">Loading performance data...</p>
            </div>
          </div>
        )}
      </Card>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default OrcProcessLineChart