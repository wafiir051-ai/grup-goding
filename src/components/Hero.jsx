import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar from './Navbar';

export default function Hero() {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(springY, [-300, 300], [12, -12]);
  const rotateY = useTransform(springX, [-300, 300], [-12, 12]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen flex items-center justify-center pt-16 md:pt-20 pb-12 md:pb-20 relative px-4 sm:px-6 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <Navbar />

      {/* Animated bg orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-3xl pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-600 rounded-full blur-3xl pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Main 3D card */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', zIndex: 2 }}
        className="relative text-center max-w-5xl mx-auto"
      >
        {/* Floating badge */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 bg-white/5 border border-cyan-500/30 rounded-full px-5 py-2 mb-8 backdrop-blur-sm"
          style={{ transform: 'translateZ(40px)' }}
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 text-sm font-medium">Platform Digital Terpercaya</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transform: 'translateZ(60px)' }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6"
        >
          Solusi Digital{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Terbaik
          </span>
          <br />untuk Bisnis Anda
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{ transform: 'translateZ(30px)' }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Kami membangun website modern, cepat, dan profesional untuk membawa bisnis Anda ke level berikutnya.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ transform: 'translateZ(50px)' }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6,182,212,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl text-lg shadow-lg cursor-pointer"
          >
            Lihat Paket Harga
          </motion.a>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-2xl text-lg backdrop-blur-sm cursor-pointer"
          >
            Lihat Layanan
          </motion.a>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ transform: 'translateZ(20px)' }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { num: '50+', label: 'Project Selesai' },
            { num: '100%', label: 'Kepuasan Klien' },
            { num: '24/7', label: 'Support Aktif' },
          ].map((s, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              className="text-center"
            >
              <div className="text-2xl font-black text-cyan-400">{s.num}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
