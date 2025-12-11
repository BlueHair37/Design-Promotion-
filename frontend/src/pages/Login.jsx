import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
// import { Lock, Mail } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });
            localStorage.setItem('access_token', response.data.access_token);
            if (response.data.username) {
                localStorage.setItem('username', response.data.username);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error("Login Error:", err);
            let msg = '로그인에 실패했습니다. (서버 연결 확인 필요)';
            if (err.response) {
                if (err.response.data.detail) {
                    msg = typeof err.response.data.detail === 'string'
                        ? err.response.data.detail
                        : JSON.stringify(err.response.data.detail);
                } else {
                    msg = `서버 오류: ${err.response.status}`;
                }
            } else if (err.request) {
                msg = '서버로부터 응답이 없습니다. 네트워크를 확인해주세요.';
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Background Effects */}
            <div className="auth-bg-effect">
                <div className="auth-blob-1"></div>
                <div className="auth-blob-2"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
            >
                {/* Top Accent Line */}
                <div className="auth-card-accent"></div>

                <div className="auth-header">
                    <h1 className="auth-title">
                        BDP Login
                    </h1>
                    <p className="auth-subtitle">지능형 공공디자인 통합 진단 플랫폼</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="auth-error"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label className="form-label text-slate-300">Email</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">✉️</span>
                            <input
                                type="email"
                                placeholder="example@busan.go.kr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label text-slate-300">Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="auth-button"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className="auth-footer">
                    계정이 없으신가요?{' '}
                    <Link to="/signup" className="auth-link">
                        회원가입
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
