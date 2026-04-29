import { useEffect, useRef } from 'react';
export default function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d');
    let width = window.innerWidth, height = window.innerHeight, particles = [];
    const resize = () => { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; };
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 150; i++) {
        particles.push({ x: Math.random() * width, y: Math.random() * height, radius: Math.random() * 3 + 1, speedX: (Math.random() - 0.5) * 0.5, speedY: (Math.random() - 0.5) * 0.5, alpha: Math.random() * 0.6 + 0.2, color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)` });
      }
    };
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill(); p.x += p.speedX; p.y += p.speedY; if (p.x < 0) p.x = width; if (p.x > width) p.x = 0; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0; });
      requestAnimationFrame(draw);
    };
    resize(); createParticles(); draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
    return () => window.removeEventListener('resize', resize);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
