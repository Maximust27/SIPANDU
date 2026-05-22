import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Ruler, 
  TrendingUp, 
  Plus, 
  Baby, 
  Users, 
  Heart, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  X, 
  LineChart, 
  History, 
  Brain
} from 'lucide-react';

import { Head, router } from '@inertiajs/react';
import KaderLayout from '@/Layouts/KaderLayout';

export default function GrowthMonitoring({ initialChildren = [] }) {
  const [childrenList, setChildrenList] = useState(initialChildren || []);
  const [selectedChildId, setSelectedChildId] = useState(initialChildren[0]?.id || null);
  const [measureType, setMeasureType] = useState('weight'); // 'weight', 'height', 'headCirc'

  // Form states
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCirc, setHeadCirc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Validation alerts state
  const [validationAlerts, setValidationAlerts] = useState([]);
  const [toast, setToast] = useState(null);

  // Synchronize local state with props from server
  useEffect(() => {
    setChildrenList(initialChildren || []);
    if (initialChildren && initialChildren.length > 0) {
      if (!selectedChildId || !initialChildren.some(c => c.id === selectedChildId)) {
        setSelectedChildId(initialChildren[0].id);
      }
    }
  }, [initialChildren]);

  const selectedChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0] || null;
  const lastMeasurement = selectedChild?.measurements?.[0] || null;

  // --- AUTOMATIC WHO STATUS CALCULATOR ---
  const calculateAutomaticStatus = (w, h, hc, age) => {
    let gizi = 'Gizi Baik (Normal)';
    let tinggi = 'Normal';
    let kepala = 'Normal';

    if (age <= 12) {
      if (w < 6.0) gizi = 'Gizi Buruk (Bahaya)';
      else if (w < 7.5) gizi = 'Gizi Kurang (Waspada)';
      else if (w > 12.0) gizi = 'Gizi Lebih (Obesitas)';
    } else {
      if (w < 9.0) gizi = 'Gizi Buruk (Bahaya)';
      else if (w < 11.0) gizi = 'Gizi Kurang (Waspada)';
      else if (w > 16.5) gizi = 'Gizi Lebih (Obesitas)';
    }

    if (age <= 12) {
      if (h < 65.0) tinggi = 'Sangat Pendek (Severely Stunted)';
      else if (h < 70.0) tinggi = 'Pendek (Stunted)';
      else if (h > 82.0) tinggi = 'Tinggi';
    } else {
      if (h < 78.0) tinggi = 'Sangat Pendek (Severely Stunted)';
      else if (h < 83.5) tinggi = 'Pendek (Stunted)';
      else if (h > 98.0) tinggi = 'Tinggi';
    }

    if (hc < 42.0) kepala = 'Kecil (Mikrosefali)';
    else if (hc > 52.0) kepala = 'Besar (Makrosefali)';

    return { gizi, tinggi, kepala };
  };

  // --- VALIDASI DATA INPUT REAL-TIME ---
  useEffect(() => {
    const alerts = [];
    if (!lastMeasurement) return;

    const wNum = parseFloat(weight);
    const hNum = parseFloat(height);
    const hcNum = parseFloat(headCirc);

    if (wNum && wNum < lastMeasurement.weight) {
      const drop = (lastMeasurement.weight - wNum).toFixed(1);
      alerts.push({
        type: 'warning',
        message: `Perhatian: Berat badan anak turun ${drop} kg dibandingkan bulan lalu (${lastMeasurement.weight} kg).`
      });
    }

    if (hNum && hNum < lastMeasurement.height) {
      alerts.push({
        type: 'error',
        message: `Gagal Validasi: Tinggi badan tidak boleh lebih pendek dari bulan lalu (${lastMeasurement.height} cm).`
      });
    }

    if (wNum && (wNum < 1 || wNum > 45)) {
      alerts.push({
        type: 'error',
        message: `Nilai Tidak Valid: Angka berat badan (${wNum} kg) tampaknya tidak logis untuk balita.`
      });
    }

    setValidationAlerts(alerts);
  }, [weight, height, headCirc, selectedChildId]);

  // --- SUBMIT MEASUREMENT ---
  const handleSaveMeasurement = (e) => {
    e.preventDefault();
    if (!selectedChild) {
      setToast({
        type: 'error',
        text: 'Silakan pilih balita terlebih dahulu!'
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const hasFatalError = validationAlerts.some(a => a.type === 'error');
    if (hasFatalError) {
      setToast({
        type: 'error',
        text: 'Gagal Menyimpan! Selesaikan kesalahan validasi data terlebih dahulu.'
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const wNum = parseFloat(weight);
    const hNum = height ? parseFloat(height) : null;
    const hcNum = headCirc ? parseFloat(headCirc) : null;

    router.post(route('kader.growth-monitoring.store', selectedChild.id), {
      measured_at: date,
      weight: wNum,
      height: hNum,
      head_circumference: hcNum,
    }, {
      onSuccess: () => {
        setToast({
          type: 'success',
          text: `Data pertumbuhan ${selectedChild.name} berhasil direkam ke KMS!`
        });
        setTimeout(() => setToast(null), 4000);
        setWeight('');
        setHeight('');
        setHeadCirc('');
      },
      onError: (err) => {
        const errorMsg = Object.values(err)[0] || 'Gagal menyimpan data pengukuran.';
        setToast({
          type: 'error',
          text: errorMsg
        });
        setTimeout(() => setToast(null), 4000);
      }
    });
  };

  // --- PERSENTASE TITIK PADA GRAFIK KMS ---
  const points = selectedChild?.measurements ? [...selectedChild.measurements].slice(-5) : [];
  const maxChartVal = measureType === 'weight' ? 18 : measureType === 'height' ? 110 : 55;
  const minChartVal = measureType === 'weight' ? 2 : measureType === 'height' ? 50 : 30;
  const range = maxChartVal - minChartVal;

  const unit = measureType === 'weight' ? 'kg' : 'cm';
  const chartPoints = points.map((p, idx) => {
    const val = measureType === 'weight' ? p.weight : measureType === 'height' ? p.height : p.headCirc;
    const x = (idx / Math.max(points.length - 1, 1)) * 100;
    const cssY = ((val - minChartVal) / range) * 100;
    const svgY = 100 - cssY;
    const formattedDate = p.date ? new Date(p.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    return { ...p, x, svgY, cssY, val, formattedDate };
  });

  const svgPath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.svgY}`).join(' ');
  const svgAreaPath = chartPoints.length > 0 
    ? `${svgPath} L ${chartPoints[chartPoints.length - 1].x} 100 L ${chartPoints[0].x} 100 Z` 
    : '';
  const yLabels = [...Array(5)].map((_, i) => (maxChartVal - (i * (range / 4))).toFixed(0));

  return (
    <KaderLayout 
      headerTitle="Monitoring Pertumbuhan (KMS)"
      headerIcon={<TrendingUp size={22} />}
    >
      <Head title="Monitoring Pertumbuhan - Sipandu" />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl text-white font-bold flex items-center gap-3 shadow-2xl transition-all ${
          toast.type === 'error' ? 'bg-rose-600 border border-rose-500' : 'bg-emerald-600 border border-emerald-500'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {toast.text}
        </div>
      )}

      <div className="p-4 sm:p-8 space-y-6">
        
        {/* CHOOSE BALITA */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Pilih Balita Aktif</h4>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {childrenList.map(child => (
              <button
                key={child.id}
                onClick={() => { setSelectedChildId(child.id); setWeight(''); setHeight(''); setHeadCirc(''); }}
                className={`flex items-center gap-3 p-3 pr-6 rounded-[1.25rem] border transition-all shrink-0 ${
                  selectedChildId === child.id
                    ? 'bg-white border-emerald-300 shadow-md shadow-emerald-100/50 scale-[1.02]'
                    : 'bg-white/80 border-gray-100 hover:border-emerald-100'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${
                  child.gender === 'Laki-laki' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-pink-400 to-rose-400'
                }`}>
                  {child.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold leading-tight ${selectedChildId === child.id ? 'text-gray-900' : 'text-gray-600'}`}>{child.name}</p>
                  <p className="text-xs text-gray-400 font-medium">{child.ageStr}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN: INPUT DATA */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Brain size={18} className="text-emerald-600 animate-pulse" /> Status Gizi Otomatis WHO
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/30">
                  <span className="text-xs font-bold text-gray-500 uppercase">BB / Umur</span>
                  <span className={`text-xs font-black ${
                    lastMeasurement?.statusGizi?.includes('Kurang') ? 'text-amber-600' : lastMeasurement?.statusGizi?.includes('Buruk') ? 'text-rose-600' : 'text-emerald-700'
                  }`}>
                    {lastMeasurement ? lastMeasurement.statusGizi : 'Belum Ada'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-teal-50/50 rounded-xl border border-teal-100/30">
                  <span className="text-xs font-bold text-gray-500 uppercase">TB / Umur</span>
                  <span className={`text-xs font-black ${
                    lastMeasurement?.statusTinggi?.includes('Stunted') ? 'text-rose-600' : 'text-teal-700'
                  }`}>
                    {lastMeasurement ? lastMeasurement.statusTinggi : 'Belum Ada'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl border border-blue-100/30">
                  <span className="text-xs font-bold text-gray-500 uppercase">LK / Umur</span>
                  <span className="text-xs font-black text-blue-700">
                    {lastMeasurement ? lastMeasurement.statusKepala : 'Belum Ada'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveMeasurement} className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 relative">
              <h4 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">Input Pengukuran Baru</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Tanggal Pengukuran</label>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Berat Badan (kg)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.01"
                      required
                      placeholder="Contoh: 12.4"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">kg</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Tinggi Badan (cm)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      required
                      placeholder="Contoh: 88.5"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">cm</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Lingkar Kepala (cm)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      required
                      placeholder="Contoh: 48.2"
                      value={headCirc}
                      onChange={e => setHeadCirc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">cm</span>
                  </div>
                </div>
              </div>

              {validationAlerts.length > 0 && (
                <div className="space-y-2 pt-2">
                  {validationAlerts.map((alert, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-medium ${
                        alert.type === 'error' 
                          ? 'bg-rose-50 border-rose-200 text-rose-700' 
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <p>{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#059669' }}
              >
                <Plus size={16} /> Rekam Pertumbuhan
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: GRAPH & LIST */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                    <LineChart size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Kurva Pertumbuhan Balita (KMS)</h4>
                    <p className="text-xs text-gray-400">Visualisasi standar rujukan KMS Kemenkes</p>
                  </div>
                </div>

                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                  <button 
                    onClick={() => setMeasureType('weight')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors ${
                      measureType === 'weight' ? 'bg-white text-emerald-700' : 'text-gray-500 bg-transparent shadow-none'
                    }`}
                  >
                    Berat
                  </button>
                  <button 
                    onClick={() => setMeasureType('height')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors ${
                      measureType === 'height' ? 'bg-white text-emerald-700' : 'text-gray-500 bg-transparent shadow-none'
                    }`}
                  >
                    Tinggi
                  </button>
                  <button 
                    onClick={() => setMeasureType('headCirc')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors ${
                      measureType === 'headCirc' ? 'bg-white text-emerald-700' : 'text-gray-500 bg-transparent shadow-none'
                    }`}
                  >
                    Kepala
                  </button>
                </div>
              </div>

              {points.length === 0 ? (
                <div className="h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-400">Belum ada riwayat pengukuran.</p>
                </div>
              ) : (
                <div className="w-full h-80 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-end relative shadow-inner">
                  <div className="absolute inset-x-0 ml-14 mr-6 bottom-[40%] top-6 bg-emerald-50/40 z-0 rounded-t-xl border-b border-emerald-200/50 flex items-center justify-end pr-4 pointer-events-none">
                    <span className="text-[9px] font-bold text-emerald-600/50 uppercase tracking-widest">ZONA NORMAL (BAIK)</span>
                  </div>
                  <div className="absolute inset-x-0 ml-14 mr-6 bottom-[20%] top-[60%] bg-amber-50/40 z-0 border-b border-amber-200/50 flex items-center justify-end pr-4 pointer-events-none">
                    <span className="text-[9px] font-bold text-amber-600/50 uppercase tracking-widest">ZONA WASPADA (KURANG)</span>
                  </div>
                  <div className="absolute inset-x-0 ml-14 mr-6 bottom-8 top-[80%] bg-rose-50/40 z-0 rounded-b-xl border-t border-rose-200/50 flex items-center justify-end pr-4 pointer-events-none">
                    <span className="text-[9px] font-bold text-rose-600/50 uppercase tracking-widest">ZONA BAHAYA (BURUK)</span>
                  </div>

                  <div className="absolute inset-0 top-6 bottom-8 flex flex-col justify-between pl-14 pr-6 pointer-events-none z-0">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-full h-px border-b border-dashed border-gray-300/30"></div>
                    ))}
                  </div>

                  <div className="absolute left-2 top-6 bottom-8 flex flex-col justify-between text-[10px] text-gray-400 font-bold z-10">
                    {yLabels.map((lbl, i) => (
                      <span key={i}>
                        {lbl} {i === 0 ? unit : ''}
                      </span>
                    ))}
                  </div>

                  <div className="absolute left-14 right-6 top-6 bottom-8 z-10">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                      <defs>
                        <linearGradient id="kaderChartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {svgAreaPath && (
                        <path d={svgAreaPath} fill="url(#kaderChartGradient)" />
                      )}
                      <path d={svgPath} fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ vectorEffect: 'non-scaling-stroke' }} />
                    </svg>

                    {chartPoints.map((pt, idx) => (
                      <div key={idx} className="absolute flex flex-col items-center group w-0 h-full" style={{ left: `${pt.x}%` }}>
                        <div className="absolute top-0 bottom-0 w-px bg-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div 
                          className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white p-3 rounded-xl shadow-2xl pointer-events-none z-30 transform -translate-x-1/2 -translate-y-2 whitespace-nowrap text-center" 
                          style={{ bottom: `calc(${pt.cssY}% + 16px)` }}
                        >
                          <p className="text-[11px] font-bold text-gray-300 mb-1">{pt.formattedDate}</p>
                          <p className="text-sm font-black">{pt.val} {unit}</p>
                        </div>
                        
                        {/* Label Nilai Langsung Di Atas Titik */}
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-50/95 border border-emerald-100 rounded-md px-1 py-0.5 shadow-sm absolute transform -translate-x-1/2 -translate-y-5 pointer-events-none z-10" style={{ bottom: `${pt.cssY}%` }}>
                          {pt.val} {unit}
                        </span>

                        <div 
                          className="absolute w-4 h-4 bg-white border-[4px] border-emerald-600 rounded-full cursor-pointer hover:scale-[1.6] hover:bg-emerald-50 transition-transform shadow-md z-20"
                          style={{ bottom: `calc(${pt.cssY}% - 8px)`, transform: 'translateX(-50%)' }}
                        ></div>
                        <span className="text-[10px] font-bold text-gray-500 absolute -bottom-6 bg-white px-1.5 py-0.5 rounded border border-gray-100 transform -translate-x-1/2">
                          {pt.date.slice(5)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <History size={20} className="text-gray-400" /> Riwayat Pemeriksaan KMS (Buku KIA)
              </h4>

              <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                {selectedChild?.measurements?.map((record) => (
                  <div key={record.id} className="p-4 bg-gray-50 border border-gray-100 hover:border-emerald-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-emerald-600 shrink-0">
                        <Scale size={20} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-gray-900 text-sm">Pemeriksaan tanggal {record.date}</h5>
                        <p className="text-xs text-gray-500 font-medium">
                          BB: <strong className="text-gray-900">{record.weight} kg</strong> • TB: <strong className="text-gray-900">{record.height} cm</strong> • LK: <strong className="text-gray-900">{record.headCirc} cm</strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-emerald-100/50 border border-emerald-200 text-emerald-700 rounded-lg">
                        {record.statusGizi?.split(' ')[0] || 'N/A'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-teal-100/50 border border-teal-200 text-teal-700 rounded-lg">
                        {record.statusTinggi?.split(' ')[0] || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </KaderLayout>
  );
}