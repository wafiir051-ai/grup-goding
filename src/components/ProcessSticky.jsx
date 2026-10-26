import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';
import ScrollWords from './ScrollWords';
import { DURATION, EASE_OUT, PIN_LENGTH, STAGGER } from '../lib/scrollMotion';
import usePinEnabled from '../hooks/usePinEnabled';

const steps = [
  { num: "01", title: "Discovery", desc: "Memahami visi, audiens, dan tujuan bisnis Anda" },
  { num: "02", title: "Design", desc: "Wireframe ke High-fidelity mockup dengan motion prototype" },
  { num: "03", title: "Code", desc: "Development premium dengan Framer Motion dan clean code" },
  { num: "04", title: "Launch", desc: "Testing, deployment, dan hand-over dengan training" },
];

// Jarak sticky di bawah navbar.
const PIN_TOP = 88;
const BASE_SHADOW = '0 1px 3px rgba(0,0,0,0.08)';
const LIT_SHADOW = '0 12px 28px rgba(37,99,235,0.16)';

const stepStyle = {
  display:'flex',
  alignItems:'flex-start',
  gap:'12px',
  background:'white',
  borderRadius:'12px',
  padding:'14px',
  width:'100%',
  boxSizing:'border-box',
  overflow:'hidden',
  boxShadow: BASE_SHADOW
};

function StepContent({ step, numColor }) {
  return (
    <>
      <motion.span style={{fontSize:'1.5rem', fontWeight:'bold', color: numColor || '#bfdbfe', flexShrink:0, width:'32px', textAlign:'center'}}>
        {step.num}
      </motion.span>
      <div style={{minWidth:0, flex:1, overflow:'hidden'}}>
        <h3 style={{fontSize:'0.95rem', fontWeight:'bold', color:'#1f2937', marginBottom:'2px'}}>{step.title}</h3>
        <p style={{fontSize:'0.8rem', color:'#6b7280', lineHeight:'1.5', wordBreak:'break-word', margin:0}}>{step.desc}</p>
      </div>
    </>
  );
}

// Langkah ke-i menyala ketika progres melewati i/4. Nomor langkah yang sedang aktif
// berwarna biru dan kartunya disorot; di akhir semuanya kembali ke tampilan asli.
function PinnedStep({ step, i, progress }) {
  const at = i * 0.25;
  const next = i < steps.length - 1 ? at + 0.25 : 0.95;
  const opacity = useTransform(progress, [at - 0.12, at], [i === 0 ? 1 : 0.3, 1]);
  const x = useTransform(progress, [at - 0.12, at], [i === 0 ? 0 : -14, 0]);
  const numColor = useTransform(
    progress,
    [at - 0.12, at, next - 0.04, next],
    [i === 0 ? '#2563eb' : '#e2e8f0', '#2563eb', '#2563eb', '#bfdbfe'],
  );
  const boxShadow = useTransform(progress, [at - 0.12, at, next - 0.04, next], [BASE_SHADOW, LIT_SHADOW, LIT_SHADOW, BASE_SHADOW]);
  return (
    <motion.div style={{ ...stepStyle, opacity, x, boxShadow }}>
      <StepContent step={step} numColor={numColor} />
    </motion.div>
  );
}

// Indikator progres: garis tipis di kiri langkah yang terisi mengikuti scroll.
function ProgressRail({ progress }) {
  return (
    <div aria-hidden="true" style={{ position:'absolute', left:'-12px', top:'10px', bottom:'10px', width:'2px', borderRadius:'2px', background:'#dbeafe' }}>
      <motion.div style={{ position:'absolute', inset:0, borderRadius:'2px', background:'linear-gradient(180deg, #2563eb 0%, #06b6d4 100%)', transformOrigin:'top', scaleY: progress }} />
    </div>
  );
}

export default function ProcessSticky() {
  const pinOn = usePinEnabled();
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  // Di layar lega progres dihitung selama section tertahan; di HP (tanpa pin)
  // dari posisi daftar langkah saat melintasi layar.
  const { scrollYProgress: pinProgress } = useScroll({ target: wrapRef, offset: [`start ${PIN_TOP}px`, 'end end'] });
  const { scrollYProgress: listProgress } = useScroll({ target: listRef, offset: ['start 0.85', 'end 0.55'] });
  const progress = pinOn ? pinProgress : listProgress;

  return (
    <div ref={wrapRef} style={pinOn ? { background: '#ffffff' } : undefined}>
    <section id="process" style={{width:'100%', overflowX:'hidden', boxSizing:'border-box'}} style={{background:"linear-gradient(180deg, #ffffff 0%, #f1f5ff 50%, #ffffff 100%)", ...(pinOn ? { position:'sticky', top: PIN_TOP } : {})}} className="py-10 md:py-20">
      <div style={{width:'100%', maxWidth:'600px', margin:'0 auto', padding:'0 16px', boxSizing:'border-box'}}>

        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">PROSES KAMI</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            <ScrollWords lines={['Dari ide hingga live', 'dalam 4 langkah']} />
          </h2>
        </div>

        <div ref={listRef} style={{display:'flex', flexDirection:'column', gap:'12px', width:'100%', position:'relative'}}>
          {!reduced && <ProgressRail progress={progress} />}
          {steps.map((step, i) => (
            !reduced ? (
              <PinnedStep key={i} step={step} i={i} progress={progress} />
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: DURATION, delay: 0.1 + i * STAGGER, ease: EASE_OUT }}
                style={stepStyle}
              >
                <StepContent step={step} />
              </motion.div>
            )
          ))}
        </div>

      </div>
    </section>
    {pinOn && <div aria-hidden="true" style={{ height: PIN_LENGTH.process }} />}
    </div>
  );
}
