import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion, useScroll, useTransform } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';
import ScrollWords from './ScrollWords';
import { fadeUp, HOVER_SPRING, PIN_LENGTH, stagger, VIEWPORT } from '../lib/scrollMotion';
import WhiteBackground3D from './WhiteBackground3D';
import usePinEnabled from '../hooks/usePinEnabled';
import useMedia from '../hooks/useMedia';
import useStickyTop from '../hooks/useStickyTop';
import useVelocitySkew from '../hooks/useVelocitySkew';

const CARD_LAYOUT = 'min-w-[85vw] xs:min-w-[75vw] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink';
const CARD_LOOK = 'bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl min-h-[180px] sm:min-h-[200px] flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300';

// Bagian progres pin milik kartu ke-i: kutipan dibaca bergiliran.
const turn = (i, count) => {
  const len = 0.82 / Math.max(1, count);
  return [0.06 + i * len, 0.06 + (i + 1) * len];
};

function CardBody({ t, quote }) {
  return (
    <>
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
      <p className="mt-2 md:mt-3 italic text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed break-words">"{quote}"</p>
    </>
  );
}

// Saat section tertahan: kartu yang gilirannya tiba menyala dan terangkat sedikit,
// lalu kutipannya terbaca kata per kata. Di akhir semuanya kembali ke tampilan asli.
function PinnedCard({ t, index, count, progress }) {
  const skew = useVelocitySkew();
  const [s, e] = turn(index, count);
  const lift = useTransform(progress, [s, (s + e) / 2, e], [0, -10, 0]);
  const opacity = useTransform(progress, [s - 0.06, s], [index === 0 ? 1 : 0.45, 1]);
  return (
    <motion.div className={CARD_LAYOUT} style={{ y: lift, opacity, ...skew }}>
      <motion.div whileHover={{ y: -4 }} transition={HOVER_SPRING} className={`${CARD_LOOK} h-full`}>
        <CardBody t={t} quote={<ScrollWords text={t.content} progress={progress} range={[s + 0.01, e - 0.01]} mode="fade" />} />
      </motion.div>
    </motion.div>
  );
}

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

  // Pin saat kartu tampil sebagai grid (bukan geser horizontal di HP).
  const pinBase = usePinEnabled();
  const grid = useMedia('(min-width: 640px)');
  const pinOn = pinBase && grid;
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  // Isi section diam 60px lebih rendah dari layout-nya (lihat RevealOnScroll), jadi beri ruang.
  const stickyTop = useStickyTop(contentRef, 80, pinOn, 72);
  // Offset ditulis dengan px supaya framer memakai pelacakan JS; versi preset dipindah ke
  // ViewTimeline native yang salah membaca progres di sekitar elemen sticky/overflow.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0px', 'end end'] });

  return (
    <section ref={sectionRef} id="testimonials" style={{background:"linear-gradient(135deg, #f8faff 0%, #ffffff 40%, #f0f7ff 100%)"}} className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
      <WhiteBackground3D />
      {/* Yang sticky adalah isinya, bukan section: kanvas di atas tetap menempel ke halaman. */}
      <div ref={contentRef} className="max-w-7xl mx-auto" style={pinOn ? { position: 'sticky', top: stickyTop } : undefined}>
        <RevealOnScroll componentName="testimonials">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-6 sm:mb-8 md:mb-12"><ScrollWords text="Apa Kata Klien Kami" /></h2>
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

            <motion.div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 scrollbar-hide"
              variants={stagger(0.08, 0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {tests.map((t, index) => (
                pinOn ? (
                  <PinnedCard key={t.id} t={t} index={index} count={tests.length} progress={scrollYProgress} />
                ) : (
                  <motion.div key={t.id} variants={fadeUp} whileHover={{ y: -4 }} transition={HOVER_SPRING} className={`${CARD_LAYOUT} ${CARD_LOOK}`}>
                    <CardBody t={t} quote={<ScrollWords text={t.content} mode="fade" />} />
                  </motion.div>
                )
              ))}
            </motion.div>
          </div>
        </RevealOnScroll>
      </div>
      {/* Jarak tahan pin: elemen di dalam section, padding tidak dihitung oleh sticky. */}
      {pinOn && <div aria-hidden="true" style={{ height: PIN_LENGTH.testimonials }} />}
    </section>
  );
}
