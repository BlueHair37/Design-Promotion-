import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Pane, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import L from 'leaflet';

// 부산 중심 좌표
const BUSAN_CENTER = [35.1795543, 129.0756416];

// 지도 컨트롤러 (크기 변경 감지 및 리렌더링)
function MapController() {
    const map = useMap();

    useEffect(() => {
        // 초기 로드 시 리사이즈
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // ResizeObserver로 컨테이너 크기 변경 감지
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });

        resizeObserver.observe(map.getContainer());

        return () => {
            clearTimeout(timer);
            resizeObserver.disconnect();
        };
    }, [map]);

    return null;
}

// 전체화면 버튼 (오른쪽으로 이동)
function FullscreenControl() {
    const map = useMap();
    const handleFullscreen = () => {
        const mapContainer = map.getContainer();
        if (!document.fullscreenElement) {
            mapContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="leaflet-top leaflet-right mt-2 mr-2">
            <div className="leaflet-control leaflet-bar">
                <a role="button" title="전체화면" href="#" onClick={(e) => { e.preventDefault(); handleFullscreen(); }} className="flex items-center justify-center bg-white text-black w-8 h-8 font-bold text-lg hover:bg-gray-100 cursor-pointer">
                    ⛶
                </a>
            </div>
        </div>
    );
}

// 줌 초기화 버튼
function ResetViewControl() {
    const map = useMap();
    const handleReset = () => {
        map.setView(BUSAN_CENTER, 11);
    };

    return (
        <div className="leaflet-top leaflet-right mt-12 mr-2">
            <div className="leaflet-control leaflet-bar">
                <a role="button" title="시점 초기화" href="#" onClick={(e) => { e.preventDefault(); handleReset(); }} className="flex items-center justify-center bg-white text-black w-8 h-8 font-bold text-lg hover:bg-gray-100 cursor-pointer">
                    ⟲
                </a>
            </div>
        </div>
    );
}


// Mock Data Points (Detailed Rich Data)
// Adding images, proposers, dates for richer popups
const allMockData = [
    { id: 1, lat: 35.1578, lng: 129.0600, label: "서면 교차로 무단횡단 다발지역", type: "citizen", category: "transport", severity: "high", proposer: "김철수", proposerRole: "모범운전자", date: "2025.12.10", image: "https://picsum.photos/seed/1/300/200" },
    { id: 2, lat: 35.1790, lng: 129.0750, label: "시청 인근 보도블럭 파손", type: "expert", category: "safety", severity: "medium", proposer: "AI 감지 시스템", proposerRole: "BDP-AI", date: "2025.12.11", image: "https://picsum.photos/seed/2/300/200" },
    { id: 3, lat: 35.1000, lng: 128.9600, label: "쓰레기 무단 투기 집중 신고", type: "citizen", category: "environment", severity: "high", proposer: "박영자", proposerRole: "통장", date: "2025.12.09", image: "https://picsum.photos/seed/3/300/200" },
    { id: 4, lat: 35.2100, lng: 129.0800, label: "동래구 쉼터 부족/벤치 파손", type: "expert", category: "culture", severity: "low", proposer: "이민수", proposerRole: "도시재생센터", date: "2025.12.05", image: "https://picsum.photos/seed/4/300/200" },
    { id: 5, lat: 35.1600, lng: 129.1600, label: "해운대 해수욕장 소음 민원", type: "citizen", category: "environment", severity: "medium", proposer: "최지민", proposerRole: "대학생", date: "2025.12.08", image: "https://picsum.photos/seed/5/300/200" },
    { id: 6, lat: 35.1900, lng: 129.1100, label: "연산 교차로 상습 정체 개선", type: "citizen", category: "transport", severity: "medium", proposer: "정우성", proposerRole: "택시기사", date: "2025.12.11", image: "https://picsum.photos/seed/6/300/200" },
    { id: 7, lat: 35.1200, lng: 129.0400, label: "남항대교 진입로 강풍 위험", type: "expert", category: "safety", severity: "high", proposer: "AI 감지 시스템", proposerRole: "Weather-AI", date: "2025.12.12", image: "https://picsum.photos/seed/7/300/200" },
    { id: 8, lat: 35.2300, lng: 129.0100, label: "금정산 등산로 미끄럼 사고", type: "expert", category: "environment", severity: "low", proposer: "산림청", proposerRole: "안전팀", date: "2025.12.01", image: "https://picsum.photos/seed/8/300/200" },
    { id: 9, lat: 35.1500, lng: 129.1300, label: "광안리 해변 플라스틱 쓰레기", type: "citizen", category: "environment", severity: "high", proposer: "GreenBusan", proposerRole: "환경단체", date: "2025.12.07", image: "https://picsum.photos/seed/9/300/200" },
    { id: 10, lat: 35.2500, lng: 129.2000, label: "기장군 해안도로 노면 파손", type: "expert", category: "safety", severity: "medium", proposer: "도로교통공단", proposerRole: "시설팀", date: "2025.12.10", image: "https://picsum.photos/seed/10/300/200" },
    { id: 11, lat: 35.0800, lng: 129.0300, label: "영도구 흰여울길 난간 노후", type: "citizen", category: "safety", severity: "high", proposer: "강현우", proposerRole: "주민자치회", date: "2025.12.09", image: "https://picsum.photos/seed/11/300/200" },
    { id: 12, lat: 35.1400, lng: 129.0000, label: "구덕터널 내부 환기 불량", type: "expert", category: "environment", severity: "medium", proposer: "환경공단", proposerRole: "대기질관리", date: "2025.12.11", image: "https://picsum.photos/seed/12/300/200" },
    { id: 13, lat: 35.2000, lng: 129.0600, label: "사직구장 경기 시 소음/주차난", type: "citizen", category: "culture", severity: "low", proposer: "김민재", proposerRole: "야구팬", date: "2025.12.03", image: "https://picsum.photos/seed/13/300/200" },
    { id: 14, lat: 35.1100, lng: 128.9800, label: "감천문화마을 급경사 미끄럼", type: "expert", category: "safety", severity: "high", proposer: "AI 감지 시스템", proposerRole: "Vision-AI", date: "2025.12.12", image: "https://picsum.photos/seed/14/300/200" },
    { id: 15, lat: 35.1700, lng: 128.9500, label: "엄궁동 공장 지대 악취 신고", type: "citizen", category: "environment", severity: "high", proposer: "이수진", proposerRole: "부녀회장", date: "2025.12.10", image: "https://picsum.photos/seed/15/300/200" }
];


// MapCanvas Component
const MapCanvas = memo(({ selectedCategories = [], userType = 'all', selectedDistricts = [] }) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [viewState, setViewState] = useState({ center: BUSAN_CENTER, zoom: 11 }); // eslint-disable-line no-unused-vars
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch('/busan_districts_high.json')
            .then(res => res.json())
            .then(data => {
                setGeoJsonData(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load GeoJSON:", err);
                setIsLoading(false);
            });
    }, []);

    // 구별 위험도(핑 개수) 모의 데이터
    const getSeverityColor = (code) => {
        const dangerZones = ['21050', '21100', '21150']; // 부산진구, 사하구, 사상구
        const safeZones = ['21120', '21310']; // 강서구, 기장군
        if (dangerZones.includes(code)) return '#ef4444'; // Red
        if (safeZones.includes(code)) return '#22c5e0'; // Green
        return '#f59e0b'; // Orange
    };

    const getSeverity = (districtCode) => {
        const dangerZones = ['21050', '21100', '21150'];
        const safeZones = ['21120', '21310'];
        if (dangerZones.includes(districtCode)) return '높음';
        if (safeZones.includes(districtCode)) return '낮음';
        return '보통';
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        const categoriesToShow = selectedCategories.length === 0
            ? ['housing', 'environment', 'transport', 'safety', 'culture']
            : selectedCategories;
        return allMockData.filter(point => categoriesToShow.includes(point.category) && (userType === 'all' || point.type === userType));
    }, [selectedCategories, userType]);

    // Style for GeoJSON
    const districtStyle = useCallback((feature) => {
        const severity = getSeverity(feature.properties.code);
        const color = getSeverityColor(feature.properties.code);

        // Check if any districts are selected
        const hasSelection = selectedDistricts && selectedDistricts.length > 0;
        const isSelected = hasSelection && selectedDistricts.includes(feature.properties.code);
        const isHovered = hoveredDistrict === feature.properties.code;

        let fillOpacity = isHovered ? 0.6 : 0.4;
        let strokeColor = isHovered ? '#3b82f6' : '#64748b'; // Hover: Blue, Default: Slate-500
        let weight = isHovered ? 3 : 1.5;

        // If specific districts selected
        if (hasSelection) {
            if (isSelected) {
                fillOpacity = 0.2; // Highlight selected
                strokeColor = '#2563eb'; // Blue-600
                weight = 3.5;
            } else {
                fillOpacity = 0.1; // Dim unselected
                strokeColor = '#cbd5e1'; // Slate-300
                weight = 1;
            }
        }

        return {
            fillColor: color,
            weight: weight,
            opacity: 1,
            color: strokeColor,
            dashArray: isSelected ? '' : (hasSelection ? '3' : ''),
            fillOpacity: fillOpacity
        };
    }, [hoveredDistrict, selectedDistricts]);

    // Interactions for GeoJSON
    const onEachDistrict = (feature, layer) => {
        layer.on({
            mouseover: () => setHoveredDistrict(feature.properties.code),
            mouseout: () => setHoveredDistrict(null),
        });
        layer.bindTooltip(
            `<div><strong>${feature.properties.name}</strong><br/>위험도: ${getSeverity(feature.properties.code)}</div>`,
            { sticky: true, direction: "center", className: "custom-tooltip" }
        );
    };

    // --------------------------------------------------------------------------------
    // Detail Visualization Logic (Mock Heatmap for Dongs)
    // --------------------------------------------------------------------------------
    const mockDetailPoints = useMemo(() => {
        if (!selectedDistricts || selectedDistricts.length === 0 || !geoJsonData) return [];

        let allPoints = [];

        selectedDistricts.forEach(code => {
            const feature = geoJsonData.features.find(f => f.properties.code === code);
            if (!feature) return;

            // Calculate simple bounds from geometry
            let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
            const processCoords = (coords) => {
                coords.forEach(coord => {
                    if (typeof coord[0] === 'number') {
                        const [lng, lat] = coord;
                        if (lat < minLat) minLat = lat;
                        if (lat > maxLat) maxLat = lat;
                        if (lng < minLng) minLng = lng;
                        if (lng > maxLng) maxLng = lng;
                    } else {
                        processCoords(coord);
                    }
                });
            };
            processCoords(feature.geometry.coordinates);

            // Generate random points for this district
            for (let i = 0; i < 50; i++) {
                allPoints.push({
                    id: `mock-dong-${code}-${i}`,
                    lat: minLat + Math.random() * (maxLat - minLat),
                    lng: minLng + Math.random() * (maxLng - minLng),
                    value: Math.random()
                });
            }
        });

        return allPoints;
    }, [selectedDistricts, geoJsonData]);

    // --------------------------------------------------------------------------------
    // Region Focus Component
    // --------------------------------------------------------------------------------
    const RegionFocus = ({ selectedCodes, data }) => {
        const map = useMap();

        useEffect(() => {
            if (!data || !selectedCodes) return;

            if (selectedCodes.length === 0) {
                map.flyTo(BUSAN_CENTER, 11);
                return;
            }

            const features = data.features.filter(f => selectedCodes.includes(f.properties.code));

            if (features.length > 0) {
                // Create a temporary FeatureGroup to get bounds of all selected features
                const group = L.featureGroup(features.map(f => L.geoJSON(f)));
                try {
                    map.flyToBounds(group.getBounds(), { padding: [50, 50] });
                } catch (e) {
                    // Fallback to center if bounds calc fails
                    console.warn("Bounds calc failed, resetting view");
                    map.setView(BUSAN_CENTER, 11);
                }
            }
        }, [selectedCodes, data, map]);

        return null;
    };


    return (
        <div className="w-full h-full relative z-0 bg-slate-50 transition-colors duration-300">
            {isLoading && (
                <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-sm font-bold text-slate-600">지도 데이터 로딩 중...</span>
                    </div>
                </div>
            )}

            <MapContainer
                center={BUSAN_CENTER}
                zoom={11}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", background: "transparent" }}
                zoomControl={false}
                preferCanvas={true}
            >
                <MapController />
                <RegionFocus selectedCodes={selectedDistricts} data={geoJsonData} />

                {/* VWorld Street Map */}
                <TileLayer
                    attribution='&copy; VWorld'
                    url="https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png"
                    keepBuffer={4}
                    updateWhenIdle={false}
                    updateWhenZooming={false}
                />

                {/* Choropleth Layer */}
                {!isLoading && geoJsonData &&
                    <GeoJSON
                        data={geoJsonData}
                        style={districtStyle}
                        onEachFeature={onEachDistrict}
                    />
                }

                {/* Mock Detail Heatmap Layer (Show when districts are selected) */}
                <Pane name="detail-heatmap" style={{ zIndex: 450 }}>
                    {selectedDistricts.length > 0 && mockDetailPoints.map((pt, idx) => (
                        <CircleMarker
                            key={pt.id}
                            center={[pt.lat, pt.lng]}
                            radius={4 + (pt.value * 6)} // Random size
                            pathOptions={{
                                stroke: false,
                                fillColor: pt.value > 0.7 ? '#dc2626' : (pt.value > 0.4 ? '#f59e0b' : '#10b981'),
                                fillOpacity: 0.6
                            }}
                        />
                    ))}
                </Pane>

                {/* Custom High Z-Index Pane for Popups to avoid overlapping */}
                <Pane name="custom-popup-pane" style={{ zIndex: 1000 }} />

                {/* Data Points - Using Pane to bring them to front (z-index 500 > overlay 400) */}
                <Pane name="top-markers" style={{ zIndex: 500 }}>
                    {filteredData.map((data) => (
                        <CircleMarker
                            key={data.id}
                            center={[data.lat, data.lng]}
                            radius={data.severity === 'high' ? 12 : 8}
                            pathOptions={{
                                color: 'white',
                                weight: 2,
                                fillOpacity: 0.9,
                                fillColor: data.severity === 'high' ? '#dc2626' : (data.severity === 'medium' ? '#f59e0b' : '#3b82f6')
                            }}
                        >
                            {/* Improved Rich Popup with explicit Pane */}
                            <Popup className="custom-popup" offset={[0, -10]} closeButton={false} pane="custom-popup-pane">
                                <div className="min-w-[240px] max-w-[280px] overflow-hidden rounded-lg font-sans">
                                    {/* Image Section */}
                                    <div className="h-32 w-full relative bg-slate-100">
                                        <img src={data.image} alt="현장 사진" className="w-full h-full object-cover" loading="lazy" />
                                        <div className="absolute top-2 left-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm uppercase tracking-wide ${data.severity === 'high' ? 'bg-red-500' : (data.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500')
                                                }`}>
                                                {data.severity === 'high' ? '위험' : (data.severity === 'medium' ? '주의' : '양호')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4 bg-white">
                                        <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{data.label}</h4>
                                        <p className="text-[11px] text-slate-500 mb-3">{data.category.toUpperCase()} 이슈</p>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-lg border border-slate-100 ring-2 ring-white shadow-sm">
                                                    {data.type === 'expert' ? '🤖' : '🧑'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-800">{data.proposer}</span>
                                                    <span className="text-[10px] text-slate-400">{data.proposerRole}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-slate-400">등록일</span>
                                                <span className="text-[10px] text-slate-600 font-medium">{data.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </Pane>

                <FullscreenControl />
                <ResetViewControl />
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-slate-300 p-3 rounded-lg z-[500] shadow-xl transition-colors duration-300">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 border-b border-slate-200 pb-1 mb-1">
                        <span>지역 위험도 (히트맵)</span>
                    </div>
                    {selectedDistricts && selectedDistricts.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-rose-500 font-medium mb-1">
                            <span>* 선정 지역 상세 분석 중</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-4 h-4 rounded bg-red-500 opacity-60"></div><span>위험 (다수 신고)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-4 h-4 rounded bg-orange-500 opacity-60"></div><span>주의</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-4 h-4 rounded bg-green-500 opacity-60"></div><span>양호</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MapCanvas;
