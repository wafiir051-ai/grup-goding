import SectionCanvas from './SectionCanvas';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';

const services = [
  { title: 'Branding & Identity', span: 'col-span-1', color: 'bg-blue-50', icon: Sparkles, desc: 'Bangun identitas merek yang kuat dan berkesan.', msg: 'Saya tertarik dengan layanan Branding & Identity.' },
  { title: 'Website Premium', span: 'col-span-1 md:col-span-2 md:row-span-2', color: 'bg-cyan-50', icon: Globe, desc: 'Website modern dengan performa tinggi dan animasi memukau.', msg: 'Saya tertarik dengan layanan Website Premium.' },
  { title: 'Motion & Animation', span: 'col-span-1', color: 'bg-sky-50', icon: Zap, desc: 'Animasi dinamis yang menghidupkan setiap interaksi.', msg: 'Saya tertarik dengan Motion & Animation.' },
  { title: 'Webflow & Framer', span: 'col-span-1 md:col-span-2', color: 'bg-teal-50', icon: Globe, desc: 'Platform no-code terbaik untuk pengembangan website cepat.', msg: 'Saya tertarik dengan Webflow & Framer.' }
];

export default function BentoServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <section id="services" style={{position:"relative"}} className="py-20 md:py-28 bg-white relative overflow-hidden px-4 sm:px-6"><SectionCanvas type="particles" opacity={0.35} />
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="services">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4">Layanan Kami</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600">Desain premium dengan motion yang hidup</p>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <RevealOnScroll key={idx} componentName="services">
                <motion.div whileHover={{ scale: 1.03, boxShadow: "0 30px 50px -20px rgba(0,0,0,0.25)" }} transition={{ type: 'spring', stiffness: 200 }} className={`${s.span} ${s.color} p-6 sm:p-7 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all`}>
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}><Icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-blue-600 mb-5 md:mb-7" /></motion.div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-5">{s.title}</h3>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-5 md:mb-7 leading-relaxed">{s.desc}</p>
                  <button onClick={() => openModal(s.msg)} className="flex items-center gap-2 text-blue-600 font-semibold text-base sm:text-lg md:text-xl group transition-all hover:gap-3">Pelajari lebih lanjut <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition" /></button>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
