import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import KaderLayout from '@/Layouts/KaderLayout';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Baby, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Edit3, 
  Phone, 
  MapPin, 
  History, 
  UserCheck,
  X,
  Bell
} from 'lucide-react';

export default function ChildrenManagement({ initialChildren }) {
  // Menggunakan data dari controller Laravel, jika kosong otomatis memakai array kosong
  const [children, setChildren] = useState(initialChildren || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  
  // States Detail & Modal
  const [activeChild, setActiveChild] = useState(children[0] || null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State untuk Tambah / Edit Anak
  const [formState, setFormState] = useState({
    name: '',
    nik: '',
    gender: 'Laki-laki',
    birthDate: '',
    fatherName: '',
    motherName: '',
    phone: '',
    address: ''
  });

  // Trigger Toast Notifikasi
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- FILTER LOGIC ---
  const filteredChildren = children.filter(child => {
    const matchesSearch = 
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.nik.includes(searchQuery) ||
      (child.motherName && child.motherName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesGender = selectedGender === 'Semua' || child.gender === selectedGender;
    const matchesStatus = selectedStatus === 'Semua' || child.status === selectedStatus;

    return matchesSearch && matchesGender && matchesStatus;
  });

  // --- HANDLER TAMBAH / EDIT ANAK ---
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setFormState({
      name: '',
      nik: '',
      gender: 'Laki-laki',
      birthDate: '',
      fatherName: '',
      motherName: '',
      phone: '',
      address: 'Balai Desa Sukamaju, RT 02/RW 03, Cilacap'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (child) => {
    setIsEditMode(true);
    setFormState({
      id: child.id,
      name: child.name,
      nik: child.nik,
      gender: child.gender,
      birthDate: child.birth_date || child.birthDate,
      fatherName: child.father_name || child.fatherName,
      motherName: child.mother_name || child.motherName,
      phone: child.phone,
      address: child.address
    });
    setIsAddModalOpen(true);
  };

  const handleSaveChild = (e) => {
    e.preventDefault();
    if (isEditMode) {
      const updatedList = children.map(c => {
        if (c.id === formState.id) {
          return {
            ...c,
            ...formState,
            ageStr: 'Diperbarui'
          };
        }
        return c;
      });
      setChildren(updatedList);
      showToast('Data Anak berhasil diperbarui!');
    } else {
      const newChild = {
        id: Date.now(),
        ...formState,
        ageStr: '0 Bulan (Baru)',
        status: 'Terverifikasi',
        pending_verification: null,
        history: []
      };
      setChildren([...children, newChild]);
      showToast('Data Anak baru berhasil ditambahkan!');
    }
    setIsAddModalOpen(false);
  };

  // --- HANDLER VERIFIKASI INPUT USER (BUNDA) ---
  const handleVerifyInput = (childId, isApproved) => {
    const updatedList = children.map(child => {
      if (child.id === childId) {
        if (isApproved) {
          const approvedData = {
            id: Date.now(),
            date: child.pending_verification.date,
            weight: child.pending_verification.weight,
            height: child.pending_verification.height,
            head_circulation: child.pending_verification.head_circulation,
            notes: 'Verifikasi sukses: Diperiksa mandiri oleh Orang Tua'
          };
          return {
            ...child,
            status: 'Terverifikasi',
            history: [approvedData, ...child.history],
            pending_verification: null
          };
        } else {
          return {
            ...child,
            status: 'Terverifikasi',
            pending_verification: null
          };
        }
      }
      return child;
    });
    setChildren(updatedList);
    
    const updatedActive = updatedList.find(c => c.id === childId);
    if (updatedActive) setActiveChild(updatedActive);

    showToast(isApproved ? 'Input data dari Bunda berhasil disetujui!' : 'Input data dari Bunda ditolak.');
  };

  return (
    <KaderLayout headerTitle="Kelola Data Anak & Orang Tua">
      <Head title="Manajemen Data Sipandu" />

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 border border-emerald-500 text-white rounded-2xl flex items-center gap-3 text-sm font-bold shadow-2xl">
          <CheckCircle size={18} />
          {toastMessage}
        </div>
      )}

      <div className="p-4 sm:p-8 space-y-6">
        
        {/* STATISTIK HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
              <Baby size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Terdaftar</p>
              <h4 className="text-2xl font-black text-gray-900">{children.length} Anak</h4>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="bg-amber-50 p-3.5 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Butuh Verifikasi</p>
              <h4 className="text-2xl font-black text-amber-600">
                {children.filter(c => c.status === 'Butuh Verifikasi').length} Balita
              </h4>
            </div>
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="bg-emerald-50 p-3.5 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data Terverifikasi</p>
              <h4 className="text-2xl font-black text-emerald-600">
                {children.filter(c => c.status === 'Terverifikasi').length} Balita
              </h4>
            </div>
          </div>
        </div>

        {/* PENCARIAN & FILTER PANEL */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Database Anak & Orang Tua</h4>
              <p className="text-xs text-gray-500">Cari, edit, dan lakukan verifikasi data secara aman.</p>
            </div>
            <button 
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md"
              style={{ backgroundColor: '#059669' }}
            >
              <UserPlus size={18} />
              Tambah Anak Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="relative md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Cari nama anak, NIK, atau nama ibu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-300 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select 
                value={selectedGender} 
                onChange={e => setSelectedGender(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3 py-3 focus:outline-none"
              >
                <option value="Semua">Semua Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <select 
              value={selectedStatus} 
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3 py-3 focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Butuh Verifikasi">Butuh Verifikasi</option>
            </select>
          </div>
        </div>

        {/* DATA GRID & DETAIL DRAWER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          <div className="lg:col-span-2 space-y-4">
            {filteredChildren.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
                <Users className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="font-bold text-gray-500">Data anak tidak ditemukan</p>
                <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
              </div>
            ) : (
              filteredChildren.map(child => (
                <div 
                  key={child.id}
                  onClick={() => { setActiveChild(child); setIsDetailOpen(true); }}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 ${
                    activeChild && activeChild.id === child.id && isDetailOpen
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-emerald-100 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-inner ${
                      child.gender === 'Laki-laki' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-gradient-to-br from-pink-400 to-rose-400'
                    }`}>
                      {child.name.charAt(0)}
                    </div>
                    
                    <div className="space-y-1">
                      <h5 className="font-black text-gray-900 text-base flex items-center gap-2">
                        {child.name} 
                        {child.status === 'Butuh Verifikasi' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse inline-block" title="Butuh Verifikasi"></span>
                        )}
                      </h5>
                      <p className="text-xs text-gray-500 font-semibold">NIK: {child.nik}</p>
                      <p className="text-xs text-gray-400 font-medium">Ibu: {child.mother_name || child.motherName} • Umur: {child.age_str || child.ageStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                      child.status === 'Terverifikasi' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {child.status}
                    </span>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenEditModal(child); }}
                      className="p-2 bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 rounded-xl border border-gray-100 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            {isDetailOpen && activeChild ? (
              <div className="bg-white rounded-[2rem] border border-emerald-100 shadow-sm p-6 space-y-6 sticky top-24">
                
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Detail Anak & Orang Tua</h4>
                    <p className="text-xs text-gray-400">Informasi lengkap rekam KIA</p>
                  </div>
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Users size={14} /> Data Orang Tua
                  </h5>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-400 font-medium">Nama Ibu</p>
                        <p className="font-bold text-gray-800 text-sm mt-0.5">{activeChild.mother_name || activeChild.motherName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Nama Ayah</p>
                        <p className="font-bold text-gray-800 text-sm mt-0.5">{activeChild.father_name || activeChild.fatherName}</p>
                      </div>
                    </div>

                    <div className="h-px w-full bg-gray-200/50"></div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} className="text-gray-400 shrink-0" />
                        <span className="font-semibold">{activeChild.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{activeChild.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {activeChild.status === 'Butuh Verifikasi' && activeChild.pending_verification && (
                  <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
                    <div className="flex gap-2.5 text-amber-700">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider">Perlu Verifikasi Bidan/Kader</p>
                        <p className="text-xs text-gray-500 mt-0.5">Bunda melakukan pengukuran mandiri dari rumah:</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-inner">
                        <p className="text-gray-400 font-medium">BB</p>
                        <p className="font-black text-amber-700 text-sm mt-0.5">{activeChild.pending_verification.weight} kg</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-inner">
                        <p className="text-gray-400 font-medium">TB</p>
                        <p className="font-black text-amber-700 text-sm mt-0.5">{activeChild.pending_verification.height} cm</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-inner">
                        <p className="text-gray-400 font-medium">LK</p>
                        <p className="font-black text-amber-700 text-sm mt-0.5">{activeChild.pending_verification.head_circulation || activeChild.pending_verification.headCirc} cm</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => handleVerifyInput(activeChild.id, true)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                        style={{ backgroundColor: '#059669' }}
                      >
                        <CheckCircle size={14} /> Setujui Data
                      </button>
                      <button 
                        onClick={() => handleVerifyInput(activeChild.id, false)}
                        className="flex-1 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-600 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={14} /> Tolak
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                    <History size={14} /> Riwayat Pemeriksaan
                  </h5>

                  {(!activeChild.history || activeChild.history.length === 0) ? (
                    <div className="text-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-xs text-gray-400">Belum ada riwayat tercatat di posyandu.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pr-1">
                      {activeChild.history.map((record) => (
                        <div key={record.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-inner flex justify-between items-start gap-3">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400">{record.date}</p>
                            <p className="text-xs font-bold text-gray-800">
                              BB: {record.weight} kg • TB: {record.height} cm • LK: {record.head_circulation || record.headCirc} cm
                            </p>
                            <p className="text-[10px] text-gray-500 leading-relaxed italic">
                              "{record.notes}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-emerald-50/50 rounded-[2rem] border border-dashed border-emerald-200 p-8 text-center sticky top-24">
                <Users className="mx-auto text-emerald-300 mb-3" size={40} />
                <h5 className="font-bold text-emerald-800 text-sm">Pilih Balita</h5>
                <p className="text-xs text-emerald-600/70 mt-1 max-w-[200px] mx-auto">
                  Klik salah satu kartu anak di sebelah kiri untuk melihat rekam orang tua & riwayat KIA.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MODAL TAMBAH & EDIT DATA ANAK */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-2xl w-full overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                  <Baby size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{isEditMode ? 'Edit Profil Balita & Ortu' : 'Pendaftaran Balita & Ortu'}</h4>
                  <p className="text-xs text-gray-500">Isi formulir pendaftaran Sipandu secara lengkap.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveChild}>
              <div className="px-8 py-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar">
                
                {/* Bagian 1: Identitas Anak */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">1. Identitas Anak</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nama Balita</label>
                      <input 
                        type="text" 
                        required
                        value={formState.name}
                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm outline-none transition-all"
                        placeholder="Contoh: Leon Alfarizi"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">NIK Anak</label>
                      <input 
                        type="text" 
                        required
                        maxLength={16}
                        value={formState.nik}
                        onChange={e => setFormState({ ...formState, nik: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm outline-none transition-all"
                        placeholder="16 Digit NIK"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Jenis Kelamin</label>
                      <select 
                        value={formState.gender}
                        onChange={e => setFormState({ ...formState, gender: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm outline-none transition-all"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Tanggal Lahir</label>
                      <input 
                        type="date" 
                        required
                        value={formState.birthDate}
                        onChange={e => setFormState({ ...formState, birthDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian 2: Identitas Orang Tua */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-2">2. Identitas Orang Tua</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nama Ibu Kandung</label>
                      <input 
                        type="text" 
                        required
                        value={formState.motherName}
                        onChange={e => setFormState({ ...formState, motherName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm outline-none transition-all"
                        placeholder="Nama Ibu"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nama Ayah</label>
                      <input 
                        type="text" 
                        required
                        value={formState.fatherName}
                        onChange={e => setFormState({ ...formState, fatherName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm outline-none transition-all"
                        placeholder="Nama Ayah"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">No. HP Orang Tua</label>
                      <input 
                        type="text" 
                        required
                        value={formState.phone}
                        onChange={e => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm outline-none transition-all"
                        placeholder="Mulai dengan 08"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500">Alamat Tempat Tinggal</label>
                      <textarea 
                        required
                        rows={2}
                        value={formState.address}
                        onChange={e => setFormState({ ...formState, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm outline-none transition-all resize-none"
                        placeholder="Tulis alamat rumah lengkap..."
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-100"
                  style={{ backgroundColor: '#059669' }}
                >
                  {isEditMode ? 'Simpan Perubahan' : 'Daftarkan Balita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </KaderLayout>
  );
}