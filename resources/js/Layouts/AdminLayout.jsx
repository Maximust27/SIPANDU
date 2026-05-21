import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

import {
    LayoutDashboard,
    Building2,
    Users,
    FileBarChart2,
    Settings,
    LogOut,
    Menu,
    X,
    Heart
} from 'lucide-react';

export default function AdminLayout({
    headerTitle,
    headerIcon,
    children
}) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { auth } = usePage().props;

    const adminName = auth?.user?.name || 'Administrator';

    const navItems = [
        {
            name: 'Dashboard',
            routeName: 'admin.dashboard',
            icon: <LayoutDashboard size={20} />
        },
        {
            name: 'Manajemen User',
            routeName: 'admin.users.index',
            icon: <Users size={20} />
        },
        {
            name: 'Data Posyandu',
            routeName: 'admin.posyandu.index',
            icon: <Building2 size={20} />
        },
        {
            name: 'Laporan',
            routeName: 'admin.reports.index',
            icon: <FileBarChart2 size={20} />
        },
    ];

    return (
        <div className="min-h-screen bg-[#F4F9F9] font-sans flex overflow-hidden">

            {/* Scrollbar */}
            <style>{`
                .sidebar-scrollbar::-webkit-scrollbar { width: 4px; }
                .sidebar-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .sidebar-scrollbar::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 4px; }
                .sidebar-scrollbar:hover::-webkit-scrollbar-thumb { background: #93c5fd; }
            `}</style>

            {/* Overlay Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <aside
                className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-blue-50 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none lg:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >

                {/* LOGO */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-blue-50">
                    <div className="flex items-center gap-3">
                        <div
                            style={{ background: 'linear-gradient(135deg, #2563eb, #4338ca)' }}
                            className="p-2.5 rounded-xl text-white shadow-lg"
                        >
                            <Heart size={22} fill="currentColor" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            Sipandu<span className="text-blue-600">.</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 overflow-y-auto sidebar-scrollbar py-6 px-4 space-y-1.5">

                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-blue-400/80 mb-4">
                        Menu Administrator
                    </p>

                    {navItems.map((item, index) => {

                        let isActive = false;
                        let href = '#';

                        try {
                            if (item.routeName !== '#') {
                                isActive = route().current(item.routeName);
                                href = route(item.routeName);
                            }
                        } catch (e) {}

                        return (
                            <Link
                                key={index}
                                href={href}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100/50'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium border border-transparent'
                                }`}
                            >
                                <div className={`${
                                    isActive
                                        ? 'text-blue-600'
                                        : 'text-gray-400 group-hover:text-blue-500'
                                } transition-colors duration-200`}>
                                    {item.icon}
                                </div>

                                {item.name}

                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                )}
                            </Link>
                        );
                    })}

                </nav>

                {/* BOTTOM */}
                <div className="p-4 border-t border-blue-50 space-y-1.5 bg-blue-50/30">

                    <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:bg-white hover:text-gray-900 rounded-2xl font-medium transition-all group border border-transparent hover:border-gray-100"
                    >
                        <Settings size={20} className="text-gray-400 group-hover:text-gray-600" />
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

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300 w-full relative">

                {/* HEADER */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-blue-50 shadow-sm h-20 flex items-center px-4 sm:px-8 justify-between w-full">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="hidden sm:flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                {headerIcon || <LayoutDashboard size={20} />}
                            </div>
                            <h2 className="text-xl font-bold leading-tight text-gray-900">
                                {headerTitle}
                            </h2>
                        </div>

                    </div>

                    {/* PROFILE */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group"
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {adminName}
                                </p>
                                <p className="text-xs text-blue-600 font-medium">
                                    Administrator
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold group-hover:ring-2 ring-blue-400 ring-offset-2 transition-all shadow-sm">
                                {adminName.charAt(0)}
                            </div>
                        </Link>
                    </div>

                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-x-hidden relative p-4 sm:p-8">
                    {children}
                </main>

            </div>

        </div>
    );
}