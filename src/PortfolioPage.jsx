import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Sparkles, Code, Globe, Zap } from 'lucide-react';
import RevealOnScroll from './components/RevealOnScroll';
import MagneticButton from './components/MagneticButton';

const projects = [
  { 
    title: "SIMAQ Darussalam", 
    description: "Platform digital untuk manajemen pembelajaran Al-Qur'an di Markaz Qur'an Darussalam.", 
    tags: ["React.js", "Tailwind CSS", "Supabase", "Vercel"], 
    link: "https://simaq.vercel.app", 
    image: "https://placehold.co/600x400/1e3a8a/white?text=SIMAQ+Darussalam", 
    gradient: "from-blue-700 to-indigo-600", 
    fullDesc: "SIMAQ (Sistem Informasi Manajemen Al-Qur'an) adalah aplikasi modern yang membantu pengelolaan hafalan, setoran, dan evaluasi santri secara digital. Dilengkapi dengan fitur real-time dan dashboard admin.", 
    features: ["Manajemen Hafalan", "Setoran Online", "Evaluasi Santri", "Dashboard Admin", "Notifikasi Real-time"]
  },
  { 
    title: "PUSPITA INDAH", 
    description: "Lembaga Pelatihan Kerja spesialis Jasa Rias Pengantin, Dekorasi, Catering, Tata Kecantikan, dan Tata Busana.", 
    tags: ["SEO", "Website Profil", "Google Indexed", "Responsive"], 
    link: "https://www.puspitaindah.com", 
    image: "https://placehold.co/600x400/ec4899/white?text=PUSPITA+INDAH", 
    gradient: "from-rose-500 to-orange-500", 
    fullDesc: "Website resmi PUSPITA INDAH yang sudah terindeks di Google, menampilkan layanan pelatihan, galeri, informasi kontak lengkap, dan pendaftaran online.", 
    features: ["Profil Lembaga", "Galeri Kegiatan", "Pendaftaran Online", "Kontak Lengkap", "SEO Optimized"]
  }
];

export default function PortfolioPage() {
  const goBack = () => window.location.href = '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navbar portfolio */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={goBack}>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">G</span>
            </div>
            <span className="font-semibold text-lg md:text-xl text-gray-800">goding</span>
          </div>
          <MagneticButton onClick={goBack} className="px-4 md:px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </MagneticButton>
        </div>
      </nav>

      <main className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <RevealOnScroll componentName="portfolio" direction="up" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" /> PORTFOLIO KAMI
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-800">
            Proyek yang <span className="gradient-text">Telah Kami Selesaikan</span>
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-zinc-600 max-w-2xl mx-auto">
            Setiap proyek adalah bukti komitmen kami dalam menghadirkan solusi digital terbaik untuk klien.
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {projects.map((project, idx) => (
            <RevealOnScroll key={idx} componentName="portfolio">
              <motion.div 
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                {/* Gambar proyek dengan gradient overlay */}
                <div className={`relative h-48 md:h-56 lg:h-64 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg px-4 text-center">
                      {project.title.split(' ')[0]}
                    </span>
                  </div>
                  {/* Efek animasi pada gambar */}
                  <motion.div 
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                <div className="p-5 md:p-6 lg:p-8">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 md:mb-3">
                    {project.title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Deskripsi lengkap */}
                  <div className="bg-gray-50 p-3 md:p-4 rounded-xl mb-4 md:mb-5 border-l-4 border-blue-400">
                    <p className="text-xs md:text-sm text-gray-700 italic leading-relaxed">
                      {project.fullDesc}
                    </p>
                  </div>

                  {/* Fitur unggulan */}
                  <div className="mb-4 md:mb-5">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" /> Fitur Unggulan
                    </h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {project.features.map((feature, i) => (
                        <span key={i} className="text-[10px] md:text-xs font-medium px-2 md:px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Teknologi yang digunakan */}
                  <div className="mb-5 md:mb-6">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Code className="w-3 h-3 md:w-4 md:h-4 text-blue-500" /> Teknologi
                    </h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] md:text-xs font-medium px-2 md:px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <MagneticButton 
                    as="a" 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm md:text-base hover:gap-3 transition-all group"
                  >
                    Kunjungi Website Proyek <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                  </MagneticButton>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Tombol kembali di bawah */}
        <div className="text-center mt-12 md:mt-16">
          <MagneticButton 
            onClick={goBack} 
            className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm md:text-base font-semibold shadow-md hover:shadow-lg transition inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </MagneticButton>
        </div>
      </main>
    </div>
  );
}
