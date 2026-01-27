import { Trophy, Medal, Award, TrendingUp, User } from 'lucide-react'

const OperatorLeaderboard = ({ data = [] }) => {
    const defaultData = [
        { id: 1, name: 'Siti Aminah', efficiency: 98, totalOutput: 450, rank: 1 },
        { id: 2, name: 'Budi Santoso', efficiency: 95, totalOutput: 435, rank: 2 },
        { id: 3, name: 'Agus Setiawan', efficiency: 92, totalOutput: 410, rank: 3 },
        { id: 4, name: 'Dewi Lestari', efficiency: 89, totalOutput: 395, rank: 4 },
        { id: 5, name: 'Eko Prasetyo', efficiency: 87, totalOutput: 380, rank: 5 },
    ]

    const displayData = data.length > 0 ? data : defaultData

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-500" />
            case 2:
                return <Medal className="w-6 h-6 text-slate-400" />
            case 3:
                return <Award className="w-6 h-6 text-orange-400" />
            default:
                return <span className="text-lg font-bold text-slate-400">#{rank}</span>
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" size={18} />
                        Top Performance
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="p-2 space-y-1">
                    {displayData.map((op) => (
                        <div
                            key={op.id}
                            className="group relative flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200"
                        >
                            <div className="w-8 flex justify-center">
                                {getRankIcon(op.rank)}
                            </div>

                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:border-emerald-100 transition-colors">
                                <User className="text-slate-400" size={20} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-end justify-between mb-1.5">
                                    <h4 className="font-bold text-slate-800 truncate text-sm sm:text-base">
                                        {op.name}
                                    </h4>
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${op.efficiency >= 95 ? 'bg-green-100 text-green-700' :
                                        op.efficiency >= 85 ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                        {op.efficiency}% Eff
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${op.efficiency >= 95 ? 'bg-emerald-500' :
                                                op.efficiency >= 85 ? 'bg-blue-500' :
                                                    'bg-orange-500'
                                                }`}
                                            style={{ width: `${op.efficiency}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[10px] text-slate-400 font-medium">Output: {op.totalOutput}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">Target: {Math.round(op.totalOutput / (op.efficiency / 100))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OperatorLeaderboard
