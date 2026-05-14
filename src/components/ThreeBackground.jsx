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
    let mouseX = 0, mouseY = 0;

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
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      

      const cx = W / 2, cy = H * 0.55;
      const N = 18;
      const step = Math.min(W, H) * 0.072;
      const pts = [];

      for (let i = 0; i <= N; i++) {
        pts[i] = [];
        for (let j = 0; j <= N; j++) {
          const x = (i - N / 2) * step;
          const z = (j - N / 2) * step;
          const dist = Math.sqrt(x * x + z * z);
          const wave1 = Math.sin(dist * 0.022 - t * 2.0) * 55;
          const wave2 = Math.sin(i * 0.4 + t * 1.2) * 18;
          const wave3 = Math.cos(j * 0.35 + t * 0.9) * 14;
          const y = -60 + wave1 + wave2 + wave3;
          pts[i][j] = { ...project(x, y, z, cx, cy), rawY: y };
        }
      }

      // Draw lines
      for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= N; j++) {
          const p = pts[i][j];
          const brightness = Math.max(0, Math.min(1, (p.rawY + 90) / 130));

          if (i < N) {
            const p2 = pts[i + 1][j];
            const avgBright = (brightness + Math.max(0, Math.min(1, (p2.rawY + 90) / 130))) / 2;
            const r = Math.floor(avgBright * 30);
            const g = Math.floor(120 + avgBright * 135);
            const b = 255;
            const alpha = 0.35 + avgBright * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.7 + avgBright * 0.6;
            ctx.stroke();
          }

          if (j < N) {
            const p3 = pts[i][j + 1];
            const avgBright = (brightness + Math.max(0, Math.min(1, (p3.rawY + 90) / 130))) / 2;
            const r = Math.floor(avgBright * 30);
            const g = Math.floor(120 + avgBright * 135);
            const b = 255;
            const alpha = 0.35 + avgBright * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.7 + avgBright * 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw glowing dots at intersections
      for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= N; j++) {
          const p = pts[i][j];
          const brightness = Math.max(0, Math.min(1, (p.rawY + 90) / 130));
          if (brightness < 0.15) continue;
          const r = Math.floor(brightness * 3.5);
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4 * p.scale);
          grd.addColorStop(0, `rgba(${r},${Math.floor(180 + brightness * 75)},255,${0.7 * brightness + 0.1})`);
          grd.addColorStop(0.5, `rgba(0,150,255,${0.3 * brightness})`);
          grd.addColorStop(1, 'rgba(0,100,255,0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }

      

      
    }

    function loop() {
      t += 0.012;
      targetRotY += 0.002;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      draw();
      animId = requestAnimationFrame(loop);
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / W - 0.5;
      mouseY = (e.clientY - rect.top) / H - 0.5;
      targetRotX = 0.25 + mouseY * 0.15;
      targetRotY += mouseX * 0.008;
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
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        display: 'block'
      }}
    />
  );
}
