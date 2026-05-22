import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Utensils, 
  Activity, 
  Bot, 
  User, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

// --- CUSTOM CSS ---
const pageStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -40px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-dash-blob { animation: blob 8s infinite; }
  .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .chat-scrollbar::-webkit-scrollbar { width: 6px; }
  .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .chat-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  .chat-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
`;

export default function AIAssistant({ children = [], hasApiKey = false }) {
    // --- STATE CHAT ---
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Halo Bunda! Saya Dokter AI Sipandu. Ada yang bisa saya bantu terkait jadwal posyandu, resep MPASI, atau keluhan kesehatan si kecil hari ini? 😊' }
    ]);
    const [inputValue, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll chat ke paling bawah
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => scrollToBottom(), [messages, isTyping]);

    // Handler Kirim Pesan Chat ke Gemini API
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userText = inputValue.trim();
        const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
        const updatedMessages = [...messages, newUserMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Kirim riwayat chat + pesan baru ke backend
            const response = await axios.post(route('ai-assistant.chat'), {
                message: userText,
                history: updatedMessages.slice(1).map(m => ({ // skip pesan welcome
                    sender: m.sender,
                    text: m.text,
                })),
            });

            const aiReply = response.data.reply || 'Maaf, saya tidak dapat memproses permintaan saat ini.';
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiReply }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'ai', 
                text: 'Maaf, terjadi gangguan koneksi. Silakan coba kirim ulang pesan Anda.' 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="bg-fuchsia-100 p-2 rounded-xl text-fuchsia-600">
                        <Sparkles size={22} />
                    </div>
                    <h2 className="text-xl font-bold leading-tight text-gray-900">
                        AI Health Assistant
                    </h2>
                </div>
            }
        >
            <Head title="AI Health Assistant" />
            <style>{pageStyles}</style>

            <div className="p-4 sm:p-8 relative min-h-[calc(100vh-80px)] overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0"></div>
                <div className="absolute top-80 left-10 w-[400px] h-[400px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0" style={{ animationDelay: '2000ms' }}></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 pb-10">
                    
                    {/* === KOLOM KIRI: CHAT AI (Span 2) === */}
                    <div className="lg:col-span-2 flex flex-col h-[calc(100vh-140px)] glass-panel rounded-[2rem] shadow-sm overflow-hidden border border-white relative">
                        
                        {/* Header Chat */}
                        <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-violet-500 rounded-full flex items-center justify-center text-white shadow-md">
                                        <Bot size={24} />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">Dokter AI Sipandu</h3>
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                        <Sparkles size={12} className="text-fuchsia-500" /> 
                                        {hasApiKey ? 'Powered by Gemini AI' : 'Mode Offline'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Area Chat Messages */}
                        <div className="flex-1 overflow-y-auto chat-scrollbar p-6 space-y-6 bg-gradient-to-b from-transparent to-violet-50/20">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-down`}>
                                    <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                                            msg.sender === 'user' 
                                            ? 'bg-blue-100 text-blue-600' 
                                            : 'bg-gradient-to-br from-fuchsia-500 to-violet-500 text-white'
                                        }`}>
                                            {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                                        </div>

                                        {/* Bubble Chat */}
                                        <div className={`p-4 rounded-2xl text-sm md:text-base shadow-sm ${
                                            msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                                        }`}>
                                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start animate-slide-down">
                                    <div className="flex gap-3 max-w-[85%] flex-row">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm bg-gradient-to-br from-fuchsia-500 to-violet-500 text-white">
                                            <Bot size={18} />
                                        </div>
                                        <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Chat Area */}
                        <div className="bg-white/90 backdrop-blur-md p-4 md:p-6 border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Ketik pertanyaan Bunda di sini..."
                                    value={inputValue}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isTyping}
                                    className="flex-1 bg-gray-50 border border-gray-200 text-base rounded-full px-5 py-3.5 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all disabled:opacity-50"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!inputValue.trim() || isTyping}
                                    className="bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </form>
                            <p className="text-xs text-center text-gray-400 mt-3">
                                AI Sipandu dapat membuat kesalahan. Selalu konsultasikan kondisi medis serius ke fasilitas kesehatan terdekat.
                            </p>
                        </div>
                    </div>

                    {/* === KOLOM KANAN: FITUR AI (Span 1) === */}
                    <div className="flex flex-col gap-6">

                        {/* 1. REKOMENDASI NUTRISI WIDGET */}
                        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm border border-orange-100 relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 text-orange-200/40 pointer-events-none transition-transform group-hover:scale-125 duration-500">
                                <Utensils size={100} />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-5 relative z-10">
                                <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600">
                                    <Utensils size={20} />
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg">Gizi & Nutrisi AI</h4>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors cursor-pointer">
                                    <h5 className="text-sm font-bold text-gray-900 mb-1.5">Resep MPASI Penambah BB</h5>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Tanyakan resep MPASI ke Dokter AI! Cukup ketik "resep MPASI untuk usia X bulan" di chat.
                                    </p>
                                    <div className="mt-3 text-xs font-bold text-orange-600 flex items-center gap-1">
                                        Tanya di Chat <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. ANALISIS TUMBUH KEMBANG WIDGET */}
                        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm border border-emerald-100 relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 text-emerald-200/40 pointer-events-none transition-transform group-hover:scale-125 duration-500">
                                <Activity size={100} />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-5 relative z-10">
                                <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                                    <Activity size={20} />
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg">Data Anak Anda</h4>
                            </div>

                            <div className="relative z-10 space-y-4">
                                {children.length === 0 ? (
                                    <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                        <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Belum Ada Data</p>
                                            <p className="text-xs text-gray-600 mt-1">Daftarkan anak Anda terlebih dahulu di menu Anak & Pertumbuhan.</p>
                                        </div>
                                    </div>
                                ) : (
                                    children.map((child, idx) => (
                                        <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${
                                                child.statusGizi === 'Gizi Baik' ? 'text-emerald-500' : 'text-amber-500'
                                            }`} />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{child.name}</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {child.ageStr} • {child.gender}
                                                    {child.lastWeight ? ` • ${child.lastWeight} kg` : ''}
                                                    {child.lastHeight ? ` / ${child.lastHeight} cm` : ''}
                                                </p>
                                                {child.statusGizi && (
                                                    <p className={`text-xs mt-1 font-bold ${
                                                        child.statusGizi === 'Gizi Baik' ? 'text-emerald-600' : 'text-amber-600'
                                                    }`}>
                                                        {child.statusGizi}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}