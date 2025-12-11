import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function ScoreGauge({ score }) {
    // Default placeholder
    const safeScore = score || { value: 0, grade: '-', trend: '-' };

    // Comprehensive Redesign for better space utilization
    const gaugeData = [
        { name: 'Score', value: safeScore.value, fill: 'url(#scoreGradient)' },
        { name: 'Remaining', value: 100 - safeScore.value, fill: 'var(--bg-body)' },
    ];

    return (
        <div className="w-full h-full flex flex-col relative p-4 bg-slate-800/50">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">부산시 종합 진단</h3>
                    <div className="text-xs text-slate-500">실시간 데이터 기반</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${safeScore.trend.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {safeScore.trend}
                </div>
            </div>

            {/* Main Content: Split into Chart and Stats */}
            <div className="flex-1 flex items-center justify-between gap-4">

                {/* Left: Big Circular Gauge */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#60a5fa" />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={gaugeData}
                                cx="50%"
                                cy="50%"
                                startAngle={220}
                                endAngle={-40}
                                innerRadius={48}
                                outerRadius={60}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={10}
                                paddingAngle={5}
                            >
                                <Cell key="score" fill="url(#scoreGradient)" />
                                <Cell key="bg" fill="rgba(255,255,255,0.05)" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">{safeScore.grade}</span>
                        <span className="text-[10px] text-slate-400">등급</span>
                    </div>
                </div>

                {/* Right: Detailed Stats Grid */}
                <div className="flex-1 grid grid-cols-1 gap-2">
                    <div className="flex flex-col bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-xs text-slate-400">종합 점수</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-primary">{safeScore.value}</span>
                            <span className="text-xs text-slate-500">/ 100</span>
                        </div>
                    </div>
                    <div className="flex flex-col bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-xs text-slate-400">전년 대비</span>
                        <span className="text-sm font-bold text-white flex items-center gap-1">
                            {safeScore.trend.includes('+') ? '▲' : '▼'} {safeScore.trend.replace(/[^0-9.%]/g, '')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
