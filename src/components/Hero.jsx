import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WhatsAppModal from './WhatsAppModal';
import TextGradient from './TextGradient';
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
  const handleSelectNumber = (phoneNumber, message) => { 
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank'); 
    setIsModalOpen(false); 
  };
  const goPortfolio = () => window.location.href = '/portfolio';

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 md:pt-20 pb-12 md:pb-20 relative px-4 sm:px-6">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Text Content - fade only */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="space-y-4 md:space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
                <span className="block">Solusi Digital</span>
                <span className="block mt-2">Premium untuk <TextGradient>Bisnis Modern</TextGradient></span>
              </h1>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Kami menciptakan digital experience modern dengan motion physics, desain timeless, dan performa tinggi.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap gap-4 md:gap-5 justify-center lg:justify-start"
            >
              <button 
                onClick={() => openModal('Halo, saya tertarik dengan layanan website premium Goding.')} 
                className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg text-sm md:text-base"
              >
                Mulai Proyek
              </button>
              <button 
                onClick={goPortfolio} 
                className="px-8 md:px-10 py-3 md:py-4 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold bg-transparent hover:bg-cyan-500/10 transition-all duration-300 text-sm md:text-base"
              >
                Lihat Portfolio
              </button>
            </motion.div>
          </motion.div>

          {/* Logo - fade only */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center order-1 lg:order-2 mb-8 lg:mb-0"
          >
            <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full shadow-2xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="text-white text-5xl md:text-6xl font-bold">G</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
