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
    <div className="min-h-screen bg-white text-gray-900">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/60 rounded-full blur-[140px] pointer-events-none z-0" />

      <section className="relative pt-28 pb-16 px-6 overflow-hidden z-10">
        <div className="max-w-6xl mx-auto">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group text-sm font-medium mb-12">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6 border bg-blue-50 border-blue-200 text-blue-600">
            <Sparkles className="w-4 h-4" /> PORTFOLIO KAMI
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 text-gray-900">
            Karya Digital<br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Terbaik Kami</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-gray-500 max-w-2xl mb-16">
            Setiap proyek adalah bukti komitmen kami dalam menghadirkan solusi digital berkualitas tinggi.
          </motion.p>
        </div>
      </section>

      <section className="pb-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-96 bg-gray-100 rounded-3xl animate-pulse" />)}
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
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white border border-gray-200 hover:border-blue-300 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-100"
                  >
                    <div className={"relative h-64 bg-gradient-to-br " + project.gradient + " flex items-center justify-center overflow-hidden"}>
                      <div className="absolute inset-0 bg-black/10" />
                      <motion.span
                        animate={{ scale: hovered === project.id ? 1.2 : 1, rotate: hovered === project.id ? 5 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-white/90 font-black drop-shadow-2xl select-none relative z-10"
                        style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}
                      >
                        {project.image_letter}
                      </motion.span>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent" />
                      <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">{project.category}</div>
                      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">{project.year}</div>
                    </div>
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-2 text-gray-900">{project.title}</h2>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{project.description}</p>
                      {project.full_desc && <p className="text-sm text-gray-400 mb-6 border-l-2 border-blue-300 pl-4 italic leading-relaxed">{project.full_desc}</p>}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-7">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600">{tag}</span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 hover:scale-105 transition-all text-sm shadow-md shadow-blue-200">
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
            <div className="mt-20 text-center rounded-3xl p-12 border bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 border-blue-100 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.08)_0%,_transparent_70%)]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" /> MULAI PROYEK
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Mau Website Seperti Ini?</h3>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto">Konsultasi gratis, kami siap bantu wujudkan proyek digital kamu dari nol sampai launch.</p>
                <button onClick={() => openModal('Halo, saya tertarik membuat website seperti di portfolio Goding.')} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-10 py-4 rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-blue-200 text-base">
                  Mulai Proyek Sekarang 🚀
                </button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}