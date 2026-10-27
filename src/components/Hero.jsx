import { Fragment, lazy, Suspense } from 'react';
const ThreeBackground = lazy(() => import('./ThreeBackground'));
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import TextGradient from './TextGradient';
import WhatsAppModal from './WhatsAppModal';
import { supabase } from '../lib/supabase';
import { DURATION, EASE_OUT, fadeUp, PIN_LENGTH, STAGGER, stagger } from '../lib/scrollMotion';
import usePinEnabled from '../hooks/usePinEnabled';

// Garis judul yang muncul per huruf dari balik garis tak terlihat saat halaman dibuka.
// Huruf dikelompokkan per kata supaya baris tetap patah di antara kata.
const LINE_MASK = { display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.12em', marginBottom: '-0.12em' };
const CHAR_STEP = 0.022;

function SplitLine({ text, delay }) {
  let index = 0;
  return (
    <span className="block" aria-hidden="true">
      <span style={LINE_MASK}>
        {text.split(' ').map((word, w) => (
          <Fragment key={w}>
          {w > 0 && ' '}
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {[...word].map((ch) => {
              const i = index++;
              return (
                <motion.span
                  key={i}
                  style={{ display: 'inline-block', transformOrigin: '0% 100%' }}
                  initial={{ y: '110%', rotate: 10, opacity: 0 }}
                  animate={{ y: '0%', rotate: 0, opacity: 1 }}
                  transition={{ duration: DURATION, delay: delay + i * CHAR_STEP, ease: EASE_OUT }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}

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
  // Mesh mendekat saat hero tertahan; kamera di dalam kanvas ikut terbang (lihat ThreeBackground).
  const pinMeshScale = useTransform(pinned, [0, 1], [1, 1.15]);
  const pinMeshY = useTransform(pinned, [0, 1], [0, 40]);
  const pinMeshOpacity = useTransform(pinned, [0.6, 1], [1, 0.55]);
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
  // Logo G berputar penuh seperti koin mengikuti scroll (360 derajat = kembali ke wajah aslinya).
  const pinFlip = useTransform(pinned, [0.1, 0.8], [0, 360]);
  const pinLogoTurn = useTransform([logoTilt, pinFlip], ([tilt, flip]) => tilt + flip);
  const leaveFlip = useTransform(leaving, [0, 0.8], [0, 360]);
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
    ? { x: logoX, y: pinLogoY, scale: pinLogoScale, rotate: pinLogoRotate, rotateY: pinLogoTurn, transformPerspective: 900 }
    : { y: logoY, scale: logoScale, rotateY: leaveFlip, transformPerspective: 900 };
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
      {/* Selama modal di dalamnya terbuka, section diangkat ke lapisan teratas: section sticky
          membentuk lapisan tumpukan sendiri, jadi tanpa ini modal bisa tertimpa section berikutnya. */}
      <section id="beranda" className="min-h-screen w-full relative overflow-visible" style={{ background: '#050810', ...(pinOn ? { position: 'sticky', top: 0 } : {}), ...(isModalOpen ? { zIndex: 9998 } : {}) }}>
        <motion.div aria-hidden="true" className="absolute inset-0" style={meshStyle}>
          {/* Masuk saat halaman dibuka: mesh mendekat dari kejauhan. */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE_OUT }}
          >
            <Suspense fallback={null}><ThreeBackground flight={reduced ? undefined : pinOn ? pinned : leaving} /></Suspense>
          </motion.div>
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
                <h1 aria-label="Solusi Digital Premium untuk Bisnis Modern" className="font-bold text-white leading-[1.1]
                  text-3xl
                  sm:text-4xl
                  md:text-4xl
                  lg:text-4xl
                  xl:text-5xl
                  2xl:text-5xl">
                  <SplitLine text="Solusi Digital Premium" delay={0.2} />
                  <SplitLine text="untuk" delay={0.2 + 22 * CHAR_STEP} />
                  {/* Baris bergradasi naik utuh: gradasi tidak ikut tergambar pada huruf yang digeser. */}
                  <span className="block" aria-hidden="true">
                    <span style={LINE_MASK}>
                      <motion.span
                        style={{ display: 'inline-block' }}
                        initial={{ y: '110%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        transition={{ duration: DURATION + 0.2, delay: 0.2 + 27 * CHAR_STEP, ease: EASE_OUT }}
                      >
                        <TextGradient>Bisnis Modern</TextGradient>
                      </motion.span>
                    </span>
                  </span>
                </h1>
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
                    Konsultasi Sekarang
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