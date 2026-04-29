import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';
export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  useEffect(() => { supabase.from('pricing_plans').select('*').order('price').then(({data}) => setPlans(data||[])); }, []);
  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => { window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank'); setIsModalOpen(false); };
  return (
    <section id="pricing" className="py-20 bg-[#0a0a0a]">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto px-6"><RevealOnScroll componentName="pricing"><h2 className="text-5xl md:text-7xl text-center font-bold text-white mb-12">Paket Harga</h2></RevealOnScroll><div className="grid md:grid-cols-4 gap-6">{plans.map((p, idx)=> <RevealOnScroll key={p.id} componentName="pricing"><div className="bg-zinc-900/80 p-6 rounded-2xl border border-white/10 hover:border-cyan-400 transition-all"><h3 className="text-2xl text-cyan-400">{p.name}</h3><div className="text-3xl text-white">Rp {(p.price/1000).toLocaleString('id-ID')} {p.price>=1000000?'jt':'rb'}</div><p className="text-zinc-400">{p.description}</p><ul className="mt-4 space-y-2">{p.features?.map((f,i)=><li key={i} className="text-zinc-300">✓ {f}</li>)}</ul><button onClick={()=>openModal(`Saya tertarik dengan paket ${p.name} - ${new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(p.price)}`)} className="mt-6 w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-lg transition-all">Pilih Paket</button></div></RevealOnScroll>)}</div></div>
    </section>
  );
}
