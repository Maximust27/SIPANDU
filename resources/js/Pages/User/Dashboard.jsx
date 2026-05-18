import React from 'react';
import { 
  Heart, 
  Activity, 
  Calendar, 
  Utensils, 
  AlertCircle, 
  Clock, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// --- CUSTOM CSS UNTUK ANIMASI DASHBOARD ---
const dashboardStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
    100% { transform: translateY(0px); }
  }
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -40px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  .animate-dash-float { animation: float 6s ease-in-out infinite; }
  .animate-dash-blob { animation: blob 8s infinite; }
  .animate-ai-pulse { animation: pulse-glow 3s infinite; }
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  .ai-gradient-text {
    background: linear-gradient(to right, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export default function Dashboard({ auth }) {
    // Data user asli dari Laravel backend
    const userName = auth?.user?.name || 'Bunda'; 

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="bg-violet-100 p-2 rounded-xl text-violet-600">
                        <LayoutDashboard size={22} />
                    </div>
                    <h2 className="text-xl font-bold leading-tight text-gray-900">
                        Dashboard Pemantauan
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />
            <style>{dashboardStyles}</style>

            <div className="p-4 sm:p-8 relative min-h-[calc(100vh-80px)] overflow-hidden">
                {/* Background Floating Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0"></div>
                <div className="absolute top-40 left-10 w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0" style={{ animationDelay: '2000ms' }}></div>

                <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                    
                    {/* Welcome Banner Card dengan Gradient */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-8 md:p-10 text-white shadow-xl shadow-violet-200/50">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-1/4 opacity-10 pointer-events-none">
                            <Heart size={320} fill="currentColor" />
                        </div>
                        <div className="relative z-10 max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-violet-50">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                                Layanan Digital Aktif
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                                Halo, {userName}! 👋
                            </h3>
                            <p className="text-violet-100 text-sm md:text-base leading-relaxed max-w-xl">
                                Selamat datang di ruang pemantauan Sipandu. Kami telah merangkum status kesehatan si kecil, pengingat penting, dan analisis cerdas untuk membantu tumbuh kembangnya.
                            </p>
                        </div>
                    </div>

                    {/* 3 Kartu Utama: Status, Jadwal, Reminder */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. Status Anak */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 transition-transform group-hover:scale-110 duration-300">
                                <Activity size={26} />
                            </div>
                            <div className="space-y-0.5 flex-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status Anak</p>
                                <div className="flex gap-3 items-baseline">
                                    <h4 className="text-lg font-bold text-gray-900">Sehat Normal</h4>
                                </div>
                                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Gizi Baik (BB: 12.4kg)
                                </p>
                            </div>
                        </div>

                        {/* 2. Jadwal Posyandu */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                            <div className="bg-violet-50 p-4 rounded-2xl text-violet-600 transition-transform group-hover:scale-110 duration-300">
                                <Calendar size={26} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jadwal Posyandu</p>
                                <h4 className="text-base font-bold text-gray-900">15 Juni 2026</h4>
                                <span className="text-xs font-semibold text-violet-700 bg-violet-100/50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 mt-1">
                                    <Clock size={12} /> 08:00 - Selesai
                                </span>
                            </div>
                        </div>

                        {/* 3. Reminder */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
                            <div className="bg-rose-50 p-4 rounded-2xl text-rose-500 transition-transform group-hover:scale-110 duration-300">
                                <AlertCircle size={26} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Reminder Penting</p>
                                <h4 className="text-base font-bold text-gray-900">Bawa Buku KIA!</h4>
                                <p className="text-xs text-gray-500 leading-tight mt-1 pr-2">
                                    Bulan ini jadwal Imunisasi DPT. Jangan lupa ya Bun!
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Main Grid Konten: Notifikasi AI & Rekomendasi/Edukasi */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                        
                        {/* Kolom Kiri (Span 2): Notifikasi AI Sipandu */}
                        <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-[2rem] shadow-sm space-y-6 relative overflow-hidden">
                            {/* Dekorasi Background AI */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200/30 to-pink-200/30 rounded-full mix-blend-multiply blur-3xl"></div>
                            
                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-2xl text-white shadow-lg shadow-violet-200/50 animate-dash-float">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            Analisis <span className="ai-gradient-text">AI Sipandu</span>
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-0.5">Berdasarkan rekam medis terakhir anak Anda</p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-full border border-violet-100">
                                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-ai-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-violet-700">
                                        Live Insight
                                    </span>
                                </div>
                            </div>

                            {/* List Notifikasi AI */}
                            <div className="space-y-4 relative z-10">
                                {/* Insight 1: Pertumbuhan */}
                                <div className="group flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300">
                                    <div className="shrink-0">
                                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <Stethoscope size={22} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-bold text-gray-800 text-base">Kurva Pertumbuhan Optimal</h5>
                                            <span className="text-xs text-gray-400">2 hari lalu</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Kenaikan berat badan sebesar <strong className="text-gray-900 font-semibold bg-gray-100 px-1.5 py-0.5 rounded">400 gram</strong> bulan ini sangat baik dan sesuai dengan kurva standar WHO. Pertahankan pola pemberian makan (MPASI) yang sudah berjalan.
                                        </p>
                                    </div>
                                </div>

                                {/* Insight 2: Peringatan/Saran AI */}
                                <div className="group flex flex-col sm:flex-row gap-4 p-5 bg-orange-50/50 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300">
                                    <div className="shrink-0">
                                        <div className="bg-orange-100 text-orange-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <ShieldCheck size={22} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-bold text-gray-800 text-base">Persiapan Sistem Imun</h5>
                                            <span className="text-xs text-orange-400 font-medium">Segera</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Berdasarkan jadwal, minggu depan adalah waktu imunisasi. Disarankan untuk memastikan anak cukup istirahat 2 hari sebelum jadwal untuk mengurangi risiko demam pasca-imunisasi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Rekomendasi Menu Gizi & Edukasi */}
                        <div className="flex flex-col gap-8">
                            
                            {/* Rekomendasi Gizi */}
                            <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] border border-white shadow-sm space-y-5 flex-1">
                                <div className="space-y-1 border-b border-gray-100 pb-4">
                                    <h4 className="text-lg font-bold text-gray-900">Rekomendasi Gizi</h4>
                                    <p className="text-xs text-gray-500">Saran asupan harian anak</p>
                                </div>

                                {/* Rekomendasi Makanan Box */}
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 p-5 rounded-2xl border border-orange-100/50 space-y-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                    <div className="absolute -top-6 -right-6 text-orange-200/40 pointer-events-none transition-transform group-hover:rotate-12 group-hover:scale-125 duration-500">
                                        <Utensils size={90} />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-10 h-10 bg-white text-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                                            <Utensils size={18} />
                                        </div>
                                        <h5 className="font-bold text-gray-900 text-sm pr-4">Puree Jagung Manis & Daging Ayam</h5>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                                        Kombinasi tinggi protein hewani dan karbohidrat yang pas untuk pembentukan sel saraf balita.
                                    </p>
                                    
                                    <button className="inline-flex items-center justify-center w-full gap-2 py-2.5 bg-white border border-orange-100 rounded-xl text-sm font-bold text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-colors relative z-10 group/btn">
                                        Lihat Resep Lengkap
                                        <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Catatan Kader */}
                            <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] border border-white shadow-sm space-y-4 flex-1">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pesan Kader</h5>
                                    <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-md">Bulan Ini</span>
                                </div>
                                
                                <div className="group p-5 bg-gray-50/80 rounded-2xl border border-gray-100/80 space-y-3 hover:bg-violet-50/50 hover:border-violet-100 transition-all cursor-pointer">
                                    <div className="flex items-center gap-2.5">
                                        <div className="relative flex h-3 w-3">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 group-hover:text-violet-700 transition-colors">Edukasi Motorik Halus</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Perbanyak stimulasi bermain balok atau menyusun puzzle sederhana untuk melatih motorik halus anak di usia 2 tahun.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}