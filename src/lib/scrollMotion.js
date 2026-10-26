// Gerak scroll bersama untuk homepage: satu durasi, satu easing, satu jeda bergantian,
// supaya semua section bergerak dengan tempo yang sama. Hanya transform dan opacity.
// Di bawah <MotionConfig reducedMotion="user"> framer-motion otomatis membuang
// geseran untuk pengguna prefers-reduced-motion dan hanya menyisakan fade.

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const DURATION = 0.8;
export const STAGGER = 0.08;

// Kecepatan scroll (pengatur utama). Setiap gerakan roda/trackpad meluncur selama
// `duration` detik dengan kurva ease-out yang melambat pelan di akhir.
// wheelMultiplier lebih kecil = halaman bergerak lebih pendek per putaran roda;
// duration lebih besar = luncuran lebih panjang dan lembut.
// keyStep = jarak satu tekan tombol panah; keyMaxLead = batas seberapa jauh tujuan scroll
// boleh mendahului posisi saat tombol ditahan (makin kecil, makin pelan saat ditahan).
export const SMOOTH_SCROLL = {
  duration: 1.8,
  wheelMultiplier: 0.55,
  anchorDuration: 2.2,
  keyStep: 110,
  keyMaxLead: 220,
};

// Kurva luncuran: mulai tenang lalu melambat halus sampai berhenti. Kecepatan puncaknya
// sekitar setengah kurva ease-out-expo bawaan Lenis, jadi scroll tidak terasa melesat.
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

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
