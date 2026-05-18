import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  Scale, 
  Ruler, 
  LineChart, 
  Sparkles, 
  Save, 
  History,
  ShieldAlert,
  ShieldCheck,
  CalendarDays,
  Plus,
  Users,
  Check,
  Info
} from 'lucide-react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// --- CUSTOM CSS UNTUK ANIMASI & GRAFIK ---
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
  @keyframes pulse-glow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  .animate-dash-blob { animation: blob 8s infinite; }
  .animate-ai-pulse { animation: pulse-glow 3s infinite; }
  .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
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
  /* Hide Scrollbar but keep functionality */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  /* Styling tambahan untuk grafik agar garis rapi saat resize */
  .chart-svg path {
    vector-effect: non-scaling-stroke;
  }
`;

// --- MOCK DATA MULTI ANAK ---
const initialChildrenData = [
    {
        id: 1,
        name: 'Leon Alfarizi',
        gender: 'Laki-laki',
        birthDate: '12 Mar 2024',
        ageStr: '2 Tahun 3 Bln',
        lastWeight: '12.4 kg',
        lastHeight: '88.5 cm',
        history: [
            { bln: 'Jan', weight: 9.8, height: 83.5 },
            { bln: 'Feb', weight: 10.2, height: 85.0 },
            { bln: 'Mar', weight: 11.5, height: 86.5 },
            { bln: 'Apr', weight: 12.0, height: 87.5 },
            { bln: 'Mei', weight: 12.4, height: 88.5 },
        ],
        aiRisk: 'Sangat Rendah',
        aiColor: 'emerald',
        zScore: '+0.5',
        aiInsight: 'Pertumbuhan linear sangat baik! Pertahankan asupan protein hewani (telur, ikan, daging) minimal 2 porsi sehari.'
    },
    {
        id: 2,
        name: 'Ayesha Zahra',
        gender: 'Perempuan',
        birthDate: '05 Okt 2025',
        ageStr: '7 Bulan',
        lastWeight: '7.8 kg',
        lastHeight: '68.2 cm',
        history: [
            { bln: 'Jan', weight: 5.5, height: 60.5 },
            { bln: 'Feb', weight: 6.5, height: 63.0 },
            { bln: 'Mar', weight: 7.0, height: 65.5 },
            { bln: 'Apr', weight: 7.5, height: 67.0 },
            { bln: 'Mei', weight: 7.8, height: 68.2 },
        ],
        aiRisk: 'Normal / Aman',
        aiColor: 'blue',
        zScore: '+0.2',
        aiInsight: 'Fase MPASI berjalan lancar. Pastikan tekstur makanan (puree/lumat) sesuai usianya untuk melatih kemampuan oromotorik.'
    }
];

export default function Children() {
    // --- STATES ---
    const [childrenList, setChildrenList] = useState(initialChildrenData);
    const [activeChildId, setActiveChildId] = useState(1);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // State untuk toggle Grafik
    const [chartType, setChartType] = useState('weight'); // 'weight' atau 'height'
    
    // Mendapatkan data anak yang sedang aktif dipilih
    const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

    // State form untuk input pengukuran bulanan
    const { data: measureData, setData: setMeasureData, post: postMeasure, processing: processingMeasure } = useForm({
        weight: '',
        height: '',
        date: new Date().toISOString().split('T')[0]
    });

    // State form untuk tambah anak baru
    const { data: newChild, setData: setNewChild, post: postNewChild, processing: processingChild, reset: resetChildForm } = useForm({
        name: '',
        gender: 'Laki-laki',
        birthDate: ''
    });

    // Reset form ukur jika pindah anak
    useEffect(() => {
        setMeasureData('weight', '');
        setMeasureData('height', '');
    }, [activeChildId]);

    // --- HANDLERS ---
    const submitMeasurement = (e) => {
        e.preventDefault();
        postMeasure('/mock-route', {
            onSuccess: () => {
                // Update real-time untuk data grafik
                const updatedChildren = childrenList.map(child => {
                    if (child.id === activeChildId) {
                        const dateObj = new Date(measureData.date);
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
                        const newHistoryPoint = {
                            bln: monthNames[dateObj.getMonth()],
                            weight: parseFloat(measureData.weight) || 0,
                            height: parseFloat(measureData.height) || 0
                        };
                        return { 
                            ...child, 
                            history: [...child.history, newHistoryPoint],
                            lastWeight: `${measureData.weight} kg`,
                            lastHeight: `${measureData.height} cm`
                        };
                    }
                    return child;
                });
                setChildrenList(updatedChildren);

                setIsSuccess('Pengukuran berhasil dicatat dan grafik diperbarui!');
                setTimeout(() => setIsSuccess(false), 4000);
                setMeasureData('weight', '');
                setMeasureData('height', '');
            }
        });
    };

    const submitNewChild = (e) => {
        e.preventDefault();
        postNewChild('/mock-route', {
            onSuccess: () => {
                const newId = childrenList.length + 1;
                setChildrenList([...childrenList, {
                    id: newId,
                    name: newChild.name,
                    gender: newChild.gender,
                    birthDate: newChild.birthDate,
                    ageStr: '0 Bulan (Baru)',
                    lastWeight: '-',
                    lastHeight: '-',
                    history: [],
                    aiRisk: 'Belum Ada Data',
                    aiColor: 'gray',
                    zScore: '-',
                    aiInsight: 'Silakan lakukan pengukuran pertama untuk mendapatkan analisis AI.'
                }]);
                
                setIsSuccess('Profil Anak berhasil ditambahkan!');
                setTimeout(() => setIsSuccess(false), 3000);
                setShowAddForm(false);
                setActiveChildId(newId);
                resetChildForm();
            }
        });
    };

    // --- LOGIK KALKULASI GRAFIK DINAMIS ---
    const isWeight = chartType === 'weight';
    const chartMaxY = isWeight ? 15 : 110;
    const chartMinY = isWeight ? 3 : 50;
    const chartRangeY = chartMaxY - chartMinY;
    const unit = isWeight ? 'kg' : 'cm';

    // Buat 5 label sumbu Y secara otomatis dari batas atas ke bawah
    const yLabels = [...Array(5)].map((_, i) => {
        const val = chartMaxY - (i * (chartRangeY / 4));
        return `${val} ${unit}`;
    });

    // Kalkulasi titik kordinat (x, y) dalam persentase untuk SVG dan Titik Bulat
    const chartPoints = activeChild.history.map((d, index) => {
        const x = (index / Math.max(activeChild.history.length - 1, 1)) * 100;
        const val = isWeight ? d.weight : d.height;
        
        // cssY = 0% di bawah, 100% di atas. Kita batasi (clamp) agar tidak tembus boks terlalu jauh
        let rawCssY = ((val - chartMinY) / chartRangeY) * 100;
        const cssY = Math.max(-5, Math.min(105, rawCssY)); 
        
        // svgY = 0 di atas, 100 di bawah (kebalikan dari CSS bottom)
        const svgY = 100 - cssY;
        
        return { ...d, x, cssY, svgY, val };
    });

    // Membuat string SVG Path (M = Move to, L = Line to)
    const svgPathData = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.svgY}`).join(' ');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="bg-violet-100 p-2 rounded-xl text-violet-600">
                        <Users size={22} />
                    </div>
                    <h2 className="text-xl font-bold leading-tight text-gray-900">
                        Manajemen Anak
                    </h2>
                </div>
            }
        >
            <Head title="Anak & Pertumbuhan" />
            <style>{pageStyles}</style>

            <div className="p-4 sm:p-8 relative min-h-[calc(100vh-80px)] overflow-hidden">
                {/* Background Floating Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0"></div>
                <div className="absolute top-80 left-10 w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0" style={{ animationDelay: '2000ms' }}></div>

                <div className="max-w-7xl mx-auto space-y-6 relative z-10 pb-10">
                    
                    {/* ALERT GLOBAL */}
                    {isSuccess && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm font-medium animate-slide-down shadow-sm">
                            <div className="bg-emerald-100 p-1.5 rounded-full"><Check size={16} /></div> 
                            {isSuccess}
                        </div>
                    )}

                    {/* === BAGIAN ATAS: PEMILIH ANAK & TAMBAH ANAK === */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Pilih Profil Anak</h4>
                        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                            {childrenList.map(child => (
                                <button
                                    key={child.id}
                                    onClick={() => { setActiveChildId(child.id); setShowAddForm(false); }}
                                    className={`flex items-center gap-3 p-3 pr-6 rounded-[1.25rem] border transition-all shrink-0 ${
                                        activeChildId === child.id && !showAddForm
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
                                        <p className={`text-sm font-bold leading-tight ${activeChildId === child.id && !showAddForm ? 'text-gray-900' : 'text-gray-600'}`}>{child.name}</p>
                                        <p className="text-xs text-gray-400 font-medium">{child.ageStr}</p>
                                    </div>
                                </button>
                            ))}

                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className={`flex items-center gap-2 px-5 py-4 rounded-[1.25rem] border-2 border-dashed transition-all shrink-0 h-[68px] ${
                                    showAddForm 
                                    ? 'border-violet-400 bg-violet-50 text-violet-700' 
                                    : 'border-gray-300 bg-white/50 text-gray-500 hover:border-violet-300 hover:bg-white hover:text-violet-600'
                                }`}
                            >
                                <Plus size={20} className={showAddForm ? 'rotate-45 transition-transform' : 'transition-transform'} />
                                <span className="text-sm font-bold whitespace-nowrap">Tambah Anak</span>
                            </button>
                        </div>
                    </div>

                    {/* === FORM TAMBAH ANAK (Muncul jika tombol Tambah ditekan) === */}
                    {showAddForm && (
                        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm animate-slide-down border-violet-100">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="bg-violet-100 p-2.5 rounded-xl text-violet-600">
                                    <Baby size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">Data Anak Baru</h4>
                                    <p className="text-sm text-gray-500">Masukkan informasi dasar anak Anda.</p>
                                </div>
                            </div>

                            <form onSubmit={submitNewChild} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Budi Santoso"
                                        value={newChild.name}
                                        onChange={e => setNewChild('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Jenis Kelamin</label>
                                    <select 
                                        value={newChild.gender}
                                        onChange={e => setNewChild('gender', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition-all"
                                    >
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Tanggal Lahir</label>
                                    <input 
                                        type="date" 
                                        value={newChild.birthDate}
                                        onChange={e => setNewChild('birthDate', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-3 flex justify-end mt-2">
                                    <button 
                                        type="submit" 
                                        disabled={processingChild}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                                    >
                                        {processingChild ? 'Menyimpan...' : 'Simpan Profil'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* === KONTEN UTAMA (Tergantung Anak yg Dipilih) === */}
                    {!showAddForm && (
                        <div className="space-y-6 animate-slide-down">
                            
                            {/* BENTUK GRID ATAS: Profil & Input Pengukuran */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                {/* KARTU PROFIL ANAK (Kiri) */}
                                <div className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className={`absolute -right-10 -top-10 transition-transform duration-500 group-hover:scale-110 ${activeChild.gender === 'Laki-laki' ? 'text-blue-100/50' : 'text-pink-100/50'}`}>
                                        <Baby size={180} />
                                    </div>
                                    
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white shrink-0 ${
                                                activeChild.gender === 'Laki-laki' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-pink-400 to-rose-400'
                                            }`}>
                                                {activeChild.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{activeChild.name}</h3>
                                                <p className={`text-sm font-medium px-2 py-0.5 rounded-md inline-block mt-1 ${
                                                    activeChild.gender === 'Laki-laki' ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50'
                                                }`}>
                                                    {activeChild.gender}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/60 p-3 rounded-xl border border-gray-100 shadow-sm">
                                                <p className="text-xs text-gray-500 mb-1">Usia Saat Ini</p>
                                                <p className="font-bold text-gray-900 text-sm">{activeChild.ageStr}</p>
                                            </div>
                                            <div className="bg-white/60 p-3 rounded-xl border border-gray-100 shadow-sm">
                                                <p className="text-xs text-gray-500 mb-1">Tgl Lahir</p>
                                                <p className="font-bold text-gray-900 text-sm">{activeChild.birthDate}</p>
                                            </div>
                                            <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-100 shadow-sm">
                                                <p className="text-xs text-emerald-600 mb-1">BB Terakhir</p>
                                                <p className="font-bold text-emerald-700 text-sm flex items-center gap-1"><Scale size={14}/> {activeChild.lastWeight}</p>
                                            </div>
                                            <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100 shadow-sm">
                                                <p className="text-xs text-blue-600 mb-1">TB Terakhir</p>
                                                <p className="font-bold text-blue-700 text-sm flex items-center gap-1"><Ruler size={14}/> {activeChild.lastHeight}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FORM INPUT PENGUKURAN (Kanan Span 2) */}
                                <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                        <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600">
                                            <History size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">Catat Pengukuran Bulan Ini</h4>
                                            <p className="text-sm text-gray-500">Perbarui data untuk <strong className="text-gray-700">{activeChild.name}</strong>.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={submitMeasurement} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <CalendarDays size={16} className="text-gray-400" /> Tanggal Ukur
                                                </label>
                                                <input 
                                                    type="date" 
                                                    value={measureData.date}
                                                    onChange={e => setMeasureData('date', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Scale size={16} className="text-gray-400" /> Berat Badan (kg)
                                                </label>
                                                <input 
                                                    type="number" 
                                                    step="0.1"
                                                    placeholder="Contoh: 12.5"
                                                    value={measureData.weight}
                                                    onChange={e => setMeasureData('weight', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Ruler size={16} className="text-gray-400" /> Tinggi Badan (cm)
                                                </label>
                                                <input 
                                                    type="number" 
                                                    step="0.1"
                                                    placeholder="Contoh: 89.0"
                                                    value={measureData.height}
                                                    onChange={e => setMeasureData('height', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button 
                                                type="submit" 
                                                disabled={processingMeasure}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-md shadow-violet-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {processingMeasure ? 'Menyimpan...' : 'Simpan Pengukuran'}
                                                <Save size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* BENTUK GRID BAWAH: Grafik & Analisis AI */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                {/* GRAFIK PERTUMBUHAN KMS LEBIH DETAIL (Kiri Span 2) */}
                                <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                                                <LineChart size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900">Kurva Tumbuh Kembang</h4>
                                                <p className="text-xs text-gray-500">Visualisasi Dinamis Standar KMS</p>
                                            </div>
                                        </div>
                                        {/* TOGGLE BERAT ATAU TINGGI BADAN */}
                                        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                            <button 
                                                onClick={() => setChartType('weight')}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors ${
                                                    chartType === 'weight' ? 'bg-white text-indigo-600' : 'text-gray-500 hover:text-gray-900 bg-transparent shadow-none'
                                                }`}
                                            >
                                                Berat
                                            </button>
                                            <button 
                                                onClick={() => setChartType('height')}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors ${
                                                    chartType === 'height' ? 'bg-white text-indigo-600' : 'text-gray-500 hover:text-gray-900 bg-transparent shadow-none'
                                                }`}
                                            >
                                                Tinggi
                                            </button>
                                        </div>
                                    </div>

                                    {activeChild.history.length === 0 ? (
                                        <div className="w-full h-64 bg-white/50 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center">
                                            <div className="text-center text-gray-400">
                                                <LineChart size={40} className="mx-auto mb-2 opacity-50" />
                                                <p className="font-medium text-sm">Belum ada data pengukuran.</p>
                                                <p className="text-xs mt-1">Silakan input data bulan ini terlebih dahulu.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-72 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-end relative shadow-sm">
                                            
                                            {/* ZONA WARNA KMS (Hijau Normal, Kuning Waspada, Merah Bahaya) */}
                                            {/* Padding horizontal chart: kita asumsikan padding inner 2.5rem (40px) */}
                                            <div className="absolute inset-x-0 ml-14 mr-6 bottom-[40%] top-6 bg-emerald-50/40 z-0 rounded-t-xl border-b border-emerald-200/50"></div>
                                            <div className="absolute inset-x-0 ml-14 mr-6 bottom-[20%] top-[60%] bg-amber-50/40 z-0 border-b border-amber-200/50"></div>
                                            <div className="absolute inset-x-0 ml-14 mr-6 bottom-8 top-[80%] bg-rose-50/40 z-0 rounded-b-xl border-t border-rose-200/50"></div>
                                            
                                            {/* GRID LINES (Garis Horizontal Pembantu) */}
                                            <div className="absolute inset-0 top-6 bottom-8 flex flex-col justify-between pl-14 pr-6 pointer-events-none z-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-full h-px bg-transparent border-b border-dashed border-gray-300/40"></div>
                                                ))}
                                            </div>

                                            {/* Label Y-Axis Dinamis (Menyesuaikan Toggle) */}
                                            <div className="absolute left-2 top-0 bottom-8 flex flex-col justify-between py-4 text-[10px] text-gray-400 font-bold z-10">
                                                {yLabels.map((lbl, i) => (
                                                    <span key={i}>{lbl}</span>
                                                ))}
                                            </div>

                                            {/* PLOT DATA TITIK & GARIS PENGHUBUNG DINAMIS */}
                                            <div className="relative w-full h-full ml-8 mr-6 px-4 flex items-end pb-2 z-10">
                                                <svg 
                                                    viewBox="0 0 100 100" 
                                                    preserveAspectRatio="none" 
                                                    className="absolute inset-0 w-full h-full overflow-visible pointer-events-none chart-svg"
                                                >
                                                    {/* SVG Path yang Digenerate Secara Dinamis dari Koordinat Persentase */}
                                                    <path 
                                                        d={svgPathData} 
                                                        fill="none" 
                                                        stroke="#4f46e5" 
                                                        strokeWidth="3" 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                    />
                                                </svg>

                                                {/* Mapping Titik dan Tooltip */}
                                                {chartPoints.map((pt, i) => {
                                                    // Menampilkan label secara dinamis agar tidak sesak jika > 6 titik data
                                                    const showLabel = chartPoints.length > 6 ? i % Math.ceil(chartPoints.length / 5) === 0 : true;

                                                    return (
                                                        <div 
                                                            key={i} 
                                                            className="absolute flex flex-col items-center group w-0 h-full" 
                                                            style={{ left: `${pt.x}%` }}
                                                        >
                                                            {/* Garis Vertikal Bantu (Saat di-Hover) */}
                                                            <div className="absolute top-0 bottom-0 w-px bg-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                                            {/* Kotak Tooltip Interaktif */}
                                                            <div 
                                                                className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-30 font-medium"
                                                                style={{ bottom: `calc(${pt.cssY}% + 12px)` }}
                                                            >
                                                                <div className="font-bold text-[10px] text-gray-300 mb-0.5">{pt.bln}</div>
                                                                {pt.val} {unit}
                                                            </div>

                                                            {/* Titik Point Biru */}
                                                            <div 
                                                                className="absolute w-4 h-4 bg-white border-[4px] border-indigo-600 rounded-full cursor-pointer hover:scale-[1.6] hover:bg-indigo-50 transition-transform shadow-md z-20"
                                                                style={{ bottom: `calc(${pt.cssY}% - 8px)`, transform: 'translateX(-50%)' }}
                                                            ></div>

                                                            {/* Label X-Axis (Bulan) */}
                                                            {showLabel && (
                                                                <span className="text-[10px] font-bold text-gray-500 absolute -bottom-6 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm transform -translate-x-1/2">
                                                                    {pt.bln}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ANALISIS STUNTING AI LEBIH DETAIL (Kanan) */}
                                <div className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden bg-gradient-to-b from-white to-violet-50/40 border-violet-100">
                                    <div className="absolute -right-16 -top-16 w-40 h-40 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none z-0"></div>

                                    <div className="flex items-center gap-3 mb-5 relative z-10">
                                        <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2.5 rounded-xl text-white shadow-lg shadow-violet-200/50">
                                            <Sparkles size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 leading-tight">Insight <span className="ai-gradient-text">AI Sipandu</span></h4>
                                        </div>
                                    </div>

                                    {/* Card Analisis */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative z-10 space-y-4">
                                        {/* Status Bar */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    activeChild.aiColor === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Risiko Stunting</p>
                                                    <p className={`font-bold text-lg ${
                                                        activeChild.aiColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600'
                                                    }`}>
                                                        {activeChild.aiRisk}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px w-full bg-gray-100"></div>

                                        {/* Detail Z-Score */}
                                        <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100/50">
                                            <span className="text-xs text-gray-500 font-medium">Skor TB/U (Z-Score)</span>
                                            <span className="text-sm font-bold text-gray-900">{activeChild.zScore} SD</span>
                                        </div>

                                        {/* Insight Teks Terstruktur */}
                                        <div className="space-y-3 pt-2">
                                            <div className="flex gap-2.5">
                                                <Info size={18} className="text-violet-500 shrink-0 mt-0.5" />
                                                <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                                                    {activeChild.aiInsight}
                                                </p>
                                            </div>
                                            {activeChild.aiRisk !== 'Belum Ada Data' && (
                                                <div className="bg-violet-50 text-violet-800 text-[11px] p-3 rounded-xl border border-violet-100/50 leading-relaxed font-semibold mt-2">
                                                    <span className="text-sm mr-1">🍲</span> <strong>Rekomendasi Menu AI:</strong> Nasi Tim Hati Ayam atau Puree Udang Brokoli (Kaya Zinc & Zat Besi).
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}