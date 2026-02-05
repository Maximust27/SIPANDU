import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function Login({ status, canResetPassword = true }) {
  // Menggunakan useForm (Mocked untuk preview, asli dari Inertia di Laravel)
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });
  
  // State UI lokal
  const [showPassword, setShowPassword] = useState(false);

  // Bersihkan field password saat komponen di-unmount (keamanan)
  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  // Proses Login ke Backend Laravel
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mengirim request POST ke route login Laravel
    post(route('login'));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-blue-100">
      <Head title="Masuk Aplikasi" />

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4 transform transition-transform hover:scale-105">
            <ShieldCheck size={32} className="text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SIPANDU</h1>
          <p className="text-slate-500 mt-2">Sistem Informasi Pandu Terintegrasi</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8">
            
            {/* Pesan Status (misal: sukses reset password) */}
            {status && (
                <div className="mb-4 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                  <ShieldCheck size={18} className="shrink-0" />
                  <span>{status}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Pesan Error Global (jika ada error umum) */}
              {errors.email && !errors.email.includes('The email field') && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-shake">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errors.email}</span>
                </div>
              )}

              {/* Input Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="nama@email.com"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                {errors.email && (
                    <p className="text-xs text-red-500 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  {canResetPassword && (
                    <Link href={route('password.request')} className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Lupa Password?
                    </Link>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                    <p className="text-xs text-red-500 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Checkbox Remember Me */}
              <div className="flex items-center ml-1">
                <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">
                    Ingat Saya
                </label>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={processing}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white transition-all shadow-md shadow-blue-100
                  ${processing 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] active:shadow-none hover:shadow-lg hover:shadow-blue-200'
                  }`}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Card */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Belum punya akun? <Link href={route('register')} className="text-blue-600 font-medium cursor-pointer hover:underline">Daftar Sekarang</Link>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Sipandu. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </div>

      {/* Global CSS for custom animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};