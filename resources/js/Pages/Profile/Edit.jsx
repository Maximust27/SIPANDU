import React from 'react';
import { User, ShieldCheck, AlertTriangle, Settings, ArrowLeft } from 'lucide-react';

// =======================================================================================
// IMPORT LAYOUTS (Pastikan path file ini benar di project Laravel Abang)
// =======================================================================================
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KaderLayout from '@/Layouts/KaderLayout'; // <-- Import layout Kader yang baru dibuat
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// --- CUSTOM CSS UNTUK ANIMASI BACKGROUND ---
const profileStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -40px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-dash-blob { animation: blob 8s infinite; }
`;

export default function Edit({ auth, mustVerifyEmail, status }) {
    // 1. Cek Role User (Asumsi nama kolom di database users adalah 'role')
    const userRole = auth.user.role || 'user'; 

    // 2. Tentukan link kembali berdasarkan role
    const backLink = userRole === 'kader' ? route('kader.dashboard') : route('dashboard');

    // 3. Simpan isi konten profil ke dalam variabel agar tidak perlu diketik dua kali
    const ProfileContent = (
        <div className="py-8 relative overflow-hidden font-sans">
            <style>{profileStyles}</style>

            {/* Floating Blobs (Akan menyesuaikan warna layout pembungkusnya nanti) */}
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-dash-blob pointer-events-none z-0 ${userRole === 'kader' ? 'bg-teal-200' : 'bg-purple-200'}`}></div>
            <div className={`absolute top-60 left-10 w-[300px] h-[300px] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-dash-blob pointer-events-none z-0 ${userRole === 'kader' ? 'bg-emerald-200' : 'bg-blue-200'}`} style={{ animationDelay: '2000ms' }}></div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 pb-20">
                
                {/* TOMBOL KEMBALI */}
                <div>
                    <Link 
                        href={backLink} 
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white font-semibold text-sm rounded-xl border shadow-sm backdrop-blur-md transition-all hover:shadow hover:-translate-x-1 ${
                            userRole === 'kader' ? 'text-gray-600 hover:text-emerald-600 border-emerald-100' : 'text-gray-600 hover:text-violet-600 border-gray-200/60'
                        }`}
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Dashboard
                    </Link>
                </div>

                {/* Header Banner Kecil */}
                <div className={`rounded-[2rem] p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden mt-4 ${
                    userRole === 'kader' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 shadow-emerald-200/50' : 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-200/50'
                }`}>
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 pointer-events-none">
                        <User size={150} fill="currentColor" />
                    </div>
                    
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shrink-0">
                        <Settings size={32} />
                    </div>
                    <div className="text-center sm:text-left relative z-10">
                        <h3 className="text-2xl font-bold tracking-tight">Pengaturan Akun {userRole === 'kader' ? 'Kader' : 'Profil'}</h3>
                        <p className={`${userRole === 'kader' ? 'text-teal-50' : 'text-violet-100'} text-sm mt-1`}>
                            Kelola detail profil, alamat email, dan pengaturan keamanan akun Anda.
                        </p>
                    </div>
                </div>

                {/* Section 1: Update Profile Information */}
                <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-sm border border-white transition-all hover:shadow-md relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform ${userRole === 'kader' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                            <User size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900">Profil & Email</h4>
                            <p className="text-xs text-gray-500">Perbarui informasi identitas akun Anda.</p>
                        </div>
                    </div>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                {/* Section 2: Update Password */}
                <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-sm border border-white transition-all hover:shadow-md relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform ${userRole === 'kader' ? 'bg-teal-50 text-teal-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900">Keamanan Sandi</h4>
                            <p className="text-xs text-gray-500">Pastikan akun Anda menggunakan kata sandi yang kuat.</p>
                        </div>
                    </div>
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/* Section 3: Delete Account */}
                <div className="bg-rose-50/50 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-sm border border-rose-100 transition-all hover:shadow-md relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-200/60">
                        <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600 group-hover:scale-110 transition-transform">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-rose-600">Hapus Akun</h4>
                            <p className="text-xs text-rose-400">Tindakan ini bersifat permanen dan tidak dapat dibatalkan.</p>
                        </div>
                    </div>
                    <DeleteUserForm className="max-w-xl" />
                </div>

            </div>
        </div>
    );

    // 4. BUNGKUS DENGAN LAYOUT YANG TEPAT BERDASARKAN ROLE
    if (userRole === 'kader') {
        return (
            <KaderLayout headerTitle="Pengaturan Akun">
                <Head title="Pengaturan Kader" />
                {ProfileContent}
            </KaderLayout>
        );
    }

    // Default: Layout User (Bunda)
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />
            {ProfileContent}
        </AuthenticatedLayout>
    );
}