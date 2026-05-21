import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  BarChart3, 
  ShieldAlert, 
  Syringe, 
  Calendar,
  Building2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LayoutDashboard,
  Users,
  UserCog,
  Database,
  Menu,
  X,
  Bell,
  Activity,
  LogOut,
  Settings,
  Search,
  PieChart
} from 'lucide-react';

import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Reports({ initialStuntingData, initialImunisasiData, currentYear }) {
    // Pengecekan aman fallback
    const stuntingData = initialStuntingData || (typeof fallbackStuntingData !== 'undefined' ? fallbackStuntingData : { monthly: [], regions: [] });
    const imunisasiData = initialImunisasiData || (typeof fallbackImunisasiData !== 'undefined' ? fallbackImunisasiData : { monthly: [], regions: [] });

    const [activeTab, setActiveTab] = useState('stunting'); // 'stunting' | 'imunisasi'
    const [selectedYear, setSelectedYear] = useState(currentYear || '2026');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (currentYear) {
            setSelectedYear(currentYear);
        }
    }, [currentYear]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        router.get(route('admin.reports.index'), { year }, { preserveState: true });
    };

    const handleExportExcel = () => {
        showToast(`Memproses dokumen Excel...`);
        let csvRows = [];
        if (activeTab === 'stunting') {
            csvRows.push(["Laporan Kasus Stunting Posyandu - Tahun " + selectedYear]);
            csvRows.push([]);
            csvRows.push(["Nama Posyandu", "Total Balita", "Jumlah Stunting", "Persentase"]);
            stuntingData.regions.forEach(r => {
                csvRows.push([r.name, r.totalAnak, r.stunting, r.percentage]);
            });
        } else {
            csvRows.push(["Laporan Cakupan Imunisasi Posyandu - Tahun " + selectedYear]);
            csvRows.push([]);
            csvRows.push(["Nama Posyandu", "Target Sasaran", "Telah Diimunisasi", "Persentase"]);
            imunisasiData.regions.forEach(r => {
                csvRows.push([r.name, r.target, r.achieved, r.percentage]);
            });
        }

        const csvContent = "\ufeffsep=;\n" + csvRows.map(e => e.map(val => `"${val}"`).join(";")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Laporan_${activeTab}_${selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Laporan Excel (${activeTab}) berhasil diunduh.`);
    };

    const handleExportPDF = () => {
        showToast(`Membuka jendela cetak PDF...`);
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showToast('Gagal membuka jendela cetak. Pastikan pop-up tidak diblokir.', 'error');
            return;
        }

        const title = activeTab === 'stunting' ? 'Laporan Kasus Stunting Posyandu' : 'Laporan Cakupan Imunisasi Posyandu';
        const headers = activeTab === 'stunting' 
            ? ['Nama Posyandu', 'Total Balita', 'Jumlah Stunting', 'Persentase'] 
            : ['Nama Posyandu', 'Target Sasaran', 'Telah Diimunisasi', 'Persentase'];

        const rows = activeTab === 'stunting'
            ? stuntingData.regions.map(r => `
                <tr>
                    <td>${r.name}</td>
                    <td>${r.totalAnak} Anak</td>
                    <td style="color: #e11d48; font-weight: bold;">${r.stunting} Kasus</td>
                    <td><span style="background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${r.percentage}</span></td>
                </tr>
            `).join('')
            : imunisasiData.regions.map(r => `
                <tr>
                    <td>${r.name}</td>
                    <td>${r.target} Anak</td>
                    <td style="color: #059669; font-weight: bold;">${r.achieved} Selesai</td>
                    <td><span style="background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${r.percentage}</span></td>
                </tr>
            `).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>${title} - ${selectedYear}</title>
                    <style>
                        body {
                            font-family: 'Inter', system-ui, sans-serif;
                            color: #1e293b;
                            padding: 40px;
                            line-height: 1.5;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 40px;
                            border-bottom: 3px double #cbd5e1;
                            padding-bottom: 20px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            color: #0f172a;
                        }
                        .header p {
                            margin: 5px 0 0 0;
                            color: #64748b;
                            font-size: 14px;
                        }
                        .meta-info {
                            margin-bottom: 20px;
                            font-size: 14px;
                            display: flex;
                            justify-content: space-between;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 10px;
                        }
                        th, td {
                            border: 1px solid #e2e8f0;
                            padding: 12px 15px;
                            text-align: left;
                            font-size: 14px;
                        }
                        th {
                            background-color: #0f172a;
                            color: white;
                            font-weight: 600;
                        }
                        tr:nth-child(even) {
                            background-color: #f8fafc;
                        }
                        .footer {
                            margin-top: 50px;
                            text-align: right;
                            font-size: 12px;
                            color: #94a3b8;
                        }
                        @media print {
                            body { padding: 0; }
                            button { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>SIPANDU - SISTEM PELAYANAN TERPADU</h1>
                        <p>Rekapitulasi Data Kesehatan Balita & Layanan Posyandu</p>
                    </div>
                    <div class="meta-info">
                        <div><strong>Jenis Laporan:</strong> ${title}</div>
                        <div><strong>Tahun Laporan:</strong> ${selectedYear}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                ${headers.map(h => `<th>${h}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                    <div class="footer">
                        Dokumen dicetak secara otomatis dari Sistem SIPANDU pada ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // --- LOGIC GRAFIK SVG ---
    const chartData = activeTab === 'stunting' ? stuntingData.monthly : imunisasiData.monthly;
    const maxVal = chartData.length > 0 ? Math.max(...chartData.map(d => d.cases)) : 100;
    const minVal = 0; // Mulai dari 0 untuk Bar Chart agar proporsional
    const chartRange = maxVal - minVal || 1;

    return (
        <AdminLayout 
            headerTitle="Laporan & Rekapitulasi Data" 
            headerIcon={<PieChart size={20} />}
        >
            <Head title="Laporan & Analitik - Sipandu Admin" />

            {/* TOAST NOTIFIKASI */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl text-white font-bold flex items-center gap-3 shadow-2xl transition-all animate-slide-down border ${
                    toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-blue-600 border-blue-500'
                }`}>
                    {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                    {toast.message}
                </div>
            )}

            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 min-h-full bg-slate-50">
                {/* --- HEADER CONTROL (TABS & EXPORT) --- */}
                <div className="bg-white p-2.5 sm:p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
                    
                    {/* Tabs */}
                    <div className="flex bg-slate-50 p-1.5 rounded-3xl w-full lg:w-auto overflow-x-auto no-scrollbar border border-slate-100">
                        <button 
                            onClick={() => setActiveTab('stunting')}
                            className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-2xl transition-all whitespace-nowrap flex-1 lg:flex-none ${
                                activeTab === 'stunting' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <ShieldAlert size={18} /> Laporan Stunting
                        </button>
                        <button 
                            onClick={() => setActiveTab('imunisasi')}
                            className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-2xl transition-all whitespace-nowrap flex-1 lg:flex-none ${
                                activeTab === 'imunisasi' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <Syringe size={18} /> Laporan Imunisasi
                        </button>
                    </div>

                    {/* Export Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full lg:w-auto pr-0 lg:pr-2">
                        <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-2xl transition-colors">
                            <Calendar size={18} className="text-slate-400" />
                            <select 
                                value={selectedYear}
                                onChange={(e) => handleYearChange(e.target.value)}
                                className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                            >
                                <option value="2026">Tahun 2026</option>
                                <option value="2025">Tahun 2025</option>
                                <option value="2024">Tahun 2024</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleExportPDF}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 hover:border-rose-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm group"
                        >
                            <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" /> PDF
                        </button>
                        <button 
                            onClick={handleExportExcel}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 border border-emerald-200 hover:border-emerald-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm group"
                        >
                            <FileSpreadsheet size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Excel
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    
                    {/* --- GRAFIK BULANAN (SPAN 2) --- */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <BarChart3 size={20} className={activeTab === 'stunting' ? 'text-rose-500' : 'text-emerald-500'} />
                                    Grafik {activeTab === 'stunting' ? 'Kasus Stunting' : 'Cakupan Imunisasi'} Bulanan
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Tren data kumulatif dari seluruh posyandu di wilayah kerja.
                                </p>
                            </div>
                            {activeTab === 'stunting' ? (
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 shadow-sm">
                                    <TrendingDown size={14} /> Kasus Menurun
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-200 shadow-sm">
                                    <TrendingUp size={14} /> Cakupan Naik
                                </div>
                            )}
                        </div>

                        {/* Area Chart SVG Kustom */}
                        <div className="h-72 w-full pt-4 relative flex items-end justify-between px-2 sm:px-6">
                            {/* Garis Horizontal Pembantu */}
                            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none z-0">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full border-b border-dashed border-slate-200/60 relative">
                                        <span className="absolute -top-2.5 -left-1 sm:-left-4 text-[9px] font-bold text-slate-400 bg-white pr-2">
                                            {Math.round(maxVal - (i * (maxVal / 4)))}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bar Chart Data */}
                            {chartData.map((d, index) => {
                                const heightPercentage = (d.cases / maxVal) * 100;
                                return (
                                    <div key={index} className="relative flex flex-col items-center justify-end h-full w-12 sm:w-16 group z-10">
                                        {/* Tooltip Hover */}
                                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-xl pointer-events-none transform group-hover:-translate-y-1">
                                            <span className="block text-[10px] font-medium text-slate-400 mb-0.5">{d.month} {selectedYear}</span>
                                            {d.cases} {activeTab === 'stunting' ? 'Kasus' : 'Vaksin'}
                                        </div>
                                        
                                        {/* Bar SVG */}
                                        <div 
                                            className={`w-10 sm:w-12 rounded-t-xl transition-all duration-500 group-hover:opacity-80 ${
                                                activeTab === 'stunting' 
                                                ? 'bg-gradient-to-t from-rose-500 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                                                : 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                            }`}
                                            style={{ height: `calc(${heightPercentage}% - 32px)` }}
                                        ></div>
                                        
                                        {/* Label X-Axis */}
                                        <span className="text-xs font-bold text-slate-500 mt-3 h-6">{d.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- KARTU RINGKASAN (SPAN 1) - DIPERBAIKI WARNA TEKSNYA --- */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center">
                            <div className={`absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 ${
                                activeTab === 'stunting' ? 'text-rose-500' : 'text-emerald-500'
                            }`}>
                                {activeTab === 'stunting' ? <ShieldAlert size={150} /> : <Syringe size={150} />}
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-500">
                                    Total {activeTab === 'stunting' ? 'Kasus Stunting' : 'Imunisasi Diberikan'}
                                </p>
                                <h2 className={`text-5xl font-black mb-4 tracking-tight ${
                                    activeTab === 'stunting' ? 'text-rose-600' : 'text-emerald-600'
                                }`}>
                                    {chartData.length > 0 ? chartData[chartData.length - 1]?.cases.toLocaleString('id-ID') : 0}
                                </h2>
                                <div className={`px-4 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-2 shadow-sm ${
                                    activeTab === 'stunting' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                }`}>
                                    <Activity size={14} />
                                    Update: {chartData.length > 0 ? chartData[chartData.length - 1]?.month : '-'} {selectedYear}
                                </div>
                            </div>
                        </div>

                        {/* Info / Bantuan */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                            <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <FileText size={18} className="text-blue-500" /> Catatan Sistem
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                Laporan ditarik secara <span className="font-semibold text-slate-800">real-time</span> dari input kader. 
                                Ekspor ke <strong>PDF</strong> cocok untuk dicetak, sedangkan <strong>Excel</strong> untuk diolah lebih lanjut.
                            </p>
                        </div>
                    </div>

                </div>

                {/* --- TABEL RINCIAN PER POSYANDU --- */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mt-6">
                    <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-lg font-bold text-slate-900">Rincian Data per Posyandu</h4>
                            <p className="text-sm text-slate-500 mt-1">Detail agregat berdasarkan lokasi pendaftaran fasilitas.</p>
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <Search size={16} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari posyandu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 bg-slate-50 border border-slate-200 text-sm rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                                    <th className="p-5 pl-6 sm:pl-8">Nama Posyandu</th>
                                    <th className="p-5">{activeTab === 'stunting' ? 'Total Balita' : 'Target Sasaran'}</th>
                                    <th className="p-5">{activeTab === 'stunting' ? 'Jumlah Stunting' : 'Telah Diimunisasi'}</th>
                                    <th className="p-5">Persentase</th>
                                    <th className="p-5 pr-6 sm:pr-8 text-right">Status Wilayah</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {activeTab === 'stunting' ? (
                                    stuntingData.regions.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                                                <Search size={32} className="mx-auto mb-2 text-slate-300" />
                                                Data posyandu tidak ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        stuntingData.regions
                                            .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((region, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="p-5 pl-6 sm:pl-8 font-bold text-slate-900 flex items-center gap-3">
                                                        <div className="bg-slate-100 p-2 rounded-xl text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                            <Building2 size={16} />
                                                        </div>
                                                        {region.name}
                                                    </td>
                                                    <td className="p-5 font-semibold text-slate-600">{region.totalAnak} <span className="text-xs font-normal text-slate-400">Anak</span></td>
                                                    <td className="p-5 font-bold text-rose-600 bg-rose-50/30">{region.stunting} <span className="text-xs font-normal text-rose-400">Kasus</span></td>
                                                    <td className="p-5">
                                                        <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold border border-slate-200 shadow-sm">{region.percentage}</span>
                                                    </td>
                                                    <td className="p-5 pr-6 sm:pr-8 text-right">
                                                        {parseFloat(region.percentage) > 10 ? (
                                                            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"><AlertTriangle size={14}/> Bahaya</span>
                                                        ) : parseFloat(region.percentage) > 5 ? (
                                                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"><AlertTriangle size={14}/> Waspada</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"><CheckCircle size={14}/> Aman</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                    )
                                ) : (
                                    imunisasiData.regions.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                                                <Search size={32} className="mx-auto mb-2 text-slate-300" />
                                                Data posyandu tidak ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        imunisasiData.regions
                                            .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((region, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="p-5 pl-6 sm:pl-8 font-bold text-slate-900 flex items-center gap-3">
                                                        <div className="bg-slate-100 p-2 rounded-xl text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                            <Building2 size={16} />
                                                        </div>
                                                        {region.name}
                                                    </td>
                                                    <td className="p-5 font-semibold text-slate-600">{region.target} <span className="text-xs font-normal text-slate-400">Anak</span></td>
                                                    <td className="p-5 font-bold text-emerald-600 bg-emerald-50/30">{region.achieved} <span className="text-xs font-normal text-emerald-400">Berhasil</span></td>
                                                    <td className="p-5">
                                                        <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold border border-slate-200 shadow-sm">{region.percentage}</span>
                                                    </td>
                                                    <td className="p-5 pr-6 sm:pr-8 text-right">
                                                        {parseFloat(region.percentage) >= 90 ? (
                                                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"><CheckCircle size={14}/> Tercapai</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"><AlertTriangle size={14}/> Blm Optimal</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}