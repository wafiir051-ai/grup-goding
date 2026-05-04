import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  useEffect(() => {
    supabase.from('pricing_plans').select('*').order('price').then(({ data }) => setPlans(data || []));
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <section id="pricing" className="py-16 md:py-20 bg-[#0a0a0a] px-4 sm:px-6">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="pricing">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold text-white mb-8 md:mb-12">Paket Harga</h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {plans.map((plan) => (
            <RevealOnScroll key={plan.id} componentName="pricing">
              <div className="bg-zinc-900/80 p-5 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-400 transition-all h-full flex flex-col">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h3 className="text-xl md:text-2xl text-cyan-400 font-bold">{plan.name}</h3>
                  {plan.popular && <span className="bg-cyan-500 text-black text-xs px-2 py-1 rounded-full">Populer</span>}
                </div>
                <div className="mt-2">
                  <span className="text-2xl md:text-3xl text-white font-bold">Rp {formatPrice(plan.price)}</span>
                  <span className="text-sm text-zinc-400 ml-1">/{plan.period}</span>
                </div>
                <p className="text-zinc-400 text-sm mt-2">{plan.description}</p>

                <div className="mt-4">
                  <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2">Fitur Utama</p>
                  <ul className="space-y-1.5">
                    {plan.features?.map((f, i) => (
                      <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                        <span className="text-cyan-400 shrink-0 mt-0.5">✓</span> <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.tech_stack && plan.tech_stack.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2">Teknologi</p>
                    <div className="flex flex-wrap gap-1.5">
                      {plan.tech_stack.slice(0, 5).map((tech, i) => (
                        <span key={i} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">{tech}</span>
                      ))}
                      {plan.tech_stack.length > 5 && <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">+{plan.tech_stack.length - 5}</span>}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => openModal(`Saya tertarik dengan paket ${plan.name} - Rp ${formatPrice(plan.price)}`)}
                  className="mt-6 w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-lg transition-all text-sm md:text-base font-semibold"
                >
                  Pilih Paket
                </button>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
