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
  const goPortfolio = () => window.location.href = '/portfolio';

  return (
    <>
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6" style={{background: "#050810"}}>
      <Suspense fallback={null}><ThreeBackground /></Suspense>
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left flex flex-col justify-center">
            <RevealOnScroll componentName="hero">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block">Solusi Digital</span>
                <span className="block mt-2">Premium untuk <TextGradient>Bisnis Modern</TextGradient></span>
              </h1>
            </RevealOnScroll>
            <RevealOnScroll componentName="hero" customDelay={0.2}>
              <p className="mt-6 text-base md:text-lg lg:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0">
                Kami menciptakan digital experience modern dengan motion physics, desain timeless, dan performa tinggi.
              </p>
            </RevealOnScroll>
            <RevealOnScroll componentName="hero" customDelay={0.4}>
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <button onClick={() => openModal('Halo, saya tertarik dengan layanan website premium Goding.')} className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold hover:scale-105 transition">Mulai Proyek</button>
                <button onClick={goPortfolio} className="px-6 md:px-8 py-3 md:py-4 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold hover:bg-cyan-500/10 transition">Lihat Portfolio</button>
              </div>
            </RevealOnScroll>
          </div>
          <div className="flex justify-center lg:justify-end items-center pr-0 lg:pr-8 xl:pr-16 lg:mt-16">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-56 h-56 md:w-80 md:h-80 rounded-full shadow-2xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm">
              {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" /> : <div className="text-white text-6xl font-bold">G</div>}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
