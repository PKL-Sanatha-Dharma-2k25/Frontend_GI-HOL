import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Disc, Info, AlertTriangle, CheckCircle2, Zap } from 'lucide-react'
import Card from '@/components/ui/Card'

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload
        return (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl">
                <p className="text-blue-400 font-bold text-xs mb-1">{d.subject}</p>
                <p className="text-white text-[10px] mb-2 opacity-80">{d.name}</p>
                <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400 text-[10px]">Efficiency:</span>
                        <span className={`text-[10px] font-bold ${d.A >= 100 ? 'text-emerald-400' : d.A >= 80 ? 'text-blue-400' : 'text-rose-400'}`}>
                            {Math.round(d.A)}%
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400 text-[10px]">Output/Target:</span>
                        <span className="text-white text-[10px] font-bold">{d.output} / {Math.round(d.target)}</span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

export default function LineBalanceVisualizer({ data = [], isEmbedded = false }) {
    const chartData = data.map(item => ({
        subject: item.operation_code,
        A: Math.min(item.target > 0 ? (item.output / item.target) * 100 : 0, 150), // Cap at 150% for visualization
        fullMark: 100,
        name: item.operation_name,
        output: item.output,
        target: item.target
    }))

    const avgEfficiency = chartData.length > 0
        ? Math.round(chartData.reduce((sum, item) => sum + item.A, 0) / chartData.length)
        : 0

    const status = avgEfficiency >= 90 ? 'optimal' : avgEfficiency >= 70 ? 'balanced' : 'unbalanced'

    const content = (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[450px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 150]}
                            tick={{ fill: '#94a3b8', fontSize: 8 }}
                            axisLine={false}
                        />
                        <Radar
                            name="Efficiency"
                            dataKey="A"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fill="#6366f1"
                            fillOpacity={0.15}
                            animationBegin={200}
                            animationDuration={1500}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-[64%] h-[64%] border-2 border-dashed border-emerald-500 rounded-full" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Line Insights</p>

                    <div className="space-y-4">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400 font-medium">Avg Efficiency</p>
                                <p className="text-2xl font-black text-slate-800">{avgEfficiency}%</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-medium">Stations</p>
                                <p className="text-lg font-bold text-slate-700">{chartData.length}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                            <p className="text-[10px] font-bold text-slate-600 mb-3">HOW TO READ:</p>
                            <ul className="space-y-2">
                                <li className="flex gap-2 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                                    <p className="text-[10px] text-slate-500 leading-relaxed">
                                        <span className="font-bold text-slate-700 text-emerald-600">Dashed Circle:</span> The 100% target baseline.
                                    </p>
                                </li>
                                <li className="flex gap-2 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                                    <p className="text-[10px] text-slate-500 leading-relaxed">
                                        <span className="font-bold text-slate-700 text-rose-600">Dips:</span> Inward points indicate **BOTTLENECKS**.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Zap size={16} className="text-indigo-200" />
                        <p className="text-xs font-bold uppercase tracking-wider">Line Status: <span className="text-white">{status.toUpperCase()}</span></p>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-90 font-medium">
                        {status === 'optimal'
                            ? 'Line balance looks great! Maintain current pacing.'
                            : status === 'balanced'
                                ? 'Minor variations detected. Micro-adjust operator speeds.'
                                : 'Significant imbalance detected. Re-layout or add manpower.'}
                    </p>
                </div>
            </div>
        </div>
    )

    if (isEmbedded) return content

    return (
        <Card shadow="md" padding="lg" rounded="lg" className="bg-white overflow-hidden border-2 border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Disc size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Line Balance Radar</h3>
                        <p className="text-xs text-slate-500">Visualizing workload distribution across processes</p>
                    </div>
                </div>

                <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 border ${status === 'optimal' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                    status === 'balanced' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                        'bg-rose-50 border-rose-200 text-rose-700'
                    }`}>
                    {status === 'optimal' ? <CheckCircle2 size={14} /> : status === 'balanced' ? <Info size={14} /> : <AlertTriangle size={14} />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{status}</span>
                </div>
            </div>
            {content}
        </Card>
    )
}
