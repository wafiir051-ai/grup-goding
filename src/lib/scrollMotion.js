// Gerak scroll bersama untuk homepage: satu durasi, satu easing, satu jeda bergantian,
// supaya semua section bergerak dengan tempo yang sama. Hanya transform dan opacity.
// Di bawah <MotionConfig reducedMotion="user"> framer-motion otomatis membuang
// geseran untuk pengguna prefers-reduced-motion dan hanya menyisakan fade.

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const DURATION = 0.8;
export const STAGGER = 0.08;

// Kecepatan scroll (pengatur utama). wheelMultiplier lebih kecil = halaman bergerak
// lebih pendek per putaran roda mouse; lerp lebih kecil = luncuran lebih panjang dan lembut.
export const SMOOTH_SCROLL = { lerp: 0.06, wheelMultiplier: 0.7, anchorDuration: 1.9 };

// Jarak scroll selama section tertahan (pin). Makin besar, makin pelan animasinya terputar.
export const PIN_LENGTH = {
  hero: '80vh',
  services: '120vh',
  process: '150vh',
  pricing: '150vh',
  testimonials: '170vh',
};

export const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -40px 0px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE_OUT } },
};

export const stagger = (step = STAGGER, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});

// Hover kartu: naik sedikit dengan pegas yang teredam, tanpa pantulan.
export const HOVER_SPRING = { type: 'spring', stiffness: 260, damping: 26 };
