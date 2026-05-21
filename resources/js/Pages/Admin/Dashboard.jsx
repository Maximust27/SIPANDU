import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  UserCog,
  Activity,
  TrendingUp,
  PieChart,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Baby
} from 'lucide-react';

import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard() {
    // --- DUMMY DATA UNTUK ADMIN ---
    const adminStats = {
        totalUsers: 12450,
        totalKader: 320,
        totalAnak: 15800,
        totalPosyandu: 45
    };

    const stuntingData = {
        totalStunting: 425,
        percentage: '2.6%',
        trend: '-0.4%', // Penurunan stunting
        regions: [
            { name: 'Kec. Cilacap Selatan', cases: 120, status: 'warning' },
            { name: 'Kec. Cilacap Tengah', cases: 85, status: 'warning' },
            { name: 'Kec. Cilacap Utara', cases: 220, status: 'danger' },
        ]
    };

    return (
        <AdminLayout 
            headerTitle="Dashboard Utama" 
            headerIcon={<LayoutDashboard size={20} />}
        >
            <Head title="Admin Dashboard - Sipandu" />

            <div className="space-y-6 sm:space-y-8 min-h-full">
                
                {/* === BANNER ADMIN === */}
                <div style={{ background: 'linear-gradient(to right, #1d4ed8, #3730a3)' }} className="relative overflow-hidden rounded-[2rem] p-8 md:p-10 text-white shadow-lg">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
                        <Activity size={280} />
                    </div>
                    <div className="relative z-10 max-w-3xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-blue-100 border border-white/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Pusat Komando Sipandu
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                            Selamat Datang, Administrator!
                        </h3>
                        <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                            Pantau statistik keseluruhan, kelola posyandu, dan awasi tren stunting di seluruh wilayah. Sistem AI berjalan normal untuk 45 posyandu aktif.
                        </p>
                    </div>
                </div>

                {/* === QUICK STATS: 4 METRIK UTAMA === */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Stat 1: Total User */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 text-violet-500 group-hover:scale-125 transition-transform duration-500"><Users size={90}/></div>
                        <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
                            <Users size={20} className="text-violet-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Total Bunda (User)</span>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 relative z-10">{adminStats.totalUsers.toLocaleString('id-ID')}</h4>
                        <p className="text-xs font-bold text-violet-700 bg-violet-100 border border-violet-200 inline-block px-2.5 py-1 rounded-lg w-max relative z-10">
                            +125 bln ini
                        </p>
                    </div>

                    {/* Stat 2: Total Kader */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-500 group-hover:scale-125 transition-transform duration-500"><UserCog size={90}/></div>
                        <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
                            <UserCog size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Kader Aktif</span>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 relative z-10">{adminStats.totalKader.toLocaleString('id-ID')}</h4>
                        <p className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 inline-block px-2.5 py-1 rounded-lg w-max relative z-10">
                            Tersebar di 45 Posyandu
                        </p>
                    </div>

                    {/* Stat 3: Total Anak */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 text-blue-500 group-hover:scale-125 transition-transform duration-500"><Baby size={90}/></div>
                        <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
                            <Baby size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Total Anak Tercatat</span>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 relative z-10">{adminStats.totalAnak.toLocaleString('id-ID')}</h4>
                        <p className="text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 inline-block px-2.5 py-1 rounded-lg w-max relative z-10">
                            +230 bln ini
                        </p>
                    </div>

                    {/* Stat 4: Total Posyandu */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 text-fuchsia-500 group-hover:scale-125 transition-transform duration-500"><Building2 size={90}/></div>
                        <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
                            <Building2 size={20} className="text-fuchsia-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Posyandu Terdaftar</span>
                        </div>
                        <h4 className="text-4xl font-black text-slate-900 relative z-10">{adminStats.totalPosyandu}</h4>
                        <p className="text-xs font-bold text-fuchsia-700 bg-fuchsia-100 border border-fuchsia-200 inline-block px-2.5 py-1 rounded-lg w-max relative z-10">
                            Beroperasi Aktif
                        </p>
                    </div>
                </div>

                {/* === SECTION STATISTIK STUNTING & SHORTCUTS === */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    
                    {/* STATISTIK STUNTING GLOBAL (SPAN 2) */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <PieChart size={20} className="text-blue-600" /> Analitik Stunting Global
                                </h4>
                                <p className="text-sm text-slate-500 mt-1">Akumulasi data prevalensi dari seluruh Posyandu.</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                <TrendingUp size={16} className="rotate-180" /> Tren Menurun {stuntingData.trend}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            {/* Visual / Highlight */}
                            <div className="md:col-span-1 bg-slate-900 rounded-2xl p-6 text-center text-white relative overflow-hidden flex flex-col justify-center h-full">
                                <div className="absolute -left-4 -top-4 text-white/10"><ShieldAlert size={100} /></div>
                                <div className="relative z-10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Total Kasus Aktif</p>
                                    <h2 className="text-5xl font-black text-rose-400">{stuntingData.totalStunting}</h2>
                                    <p className="text-sm mt-2 text-slate-300">
                                        Sekitar <strong className="text-white">{stuntingData.percentage}</strong> dari total populasi balita terdaftar.
                                    </p>
                                </div>
                            </div>

                            {/* Daftar per Wilayah */}
                            <div className="md:col-span-2 space-y-4">
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sebaran Wilayah Tertinggi</h5>
                                {stuntingData.regions.map((region, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between group hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${region.status === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm group-hover:text-blue-900 transition-colors">{region.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    Status: {region.status === 'danger' ? 'Darurat / Merah' : 'Waspada / Kuning'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900">{region.cases}</p>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Kasus</p>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full mt-2 py-3 bg-white border border-slate-200 text-blue-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                                    Lihat Laporan Lengkap <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MENU TINDAKAN CEPAT ADMIN (SPAN 1) */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                        <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100">
                            <Settings size={20} className="text-slate-400" /> Aksi Cepat Admin
                        </h4>

                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Building2 size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-900">Tambah Posyandu Baru</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Registrasi faskes baru</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <UserCog size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-900">Verifikasi Akun Kader</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Approve akses kader baru</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3 Pending</span>
                                    <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-600 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>

                            <button className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-black text-white rounded-2xl transition-all shadow-md group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 text-white p-3 rounded-xl">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">Unduh Rekap Stunting</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Format Excel / PDF</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-400 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}