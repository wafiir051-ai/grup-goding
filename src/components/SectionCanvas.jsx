import { useEffect, useRef, useState } from 'react';

export default function SectionCanvas({ type = 'particles', opacity = 0.6 }) {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0, animId;

    function resize() {
      W = canvas.width = canvas.parentElement.clientWidth || 800;
      H = canvas.height = canvas.parentElement.clientHeight || 400;
    }

    function project(x, y, z, cx, cy, rotX, rotY) {
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x1 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const fov = 500;
      const sc = fov / (fov + z2 + 300);
      return { x: cx + x1 * sc, y: cy + y1 * sc, z: z2, scale: sc };
    }

    // Particles - dikurangi dari 60 ke 30
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      r: Math.random() * 2 + 1,
      hue: Math.random() * 60 + 190
    }));

    function drawFloatingParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      });
      // Kurangi koneksi garis - hanya partikel terdekat
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p = particles[i], q = particles[j];
          const dx = (p.x - q.x) * W, dy = (p.y - q.y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x * W, p.y * H);
            ctx.lineTo(q.x * W, q.y * H);
            ctx.strokeStyle = `rgba(0,150,255,${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,55%,0.5)`;
        ctx.fill();
      }
    }

    // DNA helix - dikurangi titik dari 80 ke 40
    function drawDNA() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < 40; i++) {
        const prog = i / 40;
        const angle = prog * Math.PI * 6 + t;
        const radius = 50 + Math.sin(prog * Math.PI * 2 + t) * 15;
        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy - 150 + prog * 300;
        const x2 = cx + Math.cos(angle + Math.PI) * radius;
        const bright = 0.3 + Math.sin(angle) * 0.3;
        ctx.beginPath(); ctx.arc(x1, y1, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,${Math.floor(150 + bright * 105)},255,${0.5 + bright * 0.3})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y1, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${0.5 + bright * 0.3})`; ctx.fill();
        if (i % 5 === 0) {
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y1);
          ctx.strokeStyle = `rgba(0,180,255,0.12)`; ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }

    // Orbits - dikurangi dari 5 ke 3
    const orbs = Array.from({ length: 3 }, (_, i) => ({
      radius: 70 + i * 40, speed: 0.008 - i * 0.001,
      offset: (i / 3) * Math.PI * 2, size: 7 - i, hue: 200 + i * 20
    }));

    function drawOrbits() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      orbs.forEach(orb => {
        ctx.beginPath(); ctx.arc(cx, cy, orb.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,150,255,0.07)`; ctx.lineWidth = 1; ctx.stroke();
        const angle = t * orb.speed * 50 + orb.offset;
        const x = cx + Math.cos(angle) * orb.radius;
        const y = cy + Math.sin(angle) * orb.radius * 0.4;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, orb.size * 2);
        grd.addColorStop(0, `hsla(${orb.hue},100%,70%,0.9)`);
        grd.addColorStop(1, `hsla(${orb.hue},100%,60%,0)`);
        ctx.beginPath(); ctx.arc(x, y, orb.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
      });
    }

    // Ripple grid - dikurangi dari 16x16 ke 10x10
    function drawRippleGrid() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const N = 10, step = Math.min(W, H) / 9;
      const rotX = 0.3, rotY = t * 0.2;
      for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= N; j++) {
          const x = (i - N / 2) * step;
          const z = (j - N / 2) * step;
          const dist = Math.sqrt(x * x + z * z);
          const y = Math.sin(dist * 0.05 - t * 2) * 25;
          const p = project(x, y - 15, z, cx, cy + 20, rotX, rotY);
          const bright = (y + 25) / 50;
          if (i < N) {
            const wave2 = Math.sin(Math.sqrt(((i+1-N/2)*step)**2 + z*z) * 0.05 - t*2) * 25;
            const p2 = project((i+1-N/2)*step, wave2-15, z, cx, cy+20, rotX, rotY);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,${Math.floor(120+bright*135)},255,${0.25+bright*0.25})`;
            ctx.lineWidth = 0.7; ctx.stroke();
          }
          if (j < N) {
            const wave3 = Math.sin(Math.sqrt(x*x+((j+1-N/2)*step)**2) * 0.05 - t*2) * 25;
            const p3 = project(x, wave3-15, (j+1-N/2)*step, cx, cy+20, rotX, rotY);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p3.x, p3.y);
            ctx.strokeStyle = `rgba(0,${Math.floor(120+bright*135)},255,${0.25+bright*0.25})`;
            ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
      }
    }

    // Stars - dikurangi dari 80 ke 40
    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    }));

    function drawStars() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.twinkle += s.speed;
        const alpha = 0.15 + Math.sin(s.twinkle) * 0.1;
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,220,255,${alpha})`; ctx.fill();
      });
    }

    function loop() {
      t += 0.016;
      if (type === 'particles') drawFloatingParticles();
      else if (type === 'dna') drawDNA();
      else if (type === 'orbits') drawOrbits();
      else if (type === 'ripple') drawRippleGrid();
      else if (type === 'stars') drawStars();
      animId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [visible, type]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, display: 'block',
        opacity, pointerEvents: 'none'
      }}
    />
  );
}
