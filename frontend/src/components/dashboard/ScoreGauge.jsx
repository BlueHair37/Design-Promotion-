import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function ScoreGauge({ score }) {
    // Default placeholder
    // backend sends { score: number, grade: string, trend: string }
    const safeScore = score || { score: 0, grade: '-', trend: '-' };

    // Comprehensive Redesign for better space utilization
    const gaugeData = [
        { name: 'Score', value: safeScore.score, fill: 'url(#scoreGradient)' },
        { name: 'Remaining', value: 100 - safeScore.score, fill: '#f1f5f9' },
    ];

    return (
        <div className="w-full h-full flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">부산시 종합 진단</h3>
                    <div className="text-xs text-slate-400">실시간 데이터 기반</div>
                </div>
                <div className="text-right">
                    <span className={`text-4xl font-black ${safeScore.grade === 'S' || safeScore.grade === 'A' ? 'text-primary' : 'text-slate-700'}`}>
                        {safeScore.grade}
                    </span>
                    <span className="text-sm font-bold text-slate-400 ml-1">등급</span>
                </div>
            </div>

            {/* Main Gauge Area */}
            <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4f46e5" />
                                <stop offset="100%" stopColor="#f43f5e" />
                            </linearGradient>
                        </defs>
                        <Pie
                            data={gaugeData}
                            cx="50%"
                            cy="85%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="75%"
                            outerRadius="100%"
                            cornerRadius={10}
                            paddingAngle={-5}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="score" fill="url(#scoreGradient)" />
                            <Cell key="bg" fill="#f1f5f9" />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>

                {/* Score Text Overlay - Positioned relative to the chart center */}
                <div className="absolute inset-x-0 top-[60%] -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Total Score</div>
                    <div className="text-4xl font-black text-slate-800 tracking-tight">
                        {safeScore.score}
                        <span className="text-sm text-slate-400 font-normal ml-1">/ 100</span>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-2 bg-slate-50 rounded-xl p-3 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">전년 대비</span>
                <span className={`font-bold ${safeScore.trend && safeScore.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {safeScore.trend}
                </span>
            </div>
        </div>
    );
}
