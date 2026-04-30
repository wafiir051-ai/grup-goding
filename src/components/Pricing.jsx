import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {plans.map((p) => (
            <RevealOnScroll key={p.id} componentName="pricing">
              <div className="bg-zinc-900/80 p-4 sm:p-5 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-400 transition-all h-full flex flex-col">
                {/* Nama & Harga */}
                <div className="flex justify-between items-start">
                  <h3 className="text-xl sm:text-2xl text-cyan-400 font-bold">{p.name}</h3>
                  {p.popular && <span className="bg-cyan-500 text-black text-xs px-2 py-1 rounded-full">Populer</span>}
                </div>
                <div className="text-2xl sm:text-3xl text-white font-bold mt-2">
                  Rp {(p.price/1000).toLocaleString('id-ID')} {p.price >= 1000000 ? 'jt' : 'rb'}
                  <span className="text-sm font-normal text-zinc-400">/{p.period || 'sekali bayar'}</span>
                </div>
                <p className="text-zinc-400 text-sm sm:text-base mt-2">{p.description}</p>
                
                {/* Fitur utama */}
                <div className="mt-4">
                  <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2">Fitur Utama</p>
                  <ul className="space-y-1 md:space-y-2 flex-1">
                    {p.features?.map((f, i) => (
                      <li key={i} className="text-zinc-300 text-sm sm:text-base flex items-start gap-2">
                        <span className="text-cyan-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Teknologi yang digunakan */}
                {p.tech_stack && p.tech_stack.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2">Teknologi</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech_stack.map((tech, idx) => (
                        <span key={idx} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => openModal(`Saya tertarik dengan paket ${p.name}`)}
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
