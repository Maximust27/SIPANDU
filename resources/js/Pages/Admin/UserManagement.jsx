import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Key, 
  X,
  UserCheck,
  UserX,
  Shield,
  User,
  AlertTriangle,
  CheckCircle,
  Info,
  UserCog,
  Building2,
  Filter
} from 'lucide-react';

export default function UserManagement({ initialUsers = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', onConfirm: null, isWarning: false
  });

  // Inertia Form Hook
  const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
    id: '', name: '', email: '', phone: '', address: '', role: 'kader', status: 'aktif'
  });

  // Memastikan data aman
  const safeUsers = Array.isArray(initialUsers) ? initialUsers : [];

  // --- STATISTIK DINAMIS ---
  const stats = {
    totalBunda: safeUsers.filter(u => u.role === 'user').length,
    kaderAktif: safeUsers.filter(u => u.role === 'kader' && u.status === 'aktif').length,
    akunNonaktif: safeUsers.filter(u => u.status === 'nonaktif').length,
    totalPosyandu: 45 // Angka statis (dikarenakan beda tabel)
  };

  // --- FILTER DATA ---
  const filteredUsers = safeUsers.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const phone = user.phone || '';

    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);
    
    const matchesRole = roleFilter === 'Semua' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'Semua' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // --- HANDLERS ---
  const handleOpenAddModal = () => {
    reset();
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setIsEditMode(true);
    setData({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'kader',
      status: user.status || 'aktif'
    });
    setIsModalOpen(true);
  };

  const handleSubmitKader = (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        put(route('admin.users.update', data.id), { onSuccess: () => setIsModalOpen(false) });
      } else {
        post(route('admin.users.store'), { onSuccess: () => setIsModalOpen(false) });
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan. Pastikan Ziggy routes sudah terpasang dengan benar.");
    }
  };

  // Konfirmasi Aksi
  const openConfirm = (title, message, isWarning, action) => {
    setConfirmModal({ isOpen: true, title, message, isWarning, onConfirm: () => { action(); setConfirmModal({ isOpen: false }); } });
  };

  const handleDeleteUser = (id) => {
    openConfirm('Hapus Pengguna', 'Apakah Anda yakin ingin menghapus pengguna ini secara permanen dari database?', true, () => {
      destroy(route('admin.users.destroy', id));
    });
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'aktif' ? 'nonaktif' : 'aktif';
    const actionText = currentStatus === 'aktif' ? 'menonaktifkan' : 'mengaktifkan';
    openConfirm('Ubah Status Akun', `Apakah Anda ingin melanjutkan tindakan ${actionText} akun ini?`, false, () => {
      router.patch(route('admin.users.toggle-status', id), { status: nextStatus });
    });
  };

  const handleResetPassword = (id) => {
    openConfirm('Reset Password', 'Password akun ini akan dikembalikan ke sandi standar: bismillah123. Lanjutkan?', false, () => {
      router.post(route('admin.users.reset-password', id));
    });
  };

  return (
    <AdminLayout headerTitle="Manajemen Akses & Pengguna" headerIcon={<Users size={20} />}>
      <Head title="Manajemen User - Sipandu Admin" />

      {/* CUSTOM CONFIRM MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl max-w-md w-full p-6 space-y-4 animate-slide-down">
            <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-3">
              {confirmModal.isWarning ? (
                <div className="bg-rose-100 p-2 rounded-xl text-rose-600"><AlertTriangle size={20} /></div>
              ) : (
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Info size={20} /></div>
              )}
              <h4 className="text-base font-bold">{confirmModal.title}</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setConfirmModal({ isOpen: false })} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">Batal</button>
              <button type="button" onClick={confirmModal.onConfirm} className={`px-4 py-2.5 text-xs font-bold rounded-xl text-white transition-all ${confirmModal.isWarning ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'}`}>Konfirmasi</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 min-h-full bg-slate-50">
        {/* === QUICK STATS === */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-violet-500 group-hover:scale-125 transition-transform duration-500"><Users size={90}/></div>
            <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
              <Users size={20} className="text-violet-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Bunda Terdaftar</span>
            </div>
            <h4 className="text-4xl font-black text-slate-900 relative z-10">{stats.totalBunda.toLocaleString('id-ID')}</h4>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-500 group-hover:scale-125 transition-transform duration-500"><UserCog size={90}/></div>
            <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
              <UserCog size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Kader Aktif</span>
            </div>
            <h4 className="text-4xl font-black text-slate-900 relative z-10">{stats.kaderAktif.toLocaleString('id-ID')}</h4>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-amber-500 group-hover:scale-125 transition-transform duration-500"><UserX size={90}/></div>
            <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
              <UserX size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Akun Nonaktif</span>
            </div>
            <h4 className="text-4xl font-black text-slate-900 relative z-10">{stats.akunNonaktif}</h4>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform group relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-blue-500 group-hover:scale-125 transition-transform duration-500"><Building2 size={90}/></div>
            <div className="flex items-center gap-2 text-slate-500 mb-1 relative z-10">
              <Building2 size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Posyandu Terhubung</span>
            </div>
            <h4 className="text-4xl font-black text-slate-900 relative z-10">{stats.totalPosyandu}</h4>
          </div>
        </div>

        {/* --- PANEL PENCARIAN & FILTER --- */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Daftar Akun Pengguna</h4>
              <p className="text-xs text-slate-500 mt-1">Gunakan filter untuk mencari data lebih cepat.</p>
            </div>
            <button 
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md text-sm"
            >
              <UserPlus size={18} />
              Tambah Kader Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="relative md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Cari nama, email, atau nomor HP..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400 shrink-0" />
              <select 
                value={roleFilter} 
                onChange={e => setRoleFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-3 focus:outline-none focus:border-blue-500 focus:bg-white shadow-inner"
              >
                <option value="Semua">Semua Peran</option>
                <option value="kader">Kader Posyandu</option>
                <option value="user">Bunda (User)</option>
              </select>
            </div>

            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-3 focus:outline-none focus:border-blue-500 focus:bg-white shadow-inner"
            >
              <option value="Semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* --- TABEL UTAMA MANAJEMEN USER --- */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 sm:p-5 pl-6 sm:pl-8">Profil Pengguna</th>
                  <th className="p-4 sm:p-5">Kontak & Alamat</th>
                  <th className="p-4 sm:p-5">Peran</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right pr-6 sm:pr-8">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                      <Search size={32} className="mx-auto mb-2 text-slate-300" />
                      Data pengguna tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 sm:p-5 pl-6 sm:pl-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-inner shrink-0 ${
                            user.role === 'kader' ? 'bg-gradient-to-br from-emerald-400 to-teal-600' : 'bg-gradient-to-br from-violet-400 to-indigo-600'
                          }`}>
                            {(user.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{user.name}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{user.email || 'Email belum diatur'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 sm:p-5">
                        <p className="font-semibold text-slate-800">{user.phone || '-'}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]" title={user.address}>{user.address || '-'}</p>
                      </td>

                      <td className="p-4 sm:p-5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${
                          user.role === 'kader' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : 'bg-violet-50 border-violet-200 text-violet-700'
                        }`}>
                          {user.role === 'kader' ? <Shield size={14} /> : <User size={14} />}
                          {user.role === 'kader' ? 'Kader' : 'Bunda'}
                        </span>
                      </td>

                      <td className="p-4 sm:p-5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
                          user.status === 'aktif' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {user.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>

                      <td className="p-4 sm:p-5 text-right pr-6 sm:pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          
                          <button 
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={`p-2.5 rounded-xl border transition-colors shadow-sm ${
                              user.status === 'aktif'
                                ? 'bg-white hover:bg-rose-50 border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200'
                                : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200'
                            }`}
                            title={user.status === 'aktif' ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          >
                            {user.status === 'aktif' ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>

                          <button 
                            onClick={() => handleResetPassword(user.id)}
                            className="p-2.5 bg-white hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-xl border border-slate-200 hover:border-amber-200 transition-colors shadow-sm"
                            title="Reset Password Ke Default"
                          >
                            <Key size={16} />
                          </button>

                          {user.role === 'kader' && (
                            <button 
                              onClick={() => handleOpenEditModal(user)}
                              className="p-2.5 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors shadow-sm"
                              title="Edit Profil Kader"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}

                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors shadow-sm"
                            title="Hapus Akun Pengguna"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- MODAL TAMBAH & EDIT KADER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-slide-down">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-blue-50/30">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{isEditMode ? 'Edit Akun Kader' : 'Registrasi Akun Kader Baru'}</h4>
                <p className="text-xs text-slate-500">Isi formulir data penugasan kader posyandu secara valid.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitKader}>
              <div className="px-8 py-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Nama Lengkap Kader</label>
                  <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm outline-none transition-all" placeholder="Contoh: Siti Aminah" />
                  {errors.name && <p className="text-xs text-rose-600 font-medium">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Alamat Email</label>
                  <input type="email" required value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm outline-none transition-all" placeholder="siti@example.com" />
                  {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Nomor Handphone (WhatsApp)</label>
                  <input type="text" required value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm outline-none transition-all" placeholder="Contoh: 08XXXXXXXXXX" />
                  {errors.phone && <p className="text-xs text-rose-600 font-medium">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Alamat Tempat Tinggal</label>
                  <textarea rows={2} required value={data.address} onChange={e => setData('address', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm outline-none transition-all resize-none" placeholder="Alamat lengkap domisili kader..." />
                  {errors.address && <p className="text-xs text-rose-600 font-medium">{errors.address}</p>}
                </div>
              </div>

              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-colors">Batal</button>
                <button type="submit" disabled={processing} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-100 disabled:opacity-50">
                  {processing ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Daftarkan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}