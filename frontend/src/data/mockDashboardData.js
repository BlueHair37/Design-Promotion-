// import { AlertTriangle, Lightbulb, TrendingUp, Info } from 'lucide-react';

const DISTRICTS = [
    '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구',
    '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'
];

// Deterministic random number generator
const mulberry32 = (a) => {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Convert string to seed
const stringToSeed = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export const fetchAnalysisData = (year, district) => {
    // If district is 'all', return data for all districts
    if (district === 'all') {
        return DISTRICTS.map(d => {
            const seed = stringToSeed(`${year}-${d}`);
            const rand = mulberry32(seed);
            return {
                name: d,
                housing: Math.floor(rand() * 40) + 10,
                env: Math.floor(rand() * 40) + 10,
                transport: Math.floor(rand() * 40) + 10,
                safety: Math.floor(rand() * 40) + 10,
            };
        });
    } else {
        // If specific district is selected, maybe break it down by Dong?
        // For now, let's just return historical data or month-by-month for that district
        // To keep it compatible with the current chart which expects 'name' (x-axis), 
        // let's show breakdown by Category capability or Time (Months)
        // But AnalysisChart expects {name, housing, env...}
        // Let's return "Months" for single district view to show trend
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        return months.map(m => {
            const seed = stringToSeed(`${year}-${district}-${m}`);
            const rand = mulberry32(seed);
            return {
                name: m,
                housing: Math.floor(rand() * 20) + 5,
                env: Math.floor(rand() * 20) + 5,
                transport: Math.floor(rand() * 20) + 5,
                safety: Math.floor(rand() * 20) + 5,
            }
        });
    }
};

export const fetchScore = (year, district) => {
    const seed = stringToSeed(`${year}-${district}`);
    const rand = mulberry32(seed);
    const score = 60 + Math.floor(rand() * 40); // 60 ~ 100
    const prevScore = 60 + Math.floor(mulberry32(seed + 1)() * 40);
    const diff = (score - prevScore).toFixed(1);

    let grade = 'C';
    if (score >= 90) grade = 'S';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B';

    return {
        value: score,
        grade: grade,
        trend: diff > 0 ? `+${diff}% 대비` : `${diff}% 대비`
    };
};

// import { AlertTriangle, Lightbulb, TrendingUp, Info } from 'lucide-react';

export const fetchInsights = (year, district) => {
    const seed = stringToSeed(`${year}-${district}`);
    const rand = mulberry32(seed);

    const types = ['danger', 'warning', 'info'];
    // const icons = { danger: AlertTriangle, warning: AlertTriangle, info: Lightbulb };
    const colors = {
        danger: 'text-rose-500 dark:text-red-400',
        warning: 'text-orange-500 dark:text-orange-400',
        info: 'text-yellow-500 dark:text-yellow-400'
    };

    const districtName = district === 'all' ? '부산시 전체' : getDistrictName(district);

    const insights = [];
    const count = Math.floor(rand() * 3) + 2; // 2 to 4 insights

    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(rand() * types.length)];
        // Re-seed for randomness inside loop
        const innerRand = mulberry32(seed + i);

        insights.push({
            id: i,
            type: type,
            title: `[${type.toUpperCase()}] ${districtName}: 이슈 #${i + 1}`,
            desc: `${year}년 데이터 기반 분석 결과입니다.`,
            icon: type, // Return string ID instead of component
            color: colors[type]
        });
    }
    return insights;
};

export const fetchPersonas = (year, district) => {
    const seed = stringToSeed(`${year}-${district}-persona`);
    const rand = mulberry32(seed);

    const avatars = ['👵', '👨‍💼', '👩', '🧑‍🚒', '👮'];
    const names = ['김철수', '이영희', '박민수', '정수진', '최동훈'];
    const districtName = district === 'all' ? '부산' : getDistrictName(district);

    const feedbacks = [];
    for (let i = 0; i < 3; i++) {
        const innerRand = mulberry32(seed + i);
        feedbacks.push({
            id: i,
            name: `${districtName} 시민 ${names[Math.floor(innerRand() * names.length)]}`,
            text: `"${year}년 ${districtName}의 변화가 체감되네요. 의견 ${i + 1}입니다."`,
            avatar: avatars[Math.floor(innerRand() * avatars.length)]
        });
    }
    return feedbacks;
}

const getDistrictName = (code) => {
    // Simple helper to map code to name if code is passed, or just return code if it's name
    // Since mock logic handles strings mostly, we assume code might be passed.
    // Ideally use shared constant but for mock independent, let's map commonly used ones if needed.
    // For now, let's assume 'district' param is the CODE.
    const map = {
        '21310': '기장군', '21150': '사상구', '21140': '수영구', '21130': '연제구',
        '21120': '강서구', '21110': '금정구', '21100': '사하구', '21090': '해운대구',
        '21080': '북구', '21070': '남구', '21060': '동래구', '21050': '부산진구',
        '21040': '영도구', '21030': '동구', '21020': '서구', '21010': '중구'
    };
    return map[code] || code; // Fallback to code if not found or if it was already a name
}
