import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import useVelocitySkew from '../hooks/useVelocitySkew';

// Kartu yang naik dan sedikit miring sesuai posisi scroll, lalu mundur lagi saat
// di-scroll ke atas. Kartu di kanan sedikit tertinggal, jadi barisan naik
// bergelombang. Setelah bagian atas kartu melewati 70% tinggi layar, kartu diam
// di posisi aslinya.
export default function ScrollCard({ children, className, style, range = ['start end', 'start 0.7'] }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const skew = useVelocitySkew();
  const [lag, setLag] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const a = el.getBoundingClientRect();
      // Ukur terhadap baris kartu (grid/flex), bukan pembungkus selebar kartu itu sendiri.
      let parent = el.parentElement;
      while (parent && parent.getBoundingClientRect().width < a.width * 1.5) parent = parent.parentElement;
      if (!parent) return;
      const b = parent.getBoundingClientRect();
      const f = b.width ? (a.left - b.left) / b.width : 0;
      setLag(Math.min(0.3, Math.max(0, f * 0.3)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: range });
  const end = Math.min(1, lag + 0.7);
  const y = useTransform(scrollYProgress, [lag, end], [56, 0]);
  const rotateX = useTransform(scrollYProgress, [lag, end], [12, 0]);
  const opacity = useTransform(scrollYProgress, [lag, Math.min(1, lag + 0.45)], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? style : { ...style, y, rotateX, opacity, transformPerspective: 900, ...skew }}
    >
      {children}
    </motion.div>
  );
}
