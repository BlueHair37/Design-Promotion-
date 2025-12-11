import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
// import { Lock, Mail, User } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        setIsLoading(true);

        try {
            const response = await api.post('/auth/signup', {
                email,
                password,
                username,
            });
            alert('회원가입 성공! 로그인해주세요.');
            navigate('/login');
        } catch (err) {
            console.error("Signup Error:", err);
            let msg = '회원가입 실패 (콘솔 확인 필요)';
            if (err.response) {
                if (err.response.data.detail) {
                    msg = typeof err.response.data.detail === 'string'
                        ? err.response.data.detail
                        : JSON.stringify(err.response.data.detail);
                }
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-rose-200/30 dark:bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-xl z-20 border border-slate-100 dark:border-slate-700 relative overflow-hidden"
            >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-rose-500"></div>

                <div className="text-center mb-8 pt-4">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">회원가입</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">새로운 계정을 생성하세요</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-300 text-sm font-semibold flex items-center justify-center text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    {/* Username Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Name</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-3.5 text-lg">👤</span>
                            <input
                                type="text"
                                placeholder="홍길동"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-3.5 text-lg">✉️</span>
                            <input
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-3.5 text-lg">🔒</span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-3.5 text-lg">🔒</span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 dark:shadow-purple-500/20 hover:shadow-purple-500/40 dark:hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? '가입 중...' : '가입하기'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    이미 계정이 있으신가요?{' '}
                    <Link to="/login" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-bold transition-colors">
                        로그인
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
