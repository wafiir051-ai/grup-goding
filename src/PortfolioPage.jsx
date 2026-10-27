import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Sparkles, ArrowLeft } from 'lucide-react';
import RevealOnScroll from './components/RevealOnScroll';
import WhatsAppModal from './components/WhatsAppModal';
import ScrollCard from './components/ScrollCard';
import ScrollWords from './components/ScrollWords';
import { HOVER_SPRING } from './lib/scrollMotion';
import { supabase } from './lib/supabase';
import TSLBackground from './components/TSLBackground';
import usePerfLite from './hooks/usePerfLite';

// Gambar proyek bergeser pelan di dalam bingkainya saat kartu melintasi layar,
// seperti dilihat dari jendela. Di tengah layar gambar berada di posisi aslinya.
function ParallaxMedia({ children }) {
  const reduced = useReducedMotion();
  const lite = usePerfLite();
  // Reduced-motion dan mode ringan: gambar diam di tempatnya, tanpa pelacakan scroll.
  if (reduced || lite) return <div className="w-full h-full">{children}</div>;
  return <MovingMedia>{children}</MovingMedia>;
}

function MovingMedia({ children }) {
  const ref = useRef(null);
  // Offset ditulis dengan px supaya framer memakai pelacakan JS, bukan ViewTimeline native.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 0px'] });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [16, 0, -16]);
  // Media terbuka di dalam bingkainya (ala Porsche dan Scout): mulai terpotong dan sedikit
  // diperbesar, lalu membuka penuh dan mengendur ke ukuran aslinya.
  const { scrollYProgress: reveal } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] });
  const clipPath = useTransform(reveal, (v) => {
    const k = 1 - v * v * (3 - 2 * v);
    return k < 0.005 ? 'none' : `inset(${k * 16}% round ${k * 28}px)`;
  });
  const scale = useTransform(reveal, [0, 1], [1.25, 1]);
  return (
    <motion.div ref={ref} className="w-full h-full" style={{ y, scale, clipPath }}>
      {children}
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  // Header berlapis: judul, lencana, dan statistik bergeser beda kecepatan saat di-scroll keluar.
  const headerRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: leaving } = useScroll({ target: headerRef, offset: ['start 0px', 'end 0px'] });
  const badgeY = useTransform(leaving, [0, 1], [0, -40]);
  const titleY = useTransform(leaving, [0, 1], [0, -90]);
  const titleOpacity = useTransform(leaving, [0.3, 1], [1, 0.2]);
  const statsY = useTransform(leaving, [0, 1], [0, -150]);
  const depth = (style) => (reduced ? undefined : style);

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
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <TSLBackground />
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none z-0" />
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <section ref={headerRef} className="relative pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-colors group text-sm font-medium mb-8 sm:mb-12 md:mb-16"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>

          <div className="text-center">
            <motion.div style={depth({ y: badgeY })}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full mb-8 border bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
              >
                <Sparkles className="w-4 h-4" /> PORTFOLIO KAMI
              </motion.div>
            </motion.div>

            <motion.div style={depth({ y: titleY, opacity: titleOpacity })}>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-white"
              >
                Karya Digital<br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Terbaik Kami</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-6"
              >
                Setiap proyek adalah bukti komitmen kami dalam menghadirkan solusi digital berkualitas tinggi.
              </motion.p>
            </motion.div>

            <motion.div style={depth({ y: statsY })}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-10"
              >
                <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-3 sm:px-6 py-2 sm:py-3">
                  <span className="text-2xl font-bold text-cyan-400">{projects.length}+</span>
                  <span className="text-sm text-zinc-400">Proyek Selesai</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3">
                  <span className="text-2xl font-bold text-cyan-400">100%</span>
                  <span className="text-sm text-zinc-400">Klien Puas</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3">
                  <span className="text-2xl font-bold text-cyan-400">{new Date().getFullYear() === 2026 ? "<1" : (new Date().getFullYear() - 2026) + "+"}</span>
                  <span className="text-sm text-zinc-400">Tahun Pengalaman</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-28 px-4 sm:px-6 relative z-10 pt-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="h-96 bg-zinc-900 rounded-3xl animate-pulse" />
              <div className="h-96 bg-zinc-900 rounded-3xl animate-pulse" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 text-zinc-500">
              <p className="text-2xl font-semibold mb-2">Belum ada portfolio</p>
              <p>Tambahkan proyek di halaman admin</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {projects.map((project, idx) => (
                <RevealOnScroll key={project.id} customDelay={idx * 0.15}>
                  {/* Kartu naik dan sedikit miring sesuai posisi scroll, kolom kanan sedikit tertinggal. */}
                  <ScrollCard className="h-full">
                  <motion.div
                    onHoverStart={() => setHovered(project.id)}
                    onHoverEnd={() => setHovered(null)}
                    whileHover={{ y: -8 }}
                    transition={HOVER_SPRING}
                    className="bg-white border border-gray-100 hover:border-cyan-400/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-100 transition-[border-color,box-shadow] duration-300 flex flex-col h-full"
                  >
                    <div className="relative h-52 overflow-hidden bg-gray-50 border-b border-gray-100">
                      {project.image_url ? (
                        <ParallaxMedia>
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-contain p-8"
                            style={{ transform: hovered === project.id ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s' }} />
                        </ParallaxMedia>
                      ) : (
                        <div className={'w-full h-full bg-gradient-to-br ' + project.gradient + ' flex items-center justify-center relative'}>
                          <div className="absolute inset-0 bg-black/20" />
                          <ParallaxMedia>
                            <div className="w-full h-full flex items-center justify-center">
                              <motion.span
                                animate={{ scale: hovered === project.id ? 1.15 : 1, rotate: hovered === project.id ? 4 : 0 }}
                                transition={{ duration: 0.4 }}
                                className="text-white/90 font-black drop-shadow-2xl select-none relative z-10"
                                style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}
                              >{project.image_letter}</motion.span>
                            </div>
                          </ParallaxMedia>
                        </div>
                      )}

                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">{project.category}</div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">{project.year}</div>
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{project.title}</h2>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                      {project.full_desc && (
                        <p className="text-sm text-gray-500 mb-6 border-l-2 border-cyan-500 pl-4 italic leading-relaxed">{project.full_desc}</p>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-7">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700">{tag}</span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold px-6 py-3 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-300 ease-out text-sm w-fit"
                        >
                          Kunjungi Website <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                  </ScrollCard>
                </RevealOnScroll>
              ))}
            </div>
          )}

          <RevealOnScroll>
            <ScrollCard range={['start 0.95', 'start 0.6']}>
            <div className="mt-24 text-center rounded-3xl p-8 md:p-14 bg-zinc-900/80 backdrop-blur-md border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(34,211,238,0.08)_0%,_transparent_60%)]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" /> MULAI PROYEK
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"><ScrollWords text="Mau Website Seperti Ini?" end="start 0.8" /></h3>
                <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Konsultasi gratis, kami siap bantu wujudkan proyek digital kamu dari nol sampai launch.</p>
                <button
                  onClick={() => openModal('Halo, saya tertarik membuat website seperti di portfolio Goding.')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-all duration-300 ease-out text-base"
                >
                  Konsultasi Sekarang
                </button>
              </div>
            </div>
            </ScrollCard>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
