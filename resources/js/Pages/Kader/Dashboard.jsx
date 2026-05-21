import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  CalendarCheck, 
  ClipboardEdit, 
  QrCode, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  LayoutDashboard,
  Baby,
  CalendarDays,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Heart
} from 'lucide-react';

import KaderLayout from '@/Layouts/KaderLayout';
import { Link, usePage } from '@inertiajs/react';


// --- STYLING DASHBOARD KADER ---
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
  .animate-dash-float { animation: float 6s ease-in-out infinite; }
  .animate-dash-blob { animation: blob 8s infinite; }
  .glass-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.9);
  }
`;

// --- KADER DASHBOARD PAGE ---
export default function KaderDashboard({ auth, stats = {}, jadwalHariIni = null, jadwalBerikutnya = null, todayQueues = [] }) {
    const kaderName = auth?.user?.name || 'Siti Aminah';

    return (
        <KaderLayout headerTitle="Dashboard Ringkasan">
            <style>{dashboardStyles}</style>

            <div className="p-4 sm:p-8 relative min-h-full">
                {/* Background Blobs (Emerald Theme) */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0"></div>
                <div className="absolute top-40 left-10 w-[400px] h-[400px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0" style={{ animationDelay: '2000ms' }}></div>

                <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                    
                    {/* Welcome Banner - Warna dijamin muncul dengan style inline */}
                    <div 
                        className="relative overflow-hidden rounded-[2rem] p-8 md:p-10 text-white shadow-xl shadow-emerald-200/50"
                        style={{ backgroundImage: 'linear-gradient(to right, #059669, #0f766e)' }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-1/4 opacity-10 pointer-events-none">
                            <Users size={320} fill="currentColor" />
                        </div>
                        <div className="relative z-10 max-w-2xl space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                                Sesi Posyandu: {jadwalHariIni ? 'Berlangsung' : 'Selesai / Libur'}
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
                                Semangat Bertugas, Kader {kaderName}!  
                            </h3>
                            <p className="text-emerald-50 text-sm md:text-base leading-relaxed max-w-xl font-medium">
                                {jadwalHariIni ? (
                                    `Hari ini ada agenda: "${jadwalHariIni.agenda}" pukul ${jadwalHariIni.jam}. Pantau statistik dan layani antrian dengan sigap.`
                                ) : (
                                    'Hari ini tidak ada jadwal posyandu aktif yang ditugaskan kepada Anda. Silakan kelola data anak atau pantau laporan AI.'
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Grid - Dipercantik */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Users size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-wider">Total Terdaftar</span>
                            </div>
                            <h4 className="text-4xl font-black text-gray-900">{stats.totalAnak || 0}</h4>
                            <p className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 inline-block px-2.5 py-1 rounded-lg w-max">Balita di wilayah tugas</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <CalendarCheck size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-wider">Pemeriksaan Selesai</span>
                            </div>
                            <h4 className="text-4xl font-black text-gray-900 flex items-baseline gap-1">
                                {stats.antrianSelesai || 0} <span className="text-xl text-gray-400 font-medium">/ {stats.totalAntrian || 0}</span>
                            </h4>
                            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 inline-block px-2.5 py-1 rounded-lg w-max">Kehadiran hari ini</p>
                        </div>

                        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 text-rose-500 group-hover:scale-110 transition-transform duration-500"><AlertTriangle size={90}/></div>
                            <div className="flex items-center gap-2 text-rose-600 mb-1 relative z-10">
                                <AlertTriangle size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-wider">Butuh Verifikasi</span>
                            </div>
                            <h4 className="text-4xl font-black text-rose-700 relative z-10">{stats.butuhVerifikasi || 0}</h4>
                            <p className="text-xs font-bold text-rose-700 bg-rose-100 border border-rose-200 inline-block px-2.5 py-1 rounded-lg w-max relative z-10">Inputan mandiri Bunda</p>
                        </div>

                        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-10 text-amber-500 group-hover:scale-110 transition-transform duration-500"><Baby size={90}/></div>
                            <div className="flex items-center gap-2 text-amber-600 mb-1 relative z-10">
                                <Baby size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-wider">Total Antrian</span>
                            </div>
                            <h4 className="text-4xl font-black text-amber-700 relative z-10">{stats.totalAntrian || 0}</h4>
                            <p className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 inline-block px-2.5 py-1 rounded-lg w-max relative z-10">Antrean hari ini</p>
                        </div>
                    </div>

                    {/* Layout Bawah: Menu Cepat & Analitik */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                        
                        {/* Menu Pintas Kader (Kiri) */}
                        <div className="glass-panel p-6 md:p-8 rounded-[2rem] shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                                    <LayoutDashboard size={20} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Menu Operasional</h4>
                            </div>
                            
                            <div className="space-y-4">
                                <Link href={route('kader.ai-monitoring.index')} className="w-full flex items-center justify-between p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all shadow-md group border border-emerald-500" style={{ backgroundColor: '#059669' }}>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm text-white">
                                            <Sparkles size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-base text-white">AI Deteksi Risiko</p>
                                            <p className="text-xs text-emerald-100 mt-0.5">Analisis stunting otomatis</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="text-white transform transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link href={route('kader.growth-monitoring.index')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-emerald-300 text-gray-800 rounded-2xl transition-all shadow-sm group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                                            <ClipboardEdit size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-base text-gray-900">Input Pertumbuhan</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Catat BB, TB, LK manual</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="text-gray-400 group-hover:text-emerald-600 transform transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link href={route('kader.children.index')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-emerald-300 text-gray-800 rounded-2xl transition-all shadow-sm group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-violet-50 text-violet-600 p-3 rounded-xl group-hover:bg-violet-100 transition-colors">
                                            <FileCheck size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-base text-gray-900">Verifikasi Balita</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Approve registrasi & KMS mandiri</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="text-gray-400 group-hover:text-emerald-600 transform transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>

                        {/* Statistik Wilayah & Antrian (Kanan span 2) */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            
                            {/* AI Analitik Wilayah - Menggunakan style inline untuk warna pasti */}
                            <div 
                                className="rounded-[2rem] shadow-lg p-6 md:p-8 text-white relative overflow-hidden"
                                style={{ backgroundImage: 'linear-gradient(to right, #1e1b4b, #312e81)' }} // Fallback pasti muncul (Warna Indigo Tua)
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
                                
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                                            <Sparkles size={20} className="text-fuchsia-300" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white">Informasi Jadwal Terdekat</h4>
                                    </div>
                                    <span className="text-xs bg-indigo-500/50 border border-indigo-400/50 px-3 py-1.5 rounded-full text-indigo-100 font-bold">Jadwal Tugas</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/20 transition-colors">
                                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Hari Ini</p>
                                        {jadwalHariIni ? (
                                            <div>
                                                <h5 className="font-bold text-lg text-white">{jadwalHariIni.agenda}</h5>
                                                <p className="text-xs text-indigo-200 mt-1">{jadwalHariIni.jam}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-slate-300">Tidak ada jadwal hari ini</p>
                                        )}
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/20 transition-colors">
                                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Berikutnya</p>
                                        {jadwalBerikutnya ? (
                                            <div>
                                                <h5 className="font-bold text-lg text-white">{jadwalBerikutnya.agenda}</h5>
                                                <p className="text-xs text-indigo-200 mt-1">{jadwalBerikutnya.tanggal}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-slate-300">Belum ada jadwal mendatang</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Daftar Notifikasi / Antrian */}
                            <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6 md:p-8 flex-1">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-100 text-gray-600 p-2 rounded-xl">
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">Antrian Aktif Hari Ini</h4>
                                            <p className="text-sm text-gray-500 mt-0.5">Balita yang sedang menunggu giliran pemeriksaan.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {todayQueues.length > 0 ? (
                                        todayQueues.map((antrian, idx) => (
                                            <div key={antrian.id || idx} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all gap-4 sm:gap-0 ${
                                                antrian.status === 'Diperiksa' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                                            }`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${
                                                        antrian.status === 'Diperiksa' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {antrian.no}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-gray-900 text-base">{antrian.childName}</h5>
                                                        <p className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 inline-block px-2.5 py-0.5 rounded-lg mt-1 mr-2">{antrian.agenda}</p>
                                                        <p className="text-xs text-gray-500 inline-block">Ibu: {antrian.motherName}</p>
                                                    </div>
                                                </div>
                                                <Link href={route('kader.schedule.index')} className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-colors w-full sm:w-auto text-center ${
                                                    antrian.status === 'Diperiksa' 
                                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                                                    : 'text-emerald-600 border border-emerald-500 hover:bg-emerald-600 hover:text-white bg-white shadow-sm'
                                                }`}>
                                                    {antrian.status}
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <CalendarDays className="mx-auto mb-2 text-gray-300" size={40} />
                                            <p className="text-sm font-medium">Tidak ada antrian aktif hari ini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </KaderLayout>
    );
}