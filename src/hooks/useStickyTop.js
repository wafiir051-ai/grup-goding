import { useEffect, useState } from 'react';

// Posisi top untuk elemen sticky: `preferred` kalau elemen muat di layar; kalau lebih
// tinggi dari layar, nilainya negatif supaya bagian bawah (kartu dan tombol) tetap terlihat.
// `bottomGap` menambah ruang untuk isi yang digeser ke bawah oleh transform.
// preferred = 'center': elemen ditahan di tengah layar.
export default function useStickyTop(ref, preferred = 0, enabled = true, bottomGap = 0) {
  const [top, setTop] = useState(preferred === 'center' ? 0 : preferred);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    const update = () => {
      const room = window.innerHeight - el.offsetHeight - bottomGap;
      setTop(preferred === 'center' ? (room > 0 ? room / 2 : room) : Math.min(preferred, room));
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref, preferred, enabled, bottomGap]);
  return top;
}
