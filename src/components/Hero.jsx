import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar from './Navbar';

const float = (delay = 0, y = 14) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut', delay },
});

export default function Hero() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const rotX = useTransform(sy, [-300, 300], [10, -10]);
  const rotY = useTransform(sx, [-300, 300], [-10, 10]);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 relative px-4 sm:px-6 overflow-hidden bg-[#0a0a0a]"
      style={{ perspective: '1200px' }}
    >
      <Navbar />

      {/* BG orbs */}
      {[
        { cl: 'top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20', d: 0 },
        { cl: 'bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/20', d: 2 },
        { cl: 'top-1/2 right-1/3 w-[300px] h-[300px] bg-purple-600/15', d: 4 },
      ].map((o, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6 + o.d, repeat: Infinity, ease: 'easeInOut', delay: o.d }}
          className={`absolute rounded-full blur-3xl pointer-events-none ${o.cl}`}
        />
      ))}

      {/* Grid lines bg */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating emoji orbits — ala Assistantly */}
      {[
        { emoji: '🚀', top: '18%', left: '8%', delay: 0, size: 'text-4xl' },
        { emoji: '💎', top: '30%', right: '7%', delay: 0.8, size: 'text-3xl' },
        { emoji: '⚡', bottom: '35%', left: '10%', delay: 1.4, size: 'text-3xl' },
        { emoji: '🌐', top: '15%', right: '18%', delay: 0.5, size: 'text-2xl' },
        { emoji: '✨', bottom: '28%', right: '10%', delay: 1.8, size: 'text-4xl' },
        { emoji: '🎯', top: '55%', left: '5%', delay: 2.2, size: 'text-2xl' },
      ].map((item, i) => (
        <motion.div
          key={i}
          {...float(item.delay)}
          className={`absolute ${item.size} select-none pointer-events-none hidden md:block`}
          style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom, filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.6))' }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Main 3D content */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative z-10 text-center max-w-5xl mx-auto w-full"
      >
        {/* Badge */}
        <motion.div
          {...float(0, 6)}
          style={{ transform: 'translateZ(50px)' }}
          className="inline-flex items-center gap-2 bg-white/5 border border-cyan-500/40 rounded-full px-5 py-2 mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 text-sm font-semibold tracking-wide">Platform Digital Terpercaya #1</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'translateZ(70px)' }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 tracking-tight"
        >
          Website{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Premium
            </span>
            <motion.span
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full origin-left"
            />
          </span>
          <br />
          untuk Bisnis Anda
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{ transform: 'translateZ(40px)' }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Kami membangun website modern, cepat, dan profesional. Dari tampilan premium hingga fitur lengkap — semua dalam satu paket.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ transform: 'translateZ(60px)' }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl text-lg shadow-xl cursor-pointer"
          >
            🚀 Lihat Paket Harga
          </motion.a>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,0.1)', boxShadow: '0 0 30px rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-2xl text-lg backdrop-blur-sm cursor-pointer"
          >
            Lihat Layanan ✨
          </motion.a>
        </motion.div>

        {/* Floating stat cards — ala Assistantly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ transform: 'translateZ(30px)' }}
          className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
        >
          {[
            { num: '50+', label: 'Project Selesai', icon: '🏆' },
            { num: '100%', label: 'Kepuasan Klien', icon: '💯' },
            { num: '24/7', label: 'Support Aktif', icon: '⚡' },
          ].map((s, i) => (
            <motion.div
              key={i}
              {...float(i * 0.6, 8)}
              whileHover={{ scale: 1.08, boxShadow: '0 0 25px rgba(6,182,212,0.25)' }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm cursor-default"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black text-cyan-400">{s.num}</div>
              <div className="text-xs text-zinc-500 mt-0.5 leading-tight">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-500 text-xs"
      >
        <span>scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent" />
      </motion.div>
    </section>
  );
}
