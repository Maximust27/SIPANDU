import React from 'react';
import { 
  ChevronLeft, 
  Clock, 
  Share2, 
  Bookmark, 
  Calendar,
  HeartPulse,
  Utensils,
  Activity,
  ShieldCheck,
  Apple
} from 'lucide-react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// --- CUSTOM CSS ---
const pageStyles = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  
  /* Styling untuk konten artikel */
  .article-content p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    color: #4b5563; /* text-gray-600 */
    font-size: 1.05rem;
  }
  .article-content strong {
    color: #111827; /* text-gray-900 */
    font-weight: 700;
  }
  .article-content h1, .article-content h2, .article-content h3 {
    color: #111827;
    font-weight: 800;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const getCategoryIcon = (category) => {
    switch(category) {
        case 'ibu-anak': return <HeartPulse size={16} />;
        case 'mpasi': return <Utensils size={16} />;
        case 'stunting': return <Activity size={16} />;
        case 'imunisasi': return <ShieldCheck size={16} />;
        case 'pola-hidup': return <Apple size={16} />;
        default: return <HeartPulse size={16} />;
    }
};

export default function EdukasiKesehatanDetail({ article, relatedArticles = [] }) {
    if (!article) return null;

    // Memproses konten teks menjadi paragraf HTML sederhana
    // Karena kita memakai \n\n sebagai pemisah paragraf
    const renderContent = (content) => {
        return content.split('\n\n').map((paragraph, idx) => {
            // Jika diawali dengan angka atau list (seperti "1. " atau "- ")
            if (paragraph.match(/^(\d+\.|-)\s/)) {
                const listItems = paragraph.split('\n');
                return (
                    <div key={idx} className="mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <ul className="space-y-3">
                            {listItems.map((item, i) => {
                                // Pisahkan judul list dari isinya jika ada titik dua (e.g., "1. Alpukat: Kaya akan...")
                                const parts = item.split(':');
                                if (parts.length > 1) {
                                    return (
                                        <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                                            <span className="text-sky-500 mt-1">•</span>
                                            <span><strong>{parts[0]}:</strong> {parts.slice(1).join(':')}</span>
                                        </li>
                                    );
                                }
                                return (
                                    <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span>{item.replace(/^(\d+\.|-)\s/, '')}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            }
            // Paragraf biasa
            return <p key={idx}>{paragraph}</p>;
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('education.index')} 
                        className="bg-white hover:bg-gray-50 p-2.5 rounded-full text-gray-600 shadow-sm transition-all"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <h2 className="text-xl font-bold leading-tight text-gray-900 line-clamp-1">
                        Baca Artikel
                    </h2>
                </div>
            }
        >
            <Head title={article.title} />
            <style>{pageStyles}</style>

            <div className="bg-gray-50 min-h-screen pb-20 pt-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-slide-up">
                    
                    {/* BAGIAN HEADER ARTIKEL */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
                        {/* Gambar Banner Utama */}
                        <div className={`h-64 sm:h-80 lg:h-96 w-full bg-gradient-to-br ${article.imageGradient} relative`}>
                            <div className="absolute inset-0 bg-black/20 z-10"></div>
                            {/* Pattern abstrak pengganti gambar asli */}
                            <div className="w-full h-full article-img bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-40"></div>
                            
                            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20 flex gap-3">
                                <span className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
                                    <span className="text-sky-600">{getCategoryIcon(article.category)}</span>
                                    {article.categoryLabel}
                                </span>
                            </div>
                        </div>

                        {/* Judul & Meta Info */}
                        <div className="p-6 sm:p-10 lg:p-12 relative">
                            {/* Tombol Aksi Kanan Atas */}
                            <div className="absolute top-0 right-6 sm:right-10 -translate-y-1/2 flex gap-3 z-30">
                                <button className="w-12 h-12 bg-white text-gray-500 hover:text-rose-500 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-gray-100">
                                    <Bookmark size={20} />
                                </button>
                                <button className="w-12 h-12 bg-white text-gray-500 hover:text-sky-500 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-gray-100">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                                <span className="flex items-center gap-1.5"><Calendar size={16} /> 22 Mei 2026</span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5"><Clock size={16} /> {article.readTime}</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.2] mb-6">
                                {article.title}
                            </h1>
                            
                            <p className="text-xl text-gray-500 leading-relaxed font-medium">
                                {article.excerpt}
                            </p>
                        </div>
                    </div>

                    {/* ISI ARTIKEL */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-12">
                        <div className="article-content">
                            {renderContent(article.content)}
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bagikan Artikel Ini</p>
                            <div className="flex gap-3">
                                {['Facebook', 'Twitter', 'WhatsApp'].map(social => (
                                    <button key={social} className="px-4 py-2 bg-gray-50 hover:bg-sky-50 hover:text-sky-600 text-gray-500 text-sm font-bold rounded-xl transition-colors border border-gray-200">
                                        {social}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ARTIKEL TERKAIT */}
                    {relatedArticles.length > 0 && (
                        <div className="pt-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Mungkin Anda Juga Suka</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedArticles.map((relArticle, index) => (
                                    <Link 
                                        key={relArticle.id}
                                        href={route('education.show', relArticle.id)}
                                        className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group block"
                                    >
                                        <div className={`h-40 w-full bg-gradient-to-br ${relArticle.imageGradient} relative`}>
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                                            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-30"></div>
                                        </div>
                                        <div className="p-5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-1 rounded-md mb-3 inline-block">
                                                {relArticle.categoryLabel}
                                            </span>
                                            <h4 className="text-base font-bold text-gray-900 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2 mb-2">
                                                {relArticle.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} /> {relArticle.readTime}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
