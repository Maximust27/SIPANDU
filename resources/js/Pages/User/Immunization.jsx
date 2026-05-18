import React, { useState } from 'react';
import { 
  Calendar, 
  Syringe, 
  Ticket, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Circle, 
  Users, 
  Baby, 
  MapPin, 
  BellRing,
  Check,
  ChevronRight
} from 'lucide-react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// --- CUSTOM CSS UNTUK ANIMASI & GLASSMORPHISM ---
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
`;

// --- MOCK DATA ---
const initialChildrenData = [
    {
        id: 1,
        name: 'Leon Alfarizi',
        gender: 'Laki-laki',
        ageStr: '2 Tahun 3 Bln',
        scheduleDate: '15 Juni 2026',
        queue: { hasTicket: true, number: 'A-12', status: 'Menunggu' },
        immunization: [
            { id: 1, vaccine: 'Hepatitis B (HB-0)', date: '12 Mar 2024', status: 'Selesai' },
            { id: 2, vaccine: 'BCG & Polio 1', date: '15 Apr 2024', status: 'Selesai' },
            { id: 3, vaccine: 'DPT-HB-Hib 1 & Polio 2', date: '15 Mei 2024', status: 'Selesai' },
            { id: 4, vaccine: 'DPT-HB-Hib Lanjutan', date: '15 Jun 2026', status: 'Akan Datang' },
            { id: 5, vaccine: 'Campak Rubella (MR) Lanjutan', date: '15 Sep 2026', status: 'Akan Datang' }
        ]
    },
    {
        id: 2,
        name: 'Ayesha Zahra',
        gender: 'Perempuan',
        ageStr: '7 Bulan',
        scheduleDate: '05 Juli 2026',
        queue: { hasTicket: false, number: null, status: null },
        immunization: [
            { id: 1, vaccine: 'Hepatitis B (HB-0)', date: '05 Okt 2025', status: 'Selesai' },
            { id: 2, vaccine: 'BCG & Polio 1', date: '10 Nov 2025', status: 'Selesai' },
            { id: 3, vaccine: 'DPT-HB-Hib 1 & Polio 2', date: '12 Des 2025', status: 'Selesai' },
            { id: 4, vaccine: 'DPT-HB-Hib 2 & Polio 3', date: '10 Jan 2026', status: 'Selesai' },
            { id: 5, vaccine: 'Campak Rubella (MR)', date: '05 Jul 2026', status: 'Akan Datang' }
        ]
    }
];

export default function Immunization() {
    const [childrenList, setChildrenList] = useState(initialChildrenData);
    const [activeChildId, setActiveChildId] = useState(1);
    const [isTakingQueue, setIsTakingQueue] = useState(false);

    const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

    // Handler Ambil Antrian
    const handleTakeQueue = () => {
        setIsTakingQueue(true);
        setTimeout(() => {
            const updatedChildren = childrenList.map(child => {
                if (child.id === activeChildId) {
                    return {
                        ...child,
                        queue: { hasTicket: true, number: 'B-04', status: 'Berhasil Diambil' }
                    };
                }
                return child;
            });
            setChildrenList(updatedChildren);
            setIsTakingQueue(false);
        }, 1200);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="bg-violet-100 p-2 rounded-xl text-violet-600">
                        <Calendar size={22} />
                    </div>
                    <h2 className="text-xl font-bold leading-tight text-gray-900">
                        Imunisasi & Jadwal
                    </h2>
                </div>
            }
        >
            <Head title="Imunisasi & Jadwal" />
            <style>{pageStyles}</style>

            <div className="p-4 sm:p-8 relative min-h-[calc(100vh-80px)] overflow-hidden">
                {/* Background Floating Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0"></div>
                <div className="absolute top-80 left-10 w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0" style={{ animationDelay: '2000ms' }}></div>

                <div className="max-w-7xl mx-auto space-y-6 relative z-10 pb-10">
                    
                    {/* === BAGIAN ATAS: PEMILIH ANAK === */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Jadwal Untuk Anak</h4>
                        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                            {childrenList.map(child => (
                                <button
                                    key={child.id}
                                    onClick={() => setActiveChildId(child.id)}
                                    className={`flex items-center gap-3 p-3 pr-6 rounded-[1.25rem] border transition-all shrink-0 ${
                                        activeChildId === child.id
                                        ? 'bg-white border-violet-200 shadow-md shadow-violet-100/50 scale-[1.02]'
                                        : 'glass-panel hover:bg-white/90 hover:border-violet-100 border-transparent'
                                    }`}
                                >
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${
                                        child.gender === 'Laki-laki' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-pink-400 to-rose-400'
                                    }`}>
                                        {child.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-bold leading-tight ${activeChildId === child.id ? 'text-gray-900' : 'text-gray-600'}`}>{child.name}</p>
                                        <p className="text-xs text-gray-400 font-medium">{child.ageStr}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-down" key={activeChildId}>
                        
                        {/* KOLOM KIRI (Antrian & Riwayat) */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            
                            {/* KARTU ANTRIAN ONLINE */}
                            <div className={`rounded-[2.5rem] p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden transition-all duration-500 ${
                                activeChild.queue.hasTicket 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-200/50' 
                                : 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-200/50'
                            }`}>
                                {/* Icon Background */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-1/4 opacity-10 pointer-events-none">
                                    <Ticket size={250} fill="currentColor" />
                                </div>
                                
                                <div className="relative z-10 space-y-2 text-center sm:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
                                        <span className={`w-2 h-2 rounded-full animate-pulse ${activeChild.queue.hasTicket ? 'bg-white' : 'bg-green-400'}`}></span>
                                        {activeChild.queue.hasTicket ? 'Tiket Antrian Aktif' : 'Antrian Online Terbuka'}
                                    </div>
                                    <h3 className="text-3xl font-bold tracking-tight">
                                        {activeChild.queue.hasTicket ? 'Antrian Posyandu Anda' : 'Ambil Nomor Antrian'}
                                    </h3>
                                    <p className="text-white/80 text-sm max-w-md">
                                        {activeChild.queue.hasTicket 
                                            ? `Anda sudah terdaftar untuk sesi Posyandu tanggal ${activeChild.scheduleDate}. Tunjukkan tiket ini kepada Kader.`
                                            : `Hindari menunggu lama! Ambil antrian Posyandu secara online untuk ${activeChild.name} sekarang juga.`}
                                    </p>
                                </div>

                                <div className="relative z-10 shrink-0 w-full sm:w-auto">
                                    {activeChild.queue.hasTicket ? (
                                        <div className="bg-white text-emerald-700 p-5 rounded-3xl text-center shadow-inner border-4 border-emerald-400/30 w-full sm:w-48">
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Nomor Anda</p>
                                            <p className="text-5xl font-black">{activeChild.queue.number}</p>
                                            <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600">
                                                <Check size={14} /> Berhasil
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleTakeQueue}
                                            disabled={isTakingQueue}
                                            className="w-full sm:w-auto flex flex-col items-center justify-center gap-2 px-8 py-5 bg-white hover:bg-violet-50 text-violet-700 font-bold rounded-3xl transition-all shadow-lg hover:scale-105 disabled:opacity-80 disabled:hover:scale-100"
                                        >
                                            <Ticket size={28} className={isTakingQueue ? 'animate-bounce' : ''} />
                                            <span>{isTakingQueue ? 'Memproses...' : 'Ambil Antrian Sekarang'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* TIMELINE RIWAYAT IMUNISASI */}
                            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden flex-1">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                                            <Syringe size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">Riwayat & Rencana Imunisasi</h4>
                                            <p className="text-sm text-gray-500">Buku KIA Digital - {activeChild.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-4 sm:pl-8">
                                    <div className="border-l-2 border-gray-100 space-y-8 pb-4">
                                        {activeChild.immunization.map((item, index) => {
                                            const isDone = item.status === 'Selesai';
                                            return (
                                                <div key={item.id} className="relative pl-6 sm:pl-8 group">
                                                    {/* Timeline Dot/Icon */}
                                                    <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-transform group-hover:scale-110 ${
                                                        isDone ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                        {isDone ? <Check size={14} strokeWidth={4} /> : <Circle size={10} fill="currentColor" />}
                                                    </div>

                                                    {/* Timeline Content */}
                                                    <div className={`p-4 rounded-2xl border transition-all ${
                                                        isDone 
                                                        ? 'bg-white border-gray-100 shadow-sm hover:border-emerald-200' 
                                                        : 'bg-violet-50/50 border-violet-100 hover:border-violet-300 border-dashed'
                                                    }`}>
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                            <div>
                                                                <h5 className={`font-bold text-base ${isDone ? 'text-gray-900' : 'text-violet-900'}`}>
                                                                    {item.vaccine}
                                                                </h5>
                                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                                    <Calendar size={12} /> {item.date}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                                                                    isDone 
                                                                    ? 'bg-emerald-50 text-emerald-600' 
                                                                    : 'bg-violet-100 text-violet-700'
                                                                }`}>
                                                                    {item.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN (Jadwal & Reminder) */}
                        <div className="flex flex-col gap-6">
                            
                            {/* JADWAL POSYANDU */}
                            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden bg-gradient-to-b from-white to-blue-50/30">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                                        <Calendar size={20} />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">Jadwal Terdekat</h4>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                                    <div className="text-center pb-4 border-b border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal Pelaksanaan</p>
                                        <p className="text-2xl font-black text-indigo-600">{activeChild.scheduleDate}</p>
                                    </div>
                                    
                                    <div className="space-y-3 pt-1">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-500 shrink-0"><Clock size={16}/></div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium">Waktu</p>
                                                <p className="text-sm font-bold text-gray-900">08:00 - 11:30 WIB</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-500 shrink-0"><MapPin size={16}/></div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium">Lokasi</p>
                                                <p className="text-sm font-bold text-gray-900">Posyandu Melati 1</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Balai Desa Sukamaju, RT 02/RW 03</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl transition-colors border border-gray-200 mt-2">
                                        Lihat Rute Lokasi <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* REMINDER / PERHATIAN */}
                            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden bg-rose-50/40 border-rose-100">
                                <div className="absolute -right-6 -bottom-6 text-rose-200/40 pointer-events-none">
                                    <BellRing size={100} />
                                </div>
                                
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600">
                                        <AlertCircle size={20} />
                                    </div>
                                    <h4 className="text-lg font-bold text-rose-700">Reminder Penting</h4>
                                </div>

                                <div className="relative z-10 space-y-3">
                                    <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex gap-3 items-start">
                                        <CheckCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                            Wajib membawa <strong className="text-gray-900">Buku KIA (Pink)</strong> untuk pencatatan riwayat imunisasi.
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex gap-3 items-start">
                                        <CheckCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                            Pastikan anak dalam keadaan sehat (tidak demam tinggi) sebelum menerima imunisasi.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}