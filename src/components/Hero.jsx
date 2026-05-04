import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';

const DEFAULTS = {
  content: {
    badge_text: 'Platform Digital Terpercaya #1',
    headline_line1: 'Website',
    headline_highlight: 'Premium',
    headline_line2: 'untuk Bisnis Anda',
    subtitle: 'Kami membangun website modern, cepat, dan profesional. Dari tampilan premium hingga fitur lengkap — semua dalam satu paket.',
    cta_primary_text: '🚀 Lihat Paket Harga',
    cta_primary_href: '#pricing',
    cta_secondary_text: 'Lihat Layanan ✨',
    cta_secondary_href: '#services',
  },
  stats: [
    { icon: '🏆', number: '50+', label: 'Project Selesai' },
    { icon: '💯', number: '100%', label: 'Kepuasan Klien' },
    { icon: '⚡', number: '24/7', label: 'Support Aktif' },
  ],
  emojis: [
    { emoji: '🚀', top: '18%', bottom: null, left_pos: '8%',  right_pos: null, size: 'text-4xl', float_delay: 0 },
    { emoji: '💎', top: '30%', bottom: null, left_pos: null,  right_pos: '7%', size: 'text-3xl', float_delay: 0.8 },
    { emoji: '⚡', top: null,  bottom: '35%', left_pos: '10%', right_pos: null, size: 'text-3xl', float_delay: 1.4 },
    { emoji: '✨', top: null,  bottom: '28%', left_pos: null,  right_pos: '10%', size: 'text-4xl', float_delay: 1.8 },
  ],
};

export default function Hero() {
  const ref = useRef(null);
  const [content, setContent] = useState(DEFAULTS.content);
  const [stats, setStats] = useState(DEFAULTS.stats);
  const [emojis, setEmojis] = useState(DEFAULTS.emojis);
  const [orbEnabled, setOrbEnabled] = useState(true);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [tdEnabled, setTdEnabled] = useState(true);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const rotX = useTransform(sy, [-300, 300], [10, -10]);
  const rotY = useTransform(sx, [-300, 300], [-10, 10]);

  useEffect(() => {
    supabase.from('hero_content').select('*').single()
      .then(({ data }) => { if (data) setContent(data); }).catch(() => {});
    supabase.from('hero_stats').select('*').order('sort_order')
      .then(({ data }) => { if (data?.length) setStats(data); }).catch(() => {});
    supabase.from('hero_emojis').select('*').order('float_delay')
      .then(({ data }) => { if (data?.length) setEmojis(data); }).catch(() => {});
    supabase.from('animation_settings').select('*').eq('component', 'hero').single()
      .then(({ data }) => {
        if (data) {
          setOrbEnabled(data.orb_enabled ?? true);
          setGridEnabled(data.grid_enabled ?? true);
          setTdEnabled(data.three_d_enabled ?? true);
        }
      }).catch(() => {});
  }, []);

  const onMove = (e) => {
    if (!tdEnabled) return;
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
      className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 relative px-4 sm:px-6 overflow-hidden"
      style={{ perspective: '1200px', backgroundColor: '#0a0a0a' }}
    >
      <Navbar />

      {/* BG orbs */}
      {orbEnabled && <>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: 'rgba(6,182,212,0.2)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: 'rgba(37,99,235,0.2)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: 'rgba(124,58,237,0.15)' }}
        />
      </>}

      {/* Grid */}
      {gridEnabled && (
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.05,
          backgroundImage: 'linear-gradient(#06b6d4 1px,transparent 1px),linear-gradient(90deg,#06b6d4 1px,transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      )}

      {/* Floating emojis */}
      {emojis.map((item, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.5 + item.float_delay, repeat: Infinity, ease: 'easeInOut', delay: item.float_delay }}
          className={`absolute ${item.size} select-none pointer-events-none hidden md:block`}
          style={{
            top: item.top || undefined,
            bottom: item.bottom || undefined,
            left: item.left_pos || undefined,
            right: item.right_pos || undefined,
            filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.6))'
          }}
        >{item.emoji}</motion.div>
      ))}

      {/* Main 3D card */}
      <motion.div
        style={{ rotateX: tdEnabled ? rotX : 0, rotateY: tdEnabled ? rotY : 0, transformStyle: 'preserve-3d' }}
        className="relative z-10 text-center max-w-5xl mx-auto w-full"
      >
        {/* Badge */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(50px)' }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 backdrop-blur-sm"
          style={{ border: "1px solid rgba(6,182,212,0.4)", backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 text-sm font-semibold tracking-wide">{content.badge_text}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'translateZ(70px)' }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6 tracking-tight"
        >
          {content.headline_line1}{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            {content.headline_highlight}
          </span>
          <br />{content.headline_line2}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{ transform: 'translateZ(40px)' }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {content.subtitle}
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
            href={content.cta_primary_href}
            whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl text-lg shadow-xl cursor-pointer"
          >
            {content.cta_primary_text}
          </motion.a>
          <motion.a
            href={content.cta_secondary_href}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 border border-white/20 text-white font-bold rounded-2xl text-lg backdrop-blur-sm cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            {content.cta_secondary_text}
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ transform: 'translateZ(30px)' }}
          className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
              whileHover={{ scale: 1.08 }}
              className="rounded-2xl p-4 backdrop-blur-sm cursor-default"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black text-cyan-400">{s.number}</div>
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
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #71717a, transparent)' }} />
      </motion.div>
    </section>
  );
}
