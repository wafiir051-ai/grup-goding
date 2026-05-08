import RevealOnScroll from './RevealOnScroll';

const steps = [
  { num: "01", title: "Discovery", desc: "Memahami visi, audiens, dan tujuan bisnis Anda" },
  { num: "02", title: "Design", desc: "Wireframe ke High-fidelity mockup dengan motion prototype" },
  { num: "03", title: "Code", desc: "Development premium dengan Framer Motion dan clean code" },
  { num: "04", title: "Launch", desc: "Testing, deployment, dan hand-over dengan training" },
];

export default function ProcessSticky() {
  return (
    <section style={{
      backgroundColor: '#fafafa',
      padding: '4rem 1.25rem',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <RevealOnScroll componentName="process">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#2563eb',
            marginBottom: '0.75rem',
          }}>PROSES KAMI</p>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 6vw, 3.5rem)',
            fontWeight: 800,
            color: '#111827',
            lineHeight: 1.2,
            margin: 0,
          }}>
            Dari ide hingga live<br />dalam 4 langkah
          </h2>
        </div>
      </RevealOnScroll>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {steps.map((step, i) => (
          <RevealOnScroll key={i} componentName="process">
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.25rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <span style={{
                fontSize: 'clamp(1.75rem, 7vw, 3rem)',
                fontWeight: 800,
                color: '#bfdbfe',
                lineHeight: 1,
                flexShrink: 0,
                minWidth: '2.5rem',
              }}>{step.num}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{
                  fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 0.25rem 0',
                }}>{step.title}</h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.6,
                  margin: 0,
                  wordBreak: 'break-word',
                }}>{step.desc}</p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
