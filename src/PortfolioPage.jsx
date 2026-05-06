import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, ArrowLeft, Globe, Code2, Layers } from 'lucide-react';
import RevealOnScroll from './components/RevealOnScroll';

const projects = [
  {
    id: 1,
    title: "SIMAQ Darussalam",
    description: "Platform digital untuk manajemen pembelajaran Al-Qur'an di Markaz Qur'an Darussalam.",
    fullDesc: "Aplikasi modern yang membantu pengelolaan hafalan, setoran, dan evaluasi santri secara digital. Dilengkapi fitur real-time dan dashboard admin.",
    tags: ["Manajemen Hafalan", "Setoran Online", "Evaluasi Santri", "Dashboard Admin"],
    link: "https://simaq.vercel.app",
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    imageLetter: "S",
    year: "2024",
    category: "Web App"
  },
  {
    id: 2,
    title: "PUSPITA INDAH",
    description: "Lembaga Pelatihan Kerja spesialis Rias Pengantin, Dekorasi, Catering, dan Tata Kecantikan.",
    fullDesc: "Website resmi PUSPITA INDAH yang sudah terindeks di Google, menampilkan layanan pelatihan, galeri, dan pendaftaran online.",
    tags: ["Profil Lembaga", "Galeri Kegiatan", "Pendaftaran Online", "Kontak Lengkap"],
    link: "https://www.puspitaindah.com",
    gradient: "from-rose-500 via-pink-500 to-orange-500",
    imageLetter: "P",
    year: "2024",
    category: "Company Profile"
  }
];

const stats = [
  { label: "Proyek Selesai", value: "10+", icon: Layers },
  { label: "Klien Puas", value: "8+", icon: Sparkles },
  { label: "Teknologi", value: "15+", icon: Code2 },
  { label: "Website Live", value: "6+", icon: Globe },
];

export default function PortfolioPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-[#05080f] text-white">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" /> PORTFOLIO KAMI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
          >
            Proyek yang{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Telah Kami
            </span>
            <br />Selesaikan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-zinc-400 max-w-2xl mb-16"
          >
            Setiap proyek adalah bukti komitmen kami dalam menghadirkan solusi digital terbaik.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <Icon className="w-5 h-5 text-blue-400 mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <RevealOnScroll key={project.id} customDelay={idx * 0.15}>
                <motion.div
                  onHoverStart={() => setHovered(project.id)}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  <div className={"relative h-56 bg-gradient-to-br " + project.gradient + " flex items-center justify-center overflow-hidden"}>
                    <motion.span
                      animate={{ scale: hovered === project.id ? 1.15 : 1 }}
                      transition={{ duration: 0.4 }}
                      className="text-white text-9xl font-black drop-shadow-2xl select-none"
                    >
                      {project.imageLetter}
                    </motion.span>
                    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                      {project.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                      {project.year}
                    </div>
                  </div>

                  <div className="p-7">
                    <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <p className="text-sm text-zinc-500 mb-5 border-l-2 border-blue-500/50 pl-4 italic leading-relaxed">{project.fullDesc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                      <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm"
                    >
                      Kunjungi Website <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll>
            <div className="mt-16 text-center bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-10">
              <h3 className="text-3xl font-bold text-white mb-3">Mau Website Seperti Ini?</h3>
              <p className="text-zinc-400 mb-6">Konsultasi gratis, kami siap bantu wujudkan proyek digital kamu.</p>
              <button
                onClick={() => window.open("https://wa.me/6281234567890?text=Halo, saya tertarik membuat website seperti di portfolio Goding.", "_blank")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 hover:scale-105 transition-all"
              >
                Mulai Proyek Sekarang
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </div>
  );
}
