import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X,
  MapPin,
  CalendarDays,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  UserPlus
} from 'lucide-react';

import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PosyanduManagement({ initialPosyandus }) {
  // Pengecekan aman agar tidak terjadi error ReferenceError saat mock dihapus
  const [posyanduList, setPosyanduList] = useState(
    initialPosyandus || (typeof fallbackPosyandus !== 'undefined' ? fallbackPosyandus : [])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', onConfirm: null, isWarning: false
  });

  const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
    id: '',
    name: '',
    location: '',
    schedule: 'Minggu Pertama',
    assignedKadersText: '' // Simplified for UI: comma separated names
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter Search
  const filteredPosyandus = posyanduList.filter(p => {
    const term = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.location.toLowerCase().includes(term);
  });

  // Handlers
  const handleOpenAdd = () => {
    reset();
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (posyandu) => {
    setIsEditMode(true);
    setData({
      id: posyandu.id,
      name: posyandu.name,
      location: posyandu.location,
      schedule: posyandu.schedule,
      assignedKadersText: posyandu.assignedKaders ? posyandu.assignedKaders.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedKaders = data.assignedKadersText.split(',').map(k => k.trim()).filter(k => k);

    if (isEditMode) {
      const updatedList = posyanduList.map(p => p.id === data.id ? { ...p, ...data, assignedKaders: formattedKaders } : p);
      setPosyanduList(updatedList);
      put('#', { onSuccess: () => { setIsModalOpen(false); showToast('Data Posyandu berhasil diperbarui!'); }});
    } else {
      const newPosyandu = { id: Date.now(), ...data, assignedKaders: formattedKaders };
      setPosyanduList([newPosyandu, ...posyanduList]);
      post('#', { onSuccess: () => { setIsModalOpen(false); showToast('Posyandu baru berhasil ditambahkan!'); }});
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Posyandu',
      message: 'Menghapus posyandu ini akan menghilangkan jadwal terkait. Apakah Anda yakin?',
      isWarning: true,
      onConfirm: () => {
        setPosyanduList(posyanduList.filter(p => p.id !== id));
        setConfirmModal({ isOpen: false });
        showToast('Data posyandu berhasil dihapus.', 'error');
        // destroy(route('admin.posyandu.destroy', id)); // Un-comment di Laravel
      }
    });
  };

  return (
    <AdminLayout headerTitle="Kelola Data Posyandu" headerIcon={<Building2 size={20} />}>
      <Head title="Data Posyandu - Sipandu Admin" />

      {/* TOAST NOTIFIKASI */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl text-white font-bold flex items-center gap-3 shadow-2xl transition-all border ${
          toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-blue-600 border-blue-500'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl max-w-md w-full p-6 space-y-4 animate-slide-down">
            <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-3">
              <div className={`p-2 rounded-xl ${confirmModal.isWarning ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                {confirmModal.isWarning ? <AlertTriangle size={20} /> : <Info size={20} />}
              </div>
              <h4 className="text-base font-bold">{confirmModal.title}</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setConfirmModal({ isOpen: false })} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Batal</button>
              <button onClick={confirmModal.onConfirm} className={`px-4 py-2.5 text-xs font-bold rounded-xl text-white ${confirmModal.isWarning ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'}`}>Konfirmasi</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-8 space-y-6">
        
        {/* PANEL ATAS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Database Fasilitas Posyandu</h4>
              <p className="text-xs text-slate-500">Kelola lokasi, jadwal kegiatan, dan penugasan kader.</p>
            </div>
            <button onClick={handleOpenAdd} className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md text-sm transition-all">
              <Plus size={18} /> Tambah Posyandu
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama posyandu atau lokasi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* GRID POSYANDU */}
        {filteredPosyandus.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border border-slate-200 text-center shadow-sm">
            <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
            <h5 className="text-lg font-bold text-slate-700">Tidak ada data Posyandu</h5>
            <p className="text-sm text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosyandus.map((pos) => (
              <div key={pos.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden flex flex-col group">
                {/* Header Card */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-fuchsia-100 text-fuchsia-600 p-2.5 rounded-xl">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">{pos.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin size={12}/> {pos.location}</p>
                    </div>
                  </div>
                </div>

                {/* Konten Card */}
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CalendarDays size={16} className="text-blue-500" />
                    <span className="font-semibold">Jadwal:</span> {pos.schedule}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Users size={14}/> Kader Bertugas
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                        {pos.assignedKaders ? pos.assignedKaders.length : 0} Orang
                      </span>
                    </div>
                    
                    {pos.assignedKaders && pos.assignedKaders.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {pos.assignedKaders.map((kader, i) => (
                          <span key={i} className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-medium">
                            {kader}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-rose-500 italic bg-rose-50 p-2 rounded-lg border border-rose-100 text-center">
                        Belum ada kader yang ditugaskan.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 mt-auto">
                  <button onClick={() => handleOpenEdit(pos)} className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-xl border border-slate-200 transition-colors">
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(pos.id)} className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-xl border border-slate-200 transition-colors">
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-blue-50/30">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{isEditMode ? 'Edit Posyandu' : 'Tambah Posyandu Baru'}</h4>
                <p className="text-xs text-slate-500">Isi kelengkapan data operasional posyandu.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-8 py-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Nama Posyandu</label>
                  <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: Posyandu Melati 1" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Lokasi / Alamat</label>
                  <textarea required rows={2} value={data.location} onChange={e => setData('location', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none" placeholder="Balai Desa / Alamat lengkap..." />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Jadwal Kegiatan Rutin</label>
                  <select required value={data.schedule} onChange={e => setData('schedule', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm">
                    <option value="Minggu Pertama">Minggu Pertama</option>
                    <option value="Minggu Kedua">Minggu Kedua</option>
                    <option value="Minggu Ketiga">Minggu Ketiga</option>
                    <option value="Minggu Keempat">Minggu Keempat</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1"><UserPlus size={14}/> Assign Kader (Opsional)</label>
                  <input type="text" value={data.assignedKadersText} onChange={e => setData('assignedKadersText', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm" placeholder="Pisahkan dengan koma (cth: Siti, Nisa)" />
                  <p className="text-[10px] text-slate-400">Tuliskan nama kader yang ditugaskan ke posyandu ini.</p>
                </div>
              </div>

              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm">Batal</button>
                <button type="submit" disabled={processing} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md disabled:opacity-50">
                  {processing ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}