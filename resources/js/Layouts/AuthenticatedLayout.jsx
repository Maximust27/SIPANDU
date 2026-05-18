import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Baby 
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    // Mengambil data user dari Inertia (bawaan Laravel Breeze)
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fungsi untuk mendapatkan inisial nama untuk Avatar
    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    };

    // DAFTAR MENU NAVIGASI (SUDAH DISESUAIKAN DENGAN ROUTES/WEB.PHP)
    const navItems = [
        { name: 'Dashboard', routeName: 'dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Anak & Pertumbuhan', routeName: 'Children.index', icon: <Baby size={20} /> },
        { name: 'Imunisasi & Jadwal', routeName: 'immunization.index', icon: <Calendar size={20} /> },
        { name: 'AI Health Assistant', routeName: 'ai-assistant.index', icon: <Sparkles size={20} /> },
        { name: 'Edukasi Kesehatan', routeName: 'education.index', icon: <FileText size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FF] font-sans flex overflow-hidden">
            <style>{`
                /* Custom Scrollbar for Sidebar */
                .sidebar-scrollbar::-webkit-scrollbar { width: 4px; }
                .sidebar-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .sidebar-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
                .sidebar-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
            `}</style>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- SIDEBAR KIRI --- */}
            <aside 
                className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none lg:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Sidebar */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-200">
                            <Heart size={22} fill="currentColor" />
                        </div>
                        <Link href={route('dashboard')}>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                                Sipandu<span className="text-violet-600">.</span>
                            </h1>
                        </Link>
                    </div>
                    {/* Tombol Close Mobile */}
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigasi Utama */}
                <nav className="flex-1 overflow-y-auto sidebar-scrollbar py-6 px-4 space-y-1.5">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                        Menu Utama
                    </p>
                    
                    {navItems.map((item, index) => {
                        // Cek apakah route sedang aktif
                        // Menggunakan try-catch agar jika route Ziggy belum terbaca, aplikasi tidak langsung crash
                        let isActive = false;
                        let href = '#';
                        try {
                            if (item.routeName !== '#') {
                                isActive = route().current(item.routeName);
                                href = route(item.routeName);
                            }
                        } catch (error) {
                            console.warn('Route belum ditemukan oleh Ziggy:', item.routeName);
                        }

                        return (
                            <Link
                                key={index}
                                href={href}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                    isActive 
                                        ? 'bg-violet-50 text-violet-700 font-semibold' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                }`}
                            >
                                <div className={`${
                                    isActive ? 'text-violet-600' : 'text-gray-400 group-hover:text-violet-500'
                                } transition-colors duration-200`}>
                                    {item.icon}
                                </div>
                                {item.name}
                                
                                {/* Indikator Titik Aktif */}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar (Pengaturan & Keluar) */}
                <div className="p-4 border-t border-gray-50 space-y-1.5 bg-gray-50/50">
                    <Link 
                        href={route('profile.edit')} 
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium transition-all group ${
                            route().current('profile.edit') 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-500 hover:bg-white hover:text-gray-900'
                        }`}
                    >
                        <Settings size={20} className={route().current('profile.edit') ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-900 transition-colors'} />
                        Pengaturan
                    </Link>
                    
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        className="w-full text-left flex items-center gap-3.5 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl font-medium transition-all group"
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* --- AREA KONTEN UTAMA --- */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300 w-full relative">
                
                {/* Header (Top Navigation) */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-20 flex items-center px-4 sm:px-8 justify-between w-full">
                    <div className="flex items-center gap-4">
                        {/* Tombol Hamburger Menu (Mobile) */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        
                        {/* Judul Halaman (Dilemparkan dari props header) */}
                        {header && (
                            <div className="hidden sm:block">
                                {header}
                            </div>
                        )}
                    </div>

                    {/* Aksi Kanan (Profil User) */}
                    <div className="flex items-center gap-4">
                        {/* Dropdown/Link Profil Pengguna */}
                        <Link href={route('profile.edit')} className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group hover:bg-gray-50 p-2 rounded-xl transition-all">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500">Ibu Balita</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-violet-100 border-2 border-violet-200 flex items-center justify-center text-violet-700 font-bold group-hover:ring-2 ring-violet-400 ring-offset-2 transition-all">
                                {getInitials(user?.name)}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Konten Halaman (Children) */}
                <main className="flex-1 overflow-x-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}