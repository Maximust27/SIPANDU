import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import { 
  Heart, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Loader2, 
  ArrowRight,
  AlertTriangle 
} from 'lucide-react';

// --- CUSTOM STYLES & ANIMATIONS ---
const styles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-blob { animation: blob 7s infinite; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
  
  .animate-fade-up { 
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
    opacity: 0;
  }
  
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
`;

export default function Register() {
    // 1. Inisialisasi Form State
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        kabupaten: 'Cilacap', // Default fixed value
        kecamatan: '',
        kelurahan: '',
        password: '',
        password_confirmation: '',
    });

    // 2. Data Mockup
    const [kecamatanList] = useState([
        { id: 1, name: 'Cilacap Selatan' },
        { id: 2, name: 'Cilacap Tengah' },
        { id: 3, name: 'Cilacap Utara' },
        { id: 4, name: 'Kesugihan' },
        { id: 5, name: 'Adipala' },
        { id: 6, name: 'Maos' },
        { id: 7, name: 'Jeruklegi' },
    ]);

    const [kelurahanList, setKelurahanList] = useState([]);

    const mockKelurahan = {
        'Cilacap Selatan': ['Sidakaya', 'Tambakreja', 'Tegalkamulyan', 'Cilacap', 'Tegalreja'],
        'Cilacap Tengah': ['Gunungsimping', 'Kutawaru', 'Sidanegara', 'Donan', 'Lomanis'],
        'Cilacap Utara': ['Gumilir', 'Kebonmanis', 'Mertasinga', 'Karangtalun', 'Tritih Kulon'],
        'Kesugihan': ['Kesugihan Kidul', 'Kuripan', 'Menganti', 'Pesanggrahan', 'Slarang'],
        'Adipala': ['Adipala', 'Bunton', 'Karanganyar', 'Penggalang', 'Wlahar'],
    };

    // 3. Handlers
    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const handleKecamatanChange = (e) => {
        const selectedKecamatan = e.target.value;
        setData('kecamatan', selectedKecamatan);
        setData('kelurahan', ''); 
        setKelurahanList(mockKelurahan[selectedKecamatan] || []);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            <style>{styles}</style>
            <Head title="Daftar Akun Sipandu" />

            {/* --- Animated Background Blobs --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
                <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header Section */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10 animate-fade-up">
                <Link href="/" className="inline-flex items-center gap-2 group cursor-pointer">
                    <div className="bg-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform duration-300">
                        <Heart size={28} fill="currentColor" />
                    </div>
                    <span className="font-bold text-3xl text-gray-900 tracking-tight">Sipandu<span className="text-violet-600">.</span></span>
                </Link>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                    Buat Akun Keluarga
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Mulai pantau tumbuh kembang anak secara digital.
                </p>
            </div>

            {/* Form Card */}
            <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-[0_20px_60px_rgba(124,58,237,0.08)] sm:rounded-[2rem] sm:px-10 border border-white/50 animate-fade-up delay-100">
                    
                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Nama Lengkap */}
                        <div className="animate-fade-up delay-200">
                            <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Nama Lengkap</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    required
                                    autoComplete="name"
                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium placeholder-gray-400"
                                    placeholder="Nama Orang Tua / Wali"
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1 ml-1"><AlertTriangle size={12}/> {errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="animate-fade-up delay-200">
                            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={onHandleChange}
                                    required
                                    autoComplete="username"
                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium placeholder-gray-400"
                                    placeholder="alamat@email.com"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1 ml-1"><AlertTriangle size={12}/> {errors.email}</p>}
                        </div>

                        {/* No HP */}
                        <div className="animate-fade-up delay-300">
                            <label htmlFor="phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">No. WhatsApp</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={onHandleChange}
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium placeholder-gray-400"
                                    placeholder="0812..."
                                />
                            </div>
                            {errors.phone && <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1 ml-1"><AlertTriangle size={12}/> {errors.phone}</p>}
                        </div>

                        {/* Wilayah Grid */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 animate-fade-up delay-300">
                            {/* Kabupaten */}
                            <div>
                                <label htmlFor="kabupaten" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Kabupaten</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="kabupaten"
                                        name="kabupaten"
                                        type="text"
                                        value={data.kabupaten}
                                        readOnly
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-100 border-transparent text-gray-500 rounded-2xl sm:text-sm font-bold cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Kecamatan */}
                            <div>
                                <label htmlFor="kecamatan" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Kecamatan</label>
                                <div className="relative group">
                                    <select
                                        id="kecamatan"
                                        name="kecamatan"
                                        value={data.kecamatan}
                                        onChange={handleKecamatanChange}
                                        required
                                        className="block w-full pl-4 pr-10 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium appearance-none"
                                    >
                                        <option value="">Pilih...</option>
                                        {kecamatanList.map((kec) => (
                                            <option key={kec.id} value={kec.name}>{kec.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Kelurahan */}
                        <div className="animate-fade-up delay-400">
                            <label htmlFor="kelurahan" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Kelurahan / Desa</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <select
                                    id="kelurahan"
                                    name="kelurahan"
                                    value={data.kelurahan}
                                    onChange={onHandleChange}
                                    required
                                    disabled={!data.kecamatan}
                                    className="block w-full pl-12 pr-10 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <option value="">Pilih Kelurahan</option>
                                    {kelurahanList.map((kel, index) => (
                                        <option key={index} value={kel}>{kel}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 animate-fade-up delay-400">
                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Kata Sandi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={onHandleChange}
                                        required
                                        autoComplete="new-password"
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium placeholder-gray-400"
                                        placeholder="Min. 8 karakter"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Ulangi Sandi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={onHandleChange}
                                        required
                                        autoComplete="new-password"
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium placeholder-gray-400"
                                        placeholder="Konfirmasi"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 animate-fade-up delay-500">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-violet-200 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:opacity-70 transition-all duration-300"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Mendaftarkan...
                                    </>
                                ) : (
                                    <>
                                        Buat Akun Sekarang
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 animate-fade-up delay-500">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/50 backdrop-blur text-gray-500 font-medium">Sudah punya akun?</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-violet-600 font-bold hover:text-violet-700 hover:underline transition-all">
                                Masuk ke akun Anda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}