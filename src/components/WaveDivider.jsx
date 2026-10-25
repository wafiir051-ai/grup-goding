import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// Gelombang yang sama dengan sebelumnya (satu periode = 720 unit), diperpanjang satu
// periode ke kiri dan kanan supaya tepinya tidak kosong saat digeser mengikuti scroll.
// Di tengah layar geserannya nol, jadi bentuknya persis seperti aslinya.
const WAVE_PATH =
  'M-720,160 C-480,280 -240,40 0,160 C240,280 480,40 720,160 C960,280 1200,40 1440,160 C1680,280 1920,40 2160,160 L2160,320 L-720,320 Z';

export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], [180, -180]);

  return (
    <div ref={ref} style={{
      backgroundColor: fromColor,
      lineHeight: 0,
      display: 'block',
      position: 'relative',
      margin: 0,
      padding: 0
    }}>
      <svg
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          display: 'block',
          width: '100%',
          height: '200px',
          transform: flip ? 'scaleY(-1)' : 'none',
          verticalAlign: 'middle'
        }}
      >
        <motion.path
          d={WAVE_PATH}
          fill={toColor}
          style={reduced ? undefined : { x }}
        />
      </svg>
    </div>
  );
}
