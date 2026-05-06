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
    window.open('https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message), '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      <section
        className="min-h-screen w-full relative overflow-hidden"
        style={{ background: '#050810' }}
      >
        <Suspense fallback={null}><ThreeBackground /></Suspense>
        <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />

        <div className="min-h-screen flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* Kiri: Teks */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <RevealOnScroll componentName="hero">
                  <h1 className="font-bold text-white leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
                    <span className="block">Solusi Digital</span>
                    <span className="block mt-2">Premium untuk</span>
                    <span className="block mt-2"><TextGradient>Bisnis Modern</TextGradient></span>
                  </h1>
                </RevealOnScroll>

                <RevealOnScroll componentName="hero" customDelay={0.2}>
                  <p className="mt-5 text-zinc-400 max-w-lg mx-auto lg:mx-0 text-sm sm:text-base md:text-lg">
                    Kami menciptakan digital experience modern dengan motion physics, desain timeless, dan performa tinggi.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll componentName="hero" customDelay={0.4}>
                  <div className="mt-7 flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                    <button
                      onClick={() => openModal('Halo, saya tertarik dengan layanan website premium Goding.')}
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold hover:scale-105 transition text-sm sm:text-base"
                    >
                      Mulai Proyek
                    </button>
                    <button
                      onClick={() => window.location.href = '/portfolio'}
                      className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold hover:bg-cyan-500/10 transition text-sm sm:text-base"
                    >
                      Lihat Portfolio
                    </button>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Kanan: Logo */}
              <div className="flex justify-center lg:justify-end items-center">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full shadow-2xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm"
                >
                  {logoUrl
                    ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
                    : <div className="text-white text-6xl font-bold">G</div>
                  }
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
