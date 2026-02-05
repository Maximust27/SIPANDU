import React, { useState, useEffect, useRef } from 'react';
import { Link, Head } from '@inertiajs/react';

import { 
  Heart, 
  Activity, 
  Calendar, 
  Users, 
  Utensils, 
  AlertTriangle, 
  ChevronRight,
  Phone,
  MapPin,
  Menu,
  X,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  BarChart2,
  Bell,
  ShieldCheck,
  Target
} from 'lucide-react';

// --- CUSTOM CSS FOR ANIMATIONS ---
const styles = `
  /* Float Animations */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  @keyframes float-delayed {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }

  /* Entrance Animations */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  /* Utility Classes */
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
  .animate-blob { animation: blob 7s infinite; }
  
  /* Animation Classes for Scroll Reveal */
  .animate-fade-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
  .animate-fade-left { animation: fadeInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
  .animate-fade-right { animation: fadeInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
  .animate-zoom-in { animation: zoomIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }

  /* Delays currently handled via inline styles in component, but keeping util classes just in case */
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  
  html {
    scroll-behavior: smooth;
  }
`;

// --- HELPER COMPONENT: SCROLL REVEAL ---
const ScrollReveal = ({ children, className = "", animation = "animate-fade-up", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } 
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`${className} ${isVisible ? animation : 'opacity-0'}`} 
      style={{ animationDelay: isVisible ? `${delay}ms` : '0s' }}
    >
      {children}
    </div>
  );
};

// --- COMPONENTS ---

const Navbar = ({ auth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { label: 'Beranda', target: 'home' },
    { label: 'Tentang', target: 'about' },
    { label: 'Layanan', target: 'services' },
    { label: 'Alur Proses', target: 'process' },
    { label: 'FAQ', target: 'faq' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'} animate-fade-up`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => scrollToSection(e, 'home')}>
            <div className="bg-violet-600 p-2 rounded-xl text-white shadow-lg shadow-violet-200">
              <Heart size={24} fill="currentColor" />
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">Sipandu<span className="text-violet-600">.</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <a 
                key={item.label} 
                href={`#${item.target}`} 
                onClick={(e) => scrollToSection(e, item.target)}
                className="text-gray-600 hover:text-violet-600 font-medium text-sm transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {auth?.user ? (
               <Link 
                 href="/dashboard" 
                 className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-violet-200 transition-all hover:-translate-y-1"
               >
                 Dashboard
               </Link>
            ) : (
               <>
                 <Link 
                   href="/login" 
                   className="text-violet-600 font-bold text-sm px-4 py-2 hover:bg-violet-50 rounded-full transition"
                 >
                   Masuk
                 </Link>
                 <Link 
                   href="/register" 
                   className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl shadow-violet-200 transition-all hover:-translate-y-1"
                 >
                   Daftar Sekarang
                 </Link>
               </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-600">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 shadow-xl flex flex-col gap-4 animate-fade-up">
          {navLinks.map((item) => (
             <a 
               key={item.label} 
               href={`#${item.target}`} 
               onClick={(e) => scrollToSection(e, item.target)}
               className="text-gray-600 font-medium py-2 px-4 hover:bg-gray-50 rounded-lg"
             >
               {item.label}
             </a>
          ))}
          {auth?.user ? (
            <Link href="/dashboard" className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold text-center block">
               Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="w-full text-violet-600 py-3 rounded-xl font-bold text-center block hover:bg-violet-50">
                Masuk
              </Link>
              <Link href="/register" className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold text-center block">
                Daftar Sekarang
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#F8F9FF]">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
        <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <ScrollReveal delay={100} animation="animate-fade-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-violet-100 text-violet-700 font-semibold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
                Sistem Posyandu Digital Terpadu
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200} animation="animate-fade-up">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Kesehatan Anak <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                  Prioritas Utama
                </span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={300} animation="animate-fade-up">
              <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                Pantau tumbuh kembang si kecil, dapatkan jadwal imunisasi, dan konsultasi gizi secara online melalui website yang mudah diakses dari perangkat apapun.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={400} animation="animate-fade-up">
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register" className="px-8 py-4 bg-violet-600 text-white font-bold rounded-full shadow-xl shadow-violet-200 hover:bg-violet-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center">
                  Cek Jadwal Posyandu
                </Link>
                <Link href="/login" className="px-8 py-4 bg-white text-gray-700 font-bold rounded-full shadow-md hover:shadow-lg border border-gray-100 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all duration-300 group">
                  <PlayCircle className="text-violet-600 group-hover:scale-110 transition-transform" />
                  Masuk Sekarang
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={500} animation="animate-fade-up">
              <div className="pt-8 flex items-center gap-8 border-t border-gray-200/50">
                 <div>
                   <h3 className="text-3xl font-bold text-gray-900">1.2k+</h3>
                   <p className="text-sm text-gray-500">Anak Terdaftar</p>
                 </div>
                 <div>
                   <h3 className="text-3xl font-bold text-gray-900">50+</h3>
                   <p className="text-sm text-gray-500">Kader Aktif</p>
                 </div>
                 <div>
                   <h3 className="text-3xl font-bold text-gray-900">24/7</h3>
                   <p className="text-sm text-gray-500">Akses Data</p>
                 </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Visual (Abstract Web Dashboard Composition) */}
          <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
             <ScrollReveal delay={300} animation="animate-zoom-in" className="h-full">
               {/* Main Web Container Illustration */}
               <div className="absolute top-10 left-10 right-0 bottom-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700">
                  {/* Browser Header */}
                  <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     <div className="ml-4 w-1/2 h-4 bg-gray-100 rounded-full"></div>
                  </div>
                  {/* Content Placeholder */}
                  <div className="p-6 grid grid-cols-3 gap-6">
                     <div className="col-span-2 space-y-4">
                        <div className="h-32 bg-violet-50 rounded-2xl w-full animate-pulse"></div>
                        <div className="h-48 bg-gray-50 rounded-2xl w-full"></div>
                     </div>
                     <div className="col-span-1 space-y-4">
                        <div className="h-20 bg-orange-50 rounded-2xl w-full"></div>
                        <div className="h-60 bg-blue-50 rounded-2xl w-full"></div>
                     </div>
                  </div>
               </div>

               {/* Floating UI Card 1: Data Realtime */}
               <div className="absolute top-20 -left-5 animate-float z-20">
                  <div className="glass-card p-5 rounded-2xl shadow-xl border-l-4 border-violet-600 max-w-[200px]">
                     <div className="flex items-center gap-3 mb-2">
                        <Activity size={20} className="text-violet-600" />
                        <span className="font-bold text-gray-900 text-sm">Real-time</span>
                     </div>
                     <p className="text-xs text-gray-500">Data pertumbuhan anak terupdate otomatis.</p>
                  </div>
               </div>

               {/* Floating UI Card 2: Status Alert */}
               <div className="absolute bottom-32 -right-5 animate-float-delayed z-20">
                  <div className="glass-card p-4 rounded-2xl shadow-xl flex items-center gap-4">
                     <div className="bg-green-100 p-3 rounded-xl text-green-600">
                       <CheckCircle size={24} />
                     </div>
                     <div>
                       <h4 className="font-bold text-gray-900">Gizi Baik</h4>
                       <p className="text-xs text-gray-500">Status bulan ini</p>
                     </div>
                  </div>
               </div>
             </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Visual: Composition of Images/Shapes */}
          <div className="relative order-2 lg:order-1">
             <ScrollReveal animation="animate-fade-right">
               <div className="relative z-10 bg-violet-50 rounded-[3rem] p-8 lg:p-12 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -ml-16 -mb-16"></div>
                  
                  <div className="relative grid grid-cols-2 gap-4">
                     <div className="space-y-4 mt-8">
                        <div className="bg-white p-6 rounded-3xl shadow-lg">
                           <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                              <Target size={24} />
                           </div>
                           <h4 className="font-bold text-gray-900 text-lg">Visi Misi</h4>
                           <p className="text-sm text-gray-500 mt-2">Menuju Indonesia bebas stunting 2030.</p>
                        </div>
                        <div className="bg-violet-600 p-6 rounded-3xl shadow-lg text-white">
                           <h4 className="font-bold text-2xl mb-1">100%</h4>
                           <p className="text-sm opacity-90">Gratis untuk masyarakat.</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-white p-6 rounded-3xl shadow-lg h-full flex flex-col justify-center">
                           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                              <ShieldCheck size={24} />
                           </div>
                           <h4 className="font-bold text-gray-900 text-lg">Terpercaya</h4>
                           <p className="text-sm text-gray-500 mt-2">Dikelola kader terlatih.</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Decorative element */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-100 rounded-full -z-10 animate-blob"></div>
             </ScrollReveal>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2">
             <ScrollReveal animation="animate-fade-left" delay={200}>
                <span className="text-violet-600 font-bold tracking-widest text-xs uppercase bg-violet-50 px-4 py-2 rounded-full mb-6 inline-block">Tentang Sipandu</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Inovasi Digital untuk <br/>
                  <span className="text-violet-600">Generasi Emas</span>
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-6">
                  Sipandu (Sistem Informasi Posyandu Terpadu) hadir sebagai solusi modern untuk menjembatani komunikasi antara kader posyandu, bidan desa, dan orang tua.
                </p>
                <p className="text-lg text-gray-500 leading-relaxed mb-8">
                  Kami berkomitmen untuk menyediakan data kesehatan yang akurat, transparan, dan mudah diakses guna mempercepat penanganan masalah gizi buruk dan stunting di tingkat desa.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    'Pencatatan data kesehatan digital yang akurat',
                    'Edukasi gizi berbasis bahan pangan lokal',
                    'Pemantauan status gizi secara real-time'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                        <CheckCircle size={14} />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="px-8 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-violet-600 hover:text-violet-600 transition-colors">
                  Baca Selengkapnya
                </button>
             </ScrollReveal>
          </div>
          
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title, desc, color }) => (
  <div className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-transparent hover:shadow-[0_20px_60px_rgba(139,92,246,0.1)] transition-all duration-500 overflow-hidden h-full">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color.bg} rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`}></div>
    
    <div className="relative z-10">
      <div className={`w-16 h-16 ${color.bg} ${color.text} rounded-2xl flex items-center justify-center mb-8 text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed mb-8">{desc}</p>
      
      <a href="#" className="inline-flex items-center text-sm font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
        Pelajari Lebih Lanjut 
        <div className="ml-2 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all">
          <ArrowRight size={14} />
        </div>
      </a>
    </div>
  </div>
);

const FeaturesSection = () => {
  return (
    <section id="services" className="py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
           <ScrollReveal>
             <span className="text-violet-600 font-bold tracking-widest text-xs uppercase bg-violet-50 px-4 py-2 rounded-full mb-4 inline-block">Fitur Unggulan</span>
           </ScrollReveal>
           <ScrollReveal delay={100}>
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Solusi Lengkap Kesehatan Anak</h2>
           </ScrollReveal>
           <ScrollReveal delay={200}>
             <p className="text-gray-500 text-lg">Platform website terintegrasi yang menghubungkan Orang Tua, Kader, dan Bidan Desa dalam satu ekosistem digital.</p>
           </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <ScrollReveal delay={100} className="h-full">
             <ServiceCard 
               icon={<Activity />} 
               title="Monitoring Tumbuh Kembang" 
               desc="Pantau berat dan tinggi badan anak secara berkala. Grafik otomatis membantu mendeteksi risiko stunting lebih dini."
               color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
             />
           </ScrollReveal>
           
           <ScrollReveal delay={300} className="h-full">
             <ServiceCard 
               icon={<Utensils />} 
               title="Rekomendasi Menu Gizi" 
               desc="Dapatkan inspirasi menu MPASI dan makanan bergizi berbasis bahan pangan lokal yang mudah didapat dan terjangkau."
               color={{ bg: 'bg-orange-50', text: 'text-orange-600' }}
             />
           </ScrollReveal>

           <ScrollReveal delay={500} className="h-full">
             <ServiceCard 
               icon={<Calendar />} 
               title="Jadwal & Pengingat" 
               desc="Tidak ada lagi jadwal imunisasi yang terlewat. Notifikasi otomatis di dashboard web setiap bulan."
               color={{ bg: 'bg-violet-50', text: 'text-violet-600' }}
             />
           </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gray-50 rounded-full mix-blend-overlay opacity-50 filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* REPLACED PHONE MOCKUP WITH WEB DASHBOARD PREVIEW */}
          <div className="order-2 lg:order-1 relative">
             <ScrollReveal animation="animate-zoom-in">
               <div className="relative mx-auto w-full max-w-lg aspect-[4/3] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                  {/* Browser Header Bar */}
                  <div className="bg-gray-50 border-b border-gray-100 p-3 flex gap-2 items-center">
                     <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                     </div>
                     <div className="bg-white border border-gray-200 rounded text-[10px] text-gray-400 px-3 py-1 flex-1 text-center font-mono">
                       sipandu.id/dashboard/user
                     </div>
                  </div>

                  {/* Web UI Mockup Inside */}
                  <div className="p-6 bg-gray-50/50 h-full">
                     {/* Header Mock */}
                     <div className="flex justify-between items-center mb-6">
                        <div>
                           <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                           <div className="h-2 w-20 bg-gray-100 rounded"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400"><Bell size={14}/></div>
                          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-xs">S</div>
                        </div>
                     </div>

                     {/* Cards Grid */}
                     <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                           <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 bg-violet-50 rounded-lg flex items-center justify-center text-violet-500"><Activity size={12}/></div>
                             <div className="h-2 w-12 bg-gray-100 rounded"></div>
                           </div>
                           <div className="h-6 w-16 bg-gray-200 rounded mb-1"></div>
                           <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                              <div className="h-full w-3/4 bg-green-500"></div>
                           </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                           <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500"><Utensils size={12}/></div>
                             <div className="h-2 w-12 bg-gray-100 rounded"></div>
                           </div>
                           <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        </div>
                     </div>

                     {/* List Mock */}
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="h-3 w-24 bg-gray-200 rounded mb-4"></div>
                        {[1, 2].map(i => (
                          <div key={i} className="flex justify-between items-center mb-3 last:mb-0">
                             <div className="flex gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                                <div className="space-y-1">
                                   <div className="h-2 w-20 bg-gray-200 rounded"></div>
                                   <div className="h-2 w-12 bg-gray-100 rounded"></div>
                                </div>
                             </div>
                             <div className="h-4 w-4 rounded-full bg-green-100"></div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
               
               {/* Floating Elements */}
               <div className="absolute -top-6 -right-6 bg-white p-3 rounded-xl shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                     <div className="bg-green-100 p-1.5 rounded-lg text-green-600"><CheckCircle size={16}/></div>
                     <span className="text-xs font-bold text-gray-700">Data Sinkron</span>
                  </div>
               </div>
             </ScrollReveal>
          </div>

          <div className="order-1 lg:order-2">
             <ScrollReveal delay={200} animation="animate-fade-left">
                <span className="text-violet-600 font-bold tracking-widest text-xs uppercase mb-4 block">Alur Proses</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">Mudah, Cepat, dan <br/>Terintegrasi</h2>
             </ScrollReveal>
             
             <div className="space-y-8">
                {[
                  { num: "01", title: "Registrasi di Web", desc: "Daftarkan akun keluarga Anda melalui website Sipandu dengan mudah." },
                  { num: "02", title: "Input Data Digital", desc: "Kader menginput data hasil penimbangan langsung ke dashboard sistem." },
                  { num: "03", title: "Analisis Otomatis", desc: "Sistem web menganalisis status gizi (Normal/Stunting) secara real-time." },
                  { num: "04", title: "Akses Dimana Saja", desc: "Pantau grafik perkembangan anak kapan saja lewat browser HP atau Laptop." }
                ].map((step, idx) => (
                  <ScrollReveal key={idx} delay={300 + (idx * 150)} animation="animate-fade-up">
                    <div className="flex gap-6 group cursor-pointer">
                       <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-white border-2 border-violet-100 text-violet-600 font-bold flex items-center justify-center text-lg group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-colors">
                            {step.num}
                          </div>
                          {idx !== 3 && <div className="w-0.5 h-full bg-gray-200 my-2 group-hover:bg-violet-200 transition-colors"></div>}
                       </div>
                       <div className="pb-8">
                          <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">{step.title}</h4>
                          <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                       </div>
                    </div>
                  </ScrollReveal>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-violet-600' : 'text-gray-800 group-hover:text-violet-600'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-violet-600 text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-violet-100'}`}>
          <ChevronRight size={18} className="transform rotate-90" />
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-500 leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    { q: "Apakah website ini bisa dibuka di HP?", a: "Ya, website Sipandu didesain fully responsive (mobile-first), sehingga tampilannya akan menyesuaikan dengan layar HP, tablet, maupun laptop Anda." },
    { q: "Apakah perlu download aplikasi?", a: "Tidak perlu. Anda cukup membuka alamat website sipandu melalui browser (Chrome/Safari) tanpa perlu menginstal aplikasi tambahan." },
    { q: "Apakah data anak saya aman?", a: "Keamanan data adalah prioritas kami. Data disimpan dengan enkripsi standar dan hanya dapat diakses oleh pihak berwenang (Kader/Nakes)." },
    { q: "Bagaimana jika lupa jadwal?", a: "Dashboard web akan menampilkan notifikasi pengingat jadwal terdekat di halaman utama saat Anda login." }
  ];

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-gray-500">Informasi seputar penggunaan sistem Sipandu.</p>
          </ScrollReveal>
        </div>
        
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100">
             {faqs.map((faq, idx) => (
               <FAQItem 
                 key={idx} 
                 question={faq.q} 
                 answer={faq.a} 
                 isOpen={openIndex === idx} 
                 onClick={() => setOpenIndex(idx === openIndex ? -1 : idx)}
               />
             ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 rounded-t-[3rem] mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-violet-600 p-2 rounded-lg text-white">
                <Heart size={20} fill="currentColor" />
              </div>
              <span className="font-bold text-2xl">Sipandu.</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-8">
              Mewujudkan generasi emas Indonesia bebas stunting melalui digitalisasi layanan kesehatan tingkat dasar yang terintegrasi berbasis web.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Instagram', 'Twitter', 'Youtube'].map((social) => (
                <div key={social} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet-600 transition-colors cursor-pointer text-gray-400 hover:text-white">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Menu Cepat</h4>
            <ul className="space-y-4 text-gray-400">
              {['Beranda', 'Tentang Kami', 'Layanan', 'Artikel Kesehatan', 'Kontak'].map(item => (
                <li key={item}><a href="#" className="hover:text-violet-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Hubungi Kami</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-violet-500" size={18} />
                <span>Jl. Melati No. 45, Desa Sukamaju, Cilacap, Jawa Tengah</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-violet-500" size={18} />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-green-400">Layanan Online 24/7</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 Sipandu Posyandu Digital. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN APP ---
const SipanduApp = ({ auth }) => {
  return (
    <>
      <Head title="Sipandu - Sistem Posyandu Terpadu" />
      <div className="font-sans antialiased text-gray-600 bg-white min-h-screen">
        <style>{styles}</style>
        <Navbar auth={auth} />
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ProcessSection />
        <FAQSection />
        <Footer />
      </div>
    </>
  );
};

export default SipanduApp;