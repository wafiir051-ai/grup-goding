import { lazy, Suspense } from 'react';
const ThreeBackground = lazy(() => import('./ThreeBackground'));
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import TextGradient from './TextGradient';
import WhatsAppModal from './WhatsAppModal';
import { supabase } from '../lib/supabase';
import { DURATION, EASE_OUT, fadeUp, PIN_LENGTH, STAGGER, stagger } from '../lib/scrollMotion';
import usePinEnabled from '../hooks/usePinEnabled';

export default function Hero() {
  const [logoUrl, setLogoUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  // Hero berlapis. Di layar lega hero tertahan (pin) sementara mesh, logo G, dan teks
  // memisah ke kedalaman berbeda, lalu lepas ke gelombang. Di HP tanpa pin: parallax biasa.
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const pinOn = usePinEnabled();
  // Offset ditulis dengan px supaya framer memakai pelacakan JS; versi preset dipindah ke
  // ViewTimeline native yang salah membaca progres di sekitar elemen sticky/overflow.
  const { scrollYProgress: pinned } = useScroll({ target: heroRef, offset: ['start 0px', 'end end'] });
  const { scrollYProgress: leaving } = useScroll({ target: heroRef, offset: ['start 0px', 'end 0px'] });
  const pinMeshScale = useTransform(pinned, [0, 1], [1, 1.22]);
  const pinMeshY = useTransform(pinned, [0, 1], [0, 70]);
  const pinMeshOpacity = useTransform(pinned, [0, 1], [1, 0.4]);
  const pinLogoY = useTransform(pinned, [0, 1], [0, -160]);
  const pinLogoScale = useTransform(pinned, [0, 1], [1, 0.82]);
  const pinLogoRotate = useTransform(pinned, [0, 1], [0, -8]);
  const pinTextY = useTransform(pinned, [0, 1], [0, -80]);
  const pinTextOpacity = useTransform(pinned, [0.45, 1], [1, 0.15]);

  // Kedalaman yang ikut kursor (hanya mouse): mesh, teks, dan logo bergeser beda arah dan jarak.
  const pointer = useMotionValue(0);
  const pointerSmooth = useSpring(pointer, { stiffness: 60, damping: 18 });
  const meshX = useTransform(pointerSmooth, [-1, 1], [14, -14]);
  const textX = useTransform(pointerSmooth, [-1, 1], [-8, 8]);
  const logoX = useTransform(pointerSmooth, [-1, 1], [-22, 22]);
  const logoTilt = useTransform(pointerSmooth, [-1, 1], [-10, 10]);
  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const onMove = (e) => pointer.set((e.clientX / window.innerWidth) * 2 - 1);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, pointer]);
  const meshY = useTransform(leaving, [0, 1], [0, 180]);
  const meshOpacity = useTransform(leaving, [0, 1], [1, 0.45]);
  const logoY = useTransform(leaving, [0, 1], [0, 90]);
  const logoScale = useTransform(leaving, [0, 1], [1, 0.94]);
  const meshStyle = reduced ? undefined : pinOn ? { x: meshX, y: pinMeshY, scale: pinMeshScale, opacity: pinMeshOpacity } : { y: meshY, opacity: meshOpacity };
  const logoStyle = reduced ? undefined : pinOn
    ? { x: logoX, y: pinLogoY, scale: pinLogoScale, rotate: pinLogoRotate, rotateY: logoTilt, transformPerspective: 800 }
    : { y: logoY, scale: logoScale };
  const textStyle = pinOn ? { x: textX, y: pinTextY, opacity: pinTextOpacity } : undefined;

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
      <div ref={heroRef}>
      <section id="beranda" className="min-h-screen w-full relative overflow-visible" style={{ background: '#050810', ...(pinOn ? { position: 'sticky', top: 0 } : {}) }}>
        <motion.div aria-hidden="true" className="absolute inset-0" style={meshStyle}>
          <Suspense fallback={null}><ThreeBackground /></Suspense>
        </motion.div>
        <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />

        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-32 pb-20 sm:pt-36 sm:pb-24 md:pt-40 md:pb-32">

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16 xl:gap-20">

              {/* Teks - mobile: tengah, desktop: kiri */}
              <motion.div
                className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1"
                variants={stagger(STAGGER + 0.02, 0.15)}
                initial="hidden"
                animate="visible"
                style={textStyle}
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
                    className="px-6 sm:px-8 2xl:px-10 py-3 sm:py-4 2xl:py-5 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold hover:scale-105 transition duration-300 ease-out text-sm sm:text-base 2xl:text-lg"
                  >
                    Mulai Sekarang
                  </button>
                  <button
                    onClick={() => window.location.href = '/portfolio'}
                    className="px-6 sm:px-8 2xl:px-10 py-3 sm:py-4 2xl:py-5 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold hover:bg-cyan-500/10 hover:scale-105 transition duration-300 ease-out text-sm sm:text-base 2xl:text-lg"
                  >
                    Lihat Portfolio
                  </button>
                </motion.div>
              </motion.div>

              {/* Logo - mobile: bawah teks, desktop: kanan sejajar tengah */}
              <motion.div
                className="flex items-center justify-center lg:justify-end flex-shrink-0"
                style={logoStyle}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: DURATION, delay: 0.3, ease: EASE_OUT }}
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
      {/* Jarak tahan pin: harus elemen di dalam pembungkus, padding tidak dihitung oleh sticky. */}
      {pinOn && <div aria-hidden="true" style={{ height: PIN_LENGTH.hero }} />}
      </div>
    </>
  );
}