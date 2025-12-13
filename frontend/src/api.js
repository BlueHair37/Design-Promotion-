import axios from 'axios';

// Create Axios instance
const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    // baseURL is handled by Vite proxy
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            console.warn("LocalStorage access failed", e);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Dashboard Data APIs
export const fetchDashboardData = async (year, district) => {
    try {
        const response = await api.get('/api/dashboard/analysis', { params: { year, district } });
        return response.data;
    } catch (error) {
        console.error("Dashboard Data Failed:", error);
        return [];
    }
};

export const fetchScore = async (year, district) => {
    try {
        const response = await api.get('/api/dashboard/score', { params: { year, district } });
        return response.data;
    } catch (error) {
        console.error("Score Failed:", error);
        return { score: 0, grade: '-', trend: '-' };
    }
};

export const fetchInsights = async (year, district) => {
    try {
        const response = await api.get('/api/dashboard/insights', { params: { year, district } });
        return response.data;
    } catch (error) {
        console.error("Insights Failed:", error);
        return [];
    }
};

export const fetchPersonas = async (year, district) => {
    try {
        const response = await api.get('/api/dashboard/personas', { params: { year, district } });
        return response.data;
    } catch (error) {
        console.error("Personas Failed:", error);
        return [];
    }
};

export const fetchAIAnalysis = async (year, district, dataSummary) => {
    try {
        const response = await api.post('/ai/analyze', {
            year,
            district,
            data_summary: dataSummary
        });
        return response.data;
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        throw error;
    }
};

export const sendAIChat = async (message, history, context) => {
    try {
        const response = await api.post('/ai/chat', { message, history, context });
        if (response.data && response.data.response) {
            return { response: response.data.response };
        }
        return response.data;
    } catch (error) {
        console.error("AI Chat Failed:", error);
        return { response: "죄송합니다. 서버 연결에 실패했습니다." };
    }
};

export default api;
