import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Scene3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let enabled = true;
    let opacity = 0.7;
    let cubeCount = 18;
    let animId;

    const start = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let W = window.innerWidth;
      let H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;

      const resize = () => {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W; canvas.height = H;
      };
      window.addEventListener('resize', resize);

      const cubes = Array.from({ length: cubeCount }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 18 + 8,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.012,
        speedY: (Math.random() - 0.5) * 0.012,
        speedZ: (Math.random() - 0.5) * 0.012,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: ['#06b6d4','#3b82f6','#8b5cf6'][Math.floor(Math.random() * 3)],
        alpha: Math.random() * 0.35 + 0.08,
      }));

      let mouse = { x: W / 2, y: H / 2 };
      const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
      window.addEventListener('mousemove', onMouse);

      const drawCube = (cx, cy, size, rX, rY, rZ, color, alpha) => {
        const verts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]
          .map(([x, y, z]) => {
            let tx = x * Math.cos(rY) - z * Math.sin(rY);
            let tz = x * Math.sin(rY) + z * Math.cos(rY);
            x = tx; z = tz;
            let ty = y * Math.cos(rX) - z * Math.sin(rX);
            tz = y * Math.sin(rX) + z * Math.cos(rX);
            y = ty; z = tz;
            tx = x * Math.cos(rZ) - y * Math.sin(rZ);
            ty = x * Math.sin(rZ) + y * Math.cos(rZ);
            return [tx * size + cx, ty * size + cy];
          });
        const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1;
        edges.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(verts[a][0], verts[a][1]);
          ctx.lineTo(verts[b][0], verts[b][1]);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
      };

      const animate = () => {
        ctx.clearRect(0, 0, W, H);
        cubes.forEach(c => {
          c.rotX += c.speedX + (mouse.y - H / 2) * 0.00003;
          c.rotY += c.speedY + (mouse.x - W / 2) * 0.00003;
          c.rotZ += c.speedZ;
          c.x += c.vx; c.y += c.vy;
          if (c.x < -50) c.x = W + 50;
          if (c.x > W + 50) c.x = -50;
          if (c.y < -50) c.y = H + 50;
          if (c.y > H + 50) c.y = -50;
          drawCube(c.x, c.y, c.size, c.rotX, c.rotY, c.rotZ, c.color, c.alpha);
        });
        animId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouse);
      };
    };

    // Cek Supabase, tapi langsung mulai dengan default
    const cleanup = start();

    supabase.from('animation_settings').select('canvas_enabled,canvas_opacity,canvas_cube_count')
      .eq('component', 'hero').single()
      .then(({ data }) => {
        if (data && canvasRef.current) {
          canvasRef.current.style.opacity = data.canvas_opacity ?? 0.7;
        }
      }).catch(() => {});

    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  );
}
