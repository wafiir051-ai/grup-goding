import RevealOnScroll from './RevealOnScroll';

const steps = [
  { num: '01', title: 'Discovery', desc: 'Memahami visi, audiens, dan tujuan bisnis Anda' },
  { num: '02', title: 'Design', desc: 'Wireframe ke High-fidelity mockup dengan motion prototype' },
  { num: '03', title: 'Code', desc: 'Development premium dengan Framer Motion dan clean code' },
  { num: '04', title: 'Launch', desc: 'Testing, deployment, dan hand-over dengan training' },
];

export default function ProcessSticky() {
  return (
    <section className='bg-zinc-50 py-16 md:py-24' style={{width:'100%', boxSizing:'border-box', padding:'4rem 1rem'}}>
      <div style={{maxWidth:'100%', margin:'0 auto', width:'100%', padding:'0 0.5rem', boxSizing:'border-box'}}>
        <div style={{textAlign:'center', marginBottom:'2.5rem'}}>
          <div style={{fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', color:'#2563eb', marginBottom:'0.75rem', letterSpacing:'0.1em'}}>PROSES KAMI</div>
          <h2 style={{fontSize:'clamp(1.5rem, 5vw, 3rem)', fontWeight:700, color:'#1f2937', lineHeight:1.2}}>
            Dari ide hingga live dalam 4 langkah
          </h2>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
          {steps.map((step, i) => (
            <RevealOnScroll key={i} componentName='process'>
              <div style={{display:'flex', gap:'1rem', padding:'1.25rem', backgroundColor:'white', borderRadius:'1rem', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', width:'100%', boxSizing:'border-box', overflow:'hidden'}}>
                <div style={{fontSize:'clamp(1.5rem, 6vw, 3rem)', fontWeight:700, color:'#bfdbfe', flexShrink:0, minWidth:'2.5rem', lineHeight:1}}>{step.num}</div>
                <div style={{minWidth:0, flex:1, overflow:'hidden'}}>
                  <h3 style={{fontSize:'clamp(1rem, 4vw, 1.5rem)', fontWeight:700, color:'#1f2937', marginBottom:'0.25rem'}}>{step.title}</h3>
                  <p style={{fontSize:'0.875rem', color:'#4b5563', lineHeight:1.6, wordBreak:'break-word', overflowWrap:'anywhere'}}>{step.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
