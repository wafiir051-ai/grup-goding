import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, ArrowLeft } from 'lucide-react';
import RevealOnScroll from './components/RevealOnScroll';
import WhatsAppModal from './components/WhatsAppModal';
import { supabase } from './lib/supabase';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  useEffect(() => {
    supabase.from('portfolios').select('*').eq('is_active', true).order('order_index').then(({ data }) => {
      setProjects(data || []);
      setLoading(false);
    });
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open('https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message), '_blank');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-50/80 to-white pointer-events-none z-0" />
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <section className="relative pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors group text-sm font-medium mb-8 sm:mb-12 md:mb-16"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>

          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full mb-8 border bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> PORTFOLIO KAMI
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6 text-gray-900"
            >
              Karya Digital<br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Terbaik Kami</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-lg text-gray-500 max-w-xl mx-auto mb-6"
            >
              Setiap proyek adalah bukti komitmen kami dalam menghadirkan solusi digital berkualitas tinggi.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-10"
            >
              <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl px-3 sm:px-6 py-2 sm:py-3">
                <span className="text-2xl font-bold text-blue-600">{projects.length}+</span>
                <span className="text-sm text-gray-500">Proyek Selesai</span>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl px-6 py-3">
                <span className="text-2xl font-bold text-blue-600">100%</span>
                <span className="text-sm text-gray-500">Klien Puas</span>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl px-6 py-3">
                <span className="text-2xl font-bold text-blue-600">{new Date().getFullYear() === 2026 ? "<1" : (new Date().getFullYear() - 2026) + "+"}</span>
                <span className="text-sm text-gray-500">Tahun Pengalaman</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-28 px-6 relative z-10 bg-[#f8faff] pt-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
              <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-2xl font-semibold mb-2">Belum ada portfolio</p>
              <p>Tambahkan proyek di halaman admin</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <RevealOnScroll key={project.id} customDelay={idx * 0.15}>
                  <motion.div
                    onHoverStart={() => setHovered(project.id)}
                    onHoverEnd={() => setHovered(null)}
                    whileHover={{ y: -10, scale: 1.015 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-white border border-gray-100 hover:border-blue-200 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover"
                          style={{ transform: hovered === project.id ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s' }} />
                      ) : (
                        <div className={'w-full h-full bg-gradient-to-br ' + project.gradient + ' flex items-center justify-center relative'}>
                          <div className="absolute inset-0 bg-black/10" />
                          <motion.span
                            animate={{ scale: hovered === project.id ? 1.2 : 1, rotate: hovered === project.id ? 5 : 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-white/90 font-black drop-shadow-2xl select-none relative z-10"
                            style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}
                          >{project.image_letter}</motion.span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">{project.category}</div>
                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">{project.year}</div>
                    </div>

                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-2 text-gray-900">{project.title}</h2>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{project.description}</p>
                      {project.full_desc && (
                        <p className="text-sm text-gray-400 mb-6 border-l-2 border-blue-300 pl-4 italic leading-relaxed">{project.full_desc}</p>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-7">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600">{tag}</span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 hover:scale-105 transition-all text-sm shadow-md shadow-blue-200"
                        >
                          Kunjungi Website <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          )}

          <RevealOnScroll>
            <div className="mt-24 text-center rounded-3xl p-14 bg-gradient-to-br from-blue-600 to-cyan-500 relative overflow-hidden shadow-2xl shadow-blue-200">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" /> MULAI PROYEK
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Mau Website Seperti Ini?</h3>
                <p className="text-white/80 mb-8 max-w-lg mx-auto">Konsultasi gratis, kami siap bantu wujudkan proyek digital kamu dari nol sampai launch.</p>
                <button
                  onClick={() => openModal('Halo, saya tertarik membuat website seperti di portfolio Goding.')}
                  className="bg-white text-blue-600 font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl text-base"
                >
                  Mulai Proyek Sekarang
                </button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}