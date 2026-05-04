import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';

const services = [
  { icon: '🌐', title: 'Website Company Profile', desc: 'Tampilan profesional yang membangun kepercayaan klien pertama kali melihat.', span: 'md:col-span-2', bg: 'from-cyan-500/10 to-blue-600/10', border: 'hover:border-cyan-400' },
  { icon: '🛒', title: 'Toko Online / E-Commerce', desc: 'Jualan online lebih mudah dengan sistem lengkap, payment gateway, dan dashboard admin.', span: '', bg: 'from-purple-500/10 to-pink-600/10', border: 'hover:border-purple-400' },
  { icon: '📱', title: 'Landing Page', desc: 'Konversi pengunjung jadi pelanggan dengan desain yang fokus dan CTA yang tepat.', span: '', bg: 'from-blue-500/10 to-cyan-600/10', border: 'hover:border-blue-400' },
  { icon: '🎓', title: 'Website Pesantren / Sekolah', desc: 'Hadirkan profil digital lembaga pendidikan yang modern, informatif, dan mudah dikelola.', span: '', bg: 'from-green-500/10 to-teal-600/10', border: 'hover:border-green-400' },
  { icon: '⚡', title: 'Performa Super Cepat', desc: 'Dibangun dengan teknologi terkini: React, Next.js, Vercel — loading di bawah 1 detik.', span: 'md:col-span-2', bg: 'from-orange-500/10 to-yellow-600/10', border: 'hover:border-orange-400' },
];

function Card3D({ children, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });
  const rotX = useTransform(sy, [-80, 80], [8, -8]);
  const rotY = useTransform(sx, [-80, 80], [-8, 8]);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotY: rotY, transformStyle: 'preserve-3d', perspective: '800px' }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function BentoServices() {
  return (
    <section id="services" className="py-24 md:py-32 bg-white relative overflow-hidden px-6 sm:px-8">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <RevealOnScroll componentName="services">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            >
              ✨ Layanan Kami
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              Semua yang Bisnis Anda<br />
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Butuhkan</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <RevealOnScroll key={i} componentName="services" customDelay={i * 0.08}>
              <Card3D className={`${s.span} h-full`}>
                <div className={`h-full bg-gradient-to-br ${s.bg} border border-gray-200 ${s.border} rounded-3xl p-7 transition-colors duration-300 cursor-default`}
                  style={{ transform: 'translateZ(0px)' }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                    className="text-5xl mb-4 inline-block"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
                  >
                    {s.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>

                  {/* Shimmer line */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                    className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
                  />
                </div>
              </Card3D>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
