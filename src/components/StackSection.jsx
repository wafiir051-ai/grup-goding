import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import usePinEnabled from '../hooks/usePinEnabled';
import useModalOpen from '../hooks/useModalOpen';
import usePerfLite from '../hooks/usePerfLite';

// Menyalin progres masuk/keluar ke motion value milik StackSection. Dipisah supaya
// pelacakan (yang mengukur ulang posisi di setiap frame) hanya berjalan saat efeknya tampil.
function StackTracker({ target, inP, outP }) {
  // Offset ditulis dengan px/pecahan supaya framer memakai pelacakan JS, bukan ViewTimeline.
  const { scrollYProgress: inTrack } = useScroll({ target, offset: ['start end', 'start 0.35'] });
  const { scrollYProgress: outTrack } = useScroll({ target, offset: ['end end', 'end 0px'] });
  useMotionValueEvent(inTrack, 'change', (v) => inP.set(v));
  useMotionValueEvent(outTrack, 'change', (v) => outP.set(v));
  useEffect(() => {
    inP.set(inTrack.get());
    outP.set(outTrack.get());
    // Tanpa pelacak, section kembali ke tampilan diamnya.
    return () => {
      inP.set(1);
      outP.set(0);
    };
  }, [inTrack, outTrack, inP, outP]);
  return null;
}

// Transisi "tumpukan kartu" antar section. Section yang ditinggalkan (leave) menyusut
// menjadi kartu bersudut bulat dan meredup; section yang datang (enter) naik dengan
// sudut atas membulat lalu merapat. Di posisi diam tidak ada clip, jadi tampilannya
// sama persis dengan aslinya. Mati di HP, untuk reduced-motion, di mode ringan, dan
// selama modal terbuka.
// mono: section yang ditinggalkan juga memudar ke hitam-putih, seperti kenangan (ala Scout).
export default function StackSection({ enter = false, leave = false, dim = true, mono = false, children }) {
  const ref = useRef(null);
  const pinOn = usePinEnabled();
  const modalOpen = useModalOpen();
  const lite = usePerfLite();
  const tracking = pinOn && !lite;
  const active = tracking && !modalOpen;
  const inP = useMotionValue(1);
  const outP = useMotionValue(0);
  const clipPath = useTransform([inP, outP], ([i, o]) => {
    const enterR = enter ? (1 - i) * 48 : 0;
    const leaveR = leave ? o * 44 : 0;
    const side = leave ? o * 5 : 0;
    if (enterR < 0.5 && leaveR < 0.5) return 'none';
    const top = Math.max(enterR, leaveR);
    return `inset(0 ${side}% 0 ${side}% round ${top}px ${top}px ${leaveR}px ${leaveR}px)`;
  });
  const shade = useTransform(outP, [0, 1], [0, 0.55]);
  // Filter hanya terpasang selama transisi: filter membuat elemen fixed di dalamnya ikut terkurung.
  const filter = useTransform(outP, (o) => (o < 0.01 ? 'none' : `grayscale(${Math.min(1, o * 1.4)}) contrast(${1 - o * 0.08})`));

  return (
    <>
      <motion.div ref={ref} style={{ position: dim && leave ? 'relative' : undefined, clipPath: active ? clipPath : 'none', filter: active && mono ? filter : 'none' }}>
        {children}
        {leave && dim && (
          <motion.div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: '#05070b', opacity: active ? shade : 0, pointerEvents: 'none', zIndex: 40 }}
          />
        )}
      </motion.div>
      {/* Setelah pembungkus, supaya ref-nya sudah terpasang saat pelacak dimulai. */}
      {tracking && <StackTracker target={ref} inP={inP} outP={outP} />}
    </>
  );
}
