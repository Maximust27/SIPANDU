import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  ScanLine, 
  Map, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  ChevronRight,
  Activity,
  Utensils,
  Lightbulb,
  FileSearch
} from 'lucide-react';

import { Head } from '@inertiajs/react';
import KaderLayout from '@/Layouts/KaderLayout';

// --- DUMMY DATA ---
const dummyRegionStats = [
    { rt: 'RT 03', rw: '03', tinggi: 12, sedang: 5, normal: 30, color: 'rose' },
    { rt: 'RT 01', rw: '03', tinggi: 5, sedang: 8, normal: 42, color: 'orange' },
    { rt: 'RT 02', rw: '03', tinggi: 2, sedang: 4, normal: 38, color: 'amber' },
];

const dummyAtRiskChildren = [
    {
        id: 1,
        name: 'Bima Satria',
        age: '2 Tahun 5 Bulan',
        region: 'RT 03 / RW 03',
        metrics: { bb: '9.4 kg', tb: '81.0 cm' },
        aiDetection: 'Berat badan stagnan selama 2 bulan. Tinggi badan di bawah kurva normal (-2 SD).',
        riskLevel: 'Tinggi', // Tinggi, Sedang, Rendah
        aiRecommendation: 'Segera rujuk ke Puskesmas. Berikan PMT (Pemberian Makanan Tambahan) tinggi protein hewani setiap hari. Edukasi gizi intensif untuk ibu.'
    },
    {
        id: 2,
        name: 'Clara Putri',
        age: '1 Tahun 2 Bulan',
        region: 'RT 01 / RW 03',
        metrics: { bb: '7.8 kg', tb: '72.5 cm' },
        aiDetection: 'Kenaikan berat badan melambat (hanya +100g dari bulan lalu). Perkembangan motorik belum optimal sesuai usia.',
        riskLevel: 'Sedang',
        aiRecommendation: 'Pantau ketat di posyandu bulan depan. Evaluasi pola MPASI harian. Sarankan variasi menu dengan tambahan lemak sehat (santan/minyak zaitun).'
    }
];

export default function AIMonitoring() {
    // State untuk AI Scan KIA
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleUploadKIA = () => {
        setIsScanning(true);
        setScanComplete(false);
        setScannedData(null);
        
        // Simulasi proses OCR/AI baca gambar selama 3 detik
        setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
            setScannedData({
                childName: 'Dika Ramadhan',
                age: '18 Bulan',
                weight: '10.2',
                height: '79.5',
                headCirc: '46.0',
                date: '15 Mei 2026'
            });
            showToast('Data berhasil diekstrak oleh AI Sipandu!');
        }, 3000);
    };

    const handleSaveScan = () => {
        setScanComplete(false);
        setScannedData(null);
        showToast('Data KIA berhasil di-input ke sistem secara otomatis.');
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
                            <Sparkles size={14} /> Sipandu AI Assistant v2.0
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                            Pemantauan Cerdas Berbasis AI
                        </h3>
                        <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
                            Sistem secara otomatis menganalisis anomali pertumbuhan, mendeteksi risiko stunting lebih awal, dan memetakan persebaran gizi buruk di wilayah kerja Anda.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    
                    {/* === SISI KIRI: SCAN KIA & ANALITIK WILAYAH === */}
                    <div className="lg:col-span-1 space-y-6 lg:space-y-8">
                        
                        {/* FITUR E: AI SCAN BUKU KIA */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-purple-600"></div>
                            
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                                <ScanLine size={20} className="text-fuchsia-600" /> AI Scan Buku KIA
                            </h4>
                            <p className="text-xs text-gray-500 mb-6">Upload foto tabel KMS, biarkan AI yang mengetik datanya.</p>

                            {!scanComplete && !isScanning && (
                                <button 
                                    onClick={handleUploadKIA}
                                    className="w-full border-2 border-dashed border-gray-200 hover:border-fuchsia-400 bg-gray-50 hover:bg-fuchsia-50/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-colors group-hover:shadow-inner"
                                >
                                    <div className="bg-white p-3 rounded-full shadow-sm text-gray-400 group-hover:text-fuchsia-500 transition-colors">
                                        <UploadCloud size={28} />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-sm font-bold text-gray-700">Pilih Foto Buku KIA</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Atau drag & drop ke sini</p>
                                    </div>
                                </button>
                            )}

                            {isScanning && (
                                <div className="w-full border-2 border-dashed border-fuchsia-200 bg-fuchsia-50/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
                                    <div className="relative">
                                        <FileSearch size={36} className="text-fuchsia-400 opacity-20" />
                                        <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500 shadow-[0_0_8px_#d946ef] animate-[bounce_1.5s_infinite]"></div>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-sm font-bold text-fuchsia-700 animate-pulse">AI sedang mengekstrak data...</p>
                                        <p className="text-xs text-fuchsia-600/70">Menganalisis tulisan tangan</p>
                                    </div>
                                </div>
                            )}

                            {scanComplete && scannedData && (
                                <div className="space-y-4 animate-slide-down">
                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 relative overflow-hidden">
                                        <div className="absolute -right-4 -bottom-4 text-green-200/50">
                                            <CheckCircle2 size={80} />
                                        </div>
                                        <h5 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">Hasil Ekstraksi AI</h5>
                                        
                                        <div className="grid grid-cols-2 gap-3 text-sm relative z-10">
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">Nama Anak</p>
                                                <p className="font-bold text-gray-900">{scannedData.childName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">Umur</p>
                                                <p className="font-bold text-gray-900">{scannedData.age}</p>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-green-100 shadow-sm mt-1">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">Berat Badan</p>
                                                <p className="font-black text-emerald-600">{scannedData.weight} kg</p>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-green-100 shadow-sm mt-1">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">Tinggi Badan</p>
                                                <p className="font-black text-emerald-600">{scannedData.height} cm</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {setScanComplete(false); setScannedData(null)}}
                                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            onClick={handleSaveScan}
                                            className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-fuchsia-200"
                                        >
                                            Auto-Input ke Sistem
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FITUR C: AI ANALITIK WILAYAH */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                                <Map size={20} className="text-blue-600" /> Analitik Wilayah (Live)
                            </h4>
                            <p className="text-xs text-gray-500 mb-6">Tren kasus berisiko stunting per RT/RW bulan ini.</p>

                            <div className="space-y-5">
                                {dummyRegionStats.map((stat, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                                            <span>{stat.rt}</span>
                                            <span className={`text-${stat.color}-600 bg-${stat.color}-50 px-2 py-0.5 rounded-md`}>
                                                {stat.tinggi} Risiko Tinggi
                                            </span>
                                        </div>
                                        
                                        {/* Progress Bar Kombinasi (Mock Grafik) */}
                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                                            <div 
                                                className={`h-full bg-${stat.color}-500`} 
                                                style={{ width: `${(stat.tinggi / (stat.tinggi+stat.sedang+stat.normal)) * 100}%` }}
                                                title="Risiko Tinggi"
                                            ></div>
                                            <div 
                                                className="h-full bg-amber-400" 
                                                style={{ width: `${(stat.sedang / (stat.tinggi+stat.sedang+stat.normal)) * 100}%` }}
                                                title="Risiko Sedang"
                                            ></div>
                                            <div 
                                                className="h-full bg-emerald-400" 
                                                style={{ width: `${(stat.normal / (stat.tinggi+stat.sedang+stat.normal)) * 100}%` }}
                                                title="Normal"
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                            <span>Normal: {stat.normal}</span>
                                            <span>Waspada: {stat.sedang}</span>
                                        </div>
                                    </div>
                                ))}
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
                                <p className="text-sm text-gray-500 mt-1">Balita yang membutuhkan intervensi segera berdasarkan algoritma WHO.</p>
                            </div>
                            <div className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-100">
                                2 Kasus Ditemukan
                            </div>
                        </div>

                        <div className="space-y-6">
                            {dummyAtRiskChildren.map((child) => (
                                <div key={child.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                    
                                    {/* Header Card Anak */}
                                    <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-white shadow-inner flex items-center justify-center font-black text-xl text-gray-600">
                                                {child.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-gray-900">{child.name}</h4>
                                                <p className="text-xs text-gray-500 font-medium">{child.age} • {child.region}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-center">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">BB Terakhir</p>
                                                <p className="text-sm font-black text-gray-800">{child.metrics.bb}</p>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-center">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">TB Terakhir</p>
                                                <p className="text-sm font-black text-gray-800">{child.metrics.tb}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fitur A & B: Deteksi AI */}
                                    <div className={`p-6 border-b ${child.riskLevel === 'Tinggi' ? 'bg-rose-50/30 border-rose-50' : 'bg-orange-50/30 border-orange-50'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-1.5 rounded-full ${child.riskLevel === 'Tinggi' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}`}>
                                                <TrendingDown size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="text-sm font-bold text-gray-900">Analisis Perkembangan</h5>
                                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                                        child.riskLevel === 'Tinggi' ? 'bg-rose-600 text-white' : 'bg-orange-500 text-white'
                                                    }`}>
                                                        Risiko {child.riskLevel}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {child.aiDetection}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fitur D: Rekomendasi Penanganan AI */}
                                    <div className="p-6 bg-indigo-50/30">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 p-1.5 bg-indigo-100 text-indigo-600 rounded-full">
                                                <Lightbulb size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-sm font-bold text-gray-900 mb-1">Rekomendasi Penanganan</h5>
                                                <p className="text-sm text-indigo-900/80 leading-relaxed mb-4">
                                                    {child.aiRecommendation}
                                                </p>
                                                
                                                <div className="flex flex-wrap gap-2">
                                                    <button className="text-xs font-bold bg-white border border-indigo-100 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1.5 shadow-sm">
                                                        <Utensils size={14} /> Beri Status PMT
                                                    </button>
                                                    <button className="text-xs font-bold bg-white border border-indigo-100 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1.5 shadow-sm">
                                                        <FileText size={14} /> Buat Surat Rujukan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </KaderLayout>
    );
}