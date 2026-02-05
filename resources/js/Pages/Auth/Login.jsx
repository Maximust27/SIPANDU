import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Heart, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';

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

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Perbaikan: Menghapus ': React.FormEvent' agar valid di file .jsx
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            // Mengambil CSRF Token dari meta tag bawaan Laravel
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            // Ganti URL '/login' dengan endpoint API Laravel Anda
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', // Penting agar Laravel merespon JSON
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login Berhasil -> Redirect
                window.location.href = '/dashboard';
            } else {
                // Menangani error validasi atau kredensial
                setErrorMessage(data.message || data.errors?.email?.[0] || 'Email atau password salah.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login Error:', error);
            setErrorMessage('Terjadi kesalahan jaringan. Periksa koneksi Anda.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Inject Styles */}
            <style>{styles}</style>
            
            {/* --- Animated Background Blobs --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
                <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header Section */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10 animate-fade-up">
                <a href="/" className="inline-flex items-center gap-2 group cursor-pointer decoration-0">
                    <div className="bg-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform duration-300">
                        <Heart size={28} fill="currentColor" />
                    </div>
                    <span className="font-bold text-3xl text-gray-900 tracking-tight">Sipandu<span className="text-violet-600">.</span></span>
                </a>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                    Masuk ke Akun
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Silakan masukkan detail akun Anda untuk melanjutkan.
                </p>
            </div>

            {/* Form Card */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-[0_20px_60px_rgba(124,58,237,0.08)] sm:rounded-[2rem] sm:px-10 border border-white/50 animate-fade-up delay-100">
                    
                     {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center animate-fade-up">
                            <AlertTriangle size={18} className="mr-2 shrink-0" />
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Email Input */}
                        <div className="animate-fade-up delay-200">
                            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium placeholder-gray-400 outline-none"
                                    placeholder="alamat@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="animate-fade-up delay-300">
                            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Kata Sandi</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="block w-full pl-12 pr-12 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 rounded-2xl transition-all duration-300 text-gray-900 sm:text-sm font-medium placeholder-gray-400 outline-none"
                                    placeholder="Masukan kata sandi"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-violet-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-2">
                                <a href="/forgot-password" className="text-xs font-semibold text-violet-600 hover:text-violet-500 transition-colors">
                                    Lupa kata sandi?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 animate-fade-up delay-400">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-violet-200 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:opacity-70 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        Masuk Sekarang
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
                                <span className="px-4 bg-white/50 backdrop-blur text-gray-500 font-medium">Belum punya akun?</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <a href="/register" className="text-violet-600 font-bold hover:text-violet-700 hover:underline transition-all">
                                Daftar Akun Keluarga
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Version Tag */}
            <div className="absolute bottom-4 w-full text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-fade-up delay-500 z-0">
                SIPANDU DIGITAL SYSTEM v1.0
            </div>
        </div>
    );
}