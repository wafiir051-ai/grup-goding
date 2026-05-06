import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const orbs = [
      { x: 0.2, y: 0.3, r: 0.45, color: '56,189,248', speed: 0.0004, ox: 0.12, oy: 0.08 },
      { x: 0.75, y: 0.6, r: 0.4,  color: '99,102,241', speed: 0.0003, ox: 0.10, oy: 0.14 },
      { x: 0.5,  y: 0.8, r: 0.35, color: '34,211,238', speed: 0.0005, ox: 0.08, oy: 0.10 },
      { x: 0.85, y: 0.2, r: 0.3,  color: '139,92,246', speed: 0.0006, ox: 0.06, oy: 0.12 },
      { x: 0.1,  y: 0.75,r: 0.28, color: '14,165,233', speed: 0.0004, ox: 0.09, oy: 0.07 },
    ];

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        const cx = (orb.x + Math.sin(t * orb.speed * 1.3) * orb.ox) * canvas.width;
        const cy = (orb.y + Math.cos(t * orb.speed) * orb.oy) * canvas.height;
        const radius = orb.r * Math.min(canvas.width, canvas.height);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0,   `rgba(${orb.color}, 0.18)`);
        grad.addColorStop(0.5, `rgba(${orb.color}, 0.07)`);
        grad.addColorStop(1,   `rgba(${orb.color}, 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Subtle dot grid overlay
      const spacing = 40;
      const dotSize = 0.8;
      for (let x = spacing / 2; x < canvas.width; x += spacing) {
        for (let y = spacing / 2; y < canvas.height; y += spacing) {
          const pulse = 0.12 + 0.06 * Math.sin(t * 0.008 + x * 0.01 + y * 0.01);
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148,163,184,${pulse})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
