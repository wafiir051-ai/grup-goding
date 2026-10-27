import { useEffect, useRef } from 'react';
import runCanvasLoop from '../lib/canvasLoop';

const LINE_LEVELS = 20;

// Cahaya partikel digambar sekali ke kanvas kecil, lalu tinggal ditempel setiap frame,
// bukan membuat gradien baru untuk 150 partikel di setiap frame.
function makeGlow(size, hue) {
  const r = size * 3;
  const dim = Math.ceil(r * 2) + 2;
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = dim;
  const g = sprite.getContext('2d');
  const gradient = g.createRadialGradient(dim / 2, dim / 2, 0, dim / 2, dim / 2, r);
  gradient.addColorStop(0, `hsla(${hue}, 80%, 65%, 0.8)`);
  gradient.addColorStop(0.5, `hsla(${hue}, 70%, 50%, 0.3)`);
  gradient.addColorStop(1, `hsla(${hue}, 70%, 40%, 0)`);
  g.fillStyle = gradient;
  g.beginPath();
  g.arc(dim / 2, dim / 2, r, 0, Math.PI * 2);
  g.fill();
  return sprite;
}

export default function TSLBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;
    let particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;

      particles = [];
      for (let i = 0; i < 150; i++) {
        const size = Math.random() * 2 + 0.5;
        const hue = Math.random() * 40 + 200;
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size,
          hue,
          glow: makeGlow(size, hue),
        });
      }
    }

    function step() {
      t += 0.015;
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        p.x += Math.sin(t * 0.5 + i) * 0.15;
        p.y += Math.cos(t * 0.3 + i) * 0.15;
      });
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.25)';
      ctx.fillRect(0, 0, W, H);

      particles.forEach((p) => {
        const half = p.glow.width / 2;
        ctx.drawImage(p.glow, p.x - half, p.y - half);
      });

      // Garis antarpartikel dikelompokkan per tingkat transparansi lalu digambar sekaligus,
      // bukan satu perintah gambar untuk setiap garis.
      const groups = Array.from({ length: LINE_LEVELS + 1 }, () => []);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;

          if (d2 < 14400) {
            const level = Math.round((1 - Math.sqrt(d2) / 120) * LINE_LEVELS);
            if (level > 0) groups[level].push(particles[i], particles[j]);
          }
        }
      }
      ctx.lineWidth = 0.5;
      groups.forEach((segs, level) => {
        if (!segs.length) return;
        ctx.strokeStyle = `rgba(100, 150, 255, ${(level / LINE_LEVELS) * 0.2})`;
        ctx.beginPath();
        for (let n = 0; n < segs.length; n += 2) {
          ctx.moveTo(segs[n].x, segs[n].y);
          ctx.lineTo(segs[n + 1].x, segs[n + 1].y);
        }
        ctx.stroke();
      });

      ctx.strokeStyle = 'rgba(100, 150, 255, 0.08)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const y = H / 2 + Math.sin(x * 0.004 + t + i) * 40 + Math.cos(x * 0.002 - t * 0.5) * 25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    window.addEventListener('resize', resize);
    resize();
    const stop = runCanvasLoop(canvas, { step, draw });

    return () => {
      stop();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
