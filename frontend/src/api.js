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

export const fetchAIAnalysis = async (year, district, dataSummary) => {
    try {
        const response = await api.post('/api/ai/analyze', {
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
        const response = await api.post('/api/ai/chat', { message, history, context });
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
