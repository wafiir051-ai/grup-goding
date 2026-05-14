import { motion } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';

const steps = [
  { num: "01", title: "Discovery", desc: "Memahami visi, audiens, dan tujuan bisnis Anda" },
  { num: "02", title: "Design", desc: "Wireframe ke High-fidelity mockup dengan motion prototype" },
  { num: "03", title: "Code", desc: "Development premium dengan Framer Motion dan clean code" },
  { num: "04", title: "Launch", desc: "Testing, deployment, dan hand-over dengan training" },
];

export default function ProcessSticky() {
  return (
    <section style={{width:'100%', overflowX:'hidden', boxSizing:'border-box'}} className="bg-zinc-50 py-10 md:py-20">
      <div style={{width:'100%', maxWidth:'600px', margin:'0 auto', padding:'0 16px', boxSizing:'border-box'}}>

        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">PROSES KAMI</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            Dari ide hingga live<br />dalam 4 langkah
          </h2>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:'12px', width:'100%'}}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              style={{
                display:'flex',
                alignItems:'flex-start',
                gap:'12px',
                background:'white',
                borderRadius:'12px',
                padding:'14px',
                width:'100%',
                boxSizing:'border-box',
                overflow:'hidden',
                boxShadow:'0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              <span style={{fontSize:'1.5rem', fontWeight:'bold', color:'#bfdbfe', flexShrink:0, width:'32px', textAlign:'center'}}>
                {step.num}
              </span>
              <div style={{minWidth:0, flex:1, overflow:'hidden'}}>
                <h3 style={{fontSize:'0.95rem', fontWeight:'bold', color:'#1f2937', marginBottom:'2px'}}>{step.title}</h3>
                <p style={{fontSize:'0.8rem', color:'#6b7280', lineHeight:'1.5', wordBreak:'break-word', margin:0}}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
