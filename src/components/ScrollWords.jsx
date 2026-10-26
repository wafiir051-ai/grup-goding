import { Fragment, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// Teks yang terungkap kata per kata mengikuti scroll, dan tertutup lagi saat di-scroll
// mundur. Penuh setelah bagian atasnya melewati tengah layar, jadi tampilan diamnya
// sama dengan teks biasa. Bisa juga digerakkan progres dari luar (`progress` + `range`),
// misalnya progres section yang sedang tertahan.
//
// mode="mask": setiap kata meluncur naik dari balik garis tak terlihat dan tegak kembali
//   (untuk judul).
// mode="fade": setiap kata menyala dari redup (untuk teks kecil dan teks bergradasi,
//   karena gradasi background-clip tidak ikut tergambar pada kata yang digeser).
// end: posisi layar saat teks penuh. Judul yang letaknya dekat dasar halaman memakai
//   titik yang lebih rendah (misalnya 'start 0.8') supaya pasti terungkap penuh.

// Ruang di bawah garis supaya ekor huruf (g, y, p) tidak terpotong, tanpa mengubah tata letak.
const MASK_STYLE = { display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.14em', marginBottom: '-0.14em' };

function FadeWord({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function MaskWord({ progress, range, children }) {
  const y = useTransform(progress, range, ['110%', '0%']);
  const rotate = useTransform(progress, range, [7, 0]);
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={MASK_STYLE}>
      <motion.span style={{ display: 'inline-block', y, rotate, opacity, transformOrigin: '0% 100%' }}>{children}</motion.span>
    </span>
  );
}

export default function ScrollWords({ text, lines, progress, range = [0, 1], mode = 'mask', end = 'start 0.5' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', end] });
  const source = progress || scrollYProgress;
  const [a, b] = progress ? range : [0, 1];
  const at = (f) => a + (b - a) * f;
  const rows = lines || [text];
  const words = rows.flatMap((row, r) => row.split(' ').map((w, i) => ({ w, lineStart: r > 0 && i === 0 })));
  const n = words.length;
  const Word = mode === 'fade' ? FadeWord : MaskWord;
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
