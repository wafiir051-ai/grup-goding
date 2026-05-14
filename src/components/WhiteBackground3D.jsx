import { useEffect, useRef } from 'react';

export default function WhiteBackground3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0, animId;
    let particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      
      // Initialize particles
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: (Math.random() - 0.5) * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Soft gradient background overlays
      const grd1 = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, W * 0.6);
      grd1.addColorStop(0, `rgba(147, 197, 253, ${0.03 + Math.sin(t * 0.5) * 0.02})`);
      grd1.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd1;
      ctx.fillRect(0, 0, W, H);

      const grd2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, W * 0.5);
      grd2.addColorStop(0, `rgba(196, 181, 253, ${0.04 + Math.sin(t * 0.7 + 1) * 0.02})`);
      grd2.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, W, H);

      // Floating geometric shapes
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t * 0.1;
        const radius = Math.min(W, H) * 0.3;
        const x = W / 2 + Math.cos(angle) * radius;
        const y = H / 2 + Math.sin(angle) * radius * 0.5;
        const size = 60 + Math.sin(t * 0.8 + i) * 20;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.3 + i);
        ctx.strokeStyle = `rgba(100, 116, 139, ${0.08 + Math.sin(t + i) * 0.04})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }

      // 3D particles with depth
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        if (p.z < 0 || p.z > 1000) p.vz *= -1;

        const scale = 1000 / (1000 + p.z);
        const size = 2 + scale * 3;
        const alpha = 0.1 + scale * 0.15;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
        grd.addColorStop(0, `rgba(59, 130, 246, ${alpha})`);
        grd.addColorStop(0.5, `rgba(147, 197, 253, ${alpha * 0.5})`);
        grd.addColorStop(1, 'rgba(147, 197, 253, 0)');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // Connect nearby particles with lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Soft wave lines
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 5) {
          const y = H * (0.3 + i * 0.2) + Math.sin(x * 0.01 + t + i) * 30;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.06 + Math.sin(t + i) * 0.02})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    function loop() {
      t += 0.015;
      draw();
      animId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
