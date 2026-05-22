import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Users, 
  BellRing, 
  Megaphone, 
  Clock, 
  CheckCircle2, 
  Mic, 
  UserCheck, 
  MapPin, 
  Search,
  ChevronRight,
  Ticket
} from 'lucide-react';
import { Head, useForm, router } from '@inertiajs/react';
import KaderLayout from '@/Layouts/KaderLayout';

// Data diambil dari server melalui Inertia props (tidak ada dummy data lagi)

export default function ScheduleAndQueue({ initialQueues = [], activeSchedule = null, allSchedules = [] }) {
    const [queues, setQueues] = useState(initialQueues || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [toastMessage, setToastMessage] = useState(null);

    // Sync queues with updated props from server
    useEffect(() => {
        setQueues(initialQueues || []);
    }, [initialQueues]);

    // Form Pembuatan Jadwal Baru
    const [scheduleForm, setScheduleForm] = useState({
        date: '',
        timeStart: '08:00',
        timeEnd: '12:00',
        location: activeSchedule ? activeSchedule.location : 'Posyandu Melati 1, Balai Desa Sukamaju',
        agenda: 'Pemantauan Tumbuh Kembang & Imunisasi Rutin'
    });

    const showToast = (msg, type = 'success') => {
        setToastMessage({ msg, type });
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Handler Antrian — memanggil ke backend via Inertia
    const handleCallQueue = (id) => {
        router.patch(route('kader.schedule.call', id), {}, {
            onSuccess: () => showToast(`Memanggil Antrian ${queues.find(q => q.id === id)?.no || ''}`),
            preserveScroll: true,
        });
    };

    const handleFinishQueue = (id) => {
        router.patch(route('kader.schedule.finish', id), {}, {
            onSuccess: () => showToast('Pemeriksaan selesai, absensi kehadiran tercatat.'),
            preserveScroll: true,
        });
    };

    const handleBroadcast = (e) => {
        e.preventDefault();
        router.post(route('kader.schedule.store'), {
            date:      scheduleForm.date,
            timeStart: scheduleForm.timeStart,
            timeEnd:   scheduleForm.timeEnd,
            agenda:    scheduleForm.agenda,
            location:  scheduleForm.location,
        }, {
            onSuccess: () => showToast('Jadwal berhasil dibuat & reminder broadcast ke Bunda!', 'broadcast'),
        });
    };

    // Filter Antrian
    const filteredQueues = queues.filter(q => 
        q.childName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.motherName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const totalQueues = queues.length;
    const waitingQueues = queues.filter(q => q.status === 'Menunggu').length;
    const processingQueues = queues.filter(q => q.status === 'Diperiksa').length;
    const finishedQueues = queues.filter(q => q.status === 'Selesai').length;

    return (
        <KaderLayout 
            headerTitle="Jadwal & Antrian Posyandu"
            headerIcon={<CalendarDays size={22} />}
        >
            <Head title="Jadwal & Antrian - Sipandu" />

            {/* TOAST SYSTEM */}
            {toastMessage && (
                <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl text-white font-bold flex items-center gap-3 shadow-2xl transition-all animate-slide-down ${
                    toastMessage.type === 'broadcast' ? 'bg-indigo-600 border border-indigo-500' : 'bg-emerald-600 border border-emerald-500'
                }`}>
                    {toastMessage.type === 'broadcast' ? <Megaphone size={18} /> : <CheckCircle2 size={18} />}
                    {toastMessage.msg}
                </div>
            )}

            <div className="p-4 sm:p-8 space-y-6">
                
                {/* --- HEADER STATS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-center gap-2 hover:-translate-y-1 transition-transform group">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Users size={18} className="text-gray-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Total Antrian</span>
                        </div>
                        <h4 className="text-3xl font-black text-gray-900">{totalQueues}</h4>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm flex flex-col justify-center gap-2 hover:-translate-y-1 transition-transform group">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                            <Clock size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Menunggu</span>
                        </div>
                        <h4 className="text-3xl font-black text-amber-600">{waitingQueues}</h4>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-sm flex flex-col justify-center gap-2 hover:-translate-y-1 transition-transform group">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <Mic size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Diperiksa</span>
                        </div>
                        <h4 className="text-3xl font-black text-blue-600">{processingQueues}</h4>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm flex flex-col justify-center gap-2 hover:-translate-y-1 transition-transform group">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <UserCheck size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Selesai (Hadir)</span>
                        </div>
                        <h4 className="text-3xl font-black text-emerald-600">{finishedQueues}</h4>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    
                    {/* === SISI KIRI: JADWAL & BROADCAST (SPAN 1) === */}
                    <div className="xl:col-span-1 space-y-6">
                        
                        {/* KARTU BUAT JADWAL & BROADCAST */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
                            
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
                                    <CalendarDays size={20} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Jadwal Posyandu</h4>
                                    <p className="text-xs text-gray-500">Atur kegiatan bulan depan</p>
                                </div>
                            </div>

                            <form onSubmit={handleBroadcast} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-600">Tanggal Pelaksanaan</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={scheduleForm.date}
                                        onChange={e => setScheduleForm({...scheduleForm, date: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600">Jam Mulai</label>
                                        <input 
                                            type="time" 
                                            required
                                            value={scheduleForm.timeStart}
                                            onChange={e => setScheduleForm({...scheduleForm, timeStart: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-600">Jam Selesai</label>
                                        <input 
                                            type="time" 
                                            required
                                            value={scheduleForm.timeEnd}
                                            onChange={e => setScheduleForm({...scheduleForm, timeEnd: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-600">Agenda Kegiatan</label>
                                    <textarea 
                                        rows={2}
                                        required
                                        value={scheduleForm.agenda}
                                        onChange={e => setScheduleForm({...scheduleForm, agenda: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition-all resize-none"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 mt-2"
                                >
                                    <Megaphone size={18} /> Broadcast Reminder ke Ibu
                                </button>
                                <p className="text-[10px] text-gray-400 text-center px-2">
                                    Menekan tombol ini akan mengirimkan notifikasi *Push* ke aplikasi Sipandu milik Bunda di wilayah Anda.
                                </p>
                            </form>
                        </div>


                        {/* KARTU RIWAYAT & JADWAL POSYANDU */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                            <h4 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-50">
                                <CalendarDays size={18} className="text-indigo-600" /> Riwayat & Jadwal Posyandu
                            </h4>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                                {allSchedules.length === 0 ? (
                                    <p className="text-xs text-gray-500 text-center py-4">Belum ada riwayat jadwal.</p>
                                ) : (
                                    allSchedules.map((schedule) => {
                                        const dateStr = new Date(schedule.date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        });
                                        return (
                                            <div key={schedule.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors space-y-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className="text-xs font-black text-gray-900">{dateStr}</span>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                                        schedule.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        schedule.status === 'berlangsung' ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' :
                                                        schedule.status === 'selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}>
                                                        {schedule.status === 'upcoming' ? 'Akan Datang' :
                                                         schedule.status === 'berlangsung' ? 'Berlangsung' :
                                                         schedule.status === 'selesai' ? 'Selesai' : 'Batal'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 line-clamp-2">{schedule.agenda}</p>
                                                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} /> {schedule.time_start.substring(0, 5)} - {schedule.time_end.substring(0, 5)}
                                                    </span>
                                                    <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-gray-600">
                                                        {schedule.total_antrian} Antrian
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                    </div>

                    {/* === SISI KANAN: MANAJEMEN ANTRIAN (SPAN 2) === */}
                    <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col h-full min-h-[600px]">
                        
                        {/* Header Antrian */}
                        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                        <Users size={24} /> Live Antrian Posyandu
                                    </h3>
                                    <p className="text-emerald-100 text-sm mt-1">Kelola pemanggilan dan absensi otomatis</p>
                                </div>

                                <div className="relative w-full sm:w-64 text-gray-900">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Search size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Cari antrian..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/90 border-none text-sm rounded-full pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* List Antrian */}
                        <div className="flex-1 p-6 sm:p-8 overflow-y-auto no-scrollbar bg-gray-50/30">
                            <div className="space-y-4">
                                {filteredQueues.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search size={24} />
                                        </div>
                                        <p className="text-gray-500 font-medium">Antrian tidak ditemukan</p>
                                    </div>
                                ) : (
                                    filteredQueues.map((q) => (
                                        <div 
                                            key={q.id} 
                                            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                                q.status === 'Diperiksa' ? 'bg-blue-50/50 border-blue-300 shadow-sm scale-[1.01]' :
                                                q.status === 'Selesai' ? 'bg-white border-gray-200 opacity-60' :
                                                'bg-white border-gray-200 hover:border-emerald-200 hover:shadow-sm'
                                            }`}
                                        >
                                            {/* Info Kiri */}
                                            <div className="flex items-center gap-4 sm:gap-5">
                                                {/* Nomor Antrian (Besar) */}
                                                <div className={`w-16 h-16 shrink-0 rounded-2xl flex flex-col items-center justify-center border shadow-inner ${
                                                    q.status === 'Diperiksa' ? 'bg-blue-500 border-blue-600 text-white' :
                                                    q.status === 'Selesai' ? 'bg-gray-100 border-gray-200 text-gray-500' :
                                                    'bg-white border-emerald-100 text-emerald-700 font-black'
                                                }`}>
                                                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 -mb-1">No</span>
                                                    <span className="text-xl font-black">{q.no}</span>
                                                </div>

                                                {/* Data Nama */}
                                                <div className="space-y-1">
                                                    <h5 className="font-bold text-gray-900 text-base md:text-lg">{q.childName}</h5>
                                                    <p className="text-xs text-gray-500 font-medium">Bunda: <span className="text-gray-700">{q.motherName}</span></p>
                                                    <p className="text-xs text-gray-400">Agenda: {q.agenda}</p>
                                                </div>
                                            </div>

                                            {/* Action Kanan */}
                                            <div className="flex items-center gap-3 justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                                                
                                                {/* Status Badge */}
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                                                        q.status === 'Menunggu' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        q.status === 'Diperiksa' ? 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse' :
                                                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                        {q.status}
                                                    </span>
                                                    {q.time !== '-' && (
                                                        <span className="text-[10px] text-gray-400 font-bold">{q.time}</span>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                {q.status === 'Menunggu' && (
                                                    <button 
                                                        onClick={() => handleCallQueue(q.id)}
                                                        className="p-3 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-xl border border-emerald-100 transition-colors shadow-sm group"
                                                        title="Panggil Antrian"
                                                    >
                                                        <Mic size={18} className="group-hover:scale-110 transition-transform" />
                                                    </button>
                                                )}

                                                {q.status === 'Diperiksa' && (
                                                    <button 
                                                        onClick={() => handleFinishQueue(q.id)}
                                                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
                                                    >
                                                        <CheckCircle2 size={16} /> Selesai
                                                    </button>
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
        </KaderLayout>
    );
}