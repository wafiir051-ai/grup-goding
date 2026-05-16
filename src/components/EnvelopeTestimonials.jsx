import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
import WhiteBackground3D from './WhiteBackground3D';

export default function EnvelopeTestimonials() {
  const [tests, setTests] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => { 
    supabase.from('testimonials').select('*').then(({ data }) => setTests(data || [])); 
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.querySelector('div').offsetWidth;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="testimonials" style={{background:"linear-gradient(135deg, #f8faff 0%, #ffffff 40%, #f0f7ff 100%)"}} className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
      <WhiteBackground3D />
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="testimonials">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-6 sm:mb-8 md:mb-12">Apa Kata Klien Kami</h2>
        </RevealOnScroll>
        <RevealOnScroll componentName="testimonials">
          <div className="relative bg-white/90 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-gray-200">
            <div className="text-center text-zinc-500 mb-4 md:mb-6 text-sm md:text-base"></div>
            
            {/* Navigation Buttons */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 sm:hidden"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 sm:hidden"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 scrollbar-hide">
              {tests.map((t) => (
                <div key={t.id} className="min-w-[85vw] xs:min-w-[75vw] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm md:text-base shrink-0">
                      {t.avatar || t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{t.name}</div>
                      {t.role && <div className="text-xs text-zinc-400 line-clamp-1">{t.role}</div>}
                    </div>
                  </div>
                  <div className="text-yellow-500 text-sm">{'★'.repeat(t.rating)}</div>
                  <p className="mt-2 md:mt-3 italic text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-4">"{t.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
