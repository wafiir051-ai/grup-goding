import { useEffect, useRef } from 'react';
import runCanvasLoop from '../lib/canvasLoop';

const LEVELS = 15;

// `flight` (opsional): progres scroll 0..1 yang menerbangkan kamera di atas jaring.
export default function ThreeBackground({ flight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;
    let rotX = 0.25, rotY = 0.15;
    let targetRotX = 0.25, targetRotY = 0.15;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function project(x, y, z, cx, cy, rx, ry, camDist) {
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x1 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const fov = 700;
      const scale = fov / Math.max(60, fov + z2 + camDist);
      return { x: cx + x1 * scale, y: cy + y1 * scale, z: z2, scale };
    }

    function draw() {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      // Kamera terbang seperti kamera hanggar Wamos: saat hero di-scroll, kamera menunduk dari
      // sudut miring ke hampir tegak lurus, berputar sedikit, dan menukik mendekat ke jaring.
      const f = flight ? Math.min(1, Math.max(0, flight.get())) : 0;
      const e = f * f * (3 - 2 * f);
      const rx = rotX + e * 1.0;
      const ry = rotY + e * 0.5;
      const camDist = 400 - e * 260;
      const cx = W / 2, cy = H * (0.55 - e * 0.07);
      // Jaring makin terang saat kamera mendekat.
      const glow = 1 + e * 0.9;
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
          pts[i][j] = { ...project(x, y, z, cx, cy, rx, ry, camDist), rawY: y };
        }
      }

      // Garis dikelompokkan per tingkat terang lalu digambar sekaligus per kelompok: tampilannya
      // sama, tetapi perintah gambar per frame turun dari sekitar 300 menjadi paling banyak 16.
      const level = (p) => Math.max(0, Math.min(1, (p.rawY + 70) / 110));
      const groups = Array.from({ length: LEVELS + 1 }, () => []);
      for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= N; j++) {
          const p = pts[i][j];
          if (i < N) groups[Math.round(((level(p) + level(pts[i + 1][j])) / 2) * LEVELS)].push(p, pts[i + 1][j]);
          if (j < N) groups[Math.round(((level(p) + level(pts[i][j + 1])) / 2) * LEVELS)].push(p, pts[i][j + 1]);
        }
      }
      groups.forEach((segs, k) => {
        if (!segs.length) return;
        const avg = k / LEVELS;
        ctx.beginPath();
        for (let n = 0; n < segs.length; n += 2) {
          ctx.moveTo(segs[n].x, segs[n].y);
          ctx.lineTo(segs[n + 1].x, segs[n + 1].y);
        }
        ctx.strokeStyle = `rgba(0,${Math.floor(180 + avg * 75)},255,${(0.15 + avg * 0.3) * glow})`;
        ctx.lineWidth = 0.5 + avg * 0.5;
        ctx.stroke();
      });
    }

    function step() {
      t += 0.008;
      targetRotY += 0.001;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
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
    // Berhenti menggambar saat hero sudah lewat, supaya scroll tetap ringan.
    const stop = runCanvasLoop(canvas, { step, draw });

    return () => {
      stop();
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [flight]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, display: 'block' }}
    />
  );
}
