import { Fragment, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { EASE_OUT } from '../lib/scrollMotion';
import usePerfLite from '../hooks/usePerfLite';

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
//
// Mode ringan (lib/perf.js): kata tetap muncul berurutan, tetapi sekali saat terlihat,
// bukan dihitung ulang di setiap frame scroll.

// Ruang di bawah garis supaya ekor huruf (g, y, p) tidak terpotong, tanpa mengubah tata letak.
const MASK_STYLE = { display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.14em', marginBottom: '-0.14em' };
const RISE_STYLE = { display: 'inline-block', transformOrigin: '0% 100%' };

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
      <motion.span style={{ ...RISE_STYLE, y, rotate, opacity }}>{children}</motion.span>
    </span>
  );
}

function layout(words, renderWord) {
  return words.map((item, i) => (
    <Fragment key={i}>
      {item.lineStart && <br />}
      {i > 0 && !item.lineStart && ' '}
      {renderWord(item.w, i)}
    </Fragment>
  ));
}

// Kata-kata dibagi rata di sepanjang rentang progres [a, b].
function linkedWords(words, mode, progress, [a, b]) {
  const Word = mode === 'fade' ? FadeWord : MaskWord;
  const n = words.length;
  const at = (f) => a + (b - a) * f;
  return layout(words, (w, i) => <Word progress={progress} range={[at(i / (n + 1)), at((i + 2) / (n + 1))]}>{w}</Word>);
}

// Melacak posisinya sendiri. Dipisah supaya pelacakan (yang mengukur ulang posisi di
// setiap frame) hanya ada saat memang dipakai.
function TrackedWords({ words, mode, end }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', end] });
  return <span ref={ref}>{linkedWords(words, mode, scrollYProgress, [0, 1])}</span>;
}

const WORDS_IN = { hidden: {}, shown: { transition: { staggerChildren: 0.05 } } };
const FADE_IN = { hidden: { opacity: 0.15 }, shown: { opacity: 1, transition: { duration: 0.5 } } };
const RISE_IN = { hidden: { y: '110%', rotate: 7, opacity: 0.2 }, shown: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } } };

function InViewWords({ words, mode }) {
  return (
    <motion.span variants={WORDS_IN} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.3 }}>
      {layout(words, (w) => (mode === 'fade'
        ? <motion.span variants={FADE_IN}>{w}</motion.span>
        : <span style={MASK_STYLE}><motion.span style={RISE_STYLE} variants={RISE_IN}>{w}</motion.span></span>))}
    </motion.span>
  );
}

export default function ScrollWords({ text, lines, progress, range = [0, 1], mode = 'mask', end = 'start 0.5' }) {
  const reduced = useReducedMotion();
  const lite = usePerfLite();
  const rows = lines || [text];
  const words = rows.flatMap((row, r) => row.split(' ').map((w, i) => ({ w, lineStart: r > 0 && i === 0 })));
  if (reduced) return <span>{layout(words, (w) => w)}</span>;
  if (progress) return <span>{linkedWords(words, mode, progress, range)}</span>;
  if (lite) return <InViewWords words={words} mode={mode} />;
  return <TrackedWords words={words} mode={mode} end={end} />;
}
