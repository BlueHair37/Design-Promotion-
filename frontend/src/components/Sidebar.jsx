// Inline Lucide Icons to prevent runtime crashes with library
const Icons = {
    Home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    Leaf: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>,
    Car: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>,
    Shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>,
    GraduationCap: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
    Factory: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><line x1="17" y1="13" x2="17" y2="13h.01" /><line x1="12" y1="13" x2="12" y2="13h.01" /><line x1="7" y1="13" x2="7" y2="13h.01" /></svg>,
    Palette: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>,
    Heart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>,
    RotateCcw: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
};

const menuItems = [
    { id: 'housing', label: '주거', icon: Icons.Home, color: 'cat-housing' },
    { id: 'environment', label: '환경', icon: Icons.Leaf, color: 'cat-env' },
    { id: 'transport', label: '교통', icon: Icons.Car, color: 'cat-transport' },
    { id: 'safety', label: '안전', icon: Icons.Shield, color: 'cat-safety' },
    { id: 'education', label: '교육', icon: Icons.GraduationCap, color: 'cat-education' },
    { id: 'industry', label: '산업/일자리', icon: Icons.Factory, color: 'cat-industry' },
    { id: 'culture', label: '문화/여가', icon: Icons.Palette, color: 'cat-culture' },
    { id: 'welfare', label: '보건/복지', icon: Icons.Heart, color: 'cat-wellness' },
];

export default function Sidebar({
    selectedCategories,
    onSelectCategory,
    onResetFilters,
    userType,
    onSelectUserType,
    selectedDistrict,
    onSelectDistrict,
    selectedYear,
    onSelectYear,
    facilityType,
    onSelectFacilityType,
    diagnosticianClass,
    onSelectDiagnosticianClass
}) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <span className="text-2xl font-black text-white tracking-tighter">
                        Kode<span className="text-primary italic">Korea</span>
                    </span>
                    <span className="logo-subtext">Busan Design Platform</span>
                </div>
            </div>

            <nav className="sidebar-nav custom-scrollbar">

                {/* 1. Global Filters */}
                <div className="nav-section">
                    <h3 className="nav-title">진단 설정 (Filters)</h3>

                    <div className="filter-group">
                        <label className="filter-label">연도 선택</label>
                        <div className="flex bg-slate-800 rounded p-1">
                            {['2024', '2025', '2026'].map(year => (
                                <button
                                    key={year}
                                    className={`flex-1 py-1 text-xs rounded transition-colors ${selectedYear === year ? 'bg-primary text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                                    onClick={() => onSelectYear(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">지역 선택</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => onSelectDistrict(e.target.value)}
                            className="styled-select"
                        >
                            <option value="all">부산시 전체</option>
                            <option value="21090">해운대구</option>
                            <option value="21050">부산진구</option>
                            <option value="21100">사하구</option>
                            <option value="21010">중구</option>
                            <option value="21020">서구</option>
                            <option value="21030">동구</option>
                            <option value="21040">영도구</option>
                            {/* Add more as needed */}
                        </select>
                    </div>

                    {/* New Filters */}
                    <div className="filter-group">
                        <label className="filter-label">시설물 종류</label>
                        <select
                            value={facilityType}
                            onChange={(e) => onSelectFacilityType(e.target.value)}
                            className="styled-select"
                        >
                            <option value="all">전체 시설물</option>
                            <option value="public">공공건축물</option>
                            <option value="street">가로시설물</option>
                            <option value="park">공원/녹지</option>
                            <option value="sign">안내표지판</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">진단인 분류</label>
                        <select
                            value={diagnosticianClass}
                            onChange={(e) => onSelectDiagnosticianClass(e.target.value)}
                            className="styled-select"
                        >
                            <option value="all">전체</option>
                            <option value="expert_A">전문가 그룹 A</option>
                            <option value="expert_B">전문가 그룹 B</option>
                            <option value="citizen">일반 시민단</option>
                            <option value="public_official">공무원</option>
                        </select>
                    </div>
                </div>

                <div className="nav-divider"></div>

                {/* 2. Category Grid */}
                <div className="nav-section">
                    <div className="flex items-center justify-between px-1 mb-2">
                        <h3 className="nav-title">진단 영역 (INTEGRATED)</h3>
                        <button
                            onClick={onResetFilters}
                            className="text-[10px] flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors"
                        >
                            {Icons.RotateCcw} 초기화
                        </button>
                    </div>

                    <div className="category-grid">
                        {menuItems.map(item => {
                            const isActive = selectedCategories.includes(item.id);
                            return (
                                <button
                                    key={item.id}
                                    className={`grid-item ${isActive ? 'active' : ''}`}
                                    onClick={() => onSelectCategory(item.id)}
                                    style={{
                                        '--item-color': `var(--${item.color})`
                                    }}
                                >
                                    <span className="item-icon">{item.icon}</span>
                                    <span className="item-label">{item.label}</span>
                                    {isActive && <div className="active-indicator"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="nav-divider"></div>

                {/* 3. User Type Filter */}
                <div className="nav-section">
                    <h3 className="nav-title">데이터 소스 (Source)</h3>
                    <div className="user-type-selector">
                        <button
                            className={`type-btn ${userType === 'all' ? 'active' : ''}`}
                            onClick={() => onSelectUserType('all')}
                        >
                            전체
                        </button>
                        <button
                            className={`type-btn ${userType === 'citizen' ? 'active' : ''}`}
                            onClick={() => onSelectUserType('citizen')}
                        >
                            시민
                        </button>
                        <button
                            className={`type-btn ${userType === 'expert' ? 'active' : ''}`}
                            onClick={() => onSelectUserType('expert')}
                        >
                            전문가
                        </button>
                    </div>
                </div>

            </nav>

            <div className="sidebar-footer">
                <div className="system-status">
                    <h4 className="status-title">시스템 상태</h4>
                    <div className="status-indicator">
                        <span className="dot green"></span>
                        <span className="text">정상 작동 중</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
