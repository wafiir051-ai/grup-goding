import { lazy, Suspense } from 'react';
const ThreeBackground = lazy(() => import('./ThreeBackground'));
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      <section className="min-h-screen w-full relative overflow-hidden" style={{ background: '#050810' }}>
        <Suspense fallback={null}><ThreeBackground /></Suspense>
        <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />

        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-16 sm:py-20 md:py-24">

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16 xl:gap-20">

              {/* Teks - mobile: tengah, desktop: kiri */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1">
                <h1 className="font-bold text-white leading-[1.1]
                  text-3xl
                  sm:text-4xl
                  md:text-4xl
                  lg:text-4xl
                  xl:text-5xl
                  2xl:text-5xl">
                  <span className="block">Solusi Digital Premium</span>
                  <span className="block">untuk</span>
                  <span className="block"><TextGradient>Bisnis Modern</TextGradient></span>
                </h1>
                <p className="mt-3 text-zinc-400 max-w-xl mx-auto lg:mx-0
                  text-base
                  sm:text-lg
                  md:text-xl
                  2xl:text-2xl">
                  Kami menciptakan digital experience modern dengan motion physics, desain timeless, dan performa tinggi.
                </p>
                <div className="mt-5 flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => openModal('Halo, saya tertarik dengan layanan website premium Goding.')}
                    className="px-6 sm:px-8 2xl:px-10 py-3 sm:py-4 2xl:py-5 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold hover:scale-105 transition text-sm sm:text-base 2xl:text-lg"
                  >
                    Mulai Proyek
                  </button>
                  <button
                    onClick={() => window.location.href = '/portfolio'}
                    className="px-6 sm:px-8 2xl:px-10 py-3 sm:py-4 2xl:py-5 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold hover:bg-cyan-500/10 transition text-sm sm:text-base 2xl:text-lg"
                  >
                    Lihat Portfolio
                  </button>
                </div>
              </div>

              {/* Logo - mobile: bawah teks, desktop: kanan sejajar tengah */}
              <div className="flex items-center justify-center lg:justify-end flex-shrink-0">
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-full shadow-2xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm
                    w-28 h-28
                    sm:w-40 sm:h-40
                    md:w-52 md:h-52
                    lg:w-64 lg:h-64
                    xl:w-72 xl:h-72
                    2xl:w-96 2xl:h-96"
                >
                  {logoUrl
                    ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
                    : <div className="text-white font-bold" style={{fontSize:'clamp(3rem, 8vw, 8rem)'}}>G</div>
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