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
    const fetchLogo = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'logo_url').single();
      if (data?.value) setLogoUrl(data.value);
    };
    fetchLogo();
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => { window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank'); setIsModalOpen(false); };
  const goPortfolio = () => window.location.href = '/portfolio';

  return (
    <section className="min-h-screen flex items-center pt-32 pb-20 relative">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <RevealOnScroll componentName="hero">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  <span className="block">Solusi Digital</span>
                  <span className="block mt-1">Premium untuk <TextGradient>Bisnis Modern</TextGradient></span>
                </h1>
              </div>
            </RevealOnScroll>
            <RevealOnScroll componentName="hero" customDelay={0.2}>
              <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
                Kami menciptakan digital experience modern dengan motion physics, desain timeless, dan performa tinggi.
              </p>
            </RevealOnScroll>
            <RevealOnScroll componentName="hero" customDelay={0.4}>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => openModal('Halo, saya tertarik dengan layanan website premium Goding.')} className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold text-sm sm:text-base hover:scale-105 transition">Mulai Proyek</button>
                <button onClick={goPortfolio} className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold text-sm sm:text-base bg-transparent hover:bg-cyan-500/10 transition">Lihat Portfolio</button>
              </div>
            </RevealOnScroll>
          </div>
          <div className="flex justify-center items-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full shadow-2xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm"
            >
              {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" /> : <div className="text-white text-4xl sm:text-6xl">G</div>}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
