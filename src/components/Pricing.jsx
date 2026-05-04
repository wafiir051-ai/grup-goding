import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
import WhatsAppModal from './WhatsAppModal';

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

function TechCarousel({ techs }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (!techs || techs.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-white/10">
      <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2 font-semibold">Teknologi</p>
      <div className="relative">
        {/* Fade kiri */}
        {canPrev && (
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-zinc-900 to-transparent z-10 pointer-events-none rounded-l" />
        )}
        {/* Fade kanan */}
        {canNext && (
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-zinc-900 to-transparent z-10 pointer-events-none rounded-r" />
        )}

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-1.5">
            {techs.map((tech, i) => (
              <span
                key={i}
                className="flex-shrink-0 bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full border border-white/5 whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Tombol navigasi mini */}
        {techs.length > 3 && (
          <div className="flex gap-1 mt-2 justify-end">
            <button
              onClick={() => emblaApi && emblaApi.scrollPrev()}
              disabled={!canPrev}
              className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-3 h-3 text-white" />
            </button>
            <button
              onClick={() => emblaApi && emblaApi.scrollNext()}
              disabled={!canNext}
              className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 transition"
            >
              <ChevronRight className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [threeDSettings, setThreeDSettings] = useState({ enabled: true, intensity: 0.6, scale: 1.03 });

  useEffect(() => {
    supabase.from('pricing_plans').select('*').order('price').then(({ data }) => setPlans(data || []));
    supabase
      .from('animation_settings')
      .select('three_d_enabled, three_d_intensity, three_d_scale')
      .eq('component', 'pricing')
      .maybeSingle()
      .then(({ data }) => {
        if (data) setThreeDSettings({
          enabled: data.three_d_enabled ?? true,
          intensity: data.three_d_intensity ?? 0.6,
          scale: data.three_d_scale ?? 1.03,
        });
      });
  }, []);

  const openModal = (msg) => { setPendingMessage(msg); setIsModalOpen(true); };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#0a0a0a] px-4 sm:px-6">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="pricing">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold text-white mb-10 md:mb-14">
            Paket Harga
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {plans.map((plan, idx) => {
            const hoverEffect = threeDSettings.enabled ? {
              rotateX: threeDSettings.intensity * 6,
              rotateY: threeDSettings.intensity * 8,
              scale: threeDSettings.scale,
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            } : { scale: threeDSettings.scale };

            return (
              <RevealOnScroll key={plan.id} componentName="pricing" customDelay={idx * 0.1}>
                <motion.div
                  initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
                  whileHover={hoverEffect}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative bg-zinc-900/90 p-5 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-400 transition-colors h-full flex flex-col shadow-lg backdrop-blur-sm"
                >
                  {/* Badge populer */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap shadow-lg">
                        ⭐ Populer
                      </span>
                    </div>
                  )}

                  {/* Nama */}
                  <h3 className="text-lg md:text-xl text-cyan-400 font-bold mt-1">{plan.name}</h3>

                  {/* Harga */}
                  <div className="mt-2">
                    <span className="text-2xl md:text-3xl text-white font-bold">
                      Rp {formatPrice(plan.price)}
                    </span>
                    <span className="text-xs text-zinc-400 ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{plan.description}</p>

                  {/* Fitur */}
                  <div className="mt-4 flex-1">
                    <p className="text-cyan-400 text-xs uppercase tracking-wider mb-2 font-semibold">Fitur Utama</p>
                    <ul className="space-y-1.5">
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="text-zinc-300 text-xs flex items-start gap-2">
                          <span className="text-cyan-400 shrink-0 mt-0.5">✓</span>
                          <span className="break-words leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Teknologi — slide carousel */}
                  <TechCarousel techs={plan.tech_stack} />

                  {/* Tombol */}
                  <button
                    onClick={() => openModal(`Saya tertarik dengan paket ${plan.name} - Rp ${formatPrice(plan.price)}`)}
                    className={`mt-5 w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all
                      ${plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-cyan-500/30 hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg'
                      }`}
                  >
                    Pilih Paket
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
