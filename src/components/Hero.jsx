import { lazy, Suspense } from 'react';
const ThreeBackground = lazy(() => import('./ThreeBackground'));
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';
import TextGradient from './TextGradient';
import WhatsAppModal from './WhatsAppModal';
import { supabase } from '../lib/supabase';

export default function Hero() {
  const [logoUrl, setLogoUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'logo_url').single().then(({ data }) => {
      if (data?.value) setLogoUrl(data.value);
    }).catch(() => {});
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      <section
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{ background: '#050810' }}
      >
        <Suspense fallback={null}><ThreeBackground /></Suspense>
        <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10 py-24 sm:py-28 md:py-32">

          {/* Mobile & Tablet: stack vertikal, logo di atas */}
          {/* Desktop: dua kolom berdampingan */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-6 xl:gap-12">

            {/* Kolom Kiri - Teks */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
              <RevealOnScroll componentName="hero">
                <h1 className="font-bold text-white leading-tight
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  lg:text-5xl
                  xl:text-6xl
                  2xl:text-7xl">
                  <span className="block">Solusi Digital</span>
                  <span className="block mt-1 sm:mt-2">Premium untuk</span>
                  <span className="block mt-1 sm:mt-2"><TextGradient>Bisnis Modern</TextGradient></span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll componentName="hero" customDelay={0.2}>
                <p className="mt-4 sm:mt-6 text-zinc-400 max-w-lg mx-auto lg:mx-0
                  text-sm
                  sm:text-base
                  md:text-lg
                  lg:text-base
                  xl:text-lg">
                  Kami menciptakan digital experience modern dengan motion physics, desain timeless, dan performa tinggi.
                </p>
              </RevealOnScroll>

              <RevealOnScroll componentName="hero" customDelay={0.4}>
                <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => openModal('Halo, saya tertarik dengan layanan website premium Goding.')}
                    className="px-5 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold hover:scale-105 transition text-sm sm:text-base"
                  >
                    Mulai Proyek
                  </button>
                  <button
                    onClick={() => window.location.href = '/portfolio'}
                    className="px-5 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold hover:bg-cyan-500/10 transition text-sm sm:text-base"
                  >
                    Lihat Portfolio
                  </button>
                </div>
              </RevealOnScroll>
            </div>

            {/* Kolom Kanan - Logo */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-2">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="
                  w-32 h-32
                  sm:w-44 sm:h-44
                  md:w-56 md:h-56
                  lg:w-64 lg:h-64
                  xl:w-80 xl:h-80
                  2xl:w-96 2xl:h-96
                  rounded-full shadow-2xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm"
              >
                {logoUrl
                  ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  : <div className="text-white text-6xl font-bold">G</div>
                }
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
