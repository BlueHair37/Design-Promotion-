export default function FilterPanel({ selectedYear, onSelectYear, selectedDistrict, onSelectDistrict, districts = [] }) {
    return (
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-6 backdrop-blur-md transition-colors duration-300 relative overflow-hidden shadow-sm dark:shadow-none">
            {/* Visual Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-rose-300"></div>

            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 pl-2">진단 필터 및 탐색</h3>
            <div className="space-y-4 pl-2">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        연도 선택
                    </label>
                    <select
                        value={selectedYear}
                        onChange={(e) => onSelectYear(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-base text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-rose-500 dark:focus:ring-blue-500 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <option value="2026">2026년 (현재)</option>
                        <option value="2025">2025년</option>
                        <option value="2024">2024년</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        지역 선택
                    </label>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => onSelectDistrict(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-base text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-rose-500 dark:focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        {districts.map((dist) => (
                            <option key={dist.id} value={dist.id}>
                                {dist.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
