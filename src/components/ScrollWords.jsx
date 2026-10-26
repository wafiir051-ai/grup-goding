import { Fragment, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// Teks yang terungkap kata per kata mengikuti scroll, dan meredup lagi saat
// di-scroll mundur. Penuh setelah bagian atasnya melewati tengah layar, jadi
// tampilan diamnya sama dengan teks biasa. Bisa juga digerakkan progres dari luar
// (`progress` + `range`), misalnya progres section yang sedang tertahan.
function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

export default function ScrollWords({ text, lines, progress, range = [0, 1] }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.5'] });
  const source = progress || scrollYProgress;
  const [a, b] = progress ? range : [0, 1];
  const at = (f) => a + (b - a) * f;
  const rows = lines || [text];
  const words = rows.flatMap((row, r) => row.split(' ').map((w, i) => ({ w, lineStart: r > 0 && i === 0 })));
  const n = words.length;
  return (
    <span ref={ref}>
      {words.map((item, i) => (
        <Fragment key={i}>
          {item.lineStart && <br />}
          {i > 0 && !item.lineStart && ' '}
          {reduced ? item.w : (
            <Word progress={source} range={[at(i / (n + 1)), at((i + 2) / (n + 1))]}>{item.w}</Word>
          )}
        </Fragment>
      ))}
    </span>
  );
}
