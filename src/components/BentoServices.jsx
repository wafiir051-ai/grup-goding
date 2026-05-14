import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Zap, ArrowRight, Code, Palette, ShoppingBag, BarChart } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';
import { supabase } from '../lib/supabase';

const ICON_MAP = {
  Sparkles, Globe, Zap, Code, Palette, ShoppingBag, BarChart
};

export default function BentoServices() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data }) => setServices(data || []));
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      <section id="services" style={{position:"relative"}} style={{background:"linear-gradient(135deg, #f8faff 0%, #ffffff 40%, #f0f7ff 100%)"}} className="py-20 md:py-28 relative overflow-hidden px-4 sm:px-6">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="services">
          <div className="text-center mb-12 md:mb-20">
            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-blue-100">✦ Layanan Kami</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{background:"linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #06b6d4 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Layanan Kami</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-xl mx-auto">Desain premium dengan motion yang hidup, performa tinggi, dan hasil yang terukur</p>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
          {services.map((s, idx) => {
            const Icon = ICON_MAP[s.icon] || Globe;
            return (
              <RevealOnScroll key={s.id} componentName="services">
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0 30px 50px -20px rgba(0,0,0,0.25)" }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className={`${s.span} ${s.color} p-6 sm:p-7 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl cursor-pointer transition-all`} style={{boxShadow:"0 4px 24px rgba(37,99,235,0.08)", border:"1px solid rgba(37,99,235,0.1)"}}
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <Icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-blue-600 mb-5 md:mb-7" />
                  </motion.div>
                  <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">{s.title}</h3>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-4 md:mb-6 leading-relaxed">{s.description}</p>
                  <button
                    onClick={() => openModal(s.whatsapp_msg || `Saya tertarik dengan layanan ${s.title}.`)}
                    className="flex items-center gap-2 text-blue-600 font-semibold text-base sm:text-lg md:text-xl group transition-all hover:gap-3"
                  >
                    Pelajari lebih lanjut <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition" />
                  </button>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
}
