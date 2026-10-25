import { lazy, Suspense } from 'react';
const ThreeBackground = lazy(() => import('./ThreeBackground'));
import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import TextGradient from './TextGradient';
import WhatsAppModal from './WhatsAppModal';
import { supabase } from '../lib/supabase';
import { EASE_OUT, fadeUp, stagger } from '../lib/scrollMotion';

export default function Hero() {
  const [logoUrl, setLogoUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  // Parallax ringan: mesh (lapisan terjauh) tertinggal paling banyak, logo di tengah.
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const meshOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'logo_url').single().then(({ data }) => {
      if (data?.value) setLogoUrl(data.value);
    }).catch(() => {});
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open('https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message), '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      <section id="beranda" ref={heroRef} className="min-h-screen w-full relative overflow-visible" style={{ background: '#050810' }}>
        <motion.div aria-hidden="true" className="absolute inset-0" style={reduced ? undefined : { y: meshY, opacity: meshOpacity }}>
          <Suspense fallback={null}><ThreeBackground /></Suspense>
        </motion.div>
        <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />

        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-32 pb-20 sm:pt-36 sm:pb-24 md:pt-40 md:pb-32">

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16 xl:gap-20">

              {/* Teks - mobile: tengah, desktop: kiri */}
              <motion.div
                className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1"
                variants={stagger(0.1, 0.15)}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 variants={fadeUp} className="font-bold text-white leading-[1.1]
                  text-3xl
                  sm:text-4xl
                  md:text-4xl
                  lg:text-4xl
                  xl:text-5xl
                  2xl:text-5xl">
                  <span className="block">Solusi Digital Premium</span>
                  <span className="block">untuk</span>
                  <span className="block"><TextGradient>Bisnis Modern</TextGradient></span>
                </motion.h1>
                <motion.p variants={fadeUp} className="mt-3 text-zinc-400 max-w-xl mx-auto lg:mx-0
                  text-base
                  sm:text-lg
                  md:text-xl
                  2xl:text-2xl">
                  Kami menciptakan digital experience modern dengan motion physics, desain timeless, dan performa tinggi.
                </motion.p>
                <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => openModal('Halo, saya tertarik dengan layanan website premium Goding.')}
                    className="px-6 sm:px-8 2xl:px-10 py-3 sm:py-4 2xl:py-5 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold hover:scale-105 transition text-sm sm:text-base 2xl:text-lg"
                  >
                    Mulai Sekarang
                  </button>
                  <button
                    onClick={() => window.location.href = '/portfolio'}
                    className="px-6 sm:px-8 2xl:px-10 py-3 sm:py-4 2xl:py-5 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold hover:bg-cyan-500/10 transition text-sm sm:text-base 2xl:text-lg"
                  >
                    Lihat Portfolio
                  </button>
                </motion.div>
              </motion.div>

              {/* Logo - mobile: bawah teks, desktop: kanan sejajar tengah */}
              <motion.div
                className="flex items-center justify-center lg:justify-end flex-shrink-0"
                style={reduced ? undefined : { y: logoY, scale: logoScale }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT }}
                  className="rounded-full shadow-2xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm
                    w-44 h-44
                    sm:w-52 sm:h-52
                    md:w-56 md:h-56
                    lg:w-60 lg:h-60
                    xl:w-64 xl:h-64
                    2xl:w-80 2xl:h-80"
                >
                  {logoUrl
                    ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
                    : <div className="text-white font-bold" style={{fontSize:'clamp(3rem, 8vw, 8rem)'}}>G</div>
                  }
                </motion.div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}