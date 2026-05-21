import React, { useState } from 'react';
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
  LayoutDashboard,
  Baby
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

export default function Dashboard({ auth, dataAnak = [], next_schedule = null, articles = [], activeQueue = null }) {
    // Data user asli dari Laravel backend
    const userName = auth?.user?.name || 'Bunda'; 

    // State untuk memilih anak yang aktif ditampilkan data & analisanya
    const [selectedChildId, setSelectedChildId] = useState(dataAnak[0]?.id || null);
    const selectedChild = dataAnak.find(c => c.id === selectedChildId) || dataAnak[0];

    // Menentukan menu resep berdasarkan status gizi anak
    const getNutritionalRecipe = (child) => {
        if (!child) return {
            title: "Menu Gizi Seimbang",
            dish: "Puree Alpukat & Pisang Halus",
            desc: "Pilihan terbaik kaya lemak baik dan vitamin untuk perkembangan motorik anak usia dini."
        };

        const statusLower = child.status_tinggi?.toLowerCase() || '';
        const giziLower = child.status?.toLowerCase() || '';

        if (statusLower.includes('stunted') || statusLower.includes('pendek')) {
            return {
                title: "Menu Kejar Tinggi Badan (Stunting)",
                dish: "Nasi Tim Hati Ayam & Kuning Telur",
                desc: "Asupan padat protein hewani, zinc, dan zat besi untuk merangsang sel pertumbuhan tulang anak."
            };
        } else if (giziLower.includes('buruk') || giziLower.includes('kurang')) {
            return {
                title: "Menu Booster Berat Badan",
                dish: "Sop Udang Brokoli & Kentang Puree Mentega",
                desc: "Sajian berkalori tinggi dengan lemak sehat dan protein lengkap untuk menaikkan berat badan balita."
            };
        } else {
            return {
                title: "Menu Pertumbuhan Optimal",
                dish: "Puree Jagung Manis & Fillet Dada Ayam",
                desc: "Kombinasi tinggi karbohidrat kompleks dan protein tanpa lemak yang pas untuk energi harian anak."
            };
        }
    };

    const recipe = getNutritionalRecipe(selectedChild);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="bg-violet-100 p-2 rounded-xl text-violet-600">
                            <LayoutDashboard size={22} />
                        </div>
                        <h2 className="text-xl font-bold leading-tight text-gray-900">
                            Dashboard Pemantauan
                        </h2>
                    </div>

                    {/* Dropdown Pemilihan Balita jika Balita > 1 */}
                    {dataAnak.length > 1 && (
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm self-start sm:self-auto">
                            <span className="text-xs font-bold text-gray-400 uppercase">Anak:</span>
                            <select 
                                value={selectedChildId || ''} 
                                onChange={(e) => setSelectedChildId(Number(e.target.value))}
                                className="text-xs font-bold text-gray-700 bg-transparent border-none p-0 pr-8 focus:ring-0 cursor-pointer"
                            >
                                {dataAnak.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
                            <div className="space-y-0.5 flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status Anak</p>
                                <div className="flex gap-3 items-baseline">
                                    <h4 className="text-base font-bold text-gray-900 truncate">
                                        {selectedChild ? selectedChild.name : 'Tidak Ada Balita'}
                                    </h4>
                                </div>
                                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 mt-1 truncate">
                                    {selectedChild ? (
                                        selectedChild.has_measurement ? (
                                            <>
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                                                {`${selectedChild.status} (BB: ${selectedChild.last_weight}kg)`}
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                Belum Ada Pengukuran Terverifikasi
                                            </>
                                        )
                                    ) : (
                                        'Daftarkan Balita di Menu Balita'
                                    )}
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
                                <h4 className="text-base font-bold text-gray-900 truncate">
                                    {next_schedule ? next_schedule.date_display : 'Belum Ada Jadwal'}
                                </h4>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 mt-1 ${
                                    next_schedule ? 'text-violet-700 bg-violet-100/50' : 'text-gray-500 bg-gray-100'
                                }`}>
                                    <Clock size={12} /> {next_schedule ? `${next_schedule.time}` : 'Tutup'}
                                </span>
                            </div>
                        </div>

                        {/* 3. Reminder / Tiket Antrian */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
                            <div className="bg-rose-50 p-4 rounded-2xl text-rose-500 transition-transform group-hover:scale-110 duration-300">
                                <AlertCircle size={26} />
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Reminder Penting</p>
                                <h4 className="text-base font-bold text-gray-900 truncate">
                                    {activeQueue ? `Tiket: ${activeQueue.ticket_code}` : 'Bawa Buku KIA!'}
                                </h4>
                                <p className="text-xs text-gray-500 leading-tight mt-1 truncate pr-2">
                                    {activeQueue ? (
                                        `Antrian #${activeQueue.queue_number} (${activeQueue.child_name}) - ${activeQueue.status}`
                                    ) : next_schedule ? (
                                        `Kegiatan di ${next_schedule.location}. Siapkan buku KIA!`
                                    ) : (
                                        'Selalu bawa buku KIA untuk pencatatan imunisasi dan timbangan balita.'
                                    )}
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
                                {selectedChild && (
                                    <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                                        selectedChild.ai_risk === 'Berisiko Stunting' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                                        selectedChild.ai_risk === 'Masalah Gizi' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                                        selectedChild.has_measurement ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                        'bg-gray-50 border-gray-100 text-gray-700'
                                    }`}>
                                        <span className={`w-2 h-2 rounded-full ${
                                            selectedChild.ai_risk === 'Berisiko Stunting' ? 'bg-rose-500 animate-pulse' :
                                            selectedChild.ai_risk === 'Masalah Gizi' ? 'bg-orange-500 animate-pulse' :
                                            selectedChild.has_measurement ? 'bg-emerald-500' :
                                            'bg-gray-400'
                                        }`}></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {selectedChild.ai_risk}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* List Notifikasi AI */}
                            <div className="space-y-4 relative z-10">
                                {selectedChild ? (
                                    <>
                                        {/* Insight 1: Pertumbuhan */}
                                        <div className="group flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300">
                                            <div className="shrink-0">
                                                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                    <Stethoscope size={22} />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-bold text-gray-800 text-base">Analisis Tumbuh Kembang</h5>
                                                    <span className="text-xs text-gray-400">{selectedChild.age_display}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {selectedChild.ai_insight}
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
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-bold text-gray-800 text-base">Persiapan Sistem Imun</h5>
                                                    <span className="text-xs text-orange-400 font-medium">Pengingat</span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {next_schedule ? (
                                                        `Jadwal Posyandu berikutnya adalah ${next_schedule.date_display} pukul ${next_schedule.time} di ${next_schedule.location}. Pastikan balita cukup istirahat 2 hari sebelum imunisasi.`
                                                    ) : (
                                                        'Belum ada jadwal kegiatan posyandu terdekat untuk bulan ini. Pastikan Anda rajin memantau perkembangan balita secara berkala.'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="group flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
                                        <Baby size={48} className="text-gray-400 mb-3" />
                                        <h5 className="font-bold text-gray-800 text-base">Belum Ada Balita Terdaftar</h5>
                                        <p className="text-sm text-gray-500 max-w-sm mt-1 mb-4">
                                            Silakan daftarkan balita Anda di menu Kelola Balita terlebih dahulu untuk memulai pemantauan tumbuh kembang secara terpadu.
                                        </p>
                                    </div>
                                )}
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
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{recipe.title}</p>
                                            <h5 className="font-bold text-gray-900 text-sm pr-4 truncate max-w-[180px]">{recipe.dish}</h5>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-gray-600 leading-relaxed relative z-10">
                                        {recipe.desc}
                                    </p>
                                    
                                    <a 
                                        href={route('ai-assistant.index')}
                                        className="inline-flex items-center justify-center w-full gap-2 py-2.5 bg-white border border-orange-100 rounded-xl text-sm font-bold text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-colors relative z-10 group/btn"
                                    >
                                        Tanya AI Selengkapnya
                                        <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                    </a>
                                </div>
                            </div>

                            {/* Catatan/Edukasi Terkini */}
                            <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] border border-white shadow-sm space-y-4 flex-1">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Edukasi Pilihan</h5>
                                    <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-md">Artikel</span>
                                </div>
                                
                                {articles.length > 0 ? (
                                    articles.slice(0, 2).map((art, idx) => (
                                        <a 
                                            key={idx}
                                            href={route('education.index')}
                                            className="block group p-4 bg-gray-50/80 rounded-2xl border border-gray-100/80 space-y-2 hover:bg-violet-50/50 hover:border-violet-100 transition-all"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                                                    {art.category}
                                                </span>
                                            </div>
                                            <h5 className="text-sm font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                                                {art.title}
                                            </h5>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500">Belum ada artikel edukasi terkini.</p>
                                )}
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}