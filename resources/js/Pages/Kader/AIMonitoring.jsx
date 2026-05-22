import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Map, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Activity,
  Utensils,
  Lightbulb,
  Loader2
} from 'lucide-react';

import { Head } from '@inertiajs/react';
import KaderLayout from '@/Layouts/KaderLayout';
import axios from 'axios';

export default function AIMonitoring({ riskyChildren = [], normalChildren = [], noDataChildren = [], regionStats = [], summary = { total: 0, risiko: 0, normal: 0, belumData: 0 }, hasApiKey = false }) {
    const [toastMsg, setToastMsg] = useState(null);

    // State untuk loading & hasil analisis AI per anak
    const [aiResults, setAiResults] = useState({});
    const [aiLoading, setAiLoading] = useState({});

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    // Handler: Minta analisis AI untuk satu anak
    const handleAnalyzeChild = async (childId) => {
        setAiLoading(prev => ({ ...prev, [childId]: true }));

        try {
            const response = await axios.post(route('kader.ai-monitoring.analyze', { childId }));
            setAiResults(prev => ({
                ...prev,
                [childId]: {
                    detection: response.data.aiDetection,
                    recommendation: response.data.aiRecommendation,
                    source: response.data.source,
                }
            }));
            showToast(
                response.data.source === 'gemini' 
                    ? '✨ Analisis AI Gemini berhasil dimuat!' 
                    : response.data.source?.includes('kuota')
                        ? '⚠️ Kuota API Gemini habis. Menampilkan analisis rule-based.'
                        : 'Analisis rule-based dimuat. Tambahkan API Key Gemini untuk hasil AI.'
            );
        } catch (error) {
            console.error('Analyze error:', error);
            showToast('Gagal memuat analisis AI. Silakan coba lagi.');
        } finally {
            setAiLoading(prev => ({ ...prev, [childId]: false }));
        }
    };

    return (
        <KaderLayout 
            headerTitle="AI Monitoring & Analitik" 
            headerIcon={<BrainCircuit size={22} />}
        >
            <Head title="AI Monitoring - Sipandu" />

            {toastMsg && (
                <div className="fixed bottom-6 right-6 z-50 p-4 bg-gray-900 text-white rounded-2xl flex items-center gap-3 text-sm font-bold shadow-2xl animate-slide-down border border-gray-700">
                    <Sparkles size={18} className="text-fuchsia-400" />
                    {toastMsg}
                </div>
            )}

            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                
                {/* === BANNER UTAMA AI === */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[2rem] p-8 md:p-10 text-white shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-0 right-40 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
                    
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-fuchsia-200 border border-white/20">
                            <Sparkles size={14} /> {hasApiKey ? 'Sipandu AI — Powered by Gemini' : 'Sipandu AI — Mode Offline'}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                            Pemantauan Cerdas Berbasis AI
                        </h3>
                        <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
                            Sistem menganalisis anomali pertumbuhan, mendeteksi risiko stunting lebih awal, dan memetakan persebaran gizi buruk di wilayah kerja Anda. Klik tombol "Analisis dengan AI" untuk mendapatkan insight mendalam per anak.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    
                    {/* === SISI KIRI: ANALITIK WILAYAH === */}
                    <div className="lg:col-span-1 space-y-6 lg:space-y-8">

                        {/* ANALITIK WILAYAH */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                                <Map size={20} className="text-blue-600" /> Analitik Wilayah (Live)
                            </h4>
                            <p className="text-xs text-gray-500 mb-6">Tren kasus berisiko stunting per RT/RW bulan ini.</p>

                            <div className="space-y-5">
                                {regionStats.map((stat, idx) => {
                                    const totalVal = stat.tinggi + stat.sedang + stat.normal;
                                    const tinggiPct = totalVal > 0 ? (stat.tinggi / totalVal) * 100 : 0;
                                    const sedangPct = totalVal > 0 ? (stat.sedang / totalVal) * 100 : 0;
                                    const normalPct = totalVal > 0 ? (stat.normal / totalVal) * 100 : 0;
                                    return (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                                                <span>{stat.rt}</span>
                                                <span className={`text-${stat.color}-600 bg-${stat.color}-50 px-2 py-0.5 rounded-md`}>
                                                    {stat.tinggi} Risiko Tinggi
                                                </span>
                                            </div>
                                            
                                            {/* Progress Bar Kombinasi */}
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                                                <div 
                                                    className={`h-full bg-${stat.color}-500`} 
                                                    style={{ width: `${tinggiPct}%` }}
                                                    title="Risiko Tinggi"
                                                ></div>
                                                <div 
                                                    className="h-full bg-amber-400" 
                                                    style={{ width: `${sedangPct}%` }}
                                                    title="Risiko Sedang"
                                                ></div>
                                                <div 
                                                    className="h-full bg-emerald-400" 
                                                    style={{ width: `${normalPct}%` }}
                                                    title="Normal"
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                                <span>Normal: {stat.normal}</span>
                                                <span>Waspada: {stat.sedang}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RINGKASAN STATISTIK */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <Activity size={20} className="text-emerald-600" /> Ringkasan Data
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-gray-900">{summary.total}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Total Balita</p>
                                </div>
                                <div className="bg-rose-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-rose-600">{summary.risiko}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Berisiko</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-emerald-600">{summary.normal}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Normal</p>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-amber-600">{summary.belumData}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Belum Data</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* === SISI KANAN: DETEKSI & REKOMENDASI (SPAN 2) === */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <AlertTriangle size={24} className="text-amber-500" /> 
                                    Prioritas Penanganan AI
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Balita yang membutuhkan intervensi segera berdasarkan data pertumbuhan.</p>
                            </div>
                            <div className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-100">
                                {riskyChildren.length} Kasus Ditemukan
                            </div>
                        </div>

                        <div className="space-y-6">
                            {riskyChildren.length === 0 ? (
                                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 text-center text-gray-500 font-medium">
                                    Tidak ada balita berisiko stunting atau gizi bermasalah yang terdeteksi di wilayah ini.
                                </div>
                            ) : (
                                riskyChildren.map((child) => {
                                    const result = aiResults[child.id];
                                    const loading = aiLoading[child.id];

                                    return (
                                        <div key={child.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                            
                                            {/* Header Card Anak */}
                                            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-white shadow-inner flex items-center justify-center font-black text-xl text-gray-600">
                                                        {child.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-gray-900">{child.name}</h4>
                                                        <p className="text-xs text-gray-500 font-medium">{child.ageStr} • {child.region}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-center">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">BB Terakhir</p>
                                                        <p className="text-sm font-black text-gray-800">{child.lastWeight} kg</p>
                                                    </div>
                                                    <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-center">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">TB Terakhir</p>
                                                        <p className="text-sm font-black text-gray-800">{child.lastHeight} cm</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-50 flex items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                                    child.riskLevel === 'Tinggi' ? 'bg-rose-600 text-white' : 'bg-orange-500 text-white'
                                                }`}>
                                                    Risiko {child.riskLevel}
                                                </span>
                                                {child.statusGizi && (
                                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                        {child.statusGizi}
                                                    </span>
                                                )}
                                                {child.statusTinggi && (
                                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                        {child.statusTinggi}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Tombol Analisis AI atau Hasil Analisis */}
                                            {!result && !loading && (
                                                <div className="p-6">
                                                    <button
                                                        onClick={() => handleAnalyzeChild(child.id)}
                                                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                                                    >
                                                        <Sparkles size={18} className="group-hover:scale-110 transition-transform" />
                                                        Analisis dengan AI
                                                    </button>
                                                </div>
                                            )}

                                            {/* Loading State */}
                                            {loading && (
                                                <div className="p-6 flex flex-col items-center justify-center gap-3">
                                                    <Loader2 size={32} className="text-indigo-500 animate-spin" />
                                                    <p className="text-sm font-bold text-gray-500 animate-pulse">AI sedang menganalisis data anak...</p>
                                                </div>
                                            )}

                                            {/* Hasil Analisis AI */}
                                            {result && !loading && (
                                                <>
                                                    {/* Deteksi AI */}
                                                    <div className={`p-6 border-b ${child.riskLevel === 'Tinggi' ? 'bg-rose-50/30 border-rose-50' : 'bg-orange-50/30 border-orange-50'}`}>
                                                        <div className="flex items-start gap-3">
                                                            <div className={`mt-0.5 p-1.5 rounded-full ${child.riskLevel === 'Tinggi' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}`}>
                                                                <TrendingDown size={16} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h5 className="text-sm font-bold text-gray-900">Analisis Perkembangan</h5>
                                                                    {result.source === 'gemini' && (
                                                                        <span className="text-[10px] font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded-md border border-fuchsia-100">
                                                                            Gemini AI
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                                    {result.detection}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Rekomendasi Penanganan AI */}
                                                    <div className="p-6 bg-indigo-50/30">
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5 p-1.5 bg-indigo-100 text-indigo-600 rounded-full">
                                                                <Lightbulb size={16} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="text-sm font-bold text-gray-900 mb-1">Rekomendasi Penanganan</h5>
                                                                <p className="text-sm text-indigo-900/80 leading-relaxed mb-4 whitespace-pre-wrap">
                                                                    {result.recommendation}
                                                                </p>
                                                                
                                                                <div className="flex flex-wrap gap-2">
                                                                    <button 
                                                                        onClick={() => handleAnalyzeChild(child.id)}
                                                                        className="text-xs font-bold bg-white border border-indigo-100 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
                                                                    >
                                                                        <Sparkles size={14} /> Analisis Ulang
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                        </div>
                                    );
                                })
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </KaderLayout>
    );
}