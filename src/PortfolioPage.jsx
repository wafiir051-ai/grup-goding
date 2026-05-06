import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import RevealOnScroll from './components/RevealOnScroll';
import MagneticButton from './components/MagneticButton';

const projects = [
  {
    id: 1,
    title: "SIMAQ Darussalam",
    description: "Platform digital untuk manajemen pembelajaran Al-Qur'an di Markaz Qur'an Darussalam.",
    fullDesc: "SIMAQ (Sistem Informasi Manajemen Al-Qur'an) adalah aplikasi modern yang membantu pengelolaan hafalan, setoran, dan evaluasi santri secara digital. Dilengkapi dengan fitur real-time dan dashboard admin.",
    tags: ["Manajemen Hafalan", "Setoran Online", "Evaluasi Santri", "Dashboard Admin"],
    link: "https://simaq.vercel.app",
    gradient: "from-blue-600 to-indigo-600",
    imageLetter: "S"
  },
  {
    id: 2,
    title: "PUSPITA INDAH",
    description: "Lembaga Pelatihan Kerja spesialis Jasa Rias Pengantin, Dekorasi, Catering, Tata Kecantikan, dan Tata Busana.",
    fullDesc: "Website resmi PUSPITA INDAH yang sudah terindeks di Google, menampilkan layanan pelatihan, galeri, informasi kontak lengkap, dan pendaftaran online.",
    tags: ["Profil Lembaga", "Galeri Kegiatan", "Pendaftaran Online", "Kontak Lengkap"],
    link: "https://www.puspitaindah.com",
    gradient: "from-rose-500 to-orange-500",
    imageLetter: "P"
  }
];

export default function PortfolioPage() {
  const goBack = () => window.location.href = '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <RevealOnScroll componentName="portfolio" direction="up" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" /> PORTFOLIO KAMI
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-gray-800">
            Proyek yang <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Telah Kami Selesaikan</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
            Setiap proyek adalah bukti komitmen kami dalam menghadirkan solusi digital terbaik.
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <RevealOnScroll key={project.id} customDelay={0.2 + idx * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
              >
                <div className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                  <div className="text-white text-7xl font-bold drop-shadow-lg opacity-80">{project.imageLetter}</div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h2>
                  <p className="text-zinc-600 text-sm mb-3">{project.description}</p>
                  <p className="text-sm text-zinc-500 mb-4 border-l-4 border-blue-400 pl-3 italic">{project.fullDesc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">{tag}</span>
                    ))}
                  </div>
                  <MagneticButton
                    as="a"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all group mt-auto"
                  >
                    Kunjungi Website <ExternalLink className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </main>
    </div>
  );
}
