import { useState } from 'react';
import { motion } from 'framer-motion';
import WhatsAppModal from './WhatsAppModal';
export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => { window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank'); setIsModalOpen(false); };
  const scrollToClients = () => { const el = document.getElementById('clients'); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <>
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl px-4">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 15 }} className="bg-black/80 backdrop-blur-xl rounded-3xl px-6 py-4 flex items-center justify-between border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3"><div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center"><span className="text-white font-bold text-xl">G</span></div><span className="font-semibold text-xl md:text-2xl tracking-tight text-white">goding</span></div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/" className="text-white/80 hover:text-cyan-400">Beranda</a>
            <a href="/#services" className="text-white/80 hover:text-cyan-400">Layanan</a>
            <a href="/#pricing" className="text-white/80 hover:text-cyan-400">Harga</a>
            <button onClick={scrollToClients} className="text-white/80 hover:text-cyan-400">Klien</button>
            <a href="/testimonials" className="text-white/80 hover:text-cyan-400">Testimonial</a>
            <a href="/portfolio" className="text-white/80 hover:text-cyan-400">Portfolio</a>
            <a href="/admin" className="text-white/80 hover:text-cyan-400">Admin</a>
          </div>
          <button onClick={() => openModal('Halo, saya ingin konsultasi VIP dengan Goding.')} className="px-5 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl text-sm font-semibold text-white shadow-lg hover:scale-105 transition">Konsultasi VIP</button>
        </motion.div>
      </nav>
    </>
  );
}
