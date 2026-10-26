import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { HOVER_SPRING, PIN_LENGTH } from '../lib/scrollMotion';
import RevealOnScroll from './RevealOnScroll';
import ScrollWords from './ScrollWords';
import ScrollCard from './ScrollCard';
import OrbitLogo from './OrbitLogo';
import usePinEnabled from '../hooks/usePinEnabled';
import useStickyTop from '../hooks/useStickyTop';

export default function ClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from('clients').select('*').eq('is_active', true).order('order_index', { ascending: true });
      if (data) setClients(data);
      setLoading(false);
    };
    fetchClients();
  }, []);

  if (loading || clients.length === 0) return null;
  return <ClientsStage clients={clients} />;
}

// Dipisah supaya ref untuk scroll dan sticky sudah terpasang sejak render pertama.
function ClientsStage({ clients }) {
  // Momen puncak (ala Scout Motors): saat section tertahan di tengah layar, judul tampil
  // raksasa dan logo klien mengorbit di cincin miring di sekelilingnya, lalu mendarat satu
  // per satu di barisnya sementara judul mengecil ke ukuran aslinya. Di HP tanpa pin.
  const pinOn = usePinEnabled();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const stickyTop = useStickyTop(contentRef, 'center', pinOn);
  const [box, setBox] = useState({ padTop: 96, padBottom: 96, height: 400 });
  useEffect(() => {
    if (!pinOn) return undefined;
    const measure = () => {
      const cs = getComputedStyle(sectionRef.current);
      setBox({ padTop: parseFloat(cs.paddingTop), padBottom: parseFloat(cs.paddingBottom), height: contentRef.current.offsetHeight });
    };
    measure();
    // Logo dimuat belakangan dan bisa mengubah tinggi isi.
    const ro = new ResizeObserver(measure);
    ro.observe(contentRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinOn]);
  // Progres 0 saat isi mulai tertahan, 1 saat isi lepas. Offset px supaya framer memakai
  // pelacakan JS, bukan ViewTimeline native yang salah membaca progres di sekitar sticky.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [`start ${Math.round(stickyTop - box.padTop)}px`, `end ${Math.round(stickyTop + box.height + box.padBottom)}px`],
  });
  const headingScale = useTransform(scrollYProgress, [0.45, 0.85], [1.65, 1]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);

  return (
    <section ref={sectionRef} id="clients" style={{background:"linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f8faff 100%)"}} className="py-16 md:py-24 px-4 sm:px-6">
      <div ref={contentRef} className="max-w-7xl mx-auto" style={pinOn ? { position: 'sticky', top: stickyTop } : undefined}>
        {/* Judul di atas separuh cincin yang di belakang, di bawah separuh yang di depan. */}
        <div style={pinOn ? { position: 'relative', zIndex: 1 } : undefined}>
          <RevealOnScroll componentName="clients" direction="up" className="text-center mb-16 md:mb-20">
            <motion.h2 ref={headingRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800" style={pinOn ? { scale: headingScale } : undefined}><ScrollWords text="Dipercaya Oleh" /></motion.h2>
            <motion.p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600" style={pinOn ? { opacity: subtitleOpacity } : undefined}><ScrollWords text="Brand & UMKM Terpercaya yang Telah Bekerja Sama dengan Kami" mode="fade" /></motion.p>
          </RevealOnScroll>
        </div>
        {/* Di HP: logo naik bergelombang dari kiri ke kanan mengikuti scroll. */}
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-12 md:gap-16 lg:gap-20">
          {clients.map((client, i) => {
            const logo = (
              <motion.div whileHover={{ y: -4, scale: 1.04 }} transition={HOVER_SPRING}>
                <div className="w-24 sm:w-32 md:w-40 lg:w-48 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src={client.logo_url} alt={client.name} className="w-full h-auto object-contain" loading="lazy" />
                </div>
              </motion.div>
            );
            return pinOn ? (
              <OrbitLogo key={client.id} index={i} count={clients.length} progress={scrollYProgress} anchorRef={headingRef} rootRef={contentRef}>
                {logo}
              </OrbitLogo>
            ) : (
              <ScrollCard key={client.id} range={['start 0.98', 'start 0.7']}>{logo}</ScrollCard>
            );
          })}
        </div>
      </div>
      {/* Jarak tahan pin: elemen di dalam section, padding tidak dihitung oleh sticky. */}
      {pinOn && <div aria-hidden="true" style={{ height: PIN_LENGTH.clients }} />}
    </section>
  );
}
