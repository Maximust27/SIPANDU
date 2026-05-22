import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ChevronRight, 
  HeartPulse, 
  Utensils, 
  ShieldCheck, 
  Activity, 
  Apple,
  PlayCircle,
  Bookmark
} from 'lucide-react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// --- CUSTOM CSS ---
const pageStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -40px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-dash-blob { animation: blob 8s infinite; }
  .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  /* Efek Hover Gambar Artikel */
  .article-card:hover .article-img {
    transform: scale(1.05);
  }
`;

// --- MOCK DATA KATEGORI & ARTIKEL ---
const categories = [
    { id: 'semua', label: 'Semua Artikel', icon: <BookOpen size={16} /> },
    { id: 'ibu-anak', label: 'Ibu & Anak', icon: <HeartPulse size={16} /> },
    { id: 'mpasi', label: 'Tips MPASI', icon: <Utensils size={16} /> },
    { id: 'stunting', label: 'Cegah Stunting', icon: <Activity size={16} /> },
    { id: 'imunisasi', label: 'Imunisasi', icon: <ShieldCheck size={16} /> },
    { id: 'pola-hidup', label: 'Pola Hidup Sehat', icon: <Apple size={16} /> },
];

export default function EdukasiKesehatan({ articles = [] }) {
    const [activeCategory, setActiveCategory] = useState('semua');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter artikel berdasarkan pencarian dan kategori
    const filteredArticles = articles.filter(article => {
        const matchCategory = activeCategory === 'semua' || article.category === activeCategory;
        const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const featuredArticle = articles.find(a => a.isFeatured);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-xl text-sky-600">
                        <BookOpen size={22} />
                    </div>
                    <h2 className="text-xl font-bold leading-tight text-gray-900">
                        Edukasi Kesehatan
                    </h2>
                </div>
            }
        >
            <Head title="Edukasi Kesehatan" />
            <style>{pageStyles}</style>

            <div className="p-4 sm:p-8 relative min-h-[calc(100vh-80px)] overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0"></div>
                <div className="absolute top-80 left-10 w-[400px] h-[400px] bg-violet-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-dash-blob pointer-events-none z-0" style={{ animationDelay: '2000ms' }}></div>

                <div className="max-w-7xl mx-auto relative z-10 pb-10 space-y-8">
                    
                    {/* === BAGIAN ATAS: PENCARIAN & KATEGORI === */}
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center glass-panel p-6 rounded-[2rem] shadow-sm">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Pusat Literasi Bunda</h3>
                            <p className="text-sm text-gray-500">Temukan informasi terpercaya untuk dukung tumbuh kembang si kecil.</p>
                        </div>
                        
                        <div className="w-full md:w-96 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari topik atau artikel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 text-sm rounded-full pl-11 pr-5 py-3.5 focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* PILIHAN KATEGORI (Scrollable horizontal on mobile) */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                                    activeCategory === cat.id
                                    ? 'bg-sky-600 text-white shadow-md shadow-sky-200 scale-105'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
                                }`}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* === ARTIKEL SOROTAN UTAMA === */}
                    {activeCategory === 'semua' && searchQuery === '' && featuredArticle && (
                        <Link href={route('education.show', featuredArticle.id)} className="relative rounded-[2.5rem] overflow-hidden shadow-lg group article-card cursor-pointer flex flex-col md:flex-row h-auto md:h-[400px] block">
                            {/* Gambar / Visual Sorotan (Sisi Kiri) */}
                            <div className={`w-full md:w-3/5 h-64 md:h-full bg-gradient-to-br ${featuredArticle.imageGradient} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                                <div className="w-full h-full article-img transition-transform duration-700 ease-out bg-[url('https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
                                
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="bg-white/90 backdrop-blur-md text-pink-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                        Sorotan Utama
                                    </span>
                                </div>
                            </div>
                            
                            {/* Konten Teks Sorotan (Sisi Kanan) */}
                            <div className="w-full md:w-2/5 bg-white p-8 md:p-10 flex flex-col justify-center relative z-20">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4">
                                    <span className="text-sky-600 bg-sky-50 px-2 py-1 rounded-md">{featuredArticle.categoryLabel}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {featuredArticle.readTime}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4 group-hover:text-sky-600 transition-colors">
                                    {featuredArticle.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed mb-8">
                                    {featuredArticle.excerpt}
                                </p>
                                <div className="mt-auto">
                                    <button className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all group-hover:shadow-lg">
                                        Mulai Membaca <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* === DAFTAR ARTIKEL GRID === */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            {searchQuery ? 'Hasil Pencarian' : (activeCategory === 'semua' ? 'Artikel Terbaru' : `Kategori: ${categories.find(c => c.id === activeCategory)?.label}`)}
                        </h4>
                        
                        {filteredArticles.length === 0 ? (
                            <div className="bg-white p-12 rounded-[2rem] border border-gray-100 text-center shadow-sm">
                                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} />
                                </div>
                                <h5 className="text-lg font-bold text-gray-900">Artikel tidak ditemukan</h5>
                                <p className="text-sm text-gray-500 mt-2">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredArticles.map((article, index) => (
                                    <Link 
                                        key={article.id}
                                        href={route('education.show', article.id)}
                                        className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group article-card animate-slide-up block"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Thumbnail Artikel */}
                                        <div className={`h-48 w-full bg-gradient-to-br ${article.imageGradient} relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/5 z-10 group-hover:bg-transparent transition-colors"></div>
                                            {/* Pattern abstrak pengganti gambar asli */}
                                            <div className="w-full h-full article-img transition-transform duration-500 ease-out opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                            
                                            {/* Tombol Bookmark (Hover state) */}
                                            <button className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/30 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                <Bookmark size={14} />
                                            </button>
                                        </div>

                                        {/* Konten Artikel */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg">
                                                    {article.categoryLabel}
                                                </span>
                                                <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                                                    <Clock size={12} /> {article.readTime}
                                                </span>
                                            </div>
                                            
                                            <h4 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                                                {article.title}
                                            </h4>
                                            
                                            <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed">
                                                {article.excerpt}
                                            </p>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-50">
                                                <button className="text-sm font-bold text-sky-600 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                                                    Baca Selengkapnya <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* === BANNER AJAKAN KONSULTASI === */}
                    <div className="mt-12 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute left-0 top-0 opacity-10 pointer-events-none transform -translate-x-1/4 -translate-y-1/4">
                            <HeartPulse size={200} fill="currentColor" />
                        </div>
                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-2">Butuh saran medis spesifik untuk si kecil?</h3>
                            <p className="text-violet-100 text-sm leading-relaxed">
                                Jangan ragu untuk menggunakan fitur AI Health Assistant kami atau langsung hubungi Bidan/Dokter di Posyandu terdekat untuk konsultasi lebih mendalam.
                            </p>
                        </div>
                        <div className="relative z-10 shrink-0 w-full md:w-auto">
                            <a href="/ai-assistant" className="w-full md:w-auto bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-sm hover:bg-violet-50 transition-colors shadow-md flex items-center justify-center gap-2">
                                <PlayCircle size={18} /> Tanya AI Sipandu
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}