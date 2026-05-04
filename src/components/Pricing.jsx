import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [threeDSettings, setThreeDSettings] = useState({ enabled: true, intensity: 0.6, scale: 1.03 });

  useEffect(() => {
    supabase.from('pricing_plans').select('*').order('price').then(({ data }) => setPlans(data || []));
    supabase
      .from('animation_settings')
      .select('three_d_enabled, three_d_intensity, three_d_scale')
      .eq('component', 'pricing')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setThreeDSettings({
            enabled: data.three_d_enabled ?? true,
            intensity: data.three_d_intensity ?? 0.6,
            scale: data.three_d_scale ?? 1.03,
          });
        }
      });
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#0a0a0a] px-4 sm:px-6">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="pricing">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold text-white mb-10 md:mb-14">Paket Harga</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {plans.map((plan, idx) => {
            const hoverEffect = threeDSettings.enabled ? {
              rotateX: threeDSettings.intensity * 6,
              rotateY: threeDSettings.intensity * 8,
              scale: threeDSettings.scale,
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            } : {
              scale: threeDSettings.scale,
              transition: { duration: 0.2 }
            };

            return (
              <RevealOnScroll key={plan.id} componentName="pricing" customDelay={idx * 0.1}>
                <motion.div
                  initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
                  whileHover={hoverEffect}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="bg-zinc-900/90 p-5 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-400 transition-all h-full flex flex-col shadow-lg backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h3 className="text-xl md:text-2xl text-cyan-400 font-bold">{plan.name}</h3>
                    {plan.popular && <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs px-2 py-1 rounded-full font-semibold">Populer</span>}
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl md:text-3xl text-white font-bold">Rp {formatPrice(plan.price)}</span>
                    <span className="text-sm text-zinc-400 ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-1">{plan.description}</p>

                  <div className="mt-5">
                    <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2 font-semibold">Fitur Utama</p>
                    <ul className="space-y-1.5">
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                          <span className="text-cyan-400 shrink-0 mt-0.5">✓</span>
                          <span className="break-words">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.tech_stack && plan.tech_stack.length > 0 && (
                    <div className="mt-5 pt-3 border-t border-white/10">
                      <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2 font-semibold">Teknologi</p>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.tech_stack.slice(0, 5).map((tech, i) => (
                          <span key={i} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">{tech}</span>
                        ))}
                        {plan.tech_stack.length > 5 && (
                          <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">+{plan.tech_stack.length - 5}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => openModal(`Saya tertarik dengan paket ${plan.name} - Rp ${formatPrice(plan.price)}`)}
                    className="mt-6 w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-lg transition-all text-sm md:text-base font-semibold cursor-pointer"
                  >
                    Pilih Paket
                  </button>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
