import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Users, Globe } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';

const services = [
  { title: 'Branding & Identity', span: 'col-span-1', color: 'bg-blue-50', icon: Sparkles, desc: 'Bangun identitas merek yang kuat dan berkesan.', msg: 'Saya tertarik dengan layanan Branding & Identity.' },
  { title: 'Website Premium', span: 'col-span-1 md:col-span-2 md:row-span-2', color: 'bg-cyan-50', icon: Globe, desc: 'Website modern dengan performa tinggi, desain eksklusif, dan animasi memukau.', msg: 'Saya tertarik dengan layanan Website Premium.' },
  { title: 'Motion & Animation', span: 'col-span-1', color: 'bg-sky-50', icon: Zap, desc: 'Animasi dinamis yang menghidupkan setiap interaksi pengguna secara mulus.', msg: 'Saya tertarik dengan Motion & Animation.' },
  { title: 'Webflow & Framer', span: 'col-span-1 md:col-span-2', color: 'bg-teal-50', icon: Globe, desc: 'Platform no-code terbaik untuk pengembangan website cepat dan fleksibel.', msg: 'Saya tertarik dengan Webflow & Framer.' }
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
    <section id="services" className="py-24 md:py-32 bg-white relative overflow-hidden px-6 sm:px-8">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="services">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 mb-5">Layanan Kami</h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-600">Desain premium dengan motion yang hidup</p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 auto-rows-fr">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <RevealOnScroll key={idx} componentName="services">
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0 30px 50px -20px rgba(0,0,0,0.25)" }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className={`${s.span} ${s.color} p-8 md:p-10 rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all`}
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <Icon className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-blue-600 mb-6 md:mb-8" />
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">{s.title}</h3>
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">{s.desc}</p>
                  <button
                    onClick={() => openModal(s.msg)}
                    className="flex items-center gap-2 text-blue-600 font-semibold text-base md:text-lg lg:text-xl group transition-all hover:gap-3"
                  >
                    Pelajari lebih lanjut
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition" />
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
