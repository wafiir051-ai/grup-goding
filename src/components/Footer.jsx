import { useState, useEffect } from 'react';
import RevealOnScroll from './RevealOnScroll';
import MarqueeText from './MarqueeText';
import WhatsAppModal from './WhatsAppModal';
import { supabase } from '../lib/supabase';
import VisitorStats from './VisitorStats';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'logo_url').single().then(({ data }) => {
      if (data?.value) setLogoUrl(data.value);
    }).catch(() => {});
  }, []);
  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => { 
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank'); 
    setIsModalOpen(false); 
  };

  return (
    <footer className="bg-black text-white pt-12 md:pt-20 pb-8 md:pb-10 relative z-10 px-4 sm:px-6">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <RevealOnScroll componentName="footer">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 md:gap-3 justify-center md:justify-start">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full" />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl md:text-2xl">G</span>
                  </div>
                )}
                <span className="text-2xl md:text-3xl font-bold">Goding</span>
              </div>
              <p className="mt-3 md:mt-4 text-zinc-400 text-base md:text-lg max-w-md mx-auto md:mx-0">
                Menciptakan pengalaman digital premium yang membantu bisnis Anda tumbuh.
              </p>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll componentName="footer">
            <div className="text-center md:text-right">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">Siap membuat website luar biasa?</h3>
              <button 
                onClick={() => openModal('Halo, saya tertarik untuk konsultasi dengan Goding.')} 
                className="mt-4 md:mt-6 px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-700 to-cyan-500 rounded-xl text-base md:text-lg font-semibold hover:scale-105 transition-all duration-300"
              >
                Hubungi Kami
              </button>
            </div>
          </RevealOnScroll>
        </div>

        <div className="mt-16 md:mt-24 mb-6 md:mb-10 py-4 md:py-6 border-t-2 border-b-2 border-white/20">
          <MarqueeText />
        </div>

        <VisitorStats />
        
        <RevealOnScroll componentName="footer">
          <div className="flex justify-center mt-6 mb-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <a href="mailto:ayocoding@godingofficial.com" className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors duration-300 text-sm md:text-base group">
                <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-cyan-400/10 transition-colors">✉️</span>
                ayocoding@godingofficial.com
              </a>
              <a href="https://instagram.com/goding.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-pink-400 transition-colors duration-300 text-sm md:text-base group">
                <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-pink-400/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm.003 1.44c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.843-.038 1.096-.046 3.232-.046zm0 2.452a4.108 4.108 0 1 0 0 8.215 4.108 4.108 0 0 0 0-8.215zm0 6.775a2.667 2.667 0 1 1 0-5.334 2.667 2.667 0 0 1 0 5.334zm5.23-6.937a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0z"/></svg>
                </span>
                @goding.id
              </a>
              <a href="https://tiktok.com/@goding.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 text-sm md:text-base group">
                <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/></svg>
                </span>
                @goding.id
              </a>
            </div>
          <div className="flex justify-center mt-6 mb-2"></div>
        </RevealOnScroll>
        
        <RevealOnScroll componentName="footer">
          <div className="text-center text-xs md:text-sm text-zinc-500 pt-4 md:pt-6">
            © 2026 Goding Grup. Semua hak dilindungi.
          </div>
        </RevealOnScroll>
      </div>
    </footer>
  );
}
