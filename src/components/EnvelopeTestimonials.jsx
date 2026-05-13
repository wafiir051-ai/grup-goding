import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';

export default function EnvelopeTestimonials() {
  const [tests, setTests] = useState([]);
  useEffect(() => { 
    supabase.from('testimonials').select('*').then(({ data }) => setTests(data || [])); 
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-20 bg-white px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="testimonials">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8 md:mb-12">Apa Kata Klien Kami</h2>
        </RevealOnScroll>
        <RevealOnScroll componentName="testimonials">
          <div className="relative bg-white/90 rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200">
            <div className="text-center text-zinc-500 mb-4 md:mb-6 text-sm md:text-base">surat dari klien</div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((t) => (
                <div key={t.id} className="min-w-[80vw] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink bg-gray-50 p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm md:text-base shrink-0">
                      {t.avatar || t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-800 text-sm md:text-base truncate">{t.name}</div>
                      {t.role && <div className="text-xs text-zinc-400 truncate">{t.role}</div>}
                    </div>
                  </div>
                  <div className="text-yellow-500 text-sm">{'★'.repeat(t.rating)}</div>
                  <p className="mt-2 md:mt-3 italic text-gray-600 text-sm md:text-base leading-relaxed">"{t.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
