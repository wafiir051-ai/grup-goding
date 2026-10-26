import { useEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import useVelocitySkew from '../hooks/useVelocitySkew';

// Kartu di atas pita film yang melengkung mengelilingi penonton (seperti karosel shader.se).
// Pita bergulir masuk dari kanan sambil lengkungnya mengendur, lalu rata tepat di posisi
// asli kartu di akhir progres section yang tertahan.
export default function FilmCard({ index, progress, children }) {
  const ref = useRef(null);
  const skew = useVelocitySkew();
  const [geo, setGeo] = useState({ dx: 0, row: 1200 });

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
      setGeo({ dx: (a.left + a.width / 2 - (b.left + b.width / 2)) / (scale || 1), row: b.width / (scale || 1) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // k: 1 = pita masih melengkung dan tergeser, 0 = rata di tempat.
  const start = 0.04 + index * 0.03;
  const k = useTransform(progress, [start, Math.min(1, 0.62 + index * 0.05)], [1, 0]);
  const radius = geo.row * 0.66;
  const travel = geo.row * 0.28;
  // Posisi di busur dengan kelengkungan c = k / radius; panjang busur s dihitung dari tengah baris.
  const arc = (v) => {
    const eased = v * v * (3 - 2 * v);
    const c = eased / radius;
    const s = geo.dx + travel * eased;
    return { c, s, a: c * s };
  };
  const x = useTransform(k, (v) => {
    const { c, s, a } = arc(v);
    return (c < 1e-6 ? s : Math.sin(a) / c) - geo.dx;
  });
  const z = useTransform(k, (v) => {
    const { c, a } = arc(v);
    return c < 1e-6 ? 0 : (1 - Math.cos(a)) / c;
  });
  const rotateY = useTransform(k, (v) => (-arc(v).a * 180) / Math.PI);
  const scale = useTransform(k, [1, 0], [0.92, 1]);

  return (
    <motion.div ref={ref} style={{ x, z, rotateY, scale, transformPerspective: 1100, ...skew }}>
      {children}
    </motion.div>
  );
}
