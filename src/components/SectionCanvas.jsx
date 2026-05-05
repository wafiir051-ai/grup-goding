import { useEffect, useRef } from 'react';

export default function SectionCanvas({ type = 'particles', opacity = 0.6 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
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

    // Particles for BentoServices (white bg)
    const particles = Array.from({ length: 60 }, () => ({
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
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dx = (p.x - q.x) * W, dy = (p.y - q.y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x * W, p.y * H);
            ctx.lineTo(q.x * W, q.y * H);
            ctx.strokeStyle = `rgba(0,150,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
        const grd = ctx.createRadialGradient(p.x * W, p.y * H, 0, p.x * W, p.y * H, p.r * 3);
        grd.addColorStop(0, `hsla(${p.hue},80%,55%,0.7)`);
        grd.addColorStop(1, `hsla(${p.hue},80%,55%,0)`);
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });
    }

    // DNA helix for ProcessSticky
    function drawDNA() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < 80; i++) {
        const prog = i / 80;
        const angle = prog * Math.PI * 6 + t;
        const radius = 60 + Math.sin(prog * Math.PI * 2 + t) * 20;
        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy - 200 + prog * 400;
        const x2 = cx + Math.cos(angle + Math.PI) * radius;
        const y2 = y1;
        const bright = 0.3 + Math.sin(angle) * 0.3;

        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,${Math.floor(150 + bright * 105)},255,${0.6 + bright * 0.3})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y2, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.floor(bright * 100)},200,255,${0.6 + bright * 0.3})`;
        ctx.fill();

        if (i % 4 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(0,180,255,${0.15 + bright * 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        if (i > 0) {
          const prev = i - 1;
          const pa = prev / 80, pb = i / 80;
          const a1 = pa * Math.PI * 6 + t, a2 = angle;
          const r1 = 60 + Math.sin(pa * Math.PI * 2 + t) * 20;
          const px1 = cx + Math.cos(a1) * r1, py1 = cy - 200 + pa * 400;
          ctx.beginPath(); ctx.moveTo(px1, py1); ctx.lineTo(x1, y1);
          ctx.strokeStyle = `rgba(0,150,255,0.4)`; ctx.lineWidth = 1.5; ctx.stroke();
          const px2 = cx + Math.cos(a1 + Math.PI) * r1;
          ctx.beginPath(); ctx.moveTo(px2, py1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(0,200,255,0.3)`; ctx.lineWidth = 1.5; ctx.stroke();
        }
      }
    }

    // Orbiting spheres for ClientsSection
    const orbs = Array.from({ length: 5 }, (_, i) => ({
      radius: 60 + i * 35, speed: 0.008 - i * 0.001, offset: (i / 5) * Math.PI * 2,
      size: 8 - i, hue: 200 + i * 15
    }));

    function drawOrbits() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      orbs.forEach(orb => {
        ctx.beginPath();
        ctx.arc(cx, cy, orb.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,150,255,0.08)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const angle = t * orb.speed * 50 + orb.offset;
        const x = cx + Math.cos(angle) * orb.radius;
        const y = cy + Math.sin(angle) * orb.radius * 0.4;

        const trail = 20;
        for (let j = trail; j >= 0; j--) {
          const ta = angle - j * 0.05;
          const tx = cx + Math.cos(ta) * orb.radius;
          const ty = cy + Math.sin(ta) * orb.radius * 0.4;
          ctx.beginPath();
          ctx.arc(tx, ty, orb.size * (1 - j / trail) * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${orb.hue},100%,65%,${0.3 * (1 - j / trail)})`;
          ctx.fill();
        }

        const grd = ctx.createRadialGradient(x, y, 0, x, y, orb.size * 2.5);
        grd.addColorStop(0, `hsla(${orb.hue},100%,70%,0.95)`);
        grd.addColorStop(1, `hsla(${orb.hue},100%,60%,0)`);
        ctx.beginPath();
        ctx.arc(x, y, orb.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      grd.addColorStop(0, 'rgba(0,200,255,0.3)');
      grd.addColorStop(1, 'rgba(0,100,255,0)');
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
    }

    // Ripple grid for Pricing
    function drawRippleGrid() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const N = 16, step = Math.min(W, H) / 14;
      const rotX = 0.3, rotY = t * 0.3;

      for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= N; j++) {
          const x = (i - N / 2) * step;
          const z = (j - N / 2) * step;
          const dist = Math.sqrt(x * x + z * z);
          const y = Math.sin(dist * 0.05 - t * 2) * 30;
          const p = project(x, y - 20, z, cx, cy + 20, rotX, rotY);
          const bright = (y + 30) / 60;

          if (i < N) {
            const wave2 = Math.sin(Math.sqrt(((i + 1 - N / 2) * step) ** 2 + z * z) * 0.05 - t * 2) * 30;
            const p2 = project((i + 1 - N / 2) * step, wave2 - 20, z, cx, cy + 20, rotX, rotY);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,${Math.floor(120 + bright * 135)},255,${0.3 + bright * 0.3})`;
            ctx.lineWidth = 0.7; ctx.stroke();
          }
          if (j < N) {
            const wave3 = Math.sin(Math.sqrt(x * x + ((j + 1 - N / 2) * step) ** 2) * 0.05 - t * 2) * 30;
            const p3 = project(x, wave3 - 20, (j + 1 - N / 2) * step, cx, cy + 20, rotX, rotY);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p3.x, p3.y);
            ctx.strokeStyle = `rgba(0,${Math.floor(120 + bright * 135)},255,${0.3 + bright * 0.3})`;
            ctx.lineWidth = 0.7; ctx.stroke();
          }
          if (bright > 0.4) {
            const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3 * p.scale);
            grd.addColorStop(0, `rgba(0,220,255,${bright * 0.8})`);
            grd.addColorStop(1, 'rgba(0,150,255,0)');
            ctx.beginPath(); ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
            ctx.fillStyle = grd; ctx.fill();
          }
        }
      }
    }

    // Stars for Testimonials
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005
    }));

    function drawStars() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.twinkle += s.speed;
        const alpha = 0.2 + Math.sin(s.twinkle) * 0.15 + 0.1;
        const grd = ctx.createRadialGradient(s.x * W, s.y * H, 0, s.x * W, s.y * H, s.r * 3);
        grd.addColorStop(0, `rgba(150,220,255,${alpha})`);
        grd.addColorStop(1, 'rgba(100,180,255,0)');
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });
      // Shooting stars occasionally
      if (Math.sin(t * 0.3) > 0.98) {
        const sx = (Math.sin(t * 7) * 0.5 + 0.5) * W;
        const sy = (Math.cos(t * 5) * 0.3 + 0.2) * H;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(sx + i * 4, sy + i * 1.5, 1.5 - i * 0.06, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(150,230,255,${0.8 - i * 0.04})`;
          ctx.fill();
        }
      }
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
  }, [type]);

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
