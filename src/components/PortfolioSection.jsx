import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import EnhancedRevealOnScroll from './EnhancedRevealOnScroll';
import MagneticButton from './MagneticButton';

const projects = [
  {
    title: "SIMAQ Darussalam",
    description: "Markaz Qur'an Darussalam – Platform digital untuk manajemen pembelajaran Al-Qur'an.",
    tags: ["React", "Tailwind", "Vercel"],
    link: "https://simaq.vercel.app",
    image: "📖",
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    title: "PUSPITA INDAH",
    description: "Lembaga Pelatihan Kerja spesialis Jasa Rias Pengantin, Dekorasi, Catering, Tata Kecantikan, dan Tata Busana.",
    tags: ["SEO", "Website Profil", "Google Indexed"],
    link: "https://www.puspitaindah.com",
    image: "💄",
    gradient: "from-rose-500 to-orange-500"
  }
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-16 sm:py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <EnhancedRevealOnScroll delay={0.1} direction="up" type="scale">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              PORTFOLIO KAMI
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-gray-800">
              Proyek yang Telah <span className="gradient-text">Kami Wujudkan</span>
            </h2>
            <p className="mt-4 text-base md:text-xl text-zinc-600 max-w-2xl mx-auto">
              Solusi digital yang membantu bisnis tumbuh dan berkembang di era modern.
            </p>
          </div>
        </EnhancedRevealOnScroll>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <EnhancedRevealOnScroll 
              key={idx} 
              delay={0.2 + idx * 0.15} 
              direction={idx === 0 ? "left" : "right"} 
              type="fade"
            >
              <motion.div
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group bg-white rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 bg-gradient-to-br overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-90`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl md:text-8xl filter drop-shadow-2xl">
                      {project.image}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-zinc-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <MagneticButton 
                    as="a"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all group"
                  >
                    Lihat Detail <ExternalLink className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </motion.div>
            </EnhancedRevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
