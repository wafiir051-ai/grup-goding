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
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <RevealOnScroll componentName="hero"><div className="space-y-4"><h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight"><span className="block">Solusi Digital</span><span className="block mt-2">Premium untuk <TextGradient>Bisnis Modern</TextGradient></span></h1></div></RevealOnScroll>
            <RevealOnScroll componentName="hero" customDelay={0.2}><p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">Kami menciptakan digital experience modern dengan motion physics, desain timeless, dan performa tinggi.</p></RevealOnScroll>
            <RevealOnScroll componentName="hero" customDelay={0.4}><div className="mt-10 flex flex-wrap gap-4"><button onClick={() => openModal('Halo, saya tertarik dengan layanan website premium Goding.')} className="px-8 py-4 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-2xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">Mulai Proyek</button><button onClick={goPortfolio} className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-2xl font-semibold bg-transparent hover:bg-cyan-500/10 transition-all duration-300">Lihat Portfolio</button></div></RevealOnScroll>
          </div>
          <div className="flex justify-center"><motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="w-80 h-80 rounded-full shadow-2xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm">{logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" /> : <div className="text-white text-4xl">G</div>}</motion.div></div>
        </div>
      </div>
    </section>
  );
}
