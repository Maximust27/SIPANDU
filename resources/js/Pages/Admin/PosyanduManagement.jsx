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

export default function PosyanduManagement({ initialPosyandu = [] }) {
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
    kelurahan: '',
    kecamatan: '',
    address: '',
    contact: '',
    quota_per_session: 50,
    status: 'aktif'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter Search
  const filteredPosyandus = initialPosyandu.filter(p => {
    const term = searchQuery.toLowerCase();
    const name = p.name || '';
    const address = p.address || '';
    const kelurahan = p.kelurahan || '';
    const kecamatan = p.kecamatan || '';
    return name.toLowerCase().includes(term) || 
           address.toLowerCase().includes(term) || 
           kelurahan.toLowerCase().includes(term) || 
           kecamatan.toLowerCase().includes(term);
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
      name: posyandu.name || '',
      kelurahan: posyandu.kelurahan || '',
      kecamatan: posyandu.kecamatan || '',
      address: posyandu.address || '',
      contact: posyandu.contact || '',
      quota_per_session: posyandu.quota_per_session || 50,
      status: posyandu.status || 'aktif'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      put(route('admin.posyandu.update', data.id), {
        onSuccess: () => { 
          setIsModalOpen(false); 
          showToast('Data Posyandu berhasil diperbarui!'); 
        }
      });
    } else {
      post(route('admin.posyandu.store'), {
        onSuccess: () => { 
          setIsModalOpen(false); 
          showToast('Posyandu baru berhasil ditambahkan!'); 
        }
      });
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Posyandu',
      message: 'Menghapus posyandu ini akan menghilangkan jadwal terkait. Apakah Anda yakin?',
      isWarning: true,
      onConfirm: () => {
        destroy(route('admin.posyandu.destroy', id), {
          onSuccess: () => {
            setConfirmModal({ isOpen: false });
            showToast('Data posyandu berhasil dihapus.', 'error');
          }
        });
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
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={12}/> {pos.address ? `${pos.address}, ` : ''}Kel. {pos.kelurahan}, Kec. {pos.kecamatan}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    pos.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {pos.status}
                  </span>
                </div>

                {/* Konten Card */}
                <div className="p-6 space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Kontak WA/Telp</span>
                      <span className="font-semibold text-slate-800">{pos.contact || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Kuota Sesi Antrian</span>
                      <span className="font-semibold text-slate-800">{pos.quota_per_session || 50} Balita</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Users size={14}/> Kader Bertugas
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                        {pos.kaders ? pos.kaders.length : 0} Orang
                      </span>
                    </div>
                    
                    {pos.kaders && pos.kaders.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {pos.kaders.map((kader) => (
                          <span key={kader.id} className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-medium">
                            {kader.name}
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
                  {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Kelurahan</label>
                    <input type="text" required value={data.kelurahan} onChange={e => setData('kelurahan', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: Donan" />
                    {errors.kelurahan && <p className="text-xs text-rose-500">{errors.kelurahan}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Kecamatan</label>
                    <input type="text" required value={data.kecamatan} onChange={e => setData('kecamatan', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: Cilacap Tengah" />
                    {errors.kecamatan && <p className="text-xs text-rose-500">{errors.kecamatan}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Alamat Lengkap</label>
                  <textarea rows={2} value={data.address} onChange={e => setData('address', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none" placeholder="Alamat lengkap posyandu..." />
                  {errors.address && <p className="text-xs text-rose-500">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">No. Kontak WhatsApp</label>
                    <input type="text" value={data.contact} onChange={e => setData('contact', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: 08123456789" />
                    {errors.contact && <p className="text-xs text-rose-500">{errors.contact}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Kuota Per Sesi</label>
                    <input type="number" required min="1" value={data.quota_per_session} onChange={e => setData('quota_per_session', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                    {errors.quota_per_session && <p className="text-xs text-rose-500">{errors.quota_per_session}</p>}
                  </div>
                </div>

                {isEditMode && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Status Operasional</label>
                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-sm">
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-aktif</option>
                    </select>
                    {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                  </div>
                )}
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