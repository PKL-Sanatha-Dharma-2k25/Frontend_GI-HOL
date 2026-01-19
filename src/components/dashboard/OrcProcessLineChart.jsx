import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'
import Card from '@/components/ui/Card'
import { TrendingUp, Zap, Target, AlertCircle, ArrowUpDown, BarChart3 } from 'lucide-react'
import { useState, useMemo } from 'react'

function OrcProcessLineChart({ chartData = [], loading = false, orc = '-' }) {
  const [chartType, setChartType] = useState('line')
  const [sortOrder, setSortOrder] = useState('original')

  // ✅ TAMBAH DUMMY DATA untuk Repair & Reject
  const enrichedChartData = useMemo(() => {
    return chartData.map((item, index) => {
      const baseOutput = parseInt(item.output) || 0
      
      // Generate dummy repair & reject berdasarkan output
      const repairOutput = Math.round(baseOutput * (0.05 + Math.random() * 0.1)) // 5-15% dari output
      const rejectOutput = Math.round(baseOutput * (0.02 + Math.random() * 0.08)) // 2-10% dari output
      
      return {
        ...item,
        output: baseOutput,
        repair: repairOutput,
        reject: rejectOutput,
        total: baseOutput + repairOutput + rejectOutput
      }
    })
  }, [chartData])

  const getSortedData = () => {
    let sorted = [...enrichedChartData]
    if (sortOrder === 'highest') {
      sorted = sorted.sort((a, b) => b.output - a.output)
    } else if (sortOrder === 'lowest') {
      sorted = sorted.sort((a, b) => a.output - b.output)
    }
    return sorted
  }

  const displayData = getSortedData()

  // ✅ HITUNG STATS untuk semua 3 output
  const calculateStats = (key) => {
    if (enrichedChartData.length === 0) return { avg: 0, max: 0, min: 0 }
    
    const values = enrichedChartData.map(item => item[key] || 0)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = Math.round(sum / values.length)
    const max = Math.max(...values)
    const min = Math.min(...values)
    
    return { avg, max, min }
  }

  const outputStats = calculateStats('output')
  const repairStats = calculateStats('repair')
  const rejectStats = calculateStats('reject')

  // Custom Tooltip untuk Bar Chart Modern
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-900 border-2 border-blue-500 rounded-lg p-4 shadow-2xl">
          <p className="text-white font-bold mb-1">{data.operation_code}</p>
          <p className="text-xs text-slate-300 mb-3">{data.operation_name}</p>
          <p className="text-sm font-bold text-green-400">
            Output: {data.output?.toLocaleString() || 0}
          </p>
          <p className="text-sm font-bold text-yellow-400">
            Repair: {data.repair?.toLocaleString() || 0}
          </p>
          <p className="text-sm font-bold text-red-400">
            Reject: {data.reject?.toLocaleString() || 0}
          </p>
        </div>
      )
    }
    return null
  }

  if (!enrichedChartData || enrichedChartData.length === 0) {
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
      {/* ===== HEADER SECTION ===== */}
      <div className="mb-6 p-6 bg-gradient-to-r from-slate-50 via-emerald-50 to-slate-50 rounded-xl border border-emerald-200 shadow-sm">
        <style>{`
          .header-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
          }

          .header-title {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .header-title-icon {
            padding: 0.75rem;
            background-color: #10b981;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .header-title-icon svg {
            color: white;
            width: 24px;
            height: 24px;
          }

          .header-title-text h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            line-height: 1.2;
          }

          .header-title-text p {
            font-size: 0.85rem;
            color: #475569;
            margin: 0.5rem 0 0 0;
          }

          .header-orc {
            display: inline-block;
            background-color: #d1fae5;
            border: 2px solid #6ee7b7;
            border-radius: 0.375rem;
            padding: 0.375rem 0.75rem;
            font-weight: 700;
            color: #059669;
            font-size: 0.875rem;
          }

          .header-ops-box {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
          }

          .header-ops-count {
            font-size: 2.5rem;
            font-weight: 700;
            color: #059669;
            margin: 0;
            line-height: 1;
          }

          .header-ops-label {
            font-size: 0.75rem;
            color: #475569;
            font-weight: 600;
            margin: 0.25rem 0 0 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .header-bottom {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
            border-top: 1px solid #a7f3d0;
            padding-top: 1.5rem;
          }

          .stat-item {
            background: white;
            border: 2px solid #a7f3d0;
            border-radius: 0.5rem;
            padding: 1rem;
            text-align: center;
            transition: all 0.2s ease;
          }

          .stat-item:hover {
            border-color: #6ee7b7;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
          }

          .stat-label {
            font-size: 0.65rem;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
          }

          .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #059669;
            line-height: 1.2;
          }

          .stat-unit {
            font-size: 0.7rem;
            color: #64748b;
            margin-top: 0.375rem;
          }
        `}</style>

        <div className="header-container">
          {/* Top Row - Title & Operations Count */}
          <div className="header-top">
            <div className="header-title">
              <div className="header-title-icon">
                <Zap />
              </div>
              <div className="header-title-text">
                <h2>Process Performance</h2>
                <p>ORC: <span className="header-orc">{orc}</span></p>
              </div>
            </div>

            <div className="header-ops-box">
              <p className="header-ops-count">{enrichedChartData.length}</p>
              <p className="header-ops-label">Operations</p>
            </div>
          </div>

          {/* Bottom Row - Stats Cards for All 3 Types */}
          <div className="header-bottom">
            {/* Output Stats - Green */}
            <div className="stat-item" style={{ borderColor: '#86efac', backgroundColor: '#f0fdf4' }}>
              <div className="stat-label" style={{ color: '#166534' }}>✅ Output Avg</div>
              <div className="stat-value" style={{ color: '#22c55e' }}>{outputStats.avg.toLocaleString()}</div>
              <div className="stat-unit">Units</div>
            </div>

            {/* Repair Stats - Yellow */}
            <div className="stat-item" style={{ borderColor: '#fcd34d', backgroundColor: '#fffbeb' }}>
              <div className="stat-label" style={{ color: '#854d0e' }}>🔧 Repair Avg</div>
              <div className="stat-value" style={{ color: '#eab308' }}>{repairStats.avg.toLocaleString()}</div>
              <div className="stat-unit">Units</div>
            </div>

            {/* Reject Stats - Red */}
            <div className="stat-item" style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
              <div className="stat-label" style={{ color: '#991b1b' }}>❌ Reject Avg</div>
              <div className="stat-value" style={{ color: '#ef4444' }}>{rejectStats.avg.toLocaleString()}</div>
              <div className="stat-unit">Units</div>
            </div>
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
            <div className="w-6 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-bold text-slate-700">Output (OK)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-bold text-slate-700">Repair (Dummy)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-bold text-slate-700">Reject (Dummy)</span>
          </div>
        </div>

        {/* Chart Container */}
        {!loading ? (
          <div style={{ width: '100%', height: '900px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart
                  data={displayData}
                  margin={{ top: 40, right: 100, left: 70, bottom: 150 }}
                >
                  <defs>
                    <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRepair" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReject" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.5} />

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

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '3px solid #3b82f6',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
                    }}
                    formatter={(value) => [
                      <span className="font-black text-lg">{value.toLocaleString()}</span>,
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
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#16a34a', strokeWidth: 2 }}
                    name="Output"
                    animationDuration={1200}
                  />

                  <Line
                    type="monotone"
                    dataKey="repair"
                    stroke="#eab308"
                    strokeWidth={3}
                    dot={{ fill: '#eab308', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#ca8a04', strokeWidth: 2 }}
                    name="Repair"
                    animationDuration={1200}
                  />

                  <Line
                    type="monotone"
                    dataKey="reject"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#dc2626', strokeWidth: 2 }}
                    name="Reject"
                    animationDuration={1200}
                  />

                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </LineChart>
              ) : (
                <BarChart
                  data={displayData}
                  margin={{ top: 40, right: 30, left: 70, bottom: 120 }}
                  barCategoryGap="5%"
                  barSize={85}
                >
                  <defs>
                    <linearGradient id="gradOutput" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="gradRepair" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eab308" stopOpacity={1} />
                      <stop offset="100%" stopColor="#ca8a04" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="gradReject" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e2e8f0" 
                    opacity={0.3}
                    vertical={false}
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

                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }} />

                  <Bar 
                    dataKey="output" 
                    fill="url(#gradOutput)" 
                    radius={[12, 12, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={800}
                  />

                  <Bar 
                    dataKey="repair" 
                    fill="url(#gradRepair)" 
                    radius={[12, 12, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />

                  <Bar 
                    dataKey="reject" 
                    fill="url(#gradReject)" 
                    radius={[12, 12, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />

                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
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

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-40">
          {/* Output Peak - Green */}
          <div className="group bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-green-100 text-xs font-bold uppercase tracking-wider">Output Peak</p>
                <p className="text-3xl font-black mt-1">{outputStats.max.toLocaleString()}</p>
              </div>
              <TrendingUp size={32} className="text-white/80 group-hover:text-white transition" />
            </div>
            <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-4/5 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Repair Peak - Yellow */}
          <div className="group bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-yellow-100 text-xs font-bold uppercase tracking-wider">Repair Peak</p>
                <p className="text-3xl font-black mt-1">{repairStats.max.toLocaleString()}</p>
              </div>
              <Target size={32} className="text-white/80 group-hover:text-white transition" />
            </div>
            <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-3/5 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Reject Peak - Red */}
          <div className="group bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-red-100 text-xs font-bold uppercase tracking-wider">Reject Peak</p>
                <p className="text-3xl font-black mt-1">{rejectStats.max.toLocaleString()}</p>
              </div>
              <AlertCircle size={32} className="text-white/80 group-hover:text-white transition" />
            </div>
            <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-2/5 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
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