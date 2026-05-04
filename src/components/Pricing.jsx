import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    breakpoints: {
      '(min-width: 768px)': { align: 'center' }
    }
  });

  useEffect(() => {
    supabase.from('pricing_plans').select('*').order('price').then(({ data }) => setPlans(data || []));
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (plans.length === 0) return null;

  return (
    <section id="pricing" className="py-16 md:py-20 bg-[#0a0a0a] px-4 sm:px-6 relative">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="pricing">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold text-white mb-8 md:mb-12">Paket Harga</h2>
        </RevealOnScroll>

        <div className="relative">
          {/* Carousel wrapper */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {plans.map((p) => (
                <div key={p.id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_23%] min-w-0">
                  <div className="bg-zinc-900/80 p-4 sm:p-5 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-400 transition-all h-full flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl sm:text-2xl text-cyan-400 font-bold">{p.name}</h3>
                      {p.popular && <span className="bg-cyan-500 text-black text-xs px-2 py-1 rounded-full shrink-0 ml-2">Populer</span>}
                    </div>
                    <div className="text-2xl sm:text-3xl text-white font-bold mt-2">
                      Rp {formatPrice(p.price)}
                      <span className="text-sm font-normal text-zinc-400">/{p.period || 'sekali bayar'}</span>
                    </div>
                    <p className="text-zinc-400 text-sm sm:text-base mt-2">{p.description}</p>
                    
                    <div className="mt-4">
                      <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2">Fitur Utama</p>
                      <ul className="space-y-1 md:space-y-2">
                        {p.features?.slice(0, 5).map((f, i) => (
                          <li key={i} className="text-zinc-300 text-sm sm:text-base flex items-start gap-2">
                            <span className="text-cyan-400 shrink-0">✓</span> <span className="break-words">{f}</span>
                          </li>
                        ))}
                        {p.features?.length > 5 && (
                          <li className="text-zinc-500 text-xs">+{p.features.length - 5} fitur lainnya</li>
                        )}
                      </ul>
                    </div>

                    {p.tech_stack && p.tech_stack.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2">Teknologi</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.tech_stack.slice(0, 4).map((tech, idx) => (
                            <span key={idx} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">{tech}</span>
                          ))}
                          {p.tech_stack.length > 4 && (
                            <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">+{p.tech_stack.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => openModal(`Saya tertarik dengan paket ${p.name} - Rp ${formatPrice(p.price)}`)}
                      className="mt-6 w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-lg transition-all text-sm md:text-base font-semibold"
                    >
                      Pilih Paket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol navigasi (muncul jika lebih dari 1 slide) */}
          {plans.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition z-10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition z-10"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Indikator slide (opsional) */}
        <div className="flex justify-center gap-2 mt-6">
          {plans.map((_, idx) => (
            <button
              key={idx}
              className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/60 transition"
              onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
