import { useEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';

// Kartu yang mulai bertumpuk di tengah barisnya (seperti setumpuk kartu), lalu menyebar
// ke posisi aslinya mengikuti progres section yang tertahan. Di akhir progres kartu
// berada persis di tempatnya semula.
export default function FanCard({ index, count, progress, children }) {
  const ref = useRef(null);
  const [dx, setDx] = useState(0);

  useEffect(() => {
    const measure = () => {
      // Ukur pembungkus kartu, yang tidak ikut digeser, supaya hasilnya sama di tengah progres.
      const host = ref.current?.parentElement;
      if (!host) return;
      const a = host.getBoundingClientRect();
      let row = host.parentElement;
      while (row && row.getBoundingClientRect().width < a.width * 1.5) row = row.parentElement;
      if (!row) return;
      const b = row.getBoundingClientRect();
      // Pembungkus bisa diskalakan; ubah jarak layar ke jarak lokal kartu.
      const scale = host.offsetWidth ? a.width / host.offsetWidth : 1;
      setDx((b.left + b.width / 2 - (a.left + a.width / 2)) / (scale || 1));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const start = 0.08 + index * 0.06;
  const end = Math.min(1, start + 0.55);
  const spread = index - (count - 1) / 2;
  const x = useTransform(progress, [start, end], [dx, 0]);
  const y = useTransform(progress, [start, end], [24 + Math.abs(spread) * 10, 0]);
  const rotate = useTransform(progress, [start, end], [spread * 6, 0]);
  const scale = useTransform(progress, [start, end], [0.9, 1]);

  return (
    <motion.div ref={ref} style={{ x, y, rotate, scale }}>
      {children}
    </motion.div>
  );
}
