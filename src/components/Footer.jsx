import { useState } from 'react';
import RevealOnScroll from './RevealOnScroll';
import MarqueeText from './MarqueeText';
import WhatsAppModal from './WhatsAppModal';
import VisitorStats from './VisitorStats';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8 relative z-10">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RevealOnScroll componentName="footer">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="text-2xl font-bold">goding</span>
              </div>
              <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-md">
                Menciptakan pengalaman digital premium yang membantu bisnis Anda tumbuh.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll componentName="footer">
            <div className="text-center md:text-right">
              <h3 className="text-xl sm:text-2xl font-semibold">Siap membuat website luar biasa?</h3>
              <button
                onClick={() => openModal('Halo, saya tertarik untuk konsultasi dengan Goding.')}
                className="mt-4 px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-700 to-cyan-500 rounded-xl text-sm sm:text-base font-semibold hover:scale-105 transition"
              >
                Hubungi Kami
              </button>
            </div>
          </RevealOnScroll>
        </div>

        {/* MARQUEE - dipisahkan dengan border dan margin besar */}
        <div className="mt-16 mb-10 py-5 border-t-2 border-b-2 border-white/20">
          <MarqueeText />
        </div>

        <VisitorStats />

        <RevealOnScroll componentName="footer">
          <div className="text-center text-xs sm:text-sm text-zinc-500 pt-6">
            © 2026 Goding Grup. Semua hak dilindungi.
          </div>
        </RevealOnScroll>
      </div>
    </footer>
  );
}
