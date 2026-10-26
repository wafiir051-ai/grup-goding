import { useEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';

// Posisi tengah elemen menurut tata letak (tanpa transform), relatif terhadap `root`.
function layoutCenter(el, root) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  for (let n = el; n && n !== root; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

const smooth = (v) => v * v * (3 - 2 * v);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Logo klien yang mengorbit judul di cincin miring seperti foto-foto di sekeliling judul
// raksasa Scout Motors, lalu mendarat satu per satu di posisinya di baris. Di akhir progres
// logo berada persis di tempat aslinya.
export default function OrbitLogo({ index, count, progress, anchorRef, rootRef, children }) {
  const hostRef = useRef(null);
  const [geo, setGeo] = useState({ sx: 0, sy: 0, rx: 480 });

  useEffect(() => {
    const measure = () => {
      const host = hostRef.current;
      const anchor = anchorRef.current;
      if (!host || !anchor) return;
      const h = layoutCenter(host, rootRef.current);
      const a = layoutCenter(anchor, rootRef.current);
      setGeo({ sx: h.x - a.x, sy: h.y - a.y, rx: Math.min(660, window.innerWidth * 0.42) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(rootRef.current || hostRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [anchorRef, rootRef]);

  const landStart = 0.5 + (index / Math.max(1, count)) * 0.22;
  const at = (p) => {
    // Cincin membuka di awal, berputar sepanjang pin, lalu logo mendarat.
    const open = 0.8 + 0.2 * smooth(clamp01(p / 0.3));
    const phi = (index / count) * Math.PI * 2 + p * 2.4 - Math.PI / 2;
    const depth = Math.sin(phi);
    const land = smooth(clamp01((p - landStart) / 0.24));
    // Pusat cincin sedikit di bawah judul: separuh depan lewat di bawah tulisan, tidak menutupinya.
    const ry = geo.rx * 0.34 * open;
    return {
      x: (Math.cos(phi) * geo.rx * open - geo.sx) * (1 - land),
      y: (depth * ry + ry * 0.45 - geo.sy) * (1 - land),
      depth,
      land,
    };
  };
  const tilt = (index % 2 ? 1 : -1) * (6 + (index % 3) * 4);
  const x = useTransform(progress, (p) => at(p).x);
  const y = useTransform(progress, (p) => at(p).y);
  const scale = useTransform(progress, (p) => {
    const { depth, land } = at(p);
    const orbit = 0.5 + 0.26 * ((depth + 1) / 2);
    return orbit + (1 - orbit) * land;
  });
  const rotate = useTransform(progress, (p) => tilt * (1 - at(p).land));
  const opacity = useTransform(progress, (p) => {
    const { depth, land } = at(p);
    return 0.45 + 0.55 * ((depth + 1) / 2) + (0.55 - 0.55 * ((depth + 1) / 2)) * land;
  });
  // Separuh cincin yang di belakang lewat di balik judul, separuh depan lewat di depannya.
  const zIndex = useTransform(progress, (p) => {
    const { depth, land } = at(p);
    return depth > 0 || land > 0.5 ? 2 : 0;
  });

  return (
    <motion.div ref={hostRef} style={{ zIndex }}>
      <motion.div style={{ x, y, scale, rotate, opacity }}>{children}</motion.div>
    </motion.div>
  );
}
