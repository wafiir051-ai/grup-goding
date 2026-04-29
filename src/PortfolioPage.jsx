import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import RevealOnScroll from './components/RevealOnScroll';
import MagneticButton from './components/MagneticButton';

const projects = [
  { title: "SIMAQ Darussalam", description: "Platform digital untuk manajemen pembelajaran Al-Qur'an.", tags: ["React","Tailwind CSS"], link: "https://simaq.vercel.app", image: "https://placehold.co/600x400/1e3a8a/white?text=SIMAQ", gradient: "from-blue-600 to-indigo-600", fullDesc: "Aplikasi modern untuk pengelolaan hafalan dan setoran santri." },
  { title: "PUSPITA INDAH", description: "Lembaga Pelatihan Kerja spesialis Jasa Rias Pengantin.", tags: ["SEO","Website Profil"], link: "https://www.puspitaindah.com", image: "https://placehold.co/600x400/ec4899/white?text=PUSPITA+INDAH", gradient: "from-rose-500 to-orange-500", fullDesc: "Website resmi PUSPITA INDAH yang terindeks di Google." }
];

export default function PortfolioPage() {
  const goBack = () => window.location.href = '/';
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={goBack}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-xl text-gray-800">goding</span>
          </div>
          <MagneticButton onClick={goBack} className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </MagneticButton>
        </div>
      </nav>
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl text-center mb-10">Portfolio Kami</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className={`h-40 bg-gradient-to-br ${p.gradient}`} />
              <div className="p-6">
                <h2 className="text-2xl font-bold">{p.title}</h2>
                <p className="text-gray-600 mt-2">{p.description}</p>
                <a href={p.link} target="_blank" rel="noopener" className="inline-block mt-4 text-blue-600">Kunjungi →</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
