import { isPerfLite } from './perf';

// Menjalankan animasi kanvas. Berhenti saat kanvas di luar layar. Di mode ringan menggambar
// 30 kali per detik dengan dua langkah gerak per gambar, supaya kecepatan geraknya tetap sama.
// Mengembalikan fungsi untuk menghentikannya.
export default function runCanvasLoop(canvas, { step, draw }) {
  let id = 0;
  let last = 0;
  let visible = true;
  const loop = (now) => {
    id = requestAnimationFrame(loop);
    const steps = isPerfLite() ? 2 : 1;
    if (steps > 1 && now - last < 30) return;
    last = now;
    for (let n = 0; n < steps; n++) step();
    draw();
  };
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !visible) {
      visible = true;
      id = requestAnimationFrame(loop);
    } else if (!entry.isIntersecting && visible) {
      visible = false;
      cancelAnimationFrame(id);
    }
  });
  io.observe(canvas);
  id = requestAnimationFrame(loop);
  return () => {
    io.disconnect();
    cancelAnimationFrame(id);
  };
}
