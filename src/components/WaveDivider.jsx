import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import usePerfLite from '../hooks/usePerfLite';

// Gelombang yang sama dengan sebelumnya (satu periode = 720 unit), diperpanjang satu
// periode ke kiri dan kanan supaya tepinya tidak kosong saat digeser mengikuti scroll.
const WAVE_PATH =
  'M-720,160 C-480,280 -240,40 0,160 C240,280 480,40 720,160 C960,280 1200,40 1440,160 C1680,280 1920,40 2160,160 L2160,320 L-720,320 Z';

// Dua lapis: gelombang utama dan bayangannya yang tembus pandang, bergeser berlawanan
// arah. Di tengah layar keduanya berimpit persis, jadi bentuknya sama dengan aslinya.
// Untuk reduced-motion dan mode ringan gelombang diam (tanpa pelacakan scroll).
export default function WaveDivider(props) {
  const reduced = useReducedMotion();
  const lite = usePerfLite();
  return reduced || lite ? <Wave {...props} /> : <MovingWave {...props} />;
}

function MovingWave(props) {
  const ref = useRef(null);
  // Offset ditulis dengan px supaya framer memakai pelacakan JS; versi preset dipindah ke
  // ViewTimeline native yang salah membaca progres di sekitar elemen sticky/overflow.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 0px'] });
  const x = useTransform(scrollYProgress, [0, 1], [220, -220]);
  const backX = useTransform(scrollYProgress, [0, 1], [-160, 160]);
  const backY = useTransform(scrollYProgress, [0, 0.5, 1], [-30, 0, -30]);
  return <Wave {...props} waveRef={ref} x={x} backX={backX} backY={backY} />;
}

function Wave({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false, waveRef, x, backX, backY }) {
  return (
    <div ref={waveRef} style={{
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
        {backX && (
          <motion.path aria-hidden="true" d={WAVE_PATH} fill={toColor} fillOpacity={0.35} style={{ x: backX, y: backY }} />
        )}
        <motion.path
          d={WAVE_PATH}
          fill={toColor}
          style={x ? { x } : undefined}
        />
      </svg>
    </div>
  );
}
