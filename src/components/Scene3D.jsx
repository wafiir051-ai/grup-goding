import { useEffect, useRef } from 'react';

export default function Scene3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', resize);

    // Floating 3D cubes
    const cubes = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 200 + 50,
      size: Math.random() * 18 + 8,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      speedX: (Math.random() - 0.5) * 0.012,
      speedY: (Math.random() - 0.5) * 0.012,
      speedZ: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      color: ['#06b6d4', '#3b82f6', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.4 + 0.1,
    }));

    // 3D lines grid
    const gridLines = Array.from({ length: 8 }, (_, i) => ({
      x1: Math.random() * W, y1: Math.random() * H,
      x2: Math.random() * W, y2: Math.random() * H,
      speed: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.08 + 0.02,
    }));

    const project3D = (x, y, z) => {
      const fov = 400;
      const scale = fov / (fov + z);
      return { x: x * scale, y: y * scale, scale };
    };

    const drawCube = (cx, cy, size, rotX, rotY, rotZ, color, alpha) => {
      const vertices = [
        [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
        [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1]
      ].map(([x,y,z]) => {
        // rotY
        let tx = x*Math.cos(rotY) - z*Math.sin(rotY);
        let tz = x*Math.sin(rotY) + z*Math.cos(rotY);
        x = tx; z = tz;
        // rotX
        let ty = y*Math.cos(rotX) - z*Math.sin(rotX);
        tz = y*Math.sin(rotX) + z*Math.cos(rotX);
        y = ty; z = tz;
        // rotZ
        tx = x*Math.cos(rotZ) - y*Math.sin(rotZ);
        ty = x*Math.sin(rotZ) + y*Math.cos(rotZ);
        x = tx; y = ty;
        return [x*size + cx, y*size + cy];
      });

      const edges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
      ];

      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1;
      edges.forEach(([a,b]) => {
        ctx.beginPath();
        ctx.moveTo(vertices[a][0], vertices[a][1]);
        ctx.lineTo(vertices[b][0], vertices[b][1]);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };

    let mouse = { x: W/2, y: H/2 };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // Grid lines background
      gridLines.forEach(l => {
        ctx.strokeStyle = '#06b6d4';
        ctx.globalAlpha = l.alpha;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Cubes
      cubes.forEach(c => {
        c.rotX += c.speedX + (mouse.y - H/2) * 0.00003;
        c.rotY += c.speedY + (mouse.x - W/2) * 0.00003;
        c.rotZ += c.speedZ;
        c.x += c.vx;
        c.y += c.vy;
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  );
}
