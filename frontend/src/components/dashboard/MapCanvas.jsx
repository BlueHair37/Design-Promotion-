import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents, GeoJSON, Pane, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo, memo, useCallback } from 'react';
// import { Loader2 } from 'lucide-react';
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

// Region Focus Component (Moved outside to prevent re-creation on render)
const RegionFocus = ({ selectedCode, data }) => {
    const map = useMap();

    useEffect(() => {
        if (!data || !selectedCode) return;

        if (selectedCode === 'all') {
            map.flyTo(BUSAN_CENTER, 11);
            return;
        }

        const feature = data.features.find(f => f.properties.code === selectedCode);
        if (feature) {
            const tempLayer = L.geoJSON(feature);
            map.flyToBounds(tempLayer.getBounds(), { padding: [50, 50] });
        }
    }, [selectedCode, data, map]);

    return null;
};

// Mock Data Points (Moved outside to be stable)
const allMockData = [
    { id: 1, lat: 35.1578, lng: 129.0600, label: "시민 제보: 서면 교차로", type: "citizen", category: "transport", severity: "high" },
    { id: 2, lat: 35.1790, lng: 129.0750, label: "AI 감지: 시청 인근 보행 위험", type: "expert", category: "safety", severity: "medium" },
    { id: 3, lat: 35.1000, lng: 128.9600, label: "시민 제보: 사하구 쓰레기 투기", type: "citizen", category: "environment", severity: "high" },
    { id: 4, lat: 35.2100, lng: 129.0800, label: "전문가 진단: 동래구 문화시설 부족", type: "expert", category: "culture", severity: "low" },
    { id: 5, lat: 35.1600, lng: 129.1600, label: "시민 제보: 해운대 소음", type: "citizen", category: "environment", severity: "medium" },
];


// MapCanvas Component
const MapCanvas = memo(({ selectedCategories = [], userType = 'all', theme = 'light', selectedDistrict = 'all' }) => {
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

        // 지역 선택 시, 선택되지 않은 지역은 흐리게 처리
        const isSelected = selectedDistrict === feature.properties.code;
        const isAll = selectedDistrict === 'all';
        const isHovered = hoveredDistrict === feature.properties.code;

        let fillOpacity = isHovered ? 0.6 : 0.4;
        let strokeColor = isHovered ? '#3b82f6' : '#64748b'; // Hover: Blue, Default: Slate-500
        let weight = isHovered ? 3 : 1.5; // Thicker default weight

        if (!isAll) {
            if (isSelected) {
                fillOpacity = 0.2; // 선택된 지역 내부를 연하게 하여 데이터 포인트 강조
                strokeColor = '#2563eb'; // Blue-600
                weight = 3.5; // Very thick border for selected
            } else {
                fillOpacity = 0.1; // Dim others
                strokeColor = '#cbd5e1'; // Slate-300 for unselected
                weight = 1;
            }
        }

        return {
            fillColor: color,
            weight: weight,
            opacity: 1,
            color: strokeColor,
            dashArray: isSelected ? '' : (isAll ? '3' : ''), // Dashed for default view, solid for selected
            fillOpacity: fillOpacity
        };
    }, [hoveredDistrict, selectedDistrict]);

    // Interactions for GeoJSON
    const onEachDistrict = (feature, layer) => {
        layer.on({
            mouseover: () => setHoveredDistrict(feature.properties.code),
            mouseout: () => setHoveredDistrict(null),
            // click handled by parent state ideally, but here we just navigate visually
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
        if (!selectedDistrict || selectedDistrict === 'all' || !geoJsonData) return [];

        const feature = geoJsonData.features.find(f => f.properties.code === selectedDistrict);
        if (!feature) return [];

        // Calculate simple bounds from geometry coordinates
        let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

        const processCoords = (coords) => {
            coords.forEach(coord => {
                if (typeof coord[0] === 'number') { // [lng, lat] point
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

        // Generate ~100 random points within bounds to simulate heatmap
        const points = [];
        for (let i = 0; i < 120; i++) {
            points.push({
                id: `mock-dong-${i}`,
                lat: minLat + Math.random() * (maxLat - minLat),
                lng: minLng + Math.random() * (maxLng - minLng),
                value: Math.random() // Intensity
            });
        }
        return points;
    }, [selectedDistrict, geoJsonData]);

    // --------------------------------------------------------------------------------
    // Region Focus Component
    // --------------------------------------------------------------------------------
    const RegionFocus = ({ selectedCode, data }) => {
        const map = useMap();

        useEffect(() => {
            if (!data || !selectedCode) return;

            if (selectedCode === 'all') {
                map.flyTo(BUSAN_CENTER, 11);
                return;
            }

            const feature = data.features.find(f => f.properties.code === selectedCode);
            if (feature) {
                // GeoJSON layer creation just to get bounds is heavy, but let's manual calc logic above
                // Or simply create a temporary L.geoJSON to get bounds easily
                const tempLayer = L.geoJSON(feature);
                map.flyToBounds(tempLayer.getBounds(), { padding: [50, 50] });
            }
        }, [selectedCode, data, map]);

        return null;
    };


    return (
        <div className="w-full h-full relative z-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {isLoading && (
                <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">지도 데이터 로딩 중...</span>
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
                <RegionFocus selectedCode={selectedDistrict} data={geoJsonData} />

                {/* VWorld Street Map */}
                <TileLayer
                    attribution='&copy; VWorld'
                    url="https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png"
                    keepBuffer={4}
                    updateWhenIdle={false}
                    updateWhenZooming={false}
                    className={theme === 'dark' ? 'map-tiles-dark' : ''}
                />

                <style>{`
                    .map-tiles-dark {
                        filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                    }
                `}</style>

                {/* Choropleth Layer */}
                {!isLoading && geoJsonData &&
                    <GeoJSON
                        data={geoJsonData}
                        style={districtStyle}
                        onEachFeature={onEachDistrict}
                    />
                }

                {/* Mock Detail Heatmap Layer (Show only when a district is selected) */}
                <Pane name="detail-heatmap" style={{ zIndex: 450 }}>
                    {selectedDistrict !== 'all' && mockDetailPoints.map((pt, idx) => (
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
                                fillColor: data.severity === 'high' ? '#dc2626' : '#16a34a',
                                fillOpacity: 0.9,
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[150px]">
                                    <span className="font-bold text-slate-800 text-sm block mb-1">{data.label}</span>
                                    <div className="flex gap-2 text-xs text-slate-500">
                                        <span className="bg-slate-100 px-1 rounded">{data.type === 'citizen' ? '시민' : '전문가'}</span>
                                        <span className="bg-slate-100 px-1 rounded uppercase">{data.category}</span>
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
            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-300 dark:border-slate-600 p-3 rounded-lg z-[500] shadow-xl transition-colors duration-300">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 border-b dark:border-slate-600 pb-1 mb-1">
                        <span>지역 위험도 (히트맵)</span>
                    </div>
                    {selectedDistrict && selectedDistrict !== 'all' && (
                        <div className="flex items-center gap-2 text-xs text-rose-500 font-medium mb-1">
                            <span>* 상세 행정구역 분석 모드</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="w-4 h-4 rounded bg-red-500 opacity-60"></div><span>위험 (다수 신고)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="w-4 h-4 rounded bg-orange-500 opacity-60"></div><span>주의</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="w-4 h-4 rounded bg-green-500 opacity-60"></div><span>양호</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MapCanvas;
