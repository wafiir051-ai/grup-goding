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
    <section id="services" className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll componentName="services">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-3">Layanan Kami</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Desain premium dengan motion yang hidup</p>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <RevealOnScroll key={idx} componentName="services">
                <motion.div whileHover={{ scale: 1.02 }} className={`${s.span} ${s.color} p-6 sm:p-8 rounded-2xl sm:rounded-3xl cursor-pointer shadow-md`}>
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}><Icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-blue-600 mb-4" /></motion.div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{s.title}</h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-4">{s.desc}</p>
                  <button onClick={() => openModal(s.msg)} className="flex items-center gap-2 text-blue-600 font-semibold text-sm sm:text-base group">Pelajari lebih lanjut <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></button>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
