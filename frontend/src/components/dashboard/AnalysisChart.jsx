import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalysisChart({ theme, data, selectedDistrict }) {
    const isDark = theme === 'dark';
    const axisColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
    const gridColor = isDark ? '#374151' : '#e2e8f0'; // slate-700 : slate-200
    const tooltipBg = isDark ? '#1e293b' : '#ffffff';
    const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
    const tooltipText = isDark ? '#f1f5f9' : '#0f172a';

    const getTitle = () => {
        if (selectedDistrict === 'all') return '16개 구·군 비교 분석 (영역별 누적)';
        return `${selectedDistrict === 'all' ? '부산시 전체' : selectedDistrict} 월별 추세 (영역별 누적)`;
    };

    // Colors matching CSS variables
    const COLORS = {
        housing: '#60a5fa',   // blue-400
        env: '#4ade80',       // green-400
        transport: '#f87171', // red-400
        safety: '#facc15',    // yellow-400
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{getTitle()}</h3>
                <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.housing }}></div>주거</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.env }}></div>환경</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.transport }}></div>교통</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.safety }}></div>안전</span>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} stackOffset="sign">
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke={axisColor}
                            fontSize={11}
                            interval={0}
                            angle={selectedDistrict === 'all' ? -45 : 0}
                            textAnchor={selectedDistrict === 'all' ? "end" : "middle"}
                            height={selectedDistrict === 'all' ? 60 : 30}
                            tick={{ fill: axisColor }}
                            tickLine={false}
                        />
                        <YAxis stroke={axisColor} fontSize={10} tick={{ fill: axisColor }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: tooltipBg,
                                borderColor: tooltipBorder,
                                color: tooltipText,
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.4 }}
                            itemStyle={{ fontSize: '12px' }}
                            labelStyle={{ color: tooltipText, fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Bar dataKey="housing" stackId="a" fill={COLORS.housing} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="env" stackId="a" fill={COLORS.env} />
                        <Bar dataKey="transport" stackId="a" fill={COLORS.transport} />
                        <Bar dataKey="safety" stackId="a" fill={COLORS.safety} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
