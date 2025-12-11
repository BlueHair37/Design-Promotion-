import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
// import { LogOut, User, Sun, Moon, Loader2 } from 'lucide-react';

import Sidebar from '../components/Sidebar';
// Lazy load MapCanvas
const MapCanvas = lazy(() => import('../components/dashboard/MapCanvas'));
import FilterPanel from '../components/dashboard/FilterPanel';
import AnalysisChart from '../components/dashboard/AnalysisChart';
import AIInsightPanel from '../components/dashboard/AIInsightPanel';
import ScoreGauge from '../components/dashboard/ScoreGauge';
import AIChatPanel from '../components/dashboard/AIChatPanel';
import { DISTRICTS } from '../data/constants';
import { fetchAnalysisData, fetchScore, fetchInsights, fetchPersonas } from '../data/mockDashboardData';

export default function Dashboard() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [userType, setUserType] = useState('all');
    const [username, setUsername] = useState('User');
    const [theme, setTheme] = useState('light'); // Default to light
    const [selectedDistrict, setSelectedDistrict] = useState('all'); // Initialize selectedDistrict
    const [selectedYear, setSelectedYear] = useState('2026'); // Initialize selectedYear
    const navigate = useNavigate();

    // Load username
    useEffect(() => {
        const storedName = localStorage.getItem('username');
        if (storedName) {
            setUsername(storedName);
        }
    }, []);

    // Theme initialization and effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    // Toggle Category Selection
    const toggleCategory = useCallback((categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            }
            return [...prev, categoryId];
        });
    }, []);

    const resetFilters = useCallback(() => {
        setSelectedCategories([]);
        setUserType('all');
        setSelectedDistrict('all'); // Reset district
        setSelectedYear('2026'); // Reset year
    }, [setSelectedDistrict]);

    // Dashboard Data State
    const [dashboardData, setDashboardData] = useState({
        analysis: [],
        score: { value: 0, grade: '-', trend: '-' },
        insights: [],
        personas: []
    });

    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Fetch Data on Filter Change
    useEffect(() => {
        const analysis = fetchAnalysisData(selectedYear, selectedDistrict);
        const score = fetchScore(selectedYear, selectedDistrict);
        const insights = fetchInsights(selectedYear, selectedDistrict);
        const personas = fetchPersonas(selectedYear, selectedDistrict);

        setDashboardData({
            analysis,
            score,
            insights,
            personas
        });

        // AI Analysis Fetching
        const loadAIAnalysis = async () => {
            if (selectedDistrict === 'all') {
                setAiAnalysis(null);
                return;
            }

            setIsAiLoading(true);
            try {
                // Pass summary data for context
                const summaryContext = {
                    score: score.value,
                    grade: score.grade,
                    analysis: analysis.map(a => `${a.category}: ${a.value}`)
                };

                const { fetchAIAnalysis } = await import('../api');
                const result = await fetchAIAnalysis(selectedYear, selectedDistrict, summaryContext);
                setAiAnalysis(result.analysis);
            } catch (error) {
                console.error("Failed to fetch AI analysis", error);
                setAiAnalysis(`AI 분석 실패: ${error.response?.data?.detail || error.message}`);
            } finally {
                setIsAiLoading(false);
            }
        };

        // Debounce slightly to prevent rapid firing
        const timer = setTimeout(() => {
            loadAIAnalysis();
        }, 500);

        return () => clearTimeout(timer);

    }, [selectedYear, selectedDistrict, userType]);

    return (
        <div className={`dashboard-layout ${theme}`}>
            {/* Sidebar with New Filter Props */}
            <Sidebar
                selectedCategories={selectedCategories}
                onSelectCategory={toggleCategory}
                onResetFilters={resetFilters}
                userType={userType}
                onSelectUserType={setUserType}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                selectedYear={selectedYear}
                onSelectYear={setSelectedYear}
                // New Props
                facilityType={facilityType}
                onSelectFacilityType={setFacilityType}
                diagnosticianClass={diagnosticianClass}
                onSelectDiagnosticianClass={setDiagnosticianClass}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            {/* Main Content Area */}
            <main className="main-content">

                {/* Top Header Area */}
                <header className="dashboard-header">
                    <h1 className="header-title">
                        부산시 지능형 공공디자인 통합 진단 플랫폼 <span className="header-subtitle">(2026년 성과 전망)</span>
                    </h1>
                    <div className="header-controls">
                        {/* Theme Toggle (Slide Button style handled in CSS or Sidebar, redundant here if Sidebar has it, but let's keep it sync or remove) */}
                        {/* Removing text/emoji toggle here as per request to have "slide button" - assumed in Sidebar or Header.
                            Let's implement a nice Slide Toggle here. */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                            <button
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div className="user-profile">
                            {/* <User className="w-4 h-4" /> */}
                            <span>👤</span>
                            <span className="user-name">{username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                            style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {/* <LogOut className="w-4 h-4" /> 로그아웃 */}
                            <span>🚪</span> 로그아웃
                        </button>
                    </div>
                </header>

                <div className="dashboard-grid-container">
                    {/* Left Panel (Main Content: Map + Chart) */}
                    <div className="left-panel">
                        {/* Map Area */}
                        <div className="dashboard-card map-section">
                            <Suspense fallback={
                                <div className="map-loading-overlay">
                                    <div className="loading-content">
                                        <span className="loading-spinner">⏳</span>
                                        <span className="loading-text">지도 모듈 로딩 중...</span>
                                    </div>
                                </div>
                            }>
                                <MapCanvas
                                    selectedCategories={selectedCategories}
                                    userType={userType}
                                    theme={theme}
                                    selectedDistrict={selectedDistrict}
                                />
                            </Suspense>
                        </div>

                        {/* Bottom Chart Area */}
                        <div className="dashboard-card chart-section">
                            <AnalysisChart theme={theme} data={dashboardData.analysis} selectedDistrict={selectedDistrict} />
                        </div>
                    </div>

                    {/* Right Panel (Side Widgets: Score + Insights + Personas) */}
                    <div className="right-panel">
                        <div className="dashboard-card score-section">
                            <ScoreGauge score={dashboardData.score} />
                        </div>

                        {/* Combined AI Section for Insights & Chat/Personas */}
                        <div className="dashboard-card ai-section" style={{ flex: 1, overflow: 'hidden' }}>
                            <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                                <h3 className="text-sm font-bold text-slate-300">🤖 AI 우선순위 인사이트 및 권장사항</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                <AIInsightPanel
                                    insights={dashboardData.insights}
                                    aiAnalysis={aiAnalysis}
                                    isLoading={isAiLoading}
                                />
                            </div>
                        </div>

                        <div className="dashboard-card ai-section" style={{ flex: 1, marginTop: '0', minHeight: '300px' }}>
                            <AIChatPanel
                                context={{
                                    district: DISTRICTS.find(d => d.id === selectedDistrict)?.name || selectedDistrict,
                                    year: selectedYear,
                                    score: dashboardData.score,
                                    grade: dashboardData.score >= 80 ? 'A' : dashboardData.score >= 70 ? 'B' : 'C'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
