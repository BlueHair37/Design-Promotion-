import { Bot, AlertTriangle, Lightbulb } from 'lucide-react';

export default function AIInsightPanel({ insights = [], personas = [], aiAnalysis = null, isLoading = false }) {
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* AI Priority Insights */}
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex-1 backdrop-blur-md shadow-sm dark:shadow-none transition-colors duration-300 relative overflow-hidden flex flex-col min-h-0">
                {/* Visual Accent for Priority */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-rose-300"></div>

                <div className="flex items-center gap-2 mb-4 pl-2 shrink-0">
                    <div className="w-6 h-6 text-rose-500 dark:text-blue-400">{Icons.Bot}</div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">AI 우선순위 인사이트</h3>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pl-2 pr-2 space-y-4">
                    {/* Generative AI Analysis Section */}
                    {isLoading ? (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                            <p className="text-xs text-slate-500 mt-2">AI가 데이터를 분석 중입니다...</p>
                        </div>
                    ) : aiAnalysis ? (
                        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-slate-900/50 border border-indigo-100 dark:border-slate-700">
                            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                <div className="w-4 h-4">{Icons.Lightbulb}</div> AI 실시간 진단
                            </h4>
                            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {aiAnalysis}
                            </div>
                        </div>
                    ) : null}

                    {/* Existing Mock Insights */}
                    {insights.length > 0 ? insights.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-slate-600 transition-all cursor-pointer group">
                            <div className={`p-2 rounded-full ${item.type === 'danger' ? 'bg-rose-100 text-rose-600' : item.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'} dark:bg-slate-800 text-base`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    )) : (
                        !aiAnalysis && <p className="text-slate-500 text-sm">해당 지역에 대한 인사이트가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
