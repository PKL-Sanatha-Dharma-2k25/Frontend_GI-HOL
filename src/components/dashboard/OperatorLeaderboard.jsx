import { Trophy, Medal, Award, TrendingUp, User } from 'lucide-react'

const OperatorLeaderboard = ({ data = [] }) => {
    const defaultData = [
        { id: 1, name: 'Siti Aminah', efficiency: 98, totalOutput: 450, rank: 1 },
        { id: 2, name: 'Budi Santoso', efficiency: 95, totalOutput: 435, rank: 2 },
        { id: 3, name: 'Dewi Lestari', efficiency: 92, totalOutput: 420, rank: 3 },
        { id: 4, name: 'Ahmad Fauzi', efficiency: 88, totalOutput: 405, rank: 4 },
        { id: 5, name: 'Rina Wijaya', efficiency: 85, totalOutput: 390, rank: 5 },
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

    const getProgressBarColor = (efficiency) => {
        if (efficiency >= 95) return 'bg-gradient-to-r from-emerald-400 to-green-500'
        if (efficiency >= 85) return 'bg-gradient-to-r from-blue-400 to-indigo-500'
        return 'bg-gradient-to-r from-amber-400 to-orange-500'
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 h-full flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Trophy className="w-6 h-6 text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Operator Leaderboard</h3>
                            <p className="text-indigo-100 text-xs font-medium">Top Performers Today</p>
                        </div>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                        <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-green-300" />
                            <span className="text-white text-[10px] uppercase tracking-wider font-bold">Live Stats</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                    {displayData.map((op) => (
                        <div
                            key={op.id}
                            className="group relative flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200"
                        >
                            <div className="w-8 flex justify-center">
                                {getRankIcon(op.rank)}
                            </div>

                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                    <User className="w-6 h-6 text-slate-400" />
                                </div>
                                {op.efficiency >= 95 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                )}
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

                                <div className="relative pt-1">
                                    <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-100 border border-slate-50">
                                        <div
                                            style={{ width: `${op.efficiency}%` }}
                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${getProgressBarColor(op.efficiency)}`}
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

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button className="w-full py-2.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-white rounded-xl transition-all duration-200 border border-transparent hover:border-indigo-100 shadow-sm">
                    View All Operators
                </button>
            </div>
        </div>
    )
}

export default OperatorLeaderboard
