import { useState, useRef, useEffect } from 'react';
import api from '../../api';
// Inline SVGs
const Icons = {
    Bot: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" /><path d="M19 11v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" /><path d="M12 11V7" /><rect width="16" height="4" x="4" y="15" rx="2" /><path d="M12 21v-2" /></svg>,
    Send: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>,
    Loader2: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
};

export default function AIChatPanel({ context }) {
    const [messages, setMessages] = useState([
        { role: 'system', content: `안녕하세요! ${context.district}의 공공디자인 안전 진단에 대해 궁금한 점을 물어보세요. (예: "현재 가장 위험한 요소가 뭐야?")` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Call Backend API
            const response = await api.post('/ai/chat', {
                message: input,
                context: context // Pass current dashboard context (district, score, etc.)
            });

            const botMsg = { role: 'assistant', content: response.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = { role: 'system', content: "죄송합니다. AI 서비스 연결에 문제가 발생했습니다." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700/50 bg-slate-800/30">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                        {Icons.Bot}
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-200">AI Safety Assistant</h3>
                        <p className="text-[10px] text-slate-400 leading-none">Powered by BDP-AI</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400">Online</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : msg.role === 'system'
                                ? 'bg-slate-700/50 text-slate-400 text-xs text-center w-full'
                                : 'bg-slate-700 text-slate-200 rounded-bl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-700/50 rounded-2xl rounded-bl-none px-3 py-2 flex items-center gap-2">
                            <span className="animate-spin text-slate-400">{Icons.Loader2}</span>
                            <span className="text-xs text-slate-400">분석 중...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        placeholder="안전 진단에 대해 물어보세요..."
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-full pl-4 pr-10 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${input.trim() && !isLoading ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                        disabled={!input.trim() || isLoading}
                    >
                        {Icons.Send}
                    </button>
                </form>
            </div>
        </div>
    );
}
