import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, ArrowLeft, Code2, Palette, Zap } from 'lucide-react';
import RevealOnScroll from './components/RevealOnScroll';

const projects = [
  { id: 1, title: "SIMAQ Darussalam", description: "Platform digital untuk manajemen pembelajaran Al-Qur'an di Markaz Qur'an Darussalam.", fullDesc: "Aplikasi modern yang membantu pengelolaan hafalan, setoran, dan evaluasi santri secara digital. Dilengkapi fitur real-time dan dashboard admin.", tags: ["Manajemen Hafalan", "Setoran Online", "Evaluasi Santri", "Dashboard Admin"], link: "https://simaq.vercel.app", gradient: "from-blue-600 via-indigo-600 to-purple-600", imageLetter: "S", year: "2024", category: "Web App" },
  { id: 2, title: "PUSPITA INDAH", description: "Lembaga Pelatihan Kerja spesialis Rias Pengantin, Dekorasi, Catering, dan Tata Kecantikan.", fullDesc: "Website resmi PUSPITA INDAH yang sudah terindeks di Google, menampilkan layanan pelatihan, galeri, dan pendaftaran online.", tags: ["Profil Lembaga", "Galeri Kegiatan", "Pendaftaran Online", "Kontak Lengkap"], link: "https://www.puspitaindah.com", gradient: "from-rose-500 via-pink-500 to-orange-500", imageLetter: "P", year: "2024", category: "Company Profile" }
];

const stats = [
  { icon: Code2, label: "Proyek Selesai", value: "10+" },
  { icon: Palette, label: "Desain Custom", value: "100%" },
  { icon: Zap, label: "Performa", value: "A+" }
];

export default function PortfolioPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-[#05080f] text-white">

      {/* Glow bg */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Hero section */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden z-10">
        <div className="max-w-6xl mx-auto">

          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => window.history.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group text-sm font-medium mb-12">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6 border bg-blue-500/10 border-blue-500/20 text-blue-400">
            <Sparkles className="w-4 h-4" /> PORTFOLIO KAMI
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            Karya Digital<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Terbaik Kami</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-zinc-400 max-w-2xl mb-16">
            Setiap proyek adalah bukti komitmen kami dalam menghadirkan solusi digital berkualitas tinggi.
          </motion.p>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-6 mb-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                <Icon className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-zinc-500">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Projects grid */}
      <section className="pb-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <RevealOnScroll key={project.id} customDelay={idx * 0.15}>
                <motion.div
                  onHoverStart={() => setHovered(project.id)}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white/5 border border-white/10 hover:border-cyan-500/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  {/* Image area */}
                  <div className={"relative h-64 bg-gradient-to-br " + project.gradient + " flex items-center justify-center overflow-hidden"}>
                    <div className="absolute inset-0 bg-black/20" />
                    <motion.span
                      animate={{ scale: hovered === project.id ? 1.2 : 1, rotate: hovered === project.id ? 5 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-white/90 font-black drop-shadow-2xl select-none relative z-10"
                      style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}
                    >
                      {project.imageLetter}
                    </motion.span>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#05080f]/80 to-transparent" />
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">{project.category}</div>
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">{project.year}</div>
                  </div>

                  <div className="p-8">
                    <h2 className="text-2xl font-bold mb-2 text-white">{project.title}</h2>
                    <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{project.description}</p>
                    <p className="text-sm text-zinc-500 mb-6 border-l-2 border-cyan-500/40 pl-4 italic leading-relaxed">{project.fullDesc}</p>
                    <div className="flex flex-wrap gap-2 mb-7">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">{tag}</span>
                      ))}
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 hover:scale-105 transition-all text-sm shadow-lg shadow-blue-500/20">
                      Kunjungi Website <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>

          {/* CTA */}
          <RevealOnScroll>
            <div className="mt-20 text-center rounded-3xl p-12 border bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-purple-600/10 border-blue-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.15)_0%,_transparent_70%)]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" /> MULAI PROYEK
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Mau Website Seperti Ini?</h3>
                <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Konsultasi gratis, kami siap bantu wujudkan proyek digital kamu dari nol sampai launch.</p>
                <button onClick={() => window.open('https://wa.me/6281234567890?text=Halo, saya tertarik membuat website seperti di portfolio Goding.', '_blank')} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-10 py-4 rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-blue-500/30 text-base">
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