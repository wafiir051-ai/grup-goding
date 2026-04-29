import { motion } from 'framer-motion';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import EnhancedRevealOnScroll from './EnhancedRevealOnScroll';
import MagneticButton from './MagneticButton';

const projects = [
  {
    title: "SIMAQ Darussalam",
    description: "Markaz Qur'an Darussalam – Platform digital untuk manajemen pembelajaran Al-Qur'an. Sistem ini membantu pengelolaan santri, jadwal hafalan, dan evaluasi pembelajaran.",
    tags: ["React", "Tailwind CSS", "Vercel", "Supabase"],
    link: "https://simaq.vercel.app",
    image: "📖",
    gradient: "from-blue-600 to-indigo-600",
    fullDescription: "SIMAQ adalah sistem informasi manajemen hafalan Al-Qur'an yang dibangun untuk Markaz Qur'an Darussalam. Fitur unggulan: dashboard santri, pencatatan setoran hafalan, evaluasi guru, dan laporan progres. Dibangun dengan React Vite, Tailwind CSS, dan Supabase sebagai backend."
  },
  {
    title: "PUSPITA INDAH",
    description: "Lembaga Pelatihan Kerja (LPK) spesialis Jasa Rias Pengantin, Dekorasi, Catering, Tata Kecantikan, dan Tata Busana.",
    tags: ["SEO Friendly", "Website Profil", "Google Indexed"],
    link: "https://www.puspitaindah.com",
    image: "💄",
    gradient: "from-rose-500 to-orange-500",
    fullDescription: "Website resmi PUSPITA INDAH yang menampilkan program pelatihan, galeri karya, informasi pendaftaran, dan artikel seputar kecantikan. Website telah terindeks di Google dan muncul di pencarian organik."
  }
];

export default function PortfolioPage() {
  const goBack = () => window.location.href = '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navbar sederhana */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-xl text-gray-800">goding</span>
          </div>
          <MagneticButton onClick={goBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </MagneticButton>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <EnhancedRevealOnScroll delay={0.1} direction="up" type="scale">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-800 mb-4">
                Portfolio <span className="gradient-text">Kami</span>
              </h1>
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                Beberapa proyek unggulan yang telah kami selesaikan untuk klien kami.
              </p>
            </div>
          </EnhancedRevealOnScroll>

          <div className="space-y-16">
            {projects.map((project, idx) => (
              <EnhancedRevealOnScroll key={idx} delay={0.2 + idx * 0.15} direction={idx % 2 === 0 ? "left" : "right"} type="fade">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image / Icon Section */}
                    <div className={`bg-gradient-to-br ${project.gradient} p-12 flex items-center justify-center min-h-[300px]`}>
                      <span className="text-9xl filter drop-shadow-2xl">{project.image}</span>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-8 md:p-10">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{project.title}</h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                      <p className="text-gray-500 mb-6 leading-relaxed">{project.fullDescription}</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <MagneticButton 
                        as="a"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:gap-3 transition-all"
                      >
                        Kunjungi Website <ExternalLink className="w-4 h-4" />
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </EnhancedRevealOnScroll>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2026 Goding Grup. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
