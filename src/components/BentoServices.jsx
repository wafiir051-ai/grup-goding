import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Users, Globe } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';
const services = [
  { title: 'Branding & Identity', span: 'col-span-1', color: 'bg-blue-50', icon: Sparkles, desc: 'Bangun identitas merek yang kuat dan berkesan.', msg: 'Saya tertarik dengan layanan Branding & Identity.' },
  { title: 'Website Premium', span: 'col-span-2 row-span-2', color: 'bg-cyan-50', icon: Globe, desc: 'Website modern dengan performa tinggi dan animasi memukau.', msg: 'Saya tertarik dengan layanan Website Premium.' },
  { title: 'Motion & Animation', span: 'col-span-1', color: 'bg-sky-50', icon: Zap, desc: 'Animasi dinamis yang menghidupkan setiap interaksi.', msg: 'Saya tertarik dengan Motion & Animation.' },
  { title: 'Digital Marketing', span: 'col-span-1', color: 'bg-indigo-50', icon: Users, desc: 'Tingkatkan visibilitas dan jangkauan bisnis Anda.', msg: 'Saya tertarik dengan Digital Marketing.' },
  { title: 'Webflow & Framer', span: 'col-span-2', color: 'bg-teal-50', icon: Globe, desc: 'Platform no-code terbaik untuk pengembangan cepat.', msg: 'Saya tertarik dengan Webflow & Framer.' }
];
export default function BentoServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => { window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank'); setIsModalOpen(false); };
  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll componentName="services"><div className="text-center mb-16"><h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4">Layanan Kami</h2><p className="text-xl md:text-2xl text-gray-600">Desain premium dengan motion yang hidup</p></div></RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-fr">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return <RevealOnScroll key={idx} componentName="services"><motion.div whileHover={{ scale: 1.03, rotateX: 5, rotateY: 5, boxShadow: "0 25px 40px -12px rgba(0,0,0,0.3)", transition: { type: 'spring', stiffness: 200 } }} className={`${s.span} ${s.color} p-8 md:p-10 rounded-3xl cursor-pointer shadow-md`}><motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}><Icon className="w-16 h-16 md:w-20 md:h-20 text-blue-600 mb-6" /></motion.div><h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{s.title}</h3><p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">{s.desc}</p><button onClick={() => openModal(s.msg)} className="flex items-center gap-2 text-blue-600 font-semibold text-lg group transition-all group-hover:gap-4">Pelajari lebih lanjut <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" /></button></motion.div></RevealOnScroll>;
          })}
        </div>
      </div>
    </section>
  );
}
