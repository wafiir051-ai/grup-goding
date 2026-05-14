import { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0, animId;
    let rotX = 0.25, rotY = 0.15;
    let targetRotX = 0.25, targetRotY = 0.15;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function project(x, y, z, cx, cy) {
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x1 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const fov = 700;
      const scale = fov / (fov + z2 + 400);
      return { x: cx + x1 * scale, y: cy + y1 * scale, z: z2, scale };
    }

    function draw() {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H * 0.55;
      const N = 12;
      const step = Math.min(W, H) * 0.09;
      const pts = [];

      for (let i = 0; i <= N; i++) {
        pts[i] = [];
        for (let j = 0; j <= N; j++) {
          const x = (i - N / 2) * step;
          const z = (j - N / 2) * step;
          const dist = Math.sqrt(x * x + z * z);
          const wave1 = Math.sin(dist * 0.02 - t * 1.5) * 45;
          const wave2 = Math.sin(i * 0.4 + t) * 15;
          const wave3 = Math.cos(j * 0.35 + t * 0.8) * 12;
          const y = -50 + wave1 + wave2 + wave3;
          pts[i][j] = { ...project(x, y, z, cx, cy), rawY: y };
        }
      }

      for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= N; j++) {
          const p = pts[i][j];
          const brightness = Math.max(0, Math.min(1, (p.rawY + 70) / 110));

          if (i < N) {
            const p2 = pts[i + 1][j];
            const avg = (brightness + Math.max(0, Math.min(1, (p2.rawY + 70) / 110))) / 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,${Math.floor(180 + avg * 75)},255,${0.15 + avg * 0.3})`;
            ctx.lineWidth = 0.5 + avg * 0.5;
            ctx.stroke();
          }

          if (j < N) {
            const p3 = pts[i][j + 1];
            const avg = (brightness + Math.max(0, Math.min(1, (p3.rawY + 70) / 110))) / 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.strokeStyle = `rgba(0,${Math.floor(180 + avg * 75)},255,${0.15 + avg * 0.3})`;
            ctx.lineWidth = 0.5 + avg * 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      t += 0.008;
      targetRotY += 0.001;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      draw();
      animId = requestAnimationFrame(loop);
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / W - 0.5;
      const my = (e.clientY - rect.top) / H - 0.5;
      targetRotX = 0.25 + my * 0.15;
      targetRotY += mx * 0.005;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, display: 'block' }}
    />
  );
}
