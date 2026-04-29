import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  useEffect(() => { 
    supabase.from('pricing_plans').select('*').order('price').then(({data}) => setPlans(data||[])); 
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-bold text-white mb-8 md:mb-12">Paket Harga</h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {plans.map((p) => (
            <RevealOnScroll key={p.id} componentName="pricing">
              <div className="bg-zinc-900/80 p-4 sm:p-5 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-400 transition-all">
                <h3 className="text-xl sm:text-2xl text-cyan-400 font-bold">{p.name}</h3>
                <div className="text-2xl sm:text-3xl text-white font-bold mt-2">
                  Rp {(p.price/1000).toLocaleString('id-ID')} {p.price>=1000000?'jt':'rb'}
                </div>
                <p className="text-zinc-400 text-sm sm:text-base mt-2">{p.description}</p>
                <ul className="mt-3 md:mt-4 space-y-1 md:space-y-2">
                  {p.features?.map((f, i) => (
                    <li key={i} className="text-zinc-300 text-sm sm:text-base">✓ {f}</li>
                  ))}
                </ul>
                <button 
                  onClick={() => openModal(`Saya tertarik dengan paket ${p.name}`)} 
                  className="mt-4 md:mt-6 w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-lg transition-all text-sm md:text-base font-semibold"
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
