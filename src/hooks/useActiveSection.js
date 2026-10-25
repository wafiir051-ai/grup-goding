import { useEffect, useState } from 'react';

// Section homepage yang sedang dibaca: yang memotong garis 35% tinggi layar.
// Mengembalikan id section (misalnya 'services'), atau null di luar homepage.
const SECTION_IDS = ['beranda', 'services', 'process', 'clients', 'pricing', 'testimonials'];

export default function useActiveSection() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (window.location.pathname !== '/') return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const probe = window.innerHeight * 0.35;
      let found = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          found = id;
          break;
        }
      }
      setActive(found);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    // Data section (layanan, klien) dimuat belakangan dan menggeser posisi.
    const timer = setTimeout(update, 1500);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return active;
}
