// Gerak scroll bersama untuk homepage: halus, muncul sekali, hanya transform dan opacity.
// Di bawah <MotionConfig reducedMotion="user"> framer-motion otomatis membuang
// geseran untuk pengguna prefers-reduced-motion dan hanya menyisakan fade.

export const EASE_OUT = [0.22, 1, 0.36, 1];

export const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -40px 0px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const stagger = (step = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});
