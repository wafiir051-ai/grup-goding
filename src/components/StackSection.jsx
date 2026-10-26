import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import usePinEnabled from '../hooks/usePinEnabled';
import useModalOpen from '../hooks/useModalOpen';

// Transisi "tumpukan kartu" antar section. Section yang ditinggalkan (leave) menyusut
// menjadi kartu bersudut bulat dan meredup; section yang datang (enter) naik dengan
// sudut atas membulat lalu merapat. Di posisi diam tidak ada clip, jadi tampilannya
// sama persis dengan aslinya. Mati di HP, untuk reduced-motion, dan selama modal terbuka.
// mono: section yang ditinggalkan juga memudar ke hitam-putih, seperti kenangan (ala Scout).
export default function StackSection({ enter = false, leave = false, dim = true, mono = false, children }) {
  const ref = useRef(null);
  const pinOn = usePinEnabled();
  const modalOpen = useModalOpen();
  const active = pinOn && !modalOpen;
  // Offset ditulis dengan px/pecahan supaya framer memakai pelacakan JS, bukan ViewTimeline.
  const { scrollYProgress: inP } = useScroll({ target: ref, offset: ['start end', 'start 0.35'] });
  const { scrollYProgress: outP } = useScroll({ target: ref, offset: ['end end', 'end 0px'] });
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
    <motion.div ref={ref} style={{ position: dim && leave ? 'relative' : undefined, clipPath: active ? clipPath : 'none', filter: active && mono ? filter : 'none' }}>
      {children}
      {leave && dim && (
        <motion.div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, background: '#05070b', opacity: active ? shade : 0, pointerEvents: 'none', zIndex: 40 }}
        />
      )}
    </motion.div>
  );
}
