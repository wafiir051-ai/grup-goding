import { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0, animId;
    let rotX = 0.3, rotY = 0.2;
    let drag = false, lastMouse = { x: 0, y: 0 };

    function resize() {
      W = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      H = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    }

    function project(x, y, z, cx, cy) {
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x1 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const fov = 600;
      const scale = fov / (fov + z2 + 300);
      return { x: cx + x1 * scale, y: cy + y1 * scale, z: z2, scale };
    }

    function draw() {
      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2 + 40;
      const N = 14, size = Math.min(W, H) * 0.85, step = size / N;

      for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= N; j++) {
          const x = (i - N / 2) * step;
          const z = (j - N / 2) * step;
          const wave = Math.sin(i / 2 + t) * Math.cos(j / 2 + t) * 45;
          const p = project(x, -90 + wave, z, cx, cy);

          if (i < N && j < N) {
            const wave2 = Math.sin((i + 1) / 2 + t) * Math.cos(j / 2 + t) * 45;
            const wave3 = Math.sin(i / 2 + t) * Math.cos((j + 1) / 2 + t) * 45;
            const p2 = project((i + 1 - N / 2) * step, -90 + wave2, z, cx, cy);
            const p3 = project(x, -90 + wave3, (j + 1 - N / 2) * step, cx, cy);
            const brightness = (wave + 45) / 90;
            const g = Math.floor(150 + brightness * 105);

            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,${g},255,0.55)`; ctx.lineWidth = 0.9; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p3.x, p3.y);
            ctx.strokeStyle = `rgba(0,${g},255,0.55)`; ctx.lineWidth = 0.9; ctx.stroke();
          }

          const wave0 = Math.sin(i / 2 + t) * Math.cos(j / 2 + t) * 45;
          const brightness0 = (wave0 + 45) / 90;
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3.5 * p.scale);
          grd.addColorStop(0, `rgba(0,220,255,${0.8 * brightness0 + 0.1})`);
          grd.addColorStop(1, 'rgba(0,180,255,0)');
          ctx.beginPath(); ctx.arc(p.x, p.y, 3.5 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();
        }
      }
    }

    function loop() {
      t += 0.013;
      if (!drag) rotY += 0.003;
      draw();
      animId = requestAnimationFrame(loop);
    }

    const onMouseDown = (e) => { drag = true; lastMouse = { x: e.clientX, y: e.clientY }; };
    const onMouseMove = (e) => {
      if (!drag) return;
      rotY += (e.clientX - lastMouse.x) * 0.005;
      rotX += (e.clientY - lastMouse.y) * 0.005;
      lastMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { drag = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', resize);

    resize();
    loop();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
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
